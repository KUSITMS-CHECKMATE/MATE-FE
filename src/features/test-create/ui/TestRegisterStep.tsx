import { useState } from "react";
import { motion } from "framer-motion";
import { SegmentedControl, ListRow } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";

type RegisterTab = "info" | "questions";

export function TestRegisterStep() {
  const [activeTab, setActiveTab] = useState<RegisterTab>("questions");

  return (
    <motion.div key="register" className="flex flex-col flex-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
      <div className="pt-4">
        <SegmentedControl size="large" value={activeTab} onChange={(v) => setActiveTab(v as RegisterTab)}>
          <SegmentedControl.Item value="info">테스트 정보</SegmentedControl.Item>
          <SegmentedControl.Item value="questions">질문 목록</SegmentedControl.Item>
        </SegmentedControl>
      </div>

      {activeTab === "questions" ? (
        <div className="flex flex-col flex-1 mt-6 mb-3 mx-4">
          <ListRow
            as="button"
            className="text-left"
            style={{ backgroundColor: "var(--adaptiveCardBgGrey)" }}
            left={<ListRow.AssetIcon shape="original" name="icon-plus-grey-fill" variant="fill" />}
            contents={<ListRow.Texts type="1RowTypeA" top="만들기" topProps={{ color: adaptive.grey700 }} />}
            verticalPadding="large"
            horizontalPadding="small"
            onClick={() => {
              // TODO: 질문 등록 단계 구현
            }}
          />
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <p className="text-[17px] font-semibold text-[#191F28]">등록한 질문이 없어요</p>
            <p className="mt-2 text-[15px] text-[#6B7684]">질문을 등록하고 테스트를 구성해봐요</p>
          </div>
        </div>
      ) : (
        <div className="flex-1" />
      )}
    </motion.div>
  );
}
