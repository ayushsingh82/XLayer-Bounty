# XLayer AutoBounty Prototype

This app is an original XLayer implementation inspired by AutoBounty-style flows:

- Wallet connect in navbar (RainbowKit + Wagmi)
- Dark/silver landing page with PixelBlast strip
- Creator dashboard to create bounties from GitHub issue URLs
- Developer flow to submit PR URLs
- Automated prototype resolution (approve/reject + reason)

Current setup is a working product prototype with local API storage. Smart contracts are prepared separately in `../contracts`.

## Stack

- Next.js (App Router)
- TypeScript
- TailwindCSS
- RainbowKit + Wagmi + viem
- React Query

## App Routes

- `/` — landing page
- `/dashboard` — bounty workflow UI
- `/api/bounties` — list/create bounties
- `/api/bounties/[id]/submit` — submit PR + resolve prototype flow

## Local Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Wallet Setup

Add a WalletConnect project ID in `.env.local`:

```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

Without this, wallet connector may not work correctly in production wallets.

## Contracts (Escrow)

Escrow contracts live in:

- `../contracts/BountyEscrow.sol`
- `../contracts/MockUSDC.sol`

These are intended for wiring the dashboard to on-chain bounty create/submit/resolve flows.
