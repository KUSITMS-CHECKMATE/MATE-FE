import { BottomSheet, Wheel } from "@toss/tds-mobile";

const PERIOD_OPTIONS = Array.from({ length: 28 }, (_, i) => i + 3);

interface Props {
  open: boolean;
  sheetKey: number;
  draft: number;
  onSelect: (days: number) => void;
  onConfirm: () => void;
  onClose: () => void;
}

export function ResponsePeriodSheet({ open, sheetKey, draft, onSelect, onConfirm, onClose }: Props) {
  const initialIndex = Math.max(0, PERIOD_OPTIONS.indexOf(draft));

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      header={<BottomSheet.Header>테스트 응답 기간</BottomSheet.Header>}
      cta={
        <BottomSheet.CTA color="primary" variant="fill" onClick={onConfirm}>
          선택하기
        </BottomSheet.CTA>
      }
    >
      <div style={{ height: 216 }} className="flex justify-center">
        <Wheel
          key={sheetKey}
          options={PERIOD_OPTIONS}
          initialIndex={initialIndex}
          formatValue={(v) => `${v}일`}
          onChange={onSelect}
          width={160}
          aria-label="응답 기간 선택"
        />
      </div>
    </BottomSheet>
  );
}
