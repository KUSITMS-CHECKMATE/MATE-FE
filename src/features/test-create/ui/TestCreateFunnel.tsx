import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { FunnelLayout, type CTAMode } from "./FunnelLayout";
import { CategorySelectSheet } from "./CategorySelectSheet";
import { TestRegisterStep } from "./TestRegisterStep";
import { TestBasicInfoStep } from "./TestBasicInfoStep";
import { useFunnel } from "../model/useFunnel";
import { useTestCreateForm } from "../model/useTestCreateForm";

export function TestCreateFunnel() {
  const funnel = useFunnel();
  const form = useTestCreateForm();
  const [isFocused, setIsFocused] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);

  const isConfirmDisabled = (() => {
    switch (funnel.step) {
      case "name":
        return form.name.trim().length === 0;
      case "summary":
        return form.summary.trim().length === 0;
      default:
        return false;
    }
  })();

  const isAllComplete = form.name.trim().length > 0 && form.summary.trim().length > 0 && form.categories.length > 0;

  const ctaMode: CTAMode = (() => {
    if (isCategorySheetOpen) return "hidden";
    if (funnel.step === "register") return "submit";
    if (isFocused) return "confirm";
    if (!hasInteracted) return "double";
    if (funnel.step === "category" && isAllComplete) return "double";
    return "hidden";
  })();

  const handleFocus = () => {
    setIsFocused(true);
    setHasInteracted(true);
  };

  const handleBlur = () => {
    // 확인 버튼 클릭 이벤트가 먼저 처리되도록 딜레이
    setTimeout(() => setIsFocused(false), 150);
  };

  return (
    <>
      <FunnelLayout
        onConfirm={funnel.next}
        onNext={funnel.next}
        onSubmit={() => {
          // TODO: 테스트 만들기 제출
        }}
        currentStep={funnel.step}
        ctaMode={ctaMode}
        isConfirmDisabled={isConfirmDisabled}
        isNextDisabled={!isAllComplete}
        isSubmitDisabled
        submitLabel="테스트 만들기"
      >
        {funnel.step === "register" ? (
          <TestRegisterStep />
        ) : (
          <TestBasicInfoStep
            step={funnel.step}
            currentIndex={funnel.currentIndex}
            onOpenCategorySheet={() => setIsCategorySheetOpen(true)}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        )}
      </FunnelLayout>

      {/* 카테고리 선택 시트 */}
      <AnimatePresence>
        {isCategorySheetOpen && (
          <CategorySelectSheet
            selectedCategories={form.categories}
            onToggle={form.toggleCategory}
            onConfirm={() => setIsCategorySheetOpen(false)}
            onCancel={() => {
              form.setCategories([]);
              setIsCategorySheetOpen(false);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
