import { useState } from "react";
import { Asset, Spacing } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";

interface Props {
  images: string[];
}

export function TestDetailImageCarousel({ images }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
      <div className="px-5">
        <div
          className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-3"
          onScroll={(e) => {
            const target = e.target as HTMLDivElement;
            const index = Math.round(target.scrollLeft / target.clientWidth);
            setActiveIndex(index);
          }}
        >
          {images.map((src, i) => (
            <div
              key={i}
              className="snap-start shrink-0 w-full h-48.25 rounded-2xl bg-cover bg-center"
              style={{
                backgroundImage: `url(${src})`,
                boxShadow:
                  "inset 0 0 0 1px var(--token-tds-color-grey-opacity-100, rgba(2,32,71,0.05))",
              }}
            />
          ))}
        </div>
      </div>

      <Spacing size={16} />

      <div className="flex justify-center gap-1.5 p-2">
        {images.map((_, i) => (
          <Asset.Icon
            key={i}
            frameShape={{ width: 12, height: 12 }}
            backgroundColor="transparent"
            name="icon-circle-16-mono"
            color={i === activeIndex ? adaptive.greyOpacity500 : adaptive.greyOpacity300}
            aria-hidden
            ratio="1/1"
          />
        ))}
      </div>
    </>
  );
}
