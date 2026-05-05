import type { Answer, ParticipateQuestion } from "./types";

export function isAnswerValid(
  question: ParticipateQuestion,
  answer: Answer | undefined,
): boolean {
  if (!answer || answer.type !== question.type) return false;

  switch (question.type) {
    case "subjective": {
      const a = answer as Extract<Answer, { type: "subjective" }>;
      const text = a.text.trim();
      if (text.length === 0) return false;
      if (question.data.maxLength != null && text.length > question.data.maxLength) {
        return false;
      }
      return true;
    }
    case "multiple": {
      const a = answer as Extract<Answer, { type: "multiple" }>;
      const { minSelectCount, maxSelectCount } = question.data;
      const n = a.selectedIds.length;
      return n >= minSelectCount && n <= maxSelectCount;
    }
    case "tree": {
      const a = answer as Extract<Answer, { type: "tree" }>;
      return a.selectedNodeId !== null;
    }
    case "fivesec": {
      const a = answer as Extract<Answer, { type: "fivesec" }>;
      const { minSelectCount, maxSelectCount } = question.data;
      const n = a.selectedIds.length;
      return n >= minSelectCount && n <= maxSelectCount;
    }
    case "scale": {
      const a = answer as Extract<Answer, { type: "scale" }>;
      if (a.value === null) return false;
      return a.value >= 1 && a.value <= question.data.scaleCount;
    }
    case "ab": {
      const a = answer as Extract<Answer, { type: "ab" }>;
      return a.selected !== null;
    }
    case "cardsort": {
      const a = answer as Extract<Answer, { type: "cardsort" }>;
      const placedCount = Object.keys(a.placements).length;
      if (question.data.requireAllPlaced) {
        return placedCount === question.data.cards.length;
      }
      return placedCount > 0;
    }
  }
}

export function makeEmptyAnswer(question: ParticipateQuestion): Answer {
  switch (question.type) {
    case "subjective":
      return { type: "subjective", text: "" };
    case "multiple":
      return { type: "multiple", selectedIds: [] };
    case "tree":
      return { type: "tree", selectedNodeId: null };
    case "fivesec":
      return { type: "fivesec", selectedIds: [] };
    case "scale":
      return { type: "scale", value: null };
    case "ab":
      return { type: "ab", selected: null };
    case "cardsort":
      return { type: "cardsort", placements: {} };
  }
}
