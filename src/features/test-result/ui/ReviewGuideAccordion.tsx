import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ListRow, Post } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { REVIEW_POLICY_ITEMS } from "../model/constants";

export function ReviewGuideAccordion() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <ListRow
        left={<ListRow.AssetIcon size="xsmall" shape="original" name="icn-service-316-color" />}
        contents={
          <ListRow.Texts
            type="1RowTypeC"
            top="내부 검토 기준 확인하기"
            topProps={{ color: adaptive.grey800 }}
          />
        }
        verticalPadding="xlarge"
        arrowType={isExpanded ? "up" : "down"}
        onClick={() => setIsExpanded((prev) => !prev)}
      />
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div
              style={{
                width: "100%",
                backgroundColor:
                  "var(--token-tds-color-grey-background, var(--adaptiveGreyBackground, #f2f4f6))",
                paddingTop: 16,
                paddingBottom: 16,
                paddingLeft: 8,
                paddingRight: 8,
              }}
            >
              <Post.Paragraph paddingBottom={4} typography="t6">
                앱인토스 필수 정책에 따라 해당 테스트가 반려 되었어요.
              </Post.Paragraph>
              <Post.Paragraph paddingBottom={16} typography="t6">
                아래에 해당하는 서비스 테스트는 등록이 불가해요.
              </Post.Paragraph>

              {REVIEW_POLICY_ITEMS.map(({ title, desc }, i) => (
                <div key={i}>
                  <Post.Paragraph paddingBottom={2} typography="t6" fontWeight="bold">
                    {`${i + 1}. ${title}`}
                  </Post.Paragraph>
                  <Post.Paragraph paddingBottom={i < REVIEW_POLICY_ITEMS.length - 1 ? 12 : 0} typography="t6">
                    {desc}
                  </Post.Paragraph>
                </div>
              ))}

              <Post.Hr paddingBottom={0} />

              <Post.Ul paddingBottom={0} typography="t6">
                <Post.Li>
                  심사 결과는 내부 정책 및 리스크 검토 절차에 따라 변경될 수 있으며, 사전 등록을
                  보장하지 않아요.
                </Post.Li>
                <Post.Li>
                  서비스 특수성, 비즈니스 모델에 따라 사전 상담 또는 추가 설명 요청이 있을 수
                  있어요.
                </Post.Li>
                <Post.Li>
                  기존 회사 및 서비스를 단순 홍보하기 위해서 앱인토스 미니앱을 출시할 수 없어요.
                </Post.Li>
                <Post.Li>
                  위 내용 외에도 사용자 보호 및 신뢰성 확보를 위한 추가 기준이 적용될 수 있어요.
                </Post.Li>
              </Post.Ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
