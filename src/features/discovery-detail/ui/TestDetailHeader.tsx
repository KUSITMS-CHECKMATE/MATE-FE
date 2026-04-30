import { Top } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";

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
            text: tag,
            color: "elephant" as const,
            variant: "weak" as const,
          }))}
        />
      }
      lower={
        <Top.LowerButton
          color="primary"
          size="small"
          variant="weak"
          display="inline"
        >
          어떤 서비스인가요?
        </Top.LowerButton>
      }
    />
  );
}
