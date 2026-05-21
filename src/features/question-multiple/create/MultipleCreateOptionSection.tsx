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
import type { MultipleChoiceItem } from "../model/types";
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

interface ChoiceRowProps {
  choice: MultipleChoiceItem;
  onEditChoice: (choiceId: string) => void;
  onDeleteChoice: (choiceId: string) => void;
  onRemoveChoiceImage: (choiceId: string) => void;
}

function ChoiceRow({ choice, onEditChoice, onDeleteChoice, onRemoveChoiceImage }: ChoiceRowProps) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({ id: choice.id });

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
            className="cursor-grab"
            style={{ touchAction: "none", WebkitUserSelect: "none", userSelect: "none" }}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
          >
            <Asset.Icon
              frameShape={{ width: 20, height: 20 }}
              backgroundColor="transparent"
              name="icon-navigation-menu-mono"
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

      {choice.imageUrl ? (
        <div
          className="w-full bg-white px-4 pb-1 pl-12"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="relative h-[185px] w-full overflow-hidden rounded-2xl"
            style={{ boxShadow: `inset 0 0 0 1px ${adaptive.greyOpacity100}` }}
          >
            <img
              src={choice.imageUrl}
              alt={`${choice.name} 이미지`}
              className="h-full w-full rounded-2xl object-cover"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveChoiceImage(choice.id);
              }}
              className="absolute right-1.5 top-1.5"
              aria-label={`${choice.name} 이미지 삭제`}
            >
              <Asset.Icon
                frameShape={Asset.frameShape.CircleXSmall}
                backgroundColor={adaptive.greyOpacity600}
                name="icon-sweetshop-x-white"
                scale={0.66}
                aria-hidden
              />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

interface MultipleCreateOptionSectionProps {
  isOtherInputEnabled: boolean;
  isMultiSelectEnabled: boolean;
  choices: MultipleChoiceItem[];
  minSelectCount: number;
  maxSelectCount: number;
  onToggleOtherInput: (checked: boolean) => void;
  onToggleMultiSelect: (checked: boolean) => void;
  onChangeMinSelectCount: (value: number) => void;
  onChangeMaxSelectCount: (value: number) => void;
  onOpenChoiceEditor: () => void;
  onEditChoice: (choiceId: string) => void;
  onRemoveChoiceImage: (choiceId: string) => void;
  onDeleteChoice: (choiceId: string) => void;
  onReorderChoices: (choices: MultipleChoiceItem[]) => void;
}

export function MultipleCreateOptionSection({
  isOtherInputEnabled,
  isMultiSelectEnabled,
  choices,
  minSelectCount,
  maxSelectCount,
  onToggleOtherInput,
  onToggleMultiSelect,
  onChangeMinSelectCount,
  onChangeMaxSelectCount,
  onOpenChoiceEditor,
  onEditChoice,
  onRemoveChoiceImage,
  onDeleteChoice,
  onReorderChoices,
}: MultipleCreateOptionSectionProps) {
  const maxSelectableCount = choices.length;
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

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
      <div className="pr-5">
        <ListHeader
          className="shrink-0 w-full"
          descriptionPosition="bottom"
          rightAlignment="center"
          titleWidthRatio={0.6}
          title={
            <ListHeader.TitleParagraph typography="t5" fontWeight="medium" color={adaptive.grey600}>
              선택지 목록
            </ListHeader.TitleParagraph>
          }
        />
      </div>

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
          onClick={onOpenChoiceEditor}
        />
      ) : null}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={choices.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {choices.map((choice) => (
            <ChoiceRow
              key={choice.id}
              choice={choice}
              onEditChoice={onEditChoice}
              onDeleteChoice={onDeleteChoice}
              onRemoveChoiceImage={onRemoveChoiceImage}
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
