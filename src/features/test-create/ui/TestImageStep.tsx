import { useState, useEffect } from "react";
import { Top, Asset, Text, Badge, BottomSheet, ListRow, Checkbox } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { openCamera, fetchAlbumPhotos, OpenCameraPermissionError, FetchAlbumPhotosPermissionError } from "@apps-in-toss/web-framework";
import { DndContext, PointerSensor, useSensor, useSensors, closestCenter, DragOverlay, type DragEndEvent, type Modifier } from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PhotoSelectSheet } from "./PhotoSelectSheet";
import { useTestCreateForm } from "../model/useTestCreateForm";

const MAX_IMAGES = 10;
const PREVIEW_SURFACE = "var(--token-tds-color-white, var(--adaptiveBackground, #ffffff))";

const restrictToHorizontalAxis: Modifier = ({ transform }) => ({ ...transform, y: 0 });

interface TestImageStepProps {
  onHasImagesChange?: (hasImages: boolean) => void;
  title?: string;
}

interface SortableImageItemProps {
  uri: string;
  index: number;
  onPreview: (index: number) => void;
  onRemove: (index: number) => void;
}

function SortableImageItem({ uri, index, onPreview, onRemove }: SortableImageItemProps) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({ id: uri });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
        touchAction: "manipulation",
        position: "relative",
        width: 88,
        height: 88,
        flexShrink: 0,
        borderRadius: 16,
      }}
      {...attributes}
      {...listeners}
    >
      <button
        type="button"
        className="block h-full w-full cursor-pointer border-0 bg-transparent p-0"
        onClick={() => onPreview(index)}
        aria-label={`이미지 ${index + 1} 미리보기`}
      >
        <div style={{ width: "100%", height: "100%", borderRadius: 16, overflow: "hidden" }}>
          <img
            src={uri}
            alt={`선택된 이미지 ${index + 1}`}
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </button>
      <div
        style={{
          position: "absolute",
          top: 6,
          left: 6,
          right: 6,
          bottom: 6,
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "flex-start",
          pointerEvents: "none",
        }}
      >
        {index === 0 && (
          <div style={{ position: "absolute", bottom: 0, left: 0 }}>
            <Badge size="small" variant="fill" color="elephant">
              대표
            </Badge>
          </div>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(index);
          }}
          style={{
            display: "flex",
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            pointerEvents: "auto",
          }}
          aria-label={`이미지 ${index + 1} 삭제`}
        >
          <Asset.Icon
            frameShape={Asset.frameShape.CircleXSmall}
            backgroundColor={adaptive.greyOpacity600}
            name="icon-sweetshop-x-white"
            scale={0.66}
            aria-hidden={true}
          />
        </button>
      </div>
    </div>
  );
}

