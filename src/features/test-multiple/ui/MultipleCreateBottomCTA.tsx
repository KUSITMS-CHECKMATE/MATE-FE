import { CTAButton, FixedBottomCTA } from "@toss/tds-mobile";

interface MultipleCreateBottomCTAProps {
  isCompleteDisabled: boolean;
}

export function MultipleCreateBottomCTA({ isCompleteDisabled }: MultipleCreateBottomCTAProps) {
  return (
    <FixedBottomCTA.Double
      leftButton={
        <CTAButton color="dark" variant="weak">
          취소
        </CTAButton>
      }
      rightButton={<CTAButton disabled={isCompleteDisabled}>완료하기</CTAButton>}
    />
  );
}
