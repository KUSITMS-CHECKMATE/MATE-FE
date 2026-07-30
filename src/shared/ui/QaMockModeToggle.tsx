import { useQaMockMode } from '@/shared/model/qaMockMode';

/**
 * QA 브랜치 전용 플로팅 버튼. 누르면 핵심 화면들이 mock 데이터로 전환된다.
 * main에 머지하기 전에는 제거해야 한다.
 */
export function QaMockModeToggle() {
  const enabled = useQaMockMode((state) => state.enabled);
  const toggle = useQaMockMode((state) => state.toggle);

  return (
    <button
      type="button"
      onClick={toggle}
      className="fixed bottom-24 right-4 z-100 w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg"
      style={{ backgroundColor: enabled ? '#ff5847' : '#8b95a1' }}
    >
      QA
    </button>
  );
}
