import { Badge, Spacing, Text } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { AnswerRow, CardWrapper } from "./_shared";

export interface TreeResultPath {
  label: string;
  count: number;
  percentage: number;
  isHighlight: boolean;
}

interface Props {
  title: string;
  imageUrl?: string;
  paths: TreeResultPath[];
}

export function TreeResultCard({ title, imageUrl, paths }: Props) {
  return (
    <CardWrapper>
      <div className="w-full flex flex-col gap-1 justify-start items-start">
        <Badge size="small" variant="weak" color="elephant">트리테스트</Badge>
        <Text color={adaptive.grey800} typography="t5" fontWeight="bold">{title}</Text>
      </div>
      <Spacing size={16} />
      {imageUrl && (
        <>
          <div className="w-full h-[175px]">
            <img src={imageUrl} alt="" className="w-full h-full object-cover" />
          </div>
          <Spacing size={16} />
        </>
      )}
      <div className="w-full flex flex-col gap-1 items-center">
        {paths.map((path, i) => (
          <AnswerRow
            key={i}
            iconColor={path.isHighlight ? "#5571cf" : i === 1 ? adaptive.greyOpacity400 : adaptive.greyOpacity200}
            labelColor={path.isHighlight ? "#4365cc" : adaptive.grey700}
            label={path.label}
            count={`${path.count}개 (${path.percentage}%)`}
          />
        ))}
      </div>
    </CardWrapper>
  );
}
