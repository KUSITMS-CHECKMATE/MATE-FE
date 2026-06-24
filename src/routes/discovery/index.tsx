import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BottomTabBar } from "@/shared/ui/BottomTabBar";
import { ServiceBanner } from "@/shared/ui/ServiceBanner";
import { TestList } from "@/features/discovery/ui";
import { listTests, getListTestsUrl } from "@/shared/api/generated/test";

export const Route = createFileRoute("/discovery/")({
  component: HomePage,
});

function HomePage() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: [getListTestsUrl()],
    queryFn: listTests,
  });

  type TestsPayload = { testCount?: number; tests?: { id?: number; title?: string; description?: string; reward?: number; thumbnailUrl?: string; isLiked?: boolean }[] };
  const rawTests = (data?.data?.data as TestsPayload | undefined)?.tests;
  const tests = (Array.isArray(rawTests) ? rawTests : []).map((item) => ({
    id: item.id ?? 0,
    title: item.title ?? "",
    description: item.description ?? "",
    reward: item.reward ?? 0,
    thumbnailUrl: item.thumbnailUrl ?? "",
    liked: item.isLiked ?? false,
  }));

  return (
    <div className="flex flex-col pb-19">
      <ServiceBanner />
      <TestList tests={tests} isLoading={isLoading} onRetry={refetch} />
      <BottomTabBar activeTab="discover" />
    </div>
  );
}
