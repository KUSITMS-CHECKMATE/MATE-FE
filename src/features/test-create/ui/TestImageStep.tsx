import { useState, useRef, useEffect } from "react";
import { Top, Asset, Text, Badge } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { openCamera, fetchAlbumPhotos, OpenCameraPermissionError, FetchAlbumPhotosPermissionError } from "@apps-in-toss/web-framework";
import { PhotoSelectSheet } from "./PhotoSelectSheet";

const MAX_IMAGES = 10;
const EDGE_ZONE = 60;
const MAX_SCROLL_SPEED = 8;

export function TestImageStep() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [imageUris, setImageUris] = useState<string[]>([]);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartPos = useRef({ x: 0, y: 0 });
  const dragState = useRef<{ from: number; over: number } | null>(null);
  const imageListRef = useRef<HTMLDivElement>(null);
  const scrollAnimRef = useRef<number | null>(null);
  const currentTouchX = useRef(0);

  useEffect(() => {
    const preventScroll = (e: TouchEvent) => {
      if (dragState.current) e.preventDefault();
    };
    document.addEventListener("touchmove", preventScroll, { passive: false });
    return () => document.removeEventListener("touchmove", preventScroll);
  }, []);

  const addImages = (uris: string[]) => {
    setImageUris((prev) => {
      const remaining = MAX_IMAGES - prev.length;
      return [...prev, ...uris.slice(0, remaining)];
    });
  };

  const removeImage = (index: number) => {
    setImageUris((prev) => prev.filter((_, i) => i !== index));
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
    updateDragOver(touch.clientX);
  };

  const handleTouchEnd = () => {
    clearTimeout(longPressTimer.current!);
    longPressTimer.current = null;
    stopAutoScroll();
    if (dragState.current) {
      const { from, over } = dragState.current;
      if (from !== over) {
        setImageUris((prev) => {
          const next = [...prev];
          const [item] = next.splice(from, 1);
          next.splice(over, 0, item);
          return next;
        });
      }
      dragState.current = null;
      setDraggingIndex(null);
      setDragOverIndex(null);
    }
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
              테스트를 나타낼 수 있는 이미지를 첨부해주세요
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
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
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
                    onClick={() => removeImage(item.originalIndex)}
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
    </>
  );
}
