# RetroFund — Remaining Tasks
Last updated: July 4, 2026 (Demo Day)

---

## DONE ✅
- [x] Full Next.js frontend (landing + scan + dashboard + create-pool)
- [x] GitHub + npm live impact scoring API
- [x] Kaspa Covenant payment flow (testnet, mocked TX hash)
- [x] Fetch.ai uAgent code written (`agent/retrofund_agent.py`)
- [x] 3 seed funding pools pre-loaded
- [x] README with all three bounty tracks documented
- [x] DEMO.md with full demo script and Q&A prep
- [x] Commit history spread across July 1–3
- [x] Pushed to GitHub: https://github.com/ayushsingh82/RetroFund
- [x] Full UI redesign — white theme, square cards, SVG icons, mobile-responsive navbar

---

## MUST DO BEFORE JUDGING 🔴

### 1. Deploy Fetch.ai Agent (30 min) — MANDATORY for Fetch.ai $1k prize

**Local run — VERIFIED WORKING (2026-07-04).** Two bugs fixed along the way:
- `uagents` 0.25.2 crashes on Python 3.14 (`asyncio.get_event_loop()` no longer
  auto-creates a loop). Use **Python 3.13 or earlier** in a venv.
- `agent.include(chat_proto, publish_manifest=True)` raised
  `RuntimeError: Protocol AgentChatProtocol:0.3.0 failed verification` because
  the spec requires a handler for *every* model it declares, including
  `ChatAcknowledgement` — not just `ChatMessage`. Fixed by adding an
  `@chat_proto.on_message(ChatAcknowledgement)` handler in `retrofund_agent.py`.

```bash
cd agent
python3.13 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python retrofund_agent.py   # prints agent address + "Manifest published successfully"
```

Then (manual — needs your own Agentverse/ASI:One login, so do this yourself):
1. [x] Go to https://agentverse.ai → sign up with code `UKAIAGENTAV`
2. [x] External Integration → Agent Chat Protocol → name `RetroFund`, endpoint
   = ngrok tunnel to local port 8000 (`https://b37b-2409-40d2-201c-6259-641b-bfe2-db3f-bc8c.ngrok-free.app/submit` —
   **ephemeral, keep the `ngrok http 8000` terminal running through judging**;
   if it restarts you get a new URL and must re-run the registration script)
3. [x] Registered via `register_chat_agent(...)` script using seed
   `retrofund_hackathon_seed_imperial_2026` — **do not rotate this seed**,
   it would change the agent address and break the live listing.
   **Agent Profile URL:** https://agentverse.ai/agents/details/agent1qttpqmzegka7kdfz5wn4ve9wnalt374ne6ajtqcnaa0l7k9r9304kcd9akf/profile
   — added to readme.md.
4. [ ] Go to https://asi1.ai → use code `UKAIAGENT`
5. [ ] Find your agent (search "RetroFund" or keywords: open source, github,
   grants, funding, retroactive funding, data analysis, automation, research)
   → chat: type `scan facebook/react` → confirm it works
6. [ ] Share conversation → copy **shared chat URL** → add to readme.md

---

### 2. Kaspa Contract Deployment (30–60 min) — STRONGLY RECOMMENDED for Kaspa $1k prize

Currently the Kaspa payment is **mocked** (fake TX hash). For the Kaspa prize the judges want to
see a real Covenant transaction on testnet.

**What needs to happen:**
- Use the Kaspa Rust SDK or `kaspa-wasm` to build a real Covenant transaction
- The Covenant script encodes: `release funds IF impactScore >= threshold AND kasAddress == claimant`
- Deploy on Kaspa testnet (TN-11) — get testnet KAS from the Kaspa Discord faucet
- Replace the mock TX hash in `frontend/src/app/api/claim/route.ts` with a real signed transaction

**Quickest path:**
```bash
# Option A — use kaspa-wasm (JavaScript/TypeScript, easiest to integrate)
# https://github.com/kaspanet/rusty-kaspa (wasm bindings)

# Option B — use the Kaspa REST API via kaspawallet
# POST /transaction to testnet node
# Testnet node: https://api-tn11.kaspa.org

# Option C — use the Kaspa Python SDK (kaspa-python)
# pip install kaspa
```

**Minimal integration in claim route:**
```typescript
// frontend/src/app/api/claim/route.ts
// Replace the mock txHash with a real Kaspa testnet transaction
// using kaspa-wasm or a REST call to https://api-tn11.kaspa.org
```

**Testnet faucet:** Ask in Kaspa Discord #testnet channel for TN-11 KAS
**Kaspa Discord:** https://discord.gg/jfQhu6NrC (also post there for the prize)

---

### 3. Add GitHub Token (5 min) — avoids rate limits during judging
```bash
# 1. Go to https://github.com/settings/tokens → Generate new (classic), no scopes
# 2. Create the file:
echo "GITHUB_TOKEN=ghp_your_token_here" > frontend/.env.local
```

---

### 4. Record Demo Video (20 min) — MANDATORY for submission
3–5 minutes. Follow `DEMO.md`. Must show:
- Scan flow: enter repo → live metrics + impact score + agent reasoning
- Claim flow: select pool → enter Kaspa address → TX hash
- ASI:One conversation (if agent deployed)

---

### 5. DoraHacks Submission — MANDATORY
https://dorahacks.io → find the hackathon → submit with:
- [ ] GitHub URL: `https://github.com/ayushsingh82/RetroFund`
- [ ] Demo video URL (YouTube / Loom)
- [ ] ASI:One shared chat URL
- [ ] Agentverse Agent Profile URL
- [ ] Description (copy from README or below):

> RetroFund is an autonomous retroactive public goods funding system. AI agents scan GitHub
> and npm to measure real-world impact, then release Kaspa Covenant payments to open-source
> maintainers — no human gatekeepers. Covers GCC (public funding), Kaspa (Covenant contracts),
> and Fetch.ai (Agentverse + ASI:One agent).

---

### 6. Kaspa Discord Post — MANDATORY for Kaspa prize
Post in https://discord.gg/jfQhu6NrC:

> Built RetroFund for UK AI Agent Hackathon — retroactive OSS funding via Kaspa Covenants.
> AI agents scan GitHub/npm usage data and release KAS payments when impact is verified.
> Repo: https://github.com/ayushsingh82/RetroFund

---

## OPTIONAL — If Time Permits
- [ ] Deploy frontend to Vercel (`vercel --prod`) for a live URL
- [ ] Integrate real Kaspa testnet transaction (see task 2 above)
- [ ] Add more seed repos to demo (see DEMO.md)
