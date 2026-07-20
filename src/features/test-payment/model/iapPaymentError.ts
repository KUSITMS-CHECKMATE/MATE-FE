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

// IAP 결제 단계에서 발생한 에러를 code를 보존한 채로 감싼다 (기존 stepError는 문자열로만 남겨 code가 소실됨).
export class IapPaymentError extends Error {
  code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.name = "IapPaymentError";
    this.code = code;
  }
}
