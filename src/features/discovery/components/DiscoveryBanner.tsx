import { Asset, Text } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";

export function DiscoveryBanner() {
  return (
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
  );
}
