import { Asset, Badge, IconButton, Text } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import type { TestStatus } from "../model";

interface Props {
  title: string;
  participantCount: number;
  maxParticipantCount: number;
  status: TestStatus;
  onClick?: () => void;
}

const STATUS_CONFIG = {
  active: {
    badgeColor: "green" as const,
    badgeLabel: "진행중",
    titleColor: adaptive.grey800,
    iconName: "icon-user-two-align-mono",
    iconColor: adaptive.grey600,
    participantColor: adaptive.grey700,
    participantWeight: "semibold" as const,
  },
  ended: {
    badgeColor: "elephant" as const,
    badgeLabel: "종료",
    titleColor: adaptive.grey700,
    iconName: "icon-user-two",
    iconColor: undefined,
    participantColor: adaptive.grey600,
    participantWeight: "medium" as const,
  },
};

export function TestCard({
  title,
  participantCount,
  maxParticipantCount,
  status,
  onClick,
}: Props) {
  const config = STATUS_CONFIG[status];
  const participantLabel = `${participantCount}/${maxParticipantCount} 명 참여`;

  return (
    <div
      className="w-full rounded-2xl p-4 flex flex-col gap-3 overflow-visible"
      style={{ backgroundColor: "rgba(0, 23, 51, 0.02)" }}
    >
      {/* 제목 영역 */}
      <div className="flex flex-col gap-1">
        <div className="flex flex-row justify-between items-center">
          <Badge size="small" variant="weak" color={config.badgeColor}>
            {config.badgeLabel}
          </Badge>
          <IconButton
            src="https://static.toss.im/icons/png/4x/icon-arrow-right-grey-impact-fill.png"
            iconSize={20}
            variant="clear"
            aria-label="테스트 상세 보기"
            onClick={onClick}
          />
        </div>
        <Text
          display="block"
          color={config.titleColor}
          typography="t5"
          fontWeight="bold"
        >
          {title}
        </Text>
      </div>

      {/* 참여 현황 */}
      <div
        className="w-full flex flex-row gap-2 items-center rounded-[10px] p-2.5"
        style={{
          backgroundColor: "var(--token-tds-color-grey-background, #f2f4f6)",
        }}
      >
        <Asset.Icon
          frameShape={Asset.frameShape.CleanW20}
          backgroundColor="transparent"
          name={config.iconName}
          color={config.iconColor}
          aria-hidden={true}
          ratio="1/1"
        />
        <Text
          display="block"
          color={config.participantColor}
          typography="t7"
          fontWeight={config.participantWeight}
        >
          {participantLabel}
        </Text>
      </div>
    </div>
  );
}
