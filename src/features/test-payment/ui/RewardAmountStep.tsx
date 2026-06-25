import { adaptive } from "@toss/tds-colors";
import { Checkbox, CTAButton, FixedBottomCTA, ListRow, Top } from "@toss/tds-mobile";
import { REWARD_AMOUNT_OPTIONS, type RewardAmount } from "../model/types";
import { toKRW } from "../model/calcPayment";

interface Props {
  draft: RewardAmount | null;
  onSelect: (amount: RewardAmount) => void;
  onConfirm: () => void;
  onClose: () => void;
}

export function RewardAmountStep({ draft, onSelect, onConfirm, onClose }: Props) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Top
        title={
          <Top.TitleParagraph size={22} color={adaptive.grey900}>
            테스터 한 명에게 얼마씩 줄까요?
          </Top.TitleParagraph>
        }
      />
      {REWARD_AMOUNT_OPTIONS.map((amount) => (
        <ListRow
          key={amount}
          role="checkbox"
          aria-checked={draft === amount}
          contents={
            <ListRow.Texts
              type="1RowTypeA"
              top={toKRW(amount)}
              topProps={{ color: adaptive.grey700 }}
            />
          }
          right={<Checkbox.Line size={24} checked={draft === amount} />}
          verticalPadding="large"
          onClick={() => onSelect(amount)}
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
            선택하기
          </CTAButton>
        }
      />
    </div>
  );
}
