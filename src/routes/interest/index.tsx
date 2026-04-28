import { createFileRoute } from "@tanstack/react-router";
import { BottomTabBar } from "@/shared/components/BottomTabBar";

export const Route = createFileRoute("/interest/")({
  component: InterestPage,
});

function InterestPage() {
  return (
    <div className="flex flex-col">
      <BottomTabBar activeTab="interest" />
    </div>
  );
}
