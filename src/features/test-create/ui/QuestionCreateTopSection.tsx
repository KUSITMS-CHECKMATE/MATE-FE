import { useState, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Asset, Border, CTAButton, FixedBottomCTA, List, ListHeader, ListRow, Spacing, TextField } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { QuestionEditSheet } from "./QuestionEditSheet";
import { useFocusState, useEditSheet } from "./useQuestionCreateTopSectionHooks";

// ── Sub-components ─────────────────────────────────────────

interface ClickableTopRowProps {
  label: string;
  text: string;
  placeholder: string;
  onClick: () => void;
}

function ClickableTopRow({ label, text, placeholder, onClick }: ClickableTopRowProps) {
  const hasText = text.trim().length > 0;
  return (
    <ListRow
      onClick={onClick}
      contents={
        <ListRow.Texts
          type="2RowTypeD"
          top={label}
          topProps={{ color: adaptive.grey600 }}
          bottom={hasText ? text : placeholder}
          bottomProps={{
            color: hasText ? adaptive.grey800 : adaptive.grey400,
            fontWeight: "bold",
          }}
        />
      }
      right={<Asset.Icon name="icon-pencil-18px-mono" color={adaptive.grey400} />}
      verticalPadding="large"
    />
  );
}

interface PhaseBottomCTAProps {
  isFocused: boolean;
  focusConfirmKey: string;
  onFocusConfirm: () => void;
  onClose: () => void;
  onInputComplete: () => void;
  isInputCompleteDisabled: boolean;
}

function PhaseBottomCTA({
  isFocused,
  focusConfirmKey,
  onFocusConfirm,
  onClose,
  onInputComplete,
  isInputCompleteDisabled,
}: PhaseBottomCTAProps) {
  return (
    <AnimatePresence mode="wait">
      {isFocused ? (
        <motion.div key={focusConfirmKey} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.1 }}>
          <FixedBottomCTA fixedAboveKeyboard onClick={onFocusConfirm}>
            확인
          </FixedBottomCTA>
        </motion.div>
      ) : (
        <motion.div key="input-complete" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.1 }}>
          <FixedBottomCTA.Double
            leftButton={
              <CTAButton color="dark" variant="weak" onClick={onClose}>
                닫기
              </CTAButton>
            }
            rightButton={
              <CTAButton disabled={isInputCompleteDisabled} onClick={onInputComplete}>
                입력 완료
              </CTAButton>
            }
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Main component ─────────────────────────────────────────

interface QuestionCreateTopSectionProps {
  questionType: string;
  questionTitle: string;
  questionDescription: string;
  onChangeTitle: (title: string) => void;
  onChangeDescription: (description: string) => void;
  isInputCompleted: boolean;
  onConfirmInput: () => void;
  onClose: () => void;
  titlePlaceholder?: string;
  imageSectionContent?: ReactNode;
  imageUploadSection?: ReactNode;
}

