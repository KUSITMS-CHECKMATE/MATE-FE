import type { TestStatus } from "@/shared/api/report";

// ─── 상태 배지 ────────────────────────────────────────────────────

type BadgeConfig = {
  text: string;
  color: "green" | "elephant" | "red" | "yellow";
  variant: "weak";
};

export const STATUS_BADGE: Record<TestStatus, BadgeConfig> = {
  WAITING: { text: "검토중", color: "yellow", variant: "weak" },
  IN_PROGRESS: { text: "진행중", color: "green", variant: "weak" },
  COMPLETED: { text: "종료", color: "elephant", variant: "weak" },
  REJECTED: { text: "반려", color: "red", variant: "weak" },
};

// ─── 내부 검토 기준 정책 항목 ─────────────────────────────────────

export const REVIEW_POLICY_ITEMS = [
  { title: "디지털 자산 및 가상자산 관련 서비스", desc: "디지털 자산의 소유, 이전, 저장, 거래, 중개, 발행(NFT 포함) 등의 기능을 제공하는 서비스는 법적 요건 충족 여부와 관계없이 토스 플랫폼에서는 자산 손실, 소비자 피해, 자금세탁 리스크에 따라 등록이 불가해요." },
  { title: "자금세탁 가능성이 있는 서비스", desc: "미니앱 내에서 현금 또는 유사 자산의 직접적인 교환, 전환, 환불 기능이 포함된 경우, 거래 구조상 자금세탁 통로로 악용될 수 있기 때문에 등록이 불가해요." },
  { title: "불법 또는 부정행위를 조장하는 서비스", desc: "법적으로 금지되거나 사회적 물의를 일으킬 수 있는 신분 조작, 해킹, 불법 문서 제공, 정보 수집 우회 등의 기능이 포함된 서비스는 명백히 등록이 불가해요." },
  { title: "사행성 및 복권/베팅성 콘텐츠 포함 서비스", desc: "사행성 요소가 포함된 콘텐츠는 사용자 재산상 손실, 중독 유발, 연령 제한 문제 등으로 위법 소지가 있으며, 사용자 보호 및 서비스 신뢰도 확보를 위해 등록이 불가해요." },
  { title: "금융 상품 중개 · 판매 · 광고 서비스", desc: "대출, 보험, 카드, 증권 등 금융 상품 관련 서비스는 법적 인허가 여부와 관계없이 소비자 보호, 금융정보의 정확성, 오인 가능성 등으로 인한 운영 리스크를 방지하기 위해 등록이 불가능하며, 향후 내부 정책 및 기준 정비에 따라 오픈 여부가 검토될 수 있어요." },
  { title: "투자 자문, 리딩방, 유료 정보 제공 서비스", desc: "특정 종목 추천이나 투자 전략 안내 등으로 개인 투자자의 의사결정에 영향을 미치는 서비스는 운영 리스크 및 정책적 수용 미비로 인해 등록이 불가해요." },
  { title: "의료 관련 서비스", desc: "비대면 진료 제공 또는 연결, 의료 행위로의 직접적인 연결, 병원 예약 기능, 병원으로부터 광고비를 수취하는 구조(유저 유입 기반 수익 모델), 병원 홍보/마케팅으로 해석될 수 있는 수익 구조 등의 경우 서비스 출시가 불가해요." },
  { title: "이외 내부 정책상 승인 불가 서비스", desc: "법률 위반 여부와 관계없이 토스의 브랜드 신뢰성, UX 정책, 리스크 관리 방침에 따라 등록이 제한될 수 있어요." },
] as const;

// ─── 오버레이 애니메이션 ──────────────────────────────────────────

export const OVERLAY_MOTION = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
} as const;
