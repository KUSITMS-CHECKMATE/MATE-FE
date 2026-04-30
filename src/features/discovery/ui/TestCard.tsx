import { Asset, Text } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";

type Props = {
  title: string;
  description: string;
  reward: number;
  thumbnailUrl: string;
  onClick?: () => void;
};

export function TestCard({ title, description, reward, thumbnailUrl, onClick }: Props) {
  return (
    <div
      className="w-full rounded-2xl bg-white overflow-visible flex flex-col gap-3 cursor-pointer"
      onClick={onClick}
    >
      {/* 썸네일 */}
      <div
        className="w-full h-[193px] rounded-2xl bg-cover bg-center"
        style={{
          backgroundImage: `url(${thumbnailUrl})`,
          boxShadow:
            "inset 0 0 0 1px var(--token-tds-color-grey-opacity-100, rgba(2,32,71,0.05))",
        }}
      />

      {/* 텍스트 */}
      <div className="w-full flex flex-col gap-0.5">
        {/* 제목 + 리워드 */}
        <div className="w-full flex flex-row gap-3 justify-between items-start">
          <Text
            display="block"
            color={adaptive.grey800}
            typography="st8"
            fontWeight="semibold"
            className="flex-1 line-clamp-1"
          >
            {title}
          </Text>
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
        <Text
          display="block"
          color={adaptive.grey600}
          typography="t6"
          fontWeight="regular"
          className="line-clamp-1"
        >
          {description}
        </Text>
      </div>
    </div>
  );
}
