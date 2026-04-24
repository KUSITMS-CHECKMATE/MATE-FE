import { createFileRoute } from "@tanstack/react-router";
import { Asset, IconButton, Result, Text } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { BottomTabBar } from "@/shared/components/BottomTabBar";
import { MakerTestCard } from "@/features/maker/components/MakerTestCard";

const DUMMY_TESTS = [
  {
    id: 1,
    title: "테스트명",
    participantCount: 38,
    maxParticipantCount: 100,
    status: "active" as const,
  },
  {
    id: 2,
    title: "테스트명",
    participantCount: 38,
    maxParticipantCount: 100,
    status: "ended" as const,
  },
  {
    id: 3,
    title: "테스트명",
    participantCount: 38,
    maxParticipantCount: 100,
    status: "ended" as const,
  },
  {
    id: 4,
    title: "테스트명",
    participantCount: 38,
    maxParticipantCount: 100,
    status: "ended" as const,
  },
  {
    id: 5,
    title: "테스트명",
    participantCount: 38,
    maxParticipantCount: 100,
    status: "ended" as const,
  },
];

export const Route = createFileRoute("/maker/")({
  component: MakerHomePage,
});

function MakerHomePage() {
  return (
    <div className="flex flex-col">
      {/* 배너 */}
      <div
        className="w-full h-30 flex flex-row justify-between items-center p-5"
        style={{
          background:
            "radial-gradient(465.08% 465.08% at 37.53% 10.84%, #d0d8f433 0%, #4365ccb2 100%)",
        }}
      >
        <div className="flex flex-col gap-1">
          <Text
            display="block"
            color="#4365cc"
            typography="st8"
            fontWeight="bold"
          >
            간단한 작성으로 테스트 등록해보세요
          </Text>
          <div className="flex flex-row items-center gap-0.5">
            <Text
              color={adaptive.greyOpacity500}
              typography="t7"
              fontWeight="regular"
            >
              테스트 등록 방식 보기
            </Text>
            <Asset.Icon
              frameShape={{ width: 12, height: 12 }}
              backgroundColor="transparent"
              name="icon-arrow-right-textbutton-thin-mono"
              color={adaptive.greyOpacity500}
              aria-hidden={true}
              ratio="1/1"
            />
          </div>
        </div>
        <Asset.Image
          frameShape={{ width: 80, height: 80 }}
          backgroundColor="transparent"
          src="https://static.toss.im/ml-product/tosst-inapp_bh6z3j4gav9nz6bnwy9y5d6z.png"
          aria-hidden={true}
          style={{ aspectRatio: "1/1" }}
        />
      </div>

      {/* 내 테스트 타이틀 */}
      <div className="w-full bg-white px-6 py-6 flex flex-row gap-1">
        <Text color={adaptive.grey800} typography="t4" fontWeight="bold">
          내 테스트
        </Text>
        <Text color="#4365cc" typography="t4" fontWeight="bold">
          {DUMMY_TESTS.length}
        </Text>
      </div>

      {/* 테스트 목록 */}
      <div className="">
        {DUMMY_TESTS.length > 0 ? (
          <div className="flex flex-col gap-3 px-4 pb-24">
            {DUMMY_TESTS.map((test) => (
              <MakerTestCard
                key={test.id}
                title={test.title}
                participantCount={test.participantCount}
                maxParticipantCount={test.maxParticipantCount}
                status={test.status}
              />
            ))}
          </div>
        ) : (
          <Result
            title="등록한 테스트가 없어요"
            description="테스트를 등록하고 유저 피드백을 받아봐요"
            figure={
              <Asset.Lottie
                frameShape={Asset.frameShape.CleanW60}
                src="https://static.toss.im/lotties-common/empty-spot.json"
                aria-hidden={true}
              />
            }
          />
        )}
      </div>

      {/* 플로팅 플러스 버튼 */}
      <div className="flex justify-end fixed right-4 bottom-24 w-full h-fit overflow-visible ">
        <IconButton
          className="pointer-events-auto"
          src="https://static.toss.im/icons/png/4x/icon-plus-thin-mono.png"
          iconSize={24}
          variant="fill"
          color={adaptive.background}
          bgColor="#4365CC"
          aria-label="테스트 등록"
          style={{
            borderRadius: "9999px",
          }}
        />
      </div>

      <BottomTabBar activeTab="test" />
    </div>
  );
}
