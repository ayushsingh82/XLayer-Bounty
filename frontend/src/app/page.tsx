import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-[#86efac]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.16),_transparent_55%)]" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(34,197,94,1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,1) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="section-container relative z-10 pt-16 pb-12 text-center md:pt-24 md:pb-20">
          <p className="mx-auto mb-4 w-fit rounded-full border border-green-500/40 bg-green-500/10 px-3 py-1 text-xs uppercase tracking-wide text-green-300">
            Retroactive Public Goods Funding
          </p>
          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-green-200 sm:text-5xl md:text-6xl">
            Pay the open-source work
            <br />
            <span className="text-accent-green">that already runs the world</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-green-300/90 sm:mt-8 sm:text-xl">
            AI agents scan GitHub and npm, measure real-world usage impact, and retroactively
            reward maintainers — with every payment locked and released through a Kaspa Covenant.
            No committee. No bias. Just proof of impact.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/scan" className="btn-green px-5 py-2.5 text-sm font-semibold transition-colors">
              Scan my repo
            </Link>
            <Link href="/dashboard" className="btn-black px-5 py-2.5 text-sm font-semibold transition-colors">
              Browse pools
            </Link>
          </div>

          <div className="mx-auto mt-8 grid max-w-3xl gap-3 text-left sm:grid-cols-3">
            <div className="rounded-lg border border-green-500/30 bg-black/80 p-3">
              <p className="text-xs uppercase tracking-wide text-green-400/80">No gatekeepers</p>
              <p className="mt-1 text-sm text-green-200">
                Usage data decides who gets funded — not a committee, not insider connections.
              </p>
            </div>
            <div className="rounded-lg border border-green-500/30 bg-black/80 p-3">
              <p className="text-xs uppercase tracking-wide text-green-400/80">Conditional on-chain</p>
              <p className="mt-1 text-sm text-green-200">
                Kaspa Covenants lock funds until the AI agent verifies ownership and impact.
              </p>
            </div>
            <div className="rounded-lg border border-green-500/30 bg-black/80 p-3">
              <p className="text-xs uppercase tracking-wide text-green-400/80">Discoverable via ASI:One</p>
              <p className="mt-1 text-sm text-green-200">
                Registered on Fetch.ai Agentverse — query funding pools through ASI:One chat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="about" className="border-t border-green-500/30 bg-black py-14">
        <div className="section-container text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-green-200">How RetroFund works</h2>
          <p className="mt-3 text-green-300/90">
            Three actors, one trustless loop — no human gatekeeper at any step.
          </p>
          <div className="mt-8 grid gap-3 text-left sm:grid-cols-3">
            <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4">
              <p className="text-xs uppercase tracking-wide text-green-400/80">Step 01 — Funder</p>
              <p className="mt-2 text-sm font-medium text-green-200">Create a retroactive pool</p>
              <p className="mt-1 text-sm text-green-300/90">
                A DAO or grant program locks KAS into a pool with criteria: "npm packages with
                &gt;50k weekly downloads that were never compensated."
              </p>
            </div>
            <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4">
              <p className="text-xs uppercase tracking-wide text-green-400/80">Step 02 — AI Agent</p>
              <p className="mt-2 text-sm font-medium text-green-200">Scan, score, and verify</p>
              <p className="mt-1 text-sm text-green-300/90">
                The RetroFund agent reads GitHub stars, npm downloads, forks, and dependents.
                It produces a transparent impact score and agent reasoning — no black box.
              </p>
            </div>
            <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4">
              <p className="text-xs uppercase tracking-wide text-green-400/80">Step 03 — Maintainer</p>
              <p className="mt-2 text-sm font-medium text-green-200">Claim retroactive reward</p>
              <p className="mt-1 text-sm text-green-300/90">
                Maintainer submits their Kaspa address. The Covenant releases payment automatically
                — no waiting, no chasing, no approval form.
              </p>
            </div>
          </div>

          <div className="mt-10 rounded-xl border border-green-500/30 bg-green-500/10 p-5 text-left">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-green-300">
              Why retroactive, not prospective?
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-green-200">
              <li>• Proven impact beats promises — fund what already works, not what might work.</li>
              <li>• No speculation risk — usage data is objective, not a pitch deck.</li>
              <li>• Every decision is transparent and auditable on the Kaspa BlockDAG.</li>
              <li>• Inspired by Optimism RetroFunding — but fully autonomous, no human committee.</li>
            </ul>
          </div>

          <div className="mt-6 rounded-xl border border-green-500/30 bg-green-500/10 p-5 text-left">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-green-300">
              Powered by three ecosystems
            </h3>
            <div className="mt-3 grid gap-2 sm:grid-cols-3 text-sm">
              <div>
                <p className="font-medium text-green-200">Kaspa BlockDAG</p>
                <p className="mt-1 text-green-300/90">Covenants enforce payment conditions — funds are mathematically impossible to release without verified impact.</p>
              </div>
              <div>
                <p className="font-medium text-green-200">Fetch.ai / ASI:One</p>
                <p className="mt-1 text-green-300/90">RetroFund agent registered on Agentverse. Anyone can query pool eligibility directly in an ASI:One conversation.</p>
              </div>
              <div>
                <p className="font-medium text-green-200">GCC Public Goods</p>
                <p className="mt-1 text-green-300/90">Modular, forkable pool infrastructure any grant program can adopt — built to outlive the hackathon.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
