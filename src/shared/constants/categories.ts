import { adaptive } from "@toss/tds-colors";

export interface Category {
  id: string;
  label: string;
  iconName: string;
  iconColor?: string;
}

export const CATEGORIES = [
  { id: "DAILY", label: "일상", iconName: "icon-home-garden" },
  { id: "FINANCE", label: "금융", iconName: "icon-government-blue" },
  { id: "HEALTH", label: "건강", iconName: "icon-arm-muscle-skin" },
  { id: "SHOPPING", label: "쇼핑", iconName: "icon-shopping-bag-red" },
  { id: "FOOD", label: "음식", iconName: "icon-tosst-logo" },
  { id: "GAME", label: "게임", iconName: "icon-game-dark" },
  { id: "CONTENT", label: "콘텐츠", iconName: "icon-popcorn" },
  { id: "COMMUNITY", label: "커뮤니티", iconName: "icon-user-nearby-mono", iconColor: adaptive.blue500 },
  { id: "AI", label: "AI", iconName: "icon-twinkle-graident" },
  { id: "EDUCATION", label: "교육", iconName: "https://static.toss.im/2d-emojis/png/4x/u1F4DA.png" },
  { id: "TRAVEL", label: "여행", iconName: "icon-plane-blue500" },
  { id: "SOCIAL", label: "소셜", iconName: "icn-earth-line-mono", iconColor: adaptive.teal300 },
  { id: "CONVENIENCE", label: "편의", iconName: "icon-u1FA84" },
  { id: "INFORMATION", label: "정보", iconName: "icon-search-blue" },
  { id: "BUSINESS", label: "비즈니스", iconName: "https://static.toss.im/2d-emojis/png/4x/u1F4BC.png" },
  { id: "TRANSPORT", label: "교통", iconName: "icon-car-red" },
  { id: "PUBLIC_ADMIN", label: "공공·행정", iconName: "https://static.toss.im/2d-emojis/png/4x/u1F5C2.png" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export const MAX_CATEGORIES = 3;

export const CATEGORY_LABEL: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c.label])
);
