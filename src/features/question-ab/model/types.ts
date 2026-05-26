export type AbRatio = "9:16" | "1:1" | "4:3";

export const RATIO_TO_CSS: Record<AbRatio, string> = {
  "9:16": "9/16",
  "1:1": "1/1",
  "4:3": "4/3",
};

export interface AbQuestionData {
  title: string;
  description: string;
  imageUrlA: string;
  imageUrlB: string;
  ratio?: AbRatio;
}
