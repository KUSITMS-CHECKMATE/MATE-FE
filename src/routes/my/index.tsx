import { createFileRoute } from "@tanstack/react-router";
import { BottomTabBar } from "@/shared/components/BottomTabBar";

export const Route = createFileRoute("/my/")({
  component: MyPage,
});

function MyPage() {
  return (
    <div className="flex flex-col">
      <BottomTabBar activeTab="my" />
    </div>
  );
}
