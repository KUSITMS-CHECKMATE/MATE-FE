import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Border } from "@toss/tds-mobile";
import { useTestCreateForm } from "@/features/test-create/model/useTestCreateForm";
import { ScaleCreateBottomCTA } from "./ScaleCreateBottomCTA";
import { ScaleCreateOptionSection } from "./ScaleCreateOptionSection";
import { ScaleCreateTopSection } from "./ScaleCreateTopSection";
import { ScaleQuestionEditorOverlay } from "./ScaleQuestionEditorOverlay";

interface ScaleCreatePageProps {
  questionId: string;
  onClose: () => void;
}

export function ScaleCreatePage({ questionId, onClose }: ScaleCreatePageProps) {
  const { updateQuestion, questions } = useTestCreateForm();
  const existing = questions.find((q) => q.id === questionId)?.data;
  const existingScale = existing?.typeId === "scale" ? existing : null;

  const [isQuestionEditorOpen, setIsQuestionEditorOpen] = useState(false);
  const [questionTitle, setQuestionTitle] = useState(existingScale?.title ?? "");
  const [questionDescription, setQuestionDescription] = useState(existingScale?.description ?? "");
  const [questionImageUrl, setQuestionImageUrl] = useState(existingScale?.imageUrl ?? "");
  const [scaleCount, setScaleCount] = useState<5 | 7>(existingScale?.scaleCount ?? 5);
  const [minLabel, setMinLabel] = useState(existingScale?.minLabel ?? "");
  const [maxLabel, setMaxLabel] = useState(existingScale?.maxLabel ?? "");

  const isCompleteDisabled = questionTitle.trim().length === 0;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-white pb-28"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <ScaleCreateTopSection
        questionTitle={questionTitle}
        questionDescription={questionDescription}
        onOpenQuestionEditor={() => setIsQuestionEditorOpen(true)}
      />
      <ScaleCreateOptionSection
        scaleCount={scaleCount}
        minLabel={minLabel}
        maxLabel={maxLabel}
        onToggleSevenPoint={(checked) => setScaleCount(checked ? 7 : 5)}
        onChangeMinLabel={setMinLabel}
        onChangeMaxLabel={setMaxLabel}
      />
      <ScaleCreateBottomCTA
        isCompleteDisabled={isCompleteDisabled}
        onCancel={onClose}
        onComplete={() => {
          updateQuestion(questionId, {
            typeId: "scale",
            title: questionTitle,
            description: questionDescription,
            scaleCount,
            minLabel,
            maxLabel,
            ...(questionImageUrl.trim() ? { imageUrl: questionImageUrl.trim() } : {}),
          });
          onClose();
        }}
      />

      <AnimatePresence>
        {isQuestionEditorOpen && (
          <ScaleQuestionEditorOverlay
            initialTitle={questionTitle}
            initialDescription={questionDescription}
            initialImageUrl={questionImageUrl}
            onClose={() => setIsQuestionEditorOpen(false)}
            onSave={({ title, description, imageUrl }) => {
              setQuestionTitle(title);
              setQuestionDescription(description);
              setQuestionImageUrl(imageUrl);
              setIsQuestionEditorOpen(false);
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
