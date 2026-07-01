"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import type { BountyItem } from "@/lib/types";

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const [mode, setMode] = useState<"creator" | "developer">("creator");
  const [issueUrl, setIssueUrl] = useState("");
  const [amountUsdc, setAmountUsdc] = useState("25");
  const [prUrls, setPrUrls] = useState<Record<string, string>>({});
  const [items, setItems] = useState<BountyItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/bounties");
    const data = (await res.json()) as { items: BountyItem[] };
    setItems(data.items ?? []);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const creatorItems = useMemo(
    () => (address ? items.filter((x) => x.creator.toLowerCase() === address.toLowerCase()) : []),
    [items, address]
  );

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    if (!address) return setError("Connect wallet first.");
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/bounties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          issueUrl,
          amountUsdc: Number(amountUsdc),
          creator: address,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create bounty");
      setIssueUrl("");
      setAmountUsdc("25");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed");
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(bountyId: string) {
    if (!address) return setError("Connect wallet first.");
    const prUrl = prUrls[bountyId]?.trim();
    if (!prUrl) return setError("Please paste PR URL.");
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/bounties/${bountyId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prUrl, solver: address }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submit failed");
      setPrUrls((prev) => ({ ...prev, [bountyId]: "" }));
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submit failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <section className="section-container py-10">
        <h1 className="text-3xl font-bold tracking-tight">Bounty Dashboard</h1>
        <p className="mt-2 text-white/70">
          AutoBounty-inspired flow for XLayer: create bounty, submit PR, resolve status.
        </p>
        <p className="mt-2 text-xs text-white/50">
          Wallet: {isConnected && address ? address : "Not connected"}
        </p>

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={() => setMode("creator")}
            className={`rounded-md border px-3 py-1.5 text-sm ${mode === "creator" ? "border-[#c0c0c0] bg-[#c0c0c0]/15 text-[#c0c0c0]" : "border-white/20 text-white/80"}`}
          >
            Creator Mode
          </button>
          <button
            type="button"
            onClick={() => setMode("developer")}
            className={`rounded-md border px-3 py-1.5 text-sm ${mode === "developer" ? "border-[#c0c0c0] bg-[#c0c0c0]/15 text-[#c0c0c0]" : "border-white/20 text-white/80"}`}
          >
            Developer Mode
          </button>
        </div>

        {error && (
          <p className="mt-4 rounded border border-red-400/40 bg-red-400/10 px-3 py-2 text-sm text-red-200">
            {error}
          </p>
        )}

        {mode === "creator" && (
          <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-xl font-semibold">Create bounty</h2>
            <form onSubmit={onCreate} className="mt-4 grid gap-3 sm:grid-cols-3">
              <input
                value={issueUrl}
                onChange={(e) => setIssueUrl(e.target.value)}
                placeholder="GitHub issue URL"
                className="sm:col-span-2 rounded-md border border-white/20 bg-black/30 px-3 py-2 text-sm outline-none focus:border-[#c0c0c0]"
              />
              <input
                value={amountUsdc}
                onChange={(e) => setAmountUsdc(e.target.value)}
                placeholder="USDC amount"
                className="rounded-md border border-white/20 bg-black/30 px-3 py-2 text-sm outline-none focus:border-[#c0c0c0]"
              />
              <button
                type="submit"
                disabled={loading}
                className="sm:col-span-3 w-fit rounded-md border border-[#c0c0c0] px-4 py-2 text-sm text-[#c0c0c0] hover:bg-[#c0c0c0] hover:text-black disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create bounty"}
              </button>
            </form>

            <p className="mt-6 text-sm text-white/70">
              Your bounties: <span className="font-semibold text-white">{creatorItems.length}</span>
            </p>
          </div>
        )}

        <div className="mt-6 space-y-3">
          {items.map((bounty) => (
            <div key={bounty.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <a
                  href={bounty.issueUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-[#c0c0c0] underline"
                >
                  {bounty.issueUrl}
                </a>
                <span className="text-xs text-white/60">#{bounty.id}</span>
              </div>
              <p className="mt-2 text-sm text-white/80">
                {bounty.amountUsdc} USDC · <span className="uppercase">{bounty.status}</span>
              </p>
              <p className="text-xs text-white/50">Creator: {bounty.creator}</p>

              {mode === "developer" && bounty.status === "open" && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <input
                    value={prUrls[bounty.id] ?? ""}
                    onChange={(e) => setPrUrls((prev) => ({ ...prev, [bounty.id]: e.target.value }))}
                    placeholder="GitHub PR URL"
                    className="min-w-[280px] flex-1 rounded-md border border-white/20 bg-black/30 px-3 py-2 text-sm outline-none focus:border-[#c0c0c0]"
                  />
                  <button
                    type="button"
                    onClick={() => void onSubmit(bounty.id)}
                    disabled={loading}
                    className="rounded-md border border-[#c0c0c0] px-4 py-2 text-sm text-[#c0c0c0] hover:bg-[#c0c0c0] hover:text-black disabled:opacity-50"
                  >
                    Submit PR
                  </button>
                </div>
              )}

              {bounty.submission && (
                <p className="mt-3 text-xs text-white/70">
                  Submission:{" "}
                  <a href={bounty.submission.prUrl} target="_blank" rel="noreferrer" className="underline">
                    {bounty.submission.prUrl}
                  </a>
                </p>
              )}

              {bounty.resolution && (
                <p className={`mt-2 text-xs ${bounty.resolution.approved ? "text-green-300" : "text-red-300"}`}>
                  {bounty.resolution.approved ? "Approved" : "Rejected"}: {bounty.resolution.reason}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

