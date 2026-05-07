import { useEffect, useRef, useState } from "react";
import type { QuestionAnswerProps } from "@/features/test-participate/model/types";
import { FivesecReadyPhase } from "./FivesecReadyPhase";
import { FivesecPreviewPhase } from "./FivesecPreviewPhase";
import { FivesecCountdownPhase } from "./FivesecCountdownPhase";
import { FivesecSubjectiveAnswerPhase } from "./FivesecSubjectiveAnswerPhase";
import { FivesecMultipleAnswerPhase } from "./FivesecMultipleAnswerPhase";

type Phase = "ready" | "preview" | "countdown" | "answer";

interface Props extends QuestionAnswerProps<"fivesec"> {
  onPrev: () => void;
  onGoNext: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export function FivesecAnswerView({ question, answer, onChange, onPrev, onGoNext, isFirst, isLast }: Props) {
  const { duration, isMultiSelectEnabled, minSelectCount, maxSelectCount, choices } = question.data;

  const [phase, setPhase] = useState<Phase>("ready");
  const [remaining, setRemaining] = useState(duration);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const selectedIds = answer?.selectedIds ?? [];
  const isSubjective = question.data.answerType === "subjective";
  const canGoNext = isSubjective
    ? (answer?.text ?? "").trim().length > 0
    : selectedIds.length >= minSelectCount;

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  function startCountdown() {
    setPhase("countdown");
    setRemaining(duration);
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setPhase("answer");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function handleSelect(id: string) {
    if (isMultiSelectEnabled) {
      const next = selectedIds.includes(id)
        ? selectedIds.filter((s) => s !== id)
        : selectedIds.length < maxSelectCount
          ? [...selectedIds, id]
          : selectedIds;
      onChange({ type: "fivesec", selectedIds: next });
    } else {
      const next = selectedIds.includes(id) ? [] : [id];
      onChange({ type: "fivesec", selectedIds: next });
    }
  }

  if (phase === "ready") {
    return (
      <FivesecReadyPhase
        isFirst={isFirst}
        onPrev={onPrev}
        onStart={() => setPhase("preview")}
      />
    );
  }

  if (phase === "preview") {
    return <FivesecPreviewPhase onStart={startCountdown} />;
  }

  if (phase === "countdown") {
    return <FivesecCountdownPhase remaining={remaining} />;
  }

  if (isSubjective) {
    return (
      <FivesecSubjectiveAnswerPhase
        title={question.data.title}
        description={question.data.description}
        placeholder={question.data.placeholder ?? "답변을 작성해주세요"}
        text={answer?.text ?? ""}
        canGoNext={canGoNext}
        isFirst={isFirst}
        isLast={isLast}
        onChange={(text) => onChange({ type: "fivesec", selectedIds: [], text })}
        onPrev={onPrev}
        onGoNext={onGoNext}
      />
    );
  }

  return (
    <FivesecMultipleAnswerPhase
      title={question.data.title}
      description={question.data.description}
      choices={choices}
      selectedIds={selectedIds}
      isMultiSelectEnabled={isMultiSelectEnabled}
      canGoNext={canGoNext}
      isFirst={isFirst}
      isLast={isLast}
      onSelect={handleSelect}
      onPrev={onPrev}
      onGoNext={onGoNext}
    />
  );
}
