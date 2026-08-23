import { useRef } from "react";
import { Top, TextArea, TextField } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { useTestCreateForm } from "../model/useTestCreateForm";

interface TestDescriptionStepProps {
  showDescriptionField: boolean;
  onFocus: () => void;
  onBlur: () => void;
  onServiceNameConfirm?: () => void;
}

export function ServiceDescriptionStep({ showDescriptionField, onFocus, onBlur, onServiceNameConfirm }: TestDescriptionStepProps) {
  const { serviceName, setServiceName, description, setDescription } = useTestCreateForm();
  const serviceNameInputRef = useRef<HTMLInputElement>(null);

  const handleServiceNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setServiceName(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  return (
    <div className="flex flex-col">
      <Top
        title={
          <Top.TitleParagraph size={22} color={adaptive.grey900}>
            서비스를 소개해주세요
          </Top.TitleParagraph>
        }
        subtitleTop={
          <Top.SubtitleBadges
            badges={[{ text: "선택", color: "yellow", variant: "weak" }]}
          />
        }
        subtitleBottom={
          <Top.SubtitleParagraph size={15}>
            테스트도 받고, 서비스 홍보까지 할 수 있어요.
          </Top.SubtitleParagraph>
        }
        lowerGap={0}
      />
      {showDescriptionField ? (
        <TextArea
          variant="line"
          hasError={false}
          label="서비스 소개"
          value={description}
          placeholder="서비스 소개"
          onChange={handleDescriptionChange}
          onFocus={onFocus}
          onBlur={onBlur}
          enterKeyHint="done"
        />
      ) : null}
      <TextField.Clearable
        ref={serviceNameInputRef}
        variant="line"
        hasError={false}
        label="서비스 이름"
        value={serviceName}
        placeholder="서비스 이름"
        onChange={handleServiceNameChange}
        onClear={() => { setServiceName(""); serviceNameInputRef.current?.focus(); }}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={(e) => { if (e.key === "Enter") onServiceNameConfirm?.(); }}
        enterKeyHint="done"
      />
    </div>
  );
}
