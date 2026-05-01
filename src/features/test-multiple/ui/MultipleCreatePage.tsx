import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { MultipleChoiceItem } from "../model/types";
import { MultipleCreateBottomCTA } from "./MultipleCreateBottomCTA";
import { MultipleChoiceEditorOverlay } from "./MultipleChoiceEditorOverlay";
import { MultipleCreateOptionSection } from "./MultipleCreateOptionSection";
import { MultipleQuestionEditorOverlay } from "./MultipleQuestionEditorOverlay";
import { MultipleCreateTopSection } from "./MultipleCreateTopSection";
import { useTestCreateForm } from "@/features/test-create/model/useTestCreateForm";

function revokeChoiceImageUrl(imageUrl: string) {
  if (imageUrl.startsWith("blob:")) {
    URL.revokeObjectURL(imageUrl);
  }
}

interface MultipleCreatePageProps {
  questionId: string;
  onClose: () => void;
}

export function MultipleCreatePage({ questionId, onClose }: MultipleCreatePageProps) {
  const { updateQuestion, questions } = useTestCreateForm();
  const existing = questions.find((q) => q.id === questionId)?.data;

  const [isOtherInputEnabled, setIsOtherInputEnabled] = useState(existing?.typeId === "multiple" ? existing.isOtherInputEnabled : false);
  const [isMultiSelectEnabled, setIsMultiSelectEnabled] = useState(existing?.typeId === "multiple" ? existing.isMultiSelectEnabled : false);
  const [isQuestionEditorOpen, setIsQuestionEditorOpen] = useState(false);
  const [isChoiceEditorOpen, setIsChoiceEditorOpen] = useState(false);
  const [questionTitle, setQuestionTitle] = useState(existing?.typeId === "multiple" ? existing.title : "");
  const [questionDescription, setQuestionDescription] = useState(existing?.typeId === "multiple" ? existing.description : "");
  const [choices, setChoices] = useState<MultipleChoiceItem[]>(existing?.typeId === "multiple" ? existing.choices : []);
  const [draftChoices, setDraftChoices] = useState<MultipleChoiceItem[]>([]);
  const [isChoiceManageMode, setIsChoiceManageMode] = useState(false);
  const [minSelectCount, setMinSelectCount] = useState(existing?.typeId === "multiple" ? existing.minSelectCount : 1);
  const [maxSelectCount, setMaxSelectCount] = useState(existing?.typeId === "multiple" ? existing.maxSelectCount : 2);
  const [editingChoiceId, setEditingChoiceId] = useState<string | null>(null);

  const visibleChoices = isChoiceManageMode ? draftChoices : choices;
  const editingChoice = visibleChoices.find((choice) => choice.id === editingChoiceId) ?? null;
  const isCompleteDisabled = questionTitle.trim().length === 0 || choices.length === 0;

  const setActiveChoices = (updater: MultipleChoiceItem[] | ((prev: MultipleChoiceItem[]) => MultipleChoiceItem[])) => {
    if (isChoiceManageMode) setDraftChoices(updater);
    else setChoices(updater);
  };

  const handleOpenCreateChoiceEditor = () => {
    setEditingChoiceId(null);
    setIsChoiceEditorOpen(true);
  };

  const handleOpenEditChoiceEditor = (choiceId: string) => {
    setEditingChoiceId(choiceId);
    setIsChoiceEditorOpen(true);
  };

  const handleToggleChoiceManageMode = () => {
    if (isChoiceManageMode) {
      setChoices(draftChoices);
      setIsChoiceManageMode(false);
      return;
    }

    setDraftChoices(choices);
    setIsChoiceManageMode(true);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-white pb-28"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <MultipleCreateTopSection
        questionTitle={questionTitle}
        questionDescription={questionDescription}
        onOpenQuestionEditor={() => setIsQuestionEditorOpen(true)}
      />
      <MultipleCreateOptionSection
        isOtherInputEnabled={isOtherInputEnabled}
        isMultiSelectEnabled={isMultiSelectEnabled}
        choices={visibleChoices}
        isChoiceManageMode={isChoiceManageMode}
        minSelectCount={minSelectCount}
        maxSelectCount={maxSelectCount}
        onToggleOtherInput={setIsOtherInputEnabled}
        onToggleMultiSelect={(checked) => {
          setIsMultiSelectEnabled(checked);
          if (!checked) {
            setMinSelectCount(1);
            setMaxSelectCount(Math.max(Math.min(2, Math.max(choices.length, 1)), 1));
          }
        }}
        onChangeMinSelectCount={(value) => {
          setMinSelectCount(value);
          if (value > maxSelectCount) {
            setMaxSelectCount(value);
          }
        }}
        onChangeMaxSelectCount={(value) => {
          setMaxSelectCount(value);
          if (value < minSelectCount) {
            setMinSelectCount(value);
          }
        }}
        onOpenChoiceEditor={handleOpenCreateChoiceEditor}
        onEditChoice={handleOpenEditChoiceEditor}
        onToggleChoiceManageMode={handleToggleChoiceManageMode}
        onDeleteChoice={(choiceId) => {
          const deletedChoice = visibleChoices.find((choice) => choice.id === choiceId);
          if (deletedChoice?.imageUrl) revokeChoiceImageUrl(deletedChoice.imageUrl);
          setActiveChoices(visibleChoices.filter((choice) => choice.id !== choiceId));
        }}
        onReorderChoices={(nextChoices) => setActiveChoices(nextChoices)}
        onRemoveChoiceImage={(choiceId) =>
          setActiveChoices((prev) =>
            prev.map((choice) =>
              choice.id === choiceId
                ? (revokeChoiceImageUrl(choice.imageUrl), { ...choice, imageUrl: "" })
                : choice,
            ),
          )
        }
      />
      <MultipleCreateBottomCTA
        isCompleteDisabled={isCompleteDisabled}
        onCancel={onClose}
        onComplete={() => {
          updateQuestion(questionId, {
            typeId: "multiple",
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

      <AnimatePresence>
        {isQuestionEditorOpen && (
          <MultipleQuestionEditorOverlay
            initialTitle={questionTitle}
            initialDescription={questionDescription}
            onClose={() => setIsQuestionEditorOpen(false)}
            onSave={({ title, description }) => {
              setQuestionTitle(title);
              setQuestionDescription(description);
              setIsQuestionEditorOpen(false);
            }}
          />
        )}
        {isChoiceEditorOpen && (
          <MultipleChoiceEditorOverlay
            initialChoiceName={editingChoice?.name ?? ""}
            initialImageUrl={editingChoice?.imageUrl ?? ""}
            onClose={() => setIsChoiceEditorOpen(false)}
            submitLabel={editingChoice ? "수정하기" : "만들기"}
            onCreate={({ choiceName, imageUrl }) => {
              if (editingChoice) {
                setActiveChoices((prev) =>
                  prev.map((choice) =>
                    choice.id === editingChoice.id
                      ? (() => {
                          if (choice.imageUrl !== imageUrl) revokeChoiceImageUrl(choice.imageUrl);
                          return { ...choice, name: choiceName, imageUrl };
                        })()
                      : choice,
                  ),
                );
              } else {
                const nextChoice = {
                  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                  name: choiceName,
                  imageUrl,
                };
                setActiveChoices((prev) => [...prev, nextChoice]);
                setMaxSelectCount((prev) => Math.min(Math.max(prev, 2), Math.max(choices.length + 1, 1)));
              }
              setIsChoiceEditorOpen(false);
              setEditingChoiceId(null);
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
