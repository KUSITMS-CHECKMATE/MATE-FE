import { adaptive } from "@toss/tds-colors";

/** 질문 단위 스텝 */
export const STEPS = [
  "name",
  "summary",
  "category",
  "service",
  "image",
  "register",
] as const;

export type Step = (typeof STEPS)[number];

/** 프로그레스 바 단계 */
export const PHASES = ["basic", "service", "image", "register"] as const;

export type Phase = (typeof PHASES)[number];

export const PHASE_LABELS: Record<Phase, string> = {
  basic: "기본 정보",
  service: "서비스 소개",
  image: "테스트 이미지",
  register: "테스트 등록",
};

/** 각 질문 step이 속하는 프로그레스 단계 */
export const STEP_PHASE: Record<Step, Phase> = {
  name: "basic",
  summary: "basic",
  category: "basic",
  service: "service",
  image: "image",
  register: "register",
};

/** 등록 화면에서 수정 가능한 단위 */
export type EditPhase = "basic" | "service" | "image";

export interface Category {
  id: string;
  label: string;
  iconName: string;
  iconColor?: string;
  iconType: "Icon" | "Image";
}

export const CATEGORIES = [
  { id: "daily", label: "일상", iconName: "icon-home-garden" },
  { id: "finance", label: "금융", iconName: "icon-government-blue" },
  { id: "health", label: "건강", iconName: "icon-arm-muscle-skin" },
  { id: "shopping", label: "쇼핑", iconName: "icon-shopping-bag-red" },
  { id: "food", label: "음식", iconName: "icon-tosst-logo" },
  { id: "game", label: "게임", iconName: "icon-game-dark" },
  { id: "content", label: "콘텐츠", iconName: "icon-popcorn" },
  {
    id: "community",
    label: "커뮤니티",
    iconName: "icon-user-nearby-mono",
    iconColor: adaptive.blue500,
  },
  { id: "ai", label: "AI", iconName: "icon-twinkle-graident" },
  {
    id: "education",
    label: "교육",
    iconName: "https://static.toss.im/2d-emojis/png/4x/u1F4DA.png",
  },
  { id: "travel", label: "여행", iconName: "icon-plane-blue500" },
  {
    id: "social",
    label: "소셜",
    iconName: "icn-earth-line-mono",
    iconColor: adaptive.teal300,
  },
  { id: "convenience", label: "편의", iconName: "icon-u1FA84" },
  { id: "information", label: "정보", iconName: "icon-search-blue" },
  {
    id: "business",
    label: "비즈니스",
    iconName: "https://static.toss.im/2d-emojis/png/4x/u1F4BC.png",
  },
  { id: "transportation", label: "교통", iconName: "icon-car-red" },
  {
    id: "public",
    label: "공공·행정",
    iconName: "https://static.toss.im/2d-emojis/png/4x/u1F5C2.png",
  },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export const MAX_CATEGORIES = 3;

export interface QuestionType {
  id: string;
  label: string;
  description: string;
  iconName: string;
}

export const QUESTION_TYPES = [
  {
    id: "multiple",
    label: "객관식",
    description: "텍스트/사진 혼합 선택형",
    iconName: "icon-check-circle",
  },
  {
    id: "subjective",
    label: "주관식",
    description: "자유 텍스트 입력",
    iconName: "icon-pencil-blue",
  },
  {
    id: "scale",
    label: "척도 질문",
    description: "리커트 척도 평가",
    iconName: "icon-graph-bar-double-short-blue",
  },
  {
    id: "ab",
    label: "A/B 테스트",
    description: "두 디자인 분류",
    iconName: "icon-ab-choice",
  },
  {
    id: "card",
    label: "카드 소팅",
    description: "카테고리 분류",
    iconName: "icon-document-blue",
  },
  {
    id: "tree",
    label: "트리 테스트",
    description: "정보 구조 탐색",
    iconName: "icon-graph-bar-flow-3-cyan",
  },
  {
    id: "fivesec",
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

export type QuestionData =
  | ({ typeId: "multiple" } & MultipleQuestionData)
  | ({ typeId: "scale" } & ScaleQuestionData)
  | ({ typeId: "ab" } & AbQuestionData)
  | ({ typeId: "tree" } & TreeQuestionData)
  | ({ typeId: "subjective" } & SubjectiveQuestionData)
  | ({ typeId: "fivesec" } & FivesecQuestionData);

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
