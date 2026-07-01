import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-[#86efac]">
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
            AI Bounty Automation
          </p>
          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-green-200 sm:text-5xl md:text-6xl">
            Ship faster with <span className="text-accent-green">XLayer</span> bounty flows
            <br /> for dev teams and builders
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-green-300/90 sm:mt-8 sm:text-xl">
            Create funded tasks, collect PR submissions, and track outcomes in one clean
            dashboard built for on-chain execution.
          </p>
          <div className="mx-auto mt-8 grid max-w-2xl gap-3 text-left sm:grid-cols-2">
           
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/dashboard" className="btn-green px-5 py-2.5 text-sm font-semibold transition-colors">
              Open dashboard
            </Link>
            <Link href="#about" className="btn-black px-5 py-2.5 text-sm font-semibold transition-colors">
              Learn more
            </Link>
          </div>
          <div className="mx-auto mt-8 grid max-w-3xl gap-3 text-left sm:grid-cols-3">
            <div className="rounded-lg border border-green-500/30 bg-black/80 p-3">
              <p className="text-xs uppercase tracking-wide text-green-400/80">Fast setup</p>
              <p className="mt-1 text-sm text-green-200">
                Turn any GitHub issue into a funded bounty in seconds.
              </p>
            </div>
            <div className="rounded-lg border border-green-500/30 bg-black/80 p-3">
              <p className="text-xs uppercase tracking-wide text-green-400/80">Traceable flow</p>
              <p className="mt-1 text-sm text-green-200">
                Keep each PR submission, status update, and outcome fully visible.
              </p>
            </div>
            <div className="rounded-lg border border-green-500/30 bg-black/80 p-3">
              <p className="text-xs uppercase tracking-wide text-green-400/80">Team ready</p>
              <p className="mt-1 text-sm text-green-200">
                Give creators and solvers one focused workspace that stays simple.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="border-t border-green-500/30 bg-black py-14">
        <div className="section-container text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-green-200">Ready for your next build</h2>
          <p className="mt-3 text-green-300/90">
            Purpose-built for XLayer teams: create bounties, accept GitHub PR submissions, and
            monitor clear resolution outcomes from one dashboard.
          </p>
          <div className="mt-8 grid gap-3 text-left sm:grid-cols-3">
            <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4">
              <p className="text-xs uppercase tracking-wide text-green-400/80">Step 01</p>
              <p className="mt-2 text-sm text-green-200">
                Post the issue link, set reward size, and publish the bounty.
              </p>
            </div>
            <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4">
              <p className="text-xs uppercase tracking-wide text-green-400/80">Step 02</p>
              <p className="mt-2 text-sm text-green-200">
                Developers submit solution PR links directly from the console.
              </p>
            </div>
            <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4">
              <p className="text-xs uppercase tracking-wide text-green-400/80">Step 03</p>
              <p className="mt-2 text-sm text-green-200">
                Review decisions with clear approval status and resolution notes.
              </p>
            </div>
          </div>
          <div className="mt-10 rounded-xl border border-green-500/30 bg-green-500/10 p-5 text-left">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-green-300">
              Why teams use this flow
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-green-200">
              <li>• Funded from day one: creators lock native OKB rewards upfront.</li>
              <li>• Verifiable delivery: every submission links straight to a GitHub PR.</li>
              <li>• Transparent decisions: resolution status and reasons stay visible per bounty.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
