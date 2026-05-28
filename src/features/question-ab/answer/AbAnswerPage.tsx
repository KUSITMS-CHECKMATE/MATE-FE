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
  const ratio = data.ratio ?? "9:16";
  const aspectRatio = ratio.replace(":", "/");
  const isPortrait = ratio === "9:16";
  const [isExpanded, setIsExpanded] = useState(false);

  const flexDirection = isPortrait && !isExpanded ? "flex-row" : "flex-col";
  const padding = isExpanded
    ? "px-6"
    : ratio === "1:1"
      ? "px-18"
      : ratio === "4:3"
        ? "px-11"
        : "px-4";

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

      <div className={`flex ${flexDirection} gap-3 ${padding} mt-3`}>
        {(["A", "B"] as const).map((option) => {
          const imageUrl = option === "A" ? data.imageUrlA : data.imageUrlB;
          const isSelected = selected === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange({ type: "AB_TEST", selected: option })}
              className={`relative overflow-hidden border-0 p-0 bg-transparent cursor-pointer ${isPortrait && !isExpanded ? "flex-1" : "w-full"}`}
              style={{ aspectRatio, borderRadius: 16 }}
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
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  borderRadius: 16,
                  boxShadow: isSelected
                    ? "inset 0 0 0 2px #4265CD"
                    : "inset 0 0 0 1px var(--token-tds-color-grey-opacity-100, var(--adaptiveGreyOpacity100, rgba(2,32,71,0.05)))",
                }}
              />
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
