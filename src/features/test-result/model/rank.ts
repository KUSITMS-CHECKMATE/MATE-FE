// 동점은 같은 등수를 공유하고 다음 등수는 그만큼 건너뛴다 (예: 1등 2명 → 1, 1, 3)
export function getCompetitionRanks(counts: number[]): number[] {
  return counts.map((count) => 1 + counts.filter((c) => c > count).length);
}

const RANK_ICON: Record<number, string> = {
  1: "icon-step-1-mono",
  2: "icon-step-2-mono",
  3: "icon-step-3-mono",
};

export function rankIcon(rank: number): string {
  return RANK_ICON[rank] ?? `icon-step-${rank}-mono`;
}
