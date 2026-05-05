import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { openCamera, fetchAlbumPhotos, OpenCameraPermissionError, FetchAlbumPhotosPermissionError } from "@apps-in-toss/web-framework";
import { useTestCreateForm } from "@/features/test-create/model/useTestCreateForm";
import { PhotoSelectSheet } from "@/features/test-create/ui/PhotoSelectSheet";
import { AbCreateBottomCTA } from "./AbCreateBottomCTA";
import { AbCreateOptionSection } from "./AbCreateOptionSection";
import { AbCreateTopSection } from "./AbCreateTopSection";
import { AbQuestionEditorOverlay } from "./AbQuestionEditorOverlay";

interface AbCreatePageProps {
  questionId: string;
  onClose: () => void;
}

export function AbCreatePage({ questionId, onClose }: AbCreatePageProps) {
  const { updateQuestion, questions } = useTestCreateForm();
  const existing = questions.find((q) => q.id === questionId)?.data;
  const existingAb = existing?.typeId === "ab" ? existing : null;

  const [isQuestionEditorOpen, setIsQuestionEditorOpen] = useState(false);
  const [questionTitle, setQuestionTitle] = useState(existingAb?.title ?? "");
  const [questionDescription, setQuestionDescription] = useState(existingAb?.description ?? "");
  const [imageUrlA, setImageUrlA] = useState(existingAb?.imageUrlA ?? "");
  const [imageUrlB, setImageUrlB] = useState(existingAb?.imageUrlB ?? "");
  const [activeSlot, setActiveSlot] = useState<"a" | "b" | null>(null);

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
      <AbCreateTopSection
        questionTitle={questionTitle}
        questionDescription={questionDescription}
        onOpenQuestionEditor={() => setIsQuestionEditorOpen(true)}
      />
      <AbCreateOptionSection
        imageUrlA={imageUrlA}
        imageUrlB={imageUrlB}
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
          });
          onClose();
        }}
      />

      <PhotoSelectSheet
        open={activeSlot !== null}
        onClose={() => setActiveSlot(null)}
        onCamera={handleCamera}
        onAlbum={handleAlbum}
      />

      <AnimatePresence>
        {isQuestionEditorOpen && (
          <AbQuestionEditorOverlay
            initialTitle={questionTitle}
            initialDescription={questionDescription}
            onClose={() => setIsQuestionEditorOpen(false)}
            onSave={({ title, description }) => {
              setQuestionTitle(title);
              setQuestionDescription(description);
              setIsQuestionEditorOpen(false);
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
