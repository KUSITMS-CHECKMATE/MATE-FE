import type { ParticipateQuestion, ParticipateTest, Answer } from "../model/types";
import type { TreeNodeItem } from "@/features/question-tree/model/types";
import type { ApiQuestion, ApiTreeNode, ApiQuestionsDetailData } from "./types";
import type { AnswerCreateRequest } from "@/shared/api/generated/answer";

function mapApiTreeNode(node: ApiTreeNode): TreeNodeItem {
  return {
    id: String(node.id),
    name: node.name,
    children: node.children.map(mapApiTreeNode),
  };
}

function mapApiQuestionToLocal(q: ApiQuestion): ParticipateQuestion {
  const id = String(q.questionId);

  switch (q.type) {
    case "SUBJECTIVE":
      return {
        id,
        type: "SUBJECTIVE",
        data: {
          title: q.title,
          description: q.description ?? "",
          imageUrl: q.imageUrl ?? "",
          placeholder: q.placeholder ?? "",
          maxLength: q.maxLength ?? null,
        },
      };
    case "OBJECTIVE":
      return {
        id,
        type: "OBJECTIVE",
        data: {
          title: q.title,
          description: q.description ?? "",
          choices: (q.options ?? []).map((c) => ({
            id: String(c.objectiveOptionId),
            name: c.content,
            imageUrl: c.imageUrl ?? "",
          })),
          isMultiSelectEnabled: q.isMultiSelectEnabled,
          isOtherInputEnabled: q.isOtherInputEnabled,
          minSelectCount: q.minSelectCount,
          maxSelectCount: q.maxSelectCount,
        },
      };
    case "SCALE":
      return {
        id,
        type: "SCALE",
        data: {
          title: q.title,
          description: q.description ?? "",
          scaleCount: q.scaleCount,
          minLabel: q.minLabel,
          maxLabel: q.maxLabel,
          imageUrl: q.imageUrl,
        },
      };
    case "AB_TEST":
      return {
        id,
        type: "AB_TEST",
        data: {
          title: q.title,
          description: q.description ?? "",
          imageUrlA: q.imageUrlA,
          imageUrlB: q.imageUrlB,
        },
      };
    case "CARD_SORTING":
      return {
        id,
        type: "CARD_SORTING",
        data: {
          title: q.title,
          description: q.description ?? "",
          cards: (q.cards ?? []).map((c) => ({ id: String(c.id), label: c.name })),
          categories: (q.categories ?? []).map((c) => ({ id: String(c.id), label: c.name })),
          requireAllPlaced: q.requireAllPlaced,
        },
      };
    case "TREE_TEST":
      return {
        id,
        type: "TREE_TEST",
        data: {
          title: q.title,
          description: q.description ?? "",
          nodes: (q.nodes ?? []).map(mapApiTreeNode),
        },
      };
    case "FIVE_SECOND":
      return {
        id,
        type: "FIVE_SECOND",
        data: {
          title: q.title,
          description: q.description ?? "",
          imageUrl: q.imageUrl ?? "",
          duration: q.duration,
          answerExample: "",
          answerType: q.answerType,
          isMultipleAnswer: q.isMultipleAnswer,
          isOtherInputEnabled: q.isOtherInputEnabled,
          isMultiSelectEnabled: q.isMultiSelectEnabled,
          choices: (q.choices ?? []).map((c) => ({
            id: String(c.id),
            name: c.name,
            imageUrl: c.imageUrl ?? "",
          })),
          minSelectCount: q.minSelectCount,
          maxSelectCount: q.maxSelectCount,
          placeholder: q.placeholder,
        },
      };
  }
}

export function mapApiToParticipateTest(data: ApiQuestionsDetailData): ParticipateTest {
  return {
    id: data.testId,
    title: "",
    questions: data.questions.map(mapApiQuestionToLocal),
  };
}

function findTreePath(nodes: TreeNodeItem[], targetId: string): string[] | null {
  for (const node of nodes) {
    if (node.id === targetId) return [node.id];
    const childPath = findTreePath(node.children, targetId);
    if (childPath !== null) return [node.id, ...childPath];
  }
  return null;
}

export function mapAnswersToApiRequest(
  questions: ParticipateQuestion[],
  answers: Record<string, Answer>,
): AnswerCreateRequest {
  const answerItems = questions.map((question) => {
    const answer = answers[question.id];
    const questionId = Number(question.id);

    switch (question.type) {
      case "SUBJECTIVE": {
        const a = answer as Extract<Answer, { type: "SUBJECTIVE" }>;
        return { type: "SUBJECTIVE", questionId, text: a.text };
      }
      case "OBJECTIVE": {
        const a = answer as Extract<Answer, { type: "OBJECTIVE" }>;
        return {
          type: "OBJECTIVE",
          questionId,
          optionIds: a.selectedIds.map(Number),
          otherText: a.otherText,
        };
      }
      case "TREE_TEST": {
        const a = answer as Extract<Answer, { type: "TREE_TEST" }>;
        const selectedNodeId = a.selectedNodeId!;
        const path = findTreePath(question.data.nodes, selectedNodeId) ?? [selectedNodeId];
        return {
          type: "TREE_TEST",
          questionId,
          nodeId: Number(selectedNodeId),
          path: path.map(Number),
        };
      }
      case "FIVE_SECOND": {
        const a = answer as Extract<Answer, { type: "FIVE_SECOND" }>;
        return {
          type: "FIVE_SECOND",
          questionId,
          optionIds: a.selectedIds.map(Number),
          text: a.text,
        };
      }
      case "SCALE": {
        const a = answer as Extract<Answer, { type: "SCALE" }>;
        return { type: "SCALE", questionId, value: a.value! };
      }
      case "AB_TEST": {
        const a = answer as Extract<Answer, { type: "AB_TEST" }>;
        return { type: "AB_TEST", questionId, selected: a.selected! };
      }
      case "CARD_SORTING": {
        const a = answer as Extract<Answer, { type: "CARD_SORTING" }>;
        const cardMap = new Map(question.data.cards.map((c) => [c.id, c.label]));
        const catMap = new Map(question.data.categories.map((c) => [c.id, c.label]));

        const groupMap = new Map<string, string[]>();
        for (const [cardId, catId] of Object.entries(a.placements)) {
          const catLabel = catMap.get(catId) ?? catId;
          const cardLabel = cardMap.get(cardId) ?? cardId;
          if (!groupMap.has(catLabel)) groupMap.set(catLabel, []);
          groupMap.get(catLabel)!.push(cardLabel);
        }

        return {
          type: "CARD_SORTING",
          questionId,
          groups: Array.from(groupMap.entries()).map(([category, cardNames]) => ({
            category,
            cardNames,
          })),
        };
      }
    }
  });

  return { answers: answerItems };
}
