import { restore } from "@/shared/api/generated/payment";

interface PaymentRestoreInput {
  orderId: string;
  draftId?: number;
}

// 미결 주문 복원. grant가 Toss 검증까지 성공했다면 서버에 Payment(orderId+draftId)가 남아있어
// orderId만으로 복구된다. draftId는 grant 호출 자체가 서버에 도달하지 못했을 때만 필요한 폴백.
export async function restorePayment({ orderId, draftId }: PaymentRestoreInput): Promise<boolean> {
  const res = await restore({ orderId, draftId });
  return res.data.data === true;
}
