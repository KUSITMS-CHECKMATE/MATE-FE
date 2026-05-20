import { CTAButton, Checkbox, FixedBottomCTA, List, ListRow } from "@toss/tds-mobile";
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
  onSelect: (id: string) => void;
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
  onSelect,
  onPrev,
  onGoNext,
}: Props) {
  return (
    <>
      <div className="flex flex-col flex-1">
        <QuestionHeader
          categoryLabel="5초 테스트"
          title={title}
          description={description}
        />
        <List>
          {choices.map((choice) => {
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
      </div>
      {isFirst ? (
        <FixedBottomCTA disabled={!canGoNext} onClick={onGoNext}>
          {isLast ? "완료하기" : "다음"}
        </FixedBottomCTA>
      ) : (
        <FixedBottomCTA.Double
          leftButton={
            <CTAButton color="dark" variant="weak" onClick={onPrev}>
              이전
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
