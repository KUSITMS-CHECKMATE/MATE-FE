import { useState } from "react";
import { BottomSheet, Checkbox, ConfirmDialog, ListRow } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";

interface Props {
  open: boolean;
  answerType: "multiple" | "subjective";
  onClose: () => void;
  onSelect: (type: "multiple" | "subjective") => void;
}

export function FivesecAnswerTypeSheet({ open, answerType, onClose, onSelect }: Props) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  function handleSelectSubjective() {
    if (answerType === "multiple") {
      setIsConfirmOpen(true);
    } else {
      onSelect("subjective");
      onClose();
    }
  }

  function handleConfirm() {
    setIsConfirmOpen(false);
    onSelect("subjective");
    onClose();
  }

  return (
    <>
      <BottomSheet
        open={open}
        onClose={onClose}
        header={<BottomSheet.Header>답변 방식을 선택해주세요</BottomSheet.Header>}
        cta={[]}
      >
        <ListRow
          as="button"
          role="checkbox"
          aria-checked={answerType === "subjective"}
          className="w-full"
          left={<ListRow.AssetIcon size="xsmall" shape="original" name="icon-pencil-blue" />}
          contents={<ListRow.Texts type="1RowTypeB" top="주관식" topProps={{ color: adaptive.grey800 }} />}
          right={answerType === "subjective" ? <Checkbox.Line size={24} checked /> : undefined}
          verticalPadding="large"
          onClick={handleSelectSubjective}
        />
        <ListRow
          as="button"
          role="checkbox"
          aria-checked={answerType === "multiple"}
          className="w-full"
          left={<ListRow.AssetIcon size="xsmall" shape="original" name="icon-check-circle" />}
          contents={<ListRow.Texts type="1RowTypeB" top="객관식" topProps={{ color: adaptive.grey800 }} />}
          right={answerType === "multiple" ? <Checkbox.Line size={24} checked /> : undefined}
          verticalPadding="large"
          onClick={() => { onSelect("multiple"); onClose(); }}
        />
      </BottomSheet>

      <ConfirmDialog
        open={isConfirmOpen}
        title="주관식으로 바꾸면 객관식 내역이 사라져요"
        onClose={() => setIsConfirmOpen(false)}
        cancelButton={
          <ConfirmDialog.CancelButton size="xlarge" onClick={() => setIsConfirmOpen(false)}>
            닫기
          </ConfirmDialog.CancelButton>
        }
        confirmButton={
          <ConfirmDialog.ConfirmButton size="xlarge" onClick={handleConfirm}>
            확인
          </ConfirmDialog.ConfirmButton>
        }
      />
    </>
  );
}
