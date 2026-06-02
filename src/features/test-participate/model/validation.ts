import type { Answer, ParticipateQuestion } from "./types";

export function isAnswerValid(
  question: ParticipateQuestion,
  answer: Answer | undefined,
): boolean {
  if (!answer || answer.type !== question.type) return false;

  switch (question.type) {
    case "SUBJECTIVE": {
      const a = answer as Extract<Answer, { type: "SUBJECTIVE" }>;
      const text = a.text.trim();
      if (text.length === 0) return false;
      if (
        question.data.maxLength != null &&
        text.length > question.data.maxLength
      ) {
        return false;
      }
      return true;
    }
    case "OBJECTIVE": {
      const a = answer as Extract<Answer, { type: "OBJECTIVE" }>;
      const otherChoice = question.data.choices.find((c) => c.name === "기타 (직접 입력)");
      const isOtherSelected = !!otherChoice && a.selectedIds.includes(otherChoice.id);

      // "기타"가 선택됐는데 텍스트가 비어있으면 무효
      if (isOtherSelected && (a.otherText ?? "").trim().length === 0) {
        return false;
      }

      const n = a.selectedIds.length;

      if (!question.data.isMultiSelectEnabled) {
        return n === 1;
      }

      const minSelectCount =
        question.data.minSelectCount > 0 ? question.data.minSelectCount : 1;
      const maxSelectCount =
        question.data.maxSelectCount > 0
          ? question.data.maxSelectCount
          : question.data.choices.length;

      return n >= minSelectCount && n <= maxSelectCount;
    }
    case "TREE_TEST": {
      const a = answer as Extract<Answer, { type: "TREE_TEST" }>;
      return a.selectedNodeId !== null;
    }
    case "FIVE_SECOND": {
      const a = answer as Extract<Answer, { type: "FIVE_SECOND" }>;
      if (question.data.answerType === "subjective") {
        return (a.text ?? "").trim().length > 0;
      }
      const otherChoice = question.data.choices.find((c) => c.name === "기타 (직접 입력)");
      const isOtherSelected = !!otherChoice && a.selectedIds.includes(otherChoice.id);

      // "기타"가 선택됐는데 텍스트가 비어있으면 무효
      if (isOtherSelected && (a.text ?? "").trim().length === 0) {
        return false;
      }

      const n = a.selectedIds.length;

      if (!question.data.isMultiSelectEnabled) {
        return n === 1;
      }

      const minSelectCount =
        question.data.minSelectCount > 0 ? question.data.minSelectCount : 1;
      const maxSelectCount =
        question.data.maxSelectCount > 0
          ? question.data.maxSelectCount
          : question.data.choices.length;

      return n >= minSelectCount && n <= maxSelectCount;
    }
    case "SCALE": {
      const a = answer as Extract<Answer, { type: "SCALE" }>;
      if (a.value === null) return false;
      return a.value >= 1 && a.value <= question.data.scaleCount;
    }
    case "AB_TEST": {
      const a = answer as Extract<Answer, { type: "AB_TEST" }>;
      return a.selected !== null;
    }
    case "CARD_SORTING": {
      const a = answer as Extract<Answer, { type: "CARD_SORTING" }>;
      return Object.keys(a.placements).length === question.data.cards.length;
    }
  }
}

export function makeEmptyAnswer(question: ParticipateQuestion): Answer {
  switch (question.type) {
    case "SUBJECTIVE":
      return { type: "SUBJECTIVE", text: "" };
    case "OBJECTIVE":
      return { type: "OBJECTIVE", selectedIds: [] };
    case "TREE_TEST":
      return { type: "TREE_TEST", selectedNodeId: null };
    case "FIVE_SECOND":
      return { type: "FIVE_SECOND", selectedIds: [] };
    case "SCALE":
      return { type: "SCALE", value: null };
    case "AB_TEST":
      return { type: "AB_TEST", selected: null };
    case "CARD_SORTING":
      return { type: "CARD_SORTING", placements: {} };
  }
}
