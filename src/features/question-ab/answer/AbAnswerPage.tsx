import { useState } from "react";
import { Badge, Top } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { QuestionHeader } from "@/features/test-participate/ui/QuestionHeader";
import type { QuestionAnswerProps } from "@/features/test-participate/model/types";
import { QUESTION_TYPE_LABEL } from "@/features/test-participate/model/constants";

export function AbAnswerPage({
  question,
  answer,
  onChange,
}: QuestionAnswerProps<"AB_TEST">) {
  const { data } = question;
  const selected = answer?.selected ?? null;
  const aspectRatio = (data.ratio ?? "9:16").replace(":", "/");
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex flex-col">
      <QuestionHeader
        categoryLabel={QUESTION_TYPE_LABEL.AB_TEST}
        title={data.title}
        description={data.description}
        lower={
          <Top.LowerButton
            color="dark"
            size="small"
            variant="weak"
            display="inline"
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            {isExpanded ? "작게 보기" : "크게 보기"}
          </Top.LowerButton>
        }
      />

      <div className={`flex ${isExpanded ? "flex-col" : "flex-row"} gap-3 px-4 mt-3`}>
        {(["A", "B"] as const).map((option) => {
          const imageUrl = option === "A" ? data.imageUrlA : data.imageUrlB;
          const isSelected = selected === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange({ type: "AB_TEST", selected: option })}
              className={`relative overflow-hidden border-0 p-0 bg-transparent cursor-pointer ${isExpanded ? "w-full" : "flex-1"}`}
              style={{
                aspectRatio,
                borderRadius: 16,
                boxShadow: isSelected
                  ? "inset 0 0 0 2px #4265CD"
                  : "inset 0 0 0 1px var(--token-tds-color-grey-opacity-100, var(--adaptiveGreyOpacity100, rgba(2,32,71,0.05)))",
              }}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={`${option}안`}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ borderRadius: 16 }}
                />
              ) : (
                <div
                  className="absolute inset-0"
                  style={{ background: adaptive.greyOpacity50, borderRadius: 16 }}
                />
              )}
              <div className="absolute top-3 left-3">
                <Badge size="small" color={isSelected ? "blue" : "elephant"} variant="fill">
                  {option}안
                </Badge>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
