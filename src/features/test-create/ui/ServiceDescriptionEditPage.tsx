import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { TextField, TextArea, FixedBottomCTA, CTAButton, Top, ConfirmDialog } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { useTestCreateForm } from "../model/useTestCreateForm";

const SERVICE_NAME_MAX_WITH_SPACE = 17;
const SERVICE_NAME_MAX_WITHOUT_SPACE = 15;
const DESCRIPTION_MAX_WITH_SPACE = 70;
const DESCRIPTION_MAX_WITHOUT_SPACE = 60;

function isWithinLimit(value: string, maxWithSpace: number, maxWithoutSpace: number) {
  return value.length <= maxWithSpace && value.replace(/\s/g, "").length <= maxWithoutSpace;
}

interface ServiceDescriptionEditPageProps {
  onClose: () => void;
}

export function ServiceDescriptionEditPage({ onClose }: ServiceDescriptionEditPageProps) {
  const form = useTestCreateForm();
  const snapshot = useRef({
    serviceName: form.serviceName,
    description: form.description,
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleCancel = () => {
    form.setServiceName(snapshot.current.serviceName);
    form.setDescription(snapshot.current.description);
    onClose();
  };

  const handleSubmit = () => {
    const isEmpty = form.serviceName.trim().length === 0 && form.description.trim().length === 0;
    if (isEmpty) {
      setIsDeleteDialogOpen(true);
      return;
    }
    onClose();
  };

  const closeDeleteDialog = () => setIsDeleteDialogOpen(false);
  const confirmDelete = () => {
    form.setServiceName("");
    form.setDescription("");
    closeDeleteDialog();
    onClose();
  };

  const handleServiceNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isWithinLimit(e.target.value, SERVICE_NAME_MAX_WITH_SPACE, SERVICE_NAME_MAX_WITHOUT_SPACE)) {
      form.setServiceName(e.target.value);
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isWithinLimit(e.target.value, DESCRIPTION_MAX_WITH_SPACE, DESCRIPTION_MAX_WITHOUT_SPACE)) {
      form.setDescription(e.target.value);
    }
  };

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
            서비스 소개 수정하기
          </Top.TitleParagraph>
        }
        subtitleTop={
          <Top.SubtitleBadges
            badges={[{ text: "선택", color: "yellow", variant: "weak" }]}
          />
        }
      />
      <main className="flex flex-col flex-1">
        <TextField.Clearable
          variant="line"
          label="서비스 이름"
          value={form.serviceName}
          placeholder="서비스 이름"
          onChange={handleServiceNameChange}
          onClear={() => form.setServiceName("")}
          enterKeyHint="done"
        />
        <TextArea
          variant="line"
          label="서비스 소개"
          value={form.description}
          placeholder="서비스 소개"
          onChange={handleDescriptionChange}
          enterKeyHint="done"
        />
      </main>
      <FixedBottomCTA.Double
        leftButton={
          <CTAButton color="dark" variant="weak" onClick={handleCancel}>
            취소
          </CTAButton>
        }
        rightButton={<CTAButton onClick={handleSubmit}>수정완료</CTAButton>}
      />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        title="서비스 소개를 삭제할까요?"
        onClose={closeDeleteDialog}
        cancelButton={
          <ConfirmDialog.CancelButton size="xlarge" onClick={closeDeleteDialog}>
            아니요
          </ConfirmDialog.CancelButton>
        }
        confirmButton={
          <ConfirmDialog.ConfirmButton color="danger" size="xlarge" onClick={confirmDelete}>
            삭제하기
          </ConfirmDialog.ConfirmButton>
        }
      />
    </motion.div>
  );
}
