export interface ScaleQuestionData {
  title: string;
  description: string;
  scaleCount: 5 | 7;
  minLabel: string;
  maxLabel: string;
  /** 질문용 선택 이미지 (data URI 등) */
  imageUrl?: string;
}
