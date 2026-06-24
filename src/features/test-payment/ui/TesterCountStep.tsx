import { adaptive } from "@toss/tds-colors";
import { Checkbox, CTAButton, FixedBottomCTA, ListRow, Top } from "@toss/tds-mobile";
import { TESTER_COUNT_OPTIONS, type TesterCount } from "../model/types";

interface Props {
  draft: TesterCount | null;
  onSelect: (count: TesterCount) => void;
  onConfirm: () => void;
  onClose: () => void;
}

export function TesterCountStep({ draft, onSelect, onConfirm, onClose }: Props) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Top
        title={
          <Top.TitleParagraph size={22} color={adaptive.grey900}>
            몇 명에게 응답받을까요?
          </Top.TitleParagraph>
        }
      />
      {TESTER_COUNT_OPTIONS.map((count) => (
        <ListRow
          key={count}
          role="checkbox"
          aria-checked={draft === count}
          contents={
            <ListRow.Texts
              type="1RowTypeA"
              top={`${count}명`}
              topProps={{ color: adaptive.grey700 }}
            />
          }
          right={<Checkbox.Circle size={24} checked={draft === count} />}
          verticalPadding="large"
          onClick={() => onSelect(count)}
        />
      ))}
      <FixedBottomCTA.Double
        leftButton={
          <CTAButton color="dark" variant="weak" onClick={onClose}>
            닫기
          </CTAButton>
        }
        rightButton={
          <CTAButton disabled={draft === null} onClick={onConfirm}>
            확인하기
          </CTAButton>
        }
      />
    </div>
  );
}
