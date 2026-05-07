import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { CTAButton, FixedBottomCTA, ProgressBar } from "@toss/tds-mobile";
import { MOCK_PARTICIPATE_TEST, MOCK_PARTICIPATE_TESTS, useParticipateFunnel } from "../model";
import { ROUTES } from "@/shared/constants/routes";
import { QuestionRenderer } from "./QuestionRenderer";
import { AbSelectionBottomSheet } from "@/features/question-ab/answer";

interface Props {
  testId?: number;
}

export function ParticipatePage({ testId }: Props) {
  const navigate = useNavigate();
  const test = (testId != null ? MOCK_PARTICIPATE_TESTS[testId] : undefined) ?? MOCK_PARTICIPATE_TEST;

  const funnel = useParticipateFunnel(test.questions, () => {
    navigate({ to: ROUTES.DISCOVERY });
  });

  const {
    currentIndex,
    totalCount,
    currentQuestion,
    isFirst,
    isLast,
    canGoNext,
    goNext,
    goPrev,
  } = funnel;

  const [isAbSheetOpen, setIsAbSheetOpen] = useState(false);

  const progress = (currentIndex + 1) / totalCount;
  const isAbQuestion = currentQuestion.type === "ab";
  const isFivesecQuestion = currentQuestion.type === "fivesec";

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

      {isAbQuestion && currentQuestion.type === "ab" && (
        <AbSelectionBottomSheet
          data={currentQuestion.data}
          open={isAbSheetOpen}
          onClose={() => setIsAbSheetOpen(false)}
          onConfirm={(selected) => {
            setIsAbSheetOpen(false);
            funnel.goNextWithAnswer({ type: "ab", selected });
          }}
        />
      )}
    </div>
  );
}
