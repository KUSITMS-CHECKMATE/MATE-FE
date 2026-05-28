import { Checkbox, ListRow, TextArea } from "@toss/tds-mobile";
import { QuestionHeader } from "@/features/test-participate/ui/QuestionHeader";
import type { QuestionAnswerProps } from "@/features/test-participate/model/types";

type Props = QuestionAnswerProps<"OBJECTIVE">;

export function MultipleAnswerPage({ question, answer, onChange }: Props) {
  const { title, description, choices, isMultiSelectEnabled, maxSelectCount } =
    question.data;

  const selectedIds = answer?.selectedIds ?? [];
  const otherText = answer?.otherText ?? "";
  const categoryLabel = isMultiSelectEnabled ? "복수 선택" : "단일 선택";
  const otherChoice = choices.find((c) => c.name === "기타 (직접 입력)");
  const hasOtherChoice = !!otherChoice;

  function handleSelect(id: string) {
    if (isMultiSelectEnabled) {
      const next = selectedIds.includes(id)
        ? selectedIds.filter((s) => s !== id)
        : selectedIds.length < maxSelectCount
          ? [...selectedIds, id]
          : selectedIds;
      onChange({ type: "OBJECTIVE", selectedIds: next, otherText: "" });
    } else {
      const next = selectedIds.includes(id) ? [] : [id];
      onChange({ type: "OBJECTIVE", selectedIds: next, otherText: "" });
    }
  }

  console.log(
    "[MultipleAnswerPage] choices imageUrls:",
    choices.map((c) => ({ id: c.id, imageUrl: c.imageUrl })),
  );

  return (
    <div className="flex flex-col">
      <QuestionHeader
        categoryLabel={categoryLabel}
        title={title}
        description={description}
      />
      <div>
        {choices.filter((c) => c.name !== "기타 (직접 입력)").map((choice) => {
          const checked = selectedIds.includes(choice.id);
          return (
            <div
              key={choice.id}
              className="bg-white"
              onClick={() => handleSelect(choice.id)}
            >
              <ListRow
                role="checkbox"
                aria-checked={checked}
                contents={<ListRow.Texts type="1RowTypeA" top={choice.name} />}
                right={
                  isMultiSelectEnabled ? (
                    <Checkbox.Line size={24} checked={checked} />
                  ) : (
                    <Checkbox.Circle size={24} checked={checked} />
                  )
                }
                verticalPadding="large"
              />
              {choice.imageUrl && (
                <div className="w-full px-5 pb-2">
                  <img
                    src={choice.imageUrl}
                    alt={choice.name}
                    className="w-full rounded-2xl object-cover"
                    style={{ height: "190px" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {hasOtherChoice && (
        <div className="pt-2 pb-4">
          <TextArea
            variant="line"
            hasError={false}
            label="기타 답변"
            labelOption="sustain"
            value={otherText}
            placeholder="답변을 작성해 주세요"
            onChange={(e) =>
              onChange({ type: "OBJECTIVE", selectedIds: otherChoice ? [otherChoice.id] : [], otherText: e.target.value })
            }
          />
        </div>
      )}
    </div>
  );
}
