import { useEffect, useRef } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BottomTabBar } from "@/shared/ui/BottomTabBar";
import { ServiceBanner } from "@/shared/ui/ServiceBanner";
import { AvailableTestSection, ClosedTestSection, RewardCarousel } from "@/features/discovery/ui";
import { REWARD_CAROUSEL_IMAGES, type ClosedTest, type DiscoveryTest } from "@/features/discovery/model";
import { listTests, getListTestsUrl } from "@/shared/api/generated/test";
import { trackEvent } from "@/shared/lib/analytics";
import { ROUTES } from "@/shared/constants/routes";

// TODO: 종료 테스트 목록 API 없음 (백엔드 요청 필요). 연동 전까지 빈 배열이라 섹션이 숨겨진다
const CLOSED_TESTS: ClosedTest[] = [];

export const Route = createFileRoute("/discovery/")({
  component: HomePage,
});

function HomePage() {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [getListTestsUrl()],
    queryFn: listTests,
  });

  // 포커스 복귀 등으로 인한 리페치 시 view_item_list가 중복 발생하지 않도록 최초 1회만 전송한다.
  const trackedRef = useRef(false);
  useEffect(() => {
    if (data && !trackedRef.current) {
      trackEvent("view_item_list", { list_name: "discovery" });
      trackedRef.current = true;
    }
  }, [data]);

  const tests: DiscoveryTest[] = (data?.data?.data?.tests ?? []).map((item) => ({
    id: item.id ?? 0,
    title: item.title ?? "",
    description: item.description ?? "",
    reward: item.reward ?? 0,
    thumbnailUrl: item.thumbnailUrl ?? "",
    liked: item.isLiked ?? false,
    categories: item.categories ?? [],
  }));

  const goToDetail = (testId: number) =>
    navigate({ to: ROUTES.DISCOVERY_DETAIL, params: { testId: String(testId) } });

  return (
    <div className="flex flex-col pb-44">
      <ServiceBanner />
      <div className="pt-6 flex flex-col gap-8">
        <RewardCarousel images={REWARD_CAROUSEL_IMAGES} />
        <AvailableTestSection
          tests={tests}
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
          onSelect={goToDetail}
        />
        <ClosedTestSection tests={CLOSED_TESTS} onSelect={goToDetail} />
      </div>
      <BottomTabBar activeTab="discover" />
    </div>
  );
}
