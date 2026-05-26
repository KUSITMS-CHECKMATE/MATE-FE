import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FixedBottomCTA } from "@toss/tds-mobile";
import type { MultipleChoiceItem } from "../model/types";
import { MultipleAnswerPage } from "@/features/question-multiple/answer/MultipleAnswerPage";
import { MultipleCreateBottomCTA } from "./MultipleCreateBottomCTA";
import { MultipleChoiceEditorOverlay } from "./MultipleChoiceEditorOverlay";
import { MultipleCreateOptionSection } from "./MultipleCreateOptionSection";
import { useTestCreateForm } from "@/features/test-create/model/useTestCreateForm";
import { QuestionCreateTopSection } from "@/features/test-create/ui/QuestionCreateTopSection";
import { TesterPreviewListRow } from "@/features/test-create/ui/TesterPreviewListRow";

interface MultipleCreatePageProps {
  questionId: string;
  onClose: () => void;
}

export function MultipleCreatePage({
  questionId,
  onClose,
}: MultipleCreatePageProps) {
  const { updateQuestion, questions } = useTestCreateForm();
  const existing = questions.find((q) => q.id === questionId)?.data;
  const existingMultiple = existing?.typeId === "OBJECTIVE" ? existing : null;

  const [isOtherInputEnabled, setIsOtherInputEnabled] = useState(
    existingMultiple?.isOtherInputEnabled ?? false,
  );
  const [isMultiSelectEnabled, setIsMultiSelectEnabled] = useState(
    existingMultiple?.isMultiSelectEnabled ?? false,
  );
  const [questionTitle, setQuestionTitle] = useState(
    existingMultiple?.title ?? "",
  );
  const [questionDescription, setQuestionDescription] = useState(
    existingMultiple?.description ?? "",
  );
  const [isQuestionInputCompleted, setIsQuestionInputCompleted] = useState(
    (existingMultiple?.title ?? "").trim().length > 0,
  );
  const [isChoiceEditorOpen, setIsChoiceEditorOpen] = useState(false);
  const [choices, setChoices] = useState<MultipleChoiceItem[]>(
    existingMultiple?.choices ?? [],
  );
  const [minSelectCount, setMinSelectCount] = useState(
    existingMultiple?.minSelectCount ?? 1,
  );
  const [maxSelectCount, setMaxSelectCount] = useState(
    existingMultiple?.maxSelectCount ?? 2,
  );
  const [editingChoiceId, setEditingChoiceId] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewAnswer, setPreviewAnswer] = useState<{ type: "OBJECTIVE"; selectedIds: string[] }>({ type: "OBJECTIVE", selectedIds: [] });

  const editingChoice = choices.find((choice) => choice.id === editingChoiceId) ?? null;
  const isCompleteDisabled = questionTitle.trim().length === 0 || choices.length < 2;

  const handleOpenCreateChoiceEditor = () => {
    setEditingChoiceId(null);
    setIsChoiceEditorOpen(true);
  };

  const handleOpenEditChoiceEditor = (choiceId: string) => {
    setEditingChoiceId(choiceId);
    setIsChoiceEditorOpen(true);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-y-auto bg-white pb-28"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <QuestionCreateTopSection
        questionType="객관식"
        questionTitle={questionTitle}
        questionDescription={questionDescription}
        onChangeTitle={setQuestionTitle}
        onChangeDescription={setQuestionDescription}
        isInputCompleted={isQuestionInputCompleted}
        onConfirmInput={() => setIsQuestionInputCompleted(true)}
        onClose={onClose}
      />
      {isQuestionInputCompleted && (
        <>
          <TesterPreviewListRow onClick={() => setIsPreviewOpen(true)} />
          <MultipleCreateOptionSection
            isOtherInputEnabled={isOtherInputEnabled}
            isMultiSelectEnabled={isMultiSelectEnabled}
            choices={choices}
            minSelectCount={minSelectCount}
            maxSelectCount={maxSelectCount}
            onToggleOtherInput={setIsOtherInputEnabled}
            onToggleMultiSelect={(checked) => {
              setIsMultiSelectEnabled(checked);
              if (!checked) {
                setMinSelectCount(1);
                setMaxSelectCount(
                  Math.max(Math.min(2, Math.max(choices.length, 1)), 1),
                );
              }
            }}
            onChangeMinSelectCount={(value) => {
              setMinSelectCount(value);
              if (value > maxSelectCount) setMaxSelectCount(value);
            }}
            onChangeMaxSelectCount={(value) => {
              setMaxSelectCount(value);
              if (value < minSelectCount) setMinSelectCount(value);
            }}
            onOpenChoiceEditor={handleOpenCreateChoiceEditor}
            onEditChoice={handleOpenEditChoiceEditor}
            onDeleteChoice={(choiceId) =>
              setChoices((prev) => prev.filter((c) => c.id !== choiceId))
            }
            onReorderChoices={setChoices}
            onRemoveChoiceImage={(choiceId) =>
              setChoices((prev) =>
                prev.map((c) => (c.id === choiceId ? { ...c, imageUrl: "" } : c)),
              )
            }
          />
          <MultipleCreateBottomCTA
            isCompleteDisabled={isCompleteDisabled}
            onCancel={onClose}
            onComplete={() => {
              updateQuestion(questionId, {
                typeId: "OBJECTIVE",
                title: questionTitle,
                description: questionDescription,
                choices,
                isMultiSelectEnabled,
                isOtherInputEnabled,
                minSelectCount,
                maxSelectCount,
              });
              onClose();
            }}
          />
        </>
      )}

      <AnimatePresence>
        {isChoiceEditorOpen && (
          <MultipleChoiceEditorOverlay
            initialChoiceName={editingChoice?.name ?? ""}
            initialImageUrl={editingChoice?.imageUrl ?? ""}
            onClose={() => setIsChoiceEditorOpen(false)}
            submitLabel={editingChoice ? "수정하기" : "만들기"}
            onCreate={({ choiceName, imageUrl }) => {
              if (editingChoice) {
                setChoices((prev) =>
                  prev.map((c) =>
                    c.id === editingChoice.id
                      ? { ...c, name: choiceName, imageUrl }
                      : c,
                  ),
                );
              } else {
                const nextChoice = {
                  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                  name: choiceName,
                  imageUrl,
                };
                setChoices((prev) => [...prev, nextChoice]);
                setMaxSelectCount((prev) =>
                  Math.min(Math.max(prev, 2), Math.max(choices.length + 1, 1)),
                );
              }
              setIsChoiceEditorOpen(false);
              setEditingChoiceId(null);
            }}
          />
        )}
      </AnimatePresence>

      {isPreviewOpen && (
        <motion.div
          className="fixed inset-0 z-60 flex flex-col overflow-y-auto bg-white pb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <MultipleAnswerPage
            question={{
              id: "preview",
              type: "OBJECTIVE",
              data: {
                title: questionTitle,
                description: questionDescription,
                choices,
                isMultiSelectEnabled,
                isOtherInputEnabled,
                minSelectCount,
                maxSelectCount,
              },
            }}
            answer={previewAnswer}
            onChange={setPreviewAnswer}
          />
          <FixedBottomCTA onClick={() => setIsPreviewOpen(false)}>
            돌아가기
          </FixedBottomCTA>
        </motion.div>
      )}
    </motion.div>
  );
}
