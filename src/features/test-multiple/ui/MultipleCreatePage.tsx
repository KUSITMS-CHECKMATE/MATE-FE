import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import type { MultipleChoiceItem } from "../model/types";
import { MultipleCreateBottomCTA } from "./MultipleCreateBottomCTA";
import { MultipleChoiceEditorOverlay } from "./MultipleChoiceEditorOverlay";
import { MultipleCreateOptionSection } from "./MultipleCreateOptionSection";
import { MultipleQuestionEditorOverlay } from "./MultipleQuestionEditorOverlay";
import { MultipleCreateTopSection } from "./MultipleCreateTopSection";

export function MultipleCreatePage() {
  const [isOtherInputEnabled, setIsOtherInputEnabled] = useState(false);
  const [isMultiSelectEnabled, setIsMultiSelectEnabled] = useState(false);
  const [isQuestionEditorOpen, setIsQuestionEditorOpen] = useState(false);
  const [isChoiceEditorOpen, setIsChoiceEditorOpen] = useState(false);
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionDescription, setQuestionDescription] = useState("");
  const [choices, setChoices] = useState<MultipleChoiceItem[]>([]);
  const [draftChoices, setDraftChoices] = useState<MultipleChoiceItem[]>([]);
  const [isChoiceManageMode, setIsChoiceManageMode] = useState(false);
  const [minSelectCount, setMinSelectCount] = useState(1);
  const [maxSelectCount, setMaxSelectCount] = useState(2);
  const [editingChoiceId, setEditingChoiceId] = useState<string | null>(null);

  const visibleChoices = isChoiceManageMode ? draftChoices : choices;
  const editingChoice = visibleChoices.find((choice) => choice.id === editingChoiceId) ?? null;
  const isCompleteDisabled = questionTitle.trim().length === 0 || choices.length === 0;

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

  const revokeChoiceImageUrl = (imageUrl: string) => {
    if (imageUrl.startsWith("blob:")) {
      URL.revokeObjectURL(imageUrl);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white pb-28">
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
          if (deletedChoice?.imageUrl) {
            revokeChoiceImageUrl(deletedChoice.imageUrl);
          }
          const nextChoices = visibleChoices.filter((choice) => choice.id !== choiceId);
          if (isChoiceManageMode) {
            setDraftChoices(nextChoices);
          } else {
            setChoices(nextChoices);
          }
        }}
        onReorderChoices={(nextChoices) => {
          if (isChoiceManageMode) {
            setDraftChoices(nextChoices);
          } else {
            setChoices(nextChoices);
          }
        }}
        onRemoveChoiceImage={(choiceId) =>
          isChoiceManageMode
            ? setDraftChoices((prev) =>
                prev.map((choice) =>
                  choice.id === choiceId
                    ? (revokeChoiceImageUrl(choice.imageUrl), { ...choice, imageUrl: "" })
                    : choice,
                ),
              )
            : setChoices((prev) =>
                prev.map((choice) =>
                  choice.id === choiceId
                    ? (revokeChoiceImageUrl(choice.imageUrl), { ...choice, imageUrl: "" })
                    : choice,
                ),
              )
        }
      />
      <MultipleCreateBottomCTA isCompleteDisabled={isCompleteDisabled} />

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
                const updateChoices = (prev: MultipleChoiceItem[]) =>
                  prev.map((choice) =>
                    choice.id === editingChoice.id
                      ? (() => {
                          if (choice.imageUrl !== imageUrl) {
                            revokeChoiceImageUrl(choice.imageUrl);
                          }
                          return { ...choice, name: choiceName, imageUrl };
                        })()
                      : choice,
                  );

                if (isChoiceManageMode) {
                  setDraftChoices(updateChoices);
                } else {
                  setChoices(updateChoices);
                }
              } else {
                const nextChoice = {
                  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                  name: choiceName,
                  imageUrl,
                };

                if (isChoiceManageMode) {
                  setDraftChoices((prev) => [...prev, nextChoice]);
                } else {
                  setChoices((prev) => [...prev, nextChoice]);
                }
                setMaxSelectCount((prev) => Math.min(Math.max(prev, 2), Math.max(choices.length + 1, 1)));
              }
              setIsChoiceEditorOpen(false);
              setEditingChoiceId(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
