import { TextArea } from "@toss/tds-mobile";
import { QuestionHeader } from "@/features/test-participate/ui/QuestionHeader";
import type { QuestionAnswerProps } from "@/features/test-participate/model/types";

type Props = QuestionAnswerProps<"subjective">;

export function SubjectiveAnswerPage({ question, answer, onChange }: Props) {
  const { title, description, imageUrl, placeholder, maxLength } =
    question.data;

  const text = answer?.text ?? "";
  const hasImage = imageUrl.trim().length > 0;

  return (
    <div className="flex flex-col">
      <QuestionHeader
        categoryLabel="주관식"
        title={title}
        description={description}
      />
      {hasImage && (
        <div className="px-5">
          <img
            src={imageUrl}
            alt=""
            className="h-53 w-full rounded-2xl object-cover shadow-[inset_0_0_0_1px_rgba(2,32,71,0.05)]"
          />
        </div>
      )}
      <TextArea
        variant="box"
        hasError={false}
        label="답변"
        labelOption="sustain"
        value={text}
        placeholder={placeholder || "답변을 입력해주세요"}
        height={200}
        maxLength={maxLength ?? undefined}
        onChange={(e) => onChange({ type: "subjective", text: e.target.value })}
      />
    </div>
  );
}
