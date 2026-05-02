import { CTAButton, FixedBottomCTA } from "@toss/tds-mobile";

interface ScaleCreateBottomCTAProps {
  isCompleteDisabled: boolean;
  onCancel: () => void;
  onComplete: () => void;
}

export function ScaleCreateBottomCTA({ isCompleteDisabled, onCancel, onComplete }: ScaleCreateBottomCTAProps) {
  return (
    <FixedBottomCTA.Double
      leftButton={
        <CTAButton color="dark" variant="weak" onClick={onCancel}>
          취소
        </CTAButton>
      }
      rightButton={
        <CTAButton disabled={isCompleteDisabled} onClick={onComplete}>
          완료하기
        </CTAButton>
      }
    />
  );
}
