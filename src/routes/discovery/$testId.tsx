import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BottomCTA } from "@toss/tds-mobile";
import { getMockTestDetail } from "@/features/discovery-detail/model";
import {
  TestDetailHeader,
  TestDetailImageCarousel,
  TestDetailInfo,
} from "@/features/discovery-detail/ui";
import { ROUTES } from "@/shared/constants/routes";

export const Route = createFileRoute("/discovery/$testId")({
  component: TestDetailPage,
});

function TestDetailPage() {
  const { testId } = Route.useParams();
  const navigate = useNavigate();
  const testDetail = getMockTestDetail(testId);

  return (
    <div className="flex flex-col min-h-screen bg-white pb-17">
      <div className="flex-1 overflow-y-auto pb-22.5">
        <TestDetailHeader title={testDetail.title} tags={testDetail.tags} />
        <TestDetailImageCarousel images={testDetail.images} />
        <TestDetailInfo
          reward={testDetail.reward}
          description={testDetail.description}
          serviceName={testDetail.serviceName}
          serviceDescription={testDetail.serviceDescription}
        />
      </div>

      <div className="fixed bottom-0 left-0 w-full">
        <BottomCTA.Single
          onClick={() =>
            navigate({ to: ROUTES.TEST_PARTICIPATE, params: { testId } })
          }
        >
          테스트 참여하기
        </BottomCTA.Single>
      </div>
    </div>
  );
}
