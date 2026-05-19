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
    <>
      {open && (
        <style>{`
          :has(> [aria-modal="true"]),
          [aria-modal="true"] {
            transition: bottom 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
          }
        `}</style>
      )}
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
        <div
          style={{
            opacity: fieldVisible ? 1 : 0,
            transition: fieldVisible ? "opacity 0.15s ease-in" : "none",
          }}
        >
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
        </div>
      </BottomSheet>
    </>
  );
}
