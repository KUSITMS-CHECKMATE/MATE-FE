import ky from "ky";
import { generateUploadUrl } from "@/shared/api/generated/file";
import type { TestDraftUpdateRequest } from "@/shared/api/generated/testDraft";
import type { PendingQuestion, TestCreateFormData } from "./types";
import type { TreeNodeItem } from "@/features/question-tree/model/types";

interface ObjectiveCreateRequest {
  type: "OBJECTIVE";
  title?: string;
  description?: string;
  isDuplicate?: boolean;
  maxSelect?: number;
  minSelect?: number;
  isOther?: boolean;
  options?: { content?: string; imageKey?: string }[];
}
interface SubjectiveCreateRequest {
  type: "SUBJECTIVE";
  title?: string;
  description?: string;
  imageKey?: string;
}
interface ScaleCreateRequest {
  type: "SCALE";
  title?: string;
  description?: string;
  imageKey?: string;
  minLabel?: string;
  maxLabel?: string;
  range?: number;
}
interface AbTestCreateRequest {
  type: "AB_TEST";
  title?: string;
  description?: string;
  aImageKey?: string;
  bImageKey?: string;
  imageRatio?: string;
}
interface CardSortingCreateRequest {
  type: "CARD_SORTING";
  title?: string;
  description?: string;
  cards?: string[];
  categories?: string[];
}
interface TreeFeatureNode {
  label: string;
  children: TreeFeatureNode[];
}
interface TreeTestCreateRequest {
  type: "TREE_TEST";
  title?: string;
  description?: string;
  features?: TreeFeatureNode[];
}
interface FiveSecondCreateRequest {
  type: "FIVE_SECOND";
  title?: string;
  description?: string;
  imageKey?: string;
  imageRatio?: string;
  isObjective?: boolean;
  isDuplicate?: boolean;
  minSelect?: number;
  maxSelect?: number;
  isOther?: boolean;
  options?: { content?: string }[];
}

export type QuestionRequestItem =
  | ObjectiveCreateRequest
  | SubjectiveCreateRequest
  | ScaleCreateRequest
  | AbTestCreateRequest
  | CardSortingCreateRequest
  | TreeTestCreateRequest
  | FiveSecondCreateRequest;

function dataUriToBlob(dataUri: string): Blob {
  const [header, base64] = dataUri.split(",");
  const mime = header.match(/:(.*?);/)?.[1] ?? "image/jpeg";
  const binary = atob(base64);
  const array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }
  return new Blob([array], { type: mime });
}

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

async function uploadBase64(dataUri: string): Promise<string | undefined> {
  const blob = dataUriToBlob(dataUri);
  if (blob.size > MAX_IMAGE_BYTES) {
    throw new Error(`이미지 크기가 10MB를 초과해요 (${(blob.size / 1024 / 1024).toFixed(1)}MB)`);
  }

  const uploadResponse = await generateUploadUrl({ extension: "jpg", fileSizeBytes: blob.size });
  const { presignedUrl, fileKey } = uploadResponse.data.data ?? {};
  if (!presignedUrl || !fileKey) throw new Error("업로드 URL 발급 실패");

  const uploadUrl = import.meta.env.DEV
    ? (() => {
        const u = new URL(presignedUrl);
        return `/azure-blob${u.pathname}${u.search}`;
      })()
    : presignedUrl;

  await ky.put(uploadUrl, {
    body: blob,
    headers: { "x-ms-blob-type": "BlockBlob" },
    timeout: 30000,
  });

  return fileKey;
}

/**
 * 폼의 이미지 값을 업로드 키로 변환한다.
 * - `data:` URI: 새로 선택한 이미지 → 업로드 후 fileKey 반환
 * - 그 외 비어있지 않은 문자열: 임시저장된 초안에서 불러온 기존 imageKey → 그대로 통과
 *   (재저장 시 이미 업로드된 이미지가 유실되지 않도록 보존한다)
 */
async function resolveImageKey(value: string | undefined): Promise<string | undefined> {
  if (!value) return undefined;
  if (value.startsWith("data:")) return uploadBase64(value);
  return value;
}

