import { createFileRoute } from "@tanstack/react-router";
import { BottomTabBar } from "@/shared/ui/BottomTabBar";
import { MOCK_DISCOVERY_TESTS } from "@/features/discovery/model";
import { DiscoveryBanner, TestList } from "@/features/discovery/ui";

export const Route = createFileRoute("/discovery/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="flex flex-col pb-19">
      <DiscoveryBanner />
      <TestList tests={MOCK_DISCOVERY_TESTS} />
      <BottomTabBar activeTab="discover" />
    </div>
  );
}
