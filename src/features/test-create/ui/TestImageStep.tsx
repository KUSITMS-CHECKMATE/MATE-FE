import { useState, useRef, useEffect } from "react";
import { Top, Asset, Text, Badge, BottomSheet, ListRow, Checkbox } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { openCamera, fetchAlbumPhotos, OpenCameraPermissionError, FetchAlbumPhotosPermissionError } from "@apps-in-toss/web-framework";
import { PhotoSelectSheet } from "./PhotoSelectSheet";
import { useTestCreateForm } from "../model/useTestCreateForm";

const MAX_IMAGES = 10;
const EDGE_ZONE = 60;
const MAX_SCROLL_SPEED = 8;

const PREVIEW_SURFACE = "var(--token-tds-color-white, var(--adaptiveBackground, #ffffff))";

interface TestImageStepProps {
  onHasImagesChange?: (hasImages: boolean) => void;
  title?: string;
}

export function TestImageStep({ onHasImagesChange, title = "테스트를 나타낼 수 있는 이미지를 첨부해주세요" }: TestImageStepProps) {
  const form = useTestCreateForm();
  const imageUris = form.images;
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartPos = useRef({ x: 0, y: 0 });
  const dragState = useRef<{ from: number; over: number } | null>(null);
  const imageListRef = useRef<HTMLDivElement>(null);
  const scrollAnimRef = useRef<number | null>(null);
  const currentTouchX = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (longPressTimer.current) clearTimeout(longPressTimer.current);
      if (scrollAnimRef.current) cancelAnimationFrame(scrollAnimRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    const preventScroll = (e: TouchEvent) => {
      if (dragState.current) e.preventDefault();
    };
    document.addEventListener("touchmove", preventScroll, { passive: false });
    return () => document.removeEventListener("touchmove", preventScroll);
  }, []);

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

  const stopAutoScroll = () => {
    if (scrollAnimRef.current !== null) {
      cancelAnimationFrame(scrollAnimRef.current);
      scrollAnimRef.current = null;
    }
  };

  const updateDragOver = (touchX: number) => {
    if (!imageListRef.current || !dragState.current) return;
    const items = imageListRef.current.querySelectorAll("[data-drag-item]");
    for (let i = 0; i < items.length; i++) {
      const rect = items[i].getBoundingClientRect();
      if (touchX >= rect.left && touchX <= rect.right) {
        if (dragState.current.over !== i) {
          dragState.current.over = i;
          setDragOverIndex(i);
        }
        break;
      }
    }
  };

  const startAutoScroll = (touchX: number) => {
    if (!imageListRef.current || !dragState.current) return;
    const containerRect = imageListRef.current.getBoundingClientRect();

    let speed = 0;
    if (touchX < containerRect.left + EDGE_ZONE) {
      const ratio = Math.max(0, touchX - containerRect.left) / EDGE_ZONE;
      speed = -MAX_SCROLL_SPEED * (1 - ratio);
    } else if (touchX > containerRect.right - EDGE_ZONE) {
      const ratio = Math.max(0, containerRect.right - touchX) / EDGE_ZONE;
      speed = MAX_SCROLL_SPEED * (1 - ratio);
    }

    stopAutoScroll();

    if (speed !== 0) {
      const scroll = () => {
        if (!dragState.current || !imageListRef.current) return;
        imageListRef.current.scrollLeft += speed;
        updateDragOver(currentTouchX.current);
        scrollAnimRef.current = requestAnimationFrame(scroll);
      };
      scrollAnimRef.current = requestAnimationFrame(scroll);
    }
  };

  const handleTouchStart = (index: number) => (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
    longPressTimer.current = setTimeout(() => {
      dragState.current = { from: index, over: index };
      setDraggingIndex(index);
      setDragOverIndex(index);
    }, 500);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!dragState.current) {
      const dx = Math.abs(touch.clientX - touchStartPos.current.x);
      const dy = Math.abs(touch.clientY - touchStartPos.current.y);
      if (dx > 8 || dy > 8) {
        clearTimeout(longPressTimer.current!);
        longPressTimer.current = null;
      }
      return;
    }
    currentTouchX.current = touch.clientX;
    startAutoScroll(touch.clientX);
    
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(() => {
        updateDragOver(currentTouchX.current);
        rafRef.current = null;
      });
    }
  };

  const handleTouchEnd = () => {
    clearTimeout(longPressTimer.current!);
    longPressTimer.current = null;
    stopAutoScroll();
    if (dragState.current) {
      const { from, over } = dragState.current;
      if (from !== over) {
        const next = [...form.images];
        const [item] = next.splice(from, 1);
        next.splice(over, 0, item);
        form.setImages(next);
      }
      dragState.current = null;
      setDraggingIndex(null);
      setDragOverIndex(null);
    }
  };

  const handleTouchCancel = () => {
    handleTouchEnd();
  };

  // 드래그 중: draggingIndex 아이템을 dragOverIndex 위치로 시각적으로 재배열
  // ghost 아이템이 반투명하게 미리보기 위치를 표시, 나머지 아이템은 자동으로 밀림
  const visualItems =
    draggingIndex !== null && dragOverIndex !== null
      ? (() => {
          const items = imageUris.map((uri, i) => ({ uri, originalIndex: i, isGhost: false }));
          const [dragged] = items.splice(draggingIndex, 1);
          items.splice(dragOverIndex, 0, { ...dragged, isGhost: true });
          return items;
        })()
      : imageUris.map((uri, i) => ({ uri, originalIndex: i, isGhost: false }));

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

          {visualItems.map((item) => (
            <div
              key={item.originalIndex}
              data-drag-item
              onTouchStart={handleTouchStart(item.originalIndex)}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={handleTouchCancel}
              onContextMenu={(e) => e.preventDefault()}
              style={{
                position: "relative",
                width: 88,
                height: 88,
                flexShrink: 0,
                borderRadius: 16,
                opacity: item.isGhost ? 0.4 : 1,
                transition: "opacity 0.15s",
              }}
            >
              <button
                type="button"
                className="block h-full w-full cursor-pointer border-0 bg-transparent p-0"
                onClick={() => setPreviewIndex(item.originalIndex)}
                aria-label={`이미지 ${item.originalIndex + 1} 미리보기`}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 16,
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={item.uri}
                    alt={`선택된 이미지 ${item.originalIndex + 1}`}
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              </button>
              {!item.isGhost && (
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
                  {item.originalIndex === 0 && (
                    <div style={{ position: "absolute", bottom: 0, left: 0 }}>
                      <Badge size="small" variant="weak" color="elephant">
                        대표
                      </Badge>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(item.originalIndex);
                    }}
                    style={{
                      display: "flex",
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      pointerEvents: "auto",
                    }}
                    aria-label={`이미지 ${item.originalIndex + 1} 삭제`}
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
          ))}
        </div>
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
              <div
                style={{
                  width: "100%",
                  backgroundColor: PREVIEW_SURFACE,
                }}
              >
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
