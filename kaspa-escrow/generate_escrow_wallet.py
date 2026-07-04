"""Generate the RetroFund escrow wallet (one-time setup).

This wallet represents the pool's escrow — pool funds are (conceptually)
held at this address, and the AI agent authorizes real testnet payouts
from it once a repo's impact score clears the pool's threshold.

Run once, copy the private key into `.env` (ESCROW_PRIVATE_KEY=...), then
fund the printed address from https://faucet-tn10.kaspanet.io/
"""

from kaspa import Keypair

from config import ADDRESS_PREFIX


def main() -> None:
    keypair = Keypair.random()
    address = keypair.to_address(ADDRESS_PREFIX).to_string()

    print("Generated RetroFund escrow wallet:\n")
    print(f"  Address      : {address}")
    print(f"  Private key  : {keypair.private_key}")
    print(
        "\nNext steps:\n"
        "  1. Copy the Private Key into `.env` (ESCROW_PRIVATE_KEY=...).\n"
        "  2. Fund the address at https://faucet-tn10.kaspanet.io/\n"
        "  3. Run `python check_balance.py` to confirm funds landed."
    )


if __name__ == "__main__":
    main()
