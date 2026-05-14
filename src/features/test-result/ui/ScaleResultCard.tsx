import { Badge, Spacing, Text } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { BarColumn, CardWrapper } from "./_shared";

export interface ScoreBar {
  label: string;
  height: number;
  isHighlight: boolean;
}

interface Props {
  title: string;
  average: number;
  scores: ScoreBar[];
}

export function ScaleResultCard({ title, average, scores }: Props) {
  return (
    <CardWrapper>
      <div className="w-full flex flex-col gap-1 justify-start items-start">
        <Badge size="small" variant="weak" color="elephant">척도</Badge>
        <Text color={adaptive.grey800} typography="t5" fontWeight="bold">{title}</Text>
        <Text color={adaptive.grey500} typography="t7" fontWeight="semibold">평균 {average}점</Text>
      </div>
      <Spacing size={16} />
      <div className="w-full flex flex-row gap-2 justify-start items-end">
        {scores.map((score, i) => (
          <BarColumn key={i} height={score.height} label={score.label} isHighlight={score.isHighlight} />
        ))}
      </div>
    </CardWrapper>
  );
}
