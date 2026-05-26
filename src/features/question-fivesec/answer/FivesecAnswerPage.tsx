import { useEffect, useRef, useState } from "react";
import type { QuestionAnswerProps } from "@/features/test-participate/model/types";
import { FivesecReadyPhase } from "./FivesecReadyPhase";
import { FivesecPreviewPhase } from "./FivesecPreviewPhase";
import { FivesecCountdownPhase } from "./FivesecCountdownPhase";
import { FivesecSubjectiveAnswerPhase } from "./FivesecSubjectiveAnswerPhase";
import { FivesecMultipleAnswerPhase } from "./FivesecMultipleAnswerPhase";

type Phase = "ready" | "preview" | "countdown" | "answer";

interface Props extends QuestionAnswerProps<"FIVE_SECOND"> {
  onPrev: () => void;
  onGoNext: () => void;
  isFirst: boolean;
  isLast: boolean;
  prevLabel?: string;
  isPreview?: boolean;
}

export function FivesecAnswerPage({ question, answer, onChange, onPrev, onGoNext, isFirst, isLast, prevLabel, isPreview }: Props) {
  const { duration, isMultiSelectEnabled, minSelectCount, maxSelectCount, choices, imageUrl, ratio } = question.data;

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
    if (intervalRef.current) clearInterval(intervalRef.current);
    setPhase("countdown");
    setRemaining(duration);
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
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
      onChange({ type: "FIVE_SECOND", selectedIds: next });
    } else {
      const next = selectedIds.includes(id) ? [] : [id];
      onChange({ type: "FIVE_SECOND", selectedIds: next });
    }
  }

  if (phase === "ready") {
    return (
      <FivesecReadyPhase
        isFirst={isFirst}
        prevLabel={prevLabel}
        onPrev={onPrev}
        onStart={() => setPhase("preview")}
      />
    );
  }

  if (phase === "preview") {
    return <FivesecPreviewPhase ratio={ratio ?? "9:16"} onStart={startCountdown} />;
  }

  if (phase === "countdown") {
    return <FivesecCountdownPhase remaining={remaining} imageUrl={imageUrl} ratio={ratio ?? "9:16"} hideCountdown={isPreview} />;
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
        prevLabel={prevLabel}
        onlyPrev={isPreview}
        onChange={(text) => onChange({ type: "FIVE_SECOND", selectedIds: [], text })}
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
      prevLabel={prevLabel}
      onSelect={handleSelect}
      onPrev={onPrev}
      onGoNext={onGoNext}
    />
  );
}
