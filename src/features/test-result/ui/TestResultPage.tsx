import { useState } from "react";
import { motion } from "framer-motion";
import { Asset, BottomCTA, Button, Result, Tab, Text, Top } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { ResultTabContent } from "./ResultTabContent";
import { QuestionTabContent } from "./QuestionTabContent";
import { DownloadSheet } from "./DownloadSheet";
import { MOCK_PREVIEW_QUESTIONS } from "../model/mock";
import { QuestionRenderer } from "@/features/test-participate/ui/QuestionRenderer";
import { FivesecAnswerPage } from "@/features/question-fivesec/answer/FivesecAnswerPage";

import type { ParticipateQuestion } from "@/features/test-participate/model/types";

interface Props {
  testId: string;
  status: "active" | "ended";
}

const OVERLAY_MOTION = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
} as const;

function QuestionPreviewOverlay({
  question,
  onClose,
}: {
  question: ParticipateQuestion;
  onClose: () => void;
}) {
  return (
    <motion.div {...OVERLAY_MOTION} className="fixed inset-0 z-60 flex flex-col bg-white">
      <div className="flex-1 overflow-y-auto">
        <QuestionRenderer
          question={question}
          answer={undefined}
          onChange={() => {}}
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

function FivesecPreviewOverlay({
  question,
  onClose,
}: {
  question: Extract<ParticipateQuestion, { type: "FIVE_SECOND" }>;
  onClose: () => void;
}) {
  const [answer, setAnswer] = useState<{ type: "FIVE_SECOND"; selectedIds: string[] }>({
    type: "FIVE_SECOND",
    selectedIds: [],
  });

  return (
    <motion.div
      {...OVERLAY_MOTION}
      className="fixed inset-0 z-49 flex flex-col overflow-y-auto bg-white pb-10"
    >
      <FivesecAnswerPage
        question={question}
        answer={answer}
        onChange={setAnswer}
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

export function TestResultPage({ status }: Props) {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [isDownloadSheetOpen, setIsDownloadSheetOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const previewQuestion = previewIndex !== null ? MOCK_PREVIEW_QUESTIONS[previewIndex] : null;
  const isFivesecPreview = previewQuestion?.type === "FIVE_SECOND";

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

      {selectedTabIndex === 0 && <QuestionTabContent onSelectQuestion={setPreviewIndex} />}
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

      {previewQuestion !== null && !isFivesecPreview && (
        <QuestionPreviewOverlay question={previewQuestion} onClose={() => setPreviewIndex(null)} />
      )}
      {isFivesecPreview && previewQuestion !== null && (
        <FivesecPreviewOverlay question={previewQuestion} onClose={() => setPreviewIndex(null)} />
      )}

      <DownloadSheet open={isDownloadSheetOpen} onClose={() => setIsDownloadSheetOpen(false)} />
    </div>
  );
}
