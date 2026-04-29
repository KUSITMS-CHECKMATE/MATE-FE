import { Asset, Text } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";

export function TestBanner() {
  return (
    <div
      className="w-full h-30 flex flex-row justify-between items-center p-5"
      style={{
        background:
          "radial-gradient(465.08% 465.08% at 37.53% 10.84%, #d0d8f433 0%, #4365ccb2 100%)",
      }}
    >
      <div className="flex flex-col gap-1">
        <Text display="block" color="#4365cc" typography="st8" fontWeight="bold">
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
  );
}
