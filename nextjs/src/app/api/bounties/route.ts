import { NextResponse } from "next/server";
import { bountyStore } from "../_store";
import type { BountyItem } from "@/lib/types";

export async function GET() {
  const items = [...bountyStore].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    issueUrl?: string;
    amountUsdc?: number;
    creator?: string;
  };

  if (!body.issueUrl?.trim()) {
    return NextResponse.json({ error: "Issue URL is required" }, { status: 400 });
  }
  if (!body.creator?.trim()) {
    return NextResponse.json({ error: "Creator wallet is required" }, { status: 400 });
  }
  if (!body.amountUsdc || body.amountUsdc <= 0) {
    return NextResponse.json({ error: "Amount must be greater than 0" }, { status: 400 });
  }

  const item: BountyItem = {
    id: `bty_${Date.now()}`,
    issueUrl: body.issueUrl.trim(),
    amountUsdc: Number(body.amountUsdc),
    creator: body.creator.trim(),
    createdAt: new Date().toISOString(),
    status: "open",
  };

  bountyStore.push(item);
  return NextResponse.json(item, { status: 201 });
}

