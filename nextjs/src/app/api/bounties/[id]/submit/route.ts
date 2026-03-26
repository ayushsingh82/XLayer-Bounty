import { NextResponse } from "next/server";
import { bountyStore } from "@/app/api/_store";

function evaluateSubmission(prUrl: string): { approved: boolean; reason: string } {
  const hasPrPattern = /github\.com\/.+\/pull\/\d+/i.test(prUrl);
  if (!hasPrPattern) {
    return {
      approved: false,
      reason: "PR URL format is invalid. Expected github.com/<org>/<repo>/pull/<id>.",
    };
  }

  const approvalSignals = ["fix", "feat", "tests", "docs"];
  const approved = approvalSignals.some((s) => prUrl.toLowerCase().includes(s));
  return approved
    ? {
        approved: true,
        reason: "Submission passed automated checks and basic policy heuristics.",
      }
    : {
        approved: false,
        reason: "Submission did not satisfy automated quality heuristics.",
      };
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = (await request.json()) as {
    prUrl?: string;
    solver?: string;
  };

  if (!body.prUrl?.trim() || !body.solver?.trim()) {
    return NextResponse.json({ error: "prUrl and solver are required" }, { status: 400 });
  }

  const bounty = bountyStore.find((b) => b.id === id);
  if (!bounty) return NextResponse.json({ error: "Bounty not found" }, { status: 404 });
  if (bounty.status !== "open") {
    return NextResponse.json({ error: "Bounty is not open for submissions" }, { status: 409 });
  }

  bounty.status = "submitted";
  bounty.submission = {
    prUrl: body.prUrl.trim(),
    solver: body.solver.trim(),
    submittedAt: new Date().toISOString(),
  };

  const result = evaluateSubmission(bounty.submission.prUrl);
  bounty.status = "resolved";
  bounty.resolution = {
    approved: result.approved,
    reason: result.reason,
    resolvedAt: new Date().toISOString(),
  };

  return NextResponse.json(bounty);
}

