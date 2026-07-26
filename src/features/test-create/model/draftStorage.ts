import { Storage } from "@apps-in-toss/web-framework";

// 임시저장한 테스트 초안의 draftId를 영구 저장한다.
// "테스트 등록" 진입 시 이 값이 있으면 새 초안을 만들지 않고 해당 초안을 이어서 작성한다.
// 결제(발행)가 완료되면 clearSavedDraftId로 소비 처리한다.
// 네이티브 브릿지가 없는 환경(브라우저/Playwright)에서 응답이 없으면 진입이 멈출 수 있어 읽기는 타임아웃으로 보호한다.

const SAVED_DRAFT_KEY = "mate.savedDraftId";
const READ_TIMEOUT_MS = 2000;

function withTimeout<T>(promise: Promise<T>, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), READ_TIMEOUT_MS)),
  ]);
}

export async function getSavedDraftId(): Promise<number | null> {
  try {
    const value = await withTimeout(Storage.getItem(SAVED_DRAFT_KEY), null);
    if (value == null) return null;
    const id = Number(value);
    return Number.isFinite(id) && id > 0 ? id : null;
  } catch {
    return null;
  }
}

export async function setSavedDraftId(draftId: number): Promise<void> {
  try {
    await Storage.setItem(SAVED_DRAFT_KEY, String(draftId));
  } catch {
    // 저장 실패해도 임시저장 자체(서버 반영)는 정상 동작한다. 다음 진입 시 이어쓰기만 생략된다.
  }
}

export async function clearSavedDraftId(): Promise<void> {
  try {
    await Storage.removeItem(SAVED_DRAFT_KEY);
  } catch {
    // noop
  }
}
