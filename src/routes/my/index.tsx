import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@toss/tds-mobile";
import { BottomTabBar } from "@/shared/ui/BottomTabBar";
import { unlinkToss } from "@/shared/api/generated/auth";
import { clearToken } from "@/shared/api/client";

export const Route = createFileRoute("/my/")({
  component: MyPage,
});

function MyPage() {
  async function handleUnlink() {
    try {
      await unlinkToss();
    } finally {
      clearToken();
      window.location.reload();
    }
  }

  return (
    <div className="flex flex-col">
      <div className="px-5 pt-10">
        <Button size="medium" display="block" color="dark" variant="weak" onClick={handleUnlink}>
          로그아웃
        </Button>
      </div>
      <BottomTabBar activeTab="my" />
    </div>
  );
}
