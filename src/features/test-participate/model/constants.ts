import type { QuestionType } from "./types";

export const QUESTION_TYPE_LABEL: Record<QuestionType, string> = {
  SUBJECTIVE: "주관식",
  OBJECTIVE: "객관식",
  TREE_TEST: "트리 테스트",
  FIVE_SECOND: "5초 테스트",
  SCALE: "척도 질문",
  AB_TEST: "A/B 테스트",
  CARD_SORTING: "카드 소팅",
};
