import type { MultipleQuestionData } from "@/features/question-multiple/model/types";
import type { SubjectiveQuestionData } from "@/features/question-subjective/model/types";
import type { TreeQuestionData } from "@/features/question-tree/model/types";
import type { FivesecQuestionData } from "@/features/question-fivesec/model/types";
import type { ScaleQuestionData } from "@/features/question-scale/model/types";
import type { AbQuestionData } from "@/features/question-ab/model/types";
import type { CardSortQuestionData } from "@/features/question-cardsort/model/types";

export type { ScaleQuestionData, AbQuestionData, CardSortQuestionData };

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
