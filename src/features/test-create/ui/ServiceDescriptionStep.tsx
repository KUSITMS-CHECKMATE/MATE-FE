import { useRef } from "react";
import { Top, TextArea, TextField } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { useTestCreateForm } from "../model/useTestCreateForm";

// serviceName/description 모두 백엔드 글자수 제한이 삭제되어 폭주 방지용 상한만 둔다.
const SERVICE_NAME_MAX_LENGTH = 250;
const DESCRIPTION_MAX_LENGTH = 250;

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
    const value = e.target.value;
    if (value.length <= SERVICE_NAME_MAX_LENGTH) setServiceName(value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= DESCRIPTION_MAX_LENGTH) setDescription(value);
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
          maxLength={DESCRIPTION_MAX_LENGTH}
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
        maxLength={SERVICE_NAME_MAX_LENGTH}
      />
    </div>
  );
}
