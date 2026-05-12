import type { Answer, ParticipateQuestion } from "../model/types";
import { TreeAnswerPage } from "@/features/question-tree/answer";
import { ScaleAnswerPage } from "@/features/question-scale/answer";
import { AbAnswerPage } from "@/features/question-ab/answer";
import { CardSortAnswerPage } from "@/features/question-cardsort/answer";
import { MultipleAnswerPage } from "@/features/question-multiple/answer/MultipleAnswerPage";
import { SubjectiveAnswerPage } from "@/features/question-subjective/answer/SubjectiveAnswerPage";
import { FivesecAnswerPage } from "@/features/question-fivesec/answer/FivesecAnswerPage";

interface Props {
  question: ParticipateQuestion;
  answer: Answer | undefined;
  onChange: (answer: Answer) => void;
  onPrev?: () => void;
  onGoNext?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

export function QuestionRenderer({
  question,
  answer,
  onChange,
  onPrev,
  onGoNext,
  isFirst,
  isLast,
}: Props) {
  switch (question.type) {
    case "scale":
      return (
        <ScaleAnswerPage
          question={question}
          answer={answer?.type === "scale" ? answer : undefined}
          onChange={onChange}
        />
      );
    case "ab":
      return (
        <AbAnswerPage
          question={question}
          answer={answer?.type === "ab" ? answer : undefined}
          onChange={onChange}
        />
      );
    case "cardsort":
      return (
        <CardSortAnswerPage
          question={question}
          answer={answer?.type === "cardsort" ? answer : undefined}
          onChange={onChange}
        />
      );
    case "multiple":
      return (
        <MultipleAnswerPage
          question={question}
          answer={answer?.type === "multiple" ? answer : undefined}
          onChange={onChange}
        />
      );
    case "subjective":
      return (
        <SubjectiveAnswerPage
          question={question}
          answer={answer?.type === "subjective" ? answer : undefined}
          onChange={onChange}
        />
      );
    case "fivesec":
      return (
        <FivesecAnswerPage
          key={question.id}
          question={question}
          answer={answer?.type === "fivesec" ? answer : undefined}
          onChange={onChange}
          onPrev={onPrev ?? (() => {})}
          onGoNext={onGoNext ?? (() => {})}
          isFirst={isFirst ?? false}
          isLast={isLast ?? false}
        />
      );
    case "tree":
      return (
        <TreeAnswerPage
          question={question}
          answer={answer?.type === "tree" ? answer : undefined}
          onChange={onChange}
        />
      );
  }
}
