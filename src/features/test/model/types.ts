export type TestStatus = "active" | "ended" | "waiting" | "rejected";

export interface UserTest {
  id: number;
  title: string;
  participantCount: number;
  maxParticipantCount: number;
  status: TestStatus;
}
