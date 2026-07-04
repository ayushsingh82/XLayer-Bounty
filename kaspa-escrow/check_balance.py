"""Check the RetroFund escrow wallet's testnet-10 balance."""

import asyncio

from kaspa import PrivateKey

from config import ADDRESS_PREFIX, SOMPI_PER_KAS, connect, get_escrow_private_key_hex


async def main() -> None:
    keypair = PrivateKey(get_escrow_private_key_hex()).to_keypair()
    address = keypair.to_address(ADDRESS_PREFIX)

    client = await connect()
    try:
        print(f"Connected to: {await client.get_current_network()}")
        print(f"Address     : {address.to_string()}")

        result = await client.get_utxos_by_addresses({"addresses": [address]})
        entries = result["entries"]
        total_sompi = sum(int(e["utxoEntry"]["amount"]) for e in entries)

        print(f"UTXOs       : {len(entries)}")
        print(f"Balance     : {total_sompi / SOMPI_PER_KAS:.8f} KAS ({total_sompi} sompi)")
        if total_sompi == 0:
            print("\nBalance is 0. Fund this address at https://faucet-tn10.kaspanet.io/, then re-run.")
    finally:
        await client.disconnect()


if __name__ == "__main__":
    asyncio.run(main())
