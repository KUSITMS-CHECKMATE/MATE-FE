import { useState } from "react";
import { motion } from "framer-motion";
import { CTAButton, FixedBottomCTA, TextField, Top } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";

interface FivesecQuestionEditorOverlayProps {
  initialTitle: string;
  initialDescription: string;
  onClose: () => void;
  onSave: (values: { title: string; description: string }) => void;
}

export function FivesecQuestionEditorOverlay({
  initialTitle,
  initialDescription,
  onClose,
  onSave,
}: FivesecQuestionEditorOverlayProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Top
        title={
          <Top.TitleParagraph size={22} color={adaptive.grey900}>
            질문 입력하기
          </Top.TitleParagraph>
        }
      />

      <main className="flex flex-1 flex-col bg-white">
        <TextField.Clearable
          variant="line"
          label="질문 제목"
          labelOption="sustain"
          value={title}
          placeholder="질문 제목"
          maxLength={34}
          autoFocus
          onChange={(e) => setTitle(e.target.value)}
          onClear={() => setTitle("")}
        />
        <TextField.Clearable
          variant="line"
          label="설명"
          labelOption="sustain"
          value={description}
          placeholder="설명"
          maxLength={50}
          prefix="(선택)"
          onChange={(e) => setDescription(e.target.value)}
          onClear={() => setDescription("")}
        />
      </main>

      <FixedBottomCTA.Double
        leftButton={
          <CTAButton color="dark" variant="weak" onClick={onClose}>
            취소
          </CTAButton>
        }
        rightButton={
          <CTAButton
            disabled={title.trim().length === 0}
            onClick={() => onSave({ title: title.trim(), description: description.trim() })}
          >
            저장하기
          </CTAButton>
        }
      />
    </motion.div>
  );
}
