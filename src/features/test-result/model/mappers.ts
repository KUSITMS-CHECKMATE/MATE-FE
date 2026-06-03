import type { ReportItem, QuestionType } from "@/shared/api/report";
import type { QuestionResult } from "./types";

const MAX_BAR_HEIGHT = 115;

export const QUESTION_TYPE_LABEL: Record<QuestionType, string> = {
  SUBJECTIVE: "주관식",
  OBJECTIVE: "객관식",
  FIVE_SECOND: "5초 테스트",
  SCALE: "척도",
  AB_TEST: "A/B 테스트",
  CARD_SORTING: "카드 소팅",
  TREE_TEST: "트리 테스트",
};

const RANK_ICON: Record<number, string> = {
  1: "icon-step-1-mono",
  2: "icon-step-2-mono",
  3: "icon-step-3-mono",
};

export function mapReportItemToQuestionResult(item: ReportItem): QuestionResult {
  switch (item.type) {
    case "SUBJECTIVE":
      return {
        type: "SUBJECTIVE",
        title: item.title,
        answers: item.result.texts ?? [],
      };

    case "OBJECTIVE": {
      const max = Math.max(...item.result.options.map((o) => o.count), 1);
      return {
        type: "OBJECTIVE",
        title: item.title,
        options: item.result.options.map((o) => ({
          label: o.content,
          count: o.count,
          percentage: Math.round(o.ratio * 100),
          isHighlight: o.count === max,
        })),
      };
    }

    case "FIVE_SECOND": {
      if ("texts" in item.result) {
        return {
          type: "FIVE_SECOND",
          title: item.title,
          imageUrl: undefined,
          answers: (item.result.texts ?? []).map((text) => ({
            label: text,
            count: 0,
            percentage: 0,
            isHighlight: false,
          })),
        };
      }
      const max = Math.max(...item.result.options.map((o) => o.count), 1);
      return {
        type: "FIVE_SECOND",
        title: item.title,
        imageUrl: undefined,
        answers: item.result.options.map((o) => ({
          label: o.content,
          count: o.count,
          percentage: Math.round(o.ratio * 100),
          isHighlight: o.count === max,
        })),
      };
    }

    case "SCALE": {
      const maxCount = Math.max(...item.result.distribution.map((d) => d.count), 1);
      return {
        type: "SCALE",
        title: item.title,
        average: item.result.average,
        scores: item.result.distribution.map((d) => ({
          label: `${d.score}점`,
          height: Math.round((d.count / maxCount) * MAX_BAR_HEIGHT),
          isHighlight: d.score === item.result.mostVoted,
        })),
      };
    }

    case "AB_TEST": {
      const aWins = item.result.A.count >= item.result.B.count;
      return {
        type: "AB_TEST",
        title: item.title,
        options: [
          {
            label: `A안 (${Math.round(item.result.A.ratio * 100)}%)`,
            height: Math.round(item.result.A.ratio * MAX_BAR_HEIGHT),
            isHighlight: aWins,
          },
          {
            label: `B안 (${Math.round(item.result.B.ratio * 100)}%)`,
            height: Math.round(item.result.B.ratio * MAX_BAR_HEIGHT),
            isHighlight: !aWins,
          },
        ],
      };
    }

    case "CARD_SORTING":
      return {
        type: "CARD_SORTING",
        title: item.title,
        categories: item.result.byCategory.map((cat) => ({
          name: cat.category,
          items: cat.cards.map((card) => ({
            rank: RANK_ICON[card.rank] ?? `icon-step-${card.rank}-mono`,
            label: card.cardName,
            count: card.count,
            percentage: Math.round(card.ratio * 100),
            isHighlight: card.rank === 1,
          })),
        })),
      };

    case "TREE_TEST": {
      const max = Math.max(...item.result.nodeFrequency.map((n) => n.count), 1);
      return {
        type: "TREE_TEST",
        title: item.title,
        paths: item.result.nodeFrequency.map((node) => ({
          label: node.label,
          count: node.count,
          percentage: Math.round(node.ratio * 100),
          isHighlight: node.count === max,
        })),
      };
    }
  }
}
