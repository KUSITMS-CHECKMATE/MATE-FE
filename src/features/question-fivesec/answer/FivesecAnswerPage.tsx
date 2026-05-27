import { useEffect, useRef, useState } from "react";
import type { QuestionAnswerProps } from "@/features/test-participate/model/types";
import { FivesecReadyPhase } from "./FivesecReadyPhase";
import { FivesecPreviewPhase } from "./FivesecPreviewPhase";
import { FivesecCountdownPhase } from "./FivesecCountdownPhase";
import { FivesecSubjectiveAnswerPhase } from "./FivesecSubjectiveAnswerPhase";
import { FivesecMultipleAnswerPhase } from "./FivesecMultipleAnswerPhase";

type Phase = "ready" | "preview" | "countdown" | "answer";
const FIVE_SECOND_DURATION = 5;

interface Props extends QuestionAnswerProps<"FIVE_SECOND"> {
  onPrev: () => void;
  onGoNext: () => void;
  isFirst: boolean;
  isLast: boolean;
  prevLabel?: string;
  isPreview?: boolean;
}

export function FivesecAnswerPage({ question, answer, onChange, onPrev, onGoNext, isFirst, isLast, prevLabel, isPreview }: Props) {
  const { isMultiSelectEnabled, minSelectCount, maxSelectCount, choices, imageUrl, ratio } = question.data;

  const [phase, setPhase] = useState<Phase>("ready");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedIds = answer?.selectedIds ?? [];
  const isSubjective = question.data.answerType === "subjective";
  const minRequired = minSelectCount > 0 ? minSelectCount : 1;
  const canGoNext = isSubjective
    ? (answer?.text ?? "").trim().length > 0
    : isMultiSelectEnabled
      ? selectedIds.length >= minRequired
      : selectedIds.length === 1;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function startCountdown() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setPhase("countdown");
    timeoutRef.current = setTimeout(() => {
      setPhase("answer");
    }, FIVE_SECOND_DURATION * 1000);
  }

  function handleSelect(id: string) {
    if (isMultiSelectEnabled) {
      const next = selectedIds.includes(id)
        ? selectedIds.filter((s) => s !== id)
        : selectedIds.length < maxSelectCount
          ? [...selectedIds, id]
          : selectedIds;
      onChange({ type: "FIVE_SECOND", selectedIds: next, text: answer?.text });
    } else {
      const next = selectedIds.includes(id) ? [] : [id];
      onChange({ type: "FIVE_SECOND", selectedIds: next, text: answer?.text });
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
    return <FivesecCountdownPhase imageUrl={imageUrl} ratio={ratio ?? "9:16"} />;
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
      otherText={answer?.text ?? ""}
      onSelect={handleSelect}
      onOtherTextChange={(text) => onChange({ type: "FIVE_SECOND", selectedIds, text })}
      onPrev={onPrev}
      onGoNext={onGoNext}
    />
  );
}
