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
  | { type: "multiple"; title: string; imageUrl?: string; options: MultipleResultOption[] }
  | { type: "subjective"; title: string; answers: string[] }
  | { type: "scale"; title: string; average: number; scores: ScoreBar[] }
  | { type: "ab"; title: string; options: AbOption[] }
  | { type: "cardSort"; title: string; categories: CardSortCategory[] }
  | { type: "tree"; title: string; imageUrl?: string; paths: TreeResultPath[] }
  | { type: "fiveSec"; title: string; imageUrl?: string; answers: FiveSecAnswer[] };
