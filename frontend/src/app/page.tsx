import Link from "next/link";

/* ── SVG icons ─────────────────────────────────── */
const IconVault = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/>
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
    <circle cx="12" cy="14" r="2.5"/>
    <path d="M12 16.5V19"/>
  </svg>
);
const IconAgent = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="10" rx="2"/>
    <path d="M8 11V7a4 4 0 0 1 8 0v4"/>
    <circle cx="9" cy="16" r="1.2" fill="#16a34a" stroke="none"/>
    <circle cx="15" cy="16" r="1.2" fill="#16a34a" stroke="none"/>
    <path d="M12 3v2M7 4l1.5 1.5M17 4l-1.5 1.5"/>
  </svg>
);
const IconCheck = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconKaspa = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/>
    <line x1="12" y1="2" x2="12" y2="22"/>
    <line x1="2" y1="8.5" x2="22" y2="15.5"/>
    <line x1="22" y1="8.5" x2="2" y2="15.5"/>
  </svg>
);
const IconFetch = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
  </svg>
);
const IconGCC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconLock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IconChain = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
);
const IconBot = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="10" rx="2"/>
    <path d="M8 11V7a4 4 0 0 1 8 0v4"/>
    <circle cx="9" cy="16" r="1" fill="#16a34a" stroke="none"/>
    <circle cx="15" cy="16" r="1" fill="#16a34a" stroke="none"/>
    <path d="M12 3v4"/>
  </svg>
);
const IconLeaf = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 22c1.25-7.5 10-8 10-8s-8.75-.5-10-8c6.5 0 12 3 14 9 1-6 4-9 8-9-2 10-8 14-14 14-3 0-5.5-.75-8-2z"/>
  </svg>
);

