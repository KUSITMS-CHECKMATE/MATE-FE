import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Asset, BottomCTA, Spacing } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { MOCK_TEST_DETAIL } from "@/features/discovery-detail/model";
import {
  TestDetailHeader,
  TestDetailInfo,
} from "@/features/discovery-detail/ui";

export const Route = createFileRoute("/discovery/$testId")({
  component: TestDetailPage,
});

function TestDetailPage() {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const images = MOCK_TEST_DETAIL.images;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 overflow-y-auto pb-22.5">
        <TestDetailHeader
          title={MOCK_TEST_DETAIL.title}
          tags={MOCK_TEST_DETAIL.tags}
        />

        <div
          className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory"
          style={{ gap: "12px", margin: "0 20px" }}
          onScroll={(e) => {
            const target = e.target as HTMLDivElement;
            const index = Math.round(target.scrollLeft / target.clientWidth);
            setActiveImageIndex(index);
          }}
        >
          {images.map((src, i) => (
            <div key={i} className="snap-start shrink-0 w-full" style={{ aspectRatio: "16/9" }}>
              <img
                src={src}
                aria-hidden
                style={{ width: "100%", height: "100%", borderRadius: 16, objectFit: "cover" }}
              />
            </div>
          ))}
        </div>

        <Spacing size={16} />

        <div className="flex justify-center gap-1.5">
          {images.map((_, i) => (
            <Asset.Icon
              key={i}
              frameShape={{ width: 12, height: 12 }}
              backgroundColor="transparent"
              name="icon-circle-16-mono"
              color={i === activeImageIndex ? adaptive.greyOpacity500 : adaptive.greyOpacity300}
              aria-hidden
              ratio="1/1"
            />
          ))}
        </div>

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
