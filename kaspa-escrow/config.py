"""Shared config + tiny helpers for the RetroFund Kaspa escrow scripts.

Adapted from https://github.com/carlssonk/kaspa-starter-kits (kaspa-python-starter).
"""

import os
from pathlib import Path

from kaspa import Resolver, RpcClient

NETWORK_ID = "testnet-10"
ADDRESS_PREFIX = "testnet"
SOMPI_PER_KAS = 100_000_000


def _load_dotenv() -> None:
    env_path = Path(__file__).with_name(".env")
    if not env_path.exists():
        return
    for line in env_path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        os.environ.setdefault(key.strip(), value.strip())


_load_dotenv()


def get_escrow_private_key_hex() -> str:
    key = os.environ.get("ESCROW_PRIVATE_KEY", "").strip()
    if not key:
        raise SystemExit(
            "No ESCROW_PRIVATE_KEY set.\n"
            "  -> Run `python generate_escrow_wallet.py` to create one, then copy it into `.env`."
        )
    return key


async def connect() -> RpcClient:
    client = RpcClient(resolver=Resolver(), network_id=NETWORK_ID)
    await client.connect()
    return client
