import { useState } from "react";
import { motion } from "framer-motion";
import {
  openCamera,
  fetchAlbumPhotos,
  OpenCameraPermissionError,
  FetchAlbumPhotosPermissionError,
} from "@apps-in-toss/web-framework";
import {
  Asset,
  Border,
  BottomSheet,
  Button,
  CTAButton,
  FixedBottomCTA,
  ListRow,
  Spacing,
  Text,
  TextField,
} from "@toss/tds-mobile";
import { QuestionCreateTopSection } from "@/features/test-create/ui/QuestionCreateTopSection";
import { TesterPreviewListRow } from "@/features/test-create/ui/TesterPreviewListRow";
import { adaptive } from "@toss/tds-colors";
import type { MultipleChoiceItem } from "@/features/question-multiple/model/types";
import { FivesecAnswerPage } from "@/features/question-fivesec/answer/FivesecAnswerPage";
import { useTestCreateForm } from "@/features/test-create/model/useTestCreateForm";
import { FivesecMultipleChoiceSection } from "./FivesecMultipleChoiceSection";
import { AbRatioSelectSheet } from "@/features/question-ab/create/AbRatioSelectSheet";
import { FivesecAnswerTypeSheet } from "./FivesecAnswerTypeSheet";
import { RATIO_TO_CSS, type AbRatio } from "@/shared/constants/imageRatio";

interface FivesecCreatePageProps {
  questionId: string;
  onClose: () => void;
}