export function TestImageStep({ onHasImagesChange, title = "테스트를 나타낼 수 있는 이미지를 첨부해주세요" }: TestImageStepProps) {
  const form = useTestCreateForm();
  const imageUris = form.images;
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [activeUri, setActiveUri] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { delay: 250, tolerance: 5 } }));

  useEffect(() => {
    if (!activeUri) return;
    const preventDefault = (e: TouchEvent) => e.preventDefault();
    document.addEventListener("touchmove", preventDefault, { passive: false });
    return () => document.removeEventListener("touchmove", preventDefault);
  }, [activeUri]);

  useEffect(() => {
    onHasImagesChange?.(imageUris.length > 0);
    if (typeof window !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__INJECT_MOCK_IMAGE__ = () => {
        form.setImages(["data:image/png;base64,iVBORw0KGgo="]);
      };
    }
  }, [imageUris.length, onHasImagesChange, form]);

  const addImages = (uris: string[]) => {
    const remaining = MAX_IMAGES - form.images.length;
    form.setImages([...form.images, ...uris.slice(0, remaining)]);
  };

  const removeImage = (index: number) => {
    form.setImages(form.images.filter((_, i) => i !== index));
    setPreviewIndex((prev) => {
      if (prev === null) return null;
      if (prev === index) return null;
      if (prev > index) return prev - 1;
      return prev;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveUri(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = imageUris.indexOf(active.id as string);
    const newIndex = imageUris.indexOf(over.id as string);
    if (oldIndex === -1 || newIndex === -1) return;
    form.setImages(arrayMove(imageUris, oldIndex, newIndex));
  };

  const previewUri = previewIndex !== null ? imageUris[previewIndex] : null;
  const isPreviewRepresentative = previewIndex !== null && previewIndex === 0;

  const setPreviewedImageAsRepresentative = () => {
    if (previewIndex === null || previewIndex === 0) return;
    const next = [...form.images];
    const [item] = next.splice(previewIndex, 1);
    next.unshift(item);
    form.setImages(next);
    setPreviewIndex(0);
  };

  const handleCamera = async () => {
    try {
      const response = await openCamera({ base64: true, maxWidth: 1280 });
      addImages([`data:image/jpeg;base64,${response.dataUri}`]);
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
      const remaining = MAX_IMAGES - imageUris.length;
      if (remaining <= 0) return;
      const response = await fetchAlbumPhotos({ base64: true, maxWidth: 1280, maxCount: remaining });
      addImages(response.map((img) => `data:image/jpeg;base64,${img.dataUri}`));
    } catch (error) {
      if (error instanceof FetchAlbumPhotosPermissionError) {
        await fetchAlbumPhotos.openPermissionDialog();
      } else {
        console.error("[handleAlbum] error:", error);
      }
    }
  };

  return (
    <>
      <div>
        <Top
          title={
            <Top.TitleParagraph size={22} color={adaptive.grey900}>
              {title}
            </Top.TitleParagraph>
          }
          subtitleBottom={
            <Top.SubtitleParagraph size={15} color={adaptive.blue500}>
              16:9 비율이 최적이에요.
            </Top.SubtitleParagraph>
          }
        />

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToHorizontalAxis]}
          onDragStart={({ active }) => setActiveUri(active.id as string)}
          onDragEnd={handleDragEnd}
          onDragCancel={() => setActiveUri(null)}
        >
          <div
            className="px-5 flex flex-nowrap gap-2 scrollbar-hide"
            style={{ overflowX: activeUri ? "hidden" : "auto" }}
          >
            {imageUris.length < MAX_IMAGES && (
              <button
                type="button"
                style={{
                  width: 88,
                  height: 88,
                  backgroundColor: "var(--token-tds-color-grey-100, var(--adaptiveGrey100, #f2f4f6))",
                  borderRadius: 16,
                  padding: 16,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  flexShrink: 0,
                }}
                onClick={() => setIsSheetOpen(true)}
              >
                <Asset.Icon
                  frameShape={Asset.frameShape.CleanW24}
                  backgroundColor="transparent"
                  name="icon-camera-mono"
                  color={adaptive.grey600}
                  aria-hidden={true}
                  ratio="1/1"
                />
                <div style={{ display: "flex" }}>
                  <Text color={adaptive.grey500} typography="t7" fontWeight="medium">
                    {imageUris.length}
                  </Text>
                  <Text color={adaptive.grey500} typography="t7" fontWeight="medium">
                    /{MAX_IMAGES}
                  </Text>
                </div>
              </button>
            )}

            <SortableContext items={imageUris} strategy={horizontalListSortingStrategy}>
              {imageUris.map((uri, index) => (
                <SortableImageItem
                  key={uri}
                  uri={uri}
                  index={index}
                  onPreview={setPreviewIndex}
                  onRemove={removeImage}
                />
              ))}
            </SortableContext>
          </div>

          <DragOverlay>
            {activeUri ? (
              <div style={{ width: 88, height: 88, borderRadius: 16, overflow: "hidden", opacity: 0.9 }}>
                <img
                  src={activeUri}
                  alt=""
                  draggable={false}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      <PhotoSelectSheet
        open={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onCamera={handleCamera}
        onAlbum={handleAlbum}
      />

      <BottomSheet
        header={<BottomSheet.Header>이미지 미리보기</BottomSheet.Header>}
        headerDescription={
          <BottomSheet.HeaderDescription>테스트 상세 화면에 이렇게 보여요</BottomSheet.HeaderDescription>
        }
        open={previewIndex !== null}
        onClose={() => setPreviewIndex(null)}
        cta={
          <BottomSheet.CTA color="dark" variant="weak" disabled={false} onClick={() => setPreviewIndex(null)}>
            닫기
          </BottomSheet.CTA>
        }
      >
        {previewUri !== null && (
          <>
            <div
              style={{
                width: "100%",
                maxWidth: 355,
                margin: "0 auto",
                backgroundColor: PREVIEW_SURFACE,
                padding: 12,
                boxSizing: "border-box",
              }}
            >
              <div style={{ width: "100%", backgroundColor: PREVIEW_SURFACE }}>
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "16 / 9",
                    borderRadius: 16,
                    overflow: "hidden",
                    backgroundColor: adaptive.grey100,
                  }}
                >
                  <img
                    src={previewUri}
                    alt=""
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              </div>
            </div>
            <ListRow
              as="button"
              className="w-full text-left"
              role="checkbox"
              aria-checked={isPreviewRepresentative}
              onClick={() => {
                if (!isPreviewRepresentative) setPreviewedImageAsRepresentative();
              }}
              contents={
                <ListRow.Texts
                  type="1RowTypeA"
                  top="대표 이미지로 설정"
                  topProps={{ color: adaptive.grey700 }}
                />
              }
              right={<Checkbox.Line size={24} checked={isPreviewRepresentative} readOnly />}
              verticalPadding="large"
            />
          </>
        )}
      </BottomSheet>
    </>
  );
}
