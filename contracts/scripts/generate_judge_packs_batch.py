#!/usr/bin/env python3
"""
Batch runner to generate judge packs for multiple bounties.

Input file: JSON array of records:
[
  {
    "bounty_id": "152",
    "issue_url": "https://github.com/org/repo/issues/152",
    "pr_url": "https://github.com/org/repo/pull/123",
    "tx_hash": "0xabc..."
  }
]
"""

import argparse
import json
import subprocess
import sys
from pathlib import Path


def main():
    parser = argparse.ArgumentParser(description="Generate multiple judge evidence packs")
    parser.add_argument(
        "--input",
        default="scripts/judge-pack-input.example.json",
        help="Path to JSON file with issue/pr pairs",
    )
    parser.add_argument(
        "--out-dir",
        default="artifacts/judge-packs",
        help="Output directory for generated packs",
    )
    args = parser.parse_args()

    input_path = Path(args.input)
    if not input_path.exists():
        raise FileNotFoundError(f"Input file not found: {input_path}")

    rows = json.loads(input_path.read_text(encoding="utf-8"))
    if not isinstance(rows, list):
        raise ValueError("Input JSON must be an array")

    success = 0
    failed = 0

    for idx, row in enumerate(rows, start=1):
        bounty_id = str(row.get("bounty_id", f"row-{idx}"))
        issue_url = row.get("issue_url", "")
        pr_url = row.get("pr_url", "")
        tx_hash = row.get("tx_hash", "pending")

        if not issue_url or not pr_url:
            print(f"[skip] row {idx} missing issue_url or pr_url")
            failed += 1
            continue

        cmd = [
            sys.executable,
            "scripts/build_judge_pack.py",
            "--issue-url",
            issue_url,
            "--pr-url",
            pr_url,
            "--bounty-id",
            bounty_id,
            "--tx-hash",
            tx_hash,
            "--out-dir",
            args.out_dir,
        ]
        result = subprocess.run(cmd, check=False)
        if result.returncode == 0:
            success += 1
        else:
            failed += 1
            print(f"[fail] row {idx} bounty_id={bounty_id}")

    print(f"Done. success={success}, failed={failed}")


if __name__ == "__main__":
    main()
