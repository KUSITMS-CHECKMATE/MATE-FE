import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { CTAButton, FixedBottomCTA, ProgressBar } from "@toss/tds-mobile";
import { useParticipateFunnel } from "../model";
import { ROUTES } from "@/shared/constants/routes";
import { QuestionRenderer } from "./QuestionRenderer";
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

  return <ParticipateFunnelContent test={data.test} testId={testId} raw={data.raw} />;
}

interface FunnelProps {
  test: ParticipateTest;
  testId: number;
  raw: unknown;
}

function ParticipateFunnelContent({ test, testId, raw }: FunnelProps) {
  const navigate = useNavigate();
  const { mutate: submitAnswers, isPending, isSuccess, isError: isMutationError, error: mutationError } = useSubmitAnswersMutation();
  const [showRaw, setShowRaw] = useState(false);
  const [debugBody, setDebugBody] = useState<string | null>(null);
  const [apiErrorBody, setApiErrorBody] = useState<string | null>(null);

  const funnel = useParticipateFunnel(test.questions, (answers) => {
    const body = mapAnswersToApiRequest(test.questions, answers);
    setDebugBody(JSON.stringify(body, null, 2));
    setApiErrorBody(null);
    submitAnswers(
      { testId, body },
      {
        onSuccess: () => navigate({ to: ROUTES.DISCOVERY }),
        onError: async (error) => {
          const httpError = error as { response?: Response };
          if (httpError.response) {
            try {
              const errBody = await httpError.response.clone().json();
              setApiErrorBody(JSON.stringify(errBody, null, 2));
            } catch {
              setApiErrorBody(error instanceof Error ? error.message : String(error));
            }
          }
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

      {isFivesecQuestion ? null : isFirst ? (
        <FixedBottomCTA disabled={!canGoNext} onClick={goNext}>
          {"다음"}
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

      <div
        className="fixed top-8 left-2 right-2 z-50 bg-black/80 text-white text-xs p-2 rounded cursor-pointer"
        onClick={() => setShowRaw(true)}
      >
        <div>idx: {currentIndex}/{totalCount - 1} | isLast: {String(isLast)} | canGoNext: {String(canGoNext)} | {isPending ? "pending..." : isSuccess ? "✅ success" : isMutationError ? `❌ ${mutationError instanceof Error ? mutationError.message : "error"}` : "idle"}</div>
        {apiErrorBody && <div className="text-red-400 mt-1">❌ API 에러 응답 — 탭하면 상세 보기</div>}
        {!apiErrorBody && debugBody && <div className="text-yellow-300 mt-1">탭하면 요청 바디 전체 보기</div>}
      </div>
      {showRaw && (
        <div className="fixed inset-0 z-40 bg-black/90 overflow-auto p-4 pt-10" onClick={() => setShowRaw(false)}>
          <pre className="text-xs text-green-300 whitespace-pre-wrap break-all">
            {apiErrorBody ? `=== API 에러 응답 ===\n${apiErrorBody}\n\n=== 요청 바디 ===\n${debugBody}` : (debugBody ?? JSON.stringify(raw, null, 2))}
          </pre>
        </div>
      )}
    </div>
  );
}
