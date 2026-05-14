import { Badge, Spacing, Text } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { AnswerRow, CardWrapper } from "./_shared";

export interface MultipleResultOption {
  label: string;
  count: number;
  percentage: number;
  isHighlight: boolean;
}

interface Props {
  title: string;
  imageUrl?: string;
  options: MultipleResultOption[];
}

export function MultipleResultCard({ title, imageUrl, options }: Props) {
  return (
    <CardWrapper>
      <div className="w-full bg-white flex flex-col gap-1 justify-start items-start">
        <Badge size="small" variant="weak" color="elephant">객관식</Badge>
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
      <div className="w-full flex flex-col gap-1 justify-start items-center">
        {options.map((option, i) => (
          <AnswerRow
            key={i}
            iconColor={option.isHighlight ? "#5571cf" : i === 1 ? adaptive.greyOpacity400 : adaptive.greyOpacity200}
            labelColor={option.isHighlight ? "#4365cc" : adaptive.grey700}
            label={option.label}
            count={`${option.count}개 (${option.percentage}%)`}
          />
        ))}
      </div>
    </CardWrapper>
  );
}
