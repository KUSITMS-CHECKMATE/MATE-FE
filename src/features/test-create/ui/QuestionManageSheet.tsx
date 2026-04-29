import { useState } from "react";
import { motion } from "framer-motion";
import { Top, SegmentedControl, FixedBottomCTA, CTAButton, ListRow, Button, IconButton, Text, ConfirmDialog } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { DndContext, PointerSensor, useSensor, useSensors, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { QUESTION_TYPES, type QuestionTypeId } from "../model/types";

type ManageTab = "delete" | "reorder";

export interface PendingQuestion {
  id: string;
  typeId: QuestionTypeId;
  title?: string;
}

interface QuestionManageSheetProps {
  questions: PendingQuestion[];
  onDelete: (id: string) => void;
  onReorder: (reordered: PendingQuestion[]) => void;
  onSave: () => void;
  onCancel: () => void;
}

function SortableQuestionItem({ question }: { question: PendingQuestion }) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({ id: question.id });
  const type = QUESTION_TYPES.find((t) => t.id === question.typeId);
  if (!type) return null;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    touchAction: "manipulation" as const,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <ListRow
        left={<ListRow.AssetIcon size="xsmall" shape="original" name={type.iconName} />}
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top={question.title ?? "질문 제목"}
            topProps={{ color: adaptive.grey800, fontWeight: "semibold" }}
            bottom={type.label}
            bottomProps={{ color: adaptive.grey600 }}
          />
        }
        right={
          <IconButton
            src="https://static.toss.im/icons/png/4x/icon-navigation-menu-mono.png"
            iconSize={20}
            variant="clear"
            color={adaptive.grey400}
            aria-label="순서 변경 핸들"
            style={{ touchAction: "none", cursor: "grab" }}
            {...attributes}
            {...listeners}
          />
        }
        verticalPadding="large"
      />
    </div>
  );
}

export function QuestionManageSheet({ questions, onDelete, onReorder, onSave, onCancel }: QuestionManageSheetProps) {
  const [activeTab, setActiveTab] = useState<ManageTab>("delete");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const isSaveDisabled = questions.length === 0;

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

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

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

      <div className="px-5 mt-4">
        <SegmentedControl alignment="fixed" size="small" value={activeTab} onChange={(v) => setActiveTab(v as ManageTab)}>
          <SegmentedControl.Item value="delete">질문 삭제</SegmentedControl.Item>
          <SegmentedControl.Item value="reorder">순서 바꾸기</SegmentedControl.Item>
        </SegmentedControl>
      </div>

      <div className="px-5 pt-6 pb-2">
        <Text color={adaptive.grey700} typography="t7" fontWeight="regular">
          질문
        </Text>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === "delete" ? (
          questions.map((q) => {
            const type = QUESTION_TYPES.find((t) => t.id === q.typeId);
            if (!type) return null;
            return (
              <ListRow
                key={q.id}
                left={<ListRow.AssetIcon size="xsmall" shape="original" name={type.iconName} />}
                contents={
                  <ListRow.Texts
                    type="2RowTypeA"
                    top={q.title ?? "질문 제목"}
                    topProps={{ color: adaptive.grey800, fontWeight: "semibold" }}
                    bottom={type.label}
                    bottomProps={{ color: adaptive.grey600 }}
                  />
                }
                right={
                  <Button size="small" color="danger" variant="weak" onClick={() => setPendingDeleteId(q.id)}>
                    삭제
                  </Button>
                }
                verticalPadding="large"
              />
            );
          })
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={questions.map((q) => q.id)} strategy={verticalListSortingStrategy}>
              {questions.map((q) => (
                <SortableQuestionItem key={q.id} question={q} />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>

      <FixedBottomCTA.Double
        leftButton={
          <CTAButton className="w-full" color="dark" variant="weak" onClick={onCancel}>
            취소
          </CTAButton>
        }
        rightButton={
          <CTAButton className="w-full" disabled={isSaveDisabled} onClick={() => setIsSaveDialogOpen(true)}>
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
