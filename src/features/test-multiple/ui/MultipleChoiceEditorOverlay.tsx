import { useRef, useState } from "react";
import { motion } from "framer-motion";
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

interface MultipleChoiceEditorOverlayProps {
  initialChoiceName: string;
  initialImageUrl: string;
  onClose: () => void;
  onCreate: (values: { choiceName: string; imageUrl: string }) => void;
  submitLabel?: string;
}

export function MultipleChoiceEditorOverlay({
  initialChoiceName,
  initialImageUrl,
  onClose,
  onCreate,
  submitLabel = "만들기",
}: MultipleChoiceEditorOverlayProps) {
  const [choiceName, setChoiceName] = useState(initialChoiceName);
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const isCreateDisabled = choiceName.trim().length === 0;

  const handlePickImage = () => {
    inputRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const nextUrl = URL.createObjectURL(file);
    setImageUrl(nextUrl);
  };

  const handleRemoveImage = () => {
    setImageUrl("");
    if (inputRef.current) {
      inputRef.current.value = "";
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
            선택지 추가하기
          </Top.TitleParagraph>
        }
      />

      <main className="flex flex-1 flex-col bg-white">
        <TextField.Clearable
          variant="line"
          label="선택지명"
          labelOption="sustain"
          value={choiceName}
          placeholder="선택지명"
          autoFocus
          onChange={(e) => setChoiceName(e.target.value)}
          onClear={() => setChoiceName("")}
        />

        {imageUrl ? (
          <div className="flex items-start justify-between gap-4 bg-white px-4 py-4">
            <Text display="block" color={adaptive.grey700} typography="t5" fontWeight="medium">
              이미지
            </Text>
            <div
              className="relative h-24 w-[170px] overflow-hidden rounded-2xl"
              style={{
                boxShadow: `inset 0 0 0 1px ${adaptive.greyOpacity100}`,
              }}
            >
              <img src={imageUrl} alt="선택지 이미지 미리보기" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={handleRemoveImage}
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
              <Button color="dark" variant="weak" onClick={handlePickImage}>
                업로드
              </Button>
            }
            verticalPadding="large"
          />
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </main>

      <FixedBottomCTA.Double
        leftButton={
          <CTAButton color="dark" variant="weak" onClick={onClose}>
            취소
          </CTAButton>
        }
        rightButton={
          <CTAButton
            disabled={isCreateDisabled}
            onClick={() =>
              onCreate({
                choiceName: choiceName.trim(),
                imageUrl,
              })
            }
          >
            {submitLabel}
          </CTAButton>
        }
      />
    </motion.div>
  );
}
