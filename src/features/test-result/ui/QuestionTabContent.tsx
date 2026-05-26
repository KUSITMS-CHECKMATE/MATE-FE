import { Asset, Text } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { MOCK_QUESTIONS } from "../model/mock";

interface Props {
  onSelectQuestion: (index: number) => void;
}

export function QuestionTabContent({ onSelectQuestion }: Props) {
  return (
    <div className="flex flex-col py-4">
      {MOCK_QUESTIONS.map((question, index) => (
        <div
          key={question.id}
          role="button"
          tabIndex={0}
          className="w-full bg-white py-3 px-5 flex flex-row gap-1 items-center active:bg-gray-50 cursor-pointer"
          onClick={() => onSelectQuestion(index)}
          onKeyDown={(e) => e.key === "Enter" && onSelectQuestion(index)}
        >
          <div className="w-full flex flex-row gap-3 items-center">
            <Asset.Text
              frameShape={Asset.frameShape.CircleMedium}
              backgroundColor={adaptive.greyOpacity100}
              style={{ color: "#4365cb", fontSize: "13px", fontWeight: "bold" }}
              aria-label=""
            >
              {String(index + 1).padStart(2, "0")}
            </Asset.Text>
            <div className="w-full flex flex-row gap-3 justify-between items-center">
              <div className="w-full flex flex-col">
                <Text display="block" color={adaptive.grey800} typography="t5" fontWeight="semibold">
                  {question.title}
                </Text>
                <Text display="block" color={adaptive.grey600} typography="t6" fontWeight="medium">
                  {question.type}
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
