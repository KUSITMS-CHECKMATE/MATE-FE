import type { ClosedTest } from "../model";
import { ClosedTestCard } from "./ClosedTestCard";
import { SectionHeader } from "./SectionHeader";

const MAX_VISIBLE = 4;

interface Props {
  tests: ClosedTest[];
  onSelect: (testId: number) => void;
}

export function ClosedTestSection({ tests, onSelect }: Props) {
  if (tests.length === 0) return null;

  return (
    <section className="flex flex-col">
      <SectionHeader
        title="종료됐지만 이런 테스트도 있었어요"
        description="다양한 서비스 구경해요"
        iconSrc="https://static.toss.im/2d-icons/color/png/4x/icon-alltab-finance-grey.png"
      />
      <div className="grid grid-cols-2 gap-x-4 gap-y-6 px-6 pt-3">
        {tests.slice(0, MAX_VISIBLE).map((test) => (
          <ClosedTestCard key={test.id} test={test} onClick={() => onSelect(test.id)} />
        ))}
      </div>
    </section>
  );
}
