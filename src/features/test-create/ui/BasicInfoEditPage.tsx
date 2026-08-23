import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TextField, FixedBottomCTA, CTAButton, Top } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { CategorySelectSheet } from "./CategorySelectSheet";
import { useTestCreateForm } from "../model/useTestCreateForm";
import { CATEGORIES, type CategoryId } from "../model/types";

// TestBasicInfoStep과 동일한 상한 (백엔드 글자수 제한 삭제에 맞춘 프론트 폭주 방지용)
const MAX_LENGTH = 250;

interface BasicInfoEditPageProps {
  onClose: () => void;
}

export function BasicInfoEditPage({ onClose }: BasicInfoEditPageProps) {
  const form = useTestCreateForm();
  const snapshot = useRef({
    name: form.name,
    summary: form.summary,
    categories: form.categories,
  });
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);
  const categorySheetSnapshot = useRef<CategoryId[]>([]);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const summaryInputRef = useRef<HTMLInputElement>(null);

  const categoryDisplayValue = form.categories
    .map((id) => CATEGORIES.find((c) => c.id === id)?.label)
    .filter(Boolean)
    .join(", ");

  const isSaveDisabled = form.name.trim().length === 0 || form.summary.trim().length === 0;

  const handleCancel = () => {
    form.setName(snapshot.current.name);
    form.setSummary(snapshot.current.summary);
    form.setCategories(snapshot.current.categories);
    onClose();
  };

  const handleOpenCategorySheet = () => {
    categorySheetSnapshot.current = form.categories;
    setIsCategorySheetOpen(true);
  };

  const handleCancelCategorySheet = () => {
    form.setCategories(categorySheetSnapshot.current);
    setIsCategorySheetOpen(false);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Top
        title={
          <Top.TitleParagraph size={22} color={adaptive.grey900}>
            기본 정보 수정하기
          </Top.TitleParagraph>
        }
      />
      <main className="flex flex-col flex-1">
        <TextField.Clearable
          ref={nameInputRef}
          variant="line"
          label="테스트 이름"
          labelOption="sustain"
          value={form.name}
          onChange={(e) => { if (e.target.value.length <= MAX_LENGTH) form.setName(e.target.value); }}
          onClear={() => { form.setName(""); nameInputRef.current?.focus(); }}
          placeholder="테스트 이름"
          maxLength={MAX_LENGTH}
          help="최대 250자"
        />
        <TextField.Clearable
          ref={summaryInputRef}
          variant="line"
          label="테스트 한줄 소개"
          labelOption="sustain"
          value={form.summary}
          onChange={(e) => { if (e.target.value.length <= MAX_LENGTH) form.setSummary(e.target.value); }}
          onClear={() => { form.setSummary(""); summaryInputRef.current?.focus(); }}
          placeholder="테스트 한줄 소개"
          maxLength={MAX_LENGTH}
          help="최대 250자"
        />
        <TextField.Button
          variant="line"
          label="카테고리"
          value={categoryDisplayValue}
          placeholder="카테고리"
          onClick={handleOpenCategorySheet}
        />
      </main>
      <FixedBottomCTA.Double
        leftButton={
          <CTAButton color="dark" variant="weak" onClick={handleCancel}>
            닫기
          </CTAButton>
        }
        rightButton={
          <CTAButton disabled={isSaveDisabled} onClick={onClose}>
            수정완료
          </CTAButton>
        }
      />

      <AnimatePresence>
        {isCategorySheetOpen && (
          <CategorySelectSheet
            selectedCategories={form.categories}
            onToggle={form.toggleCategory}
            onConfirm={() => setIsCategorySheetOpen(false)}
            onCancel={handleCancelCategorySheet}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
