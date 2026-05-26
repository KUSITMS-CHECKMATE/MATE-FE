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

export const useGetReportQuery = (testId: number) => {
  return useQuery({
    queryKey: ["report", testId],
    queryFn: async () => {
      const res = await getReport(testId);
      return res.data as ReportResponse;
    },
    enabled: !!testId,
  });
};