export default function Home() {
  return (
    <div style={{ background: "#ffffff", color: "#0f172a" }}>

      {/* ── HERO ──────────────────────────────────── */}
      <section style={{ background: "#ffffff", width: "100%" }}>
        <div style={{ maxWidth: "1152px", margin: "0 auto", padding: "clamp(5rem, 10vw, 9rem) 2rem clamp(4rem, 8vw, 7rem)", textAlign: "center" }}>

          <div className="anim-fade-up">
            <span className="badge">Retroactive Public Goods Funding</span>
          </div>

          <h1
            className="anim-fade-up anim-delay-1"
            style={{
              marginTop: "1.5rem",
              fontSize: "clamp(2.25rem, 6vw, 5rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              color: "#0f172a",
            }}
          >
            Pay the work that<br />
            <span style={{
              color: "#16a34a",
              fontFamily: "var(--font-fraunces)",
              fontStyle: "italic",
              fontWeight: 900,
              letterSpacing: "-0.02em",
            }}>
              already runs the world
            </span>
          </h1>

          <p
            className="anim-fade-up anim-delay-2"
            style={{ marginTop: "1.5rem", fontSize: "clamp(1rem, 2vw, 1.25rem)", color: "#64748b", maxWidth: "36rem", margin: "1.5rem auto 0", lineHeight: 1.7 }}
          >
            AI agents score OSS repos on real GitHub + npm data and release
            KAS through a Kaspa Covenant — no committee, no bias.
          </p>

          <div
            className="anim-fade-up anim-delay-3"
            style={{ marginTop: "2.5rem", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "0.75rem" }}
          >
            <Link href="/scan" className="btn-primary" style={{ padding: "0.75rem 2rem", fontSize: "1rem" }}>
              Scan your repo →
            </Link>
            <Link href="/dashboard" className="btn-ghost" style={{ padding: "0.75rem 2rem", fontSize: "1rem" }}>
              Browse pools
            </Link>
          </div>

          {/* Stats */}
          <div
            className="anim-fade-up anim-delay-4"
            style={{ marginTop: "3.5rem", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1rem" }}
          >
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
                  padding: "1.125rem 2rem",
                  textAlign: "center",
                  minWidth: "9rem",
                }}
              >
                <p style={{ fontSize: "1.875rem", fontWeight: 800, fontFamily: "var(--font-geist-mono, monospace)", color: "#0f172a", lineHeight: 1, letterSpacing: "-0.03em" }}>{s.n}</p>
                <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.375rem", fontWeight: 500 }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────── */}
      <section style={{ background: "#ffffff", width: "100%", paddingTop: "4rem", paddingBottom: "5rem" }}>
        <div style={{ maxWidth: "1152px", margin: "0 auto", padding: "0 2rem" }}>

          <div className="anim-fade-up" style={{ marginBottom: "3rem" }}>
            <div style={{ borderLeft: "3px solid #16a34a", paddingLeft: "0.875rem", display: "inline-block" }}>
              <p style={{ fontSize: "0.6875rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>How it works</p>
              <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 800, color: "#0f172a", marginTop: "0.25rem", lineHeight: 1.15 }}>Three steps. No gatekeepers.</h2>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
            {[
              { Icon: IconVault, n: "01", who: "Funder",     title: "Create a pool",       body: "Lock KAS with eligibility criteria. Any OSS package with proven real-world usage can qualify." },
              { Icon: IconAgent, n: "02", who: "AI Agent",   title: "Scan, score, verify", body: "Pulls live GitHub stars, forks, npm downloads. Returns a 0–100 impact score with transparent reasoning." },
              { Icon: IconCheck, n: "03", who: "Maintainer", title: "Claim the reward",    body: "Submit your Kaspa wallet. The Covenant releases payment automatically on verified impact. No committee." },
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
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                  <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "4px", padding: "0.5rem", display: "inline-flex" }}>
                    <Icon />
                  </div>
                  <span style={{ fontFamily: "var(--font-geist-mono, monospace)", fontSize: "0.75rem", fontWeight: 700, color: "#16a34a" }}>{n}</span>
                </div>
                <p style={{ fontSize: "0.6875rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: "0.25rem" }}>{who}</p>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.5rem" }}>{title}</h3>
                <p style={{ fontSize: "0.875rem", color: "#64748b", lineHeight: 1.65 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY RETROACTIVE ──────────────────────── */}
      <section style={{ background: "#ffffff", width: "100%", paddingTop: "4rem", paddingBottom: "5rem" }}>
        <div style={{ maxWidth: "1152px", margin: "0 auto", padding: "0 2rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "3.5rem", alignItems: "start" }}>

            <div className="anim-fade-up">
              <div style={{ borderLeft: "3px solid #16a34a", paddingLeft: "0.875rem", marginBottom: "1.5rem" }}>
                <p style={{ fontSize: "0.6875rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>Why retroactive</p>
                <h2 style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.25rem)", fontWeight: 800, color: "#0f172a", marginTop: "0.25rem", lineHeight: 1.2 }}>
                  Fund what works —<br />not what might.
                </h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", color: "#64748b", fontSize: "0.9375rem", lineHeight: 1.7 }}>
                <p>Prospective grants fund promises. Retroactive grants fund proof. GitHub stars, npm downloads, and fork counts already exist. The work happened — the only missing piece was the payment.</p>
                <p>Every RetroFund decision is verifiable. The impact formula is open. The Kaspa Covenant is on-chain. No black box, no insider committee.</p>
              </div>
              <div style={{ marginTop: "2rem" }}>
                <Link href="/scan" className="btn-primary" style={{ padding: "0.6rem 1.5rem" }}>Check my repo →</Link>
              </div>
            </div>

            <div className="anim-fade-up anim-delay-2" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[
                { Icon: IconLock,  l: "Non-gameable metrics",     d: "Stars, forks, and downloads are objective — not self-reported milestones committees must trust." },
                { Icon: IconChain, l: "On-chain enforcement",     d: "The Kaspa Covenant IS the grant contract. Funds can only release on verified impact." },
                { Icon: IconBot,   l: "Agent-powered evaluation", d: "Fetch.ai uAgent scans via Agentverse and ASI:One in real-time — no frontend required." },
                { Icon: IconLeaf,  l: "Open infrastructure",      d: "Any DAO can fork the pool schema. Scoring weights are fully configurable per pool." },
              ].map(({ Icon, l, d }) => (
                <div key={l} style={{ display: "flex", gap: "0.875rem", padding: "1rem", border: "1.5px solid #e2e8f0", borderRadius: "4px" }}>
                  <div style={{ flexShrink: 0, marginTop: "1px" }}><Icon /></div>
                  <div>
                    <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.2rem" }}>{l}</p>
                    <p style={{ fontSize: "0.8125rem", color: "#64748b", lineHeight: 1.6 }}>{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TECH STACK ───────────────────────────── */}
      <section style={{ background: "#ffffff", width: "100%", paddingTop: "4rem", paddingBottom: "5rem" }}>
        <div style={{ maxWidth: "1152px", margin: "0 auto", padding: "0 2rem" }}>
          <div className="anim-fade-up" style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <p style={{ fontSize: "0.6875rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>Powered by</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem" }}>
            {[
              { Icon: IconKaspa, name: "Kaspa",    col: "#16a34a", tag: "BlockDAG · Covenants",       d: "On-chain grant contracts. Funds release only when impact is verified — no human approvals." },
              { Icon: IconFetch, name: "Fetch.ai", col: "#3b82f6", tag: "Agentverse · ASI:One",      d: "uAgent implements Agent Chat Protocol. Fully operable through ASI:One without any frontend.", link: "https://agentverse.ai/agents/details/agent1qttpqmzegka7kdfz5wn4ve9wnalt374ne6ajtqcnaa0l7k9r9304kcd9akf/profile" },
              { Icon: IconGCC,   name: "GCC",      col: "#8b5cf6", tag: "Public Goods · Open Source", d: "Modular pool schema, non-gameable metrics, open-source — forkable by any grant program." },
            ].map(({ Icon, name, col, tag, d, link }, i) => (
              <div
                key={name}
                className="anim-fade-up"
                style={{ animationDelay: `${i * 0.08}s`, border: "1.5px solid #e2e8f0", borderRadius: "4px", padding: "1.75rem", background: "#ffffff", position: "relative" }}
              >
                {link && (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View agent on Agentverse"
                    style={{ position: "absolute", top: "0.875rem", right: "0.875rem", fontSize: "0.6875rem", fontWeight: 700, color: col, textDecoration: "none", display: "flex", alignItems: "center", gap: "0.2rem" }}
                  >
                    View agent ↗
                  </a>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.75rem" }}>
                  <Icon />
                  <p style={{ fontSize: "1.125rem", fontWeight: 800, color: col }}>{name}</p>
                </div>
                <p style={{ fontSize: "0.6875rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: "0.625rem" }}>{tag}</p>
                <p style={{ fontSize: "0.875rem", color: "#64748b", lineHeight: 1.65 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────── */}
      <section style={{ background: "#ffffff", width: "100%", paddingTop: "4rem", paddingBottom: "6rem" }}>
        <div style={{ maxWidth: "1152px", margin: "0 auto", padding: "0 2rem", textAlign: "center" }}>
          <div className="anim-fade-up">
            <span className="badge">10 seconds to check</span>
          </div>
          <h2
            className="anim-fade-up anim-delay-1"
            style={{ marginTop: "1.5rem", fontSize: "clamp(1.875rem, 4vw, 2.75rem)", fontWeight: 800, color: "#0f172a", lineHeight: 1.1 }}
          >
            Your repo might qualify<br />
            <span style={{ color: "#16a34a" }}>right now.</span>
          </h2>
          <p className="anim-fade-up anim-delay-2" style={{ marginTop: "1rem", fontSize: "1.0625rem", color: "#64748b", maxWidth: "22rem", margin: "1rem auto 0", lineHeight: 1.6 }}>
            Enter your GitHub repo. Get an instant impact score and estimated reward.
          </p>
          <div
            className="anim-fade-up anim-delay-3"
            style={{ marginTop: "2.5rem", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "1rem" }}
          >
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
