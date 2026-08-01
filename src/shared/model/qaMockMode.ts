import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface QaMockModeStore {
  enabled: boolean;
  toggle: () => void;
  setEnabled: (enabled: boolean) => void;
}

/**
 * QA 브랜치 전용: 핵심 화면들을 실제 API 대신 mock 데이터로 보여주는 토글.
 * localStorage에 저장되어 새로고침해도 유지된다.
 */
export const useQaMockMode = create<QaMockModeStore>()(
  persist(
    (set) => ({
      enabled: false,
      toggle: () => set((state) => ({ enabled: !state.enabled })),
      setEnabled: (enabled) => set({ enabled }),
    }),
    { name: 'qa-mock-mode' },
  ),
);
