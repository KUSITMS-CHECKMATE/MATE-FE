import { Badge, Spacing, Text } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { BarColumn, CardWrapper } from "./_shared";

export interface AbOption {
  label: string;
  height: number;
  isHighlight: boolean;
}

interface Props {
  title: string;
  options: AbOption[];
}

export function AbResultCard({ title, options }: Props) {
  return (
    <CardWrapper>
      <div className="w-full flex flex-col gap-1 justify-start items-start">
        <Badge size="small" variant="weak" color="elephant">A/B 테스트</Badge>
        <Text color={adaptive.grey800} typography="t5" fontWeight="bold">{title}</Text>
      </div>
      <Spacing size={16} />
      <div className="w-full flex flex-row gap-4 justify-start items-end">
        {options.map((option, i) => (
          <BarColumn key={i} height={option.height} label={option.label} isHighlight={option.isHighlight} />
        ))}
      </div>
    </CardWrapper>
  );
}
