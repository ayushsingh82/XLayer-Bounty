# XLayer-Bounty Frontend

Frontend console for an agent-driven native-OKB bounty workflow on XLayer.

<img src="public/logo.png" alt="XLayer-Bounty Logo" width="120" />

## Features

- RainbowKit wallet connect in navbar
- Agent-first landing and dashboard UX
- Operator mode: create bounty from GitHub issue URL + OKB amount (wallet transaction)
- Solver mode: submit PR URL + payout wallet against open bounties
- Auto-resolution status and reasoning for agent review loops

> This frontend currently uses local API storage for rapid iteration. On-chain contracts live in `../contracts`.

## Agent Use Case

The UI is intended as an operator surface for autonomous workflows:
- Agents monitor bounty state and submission lifecycle.
- Agents evaluate PR progress/status and attach rationale.
- Agents coordinate with contract actions for final resolution.

Local flow details:
- Creating a bounty triggers a real wallet transaction (`createBounty`) on XLayer.
- API layer stores local prototype metadata for rapid UI iteration.
- Solver submissions require both PR URL and payout wallet address.

Reference evaluator logic:
- `../../AutoBounty/contracts/genlayer/BountyJudge.py`

## Routes

- `/` — landing page
- `/dashboard` — creator/developer bounty console
- `/dashboard` — operator/solver bounty console
- `/api/bounties` — list + create
- `/api/bounties/[id]/submit` — submit PR + resolve prototype flow

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment

Create `.env.local`:

```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

## Next Integration Step

Replace local API handlers with on-chain calls to `BountyEscrowNative` from `../contracts`:

- `createBounty(issueUrl)` with `msg.value`
- `submitSolution(bountyId, prUrl)`
- `resolveBounty(bountyId, approved)` via relayer/owner

## Deployed Contract

- `BountyEscrowNative` (XLayer testnet): `0xee34aef61c8f20703a89eEcfC1eB5819Fd18FfcC`
- Explorer: [View on OKX XLayer Explorer](https://www.okx.com/web3/explorer/xlayer-test/address/0xee34aef61c8f20703a89eEcfC1eB5819Fd18FfcC)
