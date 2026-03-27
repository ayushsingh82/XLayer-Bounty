#!/usr/bin/env python3
"""
Agent resolver for BountyEscrowNative.

It reads submitted bounties from chain, checks GitHub issue/PR status, and
resolves bounty on-chain (approve/reject) so escrow can release funds.
"""

import argparse
import os
import re
from dataclasses import dataclass
from typing import Optional, Tuple

import requests
from dotenv import load_dotenv
from web3 import Web3


BOUNTY_ESCROW_NATIVE_ABI = [
    {
        "inputs": [],
        "name": "nextBountyId",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function",
    },
    {
        "inputs": [{"internalType": "uint256", "name": "bountyId", "type": "uint256"}],
        "name": "getBounty",
        "outputs": [
            {
                "components": [
                    {"internalType": "uint256", "name": "id", "type": "uint256"},
                    {"internalType": "address", "name": "creator", "type": "address"},
                    {"internalType": "string", "name": "issueUrl", "type": "string"},
                    {"internalType": "uint256", "name": "amountWei", "type": "uint256"},
                    {"internalType": "uint8", "name": "status", "type": "uint8"},
                    {"internalType": "address", "name": "solver", "type": "address"},
                    {"internalType": "string", "name": "prUrl", "type": "string"},
                    {"internalType": "bool", "name": "approved", "type": "bool"},
                    {"internalType": "uint256", "name": "createdAt", "type": "uint256"},
                    {"internalType": "uint256", "name": "resolvedAt", "type": "uint256"},
                ],
                "internalType": "struct BountyEscrowNative.Bounty",
                "name": "",
                "type": "tuple",
            }
        ],
        "stateMutability": "view",
        "type": "function",
    },
    {
        "inputs": [
            {"internalType": "uint256", "name": "bountyId", "type": "uint256"},
            {"internalType": "bool", "name": "approved", "type": "bool"},
        ],
        "name": "resolveBounty",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
    },
]

STATUS_OPEN = 0
STATUS_SUBMITTED = 1
STATUS_RESOLVED = 2


@dataclass
class GithubEval:
    approved: bool
    reason: str


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
    response = requests.get(f"https://api.github.com{path}", headers=headers, timeout=20)
    response.raise_for_status()
    return response.json()


def evaluate_bounty(issue_url: str, pr_url: str, token: Optional[str]) -> GithubEval:
    issue_ref = parse_repo_and_number(issue_url, "issues")
    pr_ref = parse_repo_and_number(pr_url, "pull")
    if not issue_ref or not pr_ref:
        return GithubEval(False, "Invalid GitHub issue/PR URL format")

    issue_owner, issue_repo, issue_number = issue_ref
    pr_owner, pr_repo, pr_number = pr_ref
    if (issue_owner, issue_repo) != (pr_owner, pr_repo):
        return GithubEval(False, "Issue and PR are from different repositories")

    issue = github_get(f"/repos/{issue_owner}/{issue_repo}/issues/{issue_number}", token)
    pr = github_get(f"/repos/{pr_owner}/{pr_repo}/pulls/{pr_number}", token)

    issue_closed = issue.get("state") == "closed"
    pr_merged = bool(pr.get("merged"))
    changed_files = int(pr.get("changed_files") or 0)

    if pr_merged and changed_files > 0:
        if issue_closed:
            return GithubEval(True, "PR merged, issue closed, and code changes detected")
        return GithubEval(True, "PR merged with code changes; issue still open (manual follow-up)")

    if not pr_merged:
        return GithubEval(False, "PR is not merged")
    if changed_files == 0:
        return GithubEval(False, "PR has no changed files")

    return GithubEval(False, "Did not pass approval heuristics")


def build_resolve_tx(contract, bounty_id: int, approved: bool, account: str, nonce: int):
    return contract.functions.resolveBounty(bounty_id, approved).build_transaction(
        {
            "from": account,
            "nonce": nonce,
            "gas": 300000,
            "gasPrice": None,
        }
    )


def main():
    load_dotenv()

    parser = argparse.ArgumentParser(description="Resolve submitted XLayer bounties via GitHub checks")
    parser.add_argument("--bounty-id", type=int, default=0, help="Resolve only one bounty id")
    parser.add_argument("--dry-run", action="store_true", help="Do not send on-chain tx")
    args = parser.parse_args()

    rpc_url = os.getenv("XLAYER_TESTNET_RPC_URL", "https://testrpc.xlayer.tech")
    private_key = os.getenv("DEPLOYER_PRIVATE_KEY", "")
    contract_address = os.getenv("BOUNTY_ESCROW_NATIVE_ADDRESS", "")
    github_token = os.getenv("GITHUB_TOKEN")

    if private_key.startswith("0x"):
        private_key = private_key[2:]
    if not private_key:
        raise ValueError("Missing DEPLOYER_PRIVATE_KEY in .env")
    if not contract_address:
        raise ValueError("Missing BOUNTY_ESCROW_NATIVE_ADDRESS in .env")

    web3 = Web3(Web3.HTTPProvider(rpc_url))
    if not web3.is_connected():
        raise RuntimeError("Failed to connect to XLayer RPC")

    account = web3.eth.account.from_key(private_key)
    contract = web3.eth.contract(address=Web3.to_checksum_address(contract_address), abi=BOUNTY_ESCROW_NATIVE_ABI)

    next_bounty_id = contract.functions.nextBountyId().call()
    bounty_ids = [args.bounty_id] if args.bounty_id > 0 else list(range(1, next_bounty_id))

    print(f"Agent wallet: {account.address}")
    print(f"Scanning {len(bounty_ids)} bounty(s)")

    chain_id = web3.eth.chain_id
    nonce = web3.eth.get_transaction_count(account.address)

    for bounty_id in bounty_ids:
        bounty = contract.functions.getBounty(bounty_id).call()
        status = int(bounty[4])
        issue_url = bounty[2]
        pr_url = bounty[6]

        if status == STATUS_RESOLVED:
            print(f"[#{bounty_id}] already resolved -> skip")
            continue
        if status != STATUS_SUBMITTED:
            print(f"[#{bounty_id}] status is not submitted -> skip")
            continue
        if not pr_url:
            print(f"[#{bounty_id}] missing PR URL -> skip")
            continue

        verdict = evaluate_bounty(issue_url, pr_url, github_token)
        print(f"[#{bounty_id}] approved={verdict.approved} reason={verdict.reason}")

        if args.dry_run:
            continue

        tx = build_resolve_tx(contract, bounty_id, verdict.approved, account.address, nonce)
        tx["chainId"] = chain_id
        tx["gasPrice"] = web3.eth.gas_price
        signed = web3.eth.account.sign_transaction(tx, private_key)
        tx_hash = web3.eth.send_raw_transaction(signed.raw_transaction)
        receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
        print(f"[#{bounty_id}] tx={tx_hash.hex()} status={receipt.status}")
        nonce += 1


if __name__ == "__main__":
    main()
