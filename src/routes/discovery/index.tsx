import { useEffect, useRef } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BottomTabBar } from "@/shared/ui/BottomTabBar";
import { ServiceBanner } from "@/shared/ui/ServiceBanner";
import { AvailableTestSection, ClosedTestSection, RewardCarousel } from "@/features/discovery/ui";
import { REWARD_CAROUSEL_IMAGES } from "@/features/discovery/model";
import { useAvailableTests, useCompletedTestsPreview } from "@/features/discovery/api";
import { trackEvent } from "@/shared/lib/analytics";
import { ROUTES } from "@/shared/constants/routes";

export const Route = createFileRoute("/discovery/")({
  component: HomePage,
});

function HomePage() {
  const navigate = useNavigate();
  const available = useAvailableTests();
  const completed = useCompletedTestsPreview();
  const { data } = available;

  // 포커스 복귀 등으로 인한 리페치 시 view_item_list가 중복 발생하지 않도록 최초 1회만 전송한다.
  const trackedRef = useRef(false);
  useEffect(() => {
    if (data && !trackedRef.current) {
      trackEvent("view_item_list", { list_name: "discovery" });
      trackedRef.current = true;
    }
  }, [data]);

  const goToDetail = (testId: number) =>
    navigate({ to: ROUTES.DISCOVERY_DETAIL, params: { testId: String(testId) } });

  return (
    <div className="flex flex-col pb-44">
      <ServiceBanner />
      <div className="pt-6 flex flex-col gap-8">
        <RewardCarousel images={REWARD_CAROUSEL_IMAGES} />
        <AvailableTestSection
          tests={available.tests}
          isLoading={available.isLoading}
          isError={available.isError}
          hasMore={available.hasNextPage}
          onRetry={() => available.refetch()}
          onLoadMore={() => {
            if (!available.isFetchingNextPage) available.fetchNextPage();
          }}
          onSelect={goToDetail}
        />
        <ClosedTestSection tests={completed.tests} hasMore={completed.hasMore} onSelect={goToDetail} />
      </div>
      <BottomTabBar activeTab="discover" />
    </div>
  );
}
