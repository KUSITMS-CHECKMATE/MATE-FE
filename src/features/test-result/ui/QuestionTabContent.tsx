import { Asset, Text } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { QUESTION_TYPE_LABEL } from "../model/mappers";
import type { QuestionType } from "@/shared/api/report";

export interface QuestionSummaryItem {
  questionId: number;
  sequence: number;
  title: string;
  type: QuestionType;
}

interface Props {
  questions: QuestionSummaryItem[];
  onSelectQuestion: (questionId: number) => void;
  noPadding?: boolean;
}

export function QuestionTabContent({ questions, onSelectQuestion, noPadding = false }: Props) {
  return (
    <div className={`flex flex-col ${noPadding ? "" : "py-4"}`}>
      {questions.map((question) => (
        <div
          key={question.questionId}
          role="button"
          tabIndex={0}
          className="w-full bg-white py-3 px-5 flex flex-row gap-1 items-center active:bg-gray-50 cursor-pointer"
          onClick={() => onSelectQuestion(question.questionId)}
          onKeyDown={(e) => e.key === "Enter" && onSelectQuestion(question.questionId)}
        >
          <div className="w-full flex flex-row gap-3 items-center">
            <Asset.Text
              frameShape={Asset.frameShape.CircleMedium}
              backgroundColor={adaptive.greyOpacity100}
              style={{ color: "#4365cb", fontSize: "13px", fontWeight: "bold" }}
              aria-label=""
            >
              {String(question.sequence).padStart(2, "0")}
            </Asset.Text>
            <div className="w-full flex flex-row gap-3 justify-between items-center">
              <div className="w-full flex flex-col">
                <Text
                  display="block"
                  color={adaptive.grey800}
                  typography="t5"
                  fontWeight="semibold"
                >
                  {question.title}
                </Text>
                <Text display="block" color={adaptive.grey600} typography="t6" fontWeight="medium">
                  {QUESTION_TYPE_LABEL[question.type]}
                </Text>
              </div>
              <Asset.Icon
                frameShape={Asset.frameShape.CleanW24}
                backgroundColor="transparent"
                name="icon-system-arrow-right-outlined"
                aria-hidden={true}
                ratio="1/1"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
