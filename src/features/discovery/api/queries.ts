import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  listTests,
  listCompletedTests,
  getListTestsUrl,
  getListCompletedTestsUrl,
} from "@/shared/api/generated/test";
import { toDiscoveryTest } from "../model";

const AVAILABLE_PAGE_SIZE = 3;
const COMPLETED_PREVIEW_SIZE = 4;

// 참여 가능 테스트: "더 보기" 1회당 다음 page(3개)를 이어 붙인다.
// 키 첫 요소를 getListTestsUrl()로 두어 찜 훅이 접두사로 모든 페이지 캐시를 갱신할 수 있게 한다.
export function useAvailableTests() {
  const query = useInfiniteQuery({
    queryKey: [getListTestsUrl(), { size: AVAILABLE_PAGE_SIZE }],
    queryFn: ({ pageParam }) => listTests({ page: pageParam, size: AVAILABLE_PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) =>
      lastPage.data.data?.hasNext ? lastPageParam + 1 : undefined,
  });

  const tests = (query.data?.pages ?? []).flatMap((page) => (page.data.data?.tests ?? []).map(toDiscoveryTest));

  return { ...query, tests };
}

// 종료 테스트: 발견 탭은 첫 페이지(4개)만 쓴다. 전체보기(무한 스크롤)는 별도 화면에서 cursor로 이어 받는다.
export function useCompletedTestsPreview() {
  const query = useQuery({
    queryKey: [getListCompletedTestsUrl(), { size: COMPLETED_PREVIEW_SIZE }],
    queryFn: () => listCompletedTests({ size: COMPLETED_PREVIEW_SIZE }),
  });

  const tests = (query.data?.data.data?.tests ?? []).map(toDiscoveryTest);
  const hasMore = query.data?.data.data?.hasNext ?? false;

  return { ...query, tests, hasMore };
}
