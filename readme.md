# XLayer-Bounty

XLayer-Bounty is a bounty platform prototype on XLayer using native OKB escrow.

![XLayer-Bounty Logo](nextjs/public/logo.png)

It includes:
- Wallet-connected frontend (RainbowKit + Wagmi)
- Creator flow: create issue-linked bounties
- Developer flow: submit PR links
- Resolution status tracking with clear approval/rejection reasons
- Native-token escrow contracts ready to deploy

## Project Structure

- `nextjs/` — frontend app and local API prototype
- `contracts/` — Solidity escrow contracts + deployment scripts

## Frontend Overview (`nextjs/`)

### Main routes
- `/` — landing page
- `/dashboard` — creator/developer bounty console
- `/api/bounties` — list/create bounties (prototype store)
- `/api/bounties/[id]/submit` — submit PR + resolve prototype flow

### Run locally
```bash
cd nextjs
npm install
npm run dev
```

Open `http://localhost:3000`.

### Wallet env
Create `nextjs/.env.local`:
```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

## Contracts Overview (`contracts/`)

### Contracts
- `BountyEscrowNative.sol` — recommended escrow for native OKB (`msg.value`)
- `BountyEscrow.sol` — optional ERC20 escrow variant
- `MockUSDC.sol` — test token for ERC20 flow experiments

### Deploy native escrow (testnet)
```bash
cd contracts
npm install
cp .env.example .env
# set XLAYER_TESTNET_RPC_URL + DEPLOYER_PRIVATE_KEY
npm run deploy:testnet
```

### Deployed contract (XLayer testnet)
- `BountyEscrowNative`: `0xee34aef61c8f20703a89eEcfC1eB5819Fd18FfcC`
- Explorer: [View on OKX XLayer Explorer](https://www.okx.com/web3/explorer/xlayer-test/address/0xee34aef61c8f20703a89eEcfC1eB5819Fd18FfcC)

## Notes

- Frontend currently uses in-memory API data for speed of iteration.
- Next step is wiring frontend actions directly to deployed `BountyEscrowNative`.
