import type { QuestionType } from "./types";

/**
 * QuestionType → 사용자에게 노출되는 한글 카테고리 레이블 매핑.
 *
 * 각 질문 유형별 UI에서 카테고리 배지 등을 표시할 때 공통으로 사용합니다.
 * UI 컴포넌트마다 중복 정의하지 말고 이 상수를 import 하세요.
 *
 * @example
 * import { QUESTION_TYPE_LABEL } from "../model";
 * const label = QUESTION_TYPE_LABEL[question.type]; // "주관식"
 */
export const QUESTION_TYPE_LABEL: Record<QuestionType, string> = {
  subjective: "주관식",
  multiple: "객관식",
  tree: "트리 선택",
  fivesec: "5초 테스트",
  scale: "척도",
  ab: "A/B 테스트",
  cardsort: "카드 분류",
};
