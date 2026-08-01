export type TestStatus = "active" | "ended" | "waiting" | "rejected";

export interface UserTest {
  id: number;
  title: string;
  participantCount: number;
  maxParticipantCount: number;
  status: TestStatus;
}

export type DraftTestStatus = "draft" | "failed";

export interface DraftTest {
  draftId: number;
  title: string;
  status: DraftTestStatus;
}
