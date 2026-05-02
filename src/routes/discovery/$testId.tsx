import { createFileRoute } from "@tanstack/react-router";
import { BottomCTA } from "@toss/tds-mobile";
import { MOCK_TEST_DETAIL } from "@/features/discovery-detail/model";
import {
  TestDetailHeader,
  TestDetailInfo,
} from "@/features/discovery-detail/ui";
import { ImageCarousel } from "@/shared/ui/ImageCarousel";

export const Route = createFileRoute("/discovery/$testId")({
  component: TestDetailPage,
});

function TestDetailPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 overflow-y-auto pb-22.5">
        <TestDetailHeader
          title={MOCK_TEST_DETAIL.title}
          tags={MOCK_TEST_DETAIL.tags}
        />
        <ImageCarousel images={MOCK_TEST_DETAIL.images} />
        <TestDetailInfo
          reward={MOCK_TEST_DETAIL.reward}
          description={MOCK_TEST_DETAIL.description}
        />
      </div>

      <div className="fixed bottom-0 left-0 w-full">
        <BottomCTA.Single>테스트 참여하기</BottomCTA.Single>
      </div>
    </div>
  );
}
