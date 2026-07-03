"use client";

import { FormEvent, useState } from "react";
import type { RepoScanResult, RetroPool, Claim } from "@/lib/types";

export default function ScanPage() {
  const [repoInput, setRepoInput] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<RepoScanResult | null>(null);
  const [pools, setPools] = useState<RetroPool[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [selectedPool, setSelectedPool] = useState<string>("");
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
      setPools(poolsData.pools.filter((p) => p.status === "active" && p.remainingKas > 0));
      setSelectedPool(poolsData.pools[0]?.id ?? "");
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

  const scoreColor = (score: number) =>
    score >= 80 ? "text-green-300" : score >= 40 ? "text-green-400" : "text-green-500/70";

  return (
    <div className="min-h-screen bg-black text-[#86efac]">
      <section className="section-container py-10">
        <h1 className="text-3xl font-bold tracking-tight text-green-200">Scan Your Repository</h1>
        <p className="mt-2 text-green-300/90">
          Enter a GitHub repo URL. The RetroFund AI agent will measure real-world impact and
          estimate your retroactive KAS reward.
        </p>

        <form onSubmit={onScan} className="mt-6 flex gap-2">
          <input
            value={repoInput}
            onChange={(e) => setRepoInput(e.target.value)}
            placeholder="e.g. facebook/react or https://github.com/vercel/next.js"
            className="flex-1 rounded-md border border-green-600/80 bg-black px-3 py-2 text-sm text-green-200 outline-none focus:border-green-400"
          />
          <button
            type="submit"
            disabled={scanning || !repoInput.trim()}
            className="rounded-md border border-green-500 px-4 py-2 text-sm text-green-200 hover:bg-green-500 hover:text-black disabled:opacity-50"
          >
            {scanning ? "Scanning..." : "Scan"}
          </button>
        </form>

        {error && (
          <p className="mt-4 rounded border border-green-500/50 bg-green-500/15 px-3 py-2 text-sm text-green-200">
            {error}
          </p>
        )}

        {scanning && (
          <div className="mt-8 rounded-xl border border-green-500/30 bg-green-500/10 p-6 text-center">
            <p className="text-sm text-green-300 animate-pulse">
              Agent scanning GitHub + npm data...
            </p>
            <p className="mt-1 text-xs text-green-400/70">
              Fetching stars, forks, weekly downloads, contributors
            </p>
          </div>
        )}

        {result && (
          <>
            {/* Repo metrics */}
            <div className="mt-6 rounded-xl border border-green-500/30 bg-green-500/10 p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className="text-xl font-semibold text-green-200">
                    {result.owner}/{result.repo}
                  </h2>
                  {result.description && (
                    <p className="mt-1 text-sm text-green-300/90">{result.description}</p>
                  )}
                  <p className="mt-1 text-xs text-green-400/70">
                    {result.language && <span>{result.language} · </span>}
                    {result.license && <span>License: {result.license}</span>}
                  </p>
                </div>
                <a
                  href={result.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs underline text-green-400 hover:text-green-200"
                >
                  View on GitHub ↗
                </a>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-4">
                <div className="rounded-lg border border-green-500/30 bg-black/60 p-3">
                  <p className="text-xs uppercase tracking-wide text-green-400/80">Stars</p>
                  <p className="mt-1 text-xl font-semibold text-green-200">
                    {result.stars.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-lg border border-green-500/30 bg-black/60 p-3">
                  <p className="text-xs uppercase tracking-wide text-green-400/80">Forks</p>
                  <p className="mt-1 text-xl font-semibold text-green-200">
                    {result.forks.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-lg border border-green-500/30 bg-black/60 p-3">
                  <p className="text-xs uppercase tracking-wide text-green-400/80">Weekly npm DL</p>
                  <p className="mt-1 text-xl font-semibold text-green-200">
                    {result.weeklyDownloads != null
                      ? result.weeklyDownloads.toLocaleString()
                      : "N/A"}
                  </p>
                </div>
                <div className="rounded-lg border border-green-500/30 bg-black/60 p-3">
                  <p className="text-xs uppercase tracking-wide text-green-400/80">Impact Score</p>
                  <p className={`mt-1 text-xl font-semibold ${scoreColor(result.impactScore)}`}>
                    {result.impactScore}/100
                  </p>
                </div>
              </div>

              {/* Agent reasoning */}
              <div className="mt-4 rounded-lg border border-green-500/30 bg-black/70 p-4">
                <p className="text-xs uppercase tracking-wide text-green-400/80 mb-2">
                  Agent Reasoning
                </p>
                <p className="text-sm text-green-200 leading-relaxed">{result.agentReasoning}</p>
              </div>

              {/* Estimated reward */}
              <div className="mt-4 flex items-center justify-between rounded-lg border border-green-500 bg-green-500/10 px-4 py-3">
                <span className="text-sm text-green-300">Estimated Retroactive Reward</span>
                <span className="text-lg font-bold text-green-200">
                  {result.estimatedRewardKas.toLocaleString()} KAS
                </span>
              </div>
            </div>

            {/* Claim form */}
            {!claim && result.estimatedRewardKas > 0 && pools.length > 0 && (
              <div className="mt-4 rounded-xl border border-green-500/30 bg-green-500/10 p-5">
                <h3 className="text-lg font-semibold text-green-200">Claim from a Pool</h3>
                <p className="mt-1 text-sm text-green-300/90">
                  Select a matching pool and enter your Kaspa wallet address. The Kaspa Covenant
                  will release your reward automatically.
                </p>
                <form onSubmit={onClaim} className="mt-4 grid gap-3">
                  <select
                    value={selectedPool}
                    onChange={(e) => setSelectedPool(e.target.value)}
                    className="rounded-md border border-green-600/80 bg-black px-3 py-2 text-sm text-green-200 outline-none focus:border-green-400"
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
                    placeholder="Your GitHub username"
                    className="rounded-md border border-green-600/80 bg-black px-3 py-2 text-sm text-green-200 outline-none focus:border-green-400"
                  />
                  <input
                    value={kasAddress}
                    onChange={(e) => setKasAddress(e.target.value)}
                    placeholder="Your Kaspa wallet address (kaspa:...)"
                    className="rounded-md border border-green-600/80 bg-black px-3 py-2 text-sm text-green-200 outline-none focus:border-green-400"
                  />
                  {claimError && (
                    <p className="text-xs text-green-400">{claimError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={claiming || !kasAddress.trim() || !maintainerHandle.trim()}
                    className="w-fit rounded-md border border-green-500 px-4 py-2 text-sm text-green-200 hover:bg-green-500 hover:text-black disabled:opacity-50"
                  >
                    {claiming ? "Submitting claim..." : "Claim Retroactive Reward"}
                  </button>
                </form>
              </div>
            )}

            {/* Claim success */}
            {claim && (
              <div className="mt-4 rounded-xl border border-green-500 bg-green-500/15 p-5">
                <p className="text-sm font-semibold text-green-200">Claim submitted and paid</p>
                <p className="mt-2 text-sm text-green-300/90">
                  <span className="font-medium">{claim.amountKas.toLocaleString()} KAS</span> released
                  from <span className="font-medium">{claim.poolName}</span> to{" "}
                  <span className="font-mono text-xs">{claim.kasAddress}</span>
                </p>
                <p className="mt-2 text-xs text-green-400/80">
                  Kaspa TX:{" "}
                  <span className="font-mono">{claim.txHash}</span>
                </p>
                <p className="mt-1 text-xs text-green-500/60">
                  Verify on Kaspa Block Explorer · Claim ID: {claim.id}
                </p>
              </div>
            )}

            {pools.length === 0 && (
              <div className="mt-4 rounded-xl border border-green-500/30 bg-black/70 p-4 text-sm text-green-300/90">
                No active pools available right now.{" "}
                <a href="/dashboard" className="underline text-green-300">Create one</a> or check back later.
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
