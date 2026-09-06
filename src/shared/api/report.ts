import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { getReport } from "./generated/report";

// ─── 공통 ────────────────────────────────────────────────────────────────────

export type QuestionType =
  | "SUBJECTIVE"
  | "OBJECTIVE"
  | "FIVE_SECOND"
  | "SCALE"
  | "AB_TEST"
  | "CARD_SORTING"
  | "TREE_TEST";

export type TestStatus = "WAITING" | "IN_PROGRESS" | "COMPLETED" | "REJECTED";
export type ReportStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

// ─── AI 클러스터 ──────────────────────────────────────────────────────────────

export interface Cluster {
  representative: string;
  count: number;
  responses: string[];
}

// ─── result 타입 (type별 discriminated union) ─────────────────────────────────

export interface SubjectiveResult {
  aiSummary: string;
  clusters: Cluster[];
  texts: string[];
}

export interface ObjectiveOption {
  optionId: number;
  content: string;
  count: number;
  ratio: number;
}

export interface ObjectiveResult {
  options: ObjectiveOption[];
  aiSummary: string;
  clusters: Cluster[];
  otherTexts?: string[];
}

/** FIVE_SECOND는 주관식(texts) / 객관식(options) 둘 다 가능 */
export type FiveSecondResult =
  | { aiSummary: string; clusters: Cluster[]; texts: string[] }
  | { options: ObjectiveOption[]; aiSummary: string; clusters: Cluster[]; otherTexts?: string[] };

export interface ScaleResult {
  average: number;
  mostVoted: number;
  endValue: { minLabel: string; maxLabel: string };
  distribution: { score: number; count: number }[];
}

export interface AbTestResult {
  A: { count: number; ratio: number };
  B: { count: number; ratio: number };
}

export interface CardSortingResult {
  byCard: { cardName: string; categories: Record<string, number> }[];
  byCategory: {
    category: string;
    cards: { rank: number; cardName: string; count: number; ratio: number }[];
  }[];
}

export interface TreeTestResult {
  nodeFrequency: { nodeId: number; label: string; count: number; ratio: number }[];
  pathFrequency: { path: number[]; pathLabels: string[]; count: number }[];
}

// ─── reports[] 항목 ───────────────────────────────────────────────────────────

type ReportBase = { questionId: number; sequence: number; title: string };

export type ReportItem =
  | (ReportBase & { type: "SUBJECTIVE"; result: SubjectiveResult })
  | (ReportBase & { type: "OBJECTIVE"; result: ObjectiveResult })
  | (ReportBase & { type: "FIVE_SECOND"; result: FiveSecondResult })
  | (ReportBase & { type: "SCALE"; result: ScaleResult })
  | (ReportBase & { type: "AB_TEST"; result: AbTestResult })
  | (ReportBase & { type: "CARD_SORTING"; result: CardSortingResult })
  | (ReportBase & { type: "TREE_TEST"; result: TreeTestResult });

// ─── 최상위 응답 ──────────────────────────────────────────────────────────────

export interface ReportData {
  testStatus: TestStatus;
  reportStatus: ReportStatus;
  questionCount: number;
  participantCount: number;
  reports: ReportItem[];
}

export interface ReportResponse {
  success: boolean;
  code: string;
  message: string;
  data: ReportData;
}

// ─── useQuery 훅 ──────────────────────────────────────────────────────────────

/** 종료 직후 리포트 집계 구간 폴링 설정: 5초 간격, 최대 60초 후 중단 */
const AGGREGATING_POLL_INTERVAL = 5_000;
const AGGREGATING_POLL_TIMEOUT = 60_000;

export const useGetReportQuery = (testId: number) => {
  // 집계 중(testStatus COMPLETED · reportStatus IN_PROGRESS) 진입 시각. 폴링 상한 계산용.
  const pollStartedAtRef = useRef<number | null>(null);

  return useQuery({
    queryKey: ["report", testId],
    queryFn: async () => {
      const res = await getReport(testId);
      return res.data as ReportResponse;
    },
    enabled: !!testId,
    // 테스트 종료 후 리포트 집계가 끝날 때까지만 폴링한다.
    // 집계는 보통 수십 초 내 완료되므로 60초까지만 시도하고 이후엔 중단(자동 갱신 없음).
    refetchInterval: (query) => {
      const data = query.state.data?.data;
      const isAggregating =
        data?.testStatus === "COMPLETED" && data?.reportStatus === "IN_PROGRESS";

      if (!isAggregating) {
        pollStartedAtRef.current = null;
        return false;
      }
      if (pollStartedAtRef.current == null) {
        pollStartedAtRef.current = Date.now();
      }
      if (Date.now() - pollStartedAtRef.current > AGGREGATING_POLL_TIMEOUT) {
        return false;
      }
      return AGGREGATING_POLL_INTERVAL;
    },
  });
};
