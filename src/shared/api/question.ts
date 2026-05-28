import { useQuery } from "@tanstack/react-query";
import { getQuestionDetail, getQuestionSummary } from "./generated/question";
import type { ParticipateQuestion } from "@/features/test-participate/model/types";
import type { QuestionType } from "@/shared/api/report";
import type { AbRatio } from "@/shared/constants/imageRatio";

// ─── API 응답 타입 ───────────────────────────────────────────────

interface QuestionOptionItem {
  objectiveOptionId?: number;
  fiveSecondOptionId?: number;
  content: string;
  imageUrl?: string | null;
  sequence: number;
  isOtherOption: boolean;
}

interface TreeFeatureNode {
  treeTestId: number;
  label: string;
  children: TreeFeatureNode[];
}

interface BaseQuestion {
  questionId: number;
  type: string;
  sequence: number;
  title: string;
  description: string;
}

interface ObjectiveQuestionRaw extends BaseQuestion {
  type: "OBJECTIVE";
  isDuplicate: boolean;
  minSelect: number | null;
  maxSelect: number | null;
  isOther: boolean;
  options: QuestionOptionItem[];
}

interface SubjectiveQuestionRaw extends BaseQuestion {
  type: "SUBJECTIVE";
  imageUrl: string | null;
}

interface FiveSecondQuestionRaw extends BaseQuestion {
  type: "FIVE_SECOND";
  imageUrl: string | null;
  imageRatio: string | null;
  isObjective: boolean;
  isDuplicate: boolean;
  minSelect: number | null;
  maxSelect: number | null;
  isOther: boolean;
  options: QuestionOptionItem[];
}

interface ScaleQuestionRaw extends BaseQuestion {
  type: "SCALE";
  imageUrl: string | null;
  minLabel: string;
  maxLabel: string;
  range: number;
}

interface AbTestQuestionRaw extends BaseQuestion {
  type: "AB_TEST";
  aImageUrl: string;
  bImageUrl: string;
  imageRatio: string | null;
}

interface CardSortingQuestionRaw extends BaseQuestion {
  type: "CARD_SORTING";
  cards: string[];
  categories: string[];
}

interface TreeTestQuestionRaw extends BaseQuestion {
  type: "TREE_TEST";
  features: TreeFeatureNode[];
}

type QuestionRaw =
  | ObjectiveQuestionRaw
  | SubjectiveQuestionRaw
  | FiveSecondQuestionRaw
  | ScaleQuestionRaw
  | AbTestQuestionRaw
  | CardSortingQuestionRaw
  | TreeTestQuestionRaw;

interface QuestionDetailData {
  testId: number;
  question: QuestionRaw;
}

// ─── 트리 노드 재귀 변환 ──────────────────────────────────────────

function mapTreeNode(node: TreeFeatureNode): { id: string; name: string; children: ReturnType<typeof mapTreeNode>[] } {
  return {
    id: String(node.treeTestId),
    name: node.label,
    children: node.children.map(mapTreeNode),
  };
}

// ─── API 응답 → ParticipateQuestion 변환 ─────────────────────────

export function mapQuestionRawToParticipate(raw: QuestionRaw): ParticipateQuestion {
  switch (raw.type) {
    case "OBJECTIVE":
      return {
        id: String(raw.questionId),
        type: "OBJECTIVE",
        data: {
          title: raw.title,
          description: raw.description,
          choices: raw.options.map((o) => ({
            id: String(o.objectiveOptionId ?? o.sequence),
            name: o.content,
            imageUrl: o.imageUrl ?? "",
          })),
          isMultiSelectEnabled: raw.isDuplicate,
          isOtherInputEnabled: raw.isOther,
          minSelectCount: raw.minSelect ?? 1,
          maxSelectCount: raw.maxSelect ?? 1,
        },
      };

    case "SUBJECTIVE":
      return {
        id: String(raw.questionId),
        type: "SUBJECTIVE",
        data: {
          title: raw.title,
          description: raw.description,
          imageUrl: raw.imageUrl ?? "",
          placeholder: "",
          maxLength: null,
        },
      };

    case "FIVE_SECOND":
      return {
        id: String(raw.questionId),
        type: "FIVE_SECOND",
        data: {
          title: raw.title,
          description: raw.description,
          imageUrl: raw.imageUrl ?? "",
          duration: 5,
          answerExample: "",
          answerType: raw.isObjective ? "multiple" : "subjective",
          isMultipleAnswer: raw.isDuplicate,
          isOtherInputEnabled: raw.isOther,
          isMultiSelectEnabled: raw.isDuplicate,
          choices: (raw.options ?? []).map((o) => ({
            id: String(o.fiveSecondOptionId ?? o.sequence),
            name: o.content,
            imageUrl: o.imageUrl ?? "",
          })),
          minSelectCount: raw.minSelect ?? 1,
          maxSelectCount: raw.maxSelect ?? 1,
          ratio: (raw.imageRatio ?? undefined) as AbRatio | undefined,
        },
      };

    case "SCALE":
      return {
        id: String(raw.questionId),
        type: "SCALE",
        data: {
          title: raw.title,
          description: raw.description,
          scaleCount: (raw.range === 7 ? 7 : 5) as 5 | 7,
          minLabel: raw.minLabel,
          maxLabel: raw.maxLabel,
        },
      };

    case "AB_TEST":
      return {
        id: String(raw.questionId),
        type: "AB_TEST",
        data: {
          title: raw.title,
          description: raw.description,
          imageUrlA: raw.aImageUrl,
          imageUrlB: raw.bImageUrl,
          ratio: (raw.imageRatio ?? undefined) as AbRatio | undefined,
        },
      };

    case "CARD_SORTING":
      return {
        id: String(raw.questionId),
        type: "CARD_SORTING",
        data: {
          title: raw.title,
          description: raw.description,
          cards: raw.cards.map((label, i) => ({ id: String(i), label })),
          categories: raw.categories.map((label, i) => ({ id: String(i), label })),
          requireAllPlaced: true,
        },
      };

    case "TREE_TEST":
      return {
        id: String(raw.questionId),
        type: "TREE_TEST",
        data: {
          title: raw.title,
          description: raw.description,
          nodes: raw.features.map(mapTreeNode),
        },
      };
  }
}

// ─── useQuery 훅 ──────────────────────────────────────────────────

export interface QuestionSummaryListItem {
  questionId: number;
  sequence: number;
  title: string;
  type: QuestionType;
}

export function useGetQuestionSummaryQuery(testId: number) {
  return useQuery({
    queryKey: ["questionSummary", testId],
    queryFn: async () => {
      const res = await getQuestionSummary(testId);
      const items = res.data.data?.questions ?? [];
      return items.map((q) => ({
        questionId: q.questionId!,
        sequence: q.sequence!,
        title: q.title ?? "",
        type: (q.type ?? "SUBJECTIVE") as QuestionType,
      })) as QuestionSummaryListItem[];
    },
    enabled: !!testId,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 30,
  });
}

export function useGetQuestionDetailQuery(testId: number, questionId: number | null) {
  return useQuery({
    queryKey: ["questionDetail", testId, questionId],
    queryFn: async () => {
      const res = await getQuestionDetail(testId, questionId!);
      const body = (res.data as { data: QuestionDetailData });
      return mapQuestionRawToParticipate(body.data.question);
    },
    enabled: questionId !== null,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 30,
  });
}
