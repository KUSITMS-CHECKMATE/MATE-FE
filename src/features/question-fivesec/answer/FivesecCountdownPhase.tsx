import { motion } from "framer-motion";
import { QuestionHeader } from "@/features/test-participate/ui/QuestionHeader";
import { RATIO_TO_CSS } from "@/features/question-ab/model/types";

interface Props {
  remaining: number;
  imageUrl: string;
  ratio: AbRatio;
  hideCountdown?: boolean;
}

export function FivesecCountdownPhase({ remaining, imageUrl, ratio, hideCountdown }: Props) {
  return (
    <motion.div
      className="flex flex-col flex-1 bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <QuestionHeader
        categoryLabel="5초 테스트"
        title="5초간 아래 사진에 집중해주세요"
      />
      <div className="flex-1 px-5 pt-4 flex justify-center">
        <div
          className="relative overflow-hidden rounded-2xl"
          style={{
            width: `min(100%, calc((100dvh - 200px) * ${RATIO_TO_CSS[ratio]}))`,
            aspectRatio: RATIO_TO_CSS[ratio],
            boxShadow: "inset 0 0 0 1px rgba(2,32,71,0.05)",
          }}
        >
          <img src={imageUrl} alt="5초 테스트 이미지" className="h-full w-full object-cover" />
          {!hideCountdown && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
            >
              <span className="text-5xl font-bold text-white">{remaining}</span>
            </div>
          )}
        </div>
      </div>
      <div className="h-18 shrink-0" aria-hidden={true} />
    </motion.div>
  );
}
