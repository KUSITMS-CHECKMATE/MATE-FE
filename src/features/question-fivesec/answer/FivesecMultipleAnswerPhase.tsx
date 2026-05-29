import { useRef } from "react";
import { adaptive } from "@toss/tds-colors";
import { CTAButton, Checkbox, FixedBottomCTA, List, ListRow, TextField } from "@toss/tds-mobile";
import type { MultipleChoiceItem } from "@/features/question-multiple/model/types";
import { QuestionHeader } from "@/features/test-participate/ui/QuestionHeader";

interface Props {
  title: string;
  description: string;
  choices: MultipleChoiceItem[];
  selectedIds: string[];
  isMultiSelectEnabled: boolean;
  canGoNext: boolean;
  isFirst: boolean;
  isLast: boolean;
  prevLabel?: string;
  otherText?: string;
  onSelect: (id: string) => void;
  onOtherTextChange?: (text: string) => void;
  onPrev: () => void;
  onGoNext: () => void;
}

export function FivesecMultipleAnswerPhase({
  title,
  description,
  choices,
  selectedIds,
  isMultiSelectEnabled,
  canGoNext,
  isFirst,
  isLast,
  prevLabel = "이전",
  otherText = "",
  onSelect,
  onOtherTextChange,
  onPrev,
  onGoNext,
}: Props) {
  const otherChoice = choices.find((c) => c.name === "기타 (직접 입력)");
  const hasOtherChoice = !!otherChoice;
  const otherFieldRef = useRef<HTMLDivElement>(null);

  function handleOtherRowClick() {
    otherFieldRef.current?.querySelector("input")?.focus();
  }

  function handleOtherFocus() {
    if (!otherChoice || selectedIds.includes(otherChoice.id)) return;
    onSelect(otherChoice.id);
  }

  function handleOtherTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (otherChoice && !selectedIds.includes(otherChoice.id)) {
      onSelect(otherChoice.id);
    }
    onOtherTextChange?.(e.target.value);
  }

  return (
    <>
      <div className="flex flex-col flex-1">
        <QuestionHeader
          categoryLabel="5초 테스트"
          title={title}
          description={description}
        />
        <List>
          {choices.filter((c) => c.name !== "기타 (직접 입력)").map((choice) => {
            const checked = selectedIds.includes(choice.id);
            return (
              <div
                key={choice.id}
                className="bg-white"
                onClick={() => onSelect(choice.id)}
              >
                <ListRow
                  role="checkbox"
                  aria-checked={checked}
                  contents={<ListRow.Texts type="1RowTypeA" top={choice.name} />}
                  right={
                    isMultiSelectEnabled ? (
                      <Checkbox.Line size={24} checked={checked} />
                    ) : (
                      <Checkbox.Circle size={24} checked={checked} />
                    )
                  }
                  verticalPadding="large"
                />
              </div>
            );
          })}
        </List>
        {hasOtherChoice && (
          <>
            <div className="bg-white" onClick={handleOtherRowClick}>
              <ListRow
                role="checkbox"
                aria-checked={selectedIds.includes(otherChoice!.id)}
                contents={
                  <ListRow.Texts
                    type="1RowTypeA"
                    top="기타"
                    topProps={{ color: adaptive.grey700 }}
                  />
                }
                right={
                  isMultiSelectEnabled ? (
                    <Checkbox.Line size={24} checked={selectedIds.includes(otherChoice!.id)} />
                  ) : (
                    <Checkbox.Circle size={24} checked={selectedIds.includes(otherChoice!.id)} />
                  )
                }
                verticalPadding="small"
              />
            </div>
            <div ref={otherFieldRef} className="pb-4">
              <TextField.Clearable
                variant="line"
                hasError={false}
                label=""
                labelOption="sustain"
                value={otherText}
                placeholder=""
                suffix=""
                prefix=":"
                onFocus={handleOtherFocus}
                onChange={handleOtherTextChange}
              />
            </div>
          </>
        )}
      </div>
      {isFirst ? (
        <FixedBottomCTA disabled={!canGoNext} onClick={onGoNext}>
          {isLast ? "완료하기" : "다음"}
        </FixedBottomCTA>
      ) : (
        <FixedBottomCTA.Double
          leftButton={
            <CTAButton color="dark" variant="weak" onClick={onPrev}>
              {prevLabel}
            </CTAButton>
          }
          rightButton={
            <CTAButton disabled={!canGoNext} onClick={onGoNext}>
              {isLast ? "완료하기" : "다음"}
            </CTAButton>
          }
        />
      )}
    </>
  );
}
