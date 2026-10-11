import { Asset, Spacing, Text } from "@toss/tds-mobile";
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
      className="w-full rounded-2xl bg-white flex flex-row gap-4 items-start cursor-pointer"
      onClick={onClick}
    >
      <LikeThumbnail
        thumbnailUrl={test.thumbnailUrl}
        isLiked={isLiked}
        onToggleLike={toggleLike}
        className="w-28 h-28"
      />
      <div className="flex-1 min-w-0 flex flex-col">
        <Text
          display="block"
          color={adaptive.grey800}
          typography="t5"
          fontWeight="semibold"
          className="line-clamp-2"
        >
          {test.title}
        </Text>
        <div className="pt-1.5">
          <CategoryChips categories={test.categories} />
        </div>
        <Spacing size={19} />
        <div className="flex flex-row gap-1 items-center">
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
