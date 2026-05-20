import { motion } from "framer-motion";
import { FixedBottomCTA, CTAButton, ListRow, Top, NumericSpinner, IconButton, useToast } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { QUESTION_TYPES, type QuestionTypeId } from "../model/types";

const MAX_QUESTIONS = 20;

interface QuestionTypeSelectSheetProps {
  selectedCounts: Partial<Record<QuestionTypeId, number>>;
  onChangeCount: (id: QuestionTypeId, count: number) => void;
  existingCount: number;
  onConfirm: () => void;
  onCancel: () => void;
  onShowGuide?: () => void;
}

export function QuestionTypeSelectSheet({ selectedCounts, onChangeCount, existingCount, onConfirm, onCancel, onShowGuide }: QuestionTypeSelectSheetProps) {
  const { openToast } = useToast();
  const totalSelected = Object.values(selectedCounts).reduce((sum, c) => sum + (c ?? 0), 0);
  const remaining = MAX_QUESTIONS - existingCount;

  const handleChangeCount = (id: QuestionTypeId, newCount: number) => {
    const currentForId = selectedCounts[id] ?? 0;
    const otherTotal = totalSelected - currentForId;

    if (otherTotal + newCount > remaining) {
      openToast("질문은 최대 20개까지만 만들 수 있어요.", {
        type: "bottom",
        lottie: "https://static.toss.im/lotties-common/error-yellow-spot.json",
        higherThanCTA: true,
      });
      return;
    }
    onChangeCount(id, newCount);
  };

  return (
    <motion.div className="fixed inset-0 z-50 flex flex-col bg-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
      <Top
        title={
          <Top.TitleParagraph size={22} color={adaptive.grey900}>
            추가할 질문 유형을
            <br />
            선택해주세요
          </Top.TitleParagraph>
        }
        subtitleBottom={<Top.SubtitleParagraph size={15}>여러개 추가할 수 있어요</Top.SubtitleParagraph>}
        lower={
          <Top.LowerButton color="dark" size="small" variant="weak" display="inline" onClick={onShowGuide}>
            어떻게 사용하나요?
          </Top.LowerButton>
        }
      />

      <div className="flex-1 overflow-y-auto">
        {QUESTION_TYPES.map((type) => {
          const count = selectedCounts[type.id] ?? 0;
          return (
            <ListRow
              key={type.id}
              left={<ListRow.AssetIcon size="xsmall" shape="original" name={type.iconName} />}
              contents={
                <ListRow.Texts type="2RowTypeA" top={type.label} topProps={{ color: adaptive.grey700, fontWeight: "bold" }} bottom={type.description} bottomProps={{ color: adaptive.grey600 }} />
              }
              right={
                count > 0 ? (
                  <NumericSpinner
                    size="tiny"
                    number={count}
                    minNumber={0}
                    maxNumber={99}
                    disable={false}
                    onNumberChange={(newCount) => handleChangeCount(type.id, newCount)}
                  />
                ) : (
                  <IconButton
                    src="https://static.toss.im/icons/png/4x/icon-plus-thin-mono.png"
                    variant="fill"
                    iconSize={16}
                    bgColor={adaptive.grey100}
                    color={adaptive.grey700}
                    aria-label={`${type.label} 추가`}
                    onClick={() => handleChangeCount(type.id, 1)}
                  />
                )
              }
              verticalPadding="large"
            />
          );
        })}
      </div>

      <FixedBottomCTA.Double
        leftButton={
          <CTAButton className="w-full" color="dark" variant="weak" onClick={onCancel}>
            닫기
          </CTAButton>
        }
        rightButton={
          <CTAButton className="w-full" disabled={totalSelected === 0} onClick={onConfirm}>
            {totalSelected > 0 ? `${totalSelected}개 추가하기` : "추가하기"}
          </CTAButton>
        }
      />
    </motion.div>
  );
}
