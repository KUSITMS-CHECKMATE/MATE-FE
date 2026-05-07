import { useState } from "react";
import { Badge, Top } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import type { QuestionAnswerProps } from "@/features/test-participate/model/types";
import { QUESTION_TYPE_LABEL } from "@/features/test-participate/model/constants";

export function AbAnswerPage({
  question,
  answer,
}: QuestionAnswerProps<"ab">) {
  const { data } = question;
  const selected = answer?.selected ?? null;
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex flex-col">
      <Top
        title={
          <Top.TitleParagraph size={22} color={adaptive.grey900}>
            {data.title}
          </Top.TitleParagraph>
        }
        subtitleTop={
          <Top.SubtitleBadges
            badges={[{ text: QUESTION_TYPE_LABEL.ab, color: "elephant", variant: "weak" }]}
          />
        }
        subtitleBottom={
          data.description ? (
            <Top.SubtitleParagraph size={15}>{data.description}</Top.SubtitleParagraph>
          ) : undefined
        }
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
            <div
              key={option}
              className={`relative overflow-hidden ${isExpanded ? "w-full" : "flex-1"}`}
              style={{
                aspectRatio: "9/16",
                borderRadius: 16,
                boxShadow: isSelected
                  ? `inset 0 0 0 2px #4265cc`
                  : `inset 0 0 0 1px ${adaptive.greyOpacity100}`,
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
                  style={{ background: adaptive.greyOpacity50 }}
                />
              )}
              <div className="absolute top-3 left-3">
                <Badge size="small" color="red" variant="fill">
                  {option}안
                </Badge>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
