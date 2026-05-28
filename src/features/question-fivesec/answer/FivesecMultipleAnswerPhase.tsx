import { CTAButton, Checkbox, FixedBottomCTA, List, ListRow, TextArea } from "@toss/tds-mobile";
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
  const hasOtherChoice = choices.some((c) => c.name === "기타 (직접 입력)");
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
          <div className="pt-2 pb-4">
            <TextArea
              variant="line"
              hasError={false}
              label="기타 답변"
              labelOption="sustain"
              value={otherText}
              placeholder="답변을 작성해 주세요"
              onChange={(e) => onOtherTextChange?.(e.target.value)}
            />
          </div>
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
