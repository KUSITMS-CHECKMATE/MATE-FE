import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@toss/tds-mobile";
import { HTTPError } from "ky";
import { createDraft, updateDraft } from "@/shared/api/generated/testDraft";
import { useTestCreateForm } from "./useTestCreateForm";
import { buildDraftPayload } from "./draftPayload";

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
 * - draftId가 아직 없으면(첫 임시저장) createDraft로 서버에 초안을 생성한 뒤 저장 진행
 *   → 사용자가 한 번도 저장하지 않고 나가면 서버에 빈 초안이 남지 않는다
 * - 이미지 업로드 후 updateDraft로 내용 저장(결제 필드 제외)
 * - draftId는 서버에 저장되므로, 다음 "테스트 등록" 진입 시 listMyDrafts로 이어서 작성 가능
 * - 실패 시 에러 토스트 표시
 *
 * 성공 토스트는 호출 측에서 상황에 맞게 표시한다(옵션 A: 결제 흐름의
 * "안할게요"는 저장은 하되 성공 토스트는 생략).
 */
export function useSaveDraft(draftId: number | undefined, onDraftCreated?: (draftId: number) => void) {
  const form = useTestCreateForm();
  const { openToast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      let id = draftId;
      if (!id) {
        const res = await createDraft();
        id = res.data.data?.draftId;
        if (!id) throw new Error("초안 생성에 실패했습니다. 다시 시도해주세요.");
        onDraftCreated?.(id);
      }

      const payload = await buildDraftPayload(form);
      try {
        await updateDraft(id, payload);
      } catch (e) {
        throw new Error(`[테스트 초안 저장 실패] ${e instanceof Error ? e.message : String(e)}`);
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listMyDrafts"] });
    },
    onError: async (error) => {
      openToast(await toMessage(error), { type: "bottom" });
    },
  });
}
