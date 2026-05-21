import type { ScoreBar } from "../model/types";
import { ResultCardBase, BarColumn } from "./_shared";

export type { ScoreBar };

interface Props {
  title: string;
  average: number;
  scores: ScoreBar[];
}

export function ScaleResultCard({ title, average, scores }: Props) {
  return (
    <ResultCardBase badgeLabel="척도" title={title} subtitle={`평균 ${average}점`}>
      <div className="w-full flex flex-row gap-2 justify-start items-end">
        {scores.map((score, i) => (
          <BarColumn key={i} height={score.height} label={score.label} isHighlight={score.isHighlight} />
        ))}
      </div>
    </ResultCardBase>
  );
}
