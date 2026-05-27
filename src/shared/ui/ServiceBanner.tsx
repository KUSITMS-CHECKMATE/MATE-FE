import { Asset, Text } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";

export function ServiceBanner() {
  return (
    <div
      style={{
        width: "100%",
        height: 120,
        backgroundColor: "#4365cc",
        padding: 20,
        display: "flex",
        flexDirection: "row",
        gap: 24,
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          width: 156,
          height: 80,
          display: "flex",
          flexDirection: "column",
          gap: 4,
          justifyContent: "flex-start",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 4,
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          <Text display="block" color={adaptive.background} typography="st8" fontWeight="bold">
            간단한 작성으로 테스트 등록해보세요
          </Text>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              gap: 4,
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
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
        style={{
          width: 119,
          height: "100%",
          backgroundImage: "url(/images/banner.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </div>
  );
}
