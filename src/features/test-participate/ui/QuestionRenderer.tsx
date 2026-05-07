import type { Answer, AnswerOf, ParticipateQuestion } from "../model/types";
import { ScaleAnswerPage } from "@/features/question-scale/answer";
import { AbAnswerPage } from "@/features/question-ab/answer";
import { CardSortAnswerPage } from "@/features/question-cardsort/answer";
import { EmptyAnswerView } from "./EmptyAnswerView";
import { MultipleAnswerView } from "@/features/question-multiple/answer/MultipleAnswerPage";
import { SubjectiveAnswerView } from "@/features/question-subjective/answer/SubjectiveAnswerPage";
import { FivesecAnswerView } from "@/features/question-fivesec/answer/FivesecAnswerPage";

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
          answer={answer as AnswerOf<"scale"> | undefined}
          onChange={onChange as (answer: AnswerOf<"scale">) => void}
        />
      );
    case "ab":
      return (
        <AbAnswerPage
          question={question}
          answer={answer as AnswerOf<"ab"> | undefined}
          onChange={onChange as (answer: AnswerOf<"ab">) => void}
        />
      );
    case "cardsort":
      return (
        <CardSortAnswerPage
          question={question}
          answer={answer as AnswerOf<"cardsort"> | undefined}
          onChange={onChange as (answer: AnswerOf<"cardsort">) => void}
        />
      );
    case "multiple":
      return (
        <MultipleAnswerView
          question={question}
          answer={answer?.type === "multiple" ? answer : undefined}
          onChange={onChange}
        />
      );
    case "subjective":
      return (
        <SubjectiveAnswerView
          question={question}
          answer={answer?.type === "subjective" ? answer : undefined}
          onChange={onChange}
        />
      );
    case "fivesec":
      return (
        <FivesecAnswerView
          key={question.id}
          question={question}
          answer={answer?.type === "fivesec" ? answer : undefined}
          onChange={onChange as (answer: AnswerOf<"fivesec">) => void}
          onPrev={onPrev ?? (() => {})}
          onGoNext={onGoNext ?? (() => {})}
          isFirst={isFirst ?? false}
          isLast={isLast ?? false}
        />
      );
    case "tree":
      return <EmptyAnswerView question={question} />;
  }
}
