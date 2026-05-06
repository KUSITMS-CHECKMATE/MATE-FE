import type { Answer, ParticipateQuestion } from "../model/types";
import { EmptyAnswerView } from "./EmptyAnswerView";
import { MultipleAnswerView } from "@/features/question-multiple/answer/MultipleAnswerView";

interface Props {
  question: ParticipateQuestion;
  answer: Answer | undefined;
  onChange: (answer: Answer) => void;
}

export function QuestionRenderer({ question, answer, onChange }: Props) {
  switch (question.type) {
    case "multiple":
      return (
        <MultipleAnswerView
          question={question}
          answer={answer?.type === "multiple" ? answer : undefined}
          onChange={onChange}
        />
      );
    case "subjective":
    case "tree":
    case "fivesec":
    case "scale":
    case "ab":
    case "cardsort":
      return <EmptyAnswerView question={question} />;
  }
}
