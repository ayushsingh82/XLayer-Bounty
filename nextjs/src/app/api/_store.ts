import type { BountyItem } from "@/lib/types";

const seed: BountyItem[] = [
  {
    id: "bty_seed_1",
    issueUrl: "https://github.com/example/repo/issues/42",
    amountUsdc: 50,
    creator: "0xCreatorDemo",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    status: "open",
  },
];

// In-memory store for local dev prototype.
// Replace with on-chain + relayer source for production.
export const bountyStore: BountyItem[] = seed;

