import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { IconButton } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { BottomTabBar } from "@/shared/components/BottomTabBar";
import { TestBanner } from "@/features/test/components/TestBanner";
import { TestList } from "@/features/test/components/TestList";
import { ROUTES } from "@/shared/constants/routes";

const DUMMY_TESTS = [
  {
    id: 1,
    title: "테스트명",
    participantCount: 38,
    maxParticipantCount: 100,
    status: "active" as const,
  },
  {
    id: 2,
    title: "테스트명",
    participantCount: 38,
    maxParticipantCount: 100,
    status: "ended" as const,
  },
  {
    id: 3,
    title: "테스트명",
    participantCount: 38,
    maxParticipantCount: 100,
    status: "ended" as const,
  },
  {
    id: 4,
    title: "테스트명",
    participantCount: 38,
    maxParticipantCount: 100,
    status: "ended" as const,
  },
  {
    id: 5,
    title: "테스트명",
    participantCount: 38,
    maxParticipantCount: 100,
    status: "ended" as const,
  },
];

export const Route = createFileRoute("/test/")({
  component: MakerHomePage,
});

function MakerHomePage() {
  const tests = DUMMY_TESTS;
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      <TestBanner />
      <TestList tests={tests} />

      <div className="flex justify-end fixed right-4 bottom-24 w-full h-fit overflow-visible">
        <IconButton
          className="pointer-events-auto"
          src="https://static.toss.im/icons/png/4x/icon-plus-thin-mono.png"
          iconSize={24}
          variant="fill"
          color={adaptive.background}
          bgColor="#4365CC"
          aria-label="테스트 등록"
          style={{ borderRadius: "9999px" }}
          onClick={() => navigate({ to: ROUTES.TEST_CREATE })}
        />
      </div>

      <BottomTabBar activeTab="test" />
    </div>
  );
}
