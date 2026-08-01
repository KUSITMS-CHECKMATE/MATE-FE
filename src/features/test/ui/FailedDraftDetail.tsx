import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Asset, BoardRow, Post, Result, Skeleton, Tab, Text, Top } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { getDraft, getGetDraftUrl } from "@/shared/api/generated/testDraft";
import { QuestionTabContent, QuestionPreviewOverlay } from "@/features/test-result/ui";
import { extractDraftQuestions } from "../model";

interface Props {
  draftId: number;
}

function FailedDraftSkeleton() {
  return (
    <div className="flex flex-col gap-1 px-5 pt-8">
      <Skeleton custom={["subtitle", "title", "subtitle"]} repeatLastItemCount={0} background="greyOpacity100" />
      <div className="pt-6 flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} custom={["title", "subtitle"]} repeatLastItemCount={0} background="greyOpacity100" />
        ))}
      </div>
    </div>
  );
}

export function FailedDraftDetail({ draftId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: [getGetDraftUrl(draftId)],
    queryFn: () => getDraft(draftId),
  });

  const draft = data?.data?.data;

  if (isLoading || !draft) {
    return <FailedDraftSkeleton />;
  }

  const { summaries, previewMap } = extractDraftQuestions(draft);
  const previewQuestion = selectedQuestionId != null ? previewMap[selectedQuestionId] : undefined;

  return (
    <div className="flex flex-col">
      <div className="w-full sticky top-0 z-10 bg-white px-6 py-2">
        <div className="w-full h-9.5 bg-[#f2f4f6] rounded-[20px] px-2.5 py-2 flex flex-row gap-2 justify-start items-center">
          <Asset.Icon
            frameShape={{ width: 18 }}
            name="icon-info-circle-mono"
            color={adaptive.grey400}
            aria-hidden={true}
          />
          <Text display="block" color={adaptive.grey700} typography="t6" fontWeight="medium">
            시스템 문제로 결제는 됐지만 등록에 실패했어요
          </Text>
        </div>
      </div>

      <Top
        title={
          <Top.TitleParagraph size={22} color={adaptive.grey900}>
            질문별 결과 요약
          </Top.TitleParagraph>
        }
        subtitleTop={
          <Top.SubtitleBadges badges={[{ text: "등록 실패", color: "red", variant: "fill" }]} />
        }
        subtitleBottom={<Top.SubtitleParagraph size={15}>총 {summaries.length}개 질문</Top.SubtitleParagraph>}
      />

      <BoardRow
        title={<b>테스트 등록을 다시 하고 싶어요</b>}
        prefix={<BoardRow.Prefix>Q</BoardRow.Prefix>}
        icon={<BoardRow.ArrowIcon />}
        isOpened={isOpen}
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
      >
        <Post.H4 paddingBottom={16}>고객센터 문의 접수를 하면 테스트 등록을 도와드릴게요</Post.H4>
        <Post.Hr paddingBottom={16} />
        <Post.Paragraph paddingBottom={8} typography="t6">
          고객센터 문의 접수하는 법
        </Post.Paragraph>
        <Post.Ol paddingBottom={24} typography="t6">
          <Post.Li>
            상단 <b>[···]</b> 버튼 클릭
          </Post.Li>
          <Post.Li>
            <b>[고객센터]</b> 클릭
          </Post.Li>
          <Post.Li>문의 내역 작성</Post.Li>
        </Post.Ol>
        <Post.Paragraph paddingBottom={0} typography="t6">
          <span style={{ color: adaptive.grey500 }}>
            결제나 환불에 문제가 있어요 유형으로 문의를 하면 빠른 답변을 받을 수 있어요
          </span>
        </Post.Paragraph>
      </BoardRow>

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
        <QuestionTabContent questions={summaries} onSelectQuestion={setSelectedQuestionId} />
      )}

      {selectedTabIndex === 1 && (
        <Result
          title="등록되지 않은 테스트예요"
          description="테스트 등록 후 결과를 볼 수 있어요"
          className="my-10"
          figure={
            <Asset.Lottie
              frameShape={Asset.frameShape.CleanW60}
              src="https://static.toss.im/lotties-common/empty-spot.json"
              aria-hidden={true}
            />
          }
        />
      )}

      <QuestionPreviewOverlay
        selectedQuestionId={selectedQuestionId}
        previewQuestion={previewQuestion}
        onClose={() => setSelectedQuestionId(null)}
      />
    </div>
  );
}
