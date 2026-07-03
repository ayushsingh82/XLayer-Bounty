import type { RetroPool, Claim } from "@/lib/types";

export const poolStore: RetroPool[] = [
  {
    id: "pool_001",
    name: "Critical OSS Infrastructure Fund",
    description:
      "Retroactively rewards widely-used open-source libraries that power production software but have never been compensated.",
    amountKas: 50000,
    remainingKas: 38500,
    criteria: "GitHub repos with >1k stars OR npm packages with >50k weekly downloads",
    creator: "GCC Foundation",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
    claimCount: 3,
  },
  {
    id: "pool_002",
    name: "Privacy & Digital Rights Fund",
    description:
      "Funds developers building privacy-preserving and digital rights tools for the public good.",
    amountKas: 25000,
    remainingKas: 25000,
    criteria: "Privacy, encryption, or anonymity tools with >500 GitHub stars",
    creator: "Digital Rights DAO",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
    claimCount: 0,
  },
  {
    id: "pool_003",
    name: "Developer Tooling Retroactive Grant",
    description:
      "Rewards open-source developer tools — CLIs, formatters, linters, bundlers — used by millions of developers daily.",
    amountKas: 30000,
    remainingKas: 30000,
    criteria: "Dev tooling repos with >500 forks or >5k weekly npm downloads",
    creator: "Imperial Builders DAO",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
    claimCount: 0,
  },
];

export const claimStore: Claim[] = [];
