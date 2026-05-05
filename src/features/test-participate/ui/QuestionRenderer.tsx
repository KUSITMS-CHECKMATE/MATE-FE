import type { ParticipateQuestion } from "../model/types";
import { EmptyAnswerView } from "./EmptyAnswerView";

interface Props {
  question: ParticipateQuestion;
}

export function QuestionRenderer({ question }: Props) {
  switch (question.type) {
    case "subjective":
    case "multiple":
    case "tree":
    case "fivesec":
    case "scale":
    case "ab":
    case "cardsort":
      return <EmptyAnswerView question={question} />;
  }
}
