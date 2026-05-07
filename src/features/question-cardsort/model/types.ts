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
