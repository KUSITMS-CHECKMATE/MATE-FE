import { BottomSheet, Checkbox, ListRow } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";

export type QaPaymentResult = "success" | "app-market-verification-failed" | "toss-server-verification-failed" | "give-up";

const OPTIONS: Array<{ value: QaPaymentResult; label: string; description: string }> = [
  {
    value: "success",
    label: "결제 성공",
    description: "결제 완료 화면을 바로 확인해요",
  },
  {
    value: "app-market-verification-failed",
    label: "스토어 검증 실패",
    description: "스토어 시스템 문제 화면을 확인해요",
  },
  {
    value: "toss-server-verification-failed",
    label: "메이트 검증 실패",
    description: "메이트 시스템 문제 화면을 확인해요",
  },
  {
    value: "give-up",
    label: "문의 유도 화면",
    description: "재시도 불가 최종 화면을 확인해요",
  },
];

interface Props {
  open: boolean;
  selected: QaPaymentResult;
  onClose: () => void;
  onSelect: (value: QaPaymentResult) => void;
}

export function QaPaymentResultSheet({ open, selected, onClose, onSelect }: Props) {
  return (
    <BottomSheet
      header={<BottomSheet.Header>QA 결제 결과를 선택해주세요</BottomSheet.Header>}
      open={open}
      onClose={onClose}
      cta={[]}
    >
      {OPTIONS.map((option) => {
        const isSelected = selected === option.value;
        return (
          <ListRow
            key={option.value}
            as="button"
            className="w-full text-left"
            role="checkbox"
            aria-checked={isSelected}
            contents={
              <ListRow.Texts
                type="2RowTypeA"
                top={option.label}
                topProps={{ color: adaptive.grey700 }}
                bottom={option.description}
                bottomProps={{ color: adaptive.grey500 }}
              />
            }
            right={isSelected ? <Checkbox.Line size={24} checked={true} /> : undefined}
            verticalPadding="large"
            withTouchEffect
            onClick={() => {
              onSelect(option.value);
              onClose();
            }}
          />
        );
      })}
    </BottomSheet>
  );
}
