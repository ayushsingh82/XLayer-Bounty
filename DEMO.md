# RetroFund — Demo Day Script
**UK AI Agent Hackathon EP5 × Conduct · July 4, 2026**

---

## 30-Second Pitch

> "Every app you use today runs on open-source libraries whose maintainers were never paid.
> RetroFund fixes that — AI agents scan real usage data, score impact objectively, and release
> KAS payments through a Kaspa Covenant the moment delivery is verified. No committee,
> no bias, no black box. Just proof of impact."

---

## Live Demo Flow (3–4 minutes)

### Step 1 — Open the landing page (30s)
- Show the hero: *"Pay the open-source work that already runs the world"*
- Point to the three tech badges: Kaspa · Fetch.ai · GCC
- Say: "Three sponsors, one project. Each technology does exactly what it's good at."

### Step 2 — Scan a repo (60s)
- Go to `/scan`
- Type: `facebook/react` → hit Scan
- While loading: "The agent is calling the GitHub REST API and npm Downloads API live right now"
- Show results:
  - ⭐ 230k+ stars · 🔀 47k forks · 📦 millions of weekly downloads
  - Impact Score: **97/100** — HIGH IMPACT ✓
  - Estimated Reward: **9,700 KAS**
- Read the agent reasoning aloud — point out: "this is transparent, auditable, not a black box"

### Step 3 — Claim (60s)
- Select pool: **Critical OSS Infrastructure Fund (38,500 KAS remaining)**
- Enter GitHub username: `your-handle`
- Enter Kaspa address: `kaspa:qz0...` (have a test address ready)
- Click **Claim Retroactive Reward**
- Show the success card:
  - ✅ 9,700 KAS paid
  - Kaspa TX hash (64-char hex)
- Say: "In a real deployment, this TX hash is the Kaspa Covenant releasing the funds on-chain.
  Every payment is provable on the Kaspa BlockDAG explorer."

### Step 4 — Dashboard (30s)
- Go to `/dashboard`
- Show the pool list: 105,000 KAS across 3 active pools
- Show the claim in the Claims tab
- Say: "Any DAO or grant program can create a pool here in 30 seconds"

### Step 5 — ASI:One (30s, if registered)
- Open ASI:One
- Type: `scan vercel/next.js`
- Show the agent response with impact score
- Say: "This is the Fetch.ai integration — the agent is on Agentverse,
  anyone can access RetroFund through ASI:One without any frontend"

---

## Key Talking Points

**For technical judges:**
- Real GitHub + npm API calls, not mocked — open browser dev tools if they want
- Kaspa Covenant: conditional payment logic encoded on-chain, not just a transfer
- Fetch.ai: Agent Chat Protocol, registered on Agentverse, discoverable via ASI:One
- GCC: non-gameable metrics (usage data), modular pool schema, open-source

**For VCs:**
- TAM: every DAO treasury ($2B+), every grant program, every foundation globally
- The pool infrastructure is the protocol — anyone forks it
- Zero marginal cost to add a new pool — fully autonomous from day 1

**For policymakers (House of Lords):**
- "We replaced a slow, biased committee with an agent that never sleeps, never takes a bribe,
  and always shows its reasoning"
- Every funding decision is transparent and on-chain — unprecedented accountability
- The Kaspa Covenant is the legal agreement — no lawyers, no paperwork

---

## Q&A Prep

**Q: How do you prevent gaming? (stars can be faked)**
> "We use three signals together — stars, forks, and npm downloads. Faking all three simultaneously
> is extremely expensive and leaves traces. We also weight downloads most heavily since those
> reflect real developer machines pulling the package."

**Q: Is this live on Kaspa mainnet?**
> "Currently on testnet — devnet KAS, real covenant logic. Mainnet deployment is the next step."

**Q: Why Kaspa over Ethereum?**
> "Kaspa's BlockDAG gives us near-instant confirmations at low cost. For automated milestone
> payments that trigger on agent events, you need speed and low fees. Kaspa's Covenants also
> give us programmable conditional release logic natively."

**Q: What's the monetization model?**
> "Pool creators pay a small protocol fee (1–2%) per pool. Agent services on Fetch.ai use
> the Payment Protocol in FET. Long-term: RetroFund becomes the standard infrastructure
> for on-chain retroactive funding."

---

## Repos to Demo (have these ready)

| Repo | Stars | npm DL/week | Impact | Reward |
|---|---|---|---|---|
| `facebook/react` | ~230k | ~25M | ~97 | ~9,700 KAS |
| `vercel/next.js` | ~130k | ~10M | ~90 | ~9,000 KAS |
| `tailwindlabs/tailwindcss` | ~85k | ~15M | ~88 | ~8,800 KAS |
| `expressjs/express` | ~65k | ~35M | ~92 | ~9,200 KAS |
| `axios/axios` | ~106k | ~50M | ~95 | ~9,500 KAS |

---

## Submission Checklist

- [x] GitHub repo: https://github.com/ayushsingh82/XLayer-Bounty
- [x] Frontend live (`npm run dev`)
- [x] Fetch.ai agent code: `agent/retrofund_agent.py`
- [ ] Deploy agent → get Agentverse URL
- [ ] Record 3–5 min demo video
- [ ] Submit on DoraHacks
- [ ] Post in Kaspa Discord: https://discord.gg/jfQhu6NrC
- [ ] Add GitHub token to `frontend/.env.local` (optional but recommended)
