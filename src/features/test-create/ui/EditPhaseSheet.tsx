import { useState } from "react";
import { BottomSheet, Button, ListRow, Asset } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import type { EditPhase } from "../model/types";

interface EditPhaseSheetProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (phase: EditPhase) => void;
}

const EDITABLE_PHASES: { label: string; phase: EditPhase }[] = [
  { label: "기본 정보", phase: "basic" },
  { label: "서비스 소개", phase: "service" },
  { label: "테스트 이미지", phase: "image" },
];

export function EditPhaseSheet({ open, onClose, onConfirm }: EditPhaseSheetProps) {
  const [selectedPhase, setSelectedPhase] = useState<EditPhase>("basic");

  return (
    <BottomSheet
      header={<BottomSheet.Header>어떤 정보를 수정할까요?</BottomSheet.Header>}
      open={open}
      onClose={onClose}
      cta={
        <BottomSheet.DoubleCTA
          leftButton={
            <Button color="dark" variant="weak" onClick={onClose}>
              닫기
            </Button>
          }
          rightButton={
            <Button onClick={() => {
              onConfirm(selectedPhase);
              onClose();
            }}>
              선택하기
            </Button>
          }
        />
      }
    >
      <div className="py-2">
        {EDITABLE_PHASES.map((option) => {
          const isSelected = selectedPhase === option.phase;
          return (
            <ListRow
              key={option.phase}
              as="button"
              className="w-full text-left"
              onClick={() => setSelectedPhase(option.phase)}
              contents={
                <ListRow.Texts
                  type="1RowTypeA"
                  top={option.label}
                  topProps={{
                    color: adaptive.grey900,
                  }}
                />
              }
              right={
                isSelected ? (
                  <Asset.Icon name="icon-check-mono" color={adaptive.blue500} aria-hidden={true} />
                ) : null
              }
              verticalPadding="large"
            />
          );
        })}
      </div>
    </BottomSheet>
  );
}
