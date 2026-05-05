import { Asset, Border, ListHeader, ListRow, Switch, Text, TextField } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";

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
  const hasLabels = minLabel.trim().length > 0 || maxLabel.trim().length > 0;

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
            <Asset.Icon
              frameShape={Asset.frameShape.CleanW24}
              backgroundColor="transparent"
              name="icon-o-mono"
              color={adaptive.grey600}
              aria-hidden
            />
          </div>
        ))}
      </div>

      {!hasLabels ? (
        <ListRow
          contents={
            <ListRow.Texts
              type="1RowTypeA"
              top="척도 라벨링이 설정되지 않았어요"
              topProps={{ color: adaptive.grey600 }}
            />
          }
          verticalPadding="large"
        />
      ) : (
        <>
          {minLabel.trim().length > 0 && (
            <ListRow
              contents={
                <ListRow.Texts
                  type="1RowTypeA"
                  top={`1점: ${minLabel.trim()}`}
                  topProps={{ color: adaptive.grey600 }}
                />
              }
              verticalPadding="small"
            />
          )}
          {maxLabel.trim().length > 0 && (
            <ListRow
              contents={
                <ListRow.Texts
                  type="1RowTypeA"
                  top={`${scaleCount}점: ${maxLabel.trim()}`}
                  topProps={{ color: adaptive.grey600 }}
                />
              }
              verticalPadding="small"
            />
          )}
        </>
      )}

      <Border className="shrink-0"/>
      

      <TextField.Clearable
        variant="box"
        hasError={false}
        label="1점 라벨"
        labelOption="sustain"
        value={minLabel}
        placeholder="예: 전혀 아니다"
        enterKeyHint="done"
        onChange={(e) => onChangeMinLabel(e.target.value)}
        onClear={() => onChangeMinLabel("")}
      />

      <TextField.Clearable
        variant="box"
        hasError={false}
        label={`${scaleCount}점 라벨`}
        labelOption="sustain"
        value={maxLabel}
        placeholder="예: 매우 그렇다"
        enterKeyHint="done"
        onChange={(e) => onChangeMaxLabel(e.target.value)}
        onClear={() => onChangeMaxLabel("")}
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
    </>
  );
}
