export type TestStatus = "active" | "ended";

export interface UserTest {
  id: number;
  title: string;
  participantCount: number;
  maxParticipantCount: number;
  status: TestStatus;
}
