import { Asset, List, ListRow, Top } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import type { QuestionAnswerProps } from "@/features/test-participate/model/types";
import { QUESTION_TYPE_LABEL } from "@/features/test-participate/model/constants";

export function ScaleAnswerPage({
  question,
  answer,
  onChange,
}: QuestionAnswerProps<"scale">) {
  const { data } = question;
  const selectedValue = answer?.value ?? null;

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
            badges={[{ text: QUESTION_TYPE_LABEL.scale, color: "elephant", variant: "weak" }]}
          />
        }
        subtitleBottom={
          data.description ? (
            <Top.SubtitleParagraph size={15}>{data.description}</Top.SubtitleParagraph>
          ) : undefined
        }
      />

      {data.imageUrl && (
        <div className="px-4">
          <img
            src={data.imageUrl}
            alt=""
            className="w-full object-cover rounded-[16px]"
            style={{
              aspectRatio: "16/9",
              border: `1px solid ${adaptive.greyOpacity100}`,
            }}
          />
        </div>
      )}

      <div className={`flex flex-row px-4 ${data.imageUrl ? "mt-8" : "mt-3"} ${data.scaleCount === 7 ? "justify-between" : "justify-center gap-3"}`}>
        {Array.from({ length: data.scaleCount }, (_, i) => i + 1).map((value) => {
          const isSelected = selectedValue === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => onChange({ type: "scale", value })}
              className="flex items-center justify-center bg-transparent border-0 p-0 cursor-pointer"
            >
              <Asset.Text
                frameShape={Asset.frameShape.CircleLarge}
                backgroundColor={isSelected ? "#4265cc" : adaptive.greyOpacity100}
                style={{
                  color: isSelected ? "#ffffff" : adaptive.grey600,
                  fontSize: "15px",
                  fontWeight: "bold",
                }}
                aria-label={`${value}점`}
              >
                {String(value)}
              </Asset.Text>
            </button>
          );
        })}
      </div>

      {(data.minLabel || data.maxLabel) && (
        <div className="mt-3">
          <List>
            {data.minLabel && (
              <ListRow
                contents={
                  <ListRow.Texts
                    type="1RowTypeA"
                    top={`1점: ${data.minLabel}`}
                    topProps={{ color: adaptive.grey600 }}
                  />
                }
                verticalPadding="small"
              />
            )}
            {data.maxLabel && (
              <ListRow
                contents={
                  <ListRow.Texts
                    type="1RowTypeA"
                    top={`${data.scaleCount}점: ${data.maxLabel}`}
                    topProps={{ color: adaptive.grey600 }}
                  />
                }
                verticalPadding="small"
              />
            )}
          </List>
        </div>
      )}
    </div>
  );
}
