export type PoolStatus = "active" | "exhausted" | "closed";
export type ClaimStatus = "pending" | "verified" | "paid";

export interface RetroPool {
  id: string;
  name: string;
  description: string;
  amountKas: number;
  remainingKas: number;
  criteria: string;
  creator: string;
  createdAt: string;
  status: PoolStatus;
  claimCount: number;
}

export interface RepoScanResult {
  owner: string;
  repo: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
  license: string | null;
  weeklyDownloads: number | null;
  impactScore: number;
  estimatedRewardKas: number;
  agentReasoning: string;
  url: string;
}

export interface Claim {
  id: string;
  poolId: string;
  poolName: string;
  repoUrl: string;
  maintainerHandle: string;
  kasAddress: string;
  amountKas: number;
  status: ClaimStatus;
  submittedAt: string;
  txHash?: string;
  explorerUrl?: string;
}
