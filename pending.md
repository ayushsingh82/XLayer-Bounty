# RetroFund — Remaining Tasks
Last updated: July 4, 2026 (Demo Day)

---

## DONE ✅
- [x] Full Next.js frontend (landing + scan + dashboard)
- [x] GitHub + npm live impact scoring API
- [x] Kaspa Covenant payment flow (testnet, mocked TX)
- [x] Fetch.ai uAgent code written (`agent/retrofund_agent.py`)
- [x] 3 seed funding pools pre-loaded
- [x] README with all three bounty tracks documented
- [x] DEMO.md with full demo script and Q&A prep
- [x] Commit history spread across July 1–3
- [x] Pushed to GitHub: https://github.com/ayushsingh82/XLayer-Bounty

---

## YOU MUST DO — Before Submitting

### 1. GitHub Token (15 min) — RECOMMENDED
Avoids 60 req/hour rate limit during judging when multiple repos are scanned.

```bash
# 1. Go to https://github.com/settings/tokens
# 2. Generate new token (classic) — no scopes needed
# 3. Create file:
echo "GITHUB_TOKEN=ghp_your_token_here" > frontend/.env.local
```

---

### 2. Deploy Fetch.ai Agent (30 min) — MANDATORY for Fetch.ai prize

```bash
cd agent
pip install -r requirements.txt
python retrofund_agent.py   # prints agent address
```

Then on Agentverse:
1. Go to https://agentverse.ai — sign up, use code `UKAIAGENTAV` (premium free)
2. Create new agent → upload `agent/retrofund_agent.py`
3. Start the agent → copy the **Agent Profile URL**
4. Go to https://asi1.ai — use code `UKAIAGENT` (pro free)
5. Find your agent → start a conversation
6. Type: `scan facebook/react` — confirm it works
7. Share the conversation → copy the **shared chat URL**
8. Add both URLs to `readme.md` under "Fetch.ai Submission Requirements"

---

### 3. Record Demo Video (20 min) — MANDATORY
3–5 minutes. Follow the script in `DEMO.md`. Must show:
- Scan flow (enter repo → see metrics + impact score)
- Claim flow (select pool → enter Kaspa address → see TX hash)
- ASI:One conversation (if agent is deployed)

---

### 4. DoraHacks Submission — MANDATORY
Submit at: https://dorahacks.io (find the hackathon page)

Required fields:
- [ ] Public GitHub repo URL: `https://github.com/ayushsingh82/XLayer-Bounty`
- [ ] Demo video URL (YouTube or Loom)
- [ ] ASI:One shared chat session URL
- [ ] Agentverse Agent Profile URL(s)
- [ ] Brief description (copy from below)

**Copy-paste description:**
> RetroFund is an autonomous retroactive public goods funding system. AI agents scan GitHub and
> npm to measure real-world usage impact, then release Kaspa Covenant payments to open-source
> maintainers without human gatekeepers. Three tracks: GCC (public funding distribution),
> Kaspa (programmable Covenant payments), Fetch.ai (Agentverse agent + ASI:One).

---

### 5. Kaspa Discord Post — MANDATORY for Kaspa prize
Post in: https://discord.gg/jfQhu6NrC (Kaspa channel)

Template:
> 🚀 Built RetroFund for the UK AI Agent Hackathon — retroactive OSS funding via Kaspa Covenants.
> AI agents scan GitHub/npm usage data and release KAS payments conditionally when impact is verified.
> Repo: https://github.com/ayushsingh82/XLayer-Bounty

---

### 6. GCC Submission
Submit via DoraHacks under the GCC track. No separate form.

---

## OPTIONAL — If Time Permits
- [ ] Deploy frontend to Vercel (`vercel deploy`) for a live URL to share with judges
- [ ] Add real Kaspa testnet transaction (requires Kaspa SDK integration)
- [ ] Add more repo examples to demo (see DEMO.md table)
