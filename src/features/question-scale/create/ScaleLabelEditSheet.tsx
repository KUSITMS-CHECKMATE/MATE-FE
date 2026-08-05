import { useState, useEffect, useRef } from "react";
import { BottomSheet, TextField } from "@toss/tds-mobile";

interface ScaleLabelEditSheetProps {
  open: boolean;
  label: string;
  initialValue: string;
  onClose: () => void;
  onConfirm: (value: string) => void;
}

export function ScaleLabelEditSheet({
  open,
  label,
  initialValue,
  onClose,
  onConfirm,
}: ScaleLabelEditSheetProps) {
  const [value, setValue] = useState(initialValue);
  const initialValueRef = useRef(initialValue);

  useEffect(() => {
    initialValueRef.current = initialValue;
  }, [initialValue]);

  useEffect(() => {
    if (!open) return;
    setValue(initialValueRef.current);
  }, [open]);

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
      open={open}
      onClose={onClose}
      hasTextField={true}
      cta={
        <BottomSheet.CTA
          color="primary"
          variant="fill"
          disabled={false}
          fixedAboveKeyboard
          onClick={() => onConfirm(value.trim())}
        >
          확인
        </BottomSheet.CTA>
      }
      ctaContentGap={0}
    >
      <TextField.Clearable
        variant="line"
        hasError={false}
        label={label}
        labelOption="sustain"
        value={value}
        placeholder="라벨링을 입력해주세요"
        suffix=""
        prefix=""
        onChange={(e) => setValue(e.target.value)}
        onClear={() => setValue("")}
      />
    </BottomSheet>
    </>
  );
}
