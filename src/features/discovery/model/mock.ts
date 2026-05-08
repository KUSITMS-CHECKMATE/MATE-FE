import type { DiscoveryTest } from "./types";

export const MOCK_DISCOVERY_TESTS: DiscoveryTest[] = [
  {
    id: 1,
    title: "MATE 테스트 등록 화면, 처음 봤을 때 이해가 되나요?",
    description: "질문 유형 선택부터 등록 완료까지 흐름이 자연스러운지 피드백 부탁드려요.",
    reward: 300,
    thumbnailUrl: "https://static.toss.im/3d-emojis/u1F4F1.png",
  },
  {
    id: 2,
    title: "운동 기록 탭 첫인상 테스트",
    description: "앱을 처음 열었을 때 어떤 기능으로 보이는지 직관적으로 답해주세요.",
    reward: 500,
    thumbnailUrl: "https://static.toss.im/3d-emojis/u1F3C3.png",
  },
  {
    id: 3,
    title: "메이트 커뮤니티 글쓰기 플로우 5초 테스트",
    description: "짧게 이미지를 본 뒤 어떤 서비스인지 얼마나 기억나는지 확인해요.",
    reward: 700,
    thumbnailUrl: "https://static.toss.im/3d-emojis/u1F4F8.png",
  },
  {
    id: 4,
    title: "식단 기록 서비스 이름, 어떤 인상이 드는지 알려주세요",
    description: "브랜드 톤이 건강하게 느껴지는지, 혹은 부담스럽게 느껴지는지 궁금해요.",
    reward: 200,
    thumbnailUrl: "https://static.toss.im/3d-emojis/u1F957.png",
  },
  {
    id: 5,
    title: "중고거래 채팅방에서 판매자 신뢰도를 어떻게 판단하는지 테스트",
    description: "대화 화면만 보고 거래를 이어갈지 빠르게 선택해 주세요.",
    reward: 1000,
    thumbnailUrl: "https://static.toss.im/3d-emojis/u1F4AC.png",
  },
  {
    id: 7,
    title: "대학생 팀플 일정 조율 서비스, 처음 봤을 때 이해되나요?",
    description: "복잡한 설명 없이도 핵심 기능이 보이는지 확인하고 싶어요.",
    reward: 400,
    thumbnailUrl: "https://static.toss.im/3d-emojis/u1F4C5.png",
  },
  {
    id: 8,
    title: "반려동물 병원 찾기 지도 UX 테스트",
    description: "급한 상황에서 가까운 병원을 빠르게 찾을 수 있을지 평가해주세요.",
    reward: 600,
    thumbnailUrl: "https://static.toss.im/3d-emojis/u1F436.png",
  },
];
