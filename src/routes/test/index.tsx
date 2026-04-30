import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MOCK_USER_TESTS } from "@/features/test/model";
import { TestBanner, TestCreateButton, TestList } from "@/features/test/ui";
import { BottomTabBar } from "@/shared/ui/BottomTabBar";
import { ROUTES } from "@/shared/constants/routes";

export const Route = createFileRoute("/test/")({
  component: MakerHomePage,
});

function MakerHomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      <TestBanner />
      <TestList tests={MOCK_USER_TESTS} />
      <TestCreateButton onClick={() => navigate({ to: ROUTES.TEST_CREATE })} />

      <BottomTabBar activeTab="test" />
    </div>
  );
}
