import { Storage } from "@apps-in-toss/web-framework";

// 온보딩 플래그: "이 사용자가 이전에 로그인한 적이 있는가"만 저장한다(토큰·개인정보 아님).
// 부팅 시 이 값이 true일 때만 appLogin으로 조용히 재로그인을 시도한다.
// - 재방문(연결됨): appLogin 무음 성공 → 인트로 건너뜀
// - 연결 해제됨: appLogin이 약관 화면을 다시 띄움(토스 QA 요구사항)
// 네이티브 브릿지가 없는 환경(브라우저/Playwright)에서 응답이 없으면 부팅이 멈출 수 있어
// 읽기는 타임아웃으로 보호한다.

const ONBOARDED_KEY = "mate.onboarded";
const READ_TIMEOUT_MS = 2000;

function withTimeout<T>(promise: Promise<T>, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), READ_TIMEOUT_MS)),
  ]);
}

export async function isOnboarded(): Promise<boolean> {
  try {
    const value = await withTimeout(Storage.getItem(ONBOARDED_KEY), null);
    return value === "true";
  } catch {
    return false;
  }
}

export async function markOnboarded(): Promise<void> {
  try {
    await Storage.setItem(ONBOARDED_KEY, "true");
  } catch {
    // 저장 실패해도 로그인 자체는 정상 동작한다(다음 부팅 자동 로그인만 생략됨).
  }
}

export async function clearOnboarded(): Promise<void> {
  try {
    await Storage.removeItem(ONBOARDED_KEY);
  } catch {
    // noop
  }
}
