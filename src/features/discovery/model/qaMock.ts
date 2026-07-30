import type { DiscoveryTest } from './types';
import type { TestDetailResponse } from '@/shared/api/generated/test';

export const QA_MOCK_DISCOVERY_TESTS: DiscoveryTest[] = [
  {
    id: 90101,
    title: '[QA] 참여 가능한 테스트',
    description: '정상적으로 참여할 수 있는 상태예요.',
    reward: 500,
    thumbnailUrl: 'https://static.toss.im/3d-emojis/u1F4F1.png',
    liked: false,
  },
  {
    id: 90102,
    title: '[QA] 검토중인 테스트',
    description: '아직 검토중이라 참여할 수 없어요.',
    reward: 500,
    thumbnailUrl: 'https://static.toss.im/3d-emojis/u1F4F1.png',
    liked: false,
  },
  {
    id: 90103,
    title: '[QA] 종료된 테스트',
    description: '모집이 종료됐어요.',
    reward: 500,
    thumbnailUrl: 'https://static.toss.im/3d-emojis/u1F4F1.png',
    liked: false,
  },
  {
    id: 90104,
    title: '[QA] 이미 참여한 테스트',
    description: '이미 참여를 완료했어요.',
    reward: 500,
    thumbnailUrl: 'https://static.toss.im/3d-emojis/u1F4F1.png',
    liked: false,
  },
];

const BASE_DETAIL = {
  categories: ['IT', '앱'],
  imageUrls: ['https://static.toss.im/appsintoss/33213/ac1b1d5e-c6d7-4943-9236-fcbd2bc825c0.png'],
  reward: 500,
  description: 'QA용 mock 테스트 상세 설명이에요.',
  serviceName: '메이트',
  serviceDescription: 'QA를 위한 mock 서비스 소개예요.',
};

export const QA_MOCK_TEST_DETAILS: Record<number, TestDetailResponse> = {
  90101: { id: 90101, title: '[QA] 참여 가능한 테스트', testStatus: 'IN_PROGRESS', hasResponded: false, ...BASE_DETAIL },
  90102: { id: 90102, title: '[QA] 검토중인 테스트', testStatus: 'WAITING', hasResponded: false, ...BASE_DETAIL },
  90103: { id: 90103, title: '[QA] 종료된 테스트', testStatus: 'COMPLETED', hasResponded: false, ...BASE_DETAIL },
  90104: { id: 90104, title: '[QA] 이미 참여한 테스트', testStatus: 'IN_PROGRESS', hasResponded: true, ...BASE_DETAIL },
};
