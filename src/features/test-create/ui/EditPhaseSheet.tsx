import { BottomSheet, ListRow } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import type { EditPhase } from "../model/types";

interface EditPhaseSheetProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (phase: EditPhase) => void;
}

const EDITABLE_PHASES: { top: string; bottom?: string; phase: EditPhase }[] = [
  { top: "기본 정보", bottom: "테스트 이름·한줄 소개·카테고리", phase: "basic" },
  { top: "서비스 소개", bottom: "서비스 이름·소개", phase: "service" },
  { top: "테스트 이미지", phase: "image" },
];

export function EditPhaseSheet({ open, onClose, onConfirm }: EditPhaseSheetProps) {
  return (
    <BottomSheet
      header={<BottomSheet.Header>어떤 정보를 수정할까요?</BottomSheet.Header>}
      open={open}
      onClose={onClose}
      cta={
        <BottomSheet.CTA color="dark" variant="weak" onClick={onClose}>
          닫기
        </BottomSheet.CTA>
      }
    >
      {EDITABLE_PHASES.map((option) => (
        <ListRow
          key={option.phase}
          as="button"
          className="w-full text-left"
          onClick={() => {
            onConfirm(option.phase);
            onClose();
          }}
          contents={
            option.bottom ? (
              <ListRow.Texts
                type="2RowTypeA"
                top={option.top}
                topProps={{ color: adaptive.grey800, fontWeight: "bold" }}
                bottom={option.bottom}
                bottomProps={{ color: adaptive.grey600 }}
              />
            ) : (
              <ListRow.Texts type="1RowTypeC" top={option.top} topProps={{ color: adaptive.grey800 }} />
            )
          }
          verticalPadding="large"
          arrowType="right"
        />
      ))}
    </BottomSheet>
  );
}
