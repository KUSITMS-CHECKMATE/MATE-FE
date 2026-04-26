import { motion } from "framer-motion";
import { TextField } from "@toss/tds-mobile";
import { useTestCreateForm, type TestCreateFormStore } from "../model/useTestCreateForm";
import { STEPS, CATEGORIES, type Step } from "../model/types";

type InputStep = Exclude<Step, "register">;

const STEP_CONFIG: Record<InputStep, { label: string; placeholder: string; maxLength?: number; help?: string }> = {
  name: { label: "테스트 이름", placeholder: "테스트 이름" },
  summary: { label: "테스트 한줄 소개", placeholder: "테스트 한줄 소개", maxLength: 60, help: "최대 60자" },
  category: { label: "카테고리", placeholder: "" },
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

interface TestBasicInfoStepProps {
  step: InputStep;
  currentIndex: number;
  onOpenCategorySheet: () => void;
  onFocus: () => void;
  onBlur: () => void;
}

export function TestBasicInfoStep({ step, currentIndex, onOpenCategorySheet, onFocus, onBlur }: TestBasicInfoStepProps) {
  const form = useTestCreateForm();

  const categoryDisplayValue = form.categories
    .map((id) => CATEGORIES.find((c) => c.id === id)?.label)
    .filter(Boolean)
    .join(", ");

  const completedInputSteps = STEPS.slice(0, currentIndex).filter(
    (s): s is InputStep => s !== "register",
  );

  return (
    <div className="pt-6">
      {/* 현재 활성 입력 */}
      {step === "category" ? (
        <motion.div key="category" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
          <TextField.Button variant="line" hasError={false} label="카테고리" value={categoryDisplayValue} placeholder="카테고리" onClick={onOpenCategorySheet} />
        </motion.div>
      ) : (
        <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
          <TextField.Clearable
            variant="line"
            hasError={false}
            label={STEP_CONFIG[step].label}
            labelOption="appear"
            value={getStepValue(step, form)}
            onChange={(e) => {
              const config = STEP_CONFIG[step];
              if (config.maxLength && e.target.value.length > config.maxLength) return;
              setStepValue(step, form, e.target.value);
            }}
            onClear={() => setStepValue(step, form, "")}
            placeholder={STEP_CONFIG[step].placeholder}
            help={STEP_CONFIG[step].help}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </motion.div>
      )}

      {/* 완료된 항목들 (최신순으로 위에) */}
      {[...completedInputSteps].reverse().map((s) => {
        if (s === "category") {
          return <TextField.Button key={s} variant="line" label="카테고리" value={categoryDisplayValue} placeholder="카테고리" onClick={onOpenCategorySheet} />;
        }
        return (
          <TextField.Clearable
            key={s}
            variant="line"
            label={STEP_CONFIG[s].label}
            labelOption="sustain"
            value={getStepValue(s, form)}
            onChange={(e) => setStepValue(s, form, e.target.value)}
          />
        );
      })}
    </div>
  );
}
