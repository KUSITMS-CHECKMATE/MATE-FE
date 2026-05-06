import type { Answer, ParticipateQuestion } from "../model/types";
import { EmptyAnswerView } from "./EmptyAnswerView";
import { MultipleAnswerView } from "@/features/question-multiple/answer/MultipleAnswerView";
import { SubjectiveAnswerView } from "@/features/question-subjective/answer/SubjectiveAnswerView";

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
      return (
        <SubjectiveAnswerView
          question={question}
          answer={answer?.type === "subjective" ? answer : undefined}
          onChange={onChange}
        />
      );
    case "tree":
    case "fivesec":
    case "scale":
    case "ab":
    case "cardsort":
      return <EmptyAnswerView question={question} />;
  }
}
