import type { MyUser, Notice, ParticipateRecord, TestDetail } from './types';

export const mockNotices: Notice[] = [
  { id: 1, title: '중요한 공지가 있습니다', publishedAt: '2026. 05. 13' },
  { id: 2, title: '서비스 점검 안내 (5월 20일 새벽 2시~4시)', publishedAt: '2026. 05. 10' },
  { id: 3, title: '개인정보 처리방침 개정 안내', publishedAt: '2026. 04. 28' },
];

export const mockMyUser: MyUser = {
  name: '메이트',
  points: 3000,
};

export const mockParticipateRecords: ParticipateRecord[] = [
  { id: 1, title: '테스트명 한줄만 보이게아아아아아', participatedAt: '2026. 05. 13', earnedAmount: '+500원' },
  { id: 2, title: '앱 UI 개선 사용자 테스트', participatedAt: '2026. 05. 10', earnedAmount: '+500원' },
  { id: 3, title: '신규 온보딩 플로우 피드백', participatedAt: '2026. 04. 28', earnedAmount: '+500원' },
];

export const mockTestDetails: Record<number, TestDetail> = {
  1: {
    id: 1,
    name: '테스트명 한줄만 보이게아아아아아',
    categories: ['여행', '운동'],
    images: ['https://static.toss.im/appsintoss/33213/ac1b1d5e-c6d7-4943-9236-fcbd2bc825c0.png'],
    reward: '1,500원',
    summary: '테스트 한 줄 소개 최대 60자',
    serviceName: '메이트',
    serviceDescription: '서비스 소개 설명을 적어줍니다 메이커가 테스트 등록시에 적었던 서비스 소개 설명이 들어가게 됩니다',
    isEnded: false,
  },
  2: {
    id: 2,
    name: '앱 UI 개선 사용자 테스트',
    categories: ['IT', '앱'],
    images: ['https://static.toss.im/appsintoss/33213/ac1b1d5e-c6d7-4943-9236-fcbd2bc825c0.png'],
    reward: '2,000원',
    summary: '앱 UI 개선을 위한 사용자 피드백 수집',
    serviceName: '메이트',
    serviceDescription: '앱 UI 개선을 위해 사용자 경험을 수집합니다. 더 나은 서비스를 만들기 위한 소중한 의견을 들려주세요.',
    isEnded: true,
  },
  3: {
    id: 3,
    name: '신규 온보딩 플로우 피드백',
    categories: ['UX', '온보딩'],
    images: ['https://static.toss.im/appsintoss/33213/ac1b1d5e-c6d7-4943-9236-fcbd2bc825c0.png'],
    reward: '1,000원',
    summary: '신규 사용자 온보딩 경험 개선을 위한 테스트',
    serviceName: '메이트',
    serviceDescription: '신규 사용자가 서비스를 처음 접할 때의 경험을 개선하기 위한 피드백을 수집합니다.',
    isEnded: false,
  },
};
