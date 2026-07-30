import { useState } from "react";
import { Asset, Badge, Button, ConfirmDialog, IconButton, Text } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import type { DraftTestStatus, TestStatus } from "../model";

export type TestCardStatus = TestStatus | DraftTestStatus;

interface Props {
  title: string;
  status: TestCardStatus;
  participantCount?: number;
  maxParticipantCount?: number;
  onClick?: () => void;
  onResume?: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
}

const STATUS_CONFIG: Record<
  TestCardStatus,
  {
    badgeColor: "green" | "elephant" | "yellow" | "red";
    badgeVariant: "weak" | "fill";
    badgeLabel: string;
    titleColor: string;
  }
> = {
  active: { badgeColor: "green", badgeVariant: "weak", badgeLabel: "진행 중", titleColor: adaptive.grey800 },
  ended: { badgeColor: "elephant", badgeVariant: "weak", badgeLabel: "종료", titleColor: adaptive.grey700 },
  waiting: { badgeColor: "yellow", badgeVariant: "weak", badgeLabel: "검토중", titleColor: adaptive.grey700 },
  rejected: { badgeColor: "red", badgeVariant: "weak", badgeLabel: "반려", titleColor: adaptive.grey800 },
  draft: { badgeColor: "elephant", badgeVariant: "fill", badgeLabel: "임시 저장", titleColor: adaptive.grey800 },
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

export function TestCard({ title, status, participantCount, maxParticipantCount, onClick, onResume, onDelete, isDeleting = false }: Props) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const config = STATUS_CONFIG[status];
  const hasDetailArrow = status === "active" || status === "ended" || status === "waiting" || status === "rejected";

  return (
    <div className="w-full rounded-2xl px-4 pt-6 pb-4 flex flex-col gap-6 overflow-visible" style={{ backgroundColor: "rgba(0, 23, 51, 0.02)" }}>
      <div className="flex flex-col">
        <div className="flex flex-row justify-between items-center mb-2">
          <Badge size="small" variant={config.badgeVariant} color={config.badgeColor}>
            {config.badgeLabel}
          </Badge>
          {hasDetailArrow && (
            <IconButton src="https://static.toss.im/icons/png/4x/icon-arrow-right-grey-impact-fill.png" iconSize={20} variant="clear" aria-label="테스트 상세 보기" onClick={onClick} />
          )}
        </div>
        <Text display="block" color={config.titleColor} typography="t5" fontWeight="bold">
          {title}
        </Text>
      </div>

      {(status === "active" || status === "ended") && (
        <div className="w-full flex flex-row gap-2 items-center rounded-[10px] p-2.5" style={{ backgroundColor: "var(--token-tds-color-grey-background, #f2f4f6)" }}>
          <Asset.Icon
            frameShape={Asset.frameShape.CleanW20}
            backgroundColor="transparent"
            name={PARTICIPANT_CONFIG[status].iconName}
            color={PARTICIPANT_CONFIG[status].iconColor}
            aria-hidden={true}
            ratio="1/1"
          />
          <Text display="block" color={PARTICIPANT_CONFIG[status].textColor} typography="t7" fontWeight={PARTICIPANT_CONFIG[status].textWeight}>
            {participantCount}/{maxParticipantCount} 명 참여
          </Text>
        </div>
      )}

      {status === "waiting" && (
        <div
          className="w-full flex flex-row gap-2 items-center rounded-[10px] p-2.5"
          style={{
            backgroundColor: "var(--token-tds-color-grey-background, var(--adaptiveGreyBackground, #f2f4f6))",
          }}
        >
          <Asset.Icon frameShape={Asset.frameShape.CleanW20} backgroundColor="transparent" name="icon-info-circle-mono" color={adaptive.grey600} aria-hidden={true} ratio="1/1" />
          <Text display="block" color={adaptive.grey700} typography="t7" fontWeight="semibold">
            검토가 끝날 때까지 최대 일주일 걸릴 수 있어요.
          </Text>
        </div>
      )}

      {status === "draft" && (
        <div className="w-full flex flex-row items-center gap-2">
          <IconButton
            src="https://static.toss.im/icons/png/4x/icon-bin-mono.png"
            iconSize={20}
            variant="clear"
            color={adaptive.grey400}
            aria-label="초안 삭제"
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={isDeleting}
          />
          <Button size="medium" variant="weak" display="block" onClick={onResume}>
            이어서 만들기
          </Button>
        </div>
      )}

      <ConfirmDialog
        open={isDeleteDialogOpen}
        title="임시 저장한 테스트를 삭제할까요?"
        description="삭제하면 복구할 수 없어요"
        cancelButton={
          <ConfirmDialog.CancelButton size="xlarge" onClick={() => setIsDeleteDialogOpen(false)}>
            닫기
          </ConfirmDialog.CancelButton>
        }
        confirmButton={
          <ConfirmDialog.ConfirmButton
            color="danger"
            size="xlarge"
            onClick={() => {
              setIsDeleteDialogOpen(false);
              onDelete?.();
            }}
          >
            삭제하기
          </ConfirmDialog.ConfirmButton>
        }
        onClose={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  );
}
