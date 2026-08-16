import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useDialog } from "@toss/tds-mobile";
import { HTTPError } from "ky";
import { IAP } from "@apps-in-toss/web-framework";
import { updateDraft, getDraft } from "@/shared/api/generated/testDraft";
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
        const draftRes = await getDraft(draftId);
        const status = draftRes.data.data?.status;
        const BLOCKED: Record<string, string> = {
          PUBLISHING: "발행 처리 중인 테스트입니다.",
          PUBLISHED: "이미 발행된 테스트입니다.",
          PUBLISH_FAILED: "발행에 실패한 테스트입니다. 새 테스트를 만들어 주세요.",
          EXPIRED: "만료된 테스트입니다.",
        };
        if (status && status !== "DRAFT") {
          throw new Error(BLOCKED[status] ?? `결제할 수 없는 상태입니다. (${status})`);
        }
      } catch (e) {
        if (e instanceof Error && !e.message.startsWith("[")) throw e;
        throw await stepError("초안 상태 조회 실패", e);
      }

      try {
        await updateDraft(draftId, { goalPpl: testerCount, reward: rewardAmount, closedAt });
      } catch (e) {
        throw await stepError("초안 업데이트 실패", e);
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
            onEvent: (event) => {
              if (event.type === "success") {
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
