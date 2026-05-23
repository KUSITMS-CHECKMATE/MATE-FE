import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BottomTabBar } from "@/shared/ui/BottomTabBar";
import { DiscoveryBanner, TestList } from "@/features/discovery/ui";
import { listTests, getListTestsUrl } from "@/shared/api/generated/test";

export const Route = createFileRoute("/discovery/")({
  component: HomePage,
});

function HomePage() {
  const { data, isLoading } = useQuery({
    queryKey: [getListTestsUrl()],
    queryFn: listTests,
  });

  const tests = (data?.data.data ?? []).map((item) => ({
    id: item.id ?? 0,
    title: item.title ?? "",
    description: item.description ?? "",
    reward: item.reward ?? 0,
    thumbnailUrl: item.thumbnailKey ?? "",
    liked: item.isLiked ?? false,
  }));

  return (
    <div className="flex flex-col pb-19">
      <DiscoveryBanner />
      <TestList tests={isLoading ? [] : tests} />
      <BottomTabBar activeTab="discover" />
    </div>
  );
}
