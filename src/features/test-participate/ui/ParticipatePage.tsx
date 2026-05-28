import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { CTAButton, FixedBottomCTA, ProgressBar } from "@toss/tds-mobile";
import { useParticipateFunnel } from "../model";
import { ROUTES } from "@/shared/constants/routes";
import { QuestionRenderer } from "./QuestionRenderer";
import { useParticipateTestQuery } from "../api/useParticipateTestQuery";
import { useSubmitAnswersMutation } from "../api/useSubmitAnswersMutation";
import { mapAnswersToApiRequest } from "../api/mappers";
import { getListTestsUrl } from "@/shared/api/generated/test";
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

  if (data.test.questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-dvh text-gray-500">
        질문이 없는 테스트입니다.
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
  const queryClient = useQueryClient();
  const { mutate: submitAnswers, isError: isSubmitError, error: submitError } = useSubmitAnswersMutation();
  const [debugInfo, setDebugInfo] = useState<{ req: string; res: string } | null>(null);

  const funnel = useParticipateFunnel(test.questions, async (answers) => {
    const body = mapAnswersToApiRequest(test.questions, answers);
    const req = JSON.stringify(body, null, 2);
    submitAnswers(
      { testId, body },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [getListTestsUrl()] });
          navigate({ to: ROUTES.DISCOVERY });
        },
        onError: async (err) => {
          const raw = (err as { response?: Response }).response;
          const res = raw ? await raw.clone().text().catch(() => "") : "";
          setDebugInfo({ req, res });
        },
      },
    );
  });

  const { currentIndex, totalCount, currentQuestion, isFirst, isLast, canGoNext, goNext, goPrev } =
    funnel;

  const progress = (currentIndex + 1) / totalCount;
  const isFivesecQuestion = currentQuestion.type === "FIVE_SECOND";

  return (
    <div className="flex flex-col min-h-dvh">
      <ProgressBar progress={progress} size="normal" />
      {isSubmitError && (
        <div className="mx-4 mt-2 flex flex-col gap-1">
          <div className="text-xs text-red-500">
            제출 실패: {submitError instanceof Error ? submitError.message : "알 수 없는 오류"}
          </div>
          {debugInfo && (
            <pre className="text-xs bg-gray-100 rounded p-2 overflow-auto whitespace-pre-wrap break-all">
              {"[요청]\n"}{debugInfo.req}{"\n\n[응답]\n"}{debugInfo.res}
            </pre>
          )}
        </div>
      )}

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

      {isFivesecQuestion ? null : isFirst && !isLast ? (
        <FixedBottomCTA disabled={!canGoNext} onClick={goNext}>
          {"다음"}
        </FixedBottomCTA>
      ) : isFirst && isLast ? (
        <FixedBottomCTA disabled={!canGoNext} onClick={goNext}>
          {"완료하기"}
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
    </div>
  );
}
