import { Top, TextArea, TextField } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { useTestCreateForm } from "../model/useTestCreateForm";

interface TestDescriptionStepProps {
  showDescriptionField: boolean;
  onFocus: () => void;
  onBlur: () => void;
}

export function ServiceDescriptionStep({ showDescriptionField, onFocus, onBlur }: TestDescriptionStepProps) {
  const { serviceName, setServiceName, description, setDescription } = useTestCreateForm();

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
          onChange={(e) => setDescription(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      ) : null}
      <TextField.Clearable
        variant="line"
        hasError={false}
        label="서비스 이름"
        value={serviceName}
        placeholder="서비스 이름"
        onChange={(e) => setServiceName(e.target.value)}
        onClear={() => setServiceName("")}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </div>
  );
}
