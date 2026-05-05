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
import type { MultipleChoiceItem } from "../../model/types";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  type DragEndEvent,
  type DragStartEvent,
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
import { useState } from "react";

const ListHeaderTitleParagraph = ListHeader.TitleParagraph;

interface ChoiceRowProps {
  choice: MultipleChoiceItem;
  isMultiSelectEnabled: boolean;
  isManageMode: boolean;
  onEditChoice: (choiceId: string) => void;
  onDeleteChoice: (choiceId: string) => void;
  onRemoveChoiceImage: (choiceId: string) => void;
  isOverlay?: boolean;
}

function ChoiceRow({
  choice,
  isMultiSelectEnabled,
  isManageMode,
  onEditChoice,
  onDeleteChoice,
  onRemoveChoiceImage,
  isOverlay = false,
}: ChoiceRowProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: choice.id,
    disabled: !isManageMode,
  });

  const style = {
    transform: isOverlay ? undefined : CSS.Transform.toString(transform),
    transition: isOverlay ? undefined : transition,
    opacity: isDragging && !isOverlay ? 0.15 : 1,
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
              style={{
                touchAction: "none",
                WebkitUserSelect: "none",
                userSelect: "none",
              }}
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
              name={
                isMultiSelectEnabled
                  ? "icon-square-line-mono"
                  : "icon-circle-empty-mono"
              }
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

      {choice.imageUrl ? (
        <div className="w-full bg-white px-4 pb-1 pl-12">
          <div
            className="relative h-[185px] w-full overflow-hidden rounded-2xl"
            style={{
              boxShadow: `inset 0 0 0 1px ${adaptive.greyOpacity100}`,
            }}
          >
            <img
              src={choice.imageUrl}
              alt={`${choice.name} 이미지`}
              className="h-full w-full rounded-2xl object-cover"
            />
            <button
              type="button"
              onClick={() => onRemoveChoiceImage(choice.id)}
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
  isChoiceManageMode: boolean;
  minSelectCount: number;
  maxSelectCount: number;
  onToggleOtherInput: (checked: boolean) => void;
  onToggleMultiSelect: (checked: boolean) => void;
  onChangeMinSelectCount: (value: number) => void;
  onChangeMaxSelectCount: (value: number) => void;
  onOpenChoiceEditor: () => void;
  onEditChoice: (choiceId: string) => void;
  onRemoveChoiceImage: (choiceId: string) => void;
  onToggleChoiceManageMode: () => void;
  onDeleteChoice: (choiceId: string) => void;
  onReorderChoices: (choices: MultipleChoiceItem[]) => void;
}

export function MultipleCreateOptionSection({
  isOtherInputEnabled,
  isMultiSelectEnabled,
  choices,
  isChoiceManageMode,
  minSelectCount,
  maxSelectCount,
  onToggleOtherInput,
  onToggleMultiSelect,
  onChangeMinSelectCount,
  onChangeMaxSelectCount,
  onOpenChoiceEditor,
  onEditChoice,
  onRemoveChoiceImage,
  onToggleChoiceManageMode,
  onDeleteChoice,
  onReorderChoices,
}: MultipleCreateOptionSectionProps) {
  const maxSelectableCount = choices.length;
  const hasChoices = choices.length > 0;
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );
  const [activeChoiceId, setActiveChoiceId] = useState<string | null>(null);
  const activeChoice =
    choices.find((choice) => choice.id === activeChoiceId) ?? null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveChoiceId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveChoiceId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = choices.findIndex((choice) => choice.id === active.id);
    const newIndex = choices.findIndex((choice) => choice.id === over.id);
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
        />
      </div>

      {!isChoiceManageMode && choices.length < 10 ? (
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

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveChoiceId(null)}
      >
        <SortableContext
          items={choices.map((choice) => choice.id)}
          strategy={verticalListSortingStrategy}
        >
          {choices.map((choice) => (
            <ChoiceRow
              key={choice.id}
              choice={choice}
              isMultiSelectEnabled={isMultiSelectEnabled}
              isManageMode={isChoiceManageMode}
              onEditChoice={onEditChoice}
              onDeleteChoice={onDeleteChoice}
              onRemoveChoiceImage={onRemoveChoiceImage}
            />
          ))}
        </SortableContext>
        <DragOverlay>
          {activeChoice && isChoiceManageMode ? (
            <div className="w-[calc(100vw-32px)] max-w-89.5 rounded-2xl bg-white shadow-[0_12px_40px_rgba(0,0,0,0.16)]">
              <ChoiceRow
                choice={activeChoice}
                isMultiSelectEnabled={isMultiSelectEnabled}
                isManageMode
                onEditChoice={onEditChoice}
                onDeleteChoice={onDeleteChoice}
                onRemoveChoiceImage={onRemoveChoiceImage}
                isOverlay
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {!isChoiceManageMode ? (
        <>
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
                <Text
                  color={adaptive.grey700}
                  typography="t5"
                  fontWeight="semibold"
                >
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
                <Text
                  color={adaptive.grey700}
                  typography="t5"
                  fontWeight="semibold"
                >
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
      ) : null}
    </>
  );
}
