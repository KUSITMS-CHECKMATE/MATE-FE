export interface DiscoveryTest {
  id: number;
  title: string;
  description: string;
  reward: number;
  thumbnailUrl: string;
  liked: boolean;
  categories: string[];
}

export interface ClosedTest {
  id: number;
  title: string;
  thumbnailUrl: string;
  categories: string[];
}
