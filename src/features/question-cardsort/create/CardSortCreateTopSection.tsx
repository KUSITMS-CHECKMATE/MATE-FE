import { TestQuestionCreateTopSection } from "@/shared/ui/TestQuestionCreateTopSection";

interface CardSortCreateTopSectionProps {
  questionTitle: string;
  questionDescription: string;
  onOpenQuestionEditor: () => void;
}

export function CardSortCreateTopSection({ questionTitle, questionDescription, onOpenQuestionEditor }: CardSortCreateTopSectionProps) {
  return (
    <TestQuestionCreateTopSection
      questionTitle={questionTitle}
      questionDescription={questionDescription}
      onOpenQuestionEditor={onOpenQuestionEditor}
      subtitle="카드 소팅"
    />
  );
}
