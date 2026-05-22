import type { MultipleChoiceItem } from "@/features/question-multiple/model/types";
import type { AbRatio } from "@/features/question-ab/model/types";

export type { AbRatio };

export interface FivesecQuestionData {
  title: string;
  description: string;
  imageUrl: string;
  duration: number;
  answerExample: string;
  answerType: "multiple" | "subjective";
  isMultipleAnswer: boolean;
  isOtherInputEnabled: boolean;
  isMultiSelectEnabled: boolean;
  choices: MultipleChoiceItem[];
  minSelectCount: number;
  maxSelectCount: number;
  placeholder?: string;
  ratio?: AbRatio;
}
