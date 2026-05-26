import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Asset, Text } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import {
  likeTest,
  unlikeTest,
  getListTestsUrl,
  getListLikedTestsUrl,
  type listTestsResponse,
  type listLikedTestsResponse,
  type LikedTestSummaryItem,
} from "@/shared/api/generated/test";

type Props = {
  id: number;
  title: string;
  description: string;
  reward: number;
  thumbnailUrl: string;
  liked: boolean;
  onClick?: () => void;
};

export function TestCard({
  id,
  title,
  description,
  reward,
  thumbnailUrl,
  liked,
  onClick,
}: Props) {
  const [isLiked, setIsLiked] = useState(liked);

  useEffect(() => {
    setIsLiked(liked);
  }, [liked]);

  const queryClient = useQueryClient();

  const { mutate: like } = useMutation({
    mutationFn: () => likeTest(id),
    onMutate: async () => {
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
            data: old.data.data?.map((t) => (t.id === id ? { ...t, isLiked: true } : t)),
          },
        };
      });

      queryClient.setQueryData<listLikedTestsResponse>([getListLikedTestsUrl()], (old) => {
        if (!old) return old;
        const newItem: LikedTestSummaryItem = { id, title, description, reward, thumbnailUrl };
        return {
          ...old,
          data: {
            ...old.data,
            data: {
              ...old.data?.data,
              testCount: (old.data?.data?.testCount ?? 0) + 1,
              tests: [newItem, ...(old.data?.data?.tests ?? [])],
            },
          },
        };
      });

      setIsLiked(true);
      return { prevTests, prevLikedTests, prevLiked: isLiked };
    },
    onError: (_, __, context) => {
      setIsLiked(context?.prevLiked ?? false);
      if (context?.prevTests) queryClient.setQueryData([getListTestsUrl()], context.prevTests);
      if (context?.prevLikedTests) queryClient.setQueryData([getListLikedTestsUrl()], context.prevLikedTests);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [getListTestsUrl()] });
      queryClient.invalidateQueries({ queryKey: [getListLikedTestsUrl()] });
    },
  });

  const { mutate: unlike } = useMutation({
    mutationFn: () => unlikeTest(id),
    onMutate: async () => {
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
            data: old.data.data?.map((t) => (t.id === id ? { ...t, isLiked: false } : t)),
          },
        };
      });

      queryClient.setQueryData<listLikedTestsResponse>([getListLikedTestsUrl()], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            data: {
              ...old.data?.data,
              testCount: Math.max((old.data?.data?.testCount ?? 1) - 1, 0),
              tests: old.data?.data?.tests?.filter((t) => t.id !== id) ?? [],
            },
          },
        };
      });

      setIsLiked(false);
      return { prevTests, prevLikedTests, prevLiked: isLiked };
    },
    onError: (_, __, context) => {
      setIsLiked(context?.prevLiked ?? true);
      if (context?.prevTests) queryClient.setQueryData([getListTestsUrl()], context.prevTests);
      if (context?.prevLikedTests) queryClient.setQueryData([getListLikedTestsUrl()], context.prevLikedTests);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [getListTestsUrl()] });
      queryClient.invalidateQueries({ queryKey: [getListLikedTestsUrl()] });
    },
  });

  function handleLikeToggle(e: React.MouseEvent) {
    e.stopPropagation();
    if (isLiked) {
      unlike();
    } else {
      like();
    }
  }

  return (
    <div
      className="w-full rounded-2xl bg-white overflow-visible flex flex-col gap-3 cursor-pointer pb-3"
      onClick={onClick}
    >
      {/* 썸네일 */}
      <div
        className="w-full h-48.25 rounded-2xl bg-cover bg-center overflow-hidden flex flex-col justify-end"
        style={{
          backgroundImage: `url(${thumbnailUrl})`,
          boxShadow:
            "inset 0 0 0 1px var(--token-tds-color-grey-opacity-100, rgba(2,32,71,0.05))",
        }}
      >
        <div
          className="w-full h-20 flex flex-row justify-end items-center px-6"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,23,51,0) 0%, rgba(3,24,50,0.46) 100%)",
          }}
        >
          <button
            aria-label={isLiked ? "좋아요 취소" : "좋아요"}
            onClick={handleLikeToggle}
          >
            <Asset.Image
              frameShape={{ width: 24, height: 24 }}
              backgroundColor="transparent"
              src={
                isLiked
                  ? "https://static.toss.im/icons/png/4x/icon-heart-filled.png"
                  : "https://static.toss.im/icons/png/4x/icon-heart-gradient.png"
              }
              aria-hidden={true}
            />
          </button>
        </div>
      </div>

      {/* 텍스트 */}
      <div className="w-full flex flex-col gap-0.5">
        {/* 제목 + 리워드 */}
        <div className="w-full flex flex-row justify-between items-start">
          <div className="flex-1 overflow-hidden">
            <Text
              display="block"
              color={adaptive.grey800}
              typography="st8"
              fontWeight="semibold"
              className="truncate"
            >
              {title}
            </Text>
          </div>
          <div className="flex flex-row gap-1 items-center shrink-0">
            <Asset.Icon
              frameShape={Asset.frameShape.CleanW24}
              backgroundColor="transparent"
              name="icon-coin-yellow"
              aria-hidden={true}
              ratio="1/1"
            />
            <Text color={adaptive.grey800} typography="st8" fontWeight="bold">
              {reward}
            </Text>
          </div>
        </div>

        {/* 소개 */}
        <div className="overflow-hidden">
          <Text
            display="block"
            color={adaptive.grey600}
            typography="t6"
            fontWeight="regular"
            className="truncate"
          >
            {description}
          </Text>
        </div>
      </div>
    </div>
  );
}
