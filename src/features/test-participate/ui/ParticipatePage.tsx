import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Asset, CTAButton, FixedBottomCTA, ProgressBar, Spacing, Text } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
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
  const { mutate: submitAnswers } = useSubmitAnswersMutation();
  const [submitted, setSubmitted] = useState(false);

  const funnel = useParticipateFunnel(test.questions, (answers) => {
    const body = mapAnswersToApiRequest(test.questions, answers);
    submitAnswers(
      { testId, body },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [getListTestsUrl()] });
          setSubmitted(true);
        },
      },
    );
  });

  if (submitted) {
    return (
      <div className="flex flex-col min-h-dvh items-center">
        <Spacing size={169} />
        <Asset.Image
          frameShape={{ width: 100 }}
          src="https://static.toss.im/3d-emojis/u1F44F-apng.png"
          aria-hidden={true}
        />
        <Spacing size={24} />
        <Text
          display="block"
          color={adaptive.grey800}
          typography="t2"
          fontWeight="bold"
          textAlign="center"
        >
          테스트를 제출했어요
        </Text>
        <Spacing size={8} />
        <Text
          display="block"
          color={adaptive.grey700}
          typography="t5"
          fontWeight="regular"
          textAlign="center"
        >
          적립 예정 보상 500원{"\n"}보상은 24시간 이내 지급돼요.
        </Text>
        <FixedBottomCTA onClick={() => navigate({ to: ROUTES.DISCOVERY })}>
          확인
        </FixedBottomCTA>
      </div>
    );
  }

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
