import { Asset, Text } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";

export function DiscoveryBanner() {
  return (
    <div
      className="w-full h-30 flex flex-row gap-6 justify-between items-start p-5"
      style={{
        background:
          "radial-gradient(210.23% 210.23% at 13.24% 19.39%, #4365cc 0%, #d0d8f4 100%)",
      }}
    >
      <div className="h-20 flex flex-col gap-1 items-start">
        <div className="w-full flex flex-col gap-1 items-start">
          <Text
            display="block"
            color={adaptive.background}
            typography="st8"
            fontWeight="bold"
          >
            테스트 참여하고 <br />
            리워드 보상 받아봐요
          </Text>
          <div className="w-full flex flex-row gap-1 items-center">
            <Text
              color="rgba(253,253,254,0.89)"
              typography="t7"
              fontWeight="regular"
            >
              테스트 진행 방식 보기
            </Text>
            <Asset.Icon
              frameShape={{ width: 12, height: 12 }}
              backgroundColor="transparent"
              name="icon-arrow-right-textbutton-thin-mono"
              color="rgba(253,253,255,0.75)"
              aria-hidden={true}
              ratio="1/1"
            />
          </div>
        </div>
      </div>
      <Asset.Lottie
        frameShape={{ width: 80, height: 80 }}
        backgroundColor="transparent"
        src="https://static.toss.im/3d-common/coin-silver-spot.json"
        loop={false}
        speed={1}
        aria-hidden={true}
        className="aspect-square"
      />
    </div>
  );
}
