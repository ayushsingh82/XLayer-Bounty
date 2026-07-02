import type { BountyItem } from "@/lib/types";

const seed: BountyItem[] = [
  {
    id: "bty_seed_1",
    issueUrl: "https://github.com/okx/xlayer-docs/issues/152",
    amountOkb: 0.35,
    creator: "0xCreatorDemo",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 9).toISOString(),
    status: "open",
  },
  {
    id: "bty_seed_2",
    issueUrl: "https://github.com/okx/xlayer-docs/issues/140",
    amountOkb: 0.4,
    creator: "0xCreatorDemo",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString(),
    status: "open",
  },
  {
    id: "bty_seed_3",
    issueUrl: "https://github.com/okx/xlayer-toolkit/issues/119",
    amountOkb: 0.3,
    creator: "0xCreatorDemo",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    status: "open",
  },
  {
    id: "bty_seed_4",
    issueUrl: "https://github.com/okx/xlayer-toolkit/issues/75",
    amountOkb: 0.25,
    creator: "0xCreatorDemo",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    status: "open",
  },
];

// In-memory store for local dev prototype.
// Replace with on-chain + relayer source for production.
export const bountyStore: BountyItem[] = seed;

