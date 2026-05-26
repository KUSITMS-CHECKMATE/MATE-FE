import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Asset,
  BottomCTA,
  Button,
  ListHeader,
  ListRow,
  Post,
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
import { MOCK_PREVIEW_QUESTIONS } from "../model/mock";
import { mapReportItemToQuestionResult } from "../model/mappers";
import { useGetReportQuery } from "@/shared/api/report";
import type { TestStatus } from "@/shared/api/report";
import { QuestionRenderer } from "@/features/test-participate/ui/QuestionRenderer";
import { FivesecAnswerPage } from "@/features/question-fivesec/answer/FivesecAnswerPage";

import type { ParticipateQuestion } from "@/features/test-participate/model/types";

interface Props {
  testId: string;
}

type BadgeConfig = {
  text: string;
  color: "green" | "elephant" | "red" | "yellow";
  variant: "weak";
};

const STATUS_BADGE: Record<TestStatus, BadgeConfig> = {
  WAITING: { text: "검토중", color: "yellow", variant: "weak" },
  IN_PROGRESS: { text: "진행중", color: "green", variant: "weak" },
  COMPLETED: { text: "종료", color: "elephant", variant: "weak" },
  REJECTED: { text: "반려", color: "red", variant: "weak" },
};

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

function TestResultSkeleton() {
  return (
    <div className="flex flex-col">
      {/* Top 영역 */}
      <div className="px-5 pt-8 pb-4">
        <Skeleton
          custom={["subtitle", "title", "subtitle"]}
          repeatLastItemCount={0}
          background="greyOpacity100"
        />
      </div>

      {/* 버튼 영역 */}
      <div className="px-5 pb-3">
        <Skeleton
          custom={["card"]}
          repeatLastItemCount={0}
          height={52}
          background="greyOpacity100"
        />
      </div>

      {/* 탭 영역 */}
      <div className="px-5 pb-4">
        <Skeleton custom={["subtitle"]} repeatLastItemCount={0} background="greyOpacity100" />
      </div>

      {/* 질문 목록 영역 */}
      <div className="px-5">
        <Skeleton custom={["listWithIcon"]} repeatLastItemCount={4} background="greyOpacity100" />
      </div>
    </div>
  );
}

