import { useNavigate } from "@tanstack/react-router";
import { Asset, Text } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";

type TabKey = "discover" | "test" | "interest" | "my";

const TABS = [
  {
    key: "discover",
    label: "발견",
    icon: "icon-search-mono",
    to: "/discovery",
  },
  { key: "test", label: "테스트", icon: "icon-chemistry-mono", to: "/test" },
  { key: "interest", label: "관심", icon: "icon-heart-mono", to: "/interest" },
  { key: "my", label: "마이", icon: "icon-user-mono", to: "/my" },
] as const;

type Props = {
  activeTab: TabKey;
};

export function BottomTabBar({ activeTab }: Props) {
  const navigate = useNavigate();

  return (
    <div
      className="w-full h-19 fixed bottom-0 left-0 overflow-visible px-3"
      style={{
        background:
          "linear-gradient(180deg, rgba(209,209,253,0.05) 50%, #ffffff 150%)",
      }}
    >
      {/* 탭 바 */}
      <div className="px-2 pb-2">
        <div
          className="flex rounded-[30px] p-2.25 bg-white"
          style={{
            boxShadow:
              "0px 20px 20px -16px #191F2911, 0px 40px 200px 0px #191F293f",
          }}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                className="flex-1 h-10.5 flex flex-col gap-px items-center justify-center"
                onClick={() => navigate({ to: tab.to })}
              >
                <Asset.Icon
                  frameShape={Asset.frameShape.CleanW24}
                  name={tab.icon}
                  color={isActive ? adaptive.grey800 : adaptive.grey400}
                  aria-hidden={true}
                />
                <Text
                  display="block"
                  color={isActive ? adaptive.grey900 : adaptive.grey600}
                  typography="st13"
                  fontWeight="medium"
                  textAlign="center"
                >
                  {tab.label}
                </Text>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
