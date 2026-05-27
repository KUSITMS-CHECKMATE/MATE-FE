import { useMutation } from "@tanstack/react-query";
import { createAnswers } from "@/shared/api/generated/answer";
import type { AnswerCreateRequest } from "@/shared/api/generated/answer";

export function useSubmitAnswersMutation() {
  return useMutation({
    mutationFn: ({ testId, body }: { testId: number; body: AnswerCreateRequest }) =>
      createAnswers(testId, body),
  });
}
