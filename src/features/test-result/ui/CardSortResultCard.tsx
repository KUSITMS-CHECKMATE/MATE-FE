import { useState } from "react";
import { Asset, Badge, IconButton, Spacing, Text } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { CardWrapper } from "./_shared";

export interface CardSortItem {
  rank: string;
  label: string;
  count: number;
  percentage: number;
  isHighlight: boolean;
}

export interface CardSortCategory {
  name: string;
  items: CardSortItem[];
}

interface Props {
  title: string;
  categories: CardSortCategory[];
}

export function CardSortResultCard({ title, categories }: Props) {
  const [openCategory, setOpenCategory] = useState<string>(categories[0]?.name ?? "");

  return (
    <CardWrapper>
      <div className="w-full bg-white flex flex-col gap-1 justify-start items-start">
        <Badge size="small" variant="weak" color="elephant">카드소팅</Badge>
        <Text color={adaptive.grey800} typography="t5" fontWeight="bold">{title}</Text>
      </div>
      <Spacing size={16} />
      <div className="w-full bg-white flex flex-col gap-3 justify-start items-center">
        {categories.map((category) => {
          const isOpen = openCategory === category.name;
          return (
            <div key={category.name} className="w-full bg-[#f2f4f6] rounded-2xl p-3">
              <div className="w-full flex flex-row justify-between items-center">
                <Text display="block" color={adaptive.grey700} typography="t5" fontWeight="semibold">
                  {category.name}
                </Text>
                <IconButton
                  src={
                    isOpen
                      ? "https://static.toss.im/icons/png/4x/icon-chip-arrow-up-mono.png"
                      : "https://static.toss.im/icons/png/4x/icon-chip-arrow-down-mono.png"
                  }
                  variant="clear"
                  color={adaptive.grey600}
                  aria-label=""
                  onClick={() => setOpenCategory(isOpen ? "" : category.name)}
                />
              </div>
              <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{ maxHeight: isOpen ? "500px" : "0px" }}
              >
                <div className="w-full flex flex-col gap-3 items-center pt-4">
                  {category.items.map((item, i) => (
                    <div key={i} className="w-full flex flex-row justify-between items-center">
                      <div className="flex-1 flex flex-row gap-2 justify-start items-center">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: item.isHighlight ? "#4365cc" : adaptive.grey500 }}
                        >
                          <Asset.Icon
                            frameShape={Asset.frameShape.CleanW20}
                            backgroundColor="transparent"
                            name={item.rank}
                            color="white"
                            scale={0.6}
                            aria-hidden={true}
                            ratio="1/1"
                          />
                        </div>
                        <Text display="block" color={item.isHighlight ? "#4365cc" : adaptive.grey700} typography="t7" fontWeight="semibold">
                          {item.label}
                        </Text>
                      </div>
                      <Text color={item.isHighlight ? "#4365cc" : adaptive.grey700} typography="t7" fontWeight="semibold">
                        {item.count}개 ({item.percentage}%)
                      </Text>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </CardWrapper>
  );
}
