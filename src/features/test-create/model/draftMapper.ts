import type { TestDraftResponse } from "@/shared/api/generated/testDraft";
import { CATEGORIES, type CategoryId } from "@/shared/constants/categories";
import type { AbRatio } from "@/shared/constants/imageRatio";
import { useTestCreateForm } from "./useTestCreateForm";
import type { PendingQuestion, QuestionData, QuestionTypeId } from "./types";
import type { TreeNodeItem } from "@/features/question-tree/model/types";

const VALID_CATEGORY_IDS = new Set<string>(CATEGORIES.map((c) => c.id));
const VALID_RATIOS: AbRatio[] = ["9:16", "1:1", "4:3"];

let seq = 0;
function genId(prefix: string): string {
  seq += 1;
  return `${prefix}-${Date.now()}-${seq}`;
}

function str(value: unknown): string {
  return typeof value === "string" ? value : "";
}
function num(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}
function bool(value: unknown): boolean {
  return value === true;
}
function ratio(value: unknown): AbRatio {
  return VALID_RATIOS.includes(value as AbRatio) ? (value as AbRatio) : "1:1";
}

interface RawTreeNode {
  label?: unknown;
  children?: unknown;
}

function toTreeNode(raw: RawTreeNode): TreeNodeItem {
  const children = Array.isArray(raw.children) ? raw.children : [];
  return {
    id: genId("tree"),
    name: str(raw.label),
    children: children.map((c) => toTreeNode((c ?? {}) as RawTreeNode)),
  };
}

type RawQuestion = Record<string, unknown>;

function mapRawQuestion(raw: RawQuestion): QuestionData | null {
  const type = raw.type as QuestionTypeId;
  const title = str(raw.title);
  const description = str(raw.description);
  const options = Array.isArray(raw.options) ? (raw.options as RawQuestion[]) : [];

  switch (type) {
    case "OBJECTIVE":
      return {
        typeId: "OBJECTIVE",
        title,
        description,
        choices: options.map((o) => ({
          id: genId("choice"),
          name: str(o.content),
          imageUrl: str(o.imageKey),
        })),
        isMultiSelectEnabled: bool(raw.isDuplicate),
        isOtherInputEnabled: bool(raw.isOther),
        minSelectCount: num(raw.minSelect) ?? 1,
        maxSelectCount: num(raw.maxSelect) ?? 1,
      };

    case "SUBJECTIVE":
      return {
        typeId: "SUBJECTIVE",
        title,
        description,
        imageUrl: str(raw.imageKey),
        placeholder: "",
        maxLength: null,
      };

    case "SCALE":
      return {
        typeId: "SCALE",
        title,
        description,
        scaleCount: num(raw.range) === 7 ? 7 : 5,
        minLabel: str(raw.minLabel),
        maxLabel: str(raw.maxLabel),
        imageUrl: str(raw.imageKey),
      };

    case "AB_TEST":
      return {
        typeId: "AB_TEST",
        title,
        description,
        imageUrlA: str(raw.aImageKey),
        imageUrlB: str(raw.bImageKey),
        ratio: ratio(raw.imageRatio),
      };

    case "CARD_SORTING": {
      const cards = Array.isArray(raw.cards) ? raw.cards : [];
      const categories = Array.isArray(raw.categories) ? raw.categories : [];
      return {
        typeId: "CARD_SORTING",
        title,
        description,
        cards: cards.map((label) => ({ id: genId("card"), label: str(label) })),
        categories: categories.map((label) => ({ id: genId("cat"), label: str(label) })),
        requireAllPlaced: false,
      };
    }

    case "TREE_TEST": {
      const features = Array.isArray(raw.features) ? (raw.features as RawTreeNode[]) : [];
      return {
        typeId: "TREE_TEST",
        title,
        description,
        nodes: features.map(toTreeNode),
      };
    }

    case "FIVE_SECOND": {
      const isObjective = bool(raw.isObjective);
      return {
        typeId: "FIVE_SECOND",
        title,
        description,
        imageUrl: str(raw.imageKey),
        ratio: ratio(raw.imageRatio),
        answerType: isObjective ? "multiple" : "subjective",
        answerExample: "",
        isMultipleAnswer: false,
        isOtherInputEnabled: bool(raw.isOther),
        isMultiSelectEnabled: bool(raw.isDuplicate),
        choices: options.map((o) => ({ id: genId("choice"), name: str(o.content), imageUrl: "" })),
        minSelectCount: num(raw.minSelect) ?? 1,
        maxSelectCount: num(raw.maxSelect) ?? 1,
        placeholder: "",
      };
    }

    default:
      return null;
  }
}

/**
 * 서버에서 조회한 테스트 초안을 생성 폼 상태로 복원한다(이어서 작성).
 *
 * 이미지는 imageKey(업로드 키)로 복원된다. 미리보기 썸네일 렌더링을 위한
 * 공개 URL 변환기는 아직 없어 썸네일은 비어 보일 수 있으나, 저장된 키는
 * 재저장 시 그대로 보존되어 유실되지 않는다(draftPayload.resolveImageKey 참고).
 */
export function loadDraftIntoForm(draft: TestDraftResponse): void {
  const categories = (draft.categories ?? []).filter((c): c is CategoryId =>
    VALID_CATEGORY_IDS.has(c),
  );

  const payload = draft.questionsPayload as { questions?: unknown } | undefined;
  const rawQuestions = Array.isArray(payload?.questions) ? (payload!.questions as RawQuestion[]) : [];

  const questions: PendingQuestion[] = rawQuestions
    .map((raw) => {
      const data = mapRawQuestion(raw);
      if (!data) return null;
      return { id: genId("q"), typeId: data.typeId, data } satisfies PendingQuestion;
    })
    .filter((q): q is PendingQuestion => q !== null);

  useTestCreateForm.setState({
    name: draft.title ?? "",
    summary: draft.description ?? "",
    description: draft.serviceDescription ?? "",
    serviceName: draft.serviceName ?? "",
    categories,
    images: draft.imageKeys ?? [],
    questions,
  });
}
