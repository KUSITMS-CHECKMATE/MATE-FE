import type { ParticipateQuestion } from "../model/types";
import { QUESTION_TYPE_LABEL } from "../model";
import { QuestionHeader } from "./QuestionHeader";

/**
 * 질문 유형별 응답 UI가 아직 구현되지 않은 경우 렌더링되는 플레이스홀더 뷰.
 *
 * 각 유형별 UI를 개발할 때는 QuestionRenderer의 switch 분기에서
 * 해당 유형의 전용 컴포넌트로 교체하고, QuestionHeader를 직접 사용하세요.
 * 카테고리 레이블은 model/constants.ts의 QUESTION_TYPE_LABEL을 사용합니다.
 *
 * @see QuestionHeader - 카테고리 배지 · 제목 · 설명 공용 헤더
 * @see QuestionRenderer - 유형별 라우팅 진입점
 * @see QUESTION_TYPE_LABEL - 유형별 한글 레이블
 */

interface Props {
  question: ParticipateQuestion;
}

export function EmptyAnswerView({ question }: Props) {
  const { title, description } = question.data;

  return (
    <QuestionHeader
      categoryLabel={QUESTION_TYPE_LABEL[question.type]}
      title={title}
      description={description}
    />
  );
}
