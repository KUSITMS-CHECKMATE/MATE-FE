import { useEffect } from "react";

export type RegisterQuestionCommit = (commit: () => void) => void;

/**
 * 질문 편집 화면이 "완료하기" 전에도 임시저장에 반영될 수 있도록,
 * 매 렌더마다 최신 커밋 함수를 상위(TestCreateFunnel)에 등록해둔다.
 * 임시저장 버튼은 이 커밋 함수를 먼저 호출한 뒤 draft를 저장한다.
 */
export function usePendingQuestionCommit(
  registerCommit: RegisterQuestionCommit | undefined,
  commit: () => void,
) {
  useEffect(() => {
    registerCommit?.(commit);
  });
}
