import { createFileRoute } from '@tanstack/react-router';
import { BottomTabBar } from '@/shared/ui/BottomTabBar';
import { MyHelpSection, MyServiceSection } from '@/features/my/ui';

export const Route = createFileRoute('/my/')({
  component: MyPage,
});

function MyPage() {
  return (
    <div className="flex flex-col pb-24">
      <MyHelpSection />
      <MyServiceSection />
      <BottomTabBar activeTab="my" />
    </div>
  );
}
