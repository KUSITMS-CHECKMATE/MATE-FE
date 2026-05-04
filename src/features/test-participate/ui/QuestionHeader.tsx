import { Top } from "@toss/tds-mobile";

/**
 * 질문 헤더 공용 컴포넌트
 *
 * 모든 질문 유형(주관식, 객관식, 트리, 5초 테스트 등)에서
 * 카테고리 배지 · 제목 · 설명을 동일한 레이아웃으로 렌더링할 때 사용합니다.
 *
 * @example
 * // 각 질문 유형 UI에서 이렇게 가져다 쓰세요.
 * <QuestionHeader
 *   categoryLabel="주관식"
 *   title="오늘의 기분이 어떤지 작성해주세요"
 *   description="솔직하게 답변해 주세요"
 * />
 */

interface QuestionHeaderProps {
  /** 질문 유형을 나타내는 배지 텍스트 (예: "주관식", "객관식") */
  categoryLabel: string;
  /** 질문 제목 */
  title: string;
  /** 질문 부연 설명 (선택). 없으면 렌더링하지 않음 */
  description?: string;
}

export function QuestionHeader({ categoryLabel, title, description }: QuestionHeaderProps) {
  return (
    <Top
      title={
        <Top.TitleParagraph size={22}>
          {title}
        </Top.TitleParagraph>
      }
      subtitleTop={
        <Top.SubtitleBadges
          badges={[{ text: categoryLabel, color: "elephant", variant: "weak" }]}
        />
      }
      subtitleBottom={
        description ? (
          <Top.SubtitleParagraph size={15}>{description}</Top.SubtitleParagraph>
        ) : undefined
      }
    />
  );
}
