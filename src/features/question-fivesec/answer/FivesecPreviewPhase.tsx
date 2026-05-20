import { motion } from "framer-motion";
import { adaptive } from "@toss/tds-colors";
import { Text } from "@toss/tds-mobile";
import { QuestionHeader } from "@/features/test-participate/ui/QuestionHeader";

interface Props {
  onStart: () => void;
}

export function FivesecPreviewPhase({ onStart }: Props) {
  return (
    <div className="flex flex-col flex-1 bg-white">
      <QuestionHeader
        categoryLabel="5초 테스트"
        title="5초간 아래 사진에 집중해주세요"
      />
      <div className="flex-1 px-5 pt-4">
        <motion.div
          role="button"
          onClick={onStart}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          style={{
            width: "100%",
            height: 212,
            backgroundColor: adaptive.grey100,
            borderRadius: 16,
            boxShadow: `inset 0 0 0 1px ${adaptive.greyOpacity100}`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text color={adaptive.blue500} typography="st8" fontWeight="semibold">
            눌러서 확인하기
          </Text>
        </motion.div>
      </div>
      <div className="h-18 shrink-0" aria-hidden={true} />
    </div>
  );
}
