import { CATEGORIES, MAX_CATEGORIES } from "@/shared/constants/categories";
export type { Category, CategoryId } from "@/shared/constants/categories";
export { CATEGORIES, MAX_CATEGORIES };

/** 퍼널 단위 스텝 */
export const STEPS = [
  "basic",
  "service",
  "image",
  "register",
] as const;

export type Step = (typeof STEPS)[number];

/** 기본 정보 스텝 내부 서브스텝 */
export const BASIC_SUB_STEPS = ["name", "summary", "category"] as const;
export type BasicSubStep = (typeof BASIC_SUB_STEPS)[number];

/** 프로그레스 바 단계 */
export const PHASES = ["basic", "service", "image", "register"] as const;

export type Phase = (typeof PHASES)[number];

export const PHASE_LABELS: Record<Phase, string> = {
  basic: "기본 정보",
  service: "서비스 소개",
  image: "테스트 이미지",
  register: "테스트 등록",
};

/** 각 스텝이 속하는 프로그레스 단계 */
export const STEP_PHASE: Record<Step, Phase> = {
  basic: "basic",
  service: "service",
  image: "image",
  register: "register",
};

/** 등록 화면에서 수정 가능한 단위 */
export type EditPhase = "basic" | "service" | "image";


export interface QuestionType {
  id: string;
  label: string;
  description: string;
  iconName: string;
}

export const QUESTION_TYPES = [
  {
    id: "OBJECTIVE",
    label: "객관식",
    description: "텍스트/사진 혼합 선택형",
    iconName: "icon-check-circle",
  },
  {
    id: "SUBJECTIVE",
    label: "주관식",
    description: "자유 텍스트 입력",
    iconName: "icon-pencil-blue",
  },
  {
    id: "SCALE",
    label: "척도 질문",
    description: "리커트 척도 평가",
    iconName: "icon-graph-bar-double-short-blue",
  },
  {
    id: "AB_TEST",
    label: "A/B 테스트",
    description: "두 디자인 분류",
    iconName: "icon-ab-choice",
  },
  {
    id: "CARD_SORTING",
    label: "카드 소팅",
    description: "카테고리 분류",
    iconName: "icon-document-blue",
  },
  {
    id: "TREE_TEST",
    label: "트리 테스트",
    description: "정보 구조 탐색",
    iconName: "icon-graph-bar-flow-3-cyan",
  },
  {
    id: "FIVE_SECOND",
    label: "5초 테스트",
    description: "짧은 노출 후 기억",
    iconName: "icon-clock-10-hour",
  },
] as const satisfies readonly QuestionType[];

export type QuestionTypeId = (typeof QUESTION_TYPES)[number]["id"];

import type { MultipleQuestionData } from "@/features/question-multiple/model/types";
import type { ScaleQuestionData } from "@/features/question-scale/model/types";
import type { AbQuestionData } from "@/features/question-ab/model/types";
import type { TreeQuestionData } from "@/features/question-tree/model/types";
import type { SubjectiveQuestionData } from "@/features/question-subjective/model/types";
import type { FivesecQuestionData } from "@/features/question-fivesec/model/types";
import type { CardSortQuestionData } from "@/features/question-cardsort/model/types";

export type QuestionData =
  | ({ typeId: "OBJECTIVE" } & MultipleQuestionData)
  | ({ typeId: "SCALE" } & ScaleQuestionData)
  | ({ typeId: "AB_TEST" } & AbQuestionData)
  | ({ typeId: "TREE_TEST" } & TreeQuestionData)
  | ({ typeId: "SUBJECTIVE" } & SubjectiveQuestionData)
  | ({ typeId: "FIVE_SECOND" } & FivesecQuestionData)
  | ({ typeId: "CARD_SORTING" } & CardSortQuestionData);

export interface PendingQuestion {
  id: string;
  typeId: QuestionTypeId;
  data?: QuestionData;
}

export interface TestCreateFormData {
  name: string;
  summary: string;
  description: string;
  serviceName: string;
  categories: CategoryId[];
  images: string[];
}
