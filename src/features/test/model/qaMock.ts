import type { DraftTest, UserTest } from './types';
import type { TestDraftResponse } from '@/shared/api/generated/testDraft';

export const QA_MOCK_MY_TESTS: UserTest[] = [
  { id: 90001, title: '[QA] 진행중인 테스트', participantCount: 12, maxParticipantCount: 30, status: 'active' },
  { id: 90002, title: '[QA] 종료된 테스트', participantCount: 30, maxParticipantCount: 30, status: 'ended' },
  { id: 90003, title: '[QA] 검토중인 테스트', participantCount: 0, maxParticipantCount: 30, status: 'waiting' },
  { id: 90004, title: '[QA] 반려된 테스트', participantCount: 0, maxParticipantCount: 30, status: 'rejected' },
];

export const QA_MOCK_MY_DRAFTS: DraftTest[] = [
  { draftId: 90011, title: '[QA] 임시저장된 테스트', status: 'draft' },
  { draftId: 90012, title: '[QA] 등록 실패한 테스트', status: 'failed' },
];

export const QA_MOCK_FAILED_DRAFT_DETAIL: TestDraftResponse = {
  draftId: 90012,
  title: '[QA] 등록 실패한 테스트',
  description: 'QA용 등록 실패 초안이에요.',
  serviceName: '메이트 QA',
  serviceDescription: '등록 실패 상세 화면 확인을 위한 QA mock 데이터예요.',
  categories: ['DAILY'],
  status: 'PUBLISH_FAILED',
  questionsPayload: {
    questions: [
      {
        type: 'OBJECTIVE',
        title: '가장 먼저 보고 싶은 화면은 무엇인가요?',
        description: '객관식 질문 mock 데이터예요.',
        options: [
          { content: '홈 화면' },
          { content: '테스트 목록' },
          { content: '마이페이지' },
        ],
        minSelect: 1,
        maxSelect: 1,
      },
      {
        type: 'SUBJECTIVE',
        title: '불편했던 점을 자유롭게 적어주세요',
        description: '주관식 질문 mock 데이터예요.',
      },
    ],
  },
};
