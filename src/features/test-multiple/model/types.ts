export interface MultipleChoiceItem {
  id: string;
  name: string;
  imageUrl: string;
}

export interface MultipleQuestionData {
  title: string;
  description: string;
  choices: MultipleChoiceItem[];
  isMultiSelectEnabled: boolean;
  isOtherInputEnabled: boolean;
  minSelectCount: number;
  maxSelectCount: number;
}
