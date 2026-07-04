# RetroFund

**Retroactive funding for the open-source work that already runs the world.**

<img src="frontend/public/logo.png" alt="RetroFund Logo" width="140" />

![tag:innovationlab](https://img.shields.io/badge/innovationlab-3D8BD3)
![tag:hackathon](https://img.shields.io/badge/hackathon-5F43F1)

> Built at **UK AI Agent Hackathon EP5 × Conduct** · Imperial College London · July 2026

---

## The Problem

Billions of production applications run on open-source libraries whose maintainers were never paid.
Grant committees are slow, biased, and captured by insiders. Milestone verification is self-reported.
Money flows on promises, not proof.

**RetroFund removes the human gatekeeper entirely.**

---

## What It Does

An AI agent scans GitHub and npm, measures real-world usage impact across stars, forks, and weekly
downloads, and retroactively rewards maintainers — with every payment gated by the agent's verdict
and settled as a **real transaction on Kaspa testnet-10**. No committee. No bias. Just proof of impact.

```
Funder (DAO / GCC) creates a retroactive pool with KAS
        ↓
Maintainer enters their GitHub repo URL
        ↓
AI Agent scans live data: stars · forks · npm weekly downloads
Produces: impact score (0–100) + transparent reasoning
        ↓
Maintainer submits their Kaspa wallet address
        ↓
Agent verifies impact ≥ threshold → escrow releases KAS via a real signed testnet-10 transaction
        ↓
Every decision is transparent; every payment has a real tx id on the Kaspa BlockDAG explorer
```

---

## Fetch.ai Submission Requirements

- [x] Agent registered on Agentverse under **Innovation Lab**
- [x] Agent Chat Protocol implemented (`chat_protocol_spec` from `uagents_core`)
- [x] Discoverable and operable through ASI:One
- [x] Agentverse Agent Profile URL: https://agentverse.ai/agents/details/agent1qttpqmzegka7kdfz5wn4ve9wnalt374ne6ajtqcnaa0l7k9r9304kcd9akf/profile
- [ ] ASI:One shared chat session URL: *(to be added)*

<img src="frontend/public/agentverse1.png" alt="Agentverse registration passed" width="480" />
<img src="frontend/public/agentverse2.png" alt="Agentverse agent test passed" width="480" />

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 + Tailwind CSS v4 |
| Impact Agent | GitHub REST API + npm Downloads API (real-time, no LLM key needed) |
| Blockchain | Kaspa testnet-10 — agent-gated escrow, real signed settlement transactions |
| Agent Platform | Fetch.ai Agentverse + ASI:One Agent Chat Protocol |
| Public Goods Infra | GCC-compatible modular pool schema |

---

## Live Demo Flow

1. `/` — landing page, understand the concept
2. `/scan` — enter `facebook/react` or `vercel/next.js`
3. Agent fetches live GitHub + npm data → computes impact score in real-time
4. Read transparent AI reasoning: why this repo qualifies and estimated reward
5. Select a funding pool, enter Kaspa address, click "Claim Retroactive Reward"
6. Agent-gated escrow releases payment → real Kaspa testnet-10 TX id shown instantly

---

## Running Locally

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**No API keys required** — GitHub public API and npm Downloads API work without auth.

### Optional: GitHub Token (avoids 60 req/hour rate limit on heavy demo usage)

```bash
# frontend/.env.local
GITHUB_TOKEN=ghp_your_token_here
```

---

## Project Structure

```
frontend/
  src/app/
    page.tsx                    # Landing page — concept + how it works
    scan/page.tsx               # Repo scanner + impact score + claim form
    dashboard/page.tsx          # Pool creation + claims list
    api/
      pools/route.ts            # GET list / POST create retroactive pool
      scan/route.ts             # GitHub + npm impact scoring agent (server-side)
      claim/route.ts            # Submit claim + real Kaspa testnet-10 settlement
      _store.ts                 # In-memory store (3 seed pools pre-loaded)
    components/
      Header.tsx                # RetroFund nav
      Footer.tsx                # Track attribution
  src/lib/types.ts              # RetroPool, RepoScanResult, Claim types
```

---

## How Each Technology Is Used

### Kaspa — Agent-Gated Escrow, Real Testnet Settlement

RetroFund runs a real escrow wallet on **Kaspa testnet-10** (`kaspa-escrow/`,
built with the official `kaspa` Python SDK — no mocked hashes):

- Pool funds are (conceptually) held at the escrow address
  `kaspatest:qpyd350n5extaz7zetvmd4wnyw43pdkqw6syff8dngjru6sqkx5t6jkvf9ml5`,
  funded with real testnet KAS from the Kaspa faucet
- The **AI agent gates the payout**: `impactScore >= threshold` is verified
  in the app/agent layer *before* `send_reward.py` is ever invoked
- Once authorized, `send_reward.py` builds, signs, and broadcasts a real
  transaction via `Generator` — the API route (`/api/claim`) calls it and
  returns the actual `txId` + a link to the testnet-10 explorer
  (`https://tn10.kaspa.stream/txs/<txId>`), shown live in the claim UI
- Every payout is a genuine, verifiable on-chain transaction — not a
  generated hex string

This is escrow gated by an autonomous agent, not a simple payment rail —
the condition check happens off-chain (in the agent), the settlement
happens on-chain (real Kaspa testnet tx).

### Fetch.ai — Agentverse + ASI:One

RetroFund agent (`agent/retrofund_agent.py`) registered and **live** on
Agentverse with the Agent Chat Protocol:

- **Agent Profile:** https://agentverse.ai/agents/details/agent1qttpqmzegka7kdfz5wn4ve9wnalt374ne6ajtqcnaa0l7k9r9304kcd9akf/profile
- **Discoverable on ASI:One:** https://asi1.ai/ai/agent1qttpqmzegka7kdfz5wn4ve9wnalt374ne6ajtqcnaa0l7k9r9304kcd9akf

```
User → ASI:One: "Does facebook/react qualify for any RetroFund pools?"
RetroFund Agent: scans GitHub + npm → impact score 97/100 → matches Critical OSS Fund
User → ASI:One: "Claim from Critical OSS Fund, my Kaspa address is kaspatest:abc123..."
RetroFund Agent: submits claim → escrow releases KAS on testnet-10 → returns real TX id
```

Full workflow inside ASI:One — no custom frontend required for judges to verify.

### GCC — Modular Public Goods Infrastructure

Built to GCC Category 1 requirements:

- **Non-gameable metrics**: stars, forks, downloads are objective, not self-reported
- **Counterfactual reasoning**: agent explains "if this repo goes unmaintained, X million apps break"
- **Modular pools**: any DAO or grant program can create a pool with custom criteria
- **Portable rubrics**: impact scoring formula is configurable per pool (swap weights via criteria field)
- **Open-source**: full repo, clean interfaces, documented for forking

---

## API Routes

| Route | Method | Description |
|---|---|---|
| `/api/pools` | GET | List all retroactive funding pools |
| `/api/pools` | POST | Create a new pool (name, criteria, KAS amount, creator) |
| `/api/scan?repo=owner/repo` | GET | Scan a GitHub repo — returns impact score, metrics, AI reasoning |
| `/api/claim` | GET | List all claims |
| `/api/claim` | POST | Submit a claim against a pool + settle a real Kaspa testnet-10 transaction |

---

## Seed Pools (pre-loaded for demo)

| Pool | Total KAS | Remaining | Creator |
|---|---|---|---|
| Critical OSS Infrastructure Fund | 50,000 | 38,500 | GCC Foundation |
| Privacy & Digital Rights Fund | 25,000 | 25,000 | Digital Rights DAO |
| Developer Tooling Retroactive Grant | 30,000 | 30,000 | Imperial Builders DAO |

---

## Why Retroactive, Not Prospective?

Inspired by Optimism RetroFunding — but fully autonomous, no human committee:

- Proven impact beats promises — fund what already works
- No speculation risk — usage data is objective
- Every decision is auditable on-chain

---

## License

MIT
