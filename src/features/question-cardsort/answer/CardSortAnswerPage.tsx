import { useState } from "react";
import { Top, Tooltip } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import type { QuestionAnswerProps } from "@/features/test-participate/model/types";
import { QUESTION_TYPE_LABEL } from "@/features/test-participate/model/constants";

const SELECTED_BORDER = "#4365cc";
const SELECTED_BG = "var(--adaptiveCardBgGrey)";

function getCategoryColor(index: number): string {
  if (index === 0) return adaptive.red500;
  if (index === 1) return adaptive.green500;
  if (index === 2) return adaptive.blue500;
  return adaptive.blue500;
}

export function CardSortAnswerPage({ question, answer, onChange }: QuestionAnswerProps<"cardsort">) {
  const { data } = question;
  const placements = answer?.placements ?? {};
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [pickTooltipDone, setPickTooltipDone] = useState(false);

  const getCardCount = (categoryId: string) =>
    Object.values(placements).filter((v) => v === categoryId).length;

  const getAssignedIndex = (cardId: string): number | null => {
    const categoryId = placements[cardId];
    if (!categoryId) return null;
    const idx = data.categories.findIndex((c) => c.id === categoryId);
    return idx >= 0 ? idx : null;
  };

  const handleCardTap = (cardId: string) => {
    if (!hasInteracted) setHasInteracted(true);
    if (selectedCardId === cardId && !pickTooltipDone) setPickTooltipDone(true);
    setSelectedCardId((prev) => (prev === cardId ? null : cardId));
  };

  const handleCategoryTap = (categoryId: string) => {
    if (!selectedCardId) return;
    if (!pickTooltipDone) setPickTooltipDone(true);
    onChange({ type: "cardsort", placements: { ...placements, [selectedCardId]: categoryId } });
    setSelectedCardId(null);
  };

  return (
    <div className="flex flex-col">
      <Top
        title={
          <Top.TitleParagraph size={22} color={adaptive.grey900}>
            {data.title}
          </Top.TitleParagraph>
        }
        subtitleTop={
          <Top.SubtitleBadges
            badges={[{ text: QUESTION_TYPE_LABEL.cardsort, color: "elephant", variant: "weak" }]}
          />
        }
        subtitleBottom={
          data.description ? (
            <Top.SubtitleParagraph size={15}>{data.description}</Top.SubtitleParagraph>
          ) : undefined
        }
      />

      {selectedCardId !== null && !pickTooltipDone && (
        <div className="flex justify-center items-end" style={{ height: 52 }}>
          <Tooltip
            open
            message="분류할 곳을 선택해주세요"
            messageAlign="center"
            placement="top"
            size="small"
            motionVariant="weak"
          >
            <span />
          </Tooltip>
        </div>
      )}

      <div className={`flex flex-row gap-3 px-5 ${selectedCardId && !pickTooltipDone ? "mt-2" : "mt-4"}`}>
        {data.categories.map((category, index) => {
          const borderColor = selectedCardId ? SELECTED_BORDER : getCategoryColor(index);
          return (
            <button
              key={category.id}
              className="flex-1 flex flex-col items-center justify-center rounded-2xl"
              style={{
                border: `${selectedCardId ? 2 : 1}px solid ${borderColor}`,
                borderRadius: 14,
                paddingTop: selectedCardId ? 15 : 16,
                paddingBottom: selectedCardId ? 15 : 16,
                background: selectedCardId ? SELECTED_BG : "transparent",
              }}
              onClick={() => handleCategoryTap(category.id)}
            >
              <span style={{ fontWeight: 700, fontSize: 16, color: adaptive.grey900 }}>
                {category.label}
              </span>
              <span style={{ fontSize: 13, color: adaptive.grey500, marginTop: 4 }}>
                {getCardCount(category.id)}개
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-2 px-5 mt-6">
        {data.cards.map((card) => {
          const assignedIndex = getAssignedIndex(card.id);
          const isSelected = selectedCardId === card.id;
          const isAssigned = assignedIndex !== null;

          let borderColor = adaptive.grey300 as string;
          if (isSelected) borderColor = SELECTED_BORDER;
          else if (isAssigned) borderColor = getCategoryColor(assignedIndex);

          return (
            <button
              key={card.id}
              className="flex items-center justify-center"
              style={{
                border: `${isSelected ? 2 : 1}px solid ${borderColor}`,
                borderRadius: 14,
                paddingTop: isSelected ? 19 : 20,
                paddingBottom: isSelected ? 19 : 20,
                background: isAssigned && !isSelected ? SELECTED_BG : isSelected ? SELECTED_BG : "white",
                opacity: isAssigned && !isSelected ? 0.4 : 1,
                backdropFilter: "blur(0px)",
              }}
              onClick={() => handleCardTap(card.id)}
            >
              <span
                style={{
                  fontWeight: 600,
                  fontSize: 15,
                  color: isAssigned && !isSelected ? adaptive.grey700 : adaptive.grey800,
                }}
              >
                {card.label}
              </span>
            </button>
          );
        })}
      </div>

      {!hasInteracted && (
        <div className="flex justify-center mt-4 mb-2">
          <Tooltip
            open
            message="아래에서 선택해주세요"
            messageAlign="center"
            placement="bottom"
            size="small"
            motionVariant="weak"
          >
            <span />
          </Tooltip>
        </div>
      )}
    </div>
  );
}
