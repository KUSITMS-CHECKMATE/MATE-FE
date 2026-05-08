import { useState } from "react";
import { Asset, Text } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";

type Props = {
  title: string;
  description: string;
  reward: number;
  thumbnailUrl: string;
  liked: boolean;
  onClick?: () => void;
};

export function TestCard({
  title,
  description,
  reward,
  thumbnailUrl,
  liked,
  onClick,
}: Props) {
  const [isLiked, setIsLiked] = useState(liked);

  return (
    <div
      className="w-full rounded-2xl bg-white overflow-visible flex flex-col gap-3 cursor-pointer"
      onClick={onClick}
    >
      {/* 썸네일 */}
      <div
        className="w-full h-48.25 rounded-2xl bg-cover bg-center overflow-hidden flex flex-col justify-end"
        style={{
          backgroundImage: `url(${thumbnailUrl})`,
          boxShadow:
            "inset 0 0 0 1px var(--token-tds-color-grey-opacity-100, rgba(2,32,71,0.05))",
        }}
      >
        <div
          className="w-full h-20 flex flex-row justify-end items-center px-6"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,23,51,0) 0%, rgba(3,24,50,0.46) 100%)",
          }}
        >
          <button
            aria-label={isLiked ? "좋아요 취소" : "좋아요"}
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked((prev) => !prev);
            }}
          >
            <Asset.Image
              frameShape={{ width: 24, height: 24 }}
              backgroundColor="transparent"
              src={
                isLiked
                  ? "https://static.toss.im/icons/png/4x/icon-heart-filled.png"
                  : "https://static.toss.im/icons/png/4x/icon-heart-gradient.png"
              }
              aria-hidden={true}
            />
          </button>
        </div>
      </div>

      {/* 텍스트 */}
      <div className="w-full flex flex-col gap-0.5">
        {/* 제목 + 리워드 */}
        <div className="w-full flex flex-row justify-between items-start">
          <div className="flex-1 overflow-hidden">
            <Text
              display="block"
              color={adaptive.grey800}
              typography="st8"
              fontWeight="semibold"
              className="truncate"
            >
              {title}
            </Text>
          </div>
          <div className="flex flex-row gap-1 items-center shrink-0">
            <Asset.Icon
              frameShape={Asset.frameShape.CleanW24}
              backgroundColor="transparent"
              name="icon-coin-yellow"
              aria-hidden={true}
              ratio="1/1"
            />
            <Text color={adaptive.grey800} typography="st8" fontWeight="bold">
              {reward}
            </Text>
          </div>
        </div>

        {/* 소개 */}
        <div className="overflow-hidden">
          <Text
            display="block"
            color={adaptive.grey600}
            typography="t6"
            fontWeight="regular"
            className="truncate"
          >
            {description}
          </Text>
        </div>
      </div>
    </div>
  );
}
