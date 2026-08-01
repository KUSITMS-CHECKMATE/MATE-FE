import { mapRawQuestion, type RawQuestion } from "@/features/test-create/model/draftMapper";
import type { QuestionData } from "@/features/test-create/model/types";
import type { TestDraftResponse } from "@/shared/api/generated/testDraft";
import type { QuestionSummaryItem } from "@/features/test-result/ui";
import type { ParticipateQuestion } from "@/features/test-participate/model/types";

function toParticipateQuestion(id: string, data: QuestionData): ParticipateQuestion {
  switch (data.typeId) {
    case "OBJECTIVE":
      return { id, type: "OBJECTIVE", data };
    case "SUBJECTIVE":
      return { id, type: "SUBJECTIVE", data };
    case "SCALE":
      return { id, type: "SCALE", data };
    case "AB_TEST":
      return { id, type: "AB_TEST", data };
    case "CARD_SORTING":
      return { id, type: "CARD_SORTING", data };
    case "TREE_TEST":
      return { id, type: "TREE_TEST", data };
    case "FIVE_SECOND":
      return { id, type: "FIVE_SECOND", data };
  }
}

/**
 * 초안(draft)의 questionsPayload를 파싱해서, 발행된 테스트의 결과 화면과 동일한 형태의
 * 질문 목록(요약)과 질문별 미리보기 데이터를 만든다.
 * 초안은 실제 testId/questionId가 없으므로, 배열 순서를 기준으로 1부터 시작하는 임시 id를 부여한다.
 */
export function extractDraftQuestions(draft: TestDraftResponse) {
  const payload = draft.questionsPayload as { questions?: unknown } | undefined;
  const rawQuestions = Array.isArray(payload?.questions) ? (payload!.questions as RawQuestion[]) : [];

  const summaries: QuestionSummaryItem[] = [];
  const previewMap: Record<number, ParticipateQuestion> = {};

  rawQuestions.forEach((raw, index) => {
    const data = mapRawQuestion(raw);
    if (!data) return;
    const questionId = index + 1;
    summaries.push({ questionId, sequence: questionId, title: data.title, type: data.typeId });
    previewMap[questionId] = toParticipateQuestion(String(questionId), data);
  });

  return { summaries, previewMap };
}
