import { HTTPError } from "ky";
import { grant } from "@/shared/api/generated/payment";

interface PaymentGrantInput {
  orderId: string;
  draftId: number;
}

interface PaymentGrantResult {
  success: boolean;
  // 실패 시 서버가 내려주는 사유. ApiResponseBoolean.code/message를 그대로 보존한다
  // (기존엔 data만 보고 true/false로 뭉개서, 지급이 왜 실패했는지 화면 어디서도 알 수 없었다).
  code?: string;
  message?: string;
}

// Toss IAP processProductGrant 콜백에서 호출. 검증 성공 시 서버에 Payment(orderId+draftId)가
// 커밋되고 게시(publish)가 실패해도 롤백되지 않으므로, 이후 restore(orderId)만으로 복구 가능하다.
//
// grant는 "지급 실패"를 두 가지 다른 방식으로 표현한다: 200 응답에 data:false(+code/message),
// 또는 400 등 에러 상태 코드. 후자는 ky가 HTTPError로 던지기 때문에, 응답 본문의 code/message를
// 직접 파싱하지 않으면 "Request failed with status code 400" 같은 의미 없는 메시지만 남는다.

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// PAYMENT_013(409)은 "토스 쪽 결제 상태가 아직 완전히 반영되지 않았다"는 일시적 신호일 뿐 실패가
// 아니다 — API 문서에도 "잠시 후 재시도하면 성공할 수 있다"고 명시돼 있다. 재시도 없이 바로
// false를 반환하면 processProductGrant가 실패로 처리돼 토스가 환불 페이지로 보내버리는데, 실제
// 주문은 미결(pending)로 남아 다음 로그인 시 pendingOrderRecovery가 뒤늦게 복구해버려서 "결제는
// 성공했는데 환불 페이지가 뜨고, 나중에 보면 정상 발행돼 있는" 것처럼 보이는 증상으로 이어진다.
const PAYMENT_IN_PROGRESS_RETRY_DELAYS_MS = [1500, 3000];

export async function grantPayment({ orderId, draftId }: PaymentGrantInput): Promise<PaymentGrantResult> {
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await grant({ orderId, draftId });
      return { success: res.data.success === true, code: res.data.code, message: res.data.message };
    } catch (e) {
      if (e instanceof HTTPError) {
        let body: { code?: string; message?: string } = {};
        try {
          body = (await e.response.json()) as { code?: string; message?: string };
        } catch { /* ignore */ }

        if (
          e.response.status === 409 &&
          body.code === "PAYMENT_013" &&
          attempt < PAYMENT_IN_PROGRESS_RETRY_DELAYS_MS.length
        ) {
          await sleep(PAYMENT_IN_PROGRESS_RETRY_DELAYS_MS[attempt]);
          continue;
        }
        return { success: false, code: body.code, message: `${e.response.status} ${body.message ?? ""}`.trim() };
      }
      return { success: false, message: e instanceof Error ? e.message : String(e) };
    }
  }
}
