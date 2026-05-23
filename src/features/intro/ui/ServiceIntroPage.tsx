import { motion } from "framer-motion";
import { FixedBottomCTA } from "@toss/tds-mobile";
import heroImage from "@/assets/hero.png";

interface ServiceIntroPageProps {
  onStart: () => void;
}

export function ServiceIntroPage({ onStart }: ServiceIntroPageProps) {
  return (
    <div className="flex flex-col min-h-dvh bg-white">
      <div className="flex flex-col flex-1 items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col items-center text-center w-full"
        >
          <img
            src={heroImage}
            alt="MATE 서비스 이미지"
            className="w-52 h-52 object-contain mb-10"
          />

          <h1 className="text-[28px] font-bold text-[#191F28] mb-3">MATE</h1>

          <p className="text-[17px] text-[#6B7684] leading-relaxed mb-12">
            나만의 테스트를 만들고
            <br />
            친구들과 함께 즐겨보세요
          </p>

          <div className="flex flex-col gap-4 w-full">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                className="flex items-start gap-4 text-left px-4 py-4 rounded-2xl"
                style={{ backgroundColor: "var(--adaptiveCardBgGrey, #F2F4F6)" }}
              >
                <span className="text-2xl">{feature.emoji}</span>
                <div>
                  <p className="text-[15px] font-semibold text-[#191F28]">{feature.title}</p>
                  <p className="text-[13px] text-[#6B7684] mt-0.5">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <FixedBottomCTA onClick={onStart}>테스트 만들기 시작</FixedBottomCTA>
    </div>
  );
}

const FEATURES = [
  {
    emoji: "✏️",
    title: "간편한 테스트 제작",
    description: "이름, 소개, 카테고리, 이미지까지 단계별로 쉽게 만들어요",
  },
  {
    emoji: "🔗",
    title: "간편한 공유",
    description: "완성된 테스트를 링크 하나로 친구들과 공유할 수 있어요",
  },
  {
    emoji: "📊",
    title: "결과 확인",
    description: "친구들의 테스트 결과를 한눈에 확인해보세요",
  },
];
