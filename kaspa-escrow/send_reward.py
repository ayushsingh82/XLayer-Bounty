"""Send a real RetroFund reward payout from the escrow wallet on testnet-10.

This is the settlement step of the agent-gated escrow flow: the impact score
and pool-threshold check happen in the app/agent layer *before* this script
is invoked. By the time this runs, the payout has already been authorized —
this script's only job is to broadcast a real signed transaction and return
the tx id as proof of settlement.

Usage:
  python send_reward.py <kaspatest:to_address> <amount_kas>

Prints a single line of JSON to stdout on success:
  {"ok": true, "txId": "...", "amountKas": 12.5, "explorer": "https://tn10.kaspa.stream/..."}

Or on failure:
  {"ok": false, "error": "..."}
"""

import asyncio
import json
import sys

from kaspa import Generator, PrivateKey, kaspa_to_sompi

from config import ADDRESS_PREFIX, NETWORK_ID, connect, get_escrow_private_key_hex

PRIORITY_FEE_SOMPI = kaspa_to_sompi(0.0001)


async def send_reward(to_address: str, amount_kas: float) -> dict:
    private_key = PrivateKey(get_escrow_private_key_hex())
    keypair = private_key.to_keypair()
    escrow_address = keypair.to_address(ADDRESS_PREFIX)

    client = await connect()
    try:
        result = await client.get_utxos_by_addresses({"addresses": [escrow_address]})
        entries = result["entries"]
        if not entries:
            return {
                "ok": False,
                "error": (
                    f"Escrow wallet {escrow_address.to_string()} has no funds. "
                    "Fund it at https://faucet-tn10.kaspanet.io/"
                ),
            }

        entries.sort(key=lambda e: int(e["utxoEntry"]["amount"]), reverse=True)
        amount_sompi = kaspa_to_sompi(amount_kas)

        generator = Generator(
            network_id=NETWORK_ID,
            entries=entries,
            outputs=[{"address": to_address, "amount": amount_sompi}],
            change_address=escrow_address,
            priority_fee=PRIORITY_FEE_SOMPI,
        )

        tx_id = None
        for pending_tx in generator:
            pending_tx.sign([private_key])
            tx_id = await pending_tx.submit(client)

        return {
            "ok": True,
            "txId": tx_id,
            "amountKas": amount_kas,
            "toAddress": to_address,
            "explorer": f"https://tn10.kaspa.stream/txs/{tx_id}",
        }
    except Exception as e:  # noqa: BLE001 - surface any SDK error to the caller as JSON
        return {"ok": False, "error": str(e)}
    finally:
        await client.disconnect()


def main() -> None:
    if len(sys.argv) != 3:
        print(json.dumps({"ok": False, "error": "usage: send_reward.py <to_address> <amount_kas>"}))
        sys.exit(1)

    to_address = sys.argv[1]
    amount_kas = float(sys.argv[2])

    result = asyncio.run(send_reward(to_address, amount_kas))
    print(json.dumps(result))
    sys.exit(0 if result.get("ok") else 1)


if __name__ == "__main__":
    main()