export function TestResultPage({ testId }: Props) {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [isDownloadSheetOpen, setIsDownloadSheetOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const [isGuideExpanded, setIsGuideExpanded] = useState(false);

  const { data: reportData, isLoading } = useGetReportQuery(Number(testId));
  const report = reportData?.data;
  console.log("[report]", reportData);

  const testStatus: TestStatus = report?.testStatus ?? "IN_PROGRESS";
  const isEnded = testStatus === "COMPLETED";
  const isReviewState = testStatus === "WAITING" || testStatus === "REJECTED";
  const showParticipant = testStatus === "IN_PROGRESS" || testStatus === "COMPLETED";
  const results = (report?.reports ?? []).map(mapReportItemToQuestionResult);

  const previewQuestion = previewIndex !== null ? MOCK_PREVIEW_QUESTIONS[previewIndex] : null;
  const isFivesecPreview = previewQuestion?.type === "FIVE_SECOND";

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
          <ListRow
            left={<ListRow.AssetIcon size="xsmall" shape="original" name="icn-service-316-color" />}
            contents={
              <ListRow.Texts
                type="1RowTypeC"
                top="내부 검토 기준 확인하기"
                topProps={{ color: adaptive.grey800 }}
              />
            }
            verticalPadding="xlarge"
            arrowType={isGuideExpanded ? "up" : "down"}
            onClick={() => setIsGuideExpanded((prev) => !prev)}
          />
          <AnimatePresence initial={false}>
            {isGuideExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
              >
                <div
                  style={{
                    width: "100%",
                    backgroundColor:
                      "var(--token-tds-color-grey-background, var(--adaptiveGreyBackground, #f2f4f6))",
                    paddingTop: 16,
                    paddingBottom: 16,
                    paddingLeft: 8,
                    paddingRight: 8,
                  }}
                >
                  <Post.Paragraph paddingBottom={4} typography="t6">
                    앱인토스 필수 정책에 따라 해당 테스트가 반려 되었어요.
                  </Post.Paragraph>
                  <Post.Paragraph paddingBottom={16} typography="t6">
                    아래에 해당하는 서비스 테스트는 등록이 불가해요.
                  </Post.Paragraph>

                  {[
                    { title: "디지털 자산 및 가상자산 관련 서비스", desc: "디지털 자산의 소유, 이전, 저장, 거래, 중개, 발행(NFT 포함) 등의 기능을 제공하는 서비스는 법적 요건 충족 여부와 관계없이 토스 플랫폼에서는 자산 손실, 소비자 피해, 자금세탁 리스크에 따라 등록이 불가해요." },
                    { title: "자금세탁 가능성이 있는 서비스", desc: "미니앱 내에서 현금 또는 유사 자산의 직접적인 교환, 전환, 환불 기능이 포함된 경우, 거래 구조상 자금세탁 통로로 악용될 수 있기 때문에 등록이 불가해요." },
                    { title: "불법 또는 부정행위를 조장하는 서비스", desc: "법적으로 금지되거나 사회적 물의를 일으킬 수 있는 신분 조작, 해킹, 불법 문서 제공, 정보 수집 우회 등의 기능이 포함된 서비스는 명백히 등록이 불가해요." },
                    { title: "사행성 및 복권/베팅성 콘텐츠 포함 서비스", desc: "사행성 요소가 포함된 콘텐츠는 사용자 재산상 손실, 중독 유발, 연령 제한 문제 등으로 위법 소지가 있으며, 사용자 보호 및 서비스 신뢰도 확보를 위해 등록이 불가해요." },
                    { title: "금융 상품 중개 · 판매 · 광고 서비스", desc: "대출, 보험, 카드, 증권 등 금융 상품 관련 서비스는 법적 인허가 여부와 관계없이 소비자 보호, 금융정보의 정확성, 오인 가능성 등으로 인한 운영 리스크를 방지하기 위해 등록이 불가능하며, 향후 내부 정책 및 기준 정비에 따라 오픈 여부가 검토될 수 있어요." },
                    { title: "투자 자문, 리딩방, 유료 정보 제공 서비스", desc: "특정 종목 추천이나 투자 전략 안내 등으로 개인 투자자의 의사결정에 영향을 미치는 서비스는 운영 리스크 및 정책적 수용 미비로 인해 등록이 불가해요." },
                    { title: "의료 관련 서비스", desc: "비대면 진료 제공 또는 연결, 의료 행위로의 직접적인 연결, 병원 예약 기능, 병원으로부터 광고비를 수취하는 구조(유저 유입 기반 수익 모델), 병원 홍보/마케팅으로 해석될 수 있는 수익 구조 등의 경우 서비스 출시가 불가해요." },
                    { title: "이외 내부 정책상 승인 불가 서비스", desc: "법률 위반 여부와 관계없이 토스의 브랜드 신뢰성, UX 정책, 리스크 관리 방침에 따라 등록이 제한될 수 있어요." },
                  ].map(({ title, desc }, i) => (
                    <div key={i}>
                      <Post.Paragraph paddingBottom={2} typography="t6" fontWeight="bold">
                        {`${i + 1}. ${title}`}
                      </Post.Paragraph>
                      <Post.Paragraph paddingBottom={i < 7 ? 12 : 0} typography="t6">
                        {desc}
                      </Post.Paragraph>
                    </div>
                  ))}

                  <Post.Hr paddingBottom={0} />

                  <Post.Ul paddingBottom={0} typography="t6">
                    <Post.Li>
                      심사 결과는 내부 정책 및 리스크 검토 절차에 따라 변경될 수 있으며, 사전 등록을
                      보장하지 않아요.
                    </Post.Li>
                    <Post.Li>
                      서비스 특수성, 비즈니스 모델에 따라 사전 상담 또는 추가 설명 요청이 있을 수
                      있어요.
                    </Post.Li>
                    <Post.Li>
                      기존 회사 및 서비스를 단순 홍보하기 위해서 앱인토스 미니앱을 출시할 수 없어요.
                    </Post.Li>
                    <Post.Li>
                      위 내용 외에도 사용자 보호 및 신뢰성 확보를 위한 추가 기준이 적용될 수 있어요.
                    </Post.Li>
                  </Post.Ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <ListHeader
            titleWidthRatio={0.6}
            title={
              <ListHeader.TitleParagraph
                typography="t5"
                fontWeight="medium"
                color={adaptive.grey800}
              >
                질문 목록
              </ListHeader.TitleParagraph>
            }
          />
          <QuestionTabContent onSelectQuestion={setPreviewIndex} />
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

          {selectedTabIndex === 0 && <QuestionTabContent onSelectQuestion={setPreviewIndex} />}

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

      {previewQuestion !== null && !isFivesecPreview && (
        <QuestionPreviewOverlay question={previewQuestion} onClose={() => setPreviewIndex(null)} />
      )}
      {isFivesecPreview && previewQuestion !== null && (
        <FivesecPreviewOverlay
          question={previewQuestion as Extract<ParticipateQuestion, { type: "FIVE_SECOND" }>}
          onClose={() => setPreviewIndex(null)}
        />
      )}

      <DownloadSheet open={isDownloadSheetOpen} onClose={() => setIsDownloadSheetOpen(false)} />
    </div>
  );
}
