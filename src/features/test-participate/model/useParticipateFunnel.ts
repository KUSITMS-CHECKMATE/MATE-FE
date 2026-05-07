import { useCallback, useState } from "react";
import type { Answer, ParticipateQuestion } from "./types";
import { isAnswerValid } from "./validation";

export interface UseParticipateFunnelResult {
  currentIndex: number;
  totalCount: number;
  currentQuestion: ParticipateQuestion;
  currentAnswer: Answer | undefined;
  isFirst: boolean;
  isLast: boolean;
  canGoNext: boolean;
  setAnswer: (answer: Answer) => void;
  goNext: () => void;
  goPrev: () => void;
}

export function useParticipateFunnel(
  questions: ParticipateQuestion[],
  onComplete: (answers: Record<string, Answer>) => void,
): UseParticipateFunnelResult {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});

  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers[currentQuestion.id];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === questions.length - 1;
  const canGoNext = isAnswerValid(currentQuestion, currentAnswer);

  const setAnswer = useCallback(
    (answer: Answer) => {
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answer }));
    },
    [currentQuestion.id],
  );

  const goNext = useCallback(() => {
    if (!canGoNext) return;
    if (isLast) {
      onComplete(answers);
      return;
    }
    setCurrentIndex((i) => i + 1);
  }, [canGoNext, isLast, onComplete, answers]);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => Math.max(0, i - 1));
  }, []);

  return {
    currentIndex,
    totalCount: questions.length,
    currentQuestion,
    currentAnswer,
    isFirst,
    isLast,
    canGoNext,
    setAnswer,
    goNext,
    goPrev,
  };
}
