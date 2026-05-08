import { useState, useCallback } from "react";
import { STEPS, type Step } from "./types";

export function useFunnel(initialStep: Step = "basic") {
  const [step, setStep] = useState<Step>(initialStep);

  const currentIndex = STEPS.indexOf(step);

  const next = useCallback(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < STEPS.length) {
      setStep(STEPS[nextIndex]);
    }
  }, [currentIndex]);

  const prev = useCallback(() => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      setStep(STEPS[prevIndex]);
    }
  }, [currentIndex]);

  return {
    step,
    setStep,
    currentIndex,
    next,
    prev,
    isFirst: currentIndex === 0,
    isLast: currentIndex === STEPS.length - 1,
    totalSteps: STEPS.length,
  } as const;
}
