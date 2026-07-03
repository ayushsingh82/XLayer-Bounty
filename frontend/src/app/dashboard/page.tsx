"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import type { RetroPool, Claim } from "@/lib/types";

export default function DashboardPage() {
  const [mode, setMode] = useState<"pools" | "claims">("pools");
  const [pools, setPools] = useState<RetroPool[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create pool form
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [criteria, setCriteria] = useState("");
  const [amountKas, setAmountKas] = useState("10000");
  const [creator, setCreator] = useState("");

  const load = useCallback(async () => {
    const [pr, cr] = await Promise.all([fetch("/api/pools"), fetch("/api/claim")]);
    const pd = await pr.json() as { pools: RetroPool[] };
    const cd = await cr.json() as { claims: Claim[] };
    setPools(pd.pools ?? []);
    setClaims(cd.claims ?? []);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const totalKas = useMemo(() => pools.reduce((s, p) => s + p.amountKas, 0), [pools]);
  const activePools = useMemo(() => pools.filter((p) => p.status === "active").length, [pools]);
  const totalClaimed = useMemo(() => claims.reduce((s, c) => s + c.amountKas, 0), [claims]);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !creator.trim() || !Number(amountKas)) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/pools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, criteria, amountKas: Number(amountKas), creator }),
      });
      const data = await res.json() as RetroPool & { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Failed to create pool");
      setName(""); setDescription(""); setCriteria(""); setAmountKas("10000"); setCreator("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed");
    } finally {
      setLoading(false);
    }
  }

  const statusBadge = (status: RetroPool["status"]) =>
    status === "active"
      ? "border-green-500/60 text-green-300"
      : status === "exhausted"
      ? "border-green-700/40 text-green-500/60"
      : "border-green-800/30 text-green-600/50";

  return (
    <div className="min-h-screen bg-black text-[#86efac]">
      <section className="section-container py-10">
        <h1 className="text-3xl font-bold tracking-tight text-green-200">RetroFund Dashboard</h1>
        <p className="mt-2 text-green-300/90">
          Create retroactive funding pools or track claim activity across all pools.
        </p>

        {/* Stats */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4">
            <p className="text-xs uppercase tracking-wide text-green-400/80">Total KAS in Pools</p>
            <p className="mt-2 text-2xl font-semibold text-green-200">{totalKas.toLocaleString()} KAS</p>
          </div>
          <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4">
            <p className="text-xs uppercase tracking-wide text-green-400/80">Active Pools</p>
            <p className="mt-2 text-2xl font-semibold text-green-200">{activePools}</p>
          </div>
          <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4">
            <p className="text-xs uppercase tracking-wide text-green-400/80">Total KAS Rewarded</p>
            <p className="mt-2 text-2xl font-semibold text-green-200">{totalClaimed.toLocaleString()} KAS</p>
          </div>
        </div>

        {/* Mode tabs */}
        <div className="mt-6 flex gap-2">
          <button
            onClick={() => setMode("pools")}
            className={`rounded-md border px-3 py-1.5 text-sm ${mode === "pools" ? "border-green-500 bg-green-500/20 text-green-200" : "border-green-700/70 text-green-300"}`}
          >
            Funding Pools
          </button>
          <button
            onClick={() => setMode("claims")}
            className={`rounded-md border px-3 py-1.5 text-sm ${mode === "claims" ? "border-green-500 bg-green-500/20 text-green-200" : "border-green-700/70 text-green-300"}`}
          >
            Claims ({claims.length})
          </button>
        </div>

        {error && (
          <p className="mt-4 rounded border border-green-500/50 bg-green-500/15 px-3 py-2 text-sm text-green-200">
            {error}
          </p>
        )}

        {mode === "pools" && (
          <>
            {/* Create pool */}
            <div className="mt-6 rounded-xl border border-green-500/30 bg-green-500/10 p-5">
              <h2 className="text-xl font-semibold text-green-200">Create a Retroactive Pool</h2>
              <p className="mt-1 text-sm text-green-300/90">
                DAOs and grant programs can lock KAS into a pool with clear eligibility criteria.
                The AI agent handles evaluation and payment automatically.
              </p>
              <form onSubmit={onCreate} className="mt-4 grid gap-3">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Pool name (e.g. Critical OSS Infrastructure Fund)"
                  className="rounded-md border border-green-600/80 bg-black px-3 py-2 text-sm text-green-200 outline-none focus:border-green-400"
                />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description — what does this pool fund?"
                  rows={2}
                  className="rounded-md border border-green-600/80 bg-black px-3 py-2 text-sm text-green-200 outline-none focus:border-green-400 resize-none"
                />
                <input
                  value={criteria}
                  onChange={(e) => setCriteria(e.target.value)}
                  placeholder="Eligibility criteria (e.g. npm packages with >50k weekly downloads)"
                  className="rounded-md border border-green-600/80 bg-black px-3 py-2 text-sm text-green-200 outline-none focus:border-green-400"
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    value={amountKas}
                    onChange={(e) => setAmountKas(e.target.value)}
                    placeholder="Total KAS amount"
                    type="number"
                    min="1"
                    className="rounded-md border border-green-600/80 bg-black px-3 py-2 text-sm text-green-200 outline-none focus:border-green-400"
                  />
                  <input
                    value={creator}
                    onChange={(e) => setCreator(e.target.value)}
                    placeholder="Your name / DAO name"
                    className="rounded-md border border-green-600/80 bg-black px-3 py-2 text-sm text-green-200 outline-none focus:border-green-400"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !name.trim() || !creator.trim()}
                  className="w-fit rounded-md border border-green-500 px-4 py-2 text-sm text-green-200 hover:bg-green-500 hover:text-black disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create Pool"}
                </button>
              </form>
            </div>

            {/* Pool list */}
            <div className="mt-6 space-y-3">
              {pools.length === 0 && (
                <div className="rounded-xl border border-green-500/30 bg-black/70 p-6 text-center">
                  <p className="text-sm text-green-300/90">No pools yet. Create the first one above.</p>
                </div>
              )}
              {pools.map((pool) => (
                <div key={pool.id} className="rounded-xl border border-green-500/30 bg-green-500/10 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-base font-semibold text-green-200">{pool.name}</h3>
                    <span className={`rounded border px-2 py-0.5 text-xs uppercase ${statusBadge(pool.status)}`}>
                      {pool.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-green-300/90">{pool.description}</p>
                  {pool.criteria && (
                    <p className="mt-1 text-xs text-green-400/80">Criteria: {pool.criteria}</p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-green-200">
                    <span>
                      <span className="text-green-400/80 text-xs">Total: </span>
                      {pool.amountKas.toLocaleString()} KAS
                    </span>
                    <span>
                      <span className="text-green-400/80 text-xs">Remaining: </span>
                      {pool.remainingKas.toLocaleString()} KAS
                    </span>
                    <span>
                      <span className="text-green-400/80 text-xs">Claims: </span>
                      {pool.claimCount}
                    </span>
                    <span>
                      <span className="text-green-400/80 text-xs">By: </span>
                      {pool.creator}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {mode === "claims" && (
          <div className="mt-6 space-y-3">
            {claims.length === 0 && (
              <div className="rounded-xl border border-green-500/30 bg-black/70 p-6 text-center">
                <p className="text-sm text-green-300/90">
                  No claims yet.{" "}
                  <a href="/scan" className="underline text-green-300">Scan a repo</a> to claim your reward.
                </p>
              </div>
            )}
            {claims.map((c) => (
              <div key={c.id} className="rounded-xl border border-green-500/30 bg-green-500/10 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <a href={c.repoUrl} target="_blank" rel="noreferrer" className="text-sm text-green-300 underline">
                    {c.repoUrl}
                  </a>
                  <span className="rounded border border-green-500/60 px-2 py-0.5 text-xs uppercase text-green-300">
                    {c.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-green-200">
                  <span className="font-semibold">{c.amountKas.toLocaleString()} KAS</span> from {c.poolName}
                </p>
                <p className="text-xs text-green-400/80">
                  Maintainer: {c.maintainerHandle} · Kaspa: {c.kasAddress}
                </p>
                {c.txHash && (
                  <p className="mt-1 text-xs text-green-500/70 font-mono">TX: {c.txHash}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
