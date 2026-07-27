import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useDialog } from "@toss/tds-mobile";
import { HTTPError } from "ky";
import { IAP } from "@apps-in-toss/web-framework";
import { updateDraft, getDraft } from "@/shared/api/generated/testDraft";
import { grantPayment } from "./paymentGrant";
import { extractIapErrorCode, extractIapErrorOrderId, IapPaymentError } from "./iapPaymentError";
import { useIapErrorDialog } from "./useIapErrorDialog";
import type { TesterCount, RewardAmount } from "./types";
import { IAP_SKU_MAP } from "./types";

const APP_MARKET_VERIFICATION_FAILED = "APP_MARKET_VERIFICATION_FAILED";

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
  const { showIapErrorDialog, dialog } = useIapErrorDialog();
  const [refundInfo, setRefundInfo] = useState<{ orderId: string } | null>(null);
  const lastOrderIdRef = useRef<string | undefined>(undefined);

  const mutation = useMutation({
    mutationFn: async ({ draftId, testerCount, rewardAmount, responsePeriod }: PaymentSubmitInput) => {
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
      const sku = IAP_SKU_MAP[rewardAmount]?.[testerCount];
      if (sku == null || IAP == null) {
        throw new Error("결제를 진행할 수 없는 환경이거나 지원하지 않는 상품 조합입니다.");
      }

      try {
        await new Promise<void>((resolve, reject) => {
          const cleanup = IAP.createOneTimePurchaseOrder({
            options: {
              sku,
              processProductGrant: async ({ orderId }) => {
                lastOrderIdRef.current = orderId;
                try {
                  return await grantPayment({ orderId, draftId });
                } catch {
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
        const code = extractIapErrorCode(e);
        // APP_MARKET_VERIFICATION_FAILED는 processProductGrant 전에 발생해 orderId가 없는 게 정상이다
        // (SDK 공식 문서: "사용자가 앱스토어에 문의해서 환불을 요청해야해요").
        const orderId = extractIapErrorOrderId(e) ?? lastOrderIdRef.current;
        const detail = e instanceof Error ? e.message : String(e);
        throw new IapPaymentError(`[IAP 결제 실패] ${detail}`, code, orderId);
      }
    },
    onError: async (error) => {
      const code = error instanceof IapPaymentError ? error.code : undefined;

      if (code?.toUpperCase() === APP_MARKET_VERIFICATION_FAILED) {
        const orderId = error instanceof IapPaymentError ? error.orderId : undefined;
        setRefundInfo({ orderId: orderId ?? "" });
        return;
      }

      if (code && (await showIapErrorDialog(code))) return;

      await openAlert({
        title: "결제 중 문제가 발생했어요",
        description: error instanceof Error ? error.message : "잠시 후 다시 시도해주세요.",
        alertButton: "확인",
      });
    },
  });

  return { ...mutation, dialog, refundInfo };
}
