import { createFileRoute } from "@tanstack/react-router";
import { BottomCTA, ListRow, Paragraph, Top } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { ImageCarousel } from "@/shared/components/ImageCarousel";

const DUMMY_IMAGES = [
  "https://static.toss.im/3d-emojis/u1F35C.png",
  "https://static.toss.im/3d-emojis/u1F35C.png",
  "https://static.toss.im/3d-emojis/u1F35C.png",
];

export const Route = createFileRoute("/tester/test/$testId/")({
  component: TestDetailPage,
});

function TestDetailPage() {
  // const { testId } = Route.useParams();

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 overflow-y-auto pb-22.5">
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

        <ImageCarousel images={DUMMY_IMAGES} />

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
