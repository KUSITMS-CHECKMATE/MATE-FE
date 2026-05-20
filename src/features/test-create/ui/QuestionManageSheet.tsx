import { useState } from "react";
import { motion } from "framer-motion";
import { Top, FixedBottomCTA, CTAButton, ListRow, IconButton, Asset, Text, ConfirmDialog } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { QUESTION_TYPES, type PendingQuestion } from "../model/types";

interface QuestionManageSheetProps {
  questions: PendingQuestion[];
  onDelete: (id: string) => void;
  onReorder: (reordered: PendingQuestion[]) => void;
  onSave: () => void;
  onCancel: () => void;
}

interface SortableItemProps {
  question: PendingQuestion;
  onDeleteRequest: (id: string) => void;
}

function SortableQuestionItem({ question, onDeleteRequest }: SortableItemProps) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({ id: question.id });
  const type = QUESTION_TYPES.find((t) => t.id === question.typeId);
  if (!type) return null;

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
      {...attributes}
      {...listeners}
    >
      <ListRow
        left={
          <div className="flex items-center gap-2">
            <Asset.Icon frameShape={{ width: 20, height: 20 }} backgroundColor="transparent" name="icon-navigation-menu-mono" color={adaptive.grey400} aria-hidden ratio="1/1" />
            <ListRow.AssetIcon size="xsmall" shape="original" name={type.iconName} />
          </div>
        }
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top={question.data?.title ?? "미입력"}
            topProps={{ color: adaptive.grey800, fontWeight: "semibold" }}
            bottom={type.label}
            bottomProps={{ color: adaptive.grey600 }}
          />
        }
        right={
          <div onPointerDown={(e) => e.stopPropagation()}>
            <IconButton
              src="https://static.toss.im/icons/png/4x/icon-bin-mono.png"
              iconSize={20}
              variant="clear"
              color={adaptive.grey400}
              aria-label="삭제"
              onClick={() => onDeleteRequest(question.id)}
            />
          </div>
        }
        verticalPadding="large"
      />
    </div>
  );
}

export function QuestionManageSheet({ questions, onDelete, onReorder, onSave, onCancel }: QuestionManageSheetProps) {
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);

  const closeDeleteDialog = () => setPendingDeleteId(null);
  const confirmDelete = () => {
    if (pendingDeleteId) onDelete(pendingDeleteId);
    closeDeleteDialog();
  };

  const closeSaveDialog = () => setIsSaveDialogOpen(false);
  const confirmSave = () => {
    closeSaveDialog();
    onSave();
  };

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = questions.findIndex((q) => q.id === active.id);
    const newIndex = questions.findIndex((q) => q.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    onReorder(arrayMove(questions, oldIndex, newIndex));
  };

  return (
    <motion.div className="fixed inset-0 z-50 flex flex-col bg-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
      <Top
        title={
          <Top.TitleParagraph size={22} color={adaptive.grey900}>
            질문을 삭제하거나
            <br />
            순서를 바꿀 수 있어요
          </Top.TitleParagraph>
        }
      />

      <div className="px-6 pt-6 pb-2">
        <Text color={adaptive.grey700} typography="t7" fontWeight="regular">
          질문 목록
        </Text>
      </div>

      <div className="flex-1 overflow-y-auto">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={questions.map((q) => q.id)} strategy={verticalListSortingStrategy}>
            {questions.map((q) => (
              <SortableQuestionItem key={q.id} question={q} onDeleteRequest={setPendingDeleteId} />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      <FixedBottomCTA.Double
        leftButton={
          <CTAButton className="w-full" color="dark" variant="weak" onClick={onCancel}>
            취소
          </CTAButton>
        }
        rightButton={
          <CTAButton className="w-full" disabled={questions.length === 0} onClick={() => setIsSaveDialogOpen(true)}>
            저장하기
          </CTAButton>
        }
      />

      <ConfirmDialog
        open={pendingDeleteId !== null}
        title="질문을 삭제할까요?"
        description="삭제하면 복구할 수 없어요"
        onClose={closeDeleteDialog}
        cancelButton={
          <ConfirmDialog.CancelButton size="xlarge" onClick={closeDeleteDialog}>
            닫기
          </ConfirmDialog.CancelButton>
        }
        confirmButton={
          <ConfirmDialog.ConfirmButton color="danger" size="xlarge" onClick={confirmDelete}>
            삭제하기
          </ConfirmDialog.ConfirmButton>
        }
      />

      <ConfirmDialog
        open={isSaveDialogOpen}
        title="바꾼 내용을 저장할까요?"
        onClose={closeSaveDialog}
        cancelButton={
          <ConfirmDialog.CancelButton size="xlarge" onClick={closeSaveDialog}>
            아니요
          </ConfirmDialog.CancelButton>
        }
        confirmButton={
          <ConfirmDialog.ConfirmButton size="xlarge" onClick={confirmSave}>
            저장하기
          </ConfirmDialog.ConfirmButton>
        }
      />
    </motion.div>
  );
}
