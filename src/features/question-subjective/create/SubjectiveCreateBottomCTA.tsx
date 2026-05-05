import { CTAButton, FixedBottomCTA } from "@toss/tds-mobile";

interface SubjectiveCreateBottomCTAProps {
  isCompleteDisabled: boolean;
  onCancel: () => void;
  onComplete: () => void;
}

export function SubjectiveCreateBottomCTA({
  isCompleteDisabled,
  onCancel,
  onComplete,
}: SubjectiveCreateBottomCTAProps) {
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