export function QuestionCreateTopSection({
  questionType,
  questionTitle,
  questionDescription,
  onChangeTitle,
  onChangeDescription,
  isInputCompleted,
  onConfirmInput,
  onClose,
  titlePlaceholder,
  imageSectionContent,
  imageUploadSection,
}: QuestionCreateTopSectionProps) {
  const placeholder = titlePlaceholder ?? `${questionType} 질문을 입력해주세요`;

  const [phase, setPhase] = useState<"title" | "detail">(questionTitle.trim().length > 0 ? "detail" : "title");
  const [isEditing, setIsEditing] = useState(false);

  const titleFocus = useFocusState();
  const descFocus = useFocusState();
  const sheet = useEditSheet(questionType, placeholder);

  useEffect(() => {
    if (!isInputCompleted && phase === "title" && !titleFocus.isFocused && questionTitle.trim().length > 0) {
      const timer = setTimeout(() => setPhase("detail"), 150);
      return () => clearTimeout(timer);
    }
  }, [isInputCompleted, phase, titleFocus.isFocused, questionTitle]);

  const handleConfirmTitle = () => {
    titleFocus.blur();
    if (questionTitle.trim().length > 0) setPhase("detail");
  };

  const handleConfirmSheet = () => {
    const trimmed = sheet.draft.trim();
    if (sheet.editingField === "title" && trimmed) onChangeTitle(trimmed);
    else if (sheet.editingField === "description") onChangeDescription(trimmed);
    sheet.close();
  };

  const editSheet = (
    <QuestionEditSheet
      open={sheet.editingField !== null}
      draft={sheet.draft}
      fieldVisible={sheet.fieldVisible}
      config={sheet.config}
      confirmDisabled={sheet.confirmDisabled}
      onClose={sheet.close}
      onConfirm={handleConfirmSheet}
      onDraftChange={sheet.setDraft}
    />
  );

  // ── Completed Mode ──
  if (isInputCompleted) {
    if (isEditing) {
      return (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-white pb-28">
          <ClickableTopRow label={`${questionType} 질문`} text={questionTitle} placeholder={placeholder} onClick={() => sheet.open("title", questionTitle)} />
          <ClickableTopRow label="(선택) 추가 설명" text={questionDescription} placeholder="추가 설명을 입력해주세요" onClick={() => sheet.open("description", questionDescription)} />
          {imageUploadSection}
          <FixedBottomCTA.Double
            leftButton={
              <CTAButton color="dark" variant="weak" onClick={() => setIsEditing(false)}>
                닫기
              </CTAButton>
            }
            rightButton={<CTAButton onClick={() => setIsEditing(false)}>입력 완료</CTAButton>}
          />
          {editSheet}
        </div>
      );
    }

    const hasDescription = questionDescription.trim().length > 0;
    return (
      <>
        <List>
          <ListHeader
            descriptionPosition="bottom"
            rightAlignment="center"
            titleWidthRatio={0.6}
            title={
              <ListHeader.TitleParagraph typography="t5" fontWeight="medium" color={adaptive.grey600}>
                {questionType}
              </ListHeader.TitleParagraph>
            }
          />
          <ListRow
            style={{ paddingBottom: 16 }}
            contents={
              hasDescription ? (
                <ListRow.Texts type="2RowTypeC" top={questionTitle} topProps={{ color: adaptive.grey800, fontWeight: "bold" }} bottom={questionDescription} bottomProps={{ color: adaptive.grey500 }} />
              ) : (
                <ListRow.Texts type="1RowTypeA" top={questionTitle} topProps={{ color: adaptive.grey800, fontWeight: "bold" }} />
              )
            }
            right={
              <button type="button" onClick={() => setIsEditing(true)}>
                <Asset.Icon name="icon-pencil-18px-mono" color={adaptive.grey400} />
              </button>
            }
          />
          {imageSectionContent ?? <Border variant="height16" />}
        </List>
      </>
    );
  }

  // ── Input Phase ──
  const isCompleteDisabled = questionTitle.trim().length === 0;

  return (
    <>
      {phase === "title" ? (
        <>
          <Spacing size={12} />
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
            <TextField.Clearable
              variant="line"
              label="어떻게 질문할까요?"
              labelOption="sustain"
              value={questionTitle}
              placeholder={placeholder}
              maxLength={34}
              autoFocus
              onChange={(e) => onChangeTitle(e.target.value.slice(0, 34))}
              onClear={() => onChangeTitle("")}
              onFocus={titleFocus.onFocus}
              onBlur={titleFocus.onBlur}
            />
          </motion.div>
          <PhaseBottomCTA
            isFocused={titleFocus.isFocused}
            focusConfirmKey="confirm-title"
            onFocusConfirm={handleConfirmTitle}
            onClose={onClose}
            onInputComplete={onConfirmInput}
            isInputCompleteDisabled={isCompleteDisabled}
          />
        </>
      ) : (
        <>
          <ClickableTopRow label={`${questionType} 질문`} text={questionTitle} placeholder={placeholder} onClick={() => sheet.open("title", questionTitle)} />
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
            <TextField.Clearable
              variant="line"
              label="(선택) 추가 설명을 할까요?"
              labelOption="sustain"
              value={questionDescription}
              placeholder="추가 설명을 입력해주세요"
              maxLength={55}
              onChange={(e) => onChangeDescription(e.target.value.slice(0, 55))}
              onClear={() => onChangeDescription("")}
              onFocus={descFocus.onFocus}
              onBlur={descFocus.onBlur}
            />
          </motion.div>
          {imageUploadSection}
          <PhaseBottomCTA
            isFocused={descFocus.isFocused}
            focusConfirmKey="confirm-description"
            onFocusConfirm={descFocus.blur}
            onClose={onClose}
            onInputComplete={onConfirmInput}
            isInputCompleteDisabled={isCompleteDisabled}
          />
          {editSheet}
        </>
      )}
    </>
  );
}
