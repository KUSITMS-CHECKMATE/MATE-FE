import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SegmentedControl,
  ListRow,
  Button,
  Asset,
  Text,
  Spacing,
  Top,
  List,
} from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { QuestionTypeSelectSheet } from "./QuestionTypeSelectSheet";
import { QuestionManageSheet } from "./QuestionManageSheet";
import {
  QUESTION_TYPES,
  CATEGORIES,
  type QuestionTypeId,
  type PendingQuestion,
} from "../model/types";
import { useTestCreateForm } from "../model/useTestCreateForm";

export type RegisterTab = "info" | "questions";

interface TestRegisterStepProps {
  activeTab: RegisterTab;
  onTabChange: (tab: RegisterTab) => void;
  onEnterQuestion: (question: { id: string; typeId: QuestionTypeId }) => void;
}

export function TestRegisterStep({
  activeTab,
  onTabChange,
  onEnterQuestion,
}: TestRegisterStepProps) {
  const form = useTestCreateForm();
  const [isQuestionTypeSheetOpen, setIsQuestionTypeSheetOpen] = useState(false);
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<
    QuestionTypeId[]
  >([]);
  const [isManageSheetOpen, setIsManageSheetOpen] = useState(false);
  const [pendingQuestions, setPendingQuestions] = useState<PendingQuestion[]>(
    [],
  );
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const hasQuestions = form.questions.length > 0;

  const selectedCategoryLabels = useMemo(() => {
    return form.categories
      .map((catId) => {
        const cat = CATEGORIES.find((c) => c.id === catId);
        return cat ? cat.label : "";
      })
      .filter(Boolean);
  }, [form.categories]);

  const toggleQuestionType = (id: QuestionTypeId) => {
    setSelectedQuestionTypes((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  };

  const closeQuestionTypeSheet = () => {
    setSelectedQuestionTypes([]);
    setIsQuestionTypeSheetOpen(false);
  };

  const handleConfirmQuestionTypes = () => {
    form.addQuestions(selectedQuestionTypes);
    setSelectedQuestionTypes([]);
    setIsQuestionTypeSheetOpen(false);
  };

  const openEditSheet = () => {
    setPendingQuestions([...form.questions]);
    setIsManageSheetOpen(true);
  };

  const closeManageSheet = () => {
    setPendingQuestions([]);
    setIsManageSheetOpen(false);
  };

  const handleSaveManage = () => {
    form.reorderQuestions(pendingQuestions);
    closeManageSheet();
  };

  return (
    <>
      <motion.div
        key="register"
        className="flex flex-col flex-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="pt-4">
          <SegmentedControl
            size="large"
            value={activeTab}
            onChange={(v) => onTabChange(v as RegisterTab)}
          >
            <SegmentedControl.Item value="info">
              테스트 정보
            </SegmentedControl.Item>
            <SegmentedControl.Item value="questions">
              질문 목록
            </SegmentedControl.Item>
          </SegmentedControl>
        </div>

        {activeTab === "questions" ? (
          <div className="flex flex-col flex-1 mt-6 mb-3">
            <ListRow
              as="button"
              className="text-left"
              style={{
                backgroundColor: "var(--adaptiveCardBgGrey)",
                margin: "0 20px",
              }}
              left={
                <ListRow.AssetIcon
                  shape="original"
                  name="icon-plus-grey-fill"
                  variant="fill"
                />
              }
              contents={
                <ListRow.Texts
                  type="1RowTypeA"
                  top={hasQuestions ? "추가하기" : "만들기"}
                  topProps={{ color: adaptive.grey700 }}
                />
              }
              verticalPadding="large"
              horizontalPadding="small"
              onClick={() => setIsQuestionTypeSheetOpen(true)}
            />

            {hasQuestions ? (
              <>
                {form.questions.map((q) => {
                  const type = QUESTION_TYPES.find((t) => t.id === q.typeId);
                  if (!type) return null;
                  const isFilled = !!q.data?.title?.trim();
                  return (
                    <ListRow
                      key={q.id}
                      style={{ margin: "0 4px" }}
                      left={
                        <ListRow.AssetIcon
                          size="xsmall"
                          shape="original"
                          name={type.iconName}
                        />
                      }
                      contents={
                        <ListRow.Texts
                          type="2RowTypeA"
                          top={isFilled ? q.data!.title : "미입력"}
                          topProps={{
                            color: adaptive.grey800,
                            fontWeight: "semibold",
                          }}
                          bottom={type.label}
                          bottomProps={{ color: adaptive.grey600 }}
                        />
                      }
                      right={
                        <Button
                          size="small"
                          variant={isFilled ? "weak" : "fill"}
                          color={isFilled ? "dark" : undefined}
                          onClick={() =>
                            onEnterQuestion({ id: q.id, typeId: q.typeId })
                          }
                        >
                          {isFilled ? "수정" : "입력"}
                        </Button>
                      }
                      verticalPadding="large"
                    />
                  );
                })}

                <div className="fixed bottom-32 right-5 z-10">
                  <button
                    type="button"
                    className="flex items-center h-12 bg-white px-3"
                    style={{
                      borderRadius: 25,
                      boxShadow:
                        "0px 20px 20px -16px #191F2911, 0px 40px 200px 0px #191F293f, inset 0 0 0 1px rgba(2,32,71,0.05)",
                    }}
                    onClick={openEditSheet}
                  >
                    <div className="flex items-center gap-1 h-8">
                      <Asset.Icon
                        frameShape={Asset.frameShape.CleanW24}
                        backgroundColor="transparent"
                        name="icon-setting-mono"
                        color={adaptive.grey600}
                        aria-hidden
                        ratio="1/1"
                      />
                      <Text
                        color={adaptive.grey800}
                        typography="t5"
                        fontWeight="medium"
                      >
                        편집하기
                      </Text>
                    </div>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center px-4">
                <p className="text-[17px] font-semibold text-[#191F28]">
                  등록한 질문이 없어요
                </p>
                <p className="mt-2 text-[15px] text-[#6B7684]">
                  질문을 등록하고 테스트를 구성해봐요
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col flex-1 pb-4">
            <Spacing size={16} />
            <ListRow
              style={{
                backgroundColor: "var(--adaptiveCardBgGrey)",
                backdropFilter: "blur(0px)",
                borderRadius: "999px",
                opacity: 1,
                margin: "0 20px",
              }}
              left={
                <ListRow.AssetIcon
                  name="icon-phone"
                  backgroundColor={adaptive.greyOpacity100}
                />
              }
              contents={
                <ListRow.Texts
                  type="1RowTypeB"
                  top="실제 테스터에게 보이는 화면이에요"
                  topProps={{ color: adaptive.grey700 }}
                />
              }
              horizontalPadding="small"
            />
            <Top
              title={
                <Top.TitleParagraph size={22} color={adaptive.grey900}>
                  {form.name || "메이트 사용성 테스트"}
                </Top.TitleParagraph>
              }
              subtitleBottom={
                <Top.SubtitleBadges
                  badges={
                    selectedCategoryLabels.length > 0
                      ? selectedCategoryLabels.map((label) => ({
                          text: label,
                          color: "elephant",
                          variant: "weak",
                        }))
                      : [
                          { text: "여행", color: "elephant", variant: "weak" },
                          { text: "운동", color: "elephant", variant: "weak" },
                        ]
                  }
                />
              }
              lower={
                <Top.LowerButton
                  color="primary"
                  size="small"
                  variant="weak"
                  display="inline"
                >
                  어떤 서비스인가요?
                </Top.LowerButton>
              }
            />
            <div
              className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory"
              style={{ gap: "12px", margin: "0 20px" }}
              onScroll={(e) => {
                const target = e.target as HTMLDivElement;
                const index = Math.round(
                  target.scrollLeft / target.clientWidth,
                );
                setActiveImageIndex(index);
              }}
            >
              {(form.images.length > 0
                ? form.images
                : [
                    "https://static.toss.im/appsintoss/33213/ac1b1d5e-c6d7-4943-9236-fcbd2bc825c0.png",
                  ]
              ).map((src, i) => (
                <div
                  key={i}
                  className="snap-start shrink-0 w-full"
                  style={{ aspectRatio: "16/9" }}
                >
                  <img
                    src={src}
                    aria-hidden={true}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: 16,
                      objectFit: "cover",
                    }}
                  />
                </div>
              ))}
            </div>
            <Spacing size={16} />
            <div className="flex justify-center gap-1.5">
              {Array.from({ length: Math.max(form.images.length, 1) }).map(
                (_, i) => (
                  <Asset.Icon
                    key={i}
                    frameShape={{ width: 12, height: 12 }}
                    backgroundColor="transparent"
                    name="icon-circle-16-mono"
                    color={
                      i === activeImageIndex
                        ? adaptive.greyOpacity500
                        : adaptive.greyOpacity300
                    }
                    aria-hidden={true}
                    ratio="1/1"
                  />
                ),
              )}
            </div>
            <Spacing size={20} />
            <List>
              <ListRow
                left={
                  <ListRow.AssetIcon
                    size="medium"
                    name="icon-coin-yellow"
                    backgroundColor={adaptive.yellow100}
                  />
                }
                contents={
                  <ListRow.Texts
                    type="2RowTypeF"
                    top="보상 머니"
                    topProps={{ color: adaptive.grey500 }}
                    bottom="1,500원"
                    bottomProps={{
                      color: adaptive.grey800,
                      fontWeight: "bold",
                    }}
                  />
                }
                verticalPadding="small"
                horizontalPadding="small"
              />
              <ListRow
                left={
                  <ListRow.AssetIcon
                    size="medium"
                    name="icon-document-teal"
                    backgroundColor={adaptive.green100}
                  />
                }
                contents={
                  <ListRow.Texts
                    type="2RowTypeF"
                    top="테스트 한줄 소개"
                    topProps={{ color: adaptive.grey500 }}
                    bottom={form.summary || "테스트 한 줄 소개 최대 60자"}
                    bottomProps={{
                      color: adaptive.grey700,
                      fontWeight: "medium",
                    }}
                  />
                }
                verticalPadding="small"
                horizontalPadding="small"
              />
            </List>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {isQuestionTypeSheetOpen && (
          <QuestionTypeSelectSheet
            selectedTypes={selectedQuestionTypes}
            onToggle={toggleQuestionType}
            onConfirm={handleConfirmQuestionTypes}
            onCancel={closeQuestionTypeSheet}
          />
        )}
        {isManageSheetOpen && (
          <QuestionManageSheet
            questions={pendingQuestions}
            onDelete={(id) =>
              setPendingQuestions((prev) => prev.filter((q) => q.id !== id))
            }
            onReorder={setPendingQuestions}
            onSave={handleSaveManage}
            onCancel={closeManageSheet}
          />
        )}
      </AnimatePresence>
    </>
  );
}
