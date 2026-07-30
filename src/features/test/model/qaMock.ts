import type { DraftTest, UserTest } from './types';

export const QA_MOCK_MY_TESTS: UserTest[] = [
  { id: 90001, title: '[QA] 진행중인 테스트', participantCount: 12, maxParticipantCount: 30, status: 'active' },
  { id: 90002, title: '[QA] 종료된 테스트', participantCount: 30, maxParticipantCount: 30, status: 'ended' },
  { id: 90003, title: '[QA] 검토중인 테스트', participantCount: 0, maxParticipantCount: 30, status: 'waiting' },
  { id: 90004, title: '[QA] 반려된 테스트', participantCount: 0, maxParticipantCount: 30, status: 'rejected' },
];

export const QA_MOCK_MY_DRAFTS: DraftTest[] = [
  { draftId: 90011, title: '[QA] 임시저장된 테스트', status: 'draft' },
];
