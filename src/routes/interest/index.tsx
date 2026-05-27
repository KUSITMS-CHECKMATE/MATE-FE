import { createFileRoute } from "@tanstack/react-router";
import { BottomTabBar } from "@/shared/ui/BottomTabBar";
import { InterestList } from "@/features/interest/ui";

export const Route = createFileRoute("/interest/")({
  component: InterestPage,
});

function InterestPage() {
  return (
    <div className="flex flex-col pb-19">
      <InterestList />
      <BottomTabBar activeTab="interest" />
    </div>
  );
}
