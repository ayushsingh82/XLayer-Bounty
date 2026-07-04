"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { RetroPool, Claim } from "@/lib/types";

type Tab = "pools" | "claims";

export default function DashboardPage() {
  const [tab, setTab] = useState<Tab>("pools");
  const [pools, setPools] = useState<RetroPool[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [pr, cr] = await Promise.all([
        fetch("/api/pools").then((r) => r.json()) as Promise<{ pools: RetroPool[] }>,
        fetch("/api/claim").then((r) => r.json()) as Promise<{ claims: Claim[] }>,
      ]);
      setPools(pr.pools ?? []);
      setClaims(cr.claims ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const statusColor: Record<string, string> = {
    active:    "bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]",
    exhausted: "bg-[#fff7ed] text-[#ea580c] border-[#fed7aa]",
    closed:    "bg-[#f8fafc] text-[#94a3b8] border-[#e2e8f0]",
  };
  const claimColor: Record<string, string> = {
    pending:  "bg-[#fefce8] text-[#ca8a04] border-[#fef08a]",
    verified: "bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]",
    paid:     "bg-[#eff6ff] text-[#3b82f6] border-[#bfdbfe]",
  };

  const totalKas = pools.reduce((s, p) => s + p.amountKas, 0);
  const activeCount = pools.filter((p) => p.status === "active").length;
  const totalClaimed = claims.reduce((s, c) => s + c.amountKas, 0);

  return (
    <div className="bg-white min-h-screen">
      <div className="wrap pt-10 pb-24">

        {/* Page header */}
        <div className="flex items-start justify-between gap-4 flex-wrap mb-8 anim-fade-up pt-6">
          <div>
            <h1 className="text-2xl font-bold text-[#0f172a]">Dashboard</h1>
            <p className="mt-1 text-sm text-[#64748b]">Funding pools and retroactive claims.</p>
          </div>
          <Link href="/create-pool" className="btn-primary text-sm flex-shrink-0">
            + Create Pool
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8 anim-fade-up anim-delay-1">
          {[
            { label: "KAS in pools", value: totalKas.toLocaleString() },
            { label: "Active pools",  value: activeCount.toString() },
            { label: "KAS rewarded",  value: totalClaimed.toLocaleString() },
          ].map((s) => (
            <div key={s.label} className="border border-[#e2e8f0] rounded-xl px-4 py-4">
              <p className="text-[10px] text-[#94a3b8] uppercase tracking-widest font-semibold">{s.label}</p>
              <p className="mt-1.5 text-2xl font-bold font-mono text-[#16a34a]">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 anim-fade-up anim-delay-2">
          {(["pools", "claims"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                tab === t
                  ? "bg-[#f0fdf4] text-[#16a34a]"
                  : "text-[#64748b] hover:text-[#0f172a]"
              }`}
            >
              {t === "pools" ? `Funding Pools (${pools.length})` : `Claims (${claims.length})`}
            </button>
          ))}
        </div>

        {/* ── POOLS ── */}
        {tab === "pools" && (
          <div className="space-y-4">
            {loading && (
              <>
                {[1,2,3].map(i => (
                  <div key={i} className="card">
                    <div className="shimmer-bg h-4 w-1/3 rounded mb-3" />
                    <div className="shimmer-bg h-3 w-2/3 rounded mb-3" />
                    <div className="shimmer-bg h-1.5 rounded-full" />
                  </div>
                ))}
              </>
            )}

            {!loading && pools.length === 0 && (
              <div className="card text-center py-14">
                <p className="text-3xl mb-3">🏦</p>
                <p className="text-sm font-medium text-[#0f172a] mb-1">No pools yet</p>
                <p className="text-xs text-[#94a3b8] mb-5">Create the first retroactive funding pool</p>
                <Link href="/create-pool" className="btn-primary text-sm">
                  + Create Pool
                </Link>
              </div>
            )}

            {!loading && pools.map((pool, i) => {
              const pct = pool.amountKas > 0 ? Math.round((pool.remainingKas / pool.amountKas) * 100) : 0;
              return (
                <div key={pool.id} className="card anim-fade-up" style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <h4 className="text-sm font-bold text-[#0f172a]">{pool.name}</h4>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${statusColor[pool.status] ?? ""}`}>
                          {pool.status}
                        </span>
                      </div>
                      {pool.description && (
                        <p className="text-xs text-[#64748b]">{pool.description}</p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xl font-bold font-mono text-[#16a34a]">
                        {pool.remainingKas.toLocaleString()}
                        <span className="text-xs font-normal text-[#94a3b8] ml-1">KAS</span>
                      </p>
                      <p className="text-[10px] text-[#94a3b8]">of {pool.amountKas.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="h-1.5 bg-[#e2e8f0] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#22c55e] rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1.5">
                      <span className="text-[10px] text-[#94a3b8]">{pct}% remaining</span>
                      <span className="text-[10px] text-[#94a3b8]">{pool.claimCount} claim{pool.claimCount !== 1 ? "s" : ""}</span>
                    </div>
                  </div>

                  {pool.criteria && (
                    <p className="mt-2 text-xs text-[#94a3b8] italic leading-relaxed">{pool.criteria}</p>
                  )}
                  {pool.creator && (
                    <p className="mt-1.5 text-[10px] text-[#cbd5e1]">Created by {pool.creator}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── CLAIMS ── */}
        {tab === "claims" && (
          <div className="space-y-4">
            {loading && (
              <>
                {[1,2].map(i => (
                  <div key={i} className="card">
                    <div className="shimmer-bg h-4 w-1/3 rounded mb-2" />
                    <div className="shimmer-bg h-3 w-2/3 rounded" />
                  </div>
                ))}
              </>
            )}

            {!loading && claims.length === 0 && (
              <div className="card text-center py-14">
                <p className="text-3xl mb-3">📭</p>
                <p className="text-sm font-medium text-[#0f172a] mb-1">No claims yet</p>
                <p className="text-xs text-[#94a3b8] mb-5">Scan a repo to make the first retroactive claim</p>
                <Link href="/scan" className="btn-primary text-sm">
                  Scan a repo →
                </Link>
              </div>
            )}

            {!loading && claims.map((c, i) => (
              <div key={c.id} className="card anim-fade-up" style={{ animationDelay: `${i * 0.06}s` }}>
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <a
                        href={c.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-bold text-[#0f172a] hover:text-[#16a34a] hover:underline truncate"
                      >
                        {c.repoUrl.replace("https://github.com/", "")}
                      </a>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${claimColor[c.status] ?? ""}`}>
                        {c.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#64748b]">
                      {c.poolName} · @{c.maintainerHandle}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xl font-bold font-mono text-[#16a34a]">
                      {c.amountKas.toLocaleString()}
                      <span className="text-xs font-normal text-[#94a3b8] ml-1">KAS</span>
                    </p>
                  </div>
                </div>

                {c.txHash && (
                  <div className="mt-3 pt-3 border-t border-[#f1f5f9]">
                    <p className="text-[10px] text-[#94a3b8] uppercase tracking-widest font-semibold mb-0.5">Kaspa TX</p>
                    <p className="font-mono text-xs text-[#64748b] truncate">{c.txHash}</p>
                  </div>
                )}

                <p className="mt-2 text-[10px] text-[#cbd5e1]">
                  {new Date(c.submittedAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
