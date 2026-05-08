import { useEffect, useRef, useState } from "react";
import { BottomSheet, TextField } from "@toss/tds-mobile";

interface CardSortItemBottomSheetProps {
  open: boolean;
  title: string;
  placeholder: string;
  initialValue: string;
  onClose: () => void;
  onConfirm: (value: string) => void;
}

export function CardSortItemBottomSheet({
  open,
  title,
  placeholder,
  initialValue,
  onClose,
  onConfirm,
}: CardSortItemBottomSheetProps) {
  const [value, setValue] = useState(initialValue);
  const [fieldVisible, setFieldVisible] = useState(false);
  const initialValueRef = useRef(initialValue);

  useEffect(() => {
    initialValueRef.current = initialValue;
  }, [initialValue]);

  useEffect(() => {
    if (!open) return;
    const resetTimer = setTimeout(() => setValue(initialValueRef.current), 0);
    const visibleTimer = setTimeout(() => setFieldVisible(true), 4);
    return () => {
      clearTimeout(resetTimer);
      clearTimeout(visibleTimer);
      setFieldVisible(false);
    };
  }, [open]);

  const MAX_LENGTH = 16;
  const isDisabled = value.trim().length === 0;

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
      header={<BottomSheet.Header>{title}</BottomSheet.Header>}
      open={open}
      onClose={onClose}
      hasTextField={true}
      cta={
        <BottomSheet.CTA
          color="primary"
          variant="fill"
          disabled={isDisabled}
          fixedAboveKeyboard={true}
          onClick={() => {
            if (!isDisabled) onConfirm(value.trim());
          }}
        >
          확인
        </BottomSheet.CTA>
      }
      ctaContentGap={0}
    >
      <div style={{ opacity: fieldVisible ? 1 : 0, transition: fieldVisible ? "opacity 0.15s ease-in" : "none" }}>
        <TextField.Clearable
          variant="line"
          hasError={false}
          value={value}
          placeholder={placeholder}
          maxLength={MAX_LENGTH}
          onChange={(e) => setValue(e.target.value)}
          onClear={() => setValue("")}
          autoFocus
        />
      </div>
    </BottomSheet>
    </>
  );
}
