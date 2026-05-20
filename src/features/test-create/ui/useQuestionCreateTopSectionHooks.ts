import { useState, useEffect, useRef } from "react";
import type { EditSheetConfig } from "./QuestionEditSheet";

export function useFocusState() {
  const [isFocused, setIsFocused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return {
    isFocused,
    onFocus: () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setIsFocused(true);
    },
    onBlur: () => {
      timerRef.current = setTimeout(() => setIsFocused(false), 100);
    },
    blur: () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setIsFocused(false);
      (document.activeElement as HTMLElement)?.blur();
    },
  };
}

export type EditingField = "title" | "description";

export function useEditSheet(questionType: string, titlePlaceholder: string) {
  const [editingField, setEditingField] = useState<EditingField | null>(null);
  const [draft, setDraft] = useState("");
  const [fieldVisible, setFieldVisible] = useState(false);
  const draftRef = useRef("");

  useEffect(() => {
    if (editingField === null) return;
    setDraft(draftRef.current);
    const t = setTimeout(() => setFieldVisible(true), 4);
    return () => {
      clearTimeout(t);
      setFieldVisible(false);
    };
  }, [editingField]);

  const config: EditSheetConfig =
    editingField === "title"
      ? {
          header: "어떻게 질문할까요?",
          label: `${questionType} 질문`,
          fieldPlaceholder: titlePlaceholder,
          maxLength: 34,
        }
      : {
          header: "(선택) 질문에 대한 추가 설명을 할까요?",
          label: "추가 설명",
          fieldPlaceholder: "추가 설명을 입력해주세요",
          maxLength: 55,
        };

  return {
    editingField,
    draft,
    fieldVisible,
    config,
    confirmDisabled: editingField === "title" && draft.trim().length === 0,
    open: (field: EditingField, initialValue: string) => {
      draftRef.current = initialValue;
      setDraft(initialValue);
      setEditingField(field);
    },
    close: () => {
      setEditingField(null);
      setDraft("");
    },
    setDraft,
  };
}
