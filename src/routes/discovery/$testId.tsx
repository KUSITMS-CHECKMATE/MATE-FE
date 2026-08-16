import { useEffect, useRef } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { graniteEvent } from "@apps-in-toss/web-framework";
import { BottomCTA } from "@toss/tds-mobile";
import { getTest, getGetTestUrl } from "@/shared/api/generated/test";
import {
  TestDetailHeader,
  TestDetailImageCarousel,
  TestDetailInfo,
} from "@/features/discovery-detail/ui";
import { ROUTES } from "@/shared/constants/routes";
import { trackEvent } from "@/shared/lib/analytics";

export const Route = createFileRoute("/discovery/$testId")({
  component: TestDetailPage,
});

function TestDetailPage() {
  const { testId } = Route.useParams();
  const navigate = useNavigate();

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    try {
      unsubscribe = graniteEvent.addEventListener("backEvent", {
        onEvent: () => {
          window.history.back();
        },
        onError: (error) => {
          console.error("backEvent error", error);
        },
      });
    } catch {
      console.warn("backEvent listener not supported in browser");
    }
    return () => {
      unsubscribe?.();
    };
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: [getGetTestUrl(Number(testId))],
    queryFn: () => getTest(Number(testId)),
  });

  const detail = data?.data?.data;

  // 리페치 시 view_item이 중복 발생하지 않도록 testId당 최초 1회만 전송한다.
  const trackedTestIdRef = useRef<string | null>(null);
  useEffect(() => {
    if (detail && trackedTestIdRef.current !== testId) {
      trackEvent("view_item", { test_id: testId, test_category: detail.categories?.[0] });
      trackedTestIdRef.current = testId;
    }
  }, [detail, testId]);

  if (isLoading || !detail) {
    return <div className="flex flex-col min-h-screen bg-white" />;
  }

  const isWaiting = detail.testStatus === "WAITING";
  const isCompleted = detail.testStatus === "COMPLETED";
  const hasResponded = detail.hasResponded ?? false;
  const isDisabled = isWaiting || isCompleted || hasResponded;

  const ctaLabel = isWaiting
    ? "검토중인 테스트예요"
    : isCompleted
      ? "종료된 설문이에요"
      : hasResponded
        ? "참여한 테스트예요"
        : "테스트 참여하기";

  return (
    <div className="flex flex-col min-h-screen bg-white pb-17">
      <div className="flex-1 overflow-y-auto pb-22.5">
        <TestDetailHeader title={detail.title ?? ""} tags={detail.categories ?? []} />
        <TestDetailImageCarousel images={detail.imageUrls ?? []} />
        <TestDetailInfo
          reward={detail.reward ?? 0}
          description={detail.description ?? ""}
          serviceName={detail.serviceName ?? ""}
          serviceDescription={detail.serviceDescription ?? ""}
        />
      </div>

      <div className="fixed bottom-0 left-0 w-full">
        <BottomCTA.Single
          disabled={isDisabled}
          onClick={() => {
            trackEvent("join_test", { test_id: testId, reward_amount: detail.reward });
            navigate({
              to: ROUTES.TEST_PARTICIPATE,
              params: { testId },
              search: { reward: detail.reward },
            });
          }}
        >
          {ctaLabel}
        </BottomCTA.Single>
      </div>
    </div>
  );
}
