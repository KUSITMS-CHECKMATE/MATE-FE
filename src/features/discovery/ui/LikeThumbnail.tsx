import { IconButton } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";

interface Props {
  thumbnailUrl: string;
  isLiked: boolean;
  onToggleLike: () => void;
  className?: string;
}

// 썸네일 + 하단 그라데이션 위 찜 버튼. 썸네일이 없으면 grey300 배경만 보인다.
export function LikeThumbnail({ thumbnailUrl, isLiked, onToggleLike, className = "" }: Props) {
  return (
    <div
      className={`relative shrink-0 rounded-2xl bg-cover bg-center overflow-hidden flex flex-col justify-end ${className}`}
      style={{
        backgroundColor: adaptive.grey300,
        backgroundImage: thumbnailUrl ? `url(${thumbnailUrl})` : undefined,
        boxShadow: `inset 0 0 0 1px ${adaptive.greyOpacity100}`,
      }}
    >
      <div
        className="w-full h-12 flex flex-row justify-end items-center pb-1"
        style={{ background: `linear-gradient(180deg, rgba(0,23,51,0) 0%, ${adaptive.greyOpacity500} 301.68%)` }}
      >
        {/* IconButton은 터치 영역용 padding(12px)이 있어 아이콘이 디자인의 padding 24 위치에 오도록 상쇄 */}
        <div className="flex">
          <IconButton
            src={
              isLiked
                ? "https://static.toss.im/icons/png/4x/icon-heart-filled.png"
                : "https://static.toss.im/icons/png/4x/icon-heart-gradient.png"
            }
            iconSize={24}
            variant="clear"
            aria-label={isLiked ? "좋아요 취소" : "좋아요"}
            onClick={(e) => {
              e.stopPropagation();
              onToggleLike();
            }}
          />
        </div>
      </div>
    </div>
  );
}
