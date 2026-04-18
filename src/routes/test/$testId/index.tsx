import { useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Asset, BottomCTA, ListRow, Paragraph, Top } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";

const DUMMY_IMAGES = [
  "https://static.toss.im/3d-emojis/u1F35C.png",
  "https://static.toss.im/3d-emojis/u1F35C.png",
  "https://static.toss.im/3d-emojis/u1F35C.png",
];

export const Route = createFileRoute("/test/$testId/")({
  component: TestDetailPage,
});

function TestDetailPage() {
  // const { testId } = Route.useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) < 30) return;
    if (diff > 0) {
      setCurrentIndex((i) => Math.min(i + 1, DUMMY_IMAGES.length - 1));
    } else {
      setCurrentIndex((i) => Math.max(i - 1, 0));
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 overflow-y-auto pb-[90px]">
        <Top
          title={
            <Top.TitleParagraph size={22} color={adaptive.grey900}>
              메이트 사용성 테스트
            </Top.TitleParagraph>
          }
          subtitleBottom={
            <Top.SubtitleBadges
              badges={[
                { text: `여행`, color: `elephant`, variant: `weak` },
                { text: `운동`, color: `elephant`, variant: `weak` },
              ]}
            />
          }
          lower={
            <Top.LowerButton
              color="primary"
              size="small"
              variant="weak"
              display="inline"
            >
              어떤 서비스인가요?
            </Top.LowerButton>
          }
        />

        {/* 썸네일 캐러셀 */}
        <div className="flex flex-col items-center px-4 gap-2">
          <div
            className="w-full h-[193px] rounded-2xl bg-cover bg-center"
            style={{
              backgroundImage: `url(${DUMMY_IMAGES[currentIndex]})`,
              boxShadow:
                "inset 0 0 0 1px var(--token-tds-color-grey-opacity-100, rgba(2,32,71,0.05))",
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          />

          {/* 페이지 인디케이터 */}
          <div className="flex flex-row gap-1 items-center p-2 mb-3">
            {DUMMY_IMAGES.map((_, i) => (
              <Asset.Icon
                key={i}
                frameShape={{ width: 12, height: 12 }}
                backgroundColor="transparent"
                name="icon-circle-16-mono"
                color={
                  i === currentIndex
                    ? adaptive.greyOpacity500
                    : adaptive.greyOpacity300
                }
                aria-hidden={true}
                ratio="1/1"
              />
            ))}
          </div>
        </div>

        {/* 보상 머니 */}
        <ListRow
          left={
            <ListRow.AssetIcon
              size="medium"
              name="icon-coin-yellow"
              backgroundColor={adaptive.yellow100}
            />
          }
          contents={
            <ListRow.Texts
              type="2RowTypeF"
              top="보상 머니"
              topProps={{ color: adaptive.grey500 }}
              bottom={<Paragraph.Text>1,500원</Paragraph.Text>}
              bottomProps={{ color: adaptive.grey800, fontWeight: `bold` }}
            />
          }
          verticalPadding="small"
          horizontalPadding="small"
        />

        {/* 한 줄 소개 */}
        <ListRow
          left={
            <ListRow.AssetIcon name="icon-document-line-fill" variant="fill" />
          }
          contents={
            <ListRow.Texts
              type="2RowTypeD"
              top="테스트 한줄 소개"
              topProps={{ color: adaptive.grey500 }}
              bottom="테스트 한 줄 소개 최대 60자테스트 한 줄 소개 최대 60자테스트 한 줄 소개 최대 60자테스트 한 줄 소개 최대 60자테스트"
              bottomProps={{ color: adaptive.grey700, fontWeight: `medium` }}
            />
          }
          verticalPadding="small"
          horizontalPadding="small"
        />
      </div>

      <div className="fixed bottom-0 left-0 w-full">
        <BottomCTA.Single>테스트 참여하기</BottomCTA.Single>
      </div>
    </div>
  );
}
