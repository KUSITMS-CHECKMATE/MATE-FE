import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTestCreateForm } from "@/features/test-create/model/useTestCreateForm";
import type { CardSortCard, CardSortCategory } from "../model";
import { CardSortCreateBottomCTA } from "./CardSortCreateBottomCTA";
import { CardSortCreateOptionSection } from "./CardSortCreateOptionSection";
import { QuestionCreateTopSection } from "@/features/test-create/ui/QuestionCreateTopSection";
import { CardSortItemBottomSheet } from "./CardSortItemBottomSheet";
import { CardSortQuestionEditorOverlay } from "./CardSortQuestionEditorOverlay";

interface CardSortCreatePageProps {
  questionId: string;
  onClose: () => void;
}

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function CardSortCreatePage({ questionId, onClose }: CardSortCreatePageProps) {
  const { updateQuestion, questions } = useTestCreateForm();
  const existing = questions.find((q) => q.id === questionId)?.data;
  const existingCardSort = existing?.typeId === "card" ? existing : null;

  const [isQuestionEditorOpen, setIsQuestionEditorOpen] = useState(false);
  const [questionTitle, setQuestionTitle] = useState(existingCardSort?.title ?? "");
  const [questionDescription, setQuestionDescription] = useState(existingCardSort?.description ?? "");
  const [categories, setCategories] = useState<CardSortCategory[]>(existingCardSort?.categories ?? []);
  const [cards, setCards] = useState<CardSortCard[]>(existingCardSort?.cards ?? []);

  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [isCardSheetOpen, setIsCardSheetOpen] = useState(false);

  const editingCategory = categories.find((c) => c.id === editingCategoryId) ?? null;
  const editingCard = cards.find((c) => c.id === editingCardId) ?? null;

  const isCompleteDisabled =
    questionTitle.trim().length === 0 || categories.length === 0 || cards.length === 0;

  const handleOpenAddCategory = () => {
    setEditingCategoryId(null);
    setIsCategorySheetOpen(true);
  };

  const handleOpenEditCategory = (id: string) => {
    setEditingCategoryId(id);
    setIsCategorySheetOpen(true);
  };

  const handleConfirmCategory = (label: string) => {
    if (editingCategoryId) {
      setCategories((prev) =>
        prev.map((c) => (c.id === editingCategoryId ? { ...c, label } : c)),
      );
    } else {
      setCategories((prev) => [...prev, { id: generateId(), label }]);
    }
    setIsCategorySheetOpen(false);
    setEditingCategoryId(null);
  };

  const handleOpenAddCard = () => {
    setEditingCardId(null);
    setIsCardSheetOpen(true);
  };

  const handleOpenEditCard = (id: string) => {
    setEditingCardId(id);
    setIsCardSheetOpen(true);
  };

  const handleConfirmCard = (label: string) => {
    if (editingCardId) {
      setCards((prev) =>
        prev.map((c) => (c.id === editingCardId ? { ...c, label } : c)),
      );
    } else {
      setCards((prev) => [...prev, { id: generateId(), label }]);
    }
    setIsCardSheetOpen(false);
    setEditingCardId(null);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-white pb-28"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <QuestionCreateTopSection
        questionTitle={questionTitle}
        questionDescription={questionDescription}
        onOpenQuestionEditor={() => setIsQuestionEditorOpen(true)}
        subtitle="카드 소팅"
      />
      <CardSortCreateOptionSection
        categories={categories}
        cards={cards}
        onAddCategory={handleOpenAddCategory}
        onEditCategory={handleOpenEditCategory}
        onDeleteCategory={(id) => setCategories((prev) => prev.filter((c) => c.id !== id))}
        onAddCard={handleOpenAddCard}
        onEditCard={handleOpenEditCard}
        onDeleteCard={(id) => setCards((prev) => prev.filter((c) => c.id !== id))}
      />
      <CardSortCreateBottomCTA
        isCompleteDisabled={isCompleteDisabled}
        onCancel={onClose}
        onComplete={() => {
          updateQuestion(questionId, {
            typeId: "card",
            title: questionTitle,
            description: questionDescription,
            categories,
            cards,
            requireAllPlaced: false,
          });
          onClose();
        }}
      />

      <CardSortItemBottomSheet
        open={isCategorySheetOpen}
        title={editingCategoryId ? "카테고리 수정하기" : "카테고리 추가하기"}
        placeholder="카테고리 이름"
        initialValue={editingCategory?.label ?? ""}
        onClose={() => {
          setIsCategorySheetOpen(false);
          setEditingCategoryId(null);
        }}
        onConfirm={handleConfirmCategory}
      />

      <CardSortItemBottomSheet
        open={isCardSheetOpen}
        title={editingCardId ? "카드 수정하기" : "카드 추가하기"}
        placeholder="카드 이름"
        initialValue={editingCard?.label ?? ""}
        onClose={() => {
          setIsCardSheetOpen(false);
          setEditingCardId(null);
        }}
        onConfirm={handleConfirmCard}
      />

      <AnimatePresence>
        {isQuestionEditorOpen && (
          <CardSortQuestionEditorOverlay
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
      </AnimatePresence>
    </motion.div>
  );
}
