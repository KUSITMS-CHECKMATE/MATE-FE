import { useRef } from "react";
import { adaptive } from "@toss/tds-colors";
import { Checkbox, ListRow, TextField } from "@toss/tds-mobile";
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
  const otherFieldRef = useRef<HTMLDivElement>(null);

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

  function handleOtherRowClick() {
    otherFieldRef.current?.querySelector("input")?.focus();
  }

  function handleOtherFocus() {
    if (!otherChoice || selectedIds.includes(otherChoice.id)) return;
    if (isMultiSelectEnabled) {
      const next =
        selectedIds.length < maxSelectCount
          ? [...selectedIds, otherChoice.id]
          : selectedIds;
      onChange({ type: "OBJECTIVE", selectedIds: next, otherText });
    } else {
      onChange({ type: "OBJECTIVE", selectedIds: [otherChoice.id], otherText });
    }
  }

  function handleOtherTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!otherChoice) return;
    const next = selectedIds.includes(otherChoice.id)
      ? selectedIds
      : isMultiSelectEnabled
        ? [...selectedIds, otherChoice.id]
        : [otherChoice.id];
    onChange({ type: "OBJECTIVE", selectedIds: next, otherText: e.target.value });
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
        <>
          <div className="bg-white" onClick={handleOtherRowClick}>
            <ListRow
              role="checkbox"
              aria-checked={selectedIds.includes(otherChoice!.id)}
              contents={
                <ListRow.Texts
                  type="1RowTypeA"
                  top="기타"
                  topProps={{ color: adaptive.grey700 }}
                />
              }
              right={
                isMultiSelectEnabled ? (
                  <Checkbox.Line size={24} checked={selectedIds.includes(otherChoice!.id)} />
                ) : (
                  <Checkbox.Circle size={24} checked={selectedIds.includes(otherChoice!.id)} />
                )
              }
              verticalPadding="small"
            />
          </div>
          <div ref={otherFieldRef} className="pb-4">
            <TextField.Clearable
              variant="line"
              hasError={false}
              label=""
              labelOption="sustain"
              value={otherText}
              placeholder=""
              suffix=""
              prefix=":"
              onFocus={handleOtherFocus}
              onChange={handleOtherTextChange}
            />
          </div>
        </>
      )}
    </div>
  );
}
