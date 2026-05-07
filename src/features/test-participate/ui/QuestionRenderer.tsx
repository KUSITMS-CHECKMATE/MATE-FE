import type { Answer, ParticipateQuestion } from "../model/types";
import { EmptyAnswerView } from "./EmptyAnswerView";
import { MultipleAnswerView } from "@/features/question-multiple/answer/MultipleAnswerView";
import { SubjectiveAnswerView } from "@/features/question-subjective/answer/SubjectiveAnswerView";
import { FivesecAnswerView } from "@/features/question-fivesec/answer/FivesecAnswerView";

interface Props {
  question: ParticipateQuestion;
  answer: Answer | undefined;
  onChange: (answer: Answer) => void;
  onPrev?: () => void;
  onGoNext?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

export function QuestionRenderer({ question, answer, onChange, onPrev, onGoNext, isFirst, isLast }: Props) {
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
    case "fivesec":
      return (
        <FivesecAnswerView
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
    case "scale":
    case "ab":
    case "cardsort":
      return <EmptyAnswerView question={question} />;
  }
}
