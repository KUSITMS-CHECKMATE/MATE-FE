import { Checkbox, List, ListRow } from "@toss/tds-mobile";
import { QuestionHeader } from "@/features/test-participate/ui/QuestionHeader";
import type { QuestionAnswerProps } from "@/features/test-participate/model/types";

type Props = QuestionAnswerProps<"multiple">;

export function MultipleAnswerPage({ question, answer, onChange }: Props) {
  const { title, description, choices, isMultiSelectEnabled, maxSelectCount } =
    question.data;

  const selectedIds = answer?.selectedIds ?? [];
  const categoryLabel = isMultiSelectEnabled ? "복수 선택" : "단일 선택";

  function handleSelect(id: string) {
    if (isMultiSelectEnabled) {
      const next = selectedIds.includes(id)
        ? selectedIds.filter((s) => s !== id)
        : selectedIds.length < maxSelectCount
          ? [...selectedIds, id]
          : selectedIds;
      onChange({ type: "multiple", selectedIds: next });
    } else {
      const next = selectedIds.includes(id) ? [] : [id];
      onChange({ type: "multiple", selectedIds: next });
    }
  }

  return (
    <div className="flex flex-col">
      <QuestionHeader
        categoryLabel={categoryLabel}
        title={title}
        description={description}
      />
      <List>
        {choices.map((choice) => {
          const checked = selectedIds.includes(choice.id);
          return (
            <div key={choice.id} className="bg-white" onClick={() => handleSelect(choice.id)}>
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
                <div className="w-full h-47.5 px-5">
                  <div className="w-full h-full rounded-2xl bg-gray-100 shadow-[inset_0_0_0_1px_rgba(2,32,71,0.05)]" />
                </div>
              )}
            </div>
          );
        })}
      </List>
    </div>
  );
}
