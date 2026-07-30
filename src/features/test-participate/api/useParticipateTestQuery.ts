import { useQuery } from "@tanstack/react-query";
import { getQuestionsDetails } from "@/shared/api/generated/question";
import type { ApiQuestionsDetailData, ApiResponse } from "./types";
import { mapApiToParticipateTest } from "./mappers";
import { useQaMockMode } from "@/shared/model/qaMockMode";
import { MOCK_PARTICIPATE_TEST } from "../model/mock";

export function useParticipateTestQuery(testId: number) {
  const qaMock = useQaMockMode((state) => state.enabled);

  return useQuery({
    queryKey: ["participate-test", testId, qaMock],
    enabled: !qaMock,
    queryFn: async () => {
      const res = await getQuestionsDetails(testId);
      const body = res.data as ApiResponse<ApiQuestionsDetailData>;
      const apiData = body.data;
      if (!apiData) throw new Error(JSON.stringify(body, null, 2));
      return { test: mapApiToParticipateTest(apiData), raw: body };
    },
    initialData: qaMock
      ? { test: MOCK_PARTICIPATE_TEST, raw: { success: true, code: "", message: "", data: undefined } }
      : undefined,
  });
}
