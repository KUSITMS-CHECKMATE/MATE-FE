import { useNavigate } from "@tanstack/react-router";
import { CTAButton, FixedBottomCTA, ProgressBar } from "@toss/tds-mobile";
import { MOCK_PARTICIPATE_TEST, MOCK_PARTICIPATE_TESTS, useParticipateFunnel } from "../model";
import { ROUTES } from "@/shared/constants/routes";
import { QuestionRenderer } from "./QuestionRenderer";

interface Props {
  testId?: number;
}

export function ParticipatePage({ testId }: Props) {
  const navigate = useNavigate();
  const test = (testId != null ? MOCK_PARTICIPATE_TESTS[testId] : undefined) ?? MOCK_PARTICIPATE_TEST;

  const funnel = useParticipateFunnel(test.questions, () => {
    navigate({ to: ROUTES.DISCOVERY });
  });

  const { currentIndex, totalCount, currentQuestion, isFirst, isLast, canGoNext, goNext, goPrev } = funnel;

  const progress = (currentIndex + 1) / totalCount;

  return (
    <div className="flex flex-col min-h-dvh">
      <ProgressBar progress={progress} size="normal" />

      <main className="flex flex-col flex-1">
        <QuestionRenderer
          question={currentQuestion}
          answer={funnel.currentAnswer}
          onChange={funnel.setAnswer}
        />
      </main>

      {isFirst ? (
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
    </div>
  );
}