async function mapQuestion(question: PendingQuestion): Promise<QuestionRequestItem | null> {
  if (!question.data) return { type: question.typeId } as QuestionRequestItem;
  const data = question.data;

  switch (data.typeId) {
    case "OBJECTIVE": {
      const options = await Promise.all(
        data.choices.map(async (c) => ({
          content: c.name,
          imageKey: await resolveImageKey(c.imageUrl || undefined),
        })),
      );
      return {
        type: "OBJECTIVE",
        title: data.title,
        description: data.description,
        isDuplicate: data.isMultiSelectEnabled,
        maxSelect: data.isMultiSelectEnabled ? data.maxSelectCount : undefined,
        minSelect: data.isMultiSelectEnabled ? data.minSelectCount : undefined,
        isOther: data.isOtherInputEnabled,
        options,
      } satisfies ObjectiveCreateRequest;
    }

    case "SUBJECTIVE": {
      const imageKey = await resolveImageKey(data.imageUrl || undefined);
      return {
        type: "SUBJECTIVE",
        title: data.title,
        description: data.description,
        imageKey,
      } satisfies SubjectiveCreateRequest;
    }

    case "SCALE": {
      const imageKey = await resolveImageKey(data.imageUrl || undefined);
      return {
        type: "SCALE",
        title: data.title,
        description: data.description,
        imageKey,
        minLabel: data.minLabel,
        maxLabel: data.maxLabel,
        range: data.scaleCount,
      } satisfies ScaleCreateRequest;
    }

    case "AB_TEST": {
      const [aImageKey, bImageKey] = await Promise.all([
        resolveImageKey(data.imageUrlA || undefined),
        resolveImageKey(data.imageUrlB || undefined),
      ]);
      return {
        type: "AB_TEST",
        title: data.title,
        description: data.description,
        aImageKey,
        bImageKey,
        imageRatio: data.ratio ?? "1:1",
      } satisfies AbTestCreateRequest;
    }

    case "CARD_SORTING": {
      return {
        type: "CARD_SORTING",
        title: data.title,
        description: data.description,
        cards: data.cards.map((c) => c.label),
        categories: data.categories.map((c) => c.label),
      } satisfies CardSortingCreateRequest;
    }

    case "TREE_TEST": {
      const toFeatureNode = (node: TreeNodeItem): TreeFeatureNode => ({
        label: node.name,
        children: node.children?.map(toFeatureNode) ?? [],
      });
      return {
        type: "TREE_TEST",
        title: data.title,
        description: data.description,
        features: data.nodes?.map(toFeatureNode) ?? [],
      } satisfies TreeTestCreateRequest;
    }

    case "FIVE_SECOND": {
      const imageKey = await resolveImageKey(data.imageUrl || undefined);
      const isObjective = data.answerType === "multiple";
      return {
        type: "FIVE_SECOND",
        title: data.title,
        description: data.description,
        imageKey,
        imageRatio: data.ratio ?? "1:1",
        isObjective,
        isDuplicate: isObjective ? data.isMultiSelectEnabled : undefined,
        minSelect: isObjective && data.isMultiSelectEnabled ? data.minSelectCount : undefined,
        maxSelect: isObjective && data.isMultiSelectEnabled ? data.maxSelectCount : undefined,
        isOther: isObjective ? data.isOtherInputEnabled : undefined,
        options: isObjective ? data.choices.map((c) => ({ content: c.name })) : undefined,
      } satisfies FiveSecondCreateRequest;
    }

    default:
      return null;
  }
}

type DraftFormState = TestCreateFormData & { questions: PendingQuestion[] };

/**
 * 폼 상태를 테스트 초안 수정 요청 payload로 변환한다.
 * 이미지(테스트/질문)는 업로드하여 imageKey로 치환한다.
 * 결제 관련 필드(goalPpl/reward/closedAt)는 결제 화면에서 별도로 저장한다.
 */
export async function buildDraftPayload(form: DraftFormState): Promise<TestDraftUpdateRequest> {
  let imageKeys: string[] = [];
  try {
    imageKeys = (await Promise.all(form.images.map((img) => resolveImageKey(img)))).filter(
      (k): k is string => !!k,
    );
  } catch (e) {
    throw new Error(`[테스트 이미지 업로드 실패] ${e instanceof Error ? e.message : String(e)}`);
  }

  let mappedQuestions: QuestionRequestItem[] = [];
  try {
    mappedQuestions = (await Promise.all(form.questions.map(mapQuestion))).filter(
      (q): q is QuestionRequestItem => q !== null,
    );
  } catch (e) {
    throw new Error(`[질문 이미지 업로드 실패] ${e instanceof Error ? e.message : String(e)}`);
  }

  return {
    title: form.name,
    description: form.summary,
    categories: form.categories,
    serviceName: form.serviceName || undefined,
    serviceDescription: form.description || undefined,
    imageKeys,
    questionsPayload: { questions: mappedQuestions },
  };
}
