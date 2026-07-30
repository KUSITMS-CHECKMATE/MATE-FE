import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { AnimatePresence } from 'framer-motion';
import { BottomTabBar } from '@/shared/ui/BottomTabBar';
import { TestGuidePage } from '@/shared/ui/TestGuidePage';
import { MyHelpSection, MyServiceSection } from '@/features/my/ui';

export const Route = createFileRoute('/my/')({
  component: MyPage,
});

function MyPage() {
  const [showGuide, setShowGuide] = useState(false);

  return (
    <div className="flex flex-col pb-24">
      <MyHelpSection onGuideClick={() => setShowGuide(true)} />
      <MyServiceSection />
      <BottomTabBar activeTab="my" />
      <AnimatePresence>
        {showGuide && <TestGuidePage key="guide" onClose={() => setShowGuide(false)} />}
      </AnimatePresence>
    </div>
  );
}
