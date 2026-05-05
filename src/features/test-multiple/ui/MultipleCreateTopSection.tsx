import { TestQuestionCreateTopSection } from "@/shared/ui/TestQuestionCreateTopSection";

interface MultipleCreateTopSectionProps {
  questionTitle: string;
  questionDescription: string;
  onOpenQuestionEditor: () => void;
}

export function MultipleCreateTopSection({
  questionTitle,
  questionDescription,
  onOpenQuestionEditor,
}: MultipleCreateTopSectionProps) {
  return (
    <TestQuestionCreateTopSection
      questionTitle={questionTitle}
      questionDescription={questionDescription}
      onOpenQuestionEditor={onOpenQuestionEditor}
      subtitle="객관식"
    />
  );
}
