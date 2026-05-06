import type { Answer, ParticipateQuestion } from "../model/types";
import { TreeAnswerPage } from "@/features/question-tree/answer";
import { EmptyAnswerView } from "./EmptyAnswerView";

interface Props {
  question: ParticipateQuestion;
  answer: Answer | undefined;
  onChange: (answer: Answer) => void;
}

export function QuestionRenderer({ question, answer, onChange }: Props) {
  switch (question.type) {
    case "tree":
      return (
        <TreeAnswerPage
          question={question}
          answer={answer?.type === "tree" ? answer : undefined}
          onChange={onChange}
        />
      );
    case "subjective":
    case "multiple":
    case "fivesec":
    case "scale":
    case "ab":
    case "cardsort":
      return <EmptyAnswerView question={question} />;
  }
}
