import type { AbRatio } from "@/shared/constants/imageRatio";

export type { AbRatio };
export { RATIO_TO_CSS } from "@/shared/constants/imageRatio";

export interface AbQuestionData {
  title: string;
  description: string;
  imageUrlA: string;
  imageUrlB: string;
  ratio?: AbRatio;
}
