import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CTAButton, FixedBottomCTA, TextField } from "@toss/tds-mobile";
import { useQuestionImageUpload } from "@/features/test-create/model/useQuestionImageUpload";
import { QuestionImageUploadSection } from "@/features/test-create/ui/QuestionImageUploadSection";
import { PhotoSelectSheet } from "@/features/test-create/ui/PhotoSelectSheet";

interface MultipleChoiceEditorOverlayProps {
  initialChoiceName: string;
  initialImageUrl: string;
  onClose: () => void;
  onCreate: (values: { choiceName: string; imageUrl: string }) => void;
  submitLabel?: string;
}

export function MultipleChoiceEditorOverlay({
  initialChoiceName,
  initialImageUrl,
  onClose,
  onCreate,
  submitLabel = "만들기",
}: MultipleChoiceEditorOverlayProps) {
  const [choiceName, setChoiceName] = useState(initialChoiceName);
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [isFocused, setIsFocused] = useState(false);
  const blurTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { isPhotoSheetOpen, openPhotoSheet, closePhotoSheet, handleCamera, handleAlbum } =
    useQuestionImageUpload(setImageUrl);

  const isCreateDisabled = choiceName.trim().length === 0;

  const handleFocus = () => {
    if (blurTimerRef.current) clearTimeout(blurTimerRef.current);
    setIsFocused(true);
  };

  const handleBlur = () => {
    blurTimerRef.current = setTimeout(() => setIsFocused(false), 100);
  };

  const dismissKeyboard = () => {
    const active = document.activeElement;
    if (active instanceof HTMLElement) active.blur();
    setIsFocused(false);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <main className="flex flex-1 flex-col bg-white">
        <TextField.Clearable
          variant="line"
          label="어떤 선택지를 추가할까요?"
          labelOption="sustain"
          value={choiceName}
          placeholder="선택지명을 입력해주세요"
          maxLength={17}
          autoFocus
          onChange={(e) => setChoiceName(e.target.value)}
          onClear={() => setChoiceName("")}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />

        <QuestionImageUploadSection
          imageUrl={imageUrl}
          onCameraClick={openPhotoSheet}
          onRemove={() => setImageUrl("")}
        />
      </main>

      <AnimatePresence mode="wait">
        {isFocused ? (
          <motion.div
            key="confirm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <FixedBottomCTA fixedAboveKeyboard onClick={dismissKeyboard}>
              확인하기
            </FixedBottomCTA>
          </motion.div>
        ) : (
          <motion.div
            key="double"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <FixedBottomCTA.Double
              leftButton={
                <CTAButton color="dark" variant="weak" onClick={onClose}>
                  닫기
                </CTAButton>
              }
              rightButton={
                <CTAButton
                  disabled={isCreateDisabled}
                  onClick={() => onCreate({ choiceName: choiceName.trim(), imageUrl })}
                >
                  {submitLabel}
                </CTAButton>
              }
            />
          </motion.div>
        )}
      </AnimatePresence>

      <PhotoSelectSheet
        open={isPhotoSheetOpen}
        onClose={closePhotoSheet}
        onCamera={handleCamera}
        onAlbum={handleAlbum}
      />
    </motion.div>
  );
}
