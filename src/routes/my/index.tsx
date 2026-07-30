import { useEffect, useRef, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { AnimatePresence } from 'framer-motion';
import { graniteEvent } from '@apps-in-toss/web-framework';
import { BottomTabBar } from '@/shared/ui/BottomTabBar';
import { TestGuidePage } from '@/shared/ui/TestGuidePage';
import { MyHelpSection, MyServiceSection } from '@/features/my/ui';

export const Route = createFileRoute('/my/')({
  component: MyPage,
});

function MyPage() {
  const [showGuide, setShowGuide] = useState(false);
  const showGuideRef = useRef(showGuide);
  useEffect(() => {
    showGuideRef.current = showGuide;
  }, [showGuide]);

  useEffect(() => {
    try {
      const unsubscribe = graniteEvent.addEventListener('backEvent', {
        onEvent: () => {
          if (showGuideRef.current) setShowGuide(false);
        },
        onError: (error) => console.error('backEvent error', error),
      });
      return () => unsubscribe();
    } catch {
      console.warn('backEvent listener not supported in browser');
      return () => {};
    }
  }, []);

  return (
    <div className="flex flex-col pb-24">
      <MyHelpSection onGuideClick={() => setShowGuide(true)} />
      <MyServiceSection />
      <BottomTabBar activeTab="my" disableExit={showGuide} />
      <AnimatePresence>
        {showGuide && <TestGuidePage key="guide" onClose={() => setShowGuide(false)} />}
      </AnimatePresence>
    </div>
  );
}
