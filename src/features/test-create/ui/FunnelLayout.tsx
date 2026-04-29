import type { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FixedBottomCTA, CTAButton, ProgressStepper, ProgressStep } from "@toss/tds-mobile";
import { PHASES, PHASE_LABELS, STEP_PHASE } from "../model/types";
import type { Step } from "../model/types";

export type CTAMode = "confirm" | "double" | "submit" | "submit-double" | "hidden";

interface FunnelLayoutProps {
  children: ReactNode;
  onConfirm?: () => void;
  onNext?: () => void;
  onCancel?: () => void;
  onSubmit?: () => void;
  currentStep: Step;
  ctaMode: CTAMode;
  isConfirmDisabled?: boolean;
  isNextDisabled?: boolean;
  isSubmitDisabled?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
}

export function FunnelLayout({
  children,
  onConfirm,
  onNext,
  onCancel,
  onSubmit,
  currentStep,
  ctaMode,
  isConfirmDisabled = false,
  isNextDisabled = false,
  isSubmitDisabled = false,
  submitLabel,
  cancelLabel = "취소",
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
      <main className="flex flex-col flex-1 pb-4">{children}</main>

      {/* 하단 CTA */}
      <AnimatePresence mode="wait">
        {ctaMode === "confirm" && (
          <motion.div key="confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.1 }}>
            <FixedBottomCTA
              fixedAboveKeyboard
              disabled={isConfirmDisabled}
              onClick={onConfirm}
            >
              확인
            </FixedBottomCTA>
          </motion.div>
        )}
        {ctaMode === "double" && (
          <motion.div key="double" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.1 }}>
            <FixedBottomCTA.Double
              leftButton={
                <CTAButton color="dark" variant="weak" onClick={onCancel}>
                  {cancelLabel}
                </CTAButton>
              }
              rightButton={
                <CTAButton disabled={isNextDisabled} onClick={onNext}>
                  다음으로
                </CTAButton>
              }
            />
          </motion.div>
        )}
        {ctaMode === "submit" && (
          <motion.div key="submit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.1 }}>
            <FixedBottomCTA disabled={isSubmitDisabled} onClick={onSubmit}>
              {submitLabel}
            </FixedBottomCTA>
          </motion.div>
        )}
        {ctaMode === "submit-double" && (
          <motion.div key="submit-double" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.1 }}>
            <FixedBottomCTA.Double
              leftButton={
                <CTAButton color="dark" variant="weak" onClick={onCancel}>
                  {cancelLabel}
                </CTAButton>
              }
              rightButton={
                <CTAButton disabled={isSubmitDisabled} onClick={onSubmit}>
                  {submitLabel}
                </CTAButton>
              }
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
