import { createFileRoute } from "@tanstack/react-router";
import { BottomTabBar } from "@/shared/components/BottomTabBar";
import { DiscoveryBanner } from "@/features/discovery/components/DiscoveryBanner";
import { TestList } from "@/features/discovery/components/TestList";

export const Route = createFileRoute("/discovery/")({
  component: HomePage,
});

const DUMMY_TESTS = [
  {
    id: 1,
    title: "테스트명 한줄만 보이게아아아아아",
    description: "테스트 한줄 소개 한줄만 보이게랄랄랄라랄리라라라",
    reward: 300,
    thumbnailUrl: "https://static.toss.im/3d-emojis/u1F35C.png",
  },
  {
    id: 2,
    title: "테스트명 한줄만 보이게아아아아아",
    description: "테스트 한줄 소개 한줄만 보이게랄랄랄라랄리라라라",
    reward: 300,
    thumbnailUrl: "https://static.toss.im/3d-emojis/u1F35C.png",
  },
  {
    id: 3,
    title: "테스트명 한줄만 보이게아아아아아",
    description: "테스트 한줄 소개 한줄만 보이게랄랄랄라랄리라라라",
    reward: 300,
    thumbnailUrl: "https://static.toss.im/3d-emojis/u1F35C.png",
  },
  {
    id: 4,
    title: "테스트명 한줄만 보이게아아아아아",
    description: "테스트 한줄 소개 한줄만 보이게랄랄랄라랄리라라라",
    reward: 300,
    thumbnailUrl: "https://static.toss.im/3d-emojis/u1F35C.png",
  },
  {
    id: 5,
    title: "테스트명 한줄만 보이게아아아아아",
    description: "테스트 한줄 소개 한줄만 보이게랄랄랄라랄리라라라",
    reward: 300,
    thumbnailUrl: "https://static.toss.im/3d-emojis/u1F35C.png",
  },
];

function HomePage() {
  const tests = DUMMY_TESTS;

  return (
    <div className="flex flex-col pb-19">
      <DiscoveryBanner />
      <TestList tests={tests} />
      <BottomTabBar activeTab="discover" />
    </div>
  );
}
