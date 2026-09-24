import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useDialog } from "@toss/tds-mobile";
import { HTTPError } from "ky";
import { IAP } from "@apps-in-toss/web-framework";
import { updateDraft, publishCheck } from "@/shared/api/generated/testDraft";
import { grantPayment } from "./paymentGrant";
import { extractIapErrorCode, IapPaymentError } from "./iapPaymentError";
import { useIapErrorDialog } from "./useIapErrorDialog";
import { useIapSkuMap } from "./useIapSkuMap";
import type { TesterCount, RewardAmount } from "./types";

const APP_MARKET_VERIFICATION_FAILED = "APP_MARKET_VERIFICATION_FAILED";
const TOSS_SERVER_VERIFICATION_FAILED = "TOSS_SERVER_VERIFICATION_FAILED";

async function stepError(label: string, e: unknown): Promise<Error> {
  let detail = e instanceof Error ? e.message : String(e);
  if (e instanceof HTTPError) {
    try {
      const body = await e.response.json() as { code?: string; message?: string };
      detail = `${e.response.status} ${body.code ?? ""} ${body.message ?? ""}`.trim();
    } catch { /* ignore */ }
  }
  return new Error(`[${label}] ${detail}`);
}

interface PaymentSubmitInput {
  draftId: number;
  testerCount: TesterCount;
  rewardAmount: RewardAmount;
  responsePeriod: number;
}

