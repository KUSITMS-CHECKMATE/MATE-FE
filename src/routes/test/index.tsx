import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { listMyTests } from "@/shared/api/generated/test";
import type { UserTest } from "@/features/test/model";
import { ServiceBanner } from "@/shared/ui/ServiceBanner";
import { TestCreateButton, TestList } from "@/features/test/ui";
import { BottomTabBar } from "@/shared/ui/BottomTabBar";
import { ROUTES } from "@/shared/constants/routes";

const STATUS_MAP: Record<string, UserTest["status"]> = {
  IN_PROGRESS: "active",
  COMPLETED: "ended",
  WAITING: "waiting",
  REJECTED: "rejected",
};

export const Route = createFileRoute("/test/")({
  component: MakerHomePage,
});

function MakerHomePage() {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["listMyTests"],
    queryFn: () => listMyTests(),
  });

  const tests: UserTest[] = (data?.data?.data?.tests ?? []).map((item) => ({
    id: item.id ?? 0,
    title: item.title ?? "",
    participantCount: item.pplCount ?? 0,
    maxParticipantCount: item.goalPpl ?? 0,
    status: STATUS_MAP[item.testStatus ?? ""] ?? "ended",
  }));

  return (
    <div className="flex flex-col">
      <ServiceBanner />
      <TestList
        tests={tests}
        isLoading={isLoading}
        onCardClick={(testId) =>
          navigate({ to: ROUTES.TEST_DETAIL, params: { testId: String(testId) } })
        }
      />
      <TestCreateButton onClick={() => navigate({ to: ROUTES.TEST_CREATE })} />

      <BottomTabBar activeTab="test" />
    </div>
  );
}
