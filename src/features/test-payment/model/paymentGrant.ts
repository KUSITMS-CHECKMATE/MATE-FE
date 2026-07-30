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
export async function grantPayment({ orderId, draftId }: PaymentGrantInput): Promise<PaymentGrantResult> {
  try {
    const res = await grant({ orderId, draftId });
    return { success: res.data.data === true, code: res.data.code, message: res.data.message };
  } catch (e) {
    if (e instanceof HTTPError) {
      try {
        const body = (await e.response.json()) as { code?: string; message?: string };
        return { success: false, code: body.code, message: `${e.response.status} ${body.message ?? ""}`.trim() };
      } catch {
        return { success: false, message: `HTTP ${e.response.status}` };
      }
    }
    return { success: false, message: e instanceof Error ? e.message : String(e) };
  }
}
