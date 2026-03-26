# XLayer-Bounty Frontend

Frontend for a native-OKB bounty workflow on XLayer.

![XLayer-Bounty Logo](public/logo.png)

## Features

- RainbowKit wallet connect in navbar
- Dark/silver landing page
- Creator mode: create bounty from GitHub issue URL + OKB amount
- Developer mode: submit PR URL against open bounties
- Prototype auto-resolution status and reasoning

> This frontend currently uses local API storage for rapid iteration. On-chain contracts live in `../contracts`.

## Routes

- `/` — landing page
- `/dashboard` — creator/developer bounty console
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
