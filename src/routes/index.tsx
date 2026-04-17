import { createFileRoute } from "@tanstack/react-router";
import { Asset, Result, Text } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="flex flex-col">
      {/* banner */}
      <div className="w-full h-30 bg-linear-to-b from-[#fff6de] to-[#fae7b2] flex items-center overflow-hidden gap-6">
        <Asset.Image
          frameShape={{ width: 150, height: 150 }}
          backgroundColor="transparent"
          src="https://static.toss.im/3d-emojis/u1F35C.png"
          aria-hidden={true}
          className="shrink-0 -mb-9 ml-3 mt-2"
        />
        <div className="flex flex-col gap-1 items-start">
          <div className="flex flex-col">
            <Text color={adaptive.grey800} typography="st8" fontWeight="bold">
              가을에는 따뜻한 라멘
            </Text>
            <Text color={adaptive.grey800} typography="st8" fontWeight="bold">
              최대 5,000원 할인
            </Text>
          </div>
          <Text color={adaptive.grey600} typography="t7" fontWeight="regular">
            최소주문금액 없는 라멘집만
          </Text>
        </div>
      </div>

      {/* content */}
      <div className="flex flex-col">
        <div className="flex px-4 pt-6 pb-3 gap-1">
          <Text color={adaptive.grey800} typography="t4" fontWeight="bold">
            참여 가능 테스트
          </Text>
          <Text color="#4365cc" typography="t4" fontWeight="bold">
            0
          </Text>
        </div>

        {/* 참여할 수 없는 테스트 */}
        <Result
          title="참여할 수 있는 테스트가 없어요"
          description="참여 가능한 테스트가 생기면 알려드릴게요"
          figure={
            <Asset.Lottie
              frameShape={Asset.frameShape.CleanW60}
              src="https://static.toss.im/lotties-common/empty-spot.json"
              aria-hidden={true}
            />
          }
          button={
            <Result.Button color="dark" variant="weak">
              다시 시도하기
            </Result.Button>
          }
        />
      </div>
    </div>
  );
}
