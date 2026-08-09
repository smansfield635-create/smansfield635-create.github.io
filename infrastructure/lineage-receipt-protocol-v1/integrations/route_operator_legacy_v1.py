from __future__ import annotations

"""Read-only bridge from Route Operator canonical receipts into LRPv1.

This module preserves the legacy Route Operator canonicalization contract. It
never rewrites a legacy receipt and does not alter instrument/scientific state.
Because real legacy receipts may contain floating-point values that are outside
LRPv1's deliberately restricted value domain, the complete verified legacy
receipt is carried as its original canonical JSON text inside the LRPv1
payload rather than being reinterpreted as native LRPv1 values.
"""

from pathlib import Path
from typing import Any, Mapping
import hashlib
import json
import re
import sys

HERE = Path(__file__).resolve().parent
PYTHON_IMPL = HERE.parent / "python"
if str(PYTHON_IMPL) not in sys.path:
    sys.path.insert(0, str(PYTHON_IMPL))

from lineage_receipt_protocol_v1 import create_receipt  # noqa: E402

_SHA256_RE = re.compile(r"^[0-9a-f]{64}$")
LEGACY_CANONICALIZATION = "ROUTE_OPERATOR_CANONICAL_V1"
PROFILE = "ROUTE_OPERATOR_LEGACY_RECEIPT_WRAPPER_v1"


def legacy_canonical_json(value: Any) -> str:
    return json.dumps(
        value,
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=False,
        allow_nan=False,
    )


def legacy_canonical_sha256(value: Any) -> str:
    return hashlib.sha256(legacy_canonical_json(value).encode("utf-8")).hexdigest()


def verify_legacy_receipt(receipt: Mapping[str, Any]) -> bool:
    digest = receipt.get("receipt_sha256")
    if not isinstance(digest, str) or not _SHA256_RE.fullmatch(digest):
        return False
    unhashed = dict(receipt)
    unhashed.pop("receipt_sha256", None)
    try:
        return digest == legacy_canonical_sha256(unhashed)
    except (TypeError, ValueError, UnicodeEncodeError):
        return False


def wrap_legacy_receipt(receipt: Mapping[str, Any]) -> dict[str, Any]:
    """Wrap a verified legacy receipt without reinterpreting its value domain.

    The original receipt is first verified under ROUTE_OPERATOR_CANONICAL_V1.
    Its complete canonical JSON representation, including its original
    ``receipt_sha256`` field, is then stored as an LRPv1 string payload. This
    preserves legacy floating-point syntax and historical hash semantics while
    allowing the new wrapper itself to conform to LRPv1's safe value domain.
    """
    if not verify_legacy_receipt(receipt):
        raise ValueError("LEGACY_ROUTE_OPERATOR_RECEIPT_INVALID")
    canonical_receipt = legacy_canonical_json(dict(receipt))
    payload = {
        "profile": PROFILE,
        "legacy_canonicalization": LEGACY_CANONICALIZATION,
        "legacy_receipt_sha256": str(receipt["receipt_sha256"]),
        "legacy_receipt_canonical_json": canonical_receipt,
    }
    return create_receipt(payload)
