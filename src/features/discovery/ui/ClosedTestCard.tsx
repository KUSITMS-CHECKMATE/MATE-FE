import { Text } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { useTestLike } from "@/shared/hooks/useTestLike";
import type { DiscoveryTest } from "../model";
import { CategoryChips } from "./CategoryChips";
import { LikeThumbnail } from "./LikeThumbnail";

interface Props {
  test: DiscoveryTest;
  onClick: () => void;
}

export function ClosedTestCard({ test, onClick }: Props) {
  const { isLiked, toggleLike } = useTestLike(test);

  return (
    <div
      data-testid="closed-test-card"
      className="min-w-0 flex flex-col gap-3 cursor-pointer pb-4"
      onClick={onClick}
    >
      <LikeThumbnail
        thumbnailUrl={test.thumbnailUrl}
        isLiked={isLiked}
        onToggleLike={toggleLike}
        className="w-full aspect-square"
      />
      <div className="flex flex-col gap-1.5">
        {/* TDS Text가 인라인 style로 display를 지정해 line-clamp가 덮이므로 important로 적용 */}
        <Text color={adaptive.grey800} typography="t5" fontWeight="semibold" className="line-clamp-2!">
          {test.title}
        </Text>
        <CategoryChips categories={test.categories} />
      </div>
    </div>
  );
}
