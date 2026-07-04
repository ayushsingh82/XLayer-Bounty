"""
RetroFund — Fetch.ai uAgent
Registered on Agentverse, discoverable via ASI:One.

Usage:
  pip install -r requirements.txt
  python retrofund_agent.py

Then register on Agentverse:
  https://agentverse.ai → New Agent → paste this file → Publish
"""

import re
from datetime import datetime, timezone
from uuid import uuid4

import httpx
from uagents import Agent, Context, Protocol
from uagents_core.contrib.protocols.chat import (
    ChatAcknowledgement,
    ChatMessage,
    EndSessionContent,
    StartSessionContent,
    TextContent,
    chat_protocol_spec,
)

# ---------- Agent setup ----------
agent = Agent(
    name="retrofund-impact-agent",
    seed="retrofund_hackathon_seed_imperial_2026",  # change for production
)

chat_proto = Protocol(spec=chat_protocol_spec)

# ---------- Seed pools (mirrors frontend _store.ts) ----------
POOLS = [
    {
        "id": "pool_001",
        "name": "Critical OSS Infrastructure Fund",
        "kas": 50000,
        "remaining": 38500,
        "criteria": ">1k GitHub stars OR >50k weekly npm downloads",
        "creator": "GCC Foundation",
    },
    {
        "id": "pool_002",
        "name": "Privacy & Digital Rights Fund",
        "kas": 25000,
        "remaining": 25000,
        "criteria": "Privacy/encryption tools with >500 GitHub stars",
        "creator": "Digital Rights DAO",
    },
    {
        "id": "pool_003",
        "name": "Developer Tooling Retroactive Grant",
        "kas": 30000,
        "remaining": 30000,
        "criteria": ">500 forks or >5k weekly npm downloads",
        "creator": "Imperial Builders DAO",
    },
]


# ---------- Intent parsing ----------
def parse_intent(text: str):
    t = text.lower().strip()

    # Explicit scan keywords
    repo_match = re.search(
        r"(?:scan|check|evaluate|score|analyze)\s+(?:https?://github\.com/)?([a-zA-Z0-9._-]+/[a-zA-Z0-9._-]+)",
        t,
    )
    if repo_match:
        return "scan", repo_match.group(1)

    # Bare owner/repo pattern
    bare = re.search(r"\b([a-zA-Z0-9._-]+/[a-zA-Z0-9._-]+)\b", text)
    if bare and "/" in bare.group(1):
        return "scan", bare.group(1)

    if any(w in t for w in ["pool", "fund", "available", "list", "what can"]):
        return "pools", None

    if any(w in t for w in ["claim", "reward", "get paid", "redeem", "payment"]):
        return "claim", None

    if any(w in t for w in ["help", "hello", "hi", "start", "what"]):
        return "help", None

    return "unknown", None


# ---------- GitHub + npm scanner ----------
async def scan_repo(repo: str):
    owner_repo = repo.replace("https://github.com/", "").strip("/")
    headers = {"Accept": "application/vnd.github+json", "User-Agent": "RetroFund/1.0"}

    async with httpx.AsyncClient(timeout=10) as client:
        gh_res = await client.get(f"https://api.github.com/repos/{owner_repo}", headers=headers)
        if gh_res.status_code != 200:
            return None
        gh = gh_res.json()

        pkg_name = owner_repo.split("/")[1]
        downloads = None
        try:
            npm_res = await client.get(
                f"https://api.npmjs.org/downloads/point/last-week/{pkg_name}", timeout=5
            )
            if npm_res.status_code == 200:
                downloads = npm_res.json().get("downloads")
        except Exception:
            pass

    stars = gh.get("stargazers_count", 0)
    forks = gh.get("forks_count", 0)
    dl = downloads or 0

    star_score = min((stars / 10000) * 40, 40)
    fork_score = min((forks / 2000) * 20, 20)
    dl_score = min((dl / 500_000) * 40, 40)
    impact = round(star_score + fork_score + dl_score)
    reward = max(round(impact * 100), 500) if impact > 0 else 0

    return {
        "repo": owner_repo,
        "stars": stars,
        "forks": forks,
        "downloads": downloads,
        "language": gh.get("language"),
        "description": gh.get("description"),
        "license": (gh.get("license") or {}).get("spdx_id"),
        "impact": impact,
        "reward": reward,
    }


def matching_pools(impact: int):
    if impact >= 60:
        return [POOLS[0], POOLS[2]]
    if impact >= 30:
        return [POOLS[2]]
    return []


