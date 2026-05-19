import type { DoughnutAnswerItem } from "./_shared";
import { ResultCardBase, DoughnutAnswerSection } from "./_shared";

export type TreeResultPath = DoughnutAnswerItem;

interface Props {
  title: string;
  imageUrl?: string;
  paths: TreeResultPath[];
}

export function TreeResultCard({ title, imageUrl, paths }: Props) {
  return (
    <ResultCardBase badgeLabel="트리테스트" title={title} imageUrl={imageUrl}>
      <DoughnutAnswerSection items={paths} />
    </ResultCardBase>
  );
}
