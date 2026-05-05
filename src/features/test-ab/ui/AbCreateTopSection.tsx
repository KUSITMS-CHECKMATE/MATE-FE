import { TestQuestionCreateTopSection } from "@/shared/ui/TestQuestionCreateTopSection";

interface AbCreateTopSectionProps {
  questionTitle: string;
  questionDescription: string;
  onOpenQuestionEditor: () => void;
}

export function AbCreateTopSection({ questionTitle, questionDescription, onOpenQuestionEditor }: AbCreateTopSectionProps) {
  return (
    <TestQuestionCreateTopSection
      questionTitle={questionTitle}
      questionDescription={questionDescription}
      onOpenQuestionEditor={onOpenQuestionEditor}
      subtitle="A/B 테스트"
    />
  );
}
