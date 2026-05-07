import type { Answer, AnswerOf, ParticipateQuestion } from "../model/types";
import { ScaleAnswerPage } from "@/features/question-scale/answer";
import { AbAnswerPage } from "@/features/question-ab/answer";
import { CardSortAnswerPage } from "@/features/question-cardsort/answer";
import { EmptyAnswerView } from "./EmptyAnswerView";

interface Props {
  question: ParticipateQuestion;
  answer: Answer | undefined;
  onChange: (answer: Answer) => void;
}

export function QuestionRenderer({ question, answer, onChange }: Props) {
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
    case "subjective":
    case "multiple":
    case "tree":
    case "fivesec":
      return <EmptyAnswerView question={question} />;
  }
}
