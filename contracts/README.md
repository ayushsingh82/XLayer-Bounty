# XLayer Contracts

Native OKB bounty escrow contracts for XLayer.

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

## Deployed Contract

- `BountyEscrowNative` (XLayer testnet): `0xee34aef61c8f20703a89eEcfC1eB5819Fd18FfcC`
- Explorer: [View on OKX XLayer Explorer](https://www.okx.com/web3/explorer/xlayer-test/address/0xee34aef61c8f20703a89eEcfC1eB5819Fd18FfcC)

## Security

- Never paste private keys in chat or commit them.
- Use `.env` locally only.
- Rotate keys immediately if exposed.

