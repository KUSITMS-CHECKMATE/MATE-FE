import { useMutation } from "@tanstack/react-query";
import { closeTest } from "@/shared/api/generated/test";

/**
 * POST /api/v1/tests/{testId}/close — 메이커가 진행 중인 테스트를 수동 종료한다.
 * orval이 POST를 useQuery로 생성하므로 mutation 으로 직접 래핑한다.
 */
export function useCloseTestMutation() {
  return useMutation({
    mutationFn: (testId: number) => closeTest(testId),
  });
}
