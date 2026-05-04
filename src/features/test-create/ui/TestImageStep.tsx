import { useState, useEffect, useRef } from "react";
import { Top, Asset, Text, Badge, BottomSheet, ListRow, Checkbox } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { openCamera, fetchAlbumPhotos, OpenCameraPermissionError, FetchAlbumPhotosPermissionError } from "@apps-in-toss/web-framework";
import { DndContext, DragOverlay, TouchSensor, useSensor, useSensors, closestCenter, type DragStartEvent, type DragEndEvent, type Modifier } from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PhotoSelectSheet } from "./PhotoSelectSheet";
import { useTestCreateForm } from "../model/useTestCreateForm";

const MAX_IMAGES = 10;

const PREVIEW_SURFACE = "var(--token-tds-color-white, var(--adaptiveBackground, #ffffff))";

const restrictToHorizontalAxis: Modifier = ({ transform }) => ({ ...transform, y: 0 });

const getImageSortableIds = (uris: string[]) =>
  uris.map((_, index) => `image-${index}`);

interface TestImageStepProps {
  onHasImagesChange?: (hasImages: boolean) => void;
  title?: string;
}

interface SortableImageItemProps {
  id: string;
  uri: string;
  index: number;
  onPreview: (index: number) => void;
  onRemove: (index: number) => void;
}

function SortableImageItem({ id, uri, index, onPreview, onRemove }: SortableImageItemProps) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      data-drag-item
      onContextMenu={(e) => e.preventDefault()}
      style={{
        position: "relative",
        width: 88,
        height: 88,
        flexShrink: 0,
        borderRadius: 16,
        opacity: isDragging ? 0 : 1,
        transform: CSS.Transform.toString(transform),
        transition,
      }}
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
      {!isDragging && (
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
            onTouchStart={(e) => e.stopPropagation()}
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
      )}
    </div>
  );
}

export function TestImageStep({ onHasImagesChange, title = "테스트를 나타낼 수 있는 이미지를 첨부해주세요" }: TestImageStepProps) {
  const form = useTestCreateForm();
  const imageUris = form.images;
  const imageListRef = useRef<HTMLDivElement | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: { delay: 500, tolerance: 8 },
    })
  );

  useEffect(() => {
    onHasImagesChange?.(imageUris.length > 0);
    // For E2E testing
    if (typeof window !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__INJECT_MOCK_IMAGE__ = () => {
        form.setImages(["data:image/png;base64,iVBORw0KGgo="]);
      };
    }
  }, [imageUris.length, onHasImagesChange, form]);

  const preserveImageListScroll = (scrollLeft: number | undefined) => {
    if (scrollLeft === undefined) return;

    requestAnimationFrame(() => {
      if (imageListRef.current !== null) {
        imageListRef.current.scrollLeft = scrollLeft;
      }
    });
  };

  const addImages = (uris: string[]) => {
    const remaining = MAX_IMAGES - form.images.length;
    const imagesToAdd = uris.slice(0, remaining);
    if (imagesToAdd.length === 0) return;

    form.setImages([...form.images, ...imagesToAdd]);
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

  const ids = getImageSortableIds(imageUris);
  const activeIndex = activeId !== null ? ids.indexOf(activeId) : -1;
  const activeUri = activeIndex !== -1 ? imageUris[activeIndex] : null;

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(String(active.id));
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    const scrollLeft = imageListRef.current?.scrollLeft;
    setActiveId(null);
    if (!over || active.id === over.id) {
      preserveImageListScroll(scrollLeft);
      return;
    }
    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    if (oldIndex === -1 || newIndex === -1) {
      preserveImageListScroll(scrollLeft);
      return;
    }
    form.setImages(arrayMove(imageUris, oldIndex, newIndex));
    preserveImageListScroll(scrollLeft);
  };

  const handleDragCancel = () => {
    const scrollLeft = imageListRef.current?.scrollLeft;
    setActiveId(null);
    preserveImageListScroll(scrollLeft);
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
          accessibility={{ restoreFocus: false }}
          modifiers={[restrictToHorizontalAxis]}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext items={ids} strategy={horizontalListSortingStrategy}>
            <div ref={imageListRef} className="px-5 flex flex-nowrap gap-2 overflow-x-auto scrollbar-hide">
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

              {imageUris.map((uri, index) => (
                <SortableImageItem
                  key={ids[index]}
                  id={ids[index]}
                  uri={uri}
                  index={index}
                  onPreview={setPreviewIndex}
                  onRemove={removeImage}
                />
              ))}
            </div>
          </SortableContext>

          <DragOverlay modifiers={[restrictToHorizontalAxis]} dropAnimation={null}>
            {activeUri !== null ? (
              <div
                style={{
                  width: 88,
                  height: 88,
                  borderRadius: 16,
                  overflow: "hidden",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
                  opacity: 0.95,
                }}
              >
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
