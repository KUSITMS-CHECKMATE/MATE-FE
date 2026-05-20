import { useState } from "react";
import { Border, IconButton, ListHeader, ListRow, Switch, Text } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { ScaleLabelEditSheet } from "./ScaleLabelEditSheet";

const SCALE_POINT_CONNECTOR_ICON_SRC =
  "https://static.toss.im/icons/png/4x/icon-o-mono.png";

interface ScaleCreateOptionSectionProps {
  scaleCount: 5 | 7;
  minLabel: string;
  maxLabel: string;
  onToggleSevenPoint: (checked: boolean) => void;
  onChangeMinLabel: (value: string) => void;
  onChangeMaxLabel: (value: string) => void;
}

export function ScaleCreateOptionSection({
  scaleCount,
  minLabel,
  maxLabel,
  onToggleSevenPoint,
  onChangeMinLabel,
  onChangeMaxLabel,
}: ScaleCreateOptionSectionProps) {
  const isSevenPoint = scaleCount === 7;
  const [editTarget, setEditTarget] = useState<"min" | "max" | null>(null);

  return (
    <>
      <ListHeader
        descriptionPosition="bottom"
        rightAlignment="center"
        titleWidthRatio={0.6}
        title={
          <ListHeader.TitleParagraph typography="t5" fontWeight="medium" color={adaptive.grey600}>
            척도 설정
          </ListHeader.TitleParagraph>
        }
        className="w-full"
      />

      <div className="flex w-full items-end justify-center px-3 py-3">
        {Array.from({ length: scaleCount }, (_, i) => i + 1).map((point) => (
          <div key={point} className="flex flex-col items-center gap-1">
            <Text color={adaptive.grey500} typography="t7" fontWeight="bold">
              {point}
            </Text>
            <IconButton
              src={SCALE_POINT_CONNECTOR_ICON_SRC}
              iconSize={24}
              variant="clear"
              color={adaptive.grey600}
              aria-label={`${point}점 척도 표시`}
            />
          </div>
        ))}
      </div>

      <ListRow
        as="button"
        className="text-left w-full"
        contents={
          <ListRow.Texts
            type="1RowTypeA"
            top="1점"
            topProps={{ color: adaptive.grey700 }}
          />
        }
        right={
          <ListRow.Texts
            type="Right1RowTypeA"
            top={minLabel || "전혀 아니다"}
            topProps={{ color: minLabel ? adaptive.grey700 : adaptive.grey600 }}
          />
        }
        verticalPadding="small"
        arrowType="right"
        withTouchEffect
        onClick={() => setEditTarget("min")}
      />

      <ListRow
        as="button"
        className="text-left w-full"
        contents={
          <ListRow.Texts
            type="1RowTypeA"
            top={`${scaleCount}점`}
            topProps={{ color: adaptive.grey700 }}
          />
        }
        right={
          <ListRow.Texts
            type="Right1RowTypeA"
            top={maxLabel || "매우 그렇다"}
            topProps={{ color: maxLabel ? adaptive.grey700 : adaptive.grey600 }}
          />
        }
        verticalPadding="small"
        arrowType="right"
        withTouchEffect
        onClick={() => setEditTarget("max")}
      />

      <ListRow
        contents={
          <ListRow.Texts
            type="1RowTypeB"
            top="7점 척도 변경"
            topProps={{ color: adaptive.grey800 }}
          />
        }
        right={
          <Switch
            checked={isSevenPoint}
            onChange={(_, checked) => onToggleSevenPoint(checked)}
          />
        }
        verticalPadding="large"
      />

      <ScaleLabelEditSheet
        open={editTarget === "min"}
        label="1점 라벨링"
        initialValue={minLabel}
        onClose={() => setEditTarget(null)}
        onConfirm={(value) => { onChangeMinLabel(value); setEditTarget(null); }}
      />
      <ScaleLabelEditSheet
        open={editTarget === "max"}
        label={`${scaleCount}점 라벨링`}
        initialValue={maxLabel}
        onClose={() => setEditTarget(null)}
        onConfirm={(value) => { onChangeMaxLabel(value); setEditTarget(null); }}
      />
    </>
  );
}
