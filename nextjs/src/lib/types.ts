export type BountyStatus = "open" | "submitted" | "resolved";

export interface BountyItem {
  id: string;
  issueUrl: string;
  amountUsdc: number;
  creator: string;
  createdAt: string;
  status: BountyStatus;
  submission?: {
    prUrl: string;
    solver: string;
    submittedAt: string;
  };
  resolution?: {
    approved: boolean;
    reason: string;
    resolvedAt: string;
  };
}

