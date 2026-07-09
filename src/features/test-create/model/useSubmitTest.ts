import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useToast } from "@toss/tds-mobile";
import ky, { HTTPError } from "ky";
import { updateDraft } from "@/shared/api/generated/testDraft";
import { generateUploadUrl } from "@/shared/api/generated/file";
import { useTestCreateForm } from "./useTestCreateForm";
import type { PendingQuestion } from "./types";
import type { TreeNodeItem } from "@/features/question-tree/model/types";
import { ROUTES } from "@/shared/constants/routes";

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

type QuestionRequestItem = ObjectiveCreateRequest | SubjectiveCreateRequest | ScaleCreateRequest | AbTestCreateRequest | CardSortingCreateRequest | TreeTestCreateRequest | FiveSecondCreateRequest;

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

async function uploadBase64(dataUri: string | undefined): Promise<string | undefined> {
  if (!dataUri?.startsWith("data:")) return undefined;

  const blob = dataUriToBlob(dataUri);
  if (blob.size > MAX_IMAGE_BYTES) {
    throw new Error(`이미지 크기가 10MB를 초과해요 (${(blob.size / 1024 / 1024).toFixed(1)}MB)`);
  }

  const uploadResponse = await generateUploadUrl({ extension: "jpg", fileSizeBytes: blob.size });
  const { presignedUrl, fileKey } = uploadResponse.data.data ?? {};
  if (!presignedUrl || !fileKey) throw new Error("업로드 URL 발급 실패");

  const uploadUrl = import.meta.env.DEV
    ? (() => { const u = new URL(presignedUrl); return `/azure-blob${u.pathname}${u.search}`; })()
    : presignedUrl;

  await ky.put(uploadUrl, {
    body: blob,
    headers: { "x-ms-blob-type": "BlockBlob" },
  });

  return fileKey;
}

async function mapQuestion(question: PendingQuestion): Promise<QuestionRequestItem | null> {
  if (!question.data) return null;
  const data = question.data;

  switch (data.typeId) {
    case "OBJECTIVE": {
      const options = await Promise.all(
        data.choices.map(async (c) => ({
          content: c.name,
          imageKey: await uploadBase64(c.imageUrl || undefined),
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
      const imageKey = await uploadBase64(data.imageUrl || undefined);
      return {
        type: "SUBJECTIVE",
        title: data.title,
        description: data.description,
        imageKey,
      } satisfies SubjectiveCreateRequest;
    }

    case "SCALE": {
      const imageKey = await uploadBase64(data.imageUrl || undefined);
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
      const [aImageKey, bImageKey] = await Promise.all([uploadBase64(data.imageUrlA || undefined), uploadBase64(data.imageUrlB || undefined)]);
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
      const imageKey = await uploadBase64(data.imageUrl || undefined);
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

export function useSubmitTest(draftId: number | undefined) {
  const navigate = useNavigate();
  const form = useTestCreateForm();
  const { openToast } = useToast();

  return useMutation({
    mutationFn: async () => {
      if (!draftId) throw new Error("드래프트 ID가 없습니다. 처음부터 다시 시도해주세요.");

      let imageKeys: string[] = [];
      try {
        imageKeys = (await Promise.all(form.images.map((img) => uploadBase64(img)))).filter((k): k is string => !!k);
      } catch (e) {
        throw new Error(`[테스트 이미지 업로드 실패] ${e instanceof Error ? e.message : String(e)}`);
      }

      let mappedQuestions: QuestionRequestItem[] = [];
      try {
        mappedQuestions = (await Promise.all(form.questions.map(mapQuestion))).filter((q): q is QuestionRequestItem => q !== null);
      } catch (e) {
        throw new Error(`[질문 이미지 업로드 실패] ${e instanceof Error ? e.message : String(e)}`);
      }

      try {
        await updateDraft(draftId, {
          title: form.name,
          description: form.summary,
          categories: form.categories,
          serviceName: form.serviceName || undefined,
          serviceDescription: form.description || undefined,
          imageKeys,
          questionsPayload: { questions: mappedQuestions },
        });
      } catch (e) {
        throw new Error(`[테스트 초안 업데이트 실패] ${e instanceof Error ? e.message : String(e)}`);
      }

      return draftId;
    },
    onSuccess: (draftId) => {
      navigate({ to: ROUTES.TEST_PAYMENT, search: { draftId }, replace: true });
    },
    onError: async (error) => {
      let message = `실패: ${String(error)}`;
      if (error instanceof HTTPError) {
        try {
          const body = await error.response.json();
          message = `${error.response.status} ${body?.code ?? ""} ${body?.message ?? ""}`.trim();
        } catch {
          message = `HTTP ${error.response.status}`;
        }
      }
      openToast(message, { type: "bottom" });
    },
  });
}
