import { useState, useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Asset, CTAButton, ConfirmDialog, FixedBottomCTA, ProgressBar, Spacing, Text } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { graniteEvent } from "@apps-in-toss/web-framework";
import { useParticipateFunnel } from "../model";
import { ROUTES } from "@/shared/constants/routes";
import { QuestionRenderer } from "./QuestionRenderer";
import { useParticipateTestQuery } from "../api/useParticipateTestQuery";
import { useSubmitAnswersMutation } from "../api/useSubmitAnswersMutation";
import { MY_ANSWERS_QUERY_KEY, useMyAnswersQuery } from "../api/useMyAnswersQuery";
import { useRequestNotificationAgreement } from "@/features/notification-agreement/model";
import { mapAnswersToApiRequest } from "../api/mappers";
import { getListTestsUrl } from "@/shared/api/generated/test";
import { trackEvent } from "@/shared/lib/analytics";
import type { ParticipateTest } from "../model/types";

interface Props {
  testId: number;
  reward?: number;
}

export function ParticipatePage({ testId, reward }: Props) {
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

  return <ParticipateFunnelContent test={data.test} testId={testId} reward={reward} />;
}

interface FunnelProps {
  test: ParticipateTest;
  testId: number;
  reward?: number;
}

function ParticipateFunnelContent({ test, testId, reward }: FunnelProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate: submitAnswers, isPending: isSubmitting } = useSubmitAnswersMutation();
  const [submitted, setSubmitted] = useState(false);
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const exitUnsubscribeRef = useRef<(() => void) | null>(null);
  const startTimeRef = useRef(Date.now());
  const requestNotificationAgreement = useRequestNotificationAgreement();
  // 풀이 중에 미리 불러둔 내 응답 수로 "가입 후 첫 완료"를 판별한다(로드 실패/미완료면 요청 생략).
  const { data: myAnswers } = useMyAnswersQuery();
  const isFirstCompletionRef = useRef(false);
  useEffect(() => {
    isFirstCompletionRef.current = myAnswers?.length === 0;
  }, [myAnswers]);

  useEffect(() => {
    trackEvent("test_start", { test_id: String(testId) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (submitted) return;
    try {
      const unsubscribe = graniteEvent.addEventListener("backEvent", {
        onEvent: () => {
          setIsExitDialogOpen(true);
        },
        onError: (error) => {
          console.error("backEvent error", error);
        },
      });
      exitUnsubscribeRef.current = unsubscribe;
      return () => {
        unsubscribe();
        exitUnsubscribeRef.current = null;
      };
    } catch {
      console.warn("backEvent listener not supported in browser");
      return () => {};
    }
  }, [submitted]);

  const funnel = useParticipateFunnel(test.questions, (answers) => {
    const body = mapAnswersToApiRequest(test.questions, answers);
    submitAnswers(
      { testId, body },
      {
        onSuccess: () => {
          trackEvent("test_complete", {
            test_id: String(testId),
            duration: Math.round((Date.now() - startTimeRef.current) / 1000),
          });
          queryClient.invalidateQueries({ queryKey: [getListTestsUrl()] });
          queryClient.invalidateQueries({ queryKey: MY_ANSWERS_QUERY_KEY });
          setSubmitted(true);
          if (isFirstCompletionRef.current) requestNotificationAgreement();
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
          {reward != null ? `적립 예정 보상 ${reward.toLocaleString()}원` : "적립 예정 보상이 지급돼요."}{"\n"}보상은 24시간 이내 지급돼요.
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
          {"다음으로"}
        </FixedBottomCTA>
      ) : isFirst && isLast ? (
        <FixedBottomCTA disabled={!canGoNext || isSubmitting} onClick={goNext}>
          {isSubmitting ? "제출 중" : "완료하기"}
        </FixedBottomCTA>
      ) : (
        <FixedBottomCTA.Double
          leftButton={
            <CTAButton color="dark" variant="weak" onClick={goPrev} disabled={isSubmitting}>
              이전
            </CTAButton>
          }
          rightButton={
            <CTAButton disabled={!canGoNext || isSubmitting} onClick={goNext}>
              {isLast ? (isSubmitting ? "제출 중" : "완료하기") : "다음으로"}
            </CTAButton>
          }
        />
      )}

      <ConfirmDialog
        open={isExitDialogOpen}
        title="테스트를 그만둘까요?"
        description="지금 나가면 리워드를 못 받아요"
        cancelButton={
          <ConfirmDialog.CancelButton size="xlarge" onClick={() => setIsExitDialogOpen(false)}>
            닫기
          </ConfirmDialog.CancelButton>
        }
        confirmButton={
          <ConfirmDialog.ConfirmButton
            color="danger"
            size="xlarge"
            onClick={() => {
              trackEvent("test_exit", {
                test_id: String(testId),
                exit_step: currentQuestion.id,
                progress_rate: Math.round(progress * 100),
                duration: Math.round((Date.now() - startTimeRef.current) / 1000),
              });
              navigate({ to: ROUTES.DISCOVERY });
            }}
          >
            나가기
          </ConfirmDialog.ConfirmButton>
        }
        onClose={() => setIsExitDialogOpen(false)}
        closeOnBackEvent={false}
      />
    </div>
  );
}
