import type { ReactNode } from "react";
import { FixedBottomCTA, CTAButton, ProgressStepper, ProgressStep } from "@toss/tds-mobile";
import { PHASES, PHASE_LABELS, STEP_PHASE } from "../model/types";
import type { Step } from "../model/types";

export type CTAMode = "confirm" | "double" | "hidden";

interface FunnelLayoutProps {
  children: ReactNode;
  onConfirm?: () => void;
  onNext?: () => void;
  onCancel?: () => void;
  currentStep: Step;
  ctaMode: CTAMode;
  isConfirmDisabled?: boolean;
  isNextDisabled?: boolean;
}

export function FunnelLayout({
  children,
  onConfirm,
  onNext,
  onCancel,
  currentStep,
  ctaMode,
  isConfirmDisabled = false,
  isNextDisabled = false,
}: FunnelLayoutProps) {
  const currentPhase = STEP_PHASE[currentStep];
  const phaseIndex = PHASES.indexOf(currentPhase);

  return (
    <div className="flex flex-col min-h-dvh">
      {/* 프로그레스 스텝 */}
      <ProgressStepper variant="compact" activeStepIndex={phaseIndex}>
        {PHASES.map((phase) => (
          <ProgressStep key={phase} title={PHASE_LABELS[phase]} />
        ))}
      </ProgressStepper>

      {/* 컨텐츠 영역 */}
      <main className="flex-1 pb-4">{children}</main>

      {/* 하단 CTA */}
      {ctaMode === "confirm" && (
        <FixedBottomCTA
          fixedAboveKeyboard
          disabled={isConfirmDisabled}
          onClick={onConfirm}
        >
          확인
        </FixedBottomCTA>
      )}
      {ctaMode === "double" && (
        <FixedBottomCTA.Double
          leftButton={
            <CTAButton color="dark" variant="weak" onClick={onCancel}>
              취소
            </CTAButton>
          }
          rightButton={
            <CTAButton disabled={isNextDisabled} onClick={onNext}>
              다음으로
            </CTAButton>
          }
        />
      )}
    </div>
  );
}
