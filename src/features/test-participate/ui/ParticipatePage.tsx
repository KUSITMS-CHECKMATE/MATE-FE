import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { CTAButton, FixedBottomCTA, ProgressBar } from "@toss/tds-mobile";
import { useParticipateFunnel } from "../model";
import { ROUTES } from "@/shared/constants/routes";
import { QuestionRenderer } from "./QuestionRenderer";
import { AbSelectionBottomSheet } from "@/features/question-ab/answer";
import { useParticipateTestQuery } from "../api/useParticipateTestQuery";
import { useSubmitAnswersMutation } from "../api/useSubmitAnswersMutation";
import { mapAnswersToApiRequest } from "../api/mappers";
import type { ParticipateTest } from "../model/types";

interface Props {
  testId: number;
}

export function ParticipatePage({ testId }: Props) {
  const { data, isLoading, isError, error } = useParticipateTestQuery(testId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-dvh text-gray-500">
        로딩 중...
      </div>
    );
  }

  if (isError || !data) {
    const msg = isError && error instanceof Error ? error.message : "알 수 없는 오류";
    return (
      <div className="flex flex-col min-h-dvh p-4 gap-2">
        <div className="text-red-500 font-bold">테스트를 불러올 수 없습니다.</div>
        <pre className="text-xs bg-gray-100 rounded p-2 overflow-auto whitespace-pre-wrap break-all">
          {msg}
        </pre>
      </div>
    );
  }

  return <ParticipateFunnelContent test={data.test} testId={testId} />;
}

interface FunnelProps {
  test: ParticipateTest;
  testId: number;
}

function ParticipateFunnelContent({ test, testId }: FunnelProps) {
  const navigate = useNavigate();
  const { mutate: submitAnswers } = useSubmitAnswersMutation();
  const [isAbSheetOpen, setIsAbSheetOpen] = useState(false);

  const funnel = useParticipateFunnel(test.questions, (answers) => {
    const body = mapAnswersToApiRequest(test.questions, answers);
    submitAnswers(
      { testId, body },
      { onSuccess: () => navigate({ to: ROUTES.DISCOVERY }) },
    );
  });

  const { currentIndex, totalCount, currentQuestion, isFirst, isLast, canGoNext, goNext, goPrev } =
    funnel;

  const progress = (currentIndex + 1) / totalCount;
  const isAbQuestion = currentQuestion.type === "AB_TEST";
  const isFivesecQuestion = currentQuestion.type === "FIVE_SECOND";

  return (
    <div className="flex flex-col min-h-dvh">
      <ProgressBar progress={progress} size="normal" />

      <main className="flex flex-col flex-1">
        <QuestionRenderer
          question={currentQuestion}
          answer={funnel.currentAnswer}
          onChange={funnel.setAnswer}
          onPrev={goPrev}
          onGoNext={goNext}
          isFirst={isFirst}
          isLast={isLast}
        />
      </main>

      {isFivesecQuestion ? null : isAbQuestion ? (
        isFirst ? (
          <FixedBottomCTA
            topAccessory="두 가지 안을 확인하고 선택하기를 눌러요"
            onClick={() => setIsAbSheetOpen(true)}
          >
            선택하기
          </FixedBottomCTA>
        ) : (
          <FixedBottomCTA.Double
            topAccessory="두 가지 안을 확인하고 선택하기를 눌러요"
            leftButton={
              <CTAButton color="dark" variant="weak" onClick={goPrev}>
                이전
              </CTAButton>
            }
            rightButton={
              <CTAButton onClick={() => setIsAbSheetOpen(true)}>
                {isLast ? "완료하기" : "선택하기"}
              </CTAButton>
            }
          />
        )
      ) : isFirst ? (
        <FixedBottomCTA disabled={!canGoNext} onClick={goNext}>
          다음
        </FixedBottomCTA>
      ) : (
        <FixedBottomCTA.Double
          leftButton={
            <CTAButton color="dark" variant="weak" onClick={goPrev}>
              이전
            </CTAButton>
          }
          rightButton={
            <CTAButton disabled={!canGoNext} onClick={goNext}>
              {isLast ? "완료하기" : "다음"}
            </CTAButton>
          }
        />
      )}

      {isAbQuestion && (
        <AbSelectionBottomSheet
          data={currentQuestion.data}
          open={isAbSheetOpen}
          onClose={() => setIsAbSheetOpen(false)}
          onConfirm={(selected) => {
            setIsAbSheetOpen(false);
            funnel.goNextWithAnswer({ type: "AB_TEST", selected });
          }}
          initialSelected={
            funnel.currentAnswer?.type === "AB_TEST" ? funnel.currentAnswer.selected : null
          }
        />
      )}
    </div>
  );
}
