import { motion } from "framer-motion";
import { FixedBottomCTA, CTAButton, ListRow, Checkbox, Top } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { QUESTION_TYPES, type QuestionTypeId } from "../model/types";

interface QuestionTypeSelectSheetProps {
  selectedTypes: QuestionTypeId[];
  onToggle: (id: QuestionTypeId) => void;
  onConfirm: () => void;
  onCancel: () => void;
  onShowGuide?: () => void;
}

export function QuestionTypeSelectSheet({ selectedTypes, onToggle, onConfirm, onCancel, onShowGuide }: QuestionTypeSelectSheetProps) {
  const isConfirmDisabled = selectedTypes.length === 0;

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
          const isSelected = selectedTypes.includes(type.id);
          return (
            <ListRow
              key={type.id}
              as="button"
              className="w-full text-left"
              role="checkbox"
              aria-checked={isSelected}
              onClick={() => onToggle(type.id)}
              left={<ListRow.AssetIcon size="xsmall" shape="original" name={type.iconName} />}
              contents={
                <ListRow.Texts
                  type="2RowTypeA"
                  top={type.label}
                  topProps={{ color: adaptive.grey700, fontWeight: "bold" }}
                  bottom={type.description}
                  bottomProps={{ color: adaptive.grey600 }}
                />
              }
              right={<Checkbox.Line size={24} checked={isSelected} readOnly />}
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
          <CTAButton className="w-full" disabled={isConfirmDisabled} onClick={onConfirm}>
            추가하기
          </CTAButton>
        }
      />
    </motion.div>
  );
}
