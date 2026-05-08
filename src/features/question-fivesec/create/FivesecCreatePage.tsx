import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  ConfirmDialog,
  CTAButton,
  FixedBottomCTA,
  ListRow,
  Spacing,
  Switch,
  Text,
  TextArea,
  TextField,
} from "@toss/tds-mobile";
import { QuestionCreateTopSection } from "@/features/test-create/ui/QuestionCreateTopSection";
import { adaptive } from "@toss/tds-colors";
import type { MultipleChoiceItem } from "@/features/question-multiple/model/types";
import { useTestCreateForm } from "@/features/test-create/model/useTestCreateForm";
import { FivesecMultipleChoiceSection } from "./FivesecMultipleChoiceSection";
import { FivesecQuestionEditorOverlay } from "./FivesecQuestionEditorOverlay";

interface FivesecCreatePageProps {
  questionId: string;
  onClose: () => void;
}

export function FivesecCreatePage({
  questionId,
  onClose,
}: FivesecCreatePageProps) {
  const { updateQuestion, questions } = useTestCreateForm();
  const existing = questions.find((q) => q.id === questionId)?.data;

  const [title, setTitle] = useState(
    existing?.typeId === "fivesec" ? existing.title : "",
  );
  const [description, setDescription] = useState(
    existing?.typeId === "fivesec" ? existing.description : "",
  );
  const [imageUrl, setImageUrl] = useState(
    existing?.typeId === "fivesec" ? existing.imageUrl : "",
  );
  const duration = 5;
  const [answerExample, setAnswerExample] = useState(
    existing?.typeId === "fivesec" ? existing.answerExample : "",
  );
  const [isMultipleAnswer, setIsMultipleAnswer] = useState(
    existing?.typeId === "fivesec" ? existing.isMultipleAnswer : false,
  );
  const [isMultiSelectEnabled, setIsMultiSelectEnabled] = useState(
    existing?.typeId === "fivesec" ? existing.isMultiSelectEnabled : false,
  );
  const [choices, setChoices] = useState<MultipleChoiceItem[]>(
    existing?.typeId === "fivesec" ? existing.choices : [],
  );
  const [minSelectCount, setMinSelectCount] = useState(
    existing?.typeId === "fivesec" ? existing.minSelectCount : 1,
  );
  const [maxSelectCount, setMaxSelectCount] = useState(
    existing?.typeId === "fivesec" ? existing.maxSelectCount : 1,
  );
  const [isChoiceManageMode, setIsChoiceManageMode] = useState(false);
  const [draftChoices, setDraftChoices] = useState<MultipleChoiceItem[]>([]);
  const [isQuestionEditorOpen, setIsQuestionEditorOpen] = useState(false);
  const [isChoiceSheetOpen, setIsChoiceSheetOpen] = useState(false);
  const [isPhotoSheetOpen, setIsPhotoSheetOpen] = useState(false);
  const [editingChoiceId, setEditingChoiceId] = useState<string | null>(null);
  const [choiceNameDraft, setChoiceNameDraft] = useState("");
  const [pendingPhotoAction, setPendingPhotoAction] = useState<
    "camera" | "album" | null
  >(null);
  const [pendingFormatChange, setPendingFormatChange] = useState<
    boolean | null
  >(null);

  const visibleChoices = isChoiceManageMode ? draftChoices : choices;

  const setActiveChoices = (
    updater:
      | MultipleChoiceItem[]
      | ((prev: MultipleChoiceItem[]) => MultipleChoiceItem[]),
  ) => {
    if (isChoiceManageMode) setDraftChoices(updater);
    else setChoices(updater);
  };

  const handleToggleChoiceManageMode = () => {
    if (isChoiceManageMode) {
      setChoices(draftChoices);
      setIsChoiceManageMode(false);
      return;
    }
    setDraftChoices(choices);
    setIsChoiceManageMode(true);
  };

  const hasTitle = title.trim().length > 0;
  const editingChoice =
    choices.find((choice) => choice.id === editingChoiceId) ?? null;
  const isCompleteDisabled =
    !hasTitle || !imageUrl || (isMultipleAnswer && choices.length < 2);

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
          choice.id === editingChoice.id
            ? { ...choice, name: trimmedChoiceName }
            : choice,
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

  const applyFormatChange = (nextIsMultipleAnswer: boolean) => {
    setIsMultipleAnswer(nextIsMultipleAnswer);

    if (nextIsMultipleAnswer) {
      setAnswerExample("");
      return;
    }

    closeChoiceSheet();
    setIsChoiceManageMode(false);
    setDraftChoices([]);
    setChoices([]);
    setIsMultiSelectEnabled(false);
    setMinSelectCount(1);
    setMaxSelectCount(1);
  };

  const requestFormatChange = (nextIsMultipleAnswer: boolean) => {
    if (nextIsMultipleAnswer === isMultipleAnswer) return;
    setPendingFormatChange(nextIsMultipleAnswer);
  };

  const closeFormatChangeDialog = () => {
    setPendingFormatChange(null);
  };

  const confirmFormatChange = () => {
    if (pendingFormatChange === null) return;
    applyFormatChange(pendingFormatChange);
    setPendingFormatChange(null);
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
        questionTitle={title}
        questionDescription={description}
        onOpenQuestionEditor={() => setIsQuestionEditorOpen(true)}
        subtitle="5초 테스트"
      />

      {imageUrl ? (
        <div className="flex items-start justify-between gap-4 bg-white px-4 py-4">
          <Text
            display="block"
            color={adaptive.grey700}
            typography="t5"
            fontWeight="medium"
          >
            이미지
          </Text>
          <div
            className="relative h-24 w-42.5 overflow-hidden rounded-2xl"
            style={{ boxShadow: `inset 0 0 0 1px ${adaptive.greyOpacity100}` }}
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
              업로드
            </Button>
          }
          verticalPadding="large"
        />
      )}

      {isMultipleAnswer ? (
        <FivesecMultipleChoiceSection
          choices={visibleChoices}
          isChoiceManageMode={isChoiceManageMode}
          isMultiSelectEnabled={isMultiSelectEnabled}
          minSelectCount={minSelectCount}
          maxSelectCount={maxSelectCount}
          onOpenChoiceCreate={openChoiceCreateSheet}
          onOpenChoiceEdit={openChoiceEditSheet}
          onToggleChoiceManageMode={handleToggleChoiceManageMode}
          onDeleteChoice={(choiceId) =>
            setActiveChoices(visibleChoices.filter((c) => c.id !== choiceId))
          }
          onReorderChoices={(next) => setActiveChoices(next)}
          onToggleMultipleChoice={requestFormatChange}
          onToggleMultiSelect={(checked) => {
            setIsMultiSelectEnabled(checked);
            if (!checked) {
              setMinSelectCount(1);
              setMaxSelectCount(1);
            } else {
              const maxChoiceCount = Math.max(choices.length, 1);
              setMaxSelectCount((current) =>
                Math.min(Math.max(current, 2), maxChoiceCount),
              );
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
      ) : (
        <>
          <TextArea
            variant="box"
            hasError={false}
            label="답변 작성"
            labelOption="sustain"
            value={answerExample}
            placeholder="예시 입력창이에요"
            height={200}
            readOnly
          />

          <Spacing size={12} />
          <Border />
          <Spacing size={12} />

          <ListRow
            role="switch"
            aria-checked={isMultipleAnswer}
            horizontalPadding="small"
            contents={
              <ListRow.Texts
                type="1RowTypeA"
                top="객관식으로 답변 받기"
                topProps={{ color: adaptive.grey700 }}
              />
            }
            right={
              <Switch
                checked={isMultipleAnswer}
                onChange={(_, checked) => requestFormatChange(checked)}
              />
            }
            verticalPadding="large"
          />
        </>
      )}

      <FixedBottomCTA.Double
        leftButton={
          <CTAButton color="dark" variant="weak" onClick={onClose}>
            취소
          </CTAButton>
        }
        rightButton={
          <CTAButton
            disabled={isCompleteDisabled}
            onClick={() => {
              updateQuestion(questionId, {
                typeId: "fivesec",
                title,
                description,
                imageUrl,
                duration,
                answerExample,
                answerType: "multiple",
                isMultipleAnswer,
                isMultiSelectEnabled,
                choices,
                minSelectCount,
                maxSelectCount,
              });
              onClose();
            }}
          >
            완료하기
          </CTAButton>
        }
      />

      <AnimatePresence>
        {isQuestionEditorOpen && (
          <FivesecQuestionEditorOverlay
            key="question-editor"
            initialTitle={title}
            initialDescription={description}
            onClose={() => setIsQuestionEditorOpen(false)}
            onSave={({ title: t, description: d }) => {
              setTitle(t);
              setDescription(d);
              setIsQuestionEditorOpen(false);
            }}
          />
        )}
      </AnimatePresence>

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

      <ConfirmDialog
        open={pendingFormatChange !== null}
        title="테스트의 형식을 변경할까요?"
        description={
          pendingFormatChange
            ? "작성한 답변이 삭제돼요."
            : "작성한 선택지가 삭제돼요."
        }
        onClose={closeFormatChangeDialog}
        cancelButton={
          <ConfirmDialog.CancelButton
            size="xlarge"
            onClick={closeFormatChangeDialog}
          >
            취소
          </ConfirmDialog.CancelButton>
        }
        confirmButton={
          <ConfirmDialog.ConfirmButton
            size="xlarge"
            onClick={confirmFormatChange}
          >
            변경하기
          </ConfirmDialog.ConfirmButton>
        }
      />
    </motion.div>
  );
}
