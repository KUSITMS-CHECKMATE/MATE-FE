export interface ApiChoiceItem {
  id: number;
  name: string;
  imageUrl?: string;
}

export interface ApiFiveSecondOption {
  fiveSecondOptionId: number;
  content: string;
  sequence: number;
  isOtherOption: boolean;
}

export interface ApiObjectiveOption {
  objectiveOptionId: number;
  content: string;
  imageUrl?: string | null;
  sequence: number;
  isOtherOption: boolean;
}

export interface ApiCardItem {
  id: number;
  name: string;
}

export interface ApiCategoryItem {
  id: number;
  name: string;
}

export interface ApiTreeNode {
  id: number;
  name: string;
  children: ApiTreeNode[];
}

export interface ApiSubjectiveQuestion {
  questionId: number;
  sequence: number;
  type: "SUBJECTIVE";
  title: string;
  description?: string;
  imageUrl?: string;
  placeholder?: string;
  maxLength?: number | null;
}

export interface ApiObjectiveQuestion {
  questionId: number;
  sequence: number;
  type: "OBJECTIVE";
  title: string;
  description?: string;
  options: ApiObjectiveOption[];
  isMultiSelectEnabled: boolean;
  isOtherInputEnabled: boolean;
  minSelectCount: number;
  maxSelectCount: number;
}

export interface ApiScaleQuestion {
  questionId: number;
  scaleId: number;
  sequence: number;
  type: "SCALE";
  title: string;
  description?: string;
  range: number;
  minLabel: string;
  maxLabel: string;
  imageUrl?: string;
}

export interface ApiAbTestQuestion {
  questionId: number;
  sequence: number;
  type: "AB_TEST";
  title: string;
  description?: string;
  aImageUrl?: string;
  bImageUrl?: string;
  imageUrlA?: string;
  imageUrlB?: string;
  imageRatio?: string;
}

export interface ApiCardSortingQuestion {
  questionId: number;
  sequence: number;
  type: "CARD_SORTING";
  title: string;
  description?: string;
  cards: ApiCardItem[];
  categories: ApiCategoryItem[];
  requireAllPlaced: boolean;
}

export interface ApiTreeTestQuestion {
  questionId: number;
  sequence: number;
  type: "TREE_TEST";
  title: string;
  description?: string;
  nodes: ApiTreeNode[];
}

export interface ApiFiveSecondQuestion {
  questionId: number;
  sequence: number;
  type: "FIVE_SECOND";
  title: string;
  description?: string;
  imageUrl?: string;
  answerType?: "multiple" | "subjective";
  isObjective?: boolean;
  isMultipleAnswer?: boolean;
  isOther?: boolean;
  isOtherInputEnabled?: boolean;
  isDuplicate?: boolean;
  isMultiSelectEnabled?: boolean;
  imageRatio?: string;
  options?: ApiFiveSecondOption[];
  choices?: ApiChoiceItem[];
  minSelect?: number;
  maxSelect?: number;
  minSelectCount?: number;
  maxSelectCount?: number;
  placeholder?: string;
}

export type ApiQuestion =
  | ApiSubjectiveQuestion
  | ApiObjectiveQuestion
  | ApiScaleQuestion
  | ApiAbTestQuestion
  | ApiCardSortingQuestion
  | ApiTreeTestQuestion
  | ApiFiveSecondQuestion;

export interface ApiQuestionsDetailData {
  testId: number;
  questions: ApiQuestion[];
}

export interface ApiResponse<T> {
  success?: boolean;
  code?: string;
  message?: string;
  data?: T;
}
