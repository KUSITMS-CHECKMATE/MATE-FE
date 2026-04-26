import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TextField } from "@toss/tds-mobile";
import { FunnelLayout, type CTAMode } from "./FunnelLayout";
import { CategorySelectSheet } from "./CategorySelectSheet";
import { TestImageStep } from "./TestImageStep";
import { TestRegisterStep } from "./TestRegisterStep";
import { useFunnel } from "../model/useFunnel";
import { useTestCreateForm, type TestCreateFormStore } from "../model/useTestCreateForm";
import { STEPS, CATEGORIES } from "../model/types";
import type { Step } from "../model/types";

type InputStep = Exclude<Step, "register">;

const STEP_CONFIG: Record<InputStep, { label: string; placeholder: string; maxLength?: number; help?: string }> = {
  name: { label: "테스트 이름", placeholder: "테스트 이름" },
  summary: { label: "테스트 한줄 소개", placeholder: "테스트 한줄 소개", maxLength: 60, help: "최대 60자" },
  category: { label: "카테고리", placeholder: "" },
  image: { label: "테스트 이미지", placeholder: "" },
};

function getStepValue(step: InputStep, form: TestCreateFormStore): string {
  switch (step) {
    case "name":
      return form.name;
    case "summary":
      return form.summary;
    default:
      return "";
  }
}

function setStepValue(step: InputStep, form: TestCreateFormStore, value: string) {
  switch (step) {
    case "name":
      form.setName(value);
      break;
    case "summary":
      form.setSummary(value);
      break;
  }
}

export function TestCreateFunnel() {
  const funnel = useFunnel("image");
  const form = useTestCreateForm();
  const [isFocused, setIsFocused] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);

  const categoryDisplayValue = form.categories
    .map((id) => CATEGORIES.find((c) => c.id === id)?.label)
    .filter(Boolean)
    .join(", ");

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
    if (funnel.step === "image") return "double";
    if (isFocused) return "confirm";
    if (!hasInteracted) return "double";
    if (funnel.step === "category" && isAllComplete) return "double";
    return "hidden";
  })();

  const completedInputSteps = STEPS.slice(0, funnel.currentIndex).filter(
    (step): step is InputStep => step !== "register",
  );

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
        ) : funnel.step === "image" ? (
          <motion.div key="image" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
            <TestImageStep />
          </motion.div>
        ) : (
          <div className="pt-6">
            {/* 현재 활성 입력 */}
            {funnel.step === "category" ? (
              <motion.div key="category" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                <TextField.Button variant="line" hasError={false} label="카테고리" value={categoryDisplayValue} placeholder="카테고리" onClick={() => setIsCategorySheetOpen(true)} />
              </motion.div>
            ) : (
              <motion.div key={funnel.step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                <TextField.Clearable
                  variant="line"
                  hasError={false}
                  label={STEP_CONFIG[funnel.step as InputStep].label}
                  labelOption="appear"
                  value={getStepValue(funnel.step as InputStep, form)}
                  onChange={(e) => {
                    const config = STEP_CONFIG[funnel.step as InputStep];
                    if (config.maxLength && e.target.value.length > config.maxLength) return;
                    setStepValue(funnel.step as InputStep, form, e.target.value);
                  }}
                  onClear={() => setStepValue(funnel.step as InputStep, form, "")}
                  placeholder={STEP_CONFIG[funnel.step as InputStep].placeholder}
                  help={STEP_CONFIG[funnel.step as InputStep].help}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </motion.div>
            )}

            {/* 완료된 항목들 (최신순으로 위에) */}
            {[...completedInputSteps].reverse().map((step) => {
              if (step === "image") return null;
              if (step === "category") {
                return <TextField.Button key={step} variant="line" label="카테고리" value={categoryDisplayValue} placeholder="카테고리" onClick={() => setIsCategorySheetOpen(true)} />;
              }
              return (
                <TextField.Clearable
                  key={step}
                  variant="line"
                  label={STEP_CONFIG[step].label}
                  labelOption="sustain"
                  value={getStepValue(step, form)}
                  onChange={(e) => setStepValue(step, form, e.target.value)}
                />
              );
            })}
          </div>
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
