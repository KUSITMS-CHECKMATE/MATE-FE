import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { listMyTests } from "@/shared/api/generated/test";
import type { UserTest } from "@/features/test/model";
import { TestBanner, TestCreateButton, TestList } from "@/features/test/ui";
import { BottomTabBar } from "@/shared/ui/BottomTabBar";
import { ROUTES } from "@/shared/constants/routes";

export const Route = createFileRoute("/test/")({
  component: MakerHomePage,
});

function MakerHomePage() {
  console.log("MakerHomePage 렌더링됨");
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ["listMyTests"],
    queryFn: () => listMyTests(),
  });

  const tests: UserTest[] = (data?.data?.data?.tests ?? []).map((item) => ({
    id: item.id ?? 0,
    title: item.title ?? "",
    participantCount: item.pplCount ?? 0,
    maxParticipantCount: 0,
    status: item.testStatus === "IN_PROGRESS" ? "active" : "ended",
  }));

  return (
    <div className="flex flex-col">
      <TestBanner />
      <TestList
        tests={tests}
        onCardClick={(testId) =>
          navigate({ to: ROUTES.TEST_DETAIL, params: { testId: String(testId) } })
        }
      />
      <TestCreateButton onClick={() => navigate({ to: ROUTES.TEST_CREATE })} />

      <BottomTabBar activeTab="test" />
    </div>
  );
}
