import { useRef, useState } from "react";
import { Asset, ListHeader, Text } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";

interface Props {
  images: string[];
}

export function RewardCarousel({ images }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollTo = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
  };

  const move = (step: number) => scrollTo((activeIndex + step + images.length) % images.length);

  return (
    <>
      <ListHeader
        size="large"
        horizontalPadding="medium"
        verticalPadding="small"
        descriptionPosition="bottom"
        rightAlignment="center"
        a11yRightReflow={false}
        titleWidthRatio={0.6}
        title={
          <ListHeader.TitleParagraph color={adaptive.grey800}>
            1분 응답하고
            <br />
            리워드 지급 받기
          </ListHeader.TitleParagraph>
        }
      />
      <div className="px-6">
        <div className="relative aspect-[670/288] rounded-2xl overflow-hidden" style={{ backgroundColor: adaptive.grey200 }}>
          <div
            ref={scrollRef}
            className="flex h-full overflow-x-auto scrollbar-hide snap-x snap-mandatory"
            onScroll={(e) => {
              const target = e.currentTarget;
              setActiveIndex(Math.round(target.scrollLeft / target.clientWidth));
            }}
          >
            {images.map((src, i) => (
              <div
                key={src}
                className="snap-start shrink-0 w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${src})` }}
                aria-hidden={i !== activeIndex}
              />
            ))}
          </div>

          {images.length > 1 && (
            <div className="absolute right-3 bottom-3 flex flex-row items-center gap-1 rounded-full bg-white px-2 py-1">
              <button type="button" aria-label="이전 배너" onClick={() => move(-1)} className="flex rotate-180">
                <Asset.Icon
                  frameShape={{ width: 12, height: 12 }}
                  backgroundColor="transparent"
                  name="icon-arrow-right-textbutton-thin-mono"
                  color={adaptive.grey600}
                  aria-hidden={true}
                  ratio="1/1"
                />
              </button>
              <Text color={adaptive.grey600} typography="st13" fontWeight="medium">
                {`${activeIndex + 1}/${images.length}`}
              </Text>
              <button type="button" aria-label="다음 배너" onClick={() => move(1)} className="flex">
                <Asset.Icon
                  frameShape={{ width: 12, height: 12 }}
                  backgroundColor="transparent"
                  name="icon-arrow-right-textbutton-thin-mono"
                  color={adaptive.grey600}
                  aria-hidden={true}
                  ratio="1/1"
                />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
