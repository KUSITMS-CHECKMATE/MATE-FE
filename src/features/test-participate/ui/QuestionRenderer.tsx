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
    case "SCALE":
      return (
        <ScaleAnswerPage
          question={question}
          answer={answer?.type === "SCALE" ? answer : undefined}
          onChange={onChange}
        />
      );
    case "AB_TEST":
      return (
        <AbAnswerPage
          question={question}
          answer={answer?.type === "AB_TEST" ? answer : undefined}
          onChange={onChange}
        />
      );
    case "CARD_SORTING":
      return (
        <CardSortAnswerPage
          question={question}
          answer={answer?.type === "CARD_SORTING" ? answer : undefined}
          onChange={onChange}
        />
      );
    case "OBJECTIVE":
      return (
        <MultipleAnswerPage
          question={question}
          answer={answer?.type === "OBJECTIVE" ? answer : undefined}
          onChange={onChange}
        />
      );
    case "SUBJECTIVE":
      return (
        <SubjectiveAnswerPage
          question={question}
          answer={answer?.type === "SUBJECTIVE" ? answer : undefined}
          onChange={onChange}
        />
      );
    case "FIVE_SECOND":
      return (
        <FivesecAnswerPage
          key={question.id}
          question={question}
          answer={answer?.type === "FIVE_SECOND" ? answer : undefined}
          onChange={onChange}
          onPrev={onPrev ?? (() => {})}
          onGoNext={onGoNext ?? (() => {})}
          isFirst={isFirst ?? false}
          isLast={isLast ?? false}
        />
      );
    case "TREE_TEST":
      return (
        <TreeAnswerPage
          question={question}
          answer={answer?.type === "TREE_TEST" ? answer : undefined}
          onChange={onChange}
        />
      );
  }
}
