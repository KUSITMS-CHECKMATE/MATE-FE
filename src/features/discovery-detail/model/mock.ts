export interface DiscoveryTestDetail {
  title: string;
  tags: string[];
  reward: number;
  description: string;
  images: string[];
}

export const MOCK_TEST_DETAILS: Record<string, DiscoveryTestDetail> = {
  "1": {
    title: "여행 일정 추천 화면, 어디서 가장 많이 막히는지 봐주세요",
    tags: ["여행", "추천"],
    reward: 300,
    description:
      "항공권부터 숙소까지 고르는 흐름을 보고, 어디서 선택이 어려워지는지 알려주세요. 여행을 자주 가는 분이 아니어도 괜찮아요.",
    images: [
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  "2": {
    title: "운동 기록 탭 첫인상 테스트",
    tags: ["운동", "헬스케어"],
    reward: 500,
    description:
      "운동 기록 탭을 처음 봤을 때 어떤 기능이 중심인지, 기록을 남기고 싶다는 생각이 드는지 확인하고 싶어요.",
    images: [
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1571019613914-85f342c55f55?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  "3": {
    title: "메이트 커뮤니티 글쓰기 플로우 5초 테스트",
    tags: ["커뮤니티", "5초 테스트"],
    reward: 700,
    description:
      "짧게 화면을 본 뒤 어떤 서비스인지, 무엇을 할 수 있는지 기억나는 만큼 답해주세요. 첫인상과 정보 전달력을 함께 봅니다.",
    images: [
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  "4": {
    title: "식단 기록 서비스 이름, 어떤 인상이 드는지 알려주세요",
    tags: ["식단", "브랜딩"],
    reward: 200,
    description:
      "서비스 이름과 소개만 보고 건강한 느낌이 드는지, 너무 딱딱하거나 부담스럽지는 않은지 솔직한 인상을 듣고 싶어요.",
    images: [
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  "5": {
    title: "중고거래 채팅방에서 판매자 신뢰도를 어떻게 판단하는지 테스트",
    tags: ["중고거래", "채팅"],
    reward: 1000,
    description:
      "채팅 화면과 상품 맥락만 보고 거래를 이어갈지 판단해 주세요. 어떤 표현이나 정보가 신뢰에 영향을 주는지 알고 싶어요.",
    images: [
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  "6": {
    title: "아이 돌봄 예약 화면, 부모 입장에서 안심되는지 봐주세요",
    tags: ["육아", "예약"],
    reward: 800,
    description:
      "예약 전 꼭 확인하고 싶은 정보가 충분한지, 처음 보는 보호자도 불안하지 않게 느낄 수 있는지 확인하려고 해요.",
    images: [
      "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  "7": {
    title: "대학생 팀플 일정 조율 서비스, 처음 봤을 때 이해되나요?",
    tags: ["대학생", "생산성"],
    reward: 400,
    description:
      "팀플 일정 조율 서비스의 핵심 가치가 한눈에 들어오는지 보고 싶어요. 처음 접한 사람도 바로 써보고 싶어지는지가 중요해요.",
    images: [
      "https://images.unsplash.com/photo-1522202195461-b23f0f91b306?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  "8": {
    title: "반려동물 병원 찾기 지도 UX 테스트",
    tags: ["반려동물", "지도"],
    reward: 600,
    description:
      "급한 상황에서 가까운 병원을 얼마나 빠르게 찾을 수 있는지, 지도와 리스트 구성이 직관적인지 확인해 주세요.",
    images: [
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=1200&q=80",
    ],
  },
};

export function getMockTestDetail(testId: string): DiscoveryTestDetail {
  return MOCK_TEST_DETAILS[testId] ?? MOCK_TEST_DETAILS["1"];
}
