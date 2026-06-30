import { motion } from "framer-motion";
import { FixedBottomCTA, CTAButton, ListRow, Checkbox, Top } from "@toss/tds-mobile";
import { CATEGORIES, MAX_CATEGORIES, type CategoryId } from "../model/types";
import { adaptive } from "@toss/tds-colors";

interface CategorySelectSheetProps {
  selectedCategories: CategoryId[];
  onToggle: (category: CategoryId) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function CategorySelectSheet({ selectedCategories, onToggle, onConfirm, onCancel }: CategorySelectSheetProps) {
  const isConfirmDisabled = selectedCategories.length === 0;

  return (
    <motion.div className="fixed inset-0 z-50 flex flex-col bg-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
      {/* 헤더 */}
      <Top
        title={
          <Top.TitleParagraph size={22} color={adaptive.grey900}>
            카테고리를 선택해주세요
          </Top.TitleParagraph>
        }
        subtitleBottom={<Top.SubtitleParagraph size={15}>최대 {MAX_CATEGORIES}개까지 선택할 수 있어요</Top.SubtitleParagraph>}
      />

      {/* 카테고리 목록 */}
      <div className="flex-1 overflow-y-auto">
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategories.includes(category.id);
          const isImageIcon = category.iconName.startsWith("http");
          return (
            <ListRow
              key={category.id}
              as="button"
              className="w-full text-left"
              role="checkbox"
              aria-checked={isSelected}
              onClick={() => onToggle(category.id)}
              left={
                isImageIcon ? (
                  <ListRow.AssetImage src={category.iconName} shape="squircle" size="xsmall" />
                ) : (
                  <ListRow.AssetIcon size="xsmall" shape="original" name={category.iconName} color={"iconColor" in category ? category.iconColor : undefined} />
                )
              }
              contents={<ListRow.Texts type="1RowTypeA" top={category.label} />}
              right={<Checkbox.Line size={24} checked={isSelected} readOnly />}
              verticalPadding="large"
            />
          );
        })}
      </div>

      {/* 하단 CTA */}
      <FixedBottomCTA.Double
        leftButton={
          <CTAButton className="w-full" color="dark" variant="weak" onClick={onCancel}>
            취소
          </CTAButton>
        }
        rightButton={
          <CTAButton className="w-full" disabled={isConfirmDisabled} onClick={onConfirm}>
            선택하기
          </CTAButton>
        }
      />
    </motion.div>
  );
}
