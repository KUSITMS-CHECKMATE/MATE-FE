import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TextArea } from "@toss/tds-mobile";
import { useTestCreateForm } from "@/features/test-create/model/useTestCreateForm";
import { SubjectiveCreateTopSection } from "./SubjectiveCreateTopSection";
import { SubjectiveCreateBottomCTA } from "./SubjectiveCreateBottomCTA";
import { SubjectiveQuestionEditorOverlay } from "./SubjectiveQuestionEditorOverlay";

interface SubjectiveCreatePageProps {
  questionId: string;
  onClose: () => void;
}

export function SubjectiveCreatePage({ questionId, onClose }: SubjectiveCreatePageProps) {
  const { updateQuestion, questions } = useTestCreateForm();
  const existing = questions.find((q) => q.id === questionId)?.data;

  const [questionTitle, setQuestionTitle] = useState(
    existing?.typeId === "subjective" ? existing.title : "",
  );
  const [questionDescription, setQuestionDescription] = useState(
    existing?.typeId === "subjective" ? existing.description : "",
  );
  const [questionImageUrl, setQuestionImageUrl] = useState(
    existing?.typeId === "subjective" ? existing.imageUrl : "",
  );
  const [placeholder] = useState(
    existing?.typeId === "subjective" ? existing.placeholder : "",
  );
  const [maxLength] = useState<number | null>(
    existing?.typeId === "subjective" ? existing.maxLength : null,
  );
  const [isQuestionEditorOpen, setIsQuestionEditorOpen] = useState(false);

  const isCompleteDisabled = questionTitle.trim().length === 0;

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-y-auto bg-white pb-28"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <SubjectiveCreateTopSection
        questionTitle={questionTitle}
        questionDescription={questionDescription}
        questionImageUrl={questionImageUrl}
        onOpenQuestionEditor={() => setIsQuestionEditorOpen(true)}
        onRemoveImage={() => setQuestionImageUrl("")}
      />

      {/* TODO: SubjectiveCreateOptionSection */}
      <TextArea
        variant="box"
        hasError={false}
        label="답변 작성"
        labelOption="sustain"
        value={placeholder}
        placeholder="예시 입력창이에요"
        height={200}
        readOnly
      />

      <SubjectiveCreateBottomCTA
        isCompleteDisabled={isCompleteDisabled}
        onCancel={onClose}
        onComplete={() => {
          updateQuestion(questionId, {
            typeId: "subjective",
            title: questionTitle,
            description: questionDescription,
            imageUrl: questionImageUrl,
            placeholder,
            maxLength,
          });
          onClose();
        }}
      />

      <AnimatePresence>
        {isQuestionEditorOpen && (
          <SubjectiveQuestionEditorOverlay
            key="question-editor"
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
