import { useState } from "react";
import { Asset, Border, List, ListHeader, ListRow, Text, TextButton } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import type { CardSortCard, CardSortCategory } from "../model";

interface CardSortCreateOptionSectionProps {
  categories: CardSortCategory[];
  cards: CardSortCard[];
  onAddCategory: () => void;
  onEditCategory: (id: string) => void;
  onDeleteCategory: (id: string) => void;
  onAddCard: () => void;
  onEditCard: (id: string) => void;
  onDeleteCard: (id: string) => void;
}

interface CardGridItemProps {
  label: string;
  isDeleteMode: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

function CardGridItem({ label, isDeleteMode, onEdit, onDelete }: CardGridItemProps) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3"
      style={{
        minHeight: 64,
        borderRadius: 14,
        boxShadow: "inset 0 0 0 1px var(--token-tds-color-grey-300, #d1d6db)",
        backgroundColor: "white",
      }}
    >
      <Text
        typography="t6"
        color={adaptive.grey800}
        fontWeight="semibold"
        className="flex-1 mr-2"
      >
        {label}
      </Text>
      <button
        type="button"
        onClick={isDeleteMode ? onDelete : onEdit}
        aria-label={isDeleteMode ? "삭제" : "수정"}
        className="shrink-0"
      >
        <Asset.Icon
          name={isDeleteMode ? "icon-bin-mono" : "icon-pencil-18px-mono"}
          color={adaptive.grey400}
        />
      </button>
    </div>
  );
}

export function CardSortCreateOptionSection({
  categories,
  cards,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onAddCard,
  onEditCard,
  onDeleteCard,
}: CardSortCreateOptionSectionProps) {
  const [isCategoryDeleteMode, setIsCategoryDeleteMode] = useState(false);
  const [isCardDeleteMode, setIsCardDeleteMode] = useState(false);

  return (
    <>
      <ListHeader
        className="w-full"
        descriptionPosition="bottom"
        rightAlignment="center"
        titleWidthRatio={0.6}
        title={
          <ListHeader.TitleParagraph
            typography="t5"
            fontWeight="medium"
            color={adaptive.grey600}
          >
            카테고리 목록
          </ListHeader.TitleParagraph>
        }
        right={
          <div className="pr-5">
            <TextButton
              color={adaptive.blue500}
              typography="t5"
              fontWeight="medium"
              size="small"
              disabled={categories.length === 0}
              onClick={categories.length > 0 ? () => setIsCategoryDeleteMode((prev) => !prev) : undefined}
            >
              {isCategoryDeleteMode ? "저장하기" : "삭제하기"}
            </TextButton>
          </div>
        }
      />
      <List>
        <ListRow
          left={
            <ListRow.AssetIcon
              shape="original"
              name="icon-plus-grey-fill"
              color={adaptive.grey400}
              variant="fill"
            />
          }
          contents={
            <ListRow.Texts
              type="1RowTypeA"
              top="추가하기"
              topProps={{ color: adaptive.grey700 }}
            />
          }
          verticalPadding="large"
          onClick={categories.length < 3 ? onAddCategory : undefined}
        />
        {categories.map((category) => (
          <ListRow
            key={category.id}
            contents={
              <ListRow.Texts
                type="1RowTypeA"
                top={category.label}
                topProps={{ color: adaptive.grey800 }}
              />
            }
            right={
              <button
                type="button"
                onClick={() => {
                  if (isCategoryDeleteMode) {
                    onDeleteCategory(category.id);
                    if (categories.length === 1) setIsCategoryDeleteMode(false);
                  } else {
                    onEditCategory(category.id);
                  }
                }}
                aria-label={isCategoryDeleteMode ? "삭제" : "수정"}
              >
                <Asset.Icon
                  name={
                    isCategoryDeleteMode
                      ? "icon-bin-mono"
                      : "icon-pencil-18px-mono"
                  }
                  color={adaptive.grey400}
                />
              </button>
            }
            verticalPadding="large"
          />
        ))}
      </List>

      <div className="pt-2">
        <Border className="shrink-0" />
      </div>


      <ListHeader
        className="w-full"
        descriptionPosition="bottom"
        rightAlignment="center"
        titleWidthRatio={0.6}
        title={
          <ListHeader.TitleParagraph
            typography="t5"
            fontWeight="medium"
            color={adaptive.grey600}
          >
            카드 목록
          </ListHeader.TitleParagraph>
        }
        right={
          <div className="pr-5">
            <TextButton
              color={adaptive.blue500}
              typography="t5"
              fontWeight="medium"
              size="small"
              disabled={cards.length === 0}
              onClick={cards.length > 0 ? () => setIsCardDeleteMode((prev) => !prev) : undefined}
            >
              {isCardDeleteMode ? "저장하기" : "삭제하기"}
            </TextButton>
          </div>
        }
      />
      <List>
        <ListRow
          left={
            <ListRow.AssetIcon
              shape="original"
              name="icon-plus-grey-fill"
              color={adaptive.grey400}
              variant="fill"
            />
          }
          contents={
            <ListRow.Texts
              type="1RowTypeA"
              top="추가하기"
              topProps={{ color: adaptive.grey700 }}
            />
          }
          verticalPadding="large"
          onClick={cards.length < 12 ? onAddCard : undefined}
        />
      </List>
      {cards.length > 0 && (
        <div className="grid grid-cols-2 gap-x-2.5 gap-y-6 px-5 py-3">
          {cards.map((card) => (
            <CardGridItem
              key={card.id}
              label={card.label}
              isDeleteMode={isCardDeleteMode}
              onEdit={() => onEditCard(card.id)}
              onDelete={() => {
                onDeleteCard(card.id);
                if (cards.length === 1) setIsCardDeleteMode(false);
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}
