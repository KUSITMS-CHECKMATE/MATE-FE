import type { MultipleChoiceItem } from "@/features/question-multiple/model/types";

export interface FivesecQuestionData {
  title: string;
  description: string;
  imageUrl: string;
  duration: number;
  answerExample: string;
  answerType: "multiple" | "subjective";
  isMultipleAnswer: boolean;
  isMultiSelectEnabled: boolean;
  choices: MultipleChoiceItem[];
  minSelectCount: number;
  maxSelectCount: number;
  placeholder?: string;
}
