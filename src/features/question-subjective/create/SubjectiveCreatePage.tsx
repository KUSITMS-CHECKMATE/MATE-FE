import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Asset, Border, TextArea } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { useTestCreateForm } from "@/features/test-create/model/useTestCreateForm";
import { QuestionCreateTopSection } from "@/features/test-create/ui/QuestionCreateTopSection";
import { SubjectiveCreateBottomCTA } from "./SubjectiveCreateBottomCTA";
import { SubjectiveQuestionEditorOverlay } from "./SubjectiveQuestionEditorOverlay";

interface SubjectiveCreatePageProps {
  questionId: string;
  onClose: () => void;
}

export function SubjectiveCreatePage({ questionId, onClose }: SubjectiveCreatePageProps) {
  const { updateQuestion, questions } = useTestCreateForm();
  const existing = questions.find((q) => q.id === questionId)?.data;

  const [questionTitle, setQuestionTitle] = useState(
    existing?.typeId === "subjective" ? existing.title : "",
  );
  const [questionDescription, setQuestionDescription] = useState(
    existing?.typeId === "subjective" ? existing.description : "",
  );
  const [questionImageUrl, setQuestionImageUrl] = useState(
    existing?.typeId === "subjective" ? existing.imageUrl : "",
  );
  const [placeholder] = useState(
    existing?.typeId === "subjective" ? existing.placeholder : "",
  );
  const [maxLength] = useState<number | null>(
    existing?.typeId === "subjective" ? existing.maxLength : null,
  );
  const [isQuestionEditorOpen, setIsQuestionEditorOpen] = useState(false);

  const isCompleteDisabled = questionTitle.trim().length === 0;

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-y-auto bg-white pb-28"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <QuestionCreateTopSection
        questionTitle={questionTitle}
        questionDescription={questionDescription}
        onOpenQuestionEditor={() => setIsQuestionEditorOpen(true)}
        subtitle="주관식"
        imageSectionContent={
          questionImageUrl ? (
            <>
              <div className="rounded-2xl bg-white p-4">
                <div
                  className="w-full rounded-2xl p-1.5"
                  style={{
                    height: 194,
                    backgroundImage: `url(${questionImageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    boxShadow: `inset 0 0 0 1px ${adaptive.greyOpacity100}`,
                  }}
                >
                  <div className="flex h-full w-full flex-col items-end justify-between">
                    <button
                      type="button"
                      onClick={() => setQuestionImageUrl("")}
                      aria-label="이미지 삭제"
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
              </div>
              <Border className="w-full" variant="height16" />
            </>
          ) : (
            <Border className="w-full" variant="height16" />
          )
        }
      />

      {/* TODO: SubjectiveCreateOptionSection */}
      <TextArea
        variant="box"
        hasError={false}
        label="답변 작성"
        labelOption="sustain"
        value={placeholder}
        placeholder="예시 입력창이에요"
        height={200}
        readOnly
      />

      <SubjectiveCreateBottomCTA
        isCompleteDisabled={isCompleteDisabled}
        onCancel={onClose}
        onComplete={() => {
          updateQuestion(questionId, {
            typeId: "subjective",
            title: questionTitle,
            description: questionDescription,
            imageUrl: questionImageUrl,
            placeholder,
            maxLength,
          });
          onClose();
        }}
      />

      <AnimatePresence>
        {isQuestionEditorOpen && (
          <SubjectiveQuestionEditorOverlay
            key="question-editor"
            initialTitle={questionTitle}
            initialDescription={questionDescription}
            initialImageUrl={questionImageUrl}
            onClose={() => setIsQuestionEditorOpen(false)}
            onSave={({ title, description, imageUrl }) => {
              setQuestionTitle(title);
              setQuestionDescription(description);
              setQuestionImageUrl(imageUrl);
              setIsQuestionEditorOpen(false);
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
