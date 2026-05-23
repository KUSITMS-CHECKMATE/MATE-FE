import { motion } from "framer-motion";
import { TextField } from "@toss/tds-mobile";
import { useTestCreateForm, type TestCreateFormStore } from "../model/useTestCreateForm";
import { BASIC_SUB_STEPS, CATEGORIES, type BasicSubStep } from "../model/types";

const STEP_CONFIG: Record<
  Exclude<BasicSubStep, "category">,
  { label: string; placeholder: string; maxLength?: number; help?: string }
> = {
  name: { label: "테스트 이름", placeholder: "테스트 이름" },
  summary: { label: "테스트 한줄 소개", placeholder: "테스트 한줄 소개", maxLength: 60, help: "최대 60자" },
};

function getSubStepValue(subStep: BasicSubStep, form: TestCreateFormStore): string {
  switch (subStep) {
    case "name":
      return form.name;
    case "summary":
      return form.summary;
    default:
      return "";
  }
}

function setSubStepValue(subStep: BasicSubStep, form: TestCreateFormStore, value: string) {
  switch (subStep) {
    case "name":
      form.setName(value);
      break;
    case "summary":
      form.setSummary(value);
      break;
  }
}

interface TestBasicInfoStepProps {
  subStep: BasicSubStep;
  onOpenCategorySheet: () => void;
  onFocus: () => void;
  onBlur: () => void;
}

export function TestBasicInfoStep({ subStep, onOpenCategorySheet, onFocus, onBlur }: TestBasicInfoStepProps) {
  const form = useTestCreateForm();

  const categoryDisplayValue = form.categories
    .map((id) => CATEGORIES.find((c) => c.id === id)?.label)
    .filter(Boolean)
    .join(", ");

  const currentSubIndex = BASIC_SUB_STEPS.indexOf(subStep);
  const completedSubSteps = BASIC_SUB_STEPS.slice(0, currentSubIndex);

  return (
    <div className="pt-6">
      {/* 현재 활성 입력 */}
      {subStep === "category" ? (
        <motion.div key="category" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
          <TextField.Button variant="line" hasError={false} label="카테고리" value={categoryDisplayValue} placeholder="카테고리" onClick={onOpenCategorySheet} />
        </motion.div>
      ) : (
        <motion.div key={subStep} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
          <TextField.Clearable
            variant="line"
            hasError={false}
            label={STEP_CONFIG[subStep].label}
            labelOption="appear"
            value={getSubStepValue(subStep, form)}
            onChange={(e) => {
              const config = STEP_CONFIG[subStep];
              if (config.maxLength && e.target.value.length > config.maxLength) return;
              setSubStepValue(subStep, form, e.target.value);
            }}
            onClear={() => setSubStepValue(subStep, form, "")}
            placeholder={STEP_CONFIG[subStep].placeholder}
            help={STEP_CONFIG[subStep].help}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </motion.div>
      )}

      {/* 완료된 항목들 (최신순으로 위에) */}
      {[...completedSubSteps].reverse().map((s) => {
        if (s === "category") {
          return <TextField.Button key={s} variant="line" label="카테고리" value={categoryDisplayValue} placeholder="카테고리" onClick={onOpenCategorySheet} />;
        }
        return (
          <TextField.Clearable
            key={s}
            variant="line"
            label={STEP_CONFIG[s].label}
            labelOption="sustain"
            value={getSubStepValue(s, form)}
            onChange={(e) => setSubStepValue(s, form, e.target.value)}
          />
        );
      })}
    </div>
  );
}
