import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useToast } from "@toss/tds-mobile";
import { HTTPError } from "ky";
import { IAP } from "@apps-in-toss/web-framework";
import { updateDraft, getDraft } from "@/shared/api/generated/testDraft";
import { createPayment, executePayment } from "@/shared/api/generated/payment";
import { ROUTES } from "@/shared/constants/routes";
import type { TesterCount, RewardAmount } from "./types";
import { IAP_SKU_MAP } from "./types";

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
  const navigate = useNavigate();
  const { openToast } = useToast();

  return useMutation({
    mutationFn: async ({ draftId, testerCount, rewardAmount, responsePeriod }: PaymentSubmitInput) => {
      const closedAt = new Date(Date.now() + responsePeriod * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10);

      try {
        const draftRes = await getDraft(draftId);
        const status = draftRes.data.data?.status;
        const BLOCKED: Record<string, string> = {
          PAYMENT_CREATED: "이미 결제가 진행 중인 테스트입니다.",
          PAYMENT_FAILED: "이전 결제가 실패했습니다. 새 테스트를 만들어 주세요.",
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

      // IAP 결제 (리워드 200원이고 토스 앱 환경일 때)
      if (rewardAmount === 200 && IAP != null) {
        const sku = IAP_SKU_MAP[testerCount];
        await new Promise<void>((resolve, reject) => {
          const cleanup = IAP.createOneTimePurchaseOrder({
            options: {
              sku,
              processProductGrant: async ({ orderId: _orderId }) => {
                // TODO: 백엔드 주문 내역 API 연동 예정
                return true;
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
        return null;
      }

      let paymentId: number;
      try {
        const payRes = await createPayment({ draftId, isTestPayment: true });
        const id = payRes.data.data?.paymentId;
        if (!id) throw new Error("paymentId를 받지 못했습니다.");
        paymentId = id;
      } catch (e) {
        throw await stepError("결제 등록 실패", e);
      }

      try {
        const execRes = await executePayment(paymentId);
        const testId = execRes.data.data?.testId;
        if (!testId) throw new Error("testId를 받지 못했습니다.");
        return testId;
      } catch (e) {
        throw await stepError("결제 실행 실패", e);
      }
    },
    onSuccess: (testId) => {
      if (testId != null) {
        navigate({ to: ROUTES.TEST_DETAIL, params: { testId: String(testId) }, replace: true });
      } else {
        // IAP 결제 완료 (백엔드 연동 전 임시)
        navigate({ to: ROUTES.DISCOVERY, replace: true });
      }
    },
    onError: (error) => {
      openToast(error instanceof Error ? error.message : "결제 중 오류가 발생했어요", {
        type: "bottom",
      });
    },
  });
}
