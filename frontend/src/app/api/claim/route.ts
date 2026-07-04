import { NextResponse } from "next/server";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import { poolStore, claimStore } from "../_store";
import type { Claim } from "@/lib/types";

const execFileAsync = promisify(execFile);

const KASPA_ESCROW_DIR = path.join(process.cwd(), "..", "kaspa-escrow");
const KASPA_PYTHON = path.join(KASPA_ESCROW_DIR, ".venv", "bin", "python3");
const SEND_REWARD_SCRIPT = path.join(KASPA_ESCROW_DIR, "send_reward.py");

type SendRewardResult =
  | { ok: true; txId: string; amountKas: number; toAddress: string; explorer: string }
  | { ok: false; error: string };

// Settles a reward on Kaspa testnet-10 from the RetroFund escrow wallet.
// The impact-score/pool-threshold check already happened before this is
// called (in /api/scan + the claim form) — this only broadcasts the payout
// and returns the real tx id as proof of settlement.
async function sendRewardOnChain(toAddress: string, amountKas: number): Promise<SendRewardResult> {
  try {
    const { stdout } = await execFileAsync(KASPA_PYTHON, [SEND_REWARD_SCRIPT, toAddress, String(amountKas)]);
    return JSON.parse(stdout.trim()) as SendRewardResult;
  } catch (err) {
    // execFile rejects on non-zero exit, but send_reward.py still prints JSON to stdout first.
    const stdout = (err as { stdout?: string }).stdout;
    if (stdout) {
      try {
        return JSON.parse(stdout.trim()) as SendRewardResult;
      } catch {
        // fall through
      }
    }
    return { ok: false, error: err instanceof Error ? err.message : "Unknown Kaspa settlement error" };
  }
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

  const kasAddress = body.kasAddress.trim();
  const settlement = await sendRewardOnChain(kasAddress, rewardKas);
  if (!settlement.ok) {
    return NextResponse.json({ error: `Kaspa settlement failed: ${settlement.error}` }, { status: 502 });
  }

  pool.remainingKas -= rewardKas;
  pool.claimCount += 1;
  if (pool.remainingKas <= 0) pool.status = "exhausted";

  const claim: Claim = {
    id: `claim_${Date.now()}`,
    poolId: pool.id,
    poolName: pool.name,
    repoUrl: body.repoUrl.trim(),
    maintainerHandle: body.maintainerHandle.trim(),
    kasAddress,
    amountKas: rewardKas,
    status: "paid",
    submittedAt: new Date().toISOString(),
    txHash: settlement.txId,
    explorerUrl: settlement.explorer,
  };

  claimStore.push(claim);
  return NextResponse.json(claim, { status: 201 });
}
