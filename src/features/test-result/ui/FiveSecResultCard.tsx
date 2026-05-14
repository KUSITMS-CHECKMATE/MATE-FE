import { Badge, Spacing, Text } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { AnswerRow, CardWrapper, TextAnswerItem } from "./_shared";

export interface FiveSecAnswer {
  label: string;
  count: number;
  percentage: number;
  isHighlight: boolean;
}

interface Props {
  title: string;
  imageUrl?: string;
  answers: FiveSecAnswer[];
}

export function FiveSecResultCard({ title, imageUrl, answers }: Props) {
  const isTextType = !imageUrl;

  return (
    <CardWrapper>
      <div className="w-full flex flex-col gap-1 justify-start items-start">
        <Badge size="small" variant="weak" color="elephant">5초 테스트</Badge>
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
      {isTextType ? (
        <div className="w-full h-[155px] overflow-visible flex flex-col gap-3 justify-start items-center">
          <div className="w-full overflow-y-scroll flex flex-col gap-2 justify-start items-center" style={{ scrollbarWidth: "none" }}>
            {answers.map((answer, i) => (
              <TextAnswerItem key={i} text={answer.label} />
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col gap-1 items-center">
          {answers.map((answer, i) => (
            <AnswerRow
              key={i}
              iconColor={answer.isHighlight ? "#5571cf" : i === 1 ? adaptive.greyOpacity400 : adaptive.greyOpacity200}
              labelColor={answer.isHighlight ? "#4365cc" : adaptive.grey700}
              label={answer.label}
              count={`${answer.count}개 (${answer.percentage}%)`}
            />
          ))}
        </div>
      )}
    </CardWrapper>
  );
}
