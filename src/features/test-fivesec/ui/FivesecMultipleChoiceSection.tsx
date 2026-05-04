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
  TextButton,
} from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import type { MultipleChoiceItem } from "@/features/test-multiple/model/types";

const ListHeaderTitleParagraph = ListHeader.TitleParagraph;

export interface FivesecMultipleChoiceSectionProps {
  choices: MultipleChoiceItem[];
  isChoiceManageMode: boolean;
  isMultiSelectEnabled: boolean;
  minSelectCount: number;
  maxSelectCount: number;
  onOpenChoiceCreate: () => void;
  onOpenChoiceEdit: (choiceId: string) => void;
  onToggleChoiceManageMode: () => void;
  onDeleteChoice: (choiceId: string) => void;
  onReorderChoices: (choices: MultipleChoiceItem[]) => void;
  onToggleMultipleChoice: (checked: boolean) => void;
  onToggleMultiSelect: (checked: boolean) => void;
  onChangeMinSelectCount: (value: number) => void;
  onChangeMaxSelectCount: (value: number) => void;
}

interface SortableChoiceRowProps {
  choice: MultipleChoiceItem;
  isMultiSelectEnabled: boolean;
  isManageMode: boolean;
  onEditChoice: (choiceId: string) => void;
  onDeleteChoice: (choiceId: string) => void;
}

function SortableChoiceRow({
  choice,
  isMultiSelectEnabled,
  isManageMode,
  onEditChoice,
  onDeleteChoice,
}: SortableChoiceRowProps) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: choice.id,
    disabled: !isManageMode,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    touchAction: "manipulation" as const,
  };

  return (
    <div ref={setNodeRef} style={style} className="w-full">
      <ListRow
        left={
          isManageMode ? (
            <div
              aria-label={`${choice.name} 순서 이동`}
              className="cursor-grab touch-none"
              style={{ touchAction: "none", WebkitUserSelect: "none", userSelect: "none" }}
              {...attributes}
              {...listeners}
            >
              <ListRow.AssetIcon
                size="xsmall"
                shape="original"
                name="icon-line-three-mono"
                color={adaptive.grey400}
              />
            </div>
          ) : (
            <ListRow.AssetIcon
              size="xsmall"
              shape="original"
              name={isMultiSelectEnabled ? "icon-square-line-mono" : "icon-circle-empty-mono"}
              color={adaptive.grey400}
            />
          )
        }
        contents={
          <ListRow.Texts
            type="1RowTypeA"
            top={choice.name}
            topProps={{ color: adaptive.grey800 }}
          />
        }
        right={
          isManageMode ? (
            <button
              type="button"
              onClick={() => onDeleteChoice(choice.id)}
              aria-label={`${choice.name} 삭제`}
            >
              <Asset.Icon
                frameShape={Asset.frameShape.CleanW20}
                backgroundColor="transparent"
                name="icon-bin-mono"
                color={adaptive.grey400}
                aria-hidden
              />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onEditChoice(choice.id)}
              aria-label={`${choice.name} 수정`}
            >
              <Asset.Icon
                frameShape={Asset.frameShape.CleanW20}
                backgroundColor="transparent"
                name="icon-pencil-18px-mono"
                color={adaptive.grey400}
                aria-hidden
              />
            </button>
          )
        }
        verticalPadding="large"
      />
    </div>
  );
}

export function FivesecMultipleChoiceSection({
  choices,
  isChoiceManageMode,
  isMultiSelectEnabled,
  minSelectCount,
  maxSelectCount,
  onOpenChoiceCreate,
  onOpenChoiceEdit,
  onToggleChoiceManageMode,
  onDeleteChoice,
  onReorderChoices,
  onToggleMultipleChoice,
  onToggleMultiSelect,
  onChangeMinSelectCount,
  onChangeMaxSelectCount,
}: FivesecMultipleChoiceSectionProps) {
  const maxSelectableCount = choices.length;
  const hasChoices = choices.length > 0;
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
      <div className="pr-5">
        <ListHeader
          descriptionPosition="bottom"
          rightAlignment="center"
          titleWidthRatio={0.6}
          title={
            <ListHeaderTitleParagraph
              typography="t5"
              fontWeight="medium"
              color={adaptive.grey600}
            >
              선택지 목록
            </ListHeaderTitleParagraph>
          }
          right={
            <div className="pr-1">
              <TextButton
                color={adaptive.blue500}
                typography="t5"
                fontWeight="medium"
                size="small"
                disabled={!hasChoices}
                onClick={hasChoices ? onToggleChoiceManageMode : undefined}
              >
                {isChoiceManageMode ? "저장하기" : "순서/삭제"}
              </TextButton>
            </div>
          }
          className="w-full"
        />
      </div>

      {!isChoiceManageMode ? (
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

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragCancel={() => {}}
      >
        <SortableContext items={choices.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {choices.map((choice) => (
            <SortableChoiceRow
              key={choice.id}
              choice={choice}
              isMultiSelectEnabled={isMultiSelectEnabled}
              isManageMode={isChoiceManageMode}
              onEditChoice={onOpenChoiceEdit}
              onDeleteChoice={onDeleteChoice}
            />
          ))}
        </SortableContext>
      </DndContext>

      {!isChoiceManageMode ? (
        <>
          <ListRow
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
              <div className="flex h-15.5 items-center justify-between bg-white px-4">
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
              <div className="flex h-15.5 items-center justify-between bg-white px-4">
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

          <div className="h-6.75" />
          <Border />
          <div className="h-3" />

          <ListRow
            role="switch"
            aria-checked={true}
            horizontalPadding="small"
            contents={
              <ListRow.Texts
                type="1RowTypeB"
                top="객관식으로 답변 받기"
                topProps={{ color: adaptive.grey700 }}
              />
            }
            right={
              <Switch
                checked
                onChange={(_, checked) => onToggleMultipleChoice(checked)}
              />
            }
          />
        </>
      ) : null}
    </>
  );
}
