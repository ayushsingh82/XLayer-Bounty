"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { RetroPool } from "@/lib/types";

export default function CreatePoolPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [criteria, setCriteria] = useState("");
  const [creator, setCreator] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !amount.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/pools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          amountKas: Number(amount),
          criteria: criteria.trim(),
          creator: creator.trim() || "Anonymous",
        }),
      });
      const data = await res.json() as RetroPool & { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Failed to create pool");
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="wrap pt-16 pb-20">

        {/* Header */}
        <div className="mb-10 anim-fade-up">
          <h1 className="text-[2rem] font-extrabold text-[#0f172a] leading-tight">
            Create a retroactive pool
          </h1>
          <p className="mt-2 text-sm text-[#64748b] max-w-md">
            Lock KAS with clear eligibility criteria — the AI agent handles evaluation and the
            Kaspa Covenant releases payment automatically on verified impact.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-5">

          {/* Form */}
          <form
            onSubmit={onSubmit}
            className="sm:col-span-3 anim-fade-up anim-delay-1 space-y-5"
          >
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5 uppercase tracking-wide">
                Pool name <span className="text-red-400">*</span>
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Critical OSS Infrastructure Fund"
                className="field"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5 uppercase tracking-wide">
                Total KAS amount <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 10000"
                min={1}
                className="field"
              />
              {amount && Number(amount) > 0 && (
                <p className="mt-1 text-xs text-[#94a3b8]">
                  ≈ funds ~{Math.floor(Number(amount) / 500)} repos at 500 KAS minimum
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5 uppercase tracking-wide">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What does this pool fund? Who is it for?"
                rows={3}
                className="field"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5 uppercase tracking-wide">
                Eligibility criteria
              </label>
              <textarea
                value={criteria}
                onChange={(e) => setCriteria(e.target.value)}
                placeholder="e.g. npm packages with >50k weekly downloads that have never received a grant"
                rows={2}
                className="field"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5 uppercase tracking-wide">
                Created by
              </label>
              <input
                value={creator}
                onChange={(e) => setCreator(e.target.value)}
                placeholder="Your name or DAO name"
                className="field"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={creating || !name.trim() || !amount.trim()}
                className="btn-primary px-6 py-2.5"
              >
                {creating ? "Creating pool…" : "Create Pool"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="btn-ghost px-5 py-2.5"
              >
                Cancel
              </button>
            </div>
          </form>

          {/* Info panel */}
          <div className="sm:col-span-2 anim-fade-up anim-delay-2 space-y-4">
            <div className="rounded-2xl border border-[#e2e8f0] p-5">
              <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-widest mb-3">
                How it works
              </p>
              <div className="space-y-3">
                {[
                  { n: "01", t: "Lock KAS", d: "Your KAS is locked in the pool at creation. It can only be released to verified maintainers." },
                  { n: "02", t: "Set criteria", d: "Describe what qualifies. The agent will score repos against your criteria using objective usage data." },
                  { n: "03", t: "Automated payout", d: "When a maintainer scans their repo and meets your criteria, the Kaspa Covenant releases payment automatically." },
                ].map((s) => (
                  <div key={s.n} className="flex gap-3">
                    <span className="text-xs font-mono font-bold text-[#16a34a] flex-shrink-0 mt-0.5">{s.n}</span>
                    <div>
                      <p className="text-xs font-semibold text-[#0f172a]">{s.t}</p>
                      <p className="text-xs text-[#64748b] leading-relaxed">{s.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-[#f0fdf4] border border-[#bbf7d0] p-5">
              <p className="text-xs font-semibold text-[#16a34a] uppercase tracking-widest mb-2">
                Seed pools (live)
              </p>
              {[
                { name: "Critical OSS Fund", kas: "50,000 KAS" },
                { name: "Privacy & Digital Rights", kas: "25,000 KAS" },
                { name: "Dev Tooling Grants", kas: "30,000 KAS" },
              ].map((p) => (
                <div key={p.name} className="flex justify-between py-1.5 border-b border-[#bbf7d0] last:border-0">
                  <span className="text-xs text-[#374151]">{p.name}</span>
                  <span className="text-xs font-mono font-bold text-[#16a34a]">{p.kas}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
