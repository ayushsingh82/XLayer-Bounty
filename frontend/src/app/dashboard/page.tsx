"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { isAddress, parseEther } from "viem";
import type { BountyItem } from "@/lib/types";

const BOUNTY_ESCROW_NATIVE_ADDRESS =
  (process.env.NEXT_PUBLIC_BOUNTY_ESCROW_NATIVE_ADDRESS as `0x${string}` | undefined) ??
  "0xee34aef61c8f20703a89eEcfC1eB5819Fd18FfcC";

const BOUNTY_ESCROW_NATIVE_ABI = [
  {
    type: "function",
    name: "createBounty",
    stateMutability: "payable",
    inputs: [{ name: "issueUrl", type: "string" }],
    outputs: [{ name: "bountyId", type: "uint256" }],
  },
] as const;

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const [mode, setMode] = useState<"creator" | "developer">("creator");
  const [issueUrl, setIssueUrl] = useState("");
  const [amountOkb, setAmountOkb] = useState("0.25");
  const [prUrls, setPrUrls] = useState<Record<string, string>>({});
  const [payoutAddresses, setPayoutAddresses] = useState<Record<string, string>>({});
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
    if (!walletClient || !publicClient) return setError("Wallet client not ready.");
    if (!issueUrl.trim()) return setError("Issue URL is required.");
    if (!Number(amountOkb) || Number(amountOkb) <= 0) return setError("Amount must be greater than 0.");
    setError(null);
    setLoading(true);
    try {
      // Force wallet tx signature for bounty registration.
      const hash = await walletClient.writeContract({
        account: walletClient.account,
        address: BOUNTY_ESCROW_NATIVE_ADDRESS,
        abi: BOUNTY_ESCROW_NATIVE_ABI,
        functionName: "createBounty",
        args: [issueUrl.trim()],
        value: parseEther(amountOkb),
      });
      await publicClient.waitForTransactionReceipt({ hash });

      const res = await fetch("/api/bounties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          issueUrl,
          amountOkb: Number(amountOkb),
          creator: address,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create bounty");
      setIssueUrl("");
      setAmountOkb("0.25");
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
    const payoutAddress = payoutAddresses[bountyId]?.trim();
    if (!prUrl) return setError("Please paste PR URL.");
    if (!payoutAddress) return setError("Please enter payout wallet address.");
    if (!isAddress(payoutAddress)) return setError("Invalid payout wallet address.");
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/bounties/${bountyId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prUrl, solver: address, payoutAddress }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submit failed");
      setPrUrls((prev) => ({ ...prev, [bountyId]: "" }));
      setPayoutAddresses((prev) => ({ ...prev, [bountyId]: "" }));
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submit failed");
    } finally {
      setLoading(false);
    }
  }

  const totalEscrowed = useMemo(
    () => items.reduce((sum, item) => sum + item.amountOkb, 0),
    [items]
  );

  const openCount = useMemo(() => items.filter((x) => x.status === "open").length, [items]);
  const resolvedCount = useMemo(() => items.filter((x) => x.status === "resolved").length, [items]);

  return (
    <div className="min-h-screen bg-black text-[#86efac]">
      <section className="section-container py-10">
        <h1 className="text-3xl font-bold tracking-tight">XLayer Agent Console</h1>
        <p className="mt-2 text-green-300/90">
          Operate autonomous bounty workflows end-to-end: publish tasks, process PR submissions,
          and track final resolution with agent rationale.
        </p>
        <p className="mt-2 text-xs text-green-400/90">
          Wallet: {isConnected && address ? address : "Not connected"}
        </p>

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={() => setMode("creator")}
            className={`rounded-md border px-3 py-1.5 text-sm ${mode === "creator" ? "border-green-500 bg-green-500/20 text-green-200" : "border-green-700/70 text-green-300"}`}
          >
            Operator Mode
          </button>
          <button
            type="button"
            onClick={() => setMode("developer")}
            className={`rounded-md border px-3 py-1.5 text-sm ${mode === "developer" ? "border-green-500 bg-green-500/20 text-green-200" : "border-green-700/70 text-green-300"}`}
          >
            Solver Mode
          </button>
        </div>

        <div className="mt-4 rounded-xl border border-green-500/30 bg-black/70 p-4 text-sm text-green-300/90">
          {mode === "creator"
            ? "Operator mode: publish funded issues and monitor submission lifecycle in one place. Creating bounty triggers a wallet transaction signature."
            : "Solver mode: pick open bounties, attach your PR, and follow review progress."}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4">
            <p className="text-xs uppercase tracking-wide text-green-400/80">Total Escrowed</p>
            <p className="mt-2 text-2xl font-semibold text-green-200">{totalEscrowed.toFixed(4)} OKB</p>
          </div>
          <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4">
            <p className="text-xs uppercase tracking-wide text-green-400/80">Open Bounties</p>
            <p className="mt-2 text-2xl font-semibold text-green-200">{openCount}</p>
          </div>
          <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4">
            <p className="text-xs uppercase tracking-wide text-green-400/80">Resolved</p>
            <p className="mt-2 text-2xl font-semibold text-green-200">{resolvedCount}</p>
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded border border-green-500/50 bg-green-500/15 px-3 py-2 text-sm text-green-200">
            {error}
          </p>
        )}

        {mode === "creator" && (
          <div className="mt-6 rounded-xl border border-green-500/30 bg-green-500/10 p-5">
            <h2 className="text-xl font-semibold">Create bounty (native OKB)</h2>
            <p className="mt-1 text-sm text-green-300/90">
              Agent tip: use explicit issue scope and realistic reward to improve solver quality.
            </p>
            <form onSubmit={onCreate} className="mt-4 grid gap-3 sm:grid-cols-3">
              <input
                value={issueUrl}
                onChange={(e) => setIssueUrl(e.target.value)}
                placeholder="GitHub issue URL"
                className="sm:col-span-2 rounded-md border border-green-600/80 bg-black px-3 py-2 text-sm text-green-200 outline-none focus:border-green-400"
              />
              <input
                value={amountOkb}
                onChange={(e) => setAmountOkb(e.target.value)}
                placeholder="OKB amount (e.g. 0.25)"
                className="rounded-md border border-green-600/80 bg-black px-3 py-2 text-sm text-green-200 outline-none focus:border-green-400"
              />
              <button
                type="submit"
                disabled={loading}
                className="sm:col-span-3 w-fit rounded-md border border-green-500 px-4 py-2 text-sm text-green-200 hover:bg-green-500 hover:text-black disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create bounty"}
              </button>
            </form>

            <p className="mt-6 text-sm text-green-300/90">
              Your bounties: <span className="font-semibold text-green-200">{creatorItems.length}</span>
            </p>
          </div>
        )}

        <div className="mt-6 space-y-3">
          {items.length === 0 && (
            <div className="rounded-xl border border-green-500/30 bg-black/70 p-6 text-center">
              <p className="text-base font-medium text-green-200">No bounties yet</p>
              <p className="mt-1 text-sm text-green-300/90">
                Create the first bounty to start collecting solver submissions.
              </p>
            </div>
          )}
          {items.map((bounty) => (
            <div key={bounty.id} className="rounded-xl border border-green-500/30 bg-green-500/10 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <a
                  href={bounty.issueUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-green-300 underline"
                >
                  {bounty.issueUrl}
                </a>
                <span className="text-xs text-green-400/90">#{bounty.id}</span>
              </div>
              <p className="mt-2 text-sm text-green-200">
                {bounty.amountOkb.toFixed(4)} OKB · <span className="uppercase">{bounty.status}</span>
              </p>
              <p className="text-xs text-green-400/90">Creator: {bounty.creator}</p>

              {mode === "developer" && bounty.status === "open" && (
                <div className="mt-3 grid gap-2">
                  <input
                    value={prUrls[bounty.id] ?? ""}
                    onChange={(e) => setPrUrls((prev) => ({ ...prev, [bounty.id]: e.target.value }))}
                    placeholder="GitHub PR URL"
                    className="min-w-[280px] rounded-md border border-green-600/80 bg-black px-3 py-2 text-sm text-green-200 outline-none focus:border-green-400"
                  />
                  <input
                    value={payoutAddresses[bounty.id] ?? ""}
                    onChange={(e) =>
                      setPayoutAddresses((prev) => ({ ...prev, [bounty.id]: e.target.value }))
                    }
                    placeholder="Payout wallet address (0x...)"
                    className="min-w-[280px] rounded-md border border-green-600/80 bg-black px-3 py-2 text-sm text-green-200 outline-none focus:border-green-400"
                  />
                  <button
                    type="button"
                    onClick={() => void onSubmit(bounty.id)}
                    disabled={loading}
                    className="rounded-md border border-green-500 px-4 py-2 text-sm text-green-200 hover:bg-green-500 hover:text-black disabled:opacity-50"
                  >
                    Submit PR
                  </button>
                </div>
              )}

              {bounty.submission && (
                <p className="mt-3 text-xs text-green-300/90">
                  Submission:{" "}
                  <a href={bounty.submission.prUrl} target="_blank" rel="noreferrer" className="underline">
                    {bounty.submission.prUrl}
                  </a>
                  {" · "}Payout: {bounty.submission.payoutAddress}
                </p>
              )}

              {bounty.resolution && (
                <p className={`mt-2 text-xs ${bounty.resolution.approved ? "text-green-300" : "text-green-400"}`}>
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

