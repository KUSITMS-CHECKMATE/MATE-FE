import { motion, AnimatePresence } from "framer-motion";
import { CTAButton, FixedBottomCTA } from "@toss/tds-mobile";

interface ScaleCreateBottomCTAProps {
  isCompleteDisabled: boolean;
  isFocused: boolean;
  onCancel: () => void;
  onComplete: () => void;
  onDismissKeyboard: () => void;
}

export function ScaleCreateBottomCTA({ isCompleteDisabled, isFocused, onCancel, onComplete, onDismissKeyboard }: ScaleCreateBottomCTAProps) {
  return (
    <AnimatePresence mode="wait">
      {isFocused ? (
        <motion.div key="confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.1 }}>
          <FixedBottomCTA fixedAboveKeyboard onClick={onDismissKeyboard}>
            확인
          </FixedBottomCTA>
        </motion.div>
      ) : (
        <motion.div key="double" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.1 }}>
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
