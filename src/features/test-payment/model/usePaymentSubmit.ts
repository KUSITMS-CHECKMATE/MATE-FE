import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useToast } from "@toss/tds-mobile";
import { updateDraft } from "@/shared/api/generated/testDraft";
import { createPayment, executePayment } from "@/shared/api/generated/payment";
import { ROUTES } from "@/shared/constants/routes";
import type { TesterCount, RewardAmount } from "./types";

interface PaymentSubmitInput {
  draftId: number;
  testerCount: TesterCount;
  rewardAmount: RewardAmount;
}

export function usePaymentSubmit() {
  const navigate = useNavigate();
  const { openToast } = useToast();

  return useMutation({
    mutationFn: async ({ draftId, testerCount, rewardAmount }: PaymentSubmitInput) => {
      const closedAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10);
      await updateDraft(draftId, { goalPpl: testerCount, reward: rewardAmount, closedAt });

      const payRes = await createPayment({ draftId, isTestPayment: true });
      const paymentId = payRes.data.data?.paymentId;
      if (!paymentId) throw new Error("결제 등록 실패: paymentId를 받지 못했습니다.");

      const execRes = await executePayment(paymentId);
      const testId = execRes.data.data?.testId;
      if (!testId) throw new Error("결제 실행 실패: testId를 받지 못했습니다.");

      return testId;
    },
    onSuccess: (testId) => {
      navigate({ to: ROUTES.TEST_DETAIL, params: { testId: String(testId) } });
    },
    onError: (error) => {
      openToast(error instanceof Error ? error.message : "결제 중 오류가 발생했어요", {
        type: "bottom",
      });
    },
  });
}
