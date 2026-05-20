import { useState } from "react";
import { motion } from "framer-motion";
import { openCamera, fetchAlbumPhotos, OpenCameraPermissionError, FetchAlbumPhotosPermissionError } from "@apps-in-toss/web-framework";
import { Asset, ListRow } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { useTestCreateForm } from "@/features/test-create/model/useTestCreateForm";
import { PhotoSelectSheet } from "@/features/test-create/ui/PhotoSelectSheet";
import { QuestionCreateTopSection } from "@/features/test-create/ui/QuestionCreateTopSection";
import { TesterPreviewListRow } from "@/features/test-create/ui/TesterPreviewListRow";
import { AbAnswerPage } from "@/features/question-ab/answer";
import { AbCreateBottomCTA } from "./AbCreateBottomCTA";
import { AbCreateOptionSection } from "./AbCreateOptionSection";
import { AbRatioSelectSheet } from "./AbRatioSelectSheet";
import type { AbRatio } from "@/features/question-ab/model/types";

interface AbCreatePageProps {
  questionId: string;
  onClose: () => void;
}

export function AbCreatePage({ questionId, onClose }: AbCreatePageProps) {
  const { updateQuestion, questions } = useTestCreateForm();
  const existing = questions.find((q) => q.id === questionId)?.data;
  const existingAb = existing?.typeId === "ab" ? existing : null;

  const [questionTitle, setQuestionTitle] = useState(existingAb?.title ?? "");
  const [questionDescription, setQuestionDescription] = useState(existingAb?.description ?? "");
  const [isQuestionInputCompleted, setIsQuestionInputCompleted] = useState(
    (existingAb?.title ?? "").trim().length > 0,
  );
  const [imageUrlA, setImageUrlA] = useState(existingAb?.imageUrlA ?? "");
  const [imageUrlB, setImageUrlB] = useState(existingAb?.imageUrlB ?? "");
  const [activeSlot, setActiveSlot] = useState<"a" | "b" | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewAnswer, setPreviewAnswer] = useState<{ type: "ab"; selected: "A" | "B" | null }>({ type: "ab", selected: null });
  const [ratio, setRatio] = useState<AbRatio>(existingAb?.ratio ?? "9:16");
  const [isRatioSheetOpen, setIsRatioSheetOpen] = useState(false);

  const isCompleteDisabled =
    questionTitle.trim().length === 0 ||
    imageUrlA.trim().length === 0 ||
    imageUrlB.trim().length === 0;

  const handleCamera = async () => {
    try {
      const response = await openCamera({ base64: true, maxWidth: 1280 });
      const url = `data:image/jpeg;base64,${response.dataUri}`;
      if (activeSlot === "a") setImageUrlA(url);
      else if (activeSlot === "b") setImageUrlB(url);
    } catch (error) {
      if (error instanceof OpenCameraPermissionError) {
        await openCamera.openPermissionDialog();
      } else {
        console.error("[AbCreatePage handleCamera]", error);
      }
    } finally {
      setActiveSlot(null);
    }
  };

  const handleAlbum = async () => {
    try {
      const response = await fetchAlbumPhotos({ base64: true, maxWidth: 1280, maxCount: 1 });
      if (response[0]) {
        const url = `data:image/jpeg;base64,${response[0].dataUri}`;
        if (activeSlot === "a") setImageUrlA(url);
        else if (activeSlot === "b") setImageUrlB(url);
      }
    } catch (error) {
      if (error instanceof FetchAlbumPhotosPermissionError) {
        await fetchAlbumPhotos.openPermissionDialog();
      } else {
        console.error("[AbCreatePage handleAlbum]", error);
      }
    } finally {
      setActiveSlot(null);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-white pb-28"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <QuestionCreateTopSection
        questionType="A/B 테스트"
        questionTitle={questionTitle}
        questionDescription={questionDescription}
        onChangeTitle={setQuestionTitle}
        onChangeDescription={setQuestionDescription}
        isInputCompleted={isQuestionInputCompleted}
        onConfirmInput={() => setIsQuestionInputCompleted(true)}
        onClose={onClose}
      />
      {isQuestionInputCompleted && (
        <>
          <TesterPreviewListRow onClick={() => setIsPreviewOpen(true)} />
          
          <ListRow
            as="button"
            className="w-full text-left"
            style={{ marginTop: 12 }}
            contents={
              <ListRow.Texts
                type="1RowTypeA"
                top="A/B안 이미지"
                topProps={{ color: adaptive.grey600 }}
              />
            }
            right={
              <ListRow.Texts
                type="Right1RowTypeA"
                top={`비율 ${ratio}`}
                topProps={{ color: adaptive.grey600 }}
              />
            }
            verticalPadding="xlarge"
            arrowType="down"
            withTouchEffect
            onClick={() => setIsRatioSheetOpen(true)}
          />
          <AbCreateOptionSection
            imageUrlA={imageUrlA}
            imageUrlB={imageUrlB}
            ratio={ratio}
            onUploadA={() => setActiveSlot("a")}
            onUploadB={() => setActiveSlot("b")}
            onRemoveA={() => setImageUrlA("")}
            onRemoveB={() => setImageUrlB("")}
          />
          <AbCreateBottomCTA
            isCompleteDisabled={isCompleteDisabled}
            onCancel={onClose}
            onComplete={() => {
              updateQuestion(questionId, {
                typeId: "ab",
                title: questionTitle,
                description: questionDescription,
                imageUrlA,
                imageUrlB,
                ratio,
              });
              onClose();
            }}
          />
        </>
      )}

      <PhotoSelectSheet
        open={activeSlot !== null}
        onClose={() => setActiveSlot(null)}
        onCamera={handleCamera}
        onAlbum={handleAlbum}
      />
      <AbRatioSelectSheet
        open={isRatioSheetOpen}
        selected={ratio}
        onClose={() => setIsRatioSheetOpen(false)}
        onSelect={setRatio}
      />

      {isPreviewOpen && (
        <motion.div
          className="fixed inset-0 z-60 flex flex-col overflow-y-auto bg-white pb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center h-14 px-5">
            <button
              type="button"
              onClick={() => setIsPreviewOpen(false)}
              aria-label="뒤로가기"
              className="flex items-center"
            >
              <div style={{ transform: "rotate(180deg)" }}>
                <Asset.Icon
                  frameShape={Asset.frameShape.CleanW24}
                  backgroundColor="transparent"
                  name="icon-arrow-right-textbutton-thin-mono"
                  color={adaptive.grey800}
                  aria-hidden
                  ratio="1/1"
                />
              </div>
            </button>
            <span className="flex-1 text-center text-[17px] font-semibold" style={{ color: adaptive.grey900 }}>
              테스트 미리보기
            </span>
            <div style={{ width: 24 }} />
          </div>
          <AbAnswerPage
            question={{
              id: "preview",
              type: "ab",
              data: {
                title: questionTitle,
                description: questionDescription,
                imageUrlA,
                imageUrlB,
              },
            }}
            answer={previewAnswer}
            onChange={setPreviewAnswer}
          />
        </motion.div>
      )}
    </motion.div>
  );
}
