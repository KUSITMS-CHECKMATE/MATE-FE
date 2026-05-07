import { useEffect, useState } from "react";
import { BottomSheet, CTAButton, ListRow, Checkbox } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import type { AbQuestionData } from "../model/types";

interface Props {
  data: AbQuestionData;
  open: boolean;
  onClose: () => void;
  onConfirm: (selected: "A" | "B") => void;
}

export function AbSelectionBottomSheet({ data, open, onClose, onConfirm }: Props) {
  const [pending, setPending] = useState<"A" | "B" | null>(null);

  useEffect(() => {
    if (open) setPending(null);
  }, [open]);

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      header={<BottomSheet.Header>{data.title}</BottomSheet.Header>}
      headerDescription={
        data.description ? (
          <BottomSheet.HeaderDescription>{data.description}</BottomSheet.HeaderDescription>
        ) : undefined
      }
      cta={
        <BottomSheet.DoubleCTA
          leftButton={
            <CTAButton color="dark" variant="weak" onClick={onClose}>
              닫기
            </CTAButton>
          }
          rightButton={
            <CTAButton disabled={pending === null} onClick={() => pending && onConfirm(pending)}>
              확인
            </CTAButton>
          }
        />
      }
    >
      <div className="flex flex-row gap-3 px-4 mb-2">
        {(["A", "B"] as const).map((option) => {
          const imageUrl = option === "A" ? data.imageUrlA : data.imageUrlB;
          return (
            <div
              key={option}
              className="relative flex-1 overflow-hidden"
              style={{
                aspectRatio: "9/16",
                borderRadius: 16,
                boxShadow: `inset 0 0 0 1px ${adaptive.greyOpacity100}`,
              }}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={`${option}안`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div
                  className="absolute inset-0"
                  style={{ background: adaptive.greyOpacity50 }}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-row px-4 gap-3">
        {(["A", "B"] as const).map((option) => (
          <div key={option} className="flex-1">
            <ListRow
              role="checkbox"
              aria-checked={pending === option}
              onClick={() => setPending(option)}
              contents={
                <ListRow.Texts
                  type="1RowTypeB"
                  top={`${option}안`}
                  topProps={{ color: adaptive.grey800 }}
                />
              }
              right={<Checkbox.Circle size={24} checked={pending === option} />}
              verticalPadding="large"
              horizontalPadding="small"
            />
          </div>
        ))}
      </div>
    </BottomSheet>
  );
}
