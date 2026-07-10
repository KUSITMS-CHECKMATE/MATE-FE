import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { FixedBottomCTA, CTAButton } from "@toss/tds-mobile";
import { TestImageStep } from "./TestImageStep";
import { useTestCreateForm } from "../model/useTestCreateForm";

interface TestImageEditPageProps {
  onClose: () => void;
}

export function TestImageEditPage({ onClose }: TestImageEditPageProps) {
  const form = useTestCreateForm();
  const snapshot = useRef({ images: form.images });
  const [hasImages, setHasImages] = useState(form.images.length > 0);

  const handleCancel = () => {
    form.setImages(snapshot.current.images);
    onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <main className="flex flex-col flex-1 pb-4">
        <TestImageStep title="테스트 이미지 수정하기" onHasImagesChange={setHasImages} />
      </main>
      <FixedBottomCTA.Double
        leftButton={
          <CTAButton color="dark" variant="weak" onClick={handleCancel}>
            취소
          </CTAButton>
        }
        rightButton={
          <CTAButton disabled={!hasImages} onClick={onClose}>
            수정완료
          </CTAButton>
        }
      />
    </motion.div>
  );
}
