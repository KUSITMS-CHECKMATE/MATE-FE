import { Asset, Text } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { useTestLike } from "@/shared/hooks/useTestLike";
import type { DiscoveryTest } from "../model";
import { CategoryChips } from "./CategoryChips";
import { LikeThumbnail } from "./LikeThumbnail";

interface Props {
  test: DiscoveryTest;
  onClick: () => void;
}

export function AvailableTestCard({ test, onClick }: Props) {
  const { isLiked, toggleLike } = useTestLike(test);

  return (
    <div
      data-testid="available-test-card"
      className="w-full rounded-2xl bg-white flex flex-row gap-4 items-center cursor-pointer"
      onClick={onClick}
    >
      <LikeThumbnail
        thumbnailUrl={test.thumbnailUrl}
        isLiked={isLiked}
        onToggleLike={toggleLike}
        className="w-28 h-28"
      />
      <div className="flex-1 min-w-0 max-h-28 flex flex-col">
        {/* TDS Text가 인라인 style로 display를 지정해 line-clamp가 덮이므로 important로 적용 */}
        <Text color={adaptive.grey800} typography="t5" fontWeight="semibold" className="line-clamp-2! shrink-0">
          {test.title}
        </Text>
        <div className="pt-1.5 shrink-0">
          <CategoryChips categories={test.categories} />
        </div>
        {/* 간격 16px. 제목이 2줄이면 카드가 썸네일 높이(112)를 넘지 않도록 이 간격만 줄어든다 */}
        <div className="h-4 min-h-0 shrink" />
        <div className="shrink-0 flex flex-row gap-1 items-center">
          <Asset.Icon
            frameShape={Asset.frameShape.CleanW24}
            backgroundColor="transparent"
            name="icon-coin-yellow"
            aria-hidden={true}
            ratio="1/1"
          />
          <Text color={adaptive.grey800} typography="st8" fontWeight="bold">
            {test.reward}
          </Text>
        </div>
      </div>
    </div>
  );
}
