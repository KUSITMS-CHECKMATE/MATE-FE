import { useQuery } from "@tanstack/react-query";
import { getQuestionsDetails } from "@/shared/api/generated/question";
import type { ApiQuestionsDetailData, ApiResponse } from "./types";
import { mapApiToParticipateTest } from "./mappers";

export function useParticipateTestQuery(testId: number) {
  return useQuery({
    queryKey: ["participate-test", testId],
    queryFn: async () => {
      const res = await getQuestionsDetails(testId);
      const body = res.data as ApiResponse<ApiQuestionsDetailData>;
      const apiData = body.data;
      if (!apiData) throw new Error(JSON.stringify(body, null, 2));
      return { test: mapApiToParticipateTest(apiData), raw: body };
    },
  });
}
