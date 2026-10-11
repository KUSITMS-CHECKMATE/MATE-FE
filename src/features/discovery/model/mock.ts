import type { ClosedTest, DiscoveryTest } from "./types";

// TODO: 리워드 캐러셀 콘텐츠 미정 — 임시 이미지
export const REWARD_CAROUSEL_IMAGES = [
  "/images/banner_1.png",
  "/images/banner_2.png",
  "/images/banner_3.png",
  "/images/banner_4.png",
  "/images/banner_5.png",
];

// TODO: 종료 테스트 목록 API 없음 (백엔드 요청 필요) — API 나오면 교체
export const MOCK_CLOSED_TESTS: ClosedTest[] = [
  {
    id: 1,
    title: "테스트 등록, 처음봐도 이해되나요?",
    thumbnailUrl: "https://static.toss.im/3d-emojis/u1F4F1.png",
    categories: ["DAILY", "COMMUNITY", "BUSINESS"],
  },
  {
    id: 2,
    title: "운동 기록 탭 첫인상 테스트",
    thumbnailUrl: "https://static.toss.im/3d-emojis/u1F3C3.png",
    categories: ["HEALTH", "DAILY"],
  },
  {
    id: 3,
    title: "커뮤니티 글쓰기, 5초 테스트",
    thumbnailUrl: "https://static.toss.im/3d-emojis/u1F4F8.png",
    categories: ["PUBLIC_ADMIN", "COMMUNITY", "BUSINESS"],
  },
  {
    id: 4,
    title: "식단 서비스명, 첫인상이 어떤가요?",
    thumbnailUrl: "https://static.toss.im/3d-emojis/u1F957.png",
    categories: ["FOOD", "HEALTH"],
  },
];

// TODO: 임시 — 로컬에서 참여 가능 목록 확인용. API 데이터 확인 후 route의 USE_MOCK_AVAILABLE_TESTS를 false로
export const MOCK_AVAILABLE_TESTS: DiscoveryTest[] = [
  { id: 101, title: "팀플 일정 조율, 바로 이해되나요?", description: "", reward: 400, thumbnailUrl: "https://static.toss.im/3d-emojis/u1F4C5.png", liked: false, categories: ["PUBLIC_ADMIN", "COMMUNITY", "BUSINESS"] },
  { id: 102, title: "반려동물 병원 찾기 지도 UX 테스트, 급할 때도 쉽게 찾을 수 있나요?", description: "", reward: 600, thumbnailUrl: "https://static.toss.im/3d-emojis/u1F436.png", liked: true, categories: ["HEALTH", "INFORMATION"] },
  { id: 103, title: "판매자 신뢰도 판단 테스트", description: "", reward: 1000, thumbnailUrl: "https://static.toss.im/3d-emojis/u1F4AC.png", liked: false, categories: ["SHOPPING", "COMMUNITY"] },
  { id: 104, title: "운동 기록 탭 첫인상 테스트", description: "", reward: 500, thumbnailUrl: "https://static.toss.im/3d-emojis/u1F3C3.png", liked: false, categories: ["HEALTH", "DAILY", "AI"] },
  { id: 105, title: "식단 서비스명, 첫인상이 어떤가요?", description: "", reward: 200, thumbnailUrl: "", liked: false, categories: ["FOOD"] },
  { id: 106, title: "커뮤니티 글쓰기, 5초 테스트", description: "", reward: 700, thumbnailUrl: "https://static.toss.im/3d-emojis/u1F4F8.png", liked: false, categories: ["CONTENT", "SOCIAL", "COMMUNITY"] },
  { id: 107, title: "여행 일정 공유 화면 테스트", description: "", reward: 300, thumbnailUrl: "https://static.toss.im/3d-emojis/u1F4F1.png", liked: false, categories: ["TRAVEL"] },
];
