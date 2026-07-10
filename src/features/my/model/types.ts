export interface MyUser {
  name: string;
  points: number;
}

export interface ParticipateRecord {
  id: number;
  title: string;
  participatedAt: string;
  earnedAmount: string;
}

export interface Notice {
  id: number;
  title: string;
  publishedAt: string;
}

export interface TestDetail {
  id: number;
  name: string;
  categories: string[];
  images: string[];
  reward: string;
  summary: string;
  serviceName: string;
  serviceDescription: string;
  isEnded: boolean;
}
