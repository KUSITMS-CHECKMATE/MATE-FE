import { BottomSheet, Checkbox, ListRow, Spacing } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import type { AbRatio } from "@/features/question-ab/model/types";

const RATIOS: AbRatio[] = ["9:16", "1:1", "4:3"];

interface AbRatioSelectSheetProps {
  open: boolean;
  selected: AbRatio;
  onClose: () => void;
  onSelect: (ratio: AbRatio) => void;
}

export function AbRatioSelectSheet({ open, selected, onClose, onSelect }: AbRatioSelectSheetProps) {
  return (
    <BottomSheet
      header={<BottomSheet.Header>사진 비율을 선택해주세요</BottomSheet.Header>}
      open={open}
      onClose={onClose}
      cta={[]}
    >
      {RATIOS.map((ratio) => {
        const isSelected = selected === ratio;
        return (
          <ListRow
            key={ratio}
            as="button"
            className="w-full text-left"
            role="checkbox"
            aria-checked={isSelected}
            contents={
              <ListRow.Texts
                type="1RowTypeA"
                top={ratio}
                topProps={{ color: adaptive.grey700 }}
              />
            }
            right={isSelected ? <Checkbox.Line size={24} checked={true} /> : undefined}
            verticalPadding="large"
            withTouchEffect
            onClick={() => { onSelect(ratio); onClose(); }}
          />
        );
      })}
    </BottomSheet>
  );
}
