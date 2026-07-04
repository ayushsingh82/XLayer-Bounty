import Link from "next/link";

/* ── Inline SVG icons ─────────────────────────────── */
const IconVault = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/>
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
    <circle cx="12" cy="14" r="2.5"/>
    <path d="M12 16.5V19"/>
  </svg>
);
const IconAgent = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="10" rx="2"/>
    <path d="M8 11V7a4 4 0 0 1 8 0v4"/>
    <circle cx="9" cy="16" r="1.2" fill="#16a34a" stroke="none"/>
    <circle cx="15" cy="16" r="1.2" fill="#16a34a" stroke="none"/>
    <path d="M12 3v2M7 4l1.5 1.5M17 4l-1.5 1.5"/>
  </svg>
);
const IconClaim = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconKaspa = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/>
    <polyline points="12 2 12 22"/>
    <polyline points="2 8.5 22 15.5"/>
    <polyline points="22 8.5 2 15.5"/>
  </svg>
);
const IconAgent2 = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
  </svg>
);
const IconGCC = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconLock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IconChain = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
);
const IconBot = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
    <circle cx="9" cy="15" r="1.2" fill="#16a34a" stroke="none"/>
    <circle cx="15" cy="15" r="1.2" fill="#16a34a" stroke="none"/>
  </svg>
);
const IconLeaf = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 22c1.25-7.5 10-8 10-8s-8.75-.5-10-8c6.5 0 12 3 14 9 1-6 4-9 8-9-2 10-8 14-14 14-3 0-5.5-.75-8-2z"/>
  </svg>
);

