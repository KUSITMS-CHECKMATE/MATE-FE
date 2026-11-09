import { useState } from "react";
import { useMutation, useQueryClient, type InfiniteData, type QueryKey } from "@tanstack/react-query";
import {
  likeTest,
  unlikeTest,
  getListTestsUrl,
  getListCompletedTestsUrl,
  getListLikedTestsUrl,
  type listTestsResponse,
  type listCompletedTestsResponse,
  type listLikedTestsResponse,
  type LikedTestSummaryItem,
} from "@/shared/api/generated/test";
import { trackEvent } from "@/shared/lib/analytics";

type LikeTarget = Required<Pick<LikedTestSummaryItem, "id" | "title" | "description" | "reward" | "thumbnailUrl">> & {
  liked: boolean;
};

// 발견 탭 목록 캐시 키의 접두사. 페이지·size별 쿼리를 한 번에 갱신하기 위해 접두사로 매칭한다.
const AVAILABLE_KEY: QueryKey = [getListTestsUrl()];
const COMPLETED_KEY: QueryKey = [getListCompletedTestsUrl()];
const LIKED_KEY: QueryKey = [getListLikedTestsUrl()];

type AvailablePages = InfiniteData<listTestsResponse>;
type Snapshot = [QueryKey, unknown][];

// 테스트 찜/찜 취소. 발견(참여 가능·종료)·관심 목록 캐시를 낙관적으로 갱신하고 실패 시 되돌린다.
export function useTestLike({ id, title, description, reward, thumbnailUrl, liked }: LikeTarget) {
  const [pendingLiked, setPendingLiked] = useState<boolean | null>(null);
  const isLiked = pendingLiked ?? liked;

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (nextLiked: boolean) => (nextLiked ? likeTest(id) : unlikeTest(id)),
    onMutate: async (nextLiked) => {
      await Promise.all([AVAILABLE_KEY, COMPLETED_KEY, LIKED_KEY].map((queryKey) => queryClient.cancelQueries({ queryKey })));

      const snapshot: Snapshot = [AVAILABLE_KEY, COMPLETED_KEY, LIKED_KEY].flatMap((queryKey) =>
        queryClient.getQueriesData({ queryKey }),
      );

      const toggle = <T extends { id?: number; isLiked?: boolean }>(t: T): T =>
        t.id === id ? { ...t, isLiked: nextLiked } : t;

      queryClient.setQueriesData<AvailablePages>({ queryKey: AVAILABLE_KEY }, (old) => {
        if (!old?.pages) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: { ...page.data, data: { ...page.data.data, tests: page.data.data?.tests?.map(toggle) } },
          })),
        };
      });

      queryClient.setQueriesData<listCompletedTestsResponse>({ queryKey: COMPLETED_KEY }, (old) => {
        if (!old?.data) return old;
        return { ...old, data: { ...old.data, data: { ...old.data.data, tests: old.data.data?.tests?.map(toggle) } } };
      });

      queryClient.setQueryData<listLikedTestsResponse>(LIKED_KEY, (old) => {
        if (!old) return old;
        const prevCount = old.data?.data?.testCount ?? 0;
        const prevItems = old.data?.data?.tests ?? [];
        const newItem: LikedTestSummaryItem = { id, title, description, reward, thumbnailUrl };
        return {
          ...old,
          data: {
            ...old.data,
            data: {
              ...old.data?.data,
              testCount: nextLiked ? prevCount + 1 : Math.max(prevCount - 1, 0),
              tests: nextLiked ? [newItem, ...prevItems] : prevItems.filter((t) => t.id !== id),
            },
          },
        };
      });

      setPendingLiked(nextLiked);
      return { snapshot };
    },
    onSuccess: (_, nextLiked) => {
      trackEvent(nextLiked ? "add_to_wishlist" : "remove_from_wishlist", { test_id: String(id) });
    },
    onError: (_, __, context) => {
      setPendingLiked(null);
      context?.snapshot.forEach(([queryKey, data]) => queryClient.setQueryData(queryKey, data));
    },
    onSettled: () => {
      setPendingLiked(null);
      [AVAILABLE_KEY, COMPLETED_KEY, LIKED_KEY].forEach((queryKey) => queryClient.invalidateQueries({ queryKey }));
    },
  });

  const toggleLike = () => mutate(!isLiked);

  return { isLiked, toggleLike };
}
