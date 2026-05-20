import { motion } from "framer-motion";
import { QuestionHeader } from "@/features/test-participate/ui/QuestionHeader";

interface Props {
  remaining: number;
}

export function FivesecCountdownPhase({ remaining }: Props) {
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
      <div className="flex-1 px-5 pt-4">
        <div className="relative w-full h-53 rounded-2xl bg-pink-200 shadow-[inset_0_0_0_1px_rgba(2,32,71,0.05)] flex items-center justify-center">
          <span className="text-5xl font-bold text-white">{remaining}</span>
        </div>
      </div>
      <div className="h-18 shrink-0" aria-hidden={true} />
    </motion.div>
  );
}
