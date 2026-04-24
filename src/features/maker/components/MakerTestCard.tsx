import { Asset, Badge, IconButton, Text } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";

type Props = {
  title: string;
  participantCount: number;
  maxParticipantCount: number;
  status: "active" | "ended";
  onClick?: () => void;
};

export function MakerTestCard({
  title,
  participantCount,
  maxParticipantCount,
  status,
  onClick,
}: Props) {
  const isActive = status === "active";

  return (
    <div
      className="w-full rounded-2xl p-4 flex flex-col gap-3 overflow-visible"
      style={{ backgroundColor: "rgba(0, 23, 51, 0.02)" }}
    >
      {/* 제목 영역 */}
      <div className="flex flex-col gap-1">
        <div className="flex flex-row justify-between items-center">
          <Badge
            size="small"
            variant="weak"
            color={isActive ? "green" : "elephant"}
          >
            {isActive ? "진행중" : "종료"}
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
          color={isActive ? adaptive.grey800 : adaptive.grey700}
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
          name={isActive ? "icon-user-two-align-mono" : "icon-user-two"}
          color={isActive ? adaptive.grey600 : undefined}
          aria-hidden={true}
          ratio="1/1"
        />
        <Text
          display="block"
          color={isActive ? adaptive.grey700 : adaptive.grey600}
          typography="t7"
          fontWeight={isActive ? "semibold" : "medium"}
        >
          {participantCount}/{maxParticipantCount} 명 참여
        </Text>
      </div>
    </div>
  );
}
