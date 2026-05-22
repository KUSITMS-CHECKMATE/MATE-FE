import { ResultCardBase, TextAnswerScrollList } from "./_shared";

interface Props {
  title: string;
  answers: string[];
}

export function SubjectiveResultCard({ title, answers }: Props) {
  return (
    <ResultCardBase badgeLabel="주관식" title={title}>
      <TextAnswerScrollList texts={answers} />
    </ResultCardBase>
  );
}