export function usePaymentSubmit() {
  const { openAlert } = useDialog();
  const { showIapErrorDialog } = useIapErrorDialog();
  const skuMap = useIapSkuMap();
  const [appMarketVerificationFailed, setAppMarketVerificationFailed] = useState(false);
  const [serverVerificationFailed, setServerVerificationFailed] = useState(false);
  // APP_MARKET_VERIFICATION_FAILED / TOSS_SERVER_VERIFICATION_FAILED로 인한 실패 횟수.
  // 4번 이상 쌓이면 재시도 대신 문의하기로만 유도한다 (PaymentGiveUpStep).
  const [verificationFailureCount, setVerificationFailureCount] = useState(0);

  const mutation = useMutation({
    mutationFn: async ({ draftId, testerCount, rewardAmount, responsePeriod }: PaymentSubmitInput) => {
      let orderId: string | undefined;
      const closedAt = new Date(Date.now() + responsePeriod * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10);

      try {
        await updateDraft(draftId, { goalPpl: testerCount, reward: rewardAmount, closedAt });
      } catch (e) {
        throw await stepError("초안 업데이트 실패", e);
      }

      // Toss 인앱결제 실행 직전 필수 사전 검증. 여기서 걸러야 할 걸 건너뛰면, 결제(과금) 자체는
      // 성공한 뒤 grant(발행) 단계에서야 실패해 processProductGrant가 false를 반환하고
      // 토스가 환불 페이지로 보내버린다 — 반드시 결제 전에 호출해야 한다.
      // https://developers-apps-in-toss.toss.im/documentation/common/monetization/iap/in-app-purchase
      try {
        await publishCheck(draftId);
      } catch (e) {
        throw await stepError("테스트 초안 검증 실패", e);
      }

      // IAP 결제 (mock 결제는 사용하지 않음 — 리워드/테스터 수 조합 상품이 등록돼 있고 토스 앱 환경이어야 함)
      const sku = skuMap[rewardAmount]?.[testerCount];
      if (sku == null || IAP == null) {
        throw new Error("결제를 진행할 수 없는 환경이거나 지원하지 않는 상품 조합입니다.");
      }

      // SDK의 onError는 자기 나름의 범용 코드(예: PRODUCT_NOT_GRANTED_BY_PARTNER)만 돌려주기 때문에,
      // 우리 서버가 실제로 준 사유(code/message)는 processProductGrant 콜백 안에서 미리 잡아둬야
      // 바깥 catch에서 쓸 수 있다.
      let grantFailureReason: { code?: string; message?: string } | undefined;

      try {
        await new Promise<void>((resolve, reject) => {
          const cleanup = IAP.createOneTimePurchaseOrder({
            options: {
              sku,
              processProductGrant: async ({ orderId: grantedOrderId }) => {
                orderId = grantedOrderId;
                try {
                  const result = await grantPayment({ orderId: grantedOrderId, draftId });
                  if (!result.success) grantFailureReason = { code: result.code, message: result.message };
                  return result.success;
                } catch (e) {
                  grantFailureReason = { message: e instanceof Error ? e.message : String(e) };
                  return false;
                }
              },
            },
            onEvent: async (event) => {
              // processProductGrant가 true를 반환해도 토스 쪽 주문 상태는 PAYMENT_COMPLETED(결제
              // 완료, 지급 미완료)에 머문다 — completeProductGrant를 명시적으로 호출해야 PURCHASED로
              // 전환된다. 이걸 안 부르면 네이티브 쪽이 그 신호를 기다리다 30초 후 타임아웃돼 환불
              // 페이지로 이동하는 것까지 실제로 재현됐다 (콘솔 상태 실측 + 무한 버퍼링 재현).
              // https://developers-apps-in-toss.toss.im/documentation/common/monetization/iap/in-app-purchase#completeproductgrant
              if (event.type === "success") {
                if (orderId) {
                  try {
                    // 실기기에서 completeProductGrant 호출이 에러도 없이 그냥 응답을 안 주고
                    // 멈추는 경우가 확인됐다(원인 불명 — 네이티브 브릿지 쪽으로 추정). 이걸 그냥
                    // await하면 결제 성공 화면이 무한 버퍼링하다 SDK의 30초 예산을 넘겨 토스가
                    // 환불 페이지로 보내버린다. 지급 자체(processProductGrant)는 이미 끝난 뒤라
                    // completeProductGrant는 "토스 쪽 표시 상태 전환"일 뿐이므로, 타임아웃 나면
                    // 포기하고 흐름을 계속 진행한다.
                    await Promise.race([
                      IAP.completeProductGrant({ params: { orderId } }),
                      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 5000)),
                    ]);
                  } catch (e) {
                    console.error("상품 지급 완료 처리 실패", orderId, e);
                  }
                }
                cleanup();
                resolve();
              }
            },
            onError: (error) => {
              cleanup();
              reject(error);
            },
          });
        });
      } catch (e) {
        // 서버가 준 사유가 있으면 그걸 우선한다 — SDK 코드는 "지급 실패"라는 사실만 알려줄 뿐,
        // 왜 실패했는지는 서버 응답에만 있다.
        const code = grantFailureReason?.code ?? extractIapErrorCode(e);
        const detail = grantFailureReason?.message ?? (e instanceof Error ? e.message : String(e));
        throw new IapPaymentError(`[IAP 결제 실패] ${detail}`, code);
      }

      return { orderId };
    },
    onError: async (error) => {
      const code = error instanceof IapPaymentError ? error.code : undefined;

      if (code?.toUpperCase() === APP_MARKET_VERIFICATION_FAILED) {
        setAppMarketVerificationFailed(true);
        setVerificationFailureCount((count) => count + 1);
        return;
      }

      if (code?.toUpperCase() === TOSS_SERVER_VERIFICATION_FAILED) {
        setServerVerificationFailed(true);
        setVerificationFailureCount((count) => count + 1);
        return;
      }

      if (code && (await showIapErrorDialog(code))) return;

      await openAlert({
        title: "결제 중 문제가 발생했어요",
        description: error instanceof Error ? error.message : "잠시 후 다시 시도해주세요.",
        alertButton: "확인",
      });
    },
    onSuccess: () => {
      setVerificationFailureCount(0);
    },
  });

  return { ...mutation, appMarketVerificationFailed, serverVerificationFailed, verificationFailureCount };
}
