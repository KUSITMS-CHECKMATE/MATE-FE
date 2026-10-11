import { useState } from "react";
import { Text } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import type { ClosedTest } from "../model";
import { CategoryChips } from "./CategoryChips";
import { LikeThumbnail } from "./LikeThumbnail";

interface Props {
  test: ClosedTest;
  onClick: () => void;
}

export function ClosedTestCard({ test, onClick }: Props) {
  // TODO: 종료 테스트 API 연동 시 useTestLike로 교체 (현재 mock이라 로컬 상태만 토글)
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div
      data-testid="closed-test-card"
      className="min-w-0 flex flex-col gap-3 cursor-pointer"
      onClick={onClick}
    >
      <LikeThumbnail
        thumbnailUrl={test.thumbnailUrl}
        isLiked={isLiked}
        onToggleLike={() => setIsLiked((prev) => !prev)}
        className="w-full aspect-square"
      />
      <div className="flex flex-col gap-1.5">
        <Text
          display="block"
          color={adaptive.grey800}
          typography="t5"
          fontWeight="semibold"
          className="line-clamp-2"
        >
          {test.title}
        </Text>
        <CategoryChips categories={test.categories} />
      </div>
    </div>
  );
}
