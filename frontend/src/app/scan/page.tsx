"use client";

import { FormEvent, useState } from "react";
import type { RepoScanResult, RetroPool, Claim } from "@/lib/types";

export default function ScanPage() {
  const [repoInput, setRepoInput] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<RepoScanResult | null>(null);
  const [pools, setPools] = useState<RetroPool[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [selectedPool, setSelectedPool] = useState("");
  const [kasAddress, setKasAddress] = useState("");
  const [maintainerHandle, setMaintainerHandle] = useState("");
  const [claiming, setClaiming] = useState(false);
  const [claim, setClaim] = useState<Claim | null>(null);
  const [claimError, setClaimError] = useState<string | null>(null);

  async function onScan(e: FormEvent) {
    e.preventDefault();
    if (!repoInput.trim()) return;
    setScanning(true);
    setError(null);
    setResult(null);
    setPools([]);
    setClaim(null);
    setClaimError(null);

    try {
      const [scanRes, poolsRes] = await Promise.all([
        fetch(`/api/scan?repo=${encodeURIComponent(repoInput.trim())}`),
        fetch("/api/pools"),
      ]);
      if (!scanRes.ok) {
        const d = await scanRes.json() as { error?: string };
        throw new Error(d.error ?? "Scan failed");
      }
      const scanData = await scanRes.json() as RepoScanResult;
      const poolsData = await poolsRes.json() as { pools: RetroPool[] };
      setResult(scanData);
      const active = poolsData.pools.filter((p) => p.status === "active" && p.remainingKas > 0);
      setPools(active);
      setSelectedPool(active[0]?.id ?? "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scan failed");
    } finally {
      setScanning(false);
    }
  }

  async function onClaim(e: FormEvent) {
    e.preventDefault();
    if (!result || !selectedPool || !kasAddress.trim() || !maintainerHandle.trim()) return;
    setClaiming(true);
    setClaimError(null);
    try {
      const res = await fetch("/api/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          poolId: selectedPool,
          repoUrl: result.url,
          maintainerHandle: maintainerHandle.trim(),
          kasAddress: kasAddress.trim(),
          estimatedRewardKas: result.estimatedRewardKas,
        }),
      });
      const data = await res.json() as Claim & { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Claim failed");
      setClaim(data);
    } catch (err) {
      setClaimError(err instanceof Error ? err.message : "Claim failed");
    } finally {
      setClaiming(false);
    }
  }

  const scoreClass = (s: number) =>
    s >= 70 ? "text-[#16a34a]" : s >= 40 ? "text-[#ca8a04]" : "text-[#64748b]";

  const verdict = (s: number) =>
    s >= 70 ? "High Impact" : s >= 40 ? "Moderate Impact" : "Developing";

  return (
    <div className="bg-white min-h-screen">

      {/* Top bar */}
      <div className="bg-white">
        <div className="wrap pt-16 pb-8">
          <h1 className="text-2xl font-bold text-[#0f172a]">Scan a Repository</h1>
          <p className="mt-1 text-sm text-[#64748b]">
            Enter a GitHub repo URL — the agent pulls live usage data and estimates your retroactive reward.
          </p>

          <form onSubmit={onScan} className="mt-5 flex gap-2.5">
            <input
              value={repoInput}
              onChange={(e) => setRepoInput(e.target.value)}
              placeholder="e.g. facebook/react or https://github.com/vercel/next.js"
              className="field flex-1"
            />
            <button
              type="submit"
              disabled={scanning || !repoInput.trim()}
              className="btn-primary flex-shrink-0"
            >
              {scanning ? "Scanning…" : "Scan"}
            </button>
          </form>

          {error && (
            <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </div>
      </div>

      <div className="wrap py-8 pb-20 space-y-5">

        {/* Loading skeleton */}
        {scanning && (
          <div className="card space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#22c55e] pulse-dot" />
              <span className="text-sm text-[#64748b]">Agent scanning GitHub + npm…</span>
            </div>
            <div className="shimmer-bg h-5 w-2/3 rounded" />
            <div className="shimmer-bg h-4 w-1/2 rounded" />
            <div className="grid grid-cols-4 gap-3 mt-2">
              {[1,2,3,4].map(i => <div key={i} className="shimmer-bg h-14 rounded-lg" />)}
            </div>
          </div>
        )}

        {result && !scanning && (
          <>
            {/* Repo header */}
            <div className="card anim-fade-up">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg font-bold text-[#0f172a]">
                      {result.owner}/{result.repo}
                    </h2>
                    {result.language && (
                      <span className="text-xs bg-[#f1f5f9] text-[#64748b] px-2 py-0.5 rounded-md font-medium">
                        {result.language}
                      </span>
                    )}
                    {result.license && (
                      <span className="text-xs bg-[#f1f5f9] text-[#64748b] px-2 py-0.5 rounded-md font-medium">
                        {result.license}
                      </span>
                    )}
                  </div>
                  {result.description && (
                    <p className="mt-1 text-sm text-[#64748b]">{result.description}</p>
                  )}
                </div>
                <a
                  href={result.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[#16a34a] hover:underline flex-shrink-0 font-medium"
                >
                  GitHub ↗
                </a>
              </div>

              {/* Metrics row */}
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "Stars", value: result.stars.toLocaleString() },
                  { label: "Forks", value: result.forks.toLocaleString() },
                  {
                    label: "Weekly npm downloads",
                    value: result.weeklyDownloads != null ? result.weeklyDownloads.toLocaleString() : "—",
                  },
                  { label: "Impact score", value: `${result.impactScore}/100` },
                ].map((m) => (
                  <div key={m.label} className="bg-[#f8fafc] rounded-lg px-3 py-3 border border-[#e2e8f0]">
                    <p className="text-[10px] text-[#94a3b8] uppercase tracking-widest font-semibold">{m.label}</p>
                    <p className={`mt-1 text-xl font-bold font-mono ${m.label === "Impact score" ? scoreClass(result.impactScore) : "text-[#0f172a]"}`}>
                      {m.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Score bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-[#64748b] font-medium">Impact Score</span>
                  <span className={`text-xs font-semibold ${scoreClass(result.impactScore)}`}>
                    {verdict(result.impactScore)}
                  </span>
                </div>
                <div className="h-1.5 bg-[#e2e8f0] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#22c55e] rounded-full transition-all duration-700"
                    style={{ width: `${result.impactScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Agent reasoning */}
            <div className="card anim-fade-up anim-delay-1">
              <p className="text-[10px] text-[#94a3b8] uppercase tracking-widest font-semibold mb-2">
                Agent Reasoning
              </p>
              <p className="text-sm text-[#374151] leading-relaxed">{result.agentReasoning}</p>
            </div>

            {/* Estimated reward */}
            <div className="card-green anim-fade-up anim-delay-2 flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-[10px] text-[#16a34a] uppercase tracking-widest font-semibold mb-0.5">
                  Estimated Retroactive Reward
                </p>
                <p className="text-3xl font-bold font-mono text-[#16a34a]">
                  {result.estimatedRewardKas.toLocaleString()} KAS
                </p>
              </div>
              {result.estimatedRewardKas > 0 && (
                <div className="badge">Eligible for claim</div>
              )}
            </div>

            {/* Claim form */}
            {!claim && result.estimatedRewardKas > 0 && pools.length > 0 && (
              <div className="card anim-fade-up anim-delay-3">
                <h3 className="text-base font-semibold text-[#0f172a] mb-1">Claim your reward</h3>
                <p className="text-sm text-[#64748b] mb-4">
                  Select a pool, enter your details, and the Kaspa Covenant will release payment automatically.
                </p>
                <form onSubmit={onClaim} className="space-y-3">
                  <select
                    value={selectedPool}
                    onChange={(e) => setSelectedPool(e.target.value)}
                    className="field"
                  >
                    {pools.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — {p.remainingKas.toLocaleString()} KAS remaining
                      </option>
                    ))}
                  </select>
                  <input
                    value={maintainerHandle}
                    onChange={(e) => setMaintainerHandle(e.target.value)}
                    placeholder="GitHub username"
                    className="field"
                  />
                  <input
                    value={kasAddress}
                    onChange={(e) => setKasAddress(e.target.value)}
                    placeholder="Kaspa testnet address (kaspatest:...)"
                    className="field"
                  />
                  {claimError && (
                    <p className="text-xs text-red-600">{claimError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={claiming || !kasAddress.trim() || !maintainerHandle.trim()}
                    className="btn-primary w-full justify-center py-2.5"
                  >
                    {claiming ? "Submitting…" : "Claim Retroactive Reward"}
                  </button>
                </form>
              </div>
            )}

            {/* Success */}
            {claim && (
              <div className="card-green anim-fade-up">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 rounded-full bg-[#16a34a] flex items-center justify-center text-white text-xs font-bold">✓</span>
                  <p className="font-semibold text-[#15803d]">Reward claimed successfully</p>
                </div>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#64748b]">Amount</span>
                    <span className="font-mono font-bold text-[#16a34a]">{claim.amountKas.toLocaleString()} KAS</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748b]">Pool</span>
                    <span className="font-medium text-[#0f172a]">{claim.poolName}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-[#64748b] flex-shrink-0">Kaspa TX</span>
                    {claim.explorerUrl ? (
                      <a
                        href={claim.explorerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs text-[#16a34a] truncate underline"
                      >
                        {claim.txHash}
                      </a>
                    ) : (
                      <span className="font-mono text-xs text-[#64748b] truncate">{claim.txHash}</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {pools.length === 0 && !claim && (
              <div className="card text-center py-8">
                <p className="text-sm text-[#64748b]">
                  No active pools right now.{" "}
                  <a href="/dashboard" className="text-[#16a34a] font-medium hover:underline">
                    Create one
                  </a>
                </p>
              </div>
            )}
          </>
        )}

        {/* Empty state */}
        {!result && !scanning && (
          <div className="card text-center py-14">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-sm font-medium text-[#0f172a]">No repo scanned yet</p>
            <p className="text-xs text-[#94a3b8] mt-1">Try scanning <code className="bg-[#f1f5f9] px-1.5 py-0.5 rounded text-[#64748b]">facebook/react</code> or <code className="bg-[#f1f5f9] px-1.5 py-0.5 rounded text-[#64748b]">axios/axios</code></p>
          </div>
        )}

      </div>
    </div>
  );
}
