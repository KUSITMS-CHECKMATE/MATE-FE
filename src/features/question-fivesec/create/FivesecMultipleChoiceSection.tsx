import {
  DndContext,
  PointerSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Asset,
  Border,
  ListHeader,
  ListRow,
  NumericSpinner,
  Switch,
  Text,
} from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import type { MultipleChoiceItem } from "@/features/question-multiple/model/types";

export interface FivesecMultipleChoiceSectionProps {
  choices: MultipleChoiceItem[];
  isOtherInputEnabled: boolean;
  isMultiSelectEnabled: boolean;
  minSelectCount: number;
  maxSelectCount: number;
  onOpenChoiceCreate: () => void;
  onOpenChoiceEdit: (choiceId: string) => void;
  onDeleteChoice: (choiceId: string) => void;
  onReorderChoices: (choices: MultipleChoiceItem[]) => void;
  onToggleOtherInput: (checked: boolean) => void;
  onToggleMultiSelect: (checked: boolean) => void;
  onChangeMinSelectCount: (value: number) => void;
  onChangeMaxSelectCount: (value: number) => void;
}

interface ChoiceRowProps {
  choice: MultipleChoiceItem;
  onEditChoice: (choiceId: string) => void;
  onDeleteChoice: (choiceId: string) => void;
}

function ChoiceRow({ choice, onEditChoice, onDeleteChoice }: ChoiceRowProps) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: choice.id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
      {...attributes}
      onClick={() => onEditChoice(choice.id)}
    >
      <ListRow
        left={
          <div
            className="flex items-center cursor-grab"
            style={{ touchAction: "none", WebkitUserSelect: "none", userSelect: "none" }}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
          >
            <Asset.Icon
              frameShape={Asset.frameShape.CleanW20}
              backgroundColor="transparent"
              name="icon-dots-six-vertical-mono"
              color={adaptive.grey400}
              aria-hidden
              ratio="1/1"
            />
          </div>
        }
        contents={
          <ListRow.Texts
            type="1RowTypeA"
            top={choice.name}
            topProps={{ color: adaptive.grey800 }}
          />
        }
        right={
          <div
            className="flex items-center"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onDeleteChoice(choice.id);
            }}
          >
            <Asset.Icon
              frameShape={Asset.frameShape.CleanW20}
              backgroundColor="transparent"
              name="icon-bin-mono"
              color={adaptive.grey400}
              aria-hidden
            />
          </div>
        }
        verticalPadding="large"
      />
    </div>
  );
}

export function FivesecMultipleChoiceSection({
  choices,
  isOtherInputEnabled,
  isMultiSelectEnabled,
  minSelectCount,
  maxSelectCount,
  onOpenChoiceCreate,
  onOpenChoiceEdit,
  onDeleteChoice,
  onReorderChoices,
  onToggleOtherInput,
  onToggleMultiSelect,
  onChangeMinSelectCount,
  onChangeMaxSelectCount,
}: FivesecMultipleChoiceSectionProps) {
  const maxSelectableCount = choices.length;
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = choices.findIndex((c) => c.id === active.id);
    const newIndex = choices.findIndex((c) => c.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    onReorderChoices(arrayMove(choices, oldIndex, newIndex));
  };

  return (
    <>

      {choices.length < 10 ? (
        <ListRow
          left={
            <ListRow.AssetIcon
              shape="original"
              name="icon-plus-grey-fill"
              color={adaptive.grey400}
              variant="fill"
            />
          }
          contents={
            <ListRow.Texts
              type="1RowTypeA"
              top="추가하기"
              topProps={{ color: adaptive.grey700 }}
            />
          }
          verticalPadding="large"
          onClick={onOpenChoiceCreate}
        />
      ) : null}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={choices.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {choices.map((choice) => (
            <ChoiceRow
              key={choice.id}
              choice={choice}
              onEditChoice={onOpenChoiceEdit}
              onDeleteChoice={onDeleteChoice}
            />
          ))}
        </SortableContext>
      </DndContext>

      <ListRow
        className="shrink-0"
        role="switch"
        aria-checked={isOtherInputEnabled}
        contents={
          <ListRow.Texts
            type="1RowTypeB"
            top="기타 (직접 입력)"
            topProps={{ color: adaptive.grey800 }}
          />
        }
        right={
          <Switch
            checked={isOtherInputEnabled}
            onChange={(_, checked) => onToggleOtherInput(checked)}
          />
        }
        verticalPadding="large"
      />

      <Border />

      <ListRow
        className="shrink-0"
        role="switch"
        aria-checked={isMultiSelectEnabled}
        contents={
          <ListRow.Texts
            type="1RowTypeB"
            top="중복 선택 가능"
            topProps={{ color: adaptive.grey700 }}
          />
        }
        right={
          <Switch
            checked={isMultiSelectEnabled}
            onChange={(_, checked) => onToggleMultiSelect(checked)}
          />
        }
        verticalPadding="large"
      />

      {isMultiSelectEnabled ? (
        <>
          <div className="flex h-15.5 shrink-0 items-center justify-between bg-white px-7">
            <Text color={adaptive.grey700} typography="t5" fontWeight="semibold">
              최소 선택
            </Text>
            <NumericSpinner
              size="tiny"
              number={minSelectCount}
              minNumber={1}
              maxNumber={maxSelectCount}
              disable={false}
              onNumberChange={onChangeMinSelectCount}
            />
          </div>
          <Border />
          <div className="flex h-15.5 shrink-0 items-center justify-between bg-white px-7">
            <Text color={adaptive.grey700} typography="t5" fontWeight="semibold">
              최대 선택
            </Text>
            <NumericSpinner
              size="tiny"
              number={maxSelectCount}
              minNumber={minSelectCount}
              maxNumber={maxSelectableCount}
              disable={false}
              onNumberChange={onChangeMaxSelectCount}
            />
          </div>
        </>
      ) : null}
    </>
  );
}
