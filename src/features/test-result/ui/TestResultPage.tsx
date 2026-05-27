import { useState, useEffect, useRef } from "react";
import { graniteEvent } from "@apps-in-toss/web-framework";
import {
  Asset,
  Button,
  ListHeader,
  Result,
  Skeleton,
  Tab,
  Text,
  Top,
} from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { ResultTabContent } from "./ResultTabContent";
import { QuestionTabContent } from "./QuestionTabContent";
import { DownloadSheet } from "./DownloadSheet";
import { ReviewGuideAccordion } from "./ReviewGuideAccordion";
import { QuestionPreviewOverlay } from "./QuestionPreviewOverlay";
import { mapReportItemToQuestionResult } from "../model/mappers";
import { STATUS_BADGE } from "../model/constants";
import { useGetReportQuery } from "@/shared/api/report";
import type { TestStatus } from "@/shared/api/report";
import { useGetQuestionDetailQuery, useGetQuestionSummaryQuery } from "@/shared/api/question";

interface Props {
  testId: string;
}

function TestResultSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="px-5 pt-8 pb-4">
        <Skeleton
          custom={["subtitle", "title", "subtitle"]}
          repeatLastItemCount={0}
          background="greyOpacity100"
        />
      </div>
      <div className="px-5 pb-3">
        <Skeleton custom={["card"]} repeatLastItemCount={0} height={52} background="greyOpacity100" />
      </div>
      <div className="px-5 pb-4">
        <Skeleton custom={["subtitle"]} repeatLastItemCount={0} background="greyOpacity100" />
      </div>
      <div className="px-5">
        <Skeleton custom={["listWithIcon"]} repeatLastItemCount={4} background="greyOpacity100" />
      </div>
    </div>
  );
}

export function TestResultPage({ testId }: Props) {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [isDownloadSheetOpen, setIsDownloadSheetOpen] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);
  const selectedQuestionIdRef = useRef(selectedQuestionId);
  useEffect(() => {
    selectedQuestionIdRef.current = selectedQuestionId;
  }, [selectedQuestionId]);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    try {
      unsubscribe = graniteEvent.addEventListener("backEvent", {
        onEvent: () => {
          if (selectedQuestionIdRef.current !== null) {
            setSelectedQuestionId(null);
          } else {
            window.history.back();
          }
        },
        onError: (error) => {
          console.error("backEvent error", error);
        },
      });
    } catch {
      console.warn("backEvent listener not supported in browser");
    }
    return () => {
      unsubscribe?.();
    };
  }, []);

  const { data: reportData, isLoading } = useGetReportQuery(Number(testId));
  const report = reportData?.data;

  const { data: questionSummary = [] } = useGetQuestionSummaryQuery(Number(testId));
  const { data: previewQuestion } = useGetQuestionDetailQuery(Number(testId), selectedQuestionId);

  const testStatus: TestStatus = report?.testStatus ?? "IN_PROGRESS";
  const isEnded = testStatus === "COMPLETED";
  const isReviewState = testStatus === "WAITING" || testStatus === "REJECTED";
  const showParticipant = testStatus === "IN_PROGRESS" || testStatus === "COMPLETED";
  const results = (report?.reports ?? []).map(mapReportItemToQuestionResult);

  if (isLoading) {
    return <TestResultSkeleton />;
  }

  return (
    <div>
      {isEnded && (
        <div className="w-full sticky top-0 z-10 bg-white px-6 py-2">
          <div className="w-full h-9.5 bg-[#f2f4f6] rounded-[20px] px-2.5 py-2 flex flex-row gap-2 justify-start items-center">
            <Asset.Icon
              frameShape={{ width: 18 }}
              name="icon-info-circle-mono"
              color={adaptive.grey400}
              aria-hidden={true}
            />
            <Text display="block" color={adaptive.grey700} typography="t6" fontWeight="medium">
              여기서는 통계 요약만 알려드려요
            </Text>
          </div>
        </div>
      )}

      <Top
        lowerGap={isReviewState ? 0 : undefined}
        title={
          <Top.TitleParagraph size={22} color={adaptive.grey900}>
            질문별 결과 요약
          </Top.TitleParagraph>
        }
        subtitleTop={<Top.SubtitleBadges badges={[STATUS_BADGE[testStatus]]} />}
        subtitleBottom={
          <Top.SubtitleParagraph size={15}>
            총 {report?.questionCount ?? 0}개 질문
            {showParticipant && ` · ${report?.participantCount ?? 0}명 참여`}
          </Top.SubtitleParagraph>
        }
      />

      {isReviewState ? (
        <>
          <ReviewGuideAccordion />
          <ListHeader
            titleWidthRatio={0.6}
            title={
              <ListHeader.TitleParagraph typography="t5" fontWeight="medium" color={adaptive.grey800}>
                질문 목록
              </ListHeader.TitleParagraph>
            }
          />
          <QuestionTabContent
            questions={questionSummary}
            onSelectQuestion={setSelectedQuestionId}
            noPadding
          />
        </>
      ) : (
        <>
          <div className="w-full h-fit bg-white flex flex-col justify-start items-start px-5 pb-3">
            <Button
              size="large"
              display="block"
              disabled={!isEnded}
              onClick={() => setIsDownloadSheetOpen(true)}
            >
              통계 다운받기
            </Button>
          </div>

          <Tab
            className="mb-4"
            fluid={false}
            size="large"
            style={{ backgroundColor: adaptive.background }}
            onChange={(index) => setSelectedTabIndex(index)}
          >
            <Tab.Item key="0-질문" selected={selectedTabIndex === 0}>
              질문
            </Tab.Item>
            <Tab.Item key="1-결과" selected={selectedTabIndex === 1}>
              결과
            </Tab.Item>
          </Tab>

          {selectedTabIndex === 0 && (
            <QuestionTabContent
              questions={questionSummary}
              onSelectQuestion={setSelectedQuestionId}
            />
          )}

          {selectedTabIndex === 1 && !isEnded && (
            <Result
              title="아직 진행하고 있는 테스트에요"
              description="테스트가 끝나고 결과를 알려드릴게요"
              className="my-10"
              figure={
                <Asset.Image
                  frameShape={Asset.frameShape.CleanW60}
                  src="https://static.toss.im/2d-emojis/png/4x/u1F50D.png"
                  aria-hidden={true}
                />
              }
            />
          )}

          {selectedTabIndex === 1 && isEnded && <ResultTabContent results={results} />}
        </>
      )}

      <QuestionPreviewOverlay
        selectedQuestionId={selectedQuestionId}
        previewQuestion={previewQuestion}
        onClose={() => setSelectedQuestionId(null)}
      />

      <DownloadSheet open={isDownloadSheetOpen} onClose={() => setIsDownloadSheetOpen(false)} />
    </div>
  );
}
