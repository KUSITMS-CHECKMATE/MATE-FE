import type { MultipleQuestionData } from "@/features/question-multiple/model/types";
import type { SubjectiveQuestionData } from "@/features/question-subjective/model/types";
import type { TreeQuestionData } from "@/features/question-tree/model/types";
import type { FivesecQuestionData } from "@/features/question-fivesec/model/types";
import type { ScaleQuestionData } from "@/features/question-scale/model/types";
import type { AbQuestionData } from "@/features/question-ab/model/types";
import type { CardSortQuestionData } from "@/features/question-cardsort/model/types";

export type { ScaleQuestionData, AbQuestionData, CardSortQuestionData };

export type ParticipateQuestion =
  | { id: string; type: "SUBJECTIVE"; data: SubjectiveQuestionData }
  | { id: string; type: "OBJECTIVE"; data: MultipleQuestionData }
  | { id: string; type: "TREE_TEST"; data: TreeQuestionData }
  | { id: string; type: "FIVE_SECOND"; data: FivesecQuestionData }
  | { id: string; type: "SCALE"; data: ScaleQuestionData }
  | { id: string; type: "AB_TEST"; data: AbQuestionData }
  | { id: string; type: "CARD_SORTING"; data: CardSortQuestionData };

export type QuestionType = ParticipateQuestion["type"];

export type Answer =
  | { type: "SUBJECTIVE"; text: string }
  | { type: "OBJECTIVE"; selectedIds: string[]; otherText?: string }
  | { type: "TREE_TEST"; selectedNodeId: string | null }
  | { type: "FIVE_SECOND"; selectedIds: string[]; text?: string }
  | { type: "SCALE"; value: number | null }
  | { type: "AB_TEST"; selected: "A" | "B" | null }
  | { type: "CARD_SORTING"; placements: Record<string, string> };

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
