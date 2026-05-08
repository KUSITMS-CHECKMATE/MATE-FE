import { TextArea } from "@toss/tds-mobile";
import { QuestionHeader } from "@/features/test-participate/ui/QuestionHeader";
import type { QuestionAnswerProps } from "@/features/test-participate/model/types";

type Props = QuestionAnswerProps<"subjective">;

export function SubjectiveAnswerView({ question, answer, onChange }: Props) {
  const { title, description, imageUrl, placeholder, maxLength } =
    question.data;

  const text = answer?.text ?? "";

  return (
    <div className="flex flex-col">
      <QuestionHeader
        categoryLabel="주관식"
        title={title}
        description={description}
      />
      {imageUrl && (
        <div className="px-5">
          <div className="w-full h-53 rounded-2xl bg-gray-100 shadow-[inset_0_0_0_1px_rgba(2,32,71,0.05)]" />
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
