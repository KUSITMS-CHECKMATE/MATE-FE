import { ResultCardBase, BarColumn } from "./_shared";

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
    <ResultCardBase badgeLabel="A/B 테스트" title={title}>
      <div className="w-full flex flex-row gap-4 justify-start items-end">
        {options.map((option, i) => (
          <BarColumn key={i} height={option.height} label={option.label} isHighlight={option.isHighlight} />
        ))}
      </div>
    </ResultCardBase>
  );
}
