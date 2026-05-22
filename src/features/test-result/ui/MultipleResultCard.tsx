import type { MultipleResultOption } from "../model/types";
import { ResultCardBase, DoughnutAnswerSection } from "./_shared";

export type { MultipleResultOption };

interface Props {
  title: string;
  imageUrl?: string;
  options: MultipleResultOption[];
}

export function MultipleResultCard({ title, imageUrl, options }: Props) {
  return (
    <ResultCardBase badgeLabel="객관식" title={title} imageUrl={imageUrl}>
      <DoughnutAnswerSection items={options} />
    </ResultCardBase>
  );
}
