import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TextField, FixedBottomCTA, CTAButton, Top } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { CategorySelectSheet } from "./CategorySelectSheet";
import { useTestCreateForm } from "../model/useTestCreateForm";
import { CATEGORIES, type CategoryId } from "../model/types";

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
          variant="line"
          label="테스트 이름"
          labelOption="sustain"
          value={form.name}
          onChange={(e) => form.setName(e.target.value)}
          onClear={() => form.setName("")}
          placeholder="테스트 이름"
        />
        <TextField.Clearable
          variant="line"
          label="테스트 한줄 소개"
          labelOption="sustain"
          value={form.summary}
          onChange={(e) => {
            if (e.target.value.length > 60) return;
            form.setSummary(e.target.value);
          }}
          onClear={() => form.setSummary("")}
          placeholder="테스트 한줄 소개"
          help="최대 60자"
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
            취소
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
