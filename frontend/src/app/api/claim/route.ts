import { NextResponse } from "next/server";
import { poolStore, claimStore } from "../_store";
import type { Claim } from "@/lib/types";

function mockKasTxHash(): string {
  const chars = "abcdef0123456789";
  return Array.from({ length: 64 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export async function GET() {
  return NextResponse.json({ claims: [...claimStore].reverse() });
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    poolId?: string;
    repoUrl?: string;
    maintainerHandle?: string;
    kasAddress?: string;
    estimatedRewardKas?: number;
  };

  if (!body.poolId?.trim()) return NextResponse.json({ error: "poolId is required" }, { status: 400 });
  if (!body.repoUrl?.trim()) return NextResponse.json({ error: "repoUrl is required" }, { status: 400 });
  if (!body.maintainerHandle?.trim()) return NextResponse.json({ error: "maintainerHandle is required" }, { status: 400 });
  if (!body.kasAddress?.trim()) return NextResponse.json({ error: "kasAddress is required" }, { status: 400 });

  const pool = poolStore.find((p) => p.id === body.poolId);
  if (!pool) return NextResponse.json({ error: "Pool not found" }, { status: 404 });
  if (pool.status !== "active") return NextResponse.json({ error: "Pool is not active" }, { status: 409 });

  const rewardKas = Math.min(body.estimatedRewardKas ?? 1000, pool.remainingKas);
  if (rewardKas <= 0) return NextResponse.json({ error: "Pool has no remaining KAS" }, { status: 409 });

  pool.remainingKas -= rewardKas;
  pool.claimCount += 1;
  if (pool.remainingKas <= 0) pool.status = "exhausted";

  const claim: Claim = {
    id: `claim_${Date.now()}`,
    poolId: pool.id,
    poolName: pool.name,
    repoUrl: body.repoUrl.trim(),
    maintainerHandle: body.maintainerHandle.trim(),
    kasAddress: body.kasAddress.trim(),
    amountKas: rewardKas,
    status: "paid",
    submittedAt: new Date().toISOString(),
    txHash: mockKasTxHash(),
  };

  claimStore.push(claim);
  return NextResponse.json(claim, { status: 201 });
}
