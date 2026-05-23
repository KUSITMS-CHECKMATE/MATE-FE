export type AbRatio = "9:16" | "1:1" | "4:3";

export interface AbQuestionData {
  title: string;
  description: string;
  imageUrlA: string;
  imageUrlB: string;
  ratio?: AbRatio;
}
