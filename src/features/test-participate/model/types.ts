import type { MultipleQuestionData } from "@/features/question-multiple/model/types";
import type { SubjectiveQuestionData } from "@/features/question-subjective/model/types";
import type { TreeQuestionData } from "@/features/question-tree/model/types";
import type { FivesecQuestionData } from "@/features/question-fivesec/model/types";

export interface ScaleQuestionData {
  title: string;
  description: string;
  min: number;
  max: number;
  minLabel?: string;
  maxLabel?: string;
}

export interface AbQuestionData {
  title: string;
  description: string;
  optionA: { label: string; imageUrl?: string };
  optionB: { label: string; imageUrl?: string };
}

export interface CardSortCard {
  id: string;
  label: string;
}

export interface CardSortCategory {
  id: string;
  label: string;
}

export interface CardSortQuestionData {
  title: string;
  description: string;
  cards: CardSortCard[];
  categories: CardSortCategory[];
  requireAllPlaced: boolean;
}

export type ParticipateQuestion =
  | { id: string; type: "subjective"; data: SubjectiveQuestionData }
  | { id: string; type: "multiple"; data: MultipleQuestionData }
  | { id: string; type: "tree"; data: TreeQuestionData }
  | { id: string; type: "fivesec"; data: FivesecQuestionData }
  | { id: string; type: "scale"; data: ScaleQuestionData }
  | { id: string; type: "ab"; data: AbQuestionData }
  | { id: string; type: "cardsort"; data: CardSortQuestionData };

export type QuestionType = ParticipateQuestion["type"];

export type Answer =
  | { type: "subjective"; text: string }
  | { type: "multiple"; selectedIds: string[]; otherText?: string }
  | { type: "tree"; selectedNodeId: string | null }
  | { type: "fivesec"; selectedIds: string[] }
  | { type: "scale"; value: number | null }
  | { type: "ab"; selected: "A" | "B" | null }
  | { type: "cardsort"; placements: Record<string, string> };

export type AnswerOf<T extends QuestionType> = Extract<Answer, { type: T }>;

export interface ParticipateTest {
  id: number;
  title: string;
  questions: ParticipateQuestion[];
}

export interface QuestionAnswerProps<T extends QuestionType> {
  question: Extract<ParticipateQuestion, { type: T }>;
  answer: AnswerOf<T> | undefined;
  onChange: (answer: AnswerOf<T>) => void;
}
