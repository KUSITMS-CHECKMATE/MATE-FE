import { adaptive } from "@toss/tds-colors";
import type { FiveSecAnswer } from "../model/types";
import { ResultCardBase, AnswerRow, TextAnswerScrollList } from "./_shared";

export type { FiveSecAnswer };

interface Props {
  title: string;
  imageUrl?: string;
  answers: FiveSecAnswer[];
}

export function FiveSecResultCard({ title, imageUrl, answers }: Props) {
  const isTextType = !imageUrl;

  return (
    <ResultCardBase badgeLabel="5초 테스트" title={title} imageUrl={imageUrl}>
      {isTextType ? (
        <TextAnswerScrollList texts={answers.map((a) => a.label)} />
      ) : (
        <div className="w-full flex flex-col gap-1 items-center">
          {answers.map((answer, i) => (
            <AnswerRow
              key={i}
              iconColor={answer.isHighlight ? "#5571cf" : i === 1 ? adaptive.greyOpacity400 : adaptive.greyOpacity200}
              labelColor={answer.isHighlight ? "#4365cc" : adaptive.grey700}
              label={answer.label}
              count={`${answer.count}개 (${answer.percentage}%)`}
            />
          ))}
        </div>
      )}
    </ResultCardBase>
  );
}
