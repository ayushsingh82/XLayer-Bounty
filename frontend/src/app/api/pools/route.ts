import { NextResponse } from "next/server";
import { poolStore } from "../_store";
import type { RetroPool } from "@/lib/types";

export async function GET() {
  const pools = [...poolStore].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return NextResponse.json({ pools });
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    name?: string;
    description?: string;
    criteria?: string;
    amountKas?: number;
    creator?: string;
  };

  if (!body.name?.trim()) return NextResponse.json({ error: "Pool name is required" }, { status: 400 });
  if (!body.creator?.trim()) return NextResponse.json({ error: "Creator is required" }, { status: 400 });
  if (!body.amountKas || body.amountKas <= 0)
    return NextResponse.json({ error: "Amount must be greater than 0" }, { status: 400 });

  const pool: RetroPool = {
    id: `pool_${Date.now()}`,
    name: body.name.trim(),
    description: body.description?.trim() ?? "",
    criteria: body.criteria?.trim() ?? "",
    amountKas: Number(body.amountKas),
    remainingKas: Number(body.amountKas),
    creator: body.creator.trim(),
    createdAt: new Date().toISOString(),
    status: "active",
    claimCount: 0,
  };

  poolStore.push(pool);
  return NextResponse.json(pool, { status: 201 });
}
