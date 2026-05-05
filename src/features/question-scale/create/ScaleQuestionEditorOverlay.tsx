import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { openCamera, fetchAlbumPhotos, OpenCameraPermissionError, FetchAlbumPhotosPermissionError } from "@apps-in-toss/web-framework";
import {
  Asset,
  Button,
  CTAButton,
  FixedBottomCTA,
  ListRow,
  Paragraph,
  Text,
  TextField,
  Top,
} from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { PhotoSelectSheet } from "@/features/test-create/ui/PhotoSelectSheet";

interface ScaleQuestionEditorOverlayProps {
  initialTitle: string;
  initialDescription: string;
  initialImageUrl?: string;
  onClose: () => void;
  onSave: (values: { title: string; description: string; imageUrl: string }) => void;
}

export function ScaleQuestionEditorOverlay({
  initialTitle,
  initialDescription,
  initialImageUrl = "",
  onClose,
  onSave,
}: ScaleQuestionEditorOverlayProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [isPhotoSheetOpen, setIsPhotoSheetOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isSaveDisabled = title.trim().length === 0;

  const handleFocus = () => {
    if (blurTimer.current) clearTimeout(blurTimer.current);
    setIsFocused(true);
  };

  const handleBlur = () => {
    blurTimer.current = setTimeout(() => setIsFocused(false), 150);
  };

  const dismissKeyboard = () => {
    if (blurTimer.current) clearTimeout(blurTimer.current);
    setIsFocused(false);
    (document.activeElement as HTMLElement)?.blur();
  };

  const handleCamera = async () => {
    try {
      const response = await openCamera({ base64: true, maxWidth: 1280 });
      setImageUrl(`data:image/jpeg;base64,${response.dataUri}`);
    } catch (error) {
      if (error instanceof OpenCameraPermissionError) {
        await openCamera.openPermissionDialog();
      } else {
        console.error("[ScaleQuestionEditorOverlay handleCamera]", error);
      }
    }
  };

  const handleAlbum = async () => {
    try {
      const response = await fetchAlbumPhotos({ base64: true, maxWidth: 1280, maxCount: 1 });
      if (response[0]) {
        setImageUrl(`data:image/jpeg;base64,${response[0].dataUri}`);
      }
    } catch (error) {
      if (error instanceof FetchAlbumPhotosPermissionError) {
        await fetchAlbumPhotos.openPermissionDialog();
      } else {
        console.error("[ScaleQuestionEditorOverlay handleAlbum]", error);
      }
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Top
        title={
          <Top.TitleParagraph size={22} color={adaptive.grey900}>
            질문 입력하기
          </Top.TitleParagraph>
        }
      />

      <main className="flex flex-1 flex-col bg-white">
        <TextField.Clearable
          variant="line"
          label="질문 제목"
          labelOption="sustain"
          value={title}
          placeholder="질문 제목"
          autoFocus
          enterKeyHint="done"
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={(e) => setTitle(e.target.value)}
          onClear={() => setTitle("")}
        />
        <TextField.Clearable
          variant="line"
          label="설명"
          labelOption="sustain"
          value={description}
          placeholder="설명"
          prefix="(선택)"
          enterKeyHint="done"
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={(e) => setDescription(e.target.value)}
          onClear={() => setDescription("")}
        />

        {imageUrl.trim().length > 0 ? (
          <div className="flex items-start justify-between gap-4 bg-white px-4 py-4">
            <Text display="block" color={adaptive.grey700} typography="t5" fontWeight="medium">
              이미지
            </Text>
            <div
              className="relative h-24 w-[170px] overflow-hidden rounded-2xl"
              style={{ boxShadow: `inset 0 0 0 1px ${adaptive.greyOpacity100}` }}
            >
              <img src={imageUrl} alt="질문 이미지 미리보기" className="h-full w-full object-cover" />
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
            contents={
              <ListRow.Texts
                type="1RowTypeA"
                top={
                  <Paragraph.Text>
                    <span>
                      이미지
                      <span style={{ color: adaptive.grey500 }}>(선택)</span>
                    </span>
                  </Paragraph.Text>
                }
                topProps={{ color: adaptive.grey700 }}
              />
            }
            right={
              <Button size="small" color="dark" variant="weak" onClick={() => setIsPhotoSheetOpen(true)}>
                업로드
              </Button>
            }
            verticalPadding="large"
          />
        )}
      </main>

      <PhotoSelectSheet open={isPhotoSheetOpen} onClose={() => setIsPhotoSheetOpen(false)} onCamera={handleCamera} onAlbum={handleAlbum} />

      <AnimatePresence mode="wait">
        {isFocused ? (
          <motion.div key="confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.1 }}>
            <FixedBottomCTA fixedAboveKeyboard onClick={dismissKeyboard}>
              확인
            </FixedBottomCTA>
          </motion.div>
        ) : (
          <motion.div key="double" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.1 }}>
            <FixedBottomCTA.Double
              leftButton={
                <CTAButton color="dark" variant="weak" onClick={onClose}>
                  취소
                </CTAButton>
              }
              rightButton={
                <CTAButton
                  disabled={isSaveDisabled}
                  onClick={() =>
                    onSave({
                      title: title.trim(),
                      description: description.trim(),
                      imageUrl: imageUrl.trim(),
                    })
                  }
                >
                  저장하기
                </CTAButton>
              }
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
