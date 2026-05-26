export interface DoughnutAnswerItem {
  label: string;
  count: number;
  percentage: number;
  isHighlight: boolean;
}

export type MultipleResultOption = DoughnutAnswerItem;
export type TreeResultPath = DoughnutAnswerItem;

export interface FiveSecAnswer {
  label: string;
  count: number;
  percentage: number;
  isHighlight: boolean;
}

export interface ScoreBar {
  label: string;
  height: number;
  isHighlight: boolean;
}

export interface AbOption {
  label: string;
  height: number;
  isHighlight: boolean;
}

export interface CardSortItem {
  rank: string;
  label: string;
  count: number;
  percentage: number;
  isHighlight: boolean;
}

export interface CardSortCategory {
  name: string;
  items: CardSortItem[];
}

export type QuestionResult =
  | { type: "OBJECTIVE"; title: string; imageUrl?: string; options: MultipleResultOption[] }
  | { type: "SUBJECTIVE"; title: string; answers: string[] }
  | { type: "SCALE"; title: string; average: number; scores: ScoreBar[] }
  | { type: "AB_TEST"; title: string; options: AbOption[] }
  | { type: "CARD_SORTING"; title: string; categories: CardSortCategory[] }
  | { type: "TREE_TEST"; title: string; imageUrl?: string; paths: TreeResultPath[] }
  | { type: "FIVE_SECOND"; title: string; imageUrl?: string; answers: FiveSecAnswer[] };
