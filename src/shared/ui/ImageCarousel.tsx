import { Asset } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { useImageCarousel } from "@/shared/lib/useImageCarousel";

interface Props {
  images: string[];
}

export function ImageCarousel({ images }: Props) {
  const { currentIndex, touchHandlers } = useImageCarousel(images.length);

  return (
    <div className="flex flex-col items-center px-4 gap-2">
      <div
        className="w-full h-[193px] rounded-2xl bg-cover bg-center"
        style={{
          backgroundImage: `url(${images[currentIndex]})`,
          boxShadow:
            "inset 0 0 0 1px var(--token-tds-color-grey-opacity-100, rgba(2,32,71,0.05))",
        }}
        {...touchHandlers}
      />
      <div className="flex flex-row gap-1 items-center p-2 mb-3">
        {images.map((_, i) => (
          <Asset.Icon
            key={i}
            frameShape={{ width: 12, height: 12 }}
            backgroundColor="transparent"
            name="icon-circle-16-mono"
            color={
              i === currentIndex
                ? adaptive.greyOpacity500
                : adaptive.greyOpacity300
            }
            aria-hidden={true}
            ratio="1/1"
          />
        ))}
      </div>
    </div>
  );
}
