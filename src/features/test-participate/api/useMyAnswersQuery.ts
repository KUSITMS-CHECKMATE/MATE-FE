import { useQuery } from "@tanstack/react-query";
import { listMyAnswers } from "@/shared/api/generated/answer";

export const MY_ANSWERS_QUERY_KEY = ["my-answers"];

// orval이 GET을 mutation으로 생성해서 함수를 직접 useQuery로 래핑한다.
export function useMyAnswersQuery() {
  return useQuery({
    queryKey: MY_ANSWERS_QUERY_KEY,
    queryFn: async () => (await listMyAnswers()).data.data?.answers ?? [],
  });
}
