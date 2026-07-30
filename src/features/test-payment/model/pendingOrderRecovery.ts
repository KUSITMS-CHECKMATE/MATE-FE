import { IAP } from "@apps-in-toss/web-framework";
import { restorePayment } from "./paymentRestore";

let hasChecked = false;

// 로그인 완료 직후 1회 호출. 지급 실패로 남아있던 미결 주문을 찾아 복원을 재시도한다.
// (TOSS_SERVER_VERIFICATION_FAILED / PRODUCT_NOT_GRANTED_BY_PARTNER로 실패했던 건들)
// 성공 시 사용자에게 보여줄 UI는 디자인 확정 전이라 아직 연결하지 않았다.
export async function recoverPendingOrders() {
  if (hasChecked || IAP == null) return;
  hasChecked = true;

  const pending = await IAP.getPendingOrders?.();
  if (!pending?.orders.length) return;

  for (const order of pending.orders) {
    try {
      const restored = await restorePayment({ orderId: order.orderId });
      if (restored) {
        await IAP.completeProductGrant?.({ params: { orderId: order.orderId } });
        // TODO: 복원 성공 안내(전역 오버레이) — 디자인 확정 후 연결
      }
    } catch (e) {
      console.error("미결 주문 복원 실패", order.orderId, e);
    }
  }
}
