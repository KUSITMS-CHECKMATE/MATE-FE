// IAP SDK의 onError(error: unknown)는 타입이 없어 code를 안전하게 추출해야 한다.
// 정확한 필드명이 확인되지 않아 흔히 쓰이는 두 후보(code, errorCode)를 모두 확인한다.
export function extractIapErrorCode(error: unknown): string | undefined {
  if (typeof error !== "object" || error === null) return undefined;
  for (const key of ["code", "errorCode"] as const) {
    if (key in error) {
      const value = (error as Record<string, unknown>)[key];
      if (typeof value === "string") return value;
    }
  }
  return undefined;
}

// ⚠️ 확인 필요 — userInfo에 orderId가 실제로 오는지 검증 안 됨. 없으면 usePaymentSubmit이
// processProductGrant에서 캡처해둔 마지막 orderId로 폴백한다.
export function extractIapErrorOrderId(error: unknown): string | undefined {
  if (typeof error !== "object" || error === null) return undefined;
  const userInfo = (error as Record<string, unknown>).userInfo;
  if (typeof userInfo === "object" && userInfo !== null && "orderId" in userInfo) {
    const value = (userInfo as Record<string, unknown>).orderId;
    if (typeof value === "string") return value;
  }
  if ("orderId" in error) {
    const value = (error as Record<string, unknown>).orderId;
    if (typeof value === "string") return value;
  }
  return undefined;
}

// IAP 결제 단계에서 발생한 에러를 code/orderId를 보존한 채로 감싼다
// (기존 stepError는 문자열로만 남겨 정보가 소실됨).
export class IapPaymentError extends Error {
  code?: string;
  orderId?: string;

  constructor(message: string, code?: string, orderId?: string) {
    super(message);
    this.name = "IapPaymentError";
    this.code = code;
    this.orderId = orderId;
  }
}
