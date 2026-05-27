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
    badgeLabel: "진행 중",
    titleColor: adaptive.grey800,
  },
  ended: {
    badgeColor: "elephant" as const,
    badgeLabel: "종료",
    titleColor: adaptive.grey700,
  },
  waiting: {
    badgeColor: "yellow" as const,
    badgeLabel: "검토중",
    titleColor: adaptive.grey700,
  },
  rejected: {
    badgeColor: "red" as const,
    badgeLabel: "반려",
    titleColor: adaptive.grey800,
  },
};

const PARTICIPANT_CONFIG = {
  active: {
    iconName: "icon-user-two-align-mono",
    iconColor: adaptive.grey600,
    textColor: adaptive.grey700,
    textWeight: "semibold" as const,
  },
  ended: {
    iconName: "icon-user-two",
    iconColor: undefined,
    textColor: adaptive.grey600,
    textWeight: "medium" as const,
  },
};

export function TestCard({ title, participantCount, maxParticipantCount, status, onClick }: Props) {
  const config = STATUS_CONFIG[status];

  return (
    <div
      className="w-full rounded-2xl px-4 pt-4 pb-7 flex flex-col gap-3 overflow-visible"
      style={{ backgroundColor: "rgba(0, 23, 51, 0.02)" }}
    >
      <div className="flex flex-col">
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
        <Text display="block" color={config.titleColor} typography="t5" fontWeight="bold">
          {title}
        </Text>
      </div>

      {(status === "active" || status === "ended") && (
        <div
          className="w-full flex flex-row gap-2 items-center rounded-[10px] p-2.5"
          style={{ backgroundColor: "var(--token-tds-color-grey-background, #f2f4f6)" }}
        >
          <Asset.Icon
            frameShape={Asset.frameShape.CleanW20}
            backgroundColor="transparent"
            name={PARTICIPANT_CONFIG[status].iconName}
            color={PARTICIPANT_CONFIG[status].iconColor}
            aria-hidden={true}
            ratio="1/1"
          />
          <Text
            display="block"
            color={PARTICIPANT_CONFIG[status].textColor}
            typography="t7"
            fontWeight={PARTICIPANT_CONFIG[status].textWeight}
          >
            {participantCount}/{maxParticipantCount} 명 참여
          </Text>
        </div>
      )}

      {status === "waiting" && (
        <div
          className="w-full flex flex-row gap-2 items-center rounded-[10px] p-2.5"
          style={{
            backgroundColor:
              "var(--token-tds-color-grey-background, var(--adaptiveGreyBackground, #f2f4f6))",
          }}
        >
          <Asset.Icon
            frameShape={Asset.frameShape.CleanW20}
            backgroundColor="transparent"
            name="icon-info-circle-mono"
            color={adaptive.grey600}
            aria-hidden={true}
            ratio="1/1"
          />
          <Text display="block" color={adaptive.grey700} typography="t7" fontWeight="semibold">
            검토가 끝날 때까지 최대 일주일 걸릴 수 있어요.
          </Text>
        </div>
      )}
    </div>
  );
}
