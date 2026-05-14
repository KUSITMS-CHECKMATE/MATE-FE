import { Badge, Spacing, Text } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { CardWrapper, TextAnswerItem } from "./_shared";

interface Props {
  title: string;
  answers: string[];
}

export function SubjectiveResultCard({ title, answers }: Props) {
  return (
    <CardWrapper>
      <div className="w-full bg-white flex flex-col gap-1 justify-start items-start">
        <Badge size="small" variant="weak" color="elephant">주관식</Badge>
        <Text color={adaptive.grey800} typography="t5" fontWeight="bold">{title}</Text>
      </div>
      <Spacing size={16} />
      <div className="w-full h-[155px] overflow-visible flex flex-col gap-3 justify-start items-center">
        <div className="w-full overflow-y-scroll flex flex-col gap-2 justify-start items-center" style={{ scrollbarWidth: "none" }}>
          {answers.map((text, i) => (
            <TextAnswerItem key={i} text={text} />
          ))}
        </div>
      </div>
    </CardWrapper>
  );
}
