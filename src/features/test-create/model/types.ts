import { adaptive } from "@toss/tds-colors";

/** 질문 단위 스텝 */
export const STEPS = ["name", "summary", "category", "service", "image", "register"] as const;

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
  { id: "community", label: "커뮤니티", iconName: "icon-user-nearby-mono", iconColor: adaptive.blue500 },
  { id: "ai", label: "AI", iconName: "icon-twinkle-graident" },
  { id: "education", label: "교육", iconName: "https://static.toss.im/2d-emojis/png/4x/u1F4DA.png" },
  { id: "travel", label: "여행", iconName: "icon-plane-blue500" },
  { id: "social", label: "소셜", iconName: "icn-earth-line-mono", iconColor: adaptive.teal300 },
  { id: "convenience", label: "편의", iconName: "icon-u1FA84" },
  { id: "information", label: "정보", iconName: "icon-search-blue" },
  { id: "business", label: "비즈니스", iconName: "https://static.toss.im/2d-emojis/png/4x/u1F4BC.png" },
  { id: "transportation", label: "교통", iconName: "icon-car-red" },
  { id: "public", label: "공공·행정", iconName: "https://static.toss.im/2d-emojis/png/4x/u1F5C2.png" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export const MAX_CATEGORIES = 3;

export interface TestCreateFormData {
  name: string;
  summary: string;
  description: string;
  serviceName: string;
  categories: CategoryId[];
  imageFile: File | null;
}
