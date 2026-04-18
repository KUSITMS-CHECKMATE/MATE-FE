import { Asset, Text } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";

type TabKey = "discover" | "test" | "interest" | "my";

type TabItem = {
  key: TabKey;
  label: string;
  icon: string;
};

const TABS: TabItem[] = [
  { key: "discover", label: "발견", icon: "icon-search-mono" },
  { key: "test", label: "테스트", icon: "icon-chemistry-mono" },
  { key: "interest", label: "관심", icon: "icon-heart-mono" },
  { key: "my", label: "마이", icon: "icon-user-mono" },
];

type Props = {
  activeTab: TabKey;
  onChange: (key: TabKey) => void;
};

export function BottomTabBar({ activeTab, onChange }: Props) {
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
                onClick={() => onChange(tab.key)}
              >
                <Asset.Icon
                  frameShape={Asset.frameShape.CleanW24}
                  name={tab.icon as never}
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
