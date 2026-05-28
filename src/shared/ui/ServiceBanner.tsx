import { Asset, Text } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";

export function ServiceBanner() {
  return (
    <div className="w-full h-30 bg-[#4365cc] p-5 flex flex-row gap-6 justify-between items-start">
      <div className="w-39 h-20 flex flex-col gap-1 justify-start items-start">
        <div className="w-full flex flex-col gap-1 justify-start items-start">
          <Text display="block" color={adaptive.background} typography="st8" fontWeight="bold">
            간단한 작성으로 테스트 등록해보세요
          </Text>
          <div className="w-full flex flex-row gap-1 justify-start items-center">
            <Text color="rgba(253,253,254,0.89)" typography="t7" fontWeight="regular">
              테스트 등록 방식 보기
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
      <div
        className="h-full bg-cover bg-center"
        style={{
          width: 119,
          backgroundImage: "url(/images/banner.png)",
        }}
      />
    </div>
  );
}
