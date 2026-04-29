import { createFileRoute } from "@tanstack/react-router";
import { BottomCTA } from "@toss/tds-mobile";
import { ImageCarousel } from "@/shared/components/ImageCarousel";
import { TestDetailHeader } from "@/features/discovery/$testId/components/TestDetailHeader";
import { TestDetailInfo } from "@/features/discovery/$testId/components/TestDetailInfo";

const DUMMY_IMAGES = [
  "https://static.toss.im/3d-emojis/u1F35C.png",
  "https://static.toss.im/3d-emojis/u1F35C.png",
  "https://static.toss.im/3d-emojis/u1F35C.png",
];

export const Route = createFileRoute("/discovery/$testId/")({
  component: TestDetailPage,
});

function TestDetailPage() {
  // const { testId } = Route.useParams();

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 overflow-y-auto pb-22.5">
        <TestDetailHeader
          title="메이트 사용성 테스트"
          tags={["여행", "운동"]}
        />
        <ImageCarousel images={DUMMY_IMAGES} />
        <TestDetailInfo
          reward={1500}
          description="테스트 한 줄 소개 최대 60자테스트 한 줄 소개 최대 60자테스트 한 줄 소개 최대 60자테스트 한 줄 소개 최대 60자테스트"
        />
      </div>

      <div className="fixed bottom-0 left-0 w-full">
        <BottomCTA.Single>테스트 참여하기</BottomCTA.Single>
      </div>
    </div>
  );
}
