import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Asset, Button, ListRow, Text, Top } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { BottomTabBar } from "@/shared/ui/BottomTabBar";

export const Route = createFileRoute("/interest/")({
  component: InterestPage,
});

interface SavedTest {
  id: string;
  title: string;
  participants: number;
  date: string;
  questionCount: number;
}

// 실제 구현 시 API로 대체
const MOCK_SAVED_TESTS: SavedTest[] = [
  {
    id: "1",
    title: "모바일 UX 리서치",
    participants: 100,
    date: "2026.05.01",
    questionCount: 7,
  },
  {
    id: "2",
    title: "온보딩 플로우 테스트",
    participants: 47,
    date: "2026.04.15",
    questionCount: 5,
  },
  {
    id: "3",
    title: "결제 화면 A/B 테스트",
    participants: 83,
    date: "2026.03.28",
    questionCount: 3,
  },
];

async function downloadPdf(test: SavedTest) {
  const params = new URLSearchParams({
    testId: test.id,
    title: test.title,
    participants: String(test.participants),
    date: test.date,
  });

  // blob URL은 WebView에서 열 수 없으므로 직접 URL로 이동
  // Content-Disposition: attachment 헤더로 OS 다운로드 매니저가 처리
  const pdfUrl = `/api/pdf?${params.toString()}`;
  window.location.href = pdfUrl;
}

function TestReportCard({ test }: { test: SavedTest }) {
  const [loading, setLoading] = useState(false);

  function handleDownload() {
    setLoading(true);
    downloadPdf(test);
    // PDF 생성은 서버에서 ~5초 소요 — attachment 응답이므로 페이지는 유지됨
    setTimeout(() => setLoading(false), 8000);
  }

  return (
    <div className="w-full bg-white rounded-2xl overflow-hidden">
      <div className="px-4 pt-4 pb-3 flex flex-col gap-1">
        <div className="flex flex-row items-center gap-2">
          <Text display="block" color={adaptive.grey800} typography="t5" fontWeight="bold">
            {test.title}
          </Text>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <Text display="block" color={adaptive.grey500} typography="t7" fontWeight="medium">
            {test.date}
          </Text>
          <div className="w-0.75 h-0.75 rounded-full bg-[#d1d6db]" />
          <Text display="block" color={adaptive.grey500} typography="t7" fontWeight="medium">
            {test.participants}명 참여
          </Text>
          <div className="w-0.75 h-0.75 rounded-full bg-[#d1d6db]" />
          <Text display="block" color={adaptive.grey500} typography="t7" fontWeight="medium">
            {test.questionCount}개 질문
          </Text>
        </div>
      </div>

      <ListRow
        left={
          <ListRow.AssetIcon
            size="xsmall"
            shape="original"
            name="icon-document-pdf"
          />
        }
        contents={
          <ListRow.Texts
            type="2RowTypeF"
            top="통계 보고서"
            topProps={{ color: adaptive.grey500 }}
            bottom="PDF로 저장하기"
            bottomProps={{ color: adaptive.grey800, fontWeight: "bold" }}
          />
        }
        right={
          <Button
            size="small"
            disabled={loading}
            onClick={handleDownload}
          >
            {loading ? "생성 중..." : "다운로드"}
          </Button>
        }
        verticalPadding="large"
      />
    </div>
  );
}

function InterestPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f2f4f6]">
      <div className="bg-white">
        <Top
          title={
            <Top.TitleParagraph size={22} color={adaptive.grey900}>
              관심
            </Top.TitleParagraph>
          }
          subtitleBottom={
            <Top.SubtitleParagraph size={15}>
              저장한 테스트 통계를 PDF로 받아보세요
            </Top.SubtitleParagraph>
          }
        />
      </div>

      {MOCK_SAVED_TESTS.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 pb-24">
          <Asset.Image
            frameShape={Asset.frameShape.CleanW60}
            src="https://static.toss.im/2d-emojis/png/4x/u1F4C4.png"
            aria-hidden={true}
          />
          <Text display="block" color={adaptive.grey600} typography="t5" fontWeight="medium">
            저장된 테스트가 없어요
          </Text>
        </div>
      ) : (
        <div className="flex flex-col gap-3 p-5 pb-28">
          {MOCK_SAVED_TESTS.map((test) => (
            <TestReportCard key={test.id} test={test} />
          ))}
        </div>
      )}

      <BottomTabBar activeTab="interest" />
    </div>
  );
}
