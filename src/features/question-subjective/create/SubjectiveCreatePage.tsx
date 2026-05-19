import { useState } from "react";
import { motion } from "framer-motion";
import { Asset, Border, TextArea } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { useTestCreateForm } from "@/features/test-create/model/useTestCreateForm";
import { useQuestionImageUpload } from "@/features/test-create/model/useQuestionImageUpload";
import { QuestionCreateTopSection } from "@/features/test-create/ui/QuestionCreateTopSection";
import { QuestionImageUploadSection } from "@/features/test-create/ui/QuestionImageUploadSection";
import { PhotoSelectSheet } from "@/features/test-create/ui/PhotoSelectSheet";
import { SubjectiveCreateBottomCTA } from "./SubjectiveCreateBottomCTA";

interface SubjectiveCreatePageProps {
  questionId: string;
  onClose: () => void;
}

export function SubjectiveCreatePage({ questionId, onClose }: SubjectiveCreatePageProps) {
  const { updateQuestion, questions } = useTestCreateForm();
  const existing = questions.find((q) => q.id === questionId)?.data;
  const existingSubjective = existing?.typeId === "subjective" ? existing : null;

  const [questionTitle, setQuestionTitle] = useState(
    existingSubjective?.title ?? "",
  );
  const [questionDescription, setQuestionDescription] = useState(
    existingSubjective?.description ?? "",
  );
  const [questionImageUrl, setQuestionImageUrl] = useState(
    existingSubjective?.imageUrl ?? "",
  );
  const [placeholder] = useState(
    existingSubjective?.placeholder ?? "",
  );
  const [maxLength] = useState<number | null>(
    existingSubjective?.maxLength ?? null,
  );
  const [isQuestionInputCompleted, setIsQuestionInputCompleted] = useState(
    (existingSubjective?.title ?? "").trim().length > 0,
  );
  const { isPhotoSheetOpen, openPhotoSheet, closePhotoSheet, handleCamera, handleAlbum } =
    useQuestionImageUpload(setQuestionImageUrl);

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
        questionType="주관식"
        questionTitle={questionTitle}
        questionDescription={questionDescription}
        onChangeTitle={setQuestionTitle}
        onChangeDescription={setQuestionDescription}
        isInputCompleted={isQuestionInputCompleted}
        onConfirmInput={() => setIsQuestionInputCompleted(true)}
        onClose={onClose}
        imageUploadSection={
          <QuestionImageUploadSection
            imageUrl={questionImageUrl}
            onCameraClick={openPhotoSheet}
            onRemove={() => setQuestionImageUrl("")}
          />
        }
        imageSectionContent={
          isQuestionInputCompleted && questionImageUrl ? (
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

      {isQuestionInputCompleted && (
        <>
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
        </>
      )}

      <PhotoSelectSheet
        open={isPhotoSheetOpen}
        onClose={closePhotoSheet}
        onCamera={handleCamera}
        onAlbum={handleAlbum}
      />
    </motion.div>
  );
}