export default function Home() {
  return (
    <div className="bg-white text-[#0f172a]">

      {/* ══ HERO ══════════════════════════════════ */}
      <section className="w-full bg-white overflow-hidden">
        <div className="w-full max-w-5xl mx-auto px-6 pt-28 pb-20 sm:pt-36 sm:pb-28 text-center">

          <div className="anim-fade-up">
            <span className="badge">Retroactive Public Goods Funding</span>
          </div>

          <h1 className="anim-fade-up anim-delay-1 mt-6 text-[2.5rem] sm:text-[4rem] lg:text-[5rem] font-extrabold tracking-tight leading-[1.05] text-[#0f172a]">
            Pay the work that<br />
            <span style={{ color: "#16a34a" }}>already runs the world</span>
          </h1>

          <p className="anim-fade-up anim-delay-2 mt-6 text-lg sm:text-xl text-[#64748b] max-w-lg mx-auto leading-relaxed">
            AI agents score OSS repos on real GitHub + npm data and release
            KAS through a Kaspa Covenant — no committee, no bias.
          </p>

          <div className="anim-fade-up anim-delay-3 mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link href="/scan" className="btn-primary" style={{ padding: "0.75rem 2rem", fontSize: "1rem" }}>
              Scan your repo →
            </Link>
            <Link href="/dashboard" className="btn-ghost" style={{ padding: "0.75rem 2rem", fontSize: "1rem" }}>
              Browse pools
            </Link>
          </div>

          {/* Stats — separate boxes with gaps */}
          <div className="anim-fade-up anim-delay-4 mt-14 flex flex-wrap justify-center gap-4">
            {[
              { n: "105,000", l: "KAS in pools" },
              { n: "3",       l: "Active pools" },
              { n: "10,000",  l: "Max reward KAS" },
            ].map((s) => (
              <div
                key={s.l}
                style={{
                  background: "#ffffff",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: "4px",
                  padding: "1.25rem 2.25rem",
                  minWidth: "9.5rem",
                  textAlign: "center",
                }}
              >
                <p style={{ fontSize: "1.875rem", fontWeight: 800, fontFamily: "var(--font-geist-mono, monospace)", color: "#0f172a", lineHeight: 1, letterSpacing: "-0.03em" }}>{s.n}</p>
                <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.375rem", fontWeight: 500 }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ═══════════════════════════ */}
      <section className="w-full bg-white" style={{ borderTop: "1px solid #e2e8f0" }}>
        <div className="w-full max-w-5xl mx-auto px-6 py-20 sm:py-28">

          <div className="anim-fade-up mb-14">
            <div style={{ borderLeft: "3px solid #16a34a", paddingLeft: "0.875rem", display: "inline-block" }}>
              <p style={{ fontSize: "0.6875rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>How it works</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] mt-1">Three steps. No gatekeepers.</h2>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {[
              { Icon: IconVault,  n: "01", who: "Funder",     title: "Create a pool",       body: "Lock KAS with eligibility criteria. Any OSS package with proven real-world usage can qualify." },
              { Icon: IconAgent,  n: "02", who: "AI Agent",   title: "Scan, score, verify", body: "Pulls live GitHub stars, forks, npm downloads. Returns a 0–100 impact score with transparent reasoning." },
              { Icon: IconClaim,  n: "03", who: "Maintainer", title: "Claim the reward",    body: "Submit your Kaspa wallet. The Covenant releases payment automatically on verified impact. No committee." },
            ].map(({ Icon, n, who, title, body }, i) => (
              <div
                key={n}
                className="anim-fade-up"
                style={{
                  animationDelay: `${i * 0.08}s`,
                  border: "1.5px solid #e2e8f0",
                  borderRadius: "4px",
                  padding: "1.75rem",
                  background: "#ffffff",
                  transition: "border-color 0.15s",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                  <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "4px", padding: "0.5rem", display: "inline-flex" }}>
                    <Icon />
                  </div>
                  <span style={{ fontFamily: "var(--font-geist-mono, monospace)", fontSize: "0.75rem", fontWeight: 700, color: "#16a34a" }}>{n}</span>
                </div>
                <p style={{ fontSize: "0.6875rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: "0.375rem" }}>{who}</p>
                <h3 className="text-base font-bold text-[#0f172a] mb-2">{title}</h3>
                <p className="text-sm text-[#64748b] leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ WHY RETROACTIVE ════════════════════════ */}
      <section className="w-full bg-white" style={{ borderTop: "1px solid #e2e8f0" }}>
        <div className="w-full max-w-5xl mx-auto px-6 py-20 sm:py-28">
          <div className="grid gap-14 lg:gap-20 lg:grid-cols-2 items-start">

            <div className="anim-fade-up">
              <div style={{ borderLeft: "3px solid #16a34a", paddingLeft: "0.875rem", display: "inline-block", marginBottom: "1.5rem" }}>
                <p style={{ fontSize: "0.6875rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>Why retroactive</p>
                <h2 className="text-3xl sm:text-[2.25rem] font-extrabold text-[#0f172a] mt-1 leading-tight">
                  Fund what works —<br />not what might.
                </h2>
              </div>
              <div className="space-y-3 text-[#64748b] leading-relaxed text-sm sm:text-base">
                <p>Prospective grants fund promises. Retroactive grants fund proof. GitHub stars, npm downloads, and fork counts already exist. The work already happened — the only missing piece was the payment.</p>
                <p>Every RetroFund decision is verifiable. The impact formula is open. The Kaspa Covenant is on-chain. No black box, no insider committee.</p>
              </div>
              <div className="mt-8">
                <Link href="/scan" className="btn-primary" style={{ padding: "0.6rem 1.5rem" }}>Check my repo →</Link>
              </div>
            </div>

            <div className="anim-fade-up anim-delay-2 space-y-3">
              {[
                { Icon: IconLock,  l: "Non-gameable metrics",     d: "Stars, forks, and downloads are objective — not self-reported milestones committees must trust." },
                { Icon: IconChain, l: "On-chain enforcement",     d: "The Kaspa Covenant IS the grant contract. Funds can only release on verified impact." },
                { Icon: IconBot,   l: "Agent-powered evaluation", d: "Fetch.ai uAgent scans via Agentverse and ASI:One in real-time — no frontend required." },
                { Icon: IconLeaf,  l: "Open infrastructure",      d: "Any DAO can fork the pool schema. Scoring weights are fully configurable per pool." },
              ].map(({ Icon, l, d }) => (
                <div
                  key={l}
                  style={{ display: "flex", gap: "1rem", padding: "1rem", border: "1.5px solid #e2e8f0", borderRadius: "4px" }}
                >
                  <div style={{ flexShrink: 0, marginTop: "2px" }}><Icon /></div>
                  <div>
                    <p className="text-sm font-bold text-[#0f172a] mb-0.5">{l}</p>
                    <p className="text-xs text-[#64748b] leading-relaxed">{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ TECH STACK ═════════════════════════════ */}
      <section className="w-full bg-white" style={{ borderTop: "1px solid #e2e8f0" }}>
        <div className="w-full max-w-5xl mx-auto px-6 py-20 sm:py-24">
          <div className="anim-fade-up mb-12 text-center">
            <p style={{ fontSize: "0.6875rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>Powered by</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              { Icon: IconKaspa,  name: "Kaspa",   nameColor: "#16a34a", tag: "BlockDAG · Covenants",        d: "On-chain grant contracts. Funds release only when impact is verified — no human approvals." },
              { Icon: IconAgent2, name: "Fetch.ai", nameColor: "#3b82f6", tag: "Agentverse · ASI:One",       d: "uAgent implements Agent Chat Protocol. Fully operable through ASI:One without any frontend." },
              { Icon: IconGCC,    name: "GCC",      nameColor: "#8b5cf6", tag: "Public Goods · Open Source", d: "Modular pool schema, non-gameable metrics, open-source — forkable by any grant program." },
            ].map(({ Icon, name, nameColor, tag, d }, i) => (
              <div
                key={name}
                className="anim-fade-up"
                style={{
                  animationDelay: `${i * 0.08}s`,
                  border: "1.5px solid #e2e8f0",
                  borderRadius: "4px",
                  padding: "1.75rem",
                  background: "#ffffff",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.875rem" }}>
                  <Icon />
                  <p style={{ fontSize: "1.125rem", fontWeight: 800, color: nameColor }}>{name}</p>
                </div>
                <p style={{ fontSize: "0.6875rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: "0.625rem" }}>{tag}</p>
                <p className="text-sm text-[#64748b] leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ════════════════════════════════════ */}
      <section className="w-full bg-white" style={{ borderTop: "1px solid #e2e8f0" }}>
        <div className="w-full max-w-5xl mx-auto px-6 py-24 sm:py-32 text-center">
          <div className="anim-fade-up">
            <span className="badge">10 seconds to check</span>
          </div>
          <h2 className="anim-fade-up anim-delay-1 mt-6 text-[2rem] sm:text-[2.75rem] font-extrabold text-[#0f172a] leading-tight">
            Your repo might qualify<br />
            <span style={{ color: "#16a34a" }}>right now.</span>
          </h2>
          <p className="anim-fade-up anim-delay-2 mt-4 text-base sm:text-lg text-[#64748b] max-w-xs mx-auto">
            Enter your GitHub repo. Get an instant impact score and estimated reward.
          </p>
          <div className="anim-fade-up anim-delay-3 mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/scan" className="btn-primary" style={{ padding: "0.875rem 2.5rem", fontSize: "1rem" }}>
              Scan my repo →
            </Link>
            <Link href="/dashboard" className="btn-ghost" style={{ padding: "0.875rem 2.5rem", fontSize: "1rem" }}>
              View pools
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
