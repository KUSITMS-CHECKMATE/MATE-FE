import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  likeTest,
  unlikeTest,
  getListTestsUrl,
  getListLikedTestsUrl,
  type listTestsResponse,
  type listLikedTestsResponse,
  type LikedTestSummaryItem,
} from "@/shared/api/generated/test";
import { trackEvent } from "@/shared/lib/analytics";

type LikeTarget = Required<Pick<LikedTestSummaryItem, "id" | "title" | "description" | "reward" | "thumbnailUrl">> & {
  liked: boolean;
};

// 테스트 찜/찜 취소. 발견·관심 목록 캐시를 낙관적으로 갱신하고 실패 시 되돌린다.
export function useTestLike({ id, title, description, reward, thumbnailUrl, liked }: LikeTarget) {
  const [pendingLiked, setPendingLiked] = useState<boolean | null>(null);
  const isLiked = pendingLiked ?? liked;

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (nextLiked: boolean) => (nextLiked ? likeTest(id) : unlikeTest(id)),
    onMutate: async (nextLiked) => {
      await queryClient.cancelQueries({ queryKey: [getListTestsUrl()] });
      await queryClient.cancelQueries({ queryKey: [getListLikedTestsUrl()] });

      const prevTests = queryClient.getQueryData<listTestsResponse>([getListTestsUrl()]);
      const prevLikedTests = queryClient.getQueryData<listLikedTestsResponse>([getListLikedTestsUrl()]);

      queryClient.setQueryData<listTestsResponse>([getListTestsUrl()], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            data: {
              ...old.data.data,
              tests: old.data.data?.tests?.map((t) => (t.id === id ? { ...t, isLiked: nextLiked } : t)),
            },
          },
        };
      });

      queryClient.setQueryData<listLikedTestsResponse>([getListLikedTestsUrl()], (old) => {
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
      return { prevTests, prevLikedTests };
    },
    onSuccess: (_, nextLiked) => {
      trackEvent(nextLiked ? "add_to_wishlist" : "remove_from_wishlist", { test_id: String(id) });
    },
    onError: (_, __, context) => {
      setPendingLiked(null);
      if (context?.prevTests) queryClient.setQueryData([getListTestsUrl()], context.prevTests);
      if (context?.prevLikedTests) queryClient.setQueryData([getListLikedTestsUrl()], context.prevLikedTests);
    },
    onSettled: () => {
      setPendingLiked(null);
      queryClient.invalidateQueries({ queryKey: [getListTestsUrl()] });
      queryClient.invalidateQueries({ queryKey: [getListLikedTestsUrl()] });
    },
  });

  const toggleLike = () => mutate(!isLiked);

  return { isLiked, toggleLike };
}