# ---------- Response formatters ----------
def fmt_welcome():
    return (
        "👋 Welcome to **RetroFund** — retroactive funding for open-source work "
        "that already runs the world.\n\n"
        "I can help you:\n"
        "• **Scan a repo** — `scan facebook/react`\n"
        "• **Browse pools** — `show pools`\n"
        "• **Claim a reward** — tell me your repo + Kaspa address\n\n"
        "What would you like to do?"
    )


def fmt_pools():
    lines = ["**Active RetroFund Pools:**\n"]
    total = sum(p["remaining"] for p in POOLS)
    for p in POOLS:
        lines.append(
            f"🏦 **{p['name']}**\n"
            f"   Remaining: {p['remaining']:,} KAS · Creator: {p['creator']}\n"
            f"   Criteria: {p['criteria']}\n"
        )
    lines.append(f"**Total available: {total:,} KAS**")
    lines.append("\nScan your repo to see which pools you qualify for.")
    return "\n".join(lines)


def fmt_scan(r: dict):
    dl_str = f"{r['downloads']:,} weekly npm downloads" if r["downloads"] else "not on npm"
    if r["impact"] >= 80:
        verdict = "HIGH IMPACT ✓"
    elif r["impact"] >= 40:
        verdict = "MODERATE IMPACT ✓"
    else:
        verdict = "DEVELOPING"

    pools = matching_pools(r["impact"])
    pool_str = (
        "\n**Matching pools:**\n" + "\n".join(f"• {p['name']} ({p['remaining']:,} KAS)" for p in pools)
        if pools
        else "\nNo pools match yet — check back as new pools are added."
    )

    return (
        f"**{r['repo']}**\n"
        f"{r['description'] or ''}\n\n"
        f"⭐ {r['stars']:,} stars  🔀 {r['forks']:,} forks  📦 {dl_str}\n"
        f"Language: {r['language'] or 'unknown'}  License: {r['license'] or 'unknown'}\n\n"
        f"**Impact Score: {r['impact']}/100** — {verdict}\n"
        f"**Estimated Reward: {r['reward']:,} KAS**\n"
        f"{pool_str}\n\n"
        f"To claim: share your GitHub username and Kaspa wallet address (kaspa:...)."
    )


def fmt_claim_guide():
    return (
        "**To claim your retroactive reward:**\n\n"
        "1. Tell me your **GitHub repo** (e.g. `my-org/my-repo`)\n"
        "2. Your **GitHub username**\n"
        "3. Your **Kaspa wallet address** — starts with `kaspa:`\n\n"
        "Once I verify your impact score, I'll match you to the best pool "
        "and the Kaspa Covenant will release your KAS automatically.\n\n"
        "Or visit the RetroFund app directly and use the /scan page."
    )


def fmt_help():
    return (
        "**RetroFund — what I can do:**\n\n"
        "• `scan [owner/repo]` — score a GitHub repo and estimate reward\n"
        "• `show pools` — list active funding pools and remaining KAS\n"
        "• `claim` — start the reward claim process\n\n"
        "Example: `scan vercel/next.js`"
    )


def make_reply(text: str) -> ChatMessage:
    return ChatMessage(
        timestamp=datetime.now(timezone.utc),
        msg_id=uuid4(),
        content=[TextContent(type="text", text=text)],
    )


# ---------- Chat protocol handler ----------
@chat_proto.on_message(ChatMessage)
async def handle_message(ctx: Context, sender: str, msg: ChatMessage):
    await ctx.send(
        sender,
        ChatAcknowledgement(
            timestamp=datetime.now(timezone.utc),
            acknowledged_msg_id=msg.msg_id,
        ),
    )

    for item in msg.content:
        if isinstance(item, StartSessionContent):
            await ctx.send(sender, make_reply(fmt_welcome()))

        elif isinstance(item, TextContent):
            intent, payload = parse_intent(item.text)

            if intent == "scan":
                ctx.logger.info(f"Scanning repo: {payload}")
                result = await scan_repo(payload)
                if result:
                    reply_text = fmt_scan(result)
                else:
                    reply_text = (
                        f"❌ Could not find `{payload}` on GitHub. "
                        "Check the repo name (format: `owner/repo`) and try again."
                    )
            elif intent == "pools":
                reply_text = fmt_pools()
            elif intent == "claim":
                reply_text = fmt_claim_guide()
            else:
                reply_text = fmt_help()

            await ctx.send(sender, make_reply(reply_text))

        elif isinstance(item, EndSessionContent):
            ctx.logger.info(f"Session ended with {sender}")
            return


# ---------- Run ----------
agent.include(chat_proto, publish_manifest=True)

if __name__ == "__main__":
    print(f"RetroFund Agent address: {agent.address}")
    agent.run()