export function FivesecCreatePage({ questionId, onClose }: FivesecCreatePageProps) {
  const { updateQuestion, questions } = useTestCreateForm();
  const existing = questions.find((q) => q.id === questionId)?.data;
  const existingFivesec = existing?.typeId === "FIVE_SECOND" ? existing : null;

  const [title, setTitle] = useState(existingFivesec?.title ?? "");
  const [description, setDescription] = useState(existingFivesec?.description ?? "");
  const [isQuestionInputCompleted, setIsQuestionInputCompleted] = useState(
    (existingFivesec?.title ?? "").trim().length > 0,
  );
  const [imageUrl, setImageUrl] = useState(existingFivesec?.imageUrl ?? "");
  const [answerType, setAnswerType] = useState<"multiple" | "subjective">(
    existingFivesec?.answerType ?? "subjective",
  );

  const [isAnswerTypeSheetOpen, setIsAnswerTypeSheetOpen] = useState(false);
  const [isOtherInputEnabled, setIsOtherInputEnabled] = useState(
    existingFivesec?.isOtherInputEnabled ?? false,
  );
  const [isMultiSelectEnabled, setIsMultiSelectEnabled] = useState(
    existingFivesec?.isMultiSelectEnabled ?? false,
  );
  const [choices, setChoices] = useState<MultipleChoiceItem[]>(existingFivesec?.choices ?? []);
  const [minSelectCount, setMinSelectCount] = useState(existingFivesec?.minSelectCount ?? 1);
  const [maxSelectCount, setMaxSelectCount] = useState(existingFivesec?.maxSelectCount ?? 1);
  const [isChoiceSheetOpen, setIsChoiceSheetOpen] = useState(false);
  const [isPhotoSheetOpen, setIsPhotoSheetOpen] = useState(false);
  const [editingChoiceId, setEditingChoiceId] = useState<string | null>(null);
  const [choiceNameDraft, setChoiceNameDraft] = useState("");
  const [pendingPhotoAction, setPendingPhotoAction] = useState<"camera" | "album" | null>(null);
  const [ratio, setRatio] = useState<AbRatio>(existingFivesec?.ratio ?? "9:16");
  const [isRatioSheetOpen, setIsRatioSheetOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewAnswer, setPreviewAnswer] = useState<{
    type: "FIVE_SECOND";
    selectedIds: string[];
    text?: string;
  }>({ type: "FIVE_SECOND", selectedIds: [] });

  const hasTitle = title.trim().length > 0;
  const editingChoice = choices.find((choice) => choice.id === editingChoiceId) ?? null;
  const isCompleteDisabled =
    !hasTitle || !imageUrl || (answerType === "multiple" && choices.length < 2);

  const openChoiceCreateSheet = () => {
    setEditingChoiceId(null);
    setChoiceNameDraft("");
    setIsChoiceSheetOpen(true);
  };

  const openChoiceEditSheet = (choiceId: string) => {
    const targetChoice = choices.find((choice) => choice.id === choiceId);
    setEditingChoiceId(choiceId);
    setChoiceNameDraft(targetChoice?.name ?? "");
    setIsChoiceSheetOpen(true);
  };

  const closeChoiceSheet = () => {
    setIsChoiceSheetOpen(false);
    setEditingChoiceId(null);
    setChoiceNameDraft("");
  };

  const submitChoice = () => {
    const trimmedChoiceName = choiceNameDraft.trim();
    if (trimmedChoiceName.length === 0) return;

    if (editingChoice) {
      setChoices((prev) =>
        prev.map((choice) =>
          choice.id === editingChoice.id ? { ...choice, name: trimmedChoiceName } : choice,
        ),
      );
      closeChoiceSheet();
      return;
    }

    setChoices((prev) => {
      const nextChoices = [
        ...prev,
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          name: trimmedChoiceName,
          imageUrl: "",
        },
      ];
      const nextCount = nextChoices.length;
      setMinSelectCount((current) => Math.min(current, nextCount));
      setMaxSelectCount((current) => Math.min(Math.max(current, 1), nextCount));
      return nextChoices;
    });
    closeChoiceSheet();
  };

  const handleCamera = async () => {
    try {
      const response = await openCamera({ base64: true, maxWidth: 1280 });
      setImageUrl(`data:image/jpeg;base64,${response.dataUri}`);
    } catch (error) {
      if (error instanceof OpenCameraPermissionError) {
        await openCamera.openPermissionDialog();
      } else {
        console.error("[handleCamera] error:", error);
      }
    }
  };

  const handleAlbum = async () => {
    try {
      const response = await fetchAlbumPhotos({
        base64: true,
        maxWidth: 1280,
        maxCount: 1,
      });
      if (response[0]) {
        setImageUrl(`data:image/jpeg;base64,${response[0].dataUri}`);
      }
    } catch (error) {
      if (error instanceof FetchAlbumPhotosPermissionError) {
        await fetchAlbumPhotos.openPermissionDialog();
      } else {
        console.error("[handleAlbum] error:", error);
      }
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-y-auto bg-white pb-28"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <QuestionCreateTopSection
        questionType="5초 테스트"
        questionTitle={title}
        questionDescription={description}
        onChangeTitle={setTitle}
        onChangeDescription={setDescription}
        isInputCompleted={isQuestionInputCompleted}
        onConfirmInput={() => setIsQuestionInputCompleted(true)}
        onClose={onClose}
      />

      {isQuestionInputCompleted && (
        <>
          <TesterPreviewListRow onClick={() => setIsPreviewOpen(true)} />
          <ListRow
            as="button"
            className="w-full text-left"
            contents={
              <ListRow.Texts
                type="1RowTypeA"
                top="5초 테스트 이미지"
                topProps={{ color: adaptive.grey600 }}
              />
            }
            right={
              <ListRow.Texts
                type="Right1RowTypeA"
                top={`비율 ${ratio}`}
                topProps={{ color: adaptive.grey600 }}
              />
            }
            verticalPadding="xlarge"
            arrowType="down"
            withTouchEffect
            onClick={() => setIsRatioSheetOpen(true)}
          />
          {imageUrl ? (
            <div className="flex items-start justify-between gap-4 bg-white px-4 pb-4">
              <Text display="block" color={adaptive.grey700} typography="t5" fontWeight="medium">
                이미지
              </Text>
              <div
                className="relative overflow-hidden rounded-2xl"
                style={{
                  width: "10.625rem",
                  aspectRatio: RATIO_TO_CSS[ratio],
                  boxShadow: `inset 0 0 0 1px ${adaptive.greyOpacity100}`,
                }}
              >
                <img
                  src={imageUrl}
                  alt="질문 이미지 미리보기"
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImageUrl("")}
                  className="absolute right-1.5 top-1.5"
                  aria-label="이미지 삭제"
                >
                  <Asset.Icon
                    frameShape={Asset.frameShape.CircleXSmall}
                    backgroundColor={adaptive.greyOpacity600}
                    name="icon-sweetshop-x-white"
                    scale={0.66}
                    aria-hidden
                  />
                </button>
              </div>
            </div>
          ) : (
            <ListRow
              className=""
              contents={
                <ListRow.Texts
                  type="1RowTypeA"
                  top="이미지"
                  topProps={{ color: adaptive.grey700 }}
                />
              }
              right={
                <Button
                  size="small"
                  color="dark"
                  variant="weak"
                  onClick={() => setIsPhotoSheetOpen(true)}
                >
                  이미지 업로드
                </Button>
              }
              verticalPadding="large"
            />
          )}

          <Border />

          <div className="mt-3">
            <ListRow
              as="button"
              className="w-full text-left"
              contents={
                <ListRow.Texts
                  type="1RowTypeA"
                  top="답변 방식"
                  topProps={{ color: adaptive.grey700 }}
                />
              }
              right={
                <ListRow.Texts
                  type="Right1RowTypeA"
                  top={answerType === "multiple" ? "객관식" : "주관식"}
                  topProps={{ color: adaptive.grey700 }}
                />
              }
              verticalPadding="small"
              arrowType="down"
              withTouchEffect
              onClick={() => setIsAnswerTypeSheetOpen(true)}
            />
          </div>

          {answerType === "multiple" && (
            <FivesecMultipleChoiceSection
              choices={choices}
              isOtherInputEnabled={isOtherInputEnabled}
              isMultiSelectEnabled={isMultiSelectEnabled}
              minSelectCount={minSelectCount}
              maxSelectCount={maxSelectCount}
              onOpenChoiceCreate={openChoiceCreateSheet}
              onOpenChoiceEdit={openChoiceEditSheet}
              onDeleteChoice={(choiceId) =>
                setChoices((prev) => prev.filter((c) => c.id !== choiceId))
              }
              onReorderChoices={(next) => setChoices(next)}
              onToggleOtherInput={(checked) => setIsOtherInputEnabled(checked)}
              onToggleMultiSelect={(checked) => {
                setIsMultiSelectEnabled(checked);
                if (!checked) {
                  setMinSelectCount(1);
                  setMaxSelectCount(1);
                } else {
                  const maxChoiceCount = Math.max(choices.length, 1);
                  setMaxSelectCount((current) => Math.min(Math.max(current, 2), maxChoiceCount));
                }
              }}
              onChangeMinSelectCount={(value) => {
                setMinSelectCount(value);
                if (value > maxSelectCount) setMaxSelectCount(value);
              }}
              onChangeMaxSelectCount={(value) => {
                setMaxSelectCount(value);
                if (value < minSelectCount) setMinSelectCount(value);
              }}
            />
          )}

          <FixedBottomCTA.Double
            leftButton={
              <CTAButton color="dark" variant="weak" onClick={onClose}>
                닫기
              </CTAButton>
            }
            rightButton={
              <CTAButton
                disabled={isCompleteDisabled}
                onClick={() => {
                  updateQuestion(questionId, {
                    typeId: "FIVE_SECOND",
                    title,
                    description,
                    imageUrl,
                    answerExample: "",
                    answerType,
                    isMultipleAnswer: answerType === "multiple",
                    isOtherInputEnabled,
                    isMultiSelectEnabled,
                    choices,
                    minSelectCount,
                    maxSelectCount,
                    ratio,
                  });
                  onClose();
                }}
              >
                완료하기
              </CTAButton>
            }
          />
        </>
      )}

      {isPreviewOpen && (
        <motion.div
          className="fixed inset-0 z-60 flex flex-col overflow-y-auto bg-white pb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <FivesecAnswerPage
            question={{
              id: "preview",
              type: "FIVE_SECOND",
              data: {
                title,
                description,
                imageUrl,
                answerExample: "",
                answerType,
                isMultipleAnswer: answerType === "multiple",
                isOtherInputEnabled,
                isMultiSelectEnabled,
                choices: [
                  ...choices,
                  ...(isOtherInputEnabled
                    ? [{ id: "other-preview", name: "기타 (직접 입력)", imageUrl: "" }]
                    : []),
                ],
                minSelectCount,
                maxSelectCount,
                ratio,
              },
            }}
            answer={previewAnswer}
            onChange={setPreviewAnswer}
            onPrev={() => setIsPreviewOpen(false)}
            onGoNext={() => setIsPreviewOpen(false)}
            isFirst={false}
            isLast={true}
            prevLabel="닫기"
            isPreview={true}
          />
        </motion.div>
      )}

      <BottomSheet
        header={
          <BottomSheet.Header>
            {editingChoice ? "선택지명 수정하기" : "선택지 추가하기"}
          </BottomSheet.Header>
        }
        open={isChoiceSheetOpen}
        onClose={closeChoiceSheet}
        hasTextField
        cta={
          <BottomSheet.CTA
            color="primary"
            variant="fill"
            disabled={choiceNameDraft.trim().length === 0}
            onClick={submitChoice}
          >
            확인
          </BottomSheet.CTA>
        }
        ctaContentGap={0}
      >
        <TextField.Clearable
          variant="line"
          hasError={false}
          label="선택지명"
          value={choiceNameDraft}
          placeholder="선택지명"
          autoFocus
          onChange={(e) => setChoiceNameDraft(e.target.value)}
          onClear={() => setChoiceNameDraft("")}
        />
      </BottomSheet>

      <BottomSheet
        open={isPhotoSheetOpen}
        onClose={() => setIsPhotoSheetOpen(false)}
        onExited={() => {
          if (pendingPhotoAction === "camera") handleCamera();
          else if (pendingPhotoAction === "album") handleAlbum();
          setPendingPhotoAction(null);
        }}
      >
        <ListRow
          as="button"
          className="w-full"
          left={
            <Asset.Image
              frameShape={Asset.frameShape.CleanW24}
              backgroundColor="transparent"
              src="https://static.toss.im/2d-emojis/png/4x/u1F4F7.png"
              aria-hidden
              style={{ aspectRatio: "1/1" }}
            />
          }
          contents={<ListRow.Texts type="1RowTypeA" top="사진 촬영하기" />}
          verticalPadding="large"
          onClick={() => {
            setPendingPhotoAction("camera");
            setIsPhotoSheetOpen(false);
          }}
        />
        <ListRow
          as="button"
          className="w-full"
          left={
            <Asset.Icon
              frameShape={Asset.frameShape.CleanW24}
              backgroundColor="transparent"
              name="icon-picture"
              aria-hidden
              ratio="1/1"
            />
          }
          contents={<ListRow.Texts type="1RowTypeA" top="앨범에서 선택하기" />}
          verticalPadding="large"
          onClick={() => {
            setPendingPhotoAction("album");
            setIsPhotoSheetOpen(false);
          }}
        />
        <Spacing size={24} />
      </BottomSheet>

      <FivesecAnswerTypeSheet
        open={isAnswerTypeSheetOpen}
        answerType={answerType}
        onClose={() => setIsAnswerTypeSheetOpen(false)}
        onSelect={setAnswerType}
      />

      <AbRatioSelectSheet
        open={isRatioSheetOpen}
        selected={ratio}
        onClose={() => setIsRatioSheetOpen(false)}
        onSelect={setRatio}
      />
    </motion.div>
  );
}
