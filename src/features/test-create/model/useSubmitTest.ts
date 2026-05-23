import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useToast } from "@toss/tds-mobile";
import { HTTPError } from "ky";
import { createTest } from "@/shared/api/generated/test";
import { createQuestions } from "@/shared/api/generated/question";
import { generateUploadUrl } from "@/shared/api/generated/file";
import type { TestCreateRequestCategoriesItem } from "@/shared/api/generated/test";
import type {
  AbTestCreateRequest,
  CardSortingCreateRequest,
  FiveSecondCreateRequest,
  ObjectiveCreateRequest,
  ScaleCreateRequest,
  SubjectiveCreateRequest,
  TreeTestCreateRequest,
} from "@/shared/api/generated/question";
import { useTestCreateForm } from "./useTestCreateForm";
import type { CategoryId, PendingQuestion } from "./types";
import { ROUTES } from "@/shared/constants/routes";

type QuestionRequestItem =
  | AbTestCreateRequest
  | CardSortingCreateRequest
  | FiveSecondCreateRequest
  | ObjectiveCreateRequest
  | ScaleCreateRequest
  | SubjectiveCreateRequest
  | TreeTestCreateRequest;

const CATEGORY_MAP: Record<CategoryId, TestCreateRequestCategoriesItem> = {
  daily: "DAILY",
  finance: "FINANCE",
  health: "HEALTH",
  shopping: "SHOPPING",
  food: "FOOD",
  game: "GAME",
  content: "CONTENT",
  community: "COMMUNITY",
  ai: "AI",
  education: "EDUCATION",
  travel: "TRAVEL",
  social: "SOCIAL",
  convenience: "CONVENIENCE",
  information: "INFORMATION",
  business: "BUSINESS",
  transportation: "TRANSPORT",
  public: "PUBLIC_ADMIN",
};

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

  const uploadResponse = await generateUploadUrl({ extension: "jpg" });
  const { presignedUrl, fileKey } = uploadResponse.data.data ?? {};
  if (!presignedUrl || !fileKey) throw new Error("업로드 URL 발급 실패");

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", presignedUrl);
    xhr.setRequestHeader("x-ms-blob-type", "BlockBlob");
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`이미지 업로드 실패 (${xhr.status})`));
    };
    xhr.onerror = () => reject(new Error(`이미지 업로드 네트워크 오류 (XHR)`));
    xhr.send(blob);
  });

  return fileKey;
}

async function mapQuestion(question: PendingQuestion): Promise<QuestionRequestItem | null> {
  if (!question.data) return null;
  const data = question.data;

  switch (data.typeId) {
    case "multiple": {
      const options = await Promise.all(
        data.choices.map(async (c) => ({
          content: c.name,
          imageKey: await uploadBase64(c.imageUrl || undefined),
        }))
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

    case "subjective": {
      const imageKey = await uploadBase64(data.imageUrl || undefined);
      return {
        type: "SUBJECTIVE",
        title: data.title,
        description: data.description,
        imageKey,
      } satisfies SubjectiveCreateRequest;
    }

    case "scale": {
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

    case "ab": {
      const [aImageKey, bImageKey] = await Promise.all([
        uploadBase64(data.imageUrlA || undefined),
        uploadBase64(data.imageUrlB || undefined),
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

    case "card": {
      return {
        type: "CARD_SORTING",
        title: data.title,
        description: data.description,
        cards: data.cards.map((c) => c.label),
        categories: data.categories.map((c) => c.label),
      } satisfies CardSortingCreateRequest;
    }

    case "tree": {
      return {
        type: "TREE_TEST",
        title: data.title,
        description: data.description,
        features: data.nodes.map((node) => ({
          label: node.name,
          children: node.children.map((child) => ({
            label: child.name,
            children: child.children.length > 0 ? child.children : undefined,
          })),
        })),
      } satisfies TreeTestCreateRequest;
    }

    case "fivesec": {
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

export function useSubmitTest() {
  const navigate = useNavigate();
  const form = useTestCreateForm();
  const { openToast } = useToast();

  return useMutation({
    mutationFn: async () => {
      let imageKeys: string[] = [];
      try {
        imageKeys = (
          await Promise.all(form.images.map((img) => uploadBase64(img)))
        ).filter((k): k is string => !!k);
      } catch (e) {
        throw new Error(`[테스트 이미지 업로드 실패] ${e instanceof Error ? e.message : String(e)}`);
      }

      let testId: number;
      try {
        const testResponse = await createTest({
          title: form.name,
          description: form.summary,
          categories: form.categories.map((c) => CATEGORY_MAP[c]),
          serviceName: form.serviceName || undefined,
          serviceDescription: form.description || undefined,
          imageKeys,
        });
        const id = testResponse.data.data?.id;
        if (!id) throw new Error("테스트 ID를 받지 못했습니다.");
        testId = id;
      } catch (e) {
        throw new Error(`[테스트 생성 실패] ${e instanceof Error ? e.message : String(e)}`);
      }

      let mappedQuestions: QuestionRequestItem[] = [];
      try {
        mappedQuestions = (
          await Promise.all(form.questions.map(mapQuestion))
        ).filter((q): q is QuestionRequestItem => q !== null);
      } catch (e) {
        throw new Error(`[질문 이미지 업로드 실패] ${e instanceof Error ? e.message : String(e)}`);
      }

      if (mappedQuestions.length > 0) {
        try {
          await createQuestions(testId, { questions: mappedQuestions });
        } catch (e) {
          throw new Error(`[질문 등록 실패] ${e instanceof Error ? e.message : String(e)}`);
        }
      }

      return testId;
    },
    onSuccess: (testId) => {
      form.reset();
      navigate({ to: ROUTES.TEST_DETAIL, params: { testId: String(testId) } });
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
