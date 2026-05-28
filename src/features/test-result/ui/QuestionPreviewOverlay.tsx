import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BottomCTA, Skeleton } from "@toss/tds-mobile";
import { OVERLAY_MOTION } from "../model/constants";
import { QuestionRenderer } from "@/features/test-participate/ui/QuestionRenderer";
import { FivesecAnswerPage } from "@/features/question-fivesec/answer/FivesecAnswerPage";
import type { ParticipateQuestion } from "@/features/test-participate/model/types";

interface Props {
  selectedQuestionId: number | null;
  previewQuestion: ParticipateQuestion | undefined;
  onClose: () => void;
}

function SkeletonContent() {
  return (
    <div className="flex-1 overflow-y-auto px-5 pt-8">
      <Skeleton custom={["title", "subtitle"]} repeatLastItemCount={0} background="greyOpacity100" />
      <div className="mt-6">
        <Skeleton custom={["card"]} repeatLastItemCount={0} height={200} background="greyOpacity100" />
      </div>
      <div className="mt-6">
        <Skeleton custom={["list"]} repeatLastItemCount={3} background="greyOpacity100" />
      </div>
    </div>
  );
}

function FivesecOverlay({
  question,
  onClose,
}: {
  question: Extract<ParticipateQuestion, { type: "FIVE_SECOND" }>;
  onClose: () => void;
}) {
  const [answer, setAnswer] = useState<{ type: "FIVE_SECOND"; selectedIds: string[] }>({
    type: "FIVE_SECOND",
    selectedIds: [],
  });

  return (
    <motion.div
      {...OVERLAY_MOTION}
      className="fixed inset-0 z-49 flex flex-col overflow-y-auto bg-white pb-10"
    >
      <FivesecAnswerPage
        question={question}
        answer={answer}
        onChange={setAnswer}
        onPrev={onClose}
        onGoNext={onClose}
        isFirst={false}
        isLast={true}
        prevLabel="돌아가기"
        isPreview={true}
      />
    </motion.div>
  );
}

export function QuestionPreviewOverlay({ selectedQuestionId, previewQuestion, onClose }: Props) {
  const isFivesec = previewQuestion?.type === "FIVE_SECOND";

  return (
    <AnimatePresence>
      {selectedQuestionId !== null && !isFivesec && (
        <motion.div {...OVERLAY_MOTION} className="fixed inset-0 z-60 flex flex-col bg-white">
          {previewQuestion == null ? (
            <SkeletonContent />
          ) : (
            <>
              <div className="flex-1 overflow-y-auto">
                <QuestionRenderer
                  question={previewQuestion}
                  answer={undefined}
                  onChange={() => {}}
                  onPrev={onClose}
                  onGoNext={onClose}
                  isFirst={true}
                  isLast={true}
                />
              </div>
              <BottomCTA.Single color="dark" variant="weak" onClick={onClose}>
                뒤로가기
              </BottomCTA.Single>
            </>
          )}
        </motion.div>
      )}
      {isFivesec && previewQuestion != null && (
        <FivesecOverlay
          question={previewQuestion as Extract<ParticipateQuestion, { type: "FIVE_SECOND" }>}
          onClose={onClose}
        />
      )}
    </AnimatePresence>
  );
}
