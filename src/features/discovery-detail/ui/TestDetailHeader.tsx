import { Top } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { CATEGORY_LABEL } from "@/shared/constants/categories";

interface Props {
  title: string;
  tags: string[];
}

export function TestDetailHeader({ title, tags }: Props) {
  return (
    <Top
      title={
        <Top.TitleParagraph size={22} color={adaptive.grey900}>
          {title}
        </Top.TitleParagraph>
      }
      subtitleBottom={
        <Top.SubtitleBadges
          badges={tags.map((tag) => ({
            text: CATEGORY_LABEL[tag] ?? tag,
            color: "elephant" as const,
            variant: "weak" as const,
          }))}
        />
      }
    />
  );
}
