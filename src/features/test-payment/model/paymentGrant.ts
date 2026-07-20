import { grant } from "@/shared/api/generated/payment";

interface PaymentGrantInput {
  orderId: string;
  draftId: number;
}

// Toss IAP processProductGrant 콜백에서 호출. 검증 성공 시 서버에 Payment(orderId+draftId)가
// 커밋되고 게시(publish)가 실패해도 롤백되지 않으므로, 이후 restore(orderId)만으로 복구 가능하다.
export async function grantPayment({ orderId, draftId }: PaymentGrantInput): Promise<boolean> {
  const res = await grant({ orderId, draftId });
  return res.data.data === true;
}
