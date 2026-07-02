# XLayer Contracts

Native OKB bounty escrow contracts for XLayer.

## Problem

Smart-contract escrow alone does not solve slow PR verification.  
Teams still need a reproducible way to evaluate submissions and trigger payouts.

## Solution

This folder provides:
- `BountyEscrowNative` for onchain reward custody/payout.
- Agent scripts to evaluate GitHub issue/PR data.
- Judge evidence pack tooling for transparent verification.

## Market Opportunity

As bounty usage grows, teams need trust-minimized payout operations.  
Combining onchain escrow + agent verification creates a scalable ops model.

## Contracts

- `contracts/BountyEscrowNative.sol` — lock and pay out **native OKB** bounties.
- `contracts/BountyEscrow.sol` — ERC20 escrow variant (optional legacy path).
- `contracts/MockUSDC.sol` — local/test token for ERC20 testing only.

## Quick Deploy (XLayer testnet)

1) Install deps:

```bash
npm install
```

2) Create env from template:

```bash
cp .env.example .env
```

Set:
- `XLAYER_TESTNET_RPC_URL`
- `DEPLOYER_PRIVATE_KEY` (without `0x`)

3) Deploy native escrow:

```bash
npm run deploy:testnet
```

This deploys `BountyEscrowNative` and prints the deployed address.

## Agent Resolver (GitHub API -> On-chain Payout)

Use the Python agent to auto-check issue/PR status and resolve submitted bounties:

```bash
pip install -r scripts/requirements-agent.txt
python scripts/agent_release.py --dry-run
python scripts/agent_release.py
```

## Judge Verification Pack (LLM + Human Readable)

Generate a shareable evidence bundle that judges (and LLMs) can verify:

```bash
python scripts/build_judge_pack.py \
  --issue-url "https://github.com/okx/xlayer-docs/issues/152" \
  --pr-url "https://github.com/org/repo/pull/123" \
  --bounty-id "152" \
  --tx-hash "0xabc..."
```

Outputs:
- `artifacts/judge-packs/judge-pack-<bountyId>-<timestamp>.md`
- `artifacts/judge-packs/judge-pack-<bountyId>-<timestamp>.json`

This pack includes issue/PR snapshots, changed files, heuristic checks, and a final recommendation.

Batch mode for multiple bounties:

```bash
cp scripts/judge-pack-input.example.json scripts/judge-pack-input.json
# fill each pr_url and tx_hash
python scripts/generate_judge_packs_batch.py --input scripts/judge-pack-input.json
```

Environment required in `.env`:
- `XLAYER_TESTNET_RPC_URL`
- `DEPLOYER_PRIVATE_KEY`
- `BOUNTY_ESCROW_NATIVE_ADDRESS`
- `GITHUB_TOKEN` (optional but recommended to avoid GitHub API rate limits)

Workflow:

```mermaid
flowchart LR
    A[Submitted bounty on XLayer] --> B[Agent loads bounty + PR URL]
    B --> C[GitHub API: issue + PR + merge status]
    C --> D{Approval heuristics pass?}
    D -- Yes --> E[resolveBounty(bountyId, true)]
    D -- No --> F[resolveBounty(bountyId, false)]
    E --> G[Escrow releases OKB to solver]
    F --> H[Escrow refunds OKB to creator]
```

## Deployed Contract

- `BountyEscrowNative` (XLayer testnet): `0xee34aef61c8f20703a89eEcfC1eB5819Fd18FfcC`
- Explorer: [View on OKX XLayer Explorer](https://www.okx.com/web3/explorer/xlayer-test/address/0xee34aef61c8f20703a89eEcfC1eB5819Fd18FfcC)

## Security

- Never paste private keys in chat or commit them.
- Use `.env` locally only.
- Rotate keys immediately if exposed.

