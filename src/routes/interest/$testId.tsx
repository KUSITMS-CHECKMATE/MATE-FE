import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Asset, BottomCTA, Result } from "@toss/tds-mobile";
import { getTest, getGetTestUrl } from "@/shared/api/generated/test";
import {
  TestDetailHeader,
  TestDetailImageCarousel,
  TestDetailInfo,
} from "@/features/discovery-detail/ui";
import { ROUTES } from "@/shared/constants/routes";

// mock: 종료된 테스트 ID (API에 testStatus 필드 추가되면 대체)
const CLOSED_TEST_IDS = new Set([2]);

export const Route = createFileRoute("/interest/$testId")({
  component: InterestTestDetailPage,
});

function InterestTestDetailPage() {
  const { testId } = Route.useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: [getGetTestUrl(Number(testId))],
    queryFn: () => getTest(Number(testId)),
  });

  const detail = data?.data?.data;
  const isClosed = CLOSED_TEST_IDS.has(Number(testId));

  if (isLoading) {
    return <div className="flex flex-col min-h-screen bg-white" />;
  }

  if (isError || !detail) {
    return (
      <div className="flex flex-col min-h-screen bg-white items-center justify-center px-6">
        <Result
          title="테스트를 불러오지 못했어요"
          description="잠시 후 다시 시도해 주세요"
          figure={
            <Asset.Lottie
              frameShape={Asset.frameShape.CleanW60}
              src="https://static.toss.im/lotties-common/error-spot.json"
              aria-hidden={true}
            />
          }
          button={
            <Result.Button color="dark" variant="weak" onClick={() => navigate({ to: ROUTES.INTEREST })}>
              돌아가기
            </Result.Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white pb-17">
      <div className="flex-1 overflow-y-auto pb-22.5">
        <TestDetailHeader
          title={detail.title ?? ""}
          tags={detail.categories ?? []}
        />
        <TestDetailImageCarousel images={detail.imageUrls ?? []} />
        <TestDetailInfo
          reward={detail.reward ?? 0}
          description={detail.description ?? ""}
          serviceName={detail.serviceName ?? ""}
          serviceDescription={detail.serviceDescription ?? ""}
        />
      </div>

      <div className="fixed bottom-0 left-0 w-full">
        {isClosed ? (
          <BottomCTA.Single disabled>종료된 설문이에요</BottomCTA.Single>
        ) : (
          <BottomCTA.Single
            onClick={() =>
              navigate({ to: ROUTES.TEST_PARTICIPATE, params: { testId } })
            }
          >
            테스트 참여하기
          </BottomCTA.Single>
        )}
      </div>
    </div>
  );
}
