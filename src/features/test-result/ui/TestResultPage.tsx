import { useState } from "react";
import { motion } from "framer-motion";
import { Asset, BottomCTA, BottomSheet, Button, Checkbox, ListRow, Result, Tab, Text, Top } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { ResultTabContent } from "./ResultTabContent";
import { MOCK_QUESTIONS, MOCK_PREVIEW_QUESTIONS } from "../model/mock";
import { QuestionRenderer } from "@/features/test-participate/ui/QuestionRenderer";
import { FivesecAnswerPage } from "@/features/question-fivesec/answer/FivesecAnswerPage";

import type { ParticipateQuestion } from "@/features/test-participate/model/types";

interface Props {
  testId: string;
  status: "active" | "ended";
}

const MOTION_PROPS = {
  className: "fixed inset-0 z-60 flex flex-col bg-white",
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
} as const;

function QuestionPreviewOverlay({ question, onClose }: { question: ParticipateQuestion; onClose: () => void }) {
  const noop = () => {};

  // fivesec은 FivesecAnswerPage가 CTA를 직접 관리 (FivesecCreatePage 미리보기와 동일)
  if (question.type === "fivesec") {
    return (
      <motion.div {...MOTION_PROPS} className="fixed inset-0 z-60 flex flex-col overflow-y-auto bg-white pb-10">
        <FivesecAnswerPage
          question={question}
          answer={{ type: "fivesec", selectedIds: [] }}
          onChange={noop}
          onPrev={onClose}
          onGoNext={onClose}
          isFirst={false}
          isLast={true}
          prevLabel="돌아가기"
          isPreview={true}
        />
      </motion.div>
    );
  }

  return (
    <motion.div {...MOTION_PROPS} className="fixed inset-0 z-60 flex flex-col bg-white">
      <div className="flex-1 overflow-y-auto">
        <QuestionRenderer
          question={question}
          answer={undefined}
          onChange={noop}
          onPrev={onClose}
          onGoNext={onClose}
          isFirst={true}
          isLast={true}
        />
      </div>
      <BottomCTA.Single color="dark" variant="weak" onClick={onClose}>
        뒤로가기
      </BottomCTA.Single>
    </motion.div>
  );
}

export function TestResultPage({ testId, status }: Props) {
  console.log(testId);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [isDownloadSheetOpen, setIsDownloadSheetOpen] = useState(false);
  const [selectedFormats, setSelectedFormats] = useState({ pdf: false, csv: false });
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const previewQuestion = previewIndex !== null ? MOCK_PREVIEW_QUESTIONS[previewIndex] : null;

  function toggleFormat(format: "pdf" | "csv") {
    setSelectedFormats((prev) => ({ ...prev, [format]: !prev[format] }));
  }

  return (
    <div>
      {status === "ended" && (
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
        title={
          <Top.TitleParagraph size={22} color={adaptive.grey900}>
            질문별 결과 요약
          </Top.TitleParagraph>
        }
        subtitleTop={
          <Top.SubtitleBadges
            badges={[
              status === "active"
                ? { text: "진행중", color: "green", variant: "weak" }
                : { text: "종료", color: "elephant", variant: "weak" },
            ]}
          />
        }
        subtitleBottom={
          <Top.SubtitleParagraph size={15}>총 8개 질문 · 100명 참여</Top.SubtitleParagraph>
        }
      />
      <div className="w-full h-fit bg-white flex flex-col justify-start items-start px-5 pb-3">
        <Button
          size="large"
          display="block"
          disabled={status !== "ended"}
          onClick={() => setIsDownloadSheetOpen(true)}
        >
          통계 다운받기
        </Button>
      </div>
      <Tab
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
        <div className="flex flex-col py-4">
          {MOCK_QUESTIONS.map((question, index) => (
            <div
              key={question.id}
              role="button"
              tabIndex={0}
              className="w-full bg-white py-3 px-5 flex flex-row gap-1 items-center active:bg-gray-50 cursor-pointer"
              onClick={() => setPreviewIndex(index)}
              onKeyDown={(e) => e.key === "Enter" && setPreviewIndex(index)}
            >
              <div className="w-full flex flex-row gap-3 items-center">
                <Asset.Text
                  frameShape={Asset.frameShape.CircleMedium}
                  backgroundColor={adaptive.greyOpacity100}
                  style={{ color: `#4365cb`, fontSize: `13px`, fontWeight: `bold` }}
                  aria-label=""
                >
                  {String(index + 1).padStart(2, "0")}
                </Asset.Text>
                <div className="w-full flex flex-row gap-3 justify-between items-center">
                  <div className="w-full flex flex-col">
                    <Text
                      display="block"
                      color={adaptive.grey800}
                      typography="t5"
                      fontWeight="semibold"
                    >
                      {question.title}
                    </Text>
                    <Text
                      display="block"
                      color={adaptive.grey600}
                      typography="t6"
                      fontWeight="medium"
                    >
                      {question.type}
                    </Text>
                  </div>
                  <Asset.Icon
                    frameShape={Asset.frameShape.CleanW24}
                    backgroundColor="transparent"
                    name="icon-system-arrow-right-outlined"
                    aria-hidden={true}
                    ratio="1/1"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {selectedTabIndex === 1 && status === "active" && (
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
      {selectedTabIndex === 1 && status === "ended" && <ResultTabContent />}

      {/* 질문 미리보기 전체화면 오버레이 */}
      {previewQuestion !== null && (
        <QuestionPreviewOverlay
          question={previewQuestion}
          onClose={() => setPreviewIndex(null)}
        />
      )}

      {/* 다운로드 BottomSheet */}
      <BottomSheet
        header={
          <BottomSheet.Header>다운로드할 형식을 선택해주세요</BottomSheet.Header>
        }
        open={isDownloadSheetOpen}
        onClose={() => setIsDownloadSheetOpen(false)}
        cta={
          <BottomSheet.DoubleCTA
            leftButton={
              <Button color="dark" variant="weak" onClick={() => setIsDownloadSheetOpen(false)}>
                닫기
              </Button>
            }
            // TODO: 선택한 형식(selectedFormats)으로 파일 다운로드 API 연결 후 onClick 구현
            rightButton={<Button disabled={!selectedFormats.pdf && !selectedFormats.csv}>다운받기</Button>}
          />
        }
      >
        <ListRow
          role="checkbox"
          aria-checked={selectedFormats.pdf}
          onClick={() => toggleFormat("pdf")}
          left={
            <ListRow.AssetIcon
              size="xsmall"
              shape="original"
              name="icon-document-pdf"
            />
          }
          contents={
            <ListRow.Texts
              type="1RowTypeA"
              top="통계 보고서"
              topProps={{ color: adaptive.grey700 }}
            />
          }
          right={<Checkbox.Line size={24} checked={selectedFormats.pdf} />}
          verticalPadding="large"
        />
        <ListRow
          role="checkbox"
          aria-checked={selectedFormats.csv}
          onClick={() => toggleFormat("csv")}
          left={
            <ListRow.AssetIcon
              size="xsmall"
              shape="original"
              name="icon-googlespreadsheet-mono"
              color={adaptive.green600}
            />
          }
          contents={
            <ListRow.Texts
              type="1RowTypeA"
              top="CSV"
              topProps={{ color: adaptive.grey700 }}
            />
          }
          right={<Checkbox.Line size={24} checked={selectedFormats.csv} />}
          verticalPadding="large"
        />
      </BottomSheet>
    </div>
  );
}
