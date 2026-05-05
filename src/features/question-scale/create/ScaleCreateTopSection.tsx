import { TestQuestionCreateTopSection } from "@/shared/ui/TestQuestionCreateTopSection";

interface ScaleCreateTopSectionProps {
  questionTitle: string;
  questionDescription: string;
  onOpenQuestionEditor: () => void;
}

export function ScaleCreateTopSection({
  questionTitle,
  questionDescription,
  onOpenQuestionEditor,
}: ScaleCreateTopSectionProps) {
  return (
    <TestQuestionCreateTopSection
      questionTitle={questionTitle}
      questionDescription={questionDescription}
      onOpenQuestionEditor={onOpenQuestionEditor}
      subtitle="척도"
    />
  );
}
