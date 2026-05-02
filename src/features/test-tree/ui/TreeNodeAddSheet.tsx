import { useEffect, useRef, useState } from "react";
import { BottomSheet, TextField } from "@toss/tds-mobile";

interface TreeNodeAddSheetProps {
  open: boolean;
  title?: string;
  initialName?: string;
  onClose: () => void;
  onConfirm: (name: string) => void;
}

export function TreeNodeAddSheet({
  open,
  title = "기능 추가하기",
  initialName = "",
  onClose,
  onConfirm,
}: TreeNodeAddSheetProps) {
  const [name, setName] = useState(initialName);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
    return () => window.clearTimeout(id);
  }, [open]);

  const isConfirmDisabled = name.trim().length === 0;

  const handleClose = () => {
    setName("");
    onClose();
  };

  const handleConfirm = () => {
    const value = name.trim();
    setName("");
    onConfirm(value);
  };

  return (
    <BottomSheet
      header={<BottomSheet.Header>{title}</BottomSheet.Header>}
      open={open}
      onClose={handleClose}
      hasTextField
      cta={
        <BottomSheet.CTA
          color="primary"
          variant="fill"
          disabled={isConfirmDisabled}
          onClick={handleConfirm}
        >
          확인
        </BottomSheet.CTA>
      }
    >
      <TextField.Clearable
        ref={inputRef}
        variant="line"
        label="기능 이름"
        labelOption="sustain"
        value={name}
        placeholder="기능 이름"
        maxLength={17}
        onChange={(e) => setName(e.target.value.slice(0, 17))}
        onClear={() => setName("")}
      />
    </BottomSheet>
  );
}
