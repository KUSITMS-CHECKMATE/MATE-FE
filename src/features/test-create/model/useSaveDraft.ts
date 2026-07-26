import { useMutation } from "@tanstack/react-query";
import { useToast } from "@toss/tds-mobile";
import { HTTPError } from "ky";
import { updateDraft } from "@/shared/api/generated/testDraft";
import { useTestCreateForm } from "./useTestCreateForm";
import { buildDraftPayload } from "./draftPayload";
import { setSavedDraftId } from "./draftStorage";

async function toMessage(error: unknown): Promise<string> {
  if (error instanceof HTTPError) {
    try {
      const body = (await error.response.json()) as { code?: string; message?: string };
      return `${error.response.status} ${body?.code ?? ""} ${body?.message ?? ""}`.trim();
    } catch {
      return `HTTP ${error.response.status}`;
    }
  }
  return error instanceof Error ? error.message : String(error);
}

/**
 * 현재까지 작성한 내용을 테스트 초안에 저장한다(임시저장).
 * - 이미지 업로드 후 updateDraft로 내용 저장(결제 필드 제외)
 * - 저장한 draftId를 영구 저장하여 이후 "테스트 등록" 시 이어서 작성 가능
 * - 실패 시 에러 토스트 표시
 *
 * 성공 토스트는 호출 측에서 상황에 맞게 표시한다(옵션 A: 결제 흐름의
 * "안할게요"는 저장은 하되 성공 토스트는 생략).
 */
export function useSaveDraft(draftId: number | undefined) {
  const form = useTestCreateForm();
  const { openToast } = useToast();

  return useMutation({
    mutationFn: async () => {
      if (!draftId) throw new Error("드래프트 ID가 없습니다. 처음부터 다시 시도해주세요.");

      const payload = await buildDraftPayload(form);
      try {
        await updateDraft(draftId, payload);
      } catch (e) {
        throw new Error(`[테스트 초안 저장 실패] ${e instanceof Error ? e.message : String(e)}`);
      }

      await setSavedDraftId(draftId);
      return draftId;
    },
    onError: async (error) => {
      openToast(await toMessage(error), { type: "bottom" });
    },
  });
}
