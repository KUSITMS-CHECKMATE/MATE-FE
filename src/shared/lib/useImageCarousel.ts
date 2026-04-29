import { useRef, useState } from "react";

export function useImageCarousel(length: number) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (length === 0) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) < 30) return;
    if (diff > 0) {
      setCurrentIndex((i) => Math.min(i + 1, length - 1));
    } else {
      setCurrentIndex((i) => Math.max(i - 1, 0));
    }
  };

  return { currentIndex, touchHandlers: { onTouchStart: handleTouchStart, onTouchEnd: handleTouchEnd } };
}
