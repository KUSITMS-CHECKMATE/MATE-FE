import type { TestSummaryResponse } from "@/shared/api/generated/test";
import type { DiscoveryTest } from "./types";

export function toDiscoveryTest(item: TestSummaryResponse): DiscoveryTest {
  return {
    id: item.id ?? 0,
    title: item.title ?? "",
    description: item.description ?? "",
    reward: item.reward ?? 0,
    thumbnailUrl: item.thumbnailUrl ?? "",
    liked: item.isLiked ?? false,
    categories: item.categories ?? [],
  };
}
