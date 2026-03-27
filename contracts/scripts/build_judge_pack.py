#!/usr/bin/env python3
"""
Builds an LLM-friendly evidence pack for judges.

Outputs:
- Markdown report (human + LLM readable)
- JSON report (machine readable)
"""

import argparse
import json
import os
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional, Tuple

import requests
from dotenv import load_dotenv


def parse_repo_and_number(url: str, kind: str) -> Optional[Tuple[str, str, int]]:
    pattern = r"^https://github\.com/([^/]+)/([^/]+)/" + kind + r"/(\d+)"
    match = re.match(pattern, url.strip())
    if not match:
        return None
    owner, repo, number = match.group(1), match.group(2), int(match.group(3))
    return owner, repo, number


def github_get(path: str, token: Optional[str]) -> dict:
    headers = {
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    if token:
        headers["Authorization"] = f"Bearer {token}"
    response = requests.get(f"https://api.github.com{path}", headers=headers, timeout=25)
    response.raise_for_status()
    return response.json()


def truncate(text: str, limit: int = 2400) -> str:
    if not text:
        return ""
    return text if len(text) <= limit else text[:limit] + "\n\n...[truncated]"


def build_report(issue_url: str, pr_url: str, github_token: Optional[str], bounty_id: str, tx_hash: str) -> dict:
    issue_ref = parse_repo_and_number(issue_url, "issues")
    pr_ref = parse_repo_and_number(pr_url, "pull")
    if not issue_ref or not pr_ref:
        raise ValueError("Invalid GitHub issue/PR URL format")

    issue_owner, issue_repo, issue_number = issue_ref
    pr_owner, pr_repo, pr_number = pr_ref

    issue = github_get(f"/repos/{issue_owner}/{issue_repo}/issues/{issue_number}", github_token)
    pr = github_get(f"/repos/{pr_owner}/{pr_repo}/pulls/{pr_number}", github_token)
    pr_files = github_get(f"/repos/{pr_owner}/{pr_repo}/pulls/{pr_number}/files", github_token)

    changed_files = [f.get("filename") for f in pr_files if f.get("filename")]
    additions = int(pr.get("additions") or 0)
    deletions = int(pr.get("deletions") or 0)
    merged = bool(pr.get("merged"))

    heuristics = {
        "same_repository": (issue_owner, issue_repo) == (pr_owner, pr_repo),
        "pr_merged": merged,
        "files_changed_count_gt_0": len(changed_files) > 0,
        "issue_closed": issue.get("state") == "closed",
    }
    approved = heuristics["same_repository"] and heuristics["pr_merged"] and heuristics["files_changed_count_gt_0"]

    report = {
        "generated_at_utc": datetime.now(timezone.utc).isoformat(),
        "bounty_id": bounty_id,
        "resolution_tx_hash": tx_hash,
        "issue_url": issue_url,
        "pr_url": pr_url,
        "issue": {
            "title": issue.get("title"),
            "state": issue.get("state"),
            "labels": [x.get("name") for x in issue.get("labels", []) if x.get("name")],
            "author": (issue.get("user") or {}).get("login"),
            "body_excerpt": truncate(issue.get("body") or ""),
        },
        "pull_request": {
            "title": pr.get("title"),
            "state": pr.get("state"),
            "merged": merged,
            "author": (pr.get("user") or {}).get("login"),
            "base_branch": (pr.get("base") or {}).get("ref"),
            "head_branch": (pr.get("head") or {}).get("ref"),
            "commits": pr.get("commits"),
            "changed_files_count": len(changed_files),
            "additions": additions,
            "deletions": deletions,
            "changed_files": changed_files[:120],
            "body_excerpt": truncate(pr.get("body") or ""),
        },
        "heuristics": heuristics,
        "agent_recommendation": {
            "approved": approved,
            "reason": (
                "Repository match + merged PR + code changes detected."
                if approved
                else "One or more required checks failed."
            ),
        },
    }
    return report


def to_markdown(report: dict) -> str:
    issue = report["issue"]
    pr = report["pull_request"]
    heuristics = report["heuristics"]
    rec = report["agent_recommendation"]
    changed_files_md = "\n".join(f"- `{f}`" for f in pr["changed_files"]) or "- (none)"
    labels_md = ", ".join(issue["labels"]) if issue["labels"] else "(none)"

    return f"""# Judge Evidence Pack

Generated at: `{report["generated_at_utc"]}`  
Bounty ID: `{report["bounty_id"]}`  
Resolution Tx: `{report["resolution_tx_hash"]}`  
Issue: {report["issue_url"]}  
PR: {report["pr_url"]}

## Issue Snapshot
- Title: {issue["title"]}
- State: `{issue["state"]}`
- Author: `{issue["author"]}`
- Labels: {labels_md}

### Issue Body Excerpt
{issue["body_excerpt"]}

## PR Snapshot
- Title: {pr["title"]}
- State: `{pr["state"]}`
- Merged: `{pr["merged"]}`
- Author: `{pr["author"]}`
- Base: `{pr["base_branch"]}` | Head: `{pr["head_branch"]}`
- Commits: `{pr["commits"]}`
- Changed files: `{pr["changed_files_count"]}`
- Additions/Deletions: `+{pr["additions"]} / -{pr["deletions"]}`

### PR Body Excerpt
{pr["body_excerpt"]}

### Changed Files (first 120)
{changed_files_md}

## Heuristic Checks
- same_repository: `{heuristics["same_repository"]}`
- pr_merged: `{heuristics["pr_merged"]}`
- files_changed_count_gt_0: `{heuristics["files_changed_count_gt_0"]}`
- issue_closed: `{heuristics["issue_closed"]}`

## Agent Recommendation
- Approved: `{rec["approved"]}`
- Reason: {rec["reason"]}
"""


def main():
    load_dotenv()
    parser = argparse.ArgumentParser(description="Create judge-ready evidence pack for issue/PR review")
    parser.add_argument("--issue-url", required=True, help="GitHub issue URL")
    parser.add_argument("--pr-url", required=True, help="GitHub pull request URL")
    parser.add_argument("--bounty-id", default="manual", help="Bounty id for traceability")
    parser.add_argument("--tx-hash", default="pending", help="Resolution tx hash if available")
    parser.add_argument("--out-dir", default="artifacts/judge-packs", help="Output directory")
    args = parser.parse_args()

    token = os.getenv("GITHUB_TOKEN")
    report = build_report(args.issue_url, args.pr_url, token, args.bounty_id, args.tx_hash)
    markdown = to_markdown(report)

    ts = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S")
    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    base = out_dir / f"judge-pack-{args.bounty_id}-{ts}"

    json_path = base.with_suffix(".json")
    md_path = base.with_suffix(".md")
    json_path.write_text(json.dumps(report, indent=2), encoding="utf-8")
    md_path.write_text(markdown, encoding="utf-8")

    print(f"Wrote JSON: {json_path}")
    print(f"Wrote MD:   {md_path}")


if __name__ == "__main__":
    main()
