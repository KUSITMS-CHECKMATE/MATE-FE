import type { Answer, AnswerOf, ParticipateQuestion } from "../model/types";
import { ScaleAnswerPage } from "@/features/question-scale/answer";
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
    case "subjective":
    case "multiple":
    case "tree":
    case "fivesec":
    case "ab":
    case "cardsort":
      return <EmptyAnswerView question={question} />;
  }
}
