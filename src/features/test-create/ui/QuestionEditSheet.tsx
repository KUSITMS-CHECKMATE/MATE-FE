import { motion } from "framer-motion";
import { BottomSheet, TextField } from "@toss/tds-mobile";

export interface EditSheetConfig {
  header: string;
  label: string;
  fieldPlaceholder: string;
  maxLength: number;
}

interface QuestionEditSheetProps {
  open: boolean;
  draft: string;
  fieldVisible: boolean;
  config: EditSheetConfig;
  confirmDisabled: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onDraftChange: (value: string) => void;
}

export function QuestionEditSheet({
  open,
  draft,
  fieldVisible,
  config,
  confirmDisabled,
  onClose,
  onConfirm,
  onDraftChange,
}: QuestionEditSheetProps) {
  return (
    <BottomSheet
      header={<BottomSheet.Header>{config.header}</BottomSheet.Header>}
      open={open}
      onClose={onClose}
      hasTextField
      cta={
        <BottomSheet.CTA
          color="primary"
          variant="fill"
          disabled={confirmDisabled}
          fixedAboveKeyboard
          onClick={onConfirm}
        >
          확인
        </BottomSheet.CTA>
      }
      ctaContentGap={0}
    >
      {fieldVisible && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
          <TextField.Clearable
            variant="line"
            hasError={false}
            label={config.label}
            labelOption="sustain"
            value={draft}
            placeholder={config.fieldPlaceholder}
            maxLength={config.maxLength}
            autoFocus
            onChange={(e) => onDraftChange(e.target.value.slice(0, config.maxLength))}
            onClear={() => onDraftChange("")}
          />
        </motion.div>
      )}
    </BottomSheet>
  );
}
