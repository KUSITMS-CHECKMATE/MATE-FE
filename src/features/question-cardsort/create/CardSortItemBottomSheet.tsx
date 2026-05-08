import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (open) setValue(initialValue);
  }, [open, initialValue]);

  const isDisabled = value.trim().length === 0;

  return (
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
          onClick={() => {
            if (!isDisabled) onConfirm(value.trim());
          }}
        >
          확인
        </BottomSheet.CTA>
      }
      ctaContentGap={0}
    >
      <TextField.Clearable
        variant="line"
        hasError={false}
        value={value}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        onClear={() => setValue("")}
      />
    </BottomSheet>
  );
}
