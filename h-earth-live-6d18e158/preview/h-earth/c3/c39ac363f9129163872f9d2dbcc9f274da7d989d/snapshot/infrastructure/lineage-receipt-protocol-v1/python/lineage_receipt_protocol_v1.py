from __future__ import annotations

"""LRPv1 reference implementation.

LINEAGE_RECEIPT_PROTOCOL_v1 defines a deliberately restricted JSON value
profile so canonical bytes are portable across Python and ECMAScript without
requiring language-specific floating-point serializers in the first release.
"""

from copy import deepcopy
from pathlib import Path
from typing import Any, Mapping
import hashlib
import json
import re

PROTOCOL = "LRP"
PROTOCOL_VERSION = "1.0.0"
CANONICALIZATION = "JCS-RFC8785-SAFEINT"
DIGEST_ALGORITHM = "SHA-256"
MAX_SAFE_INTEGER = 9_007_199_254_740_991
MIN_SAFE_INTEGER = -MAX_SAFE_INTEGER

_RECEIPT_KEYS = frozenset({
    "protocol",
    "protocol_version",
    "canonicalization",
    "digest_algorithm",
    "payload",
    "lineage_digest",
})
_BODY_KEYS = frozenset(_RECEIPT_KEYS - {"lineage_digest"})
_SHA256_RE = re.compile(r"^[0-9a-f]{64}$")


class LRPError(ValueError):
    """Base class for LRPv1 validation and canonicalization failures."""


class ValueDomainError(LRPError):
    """Raised when a value is outside the LRPv1 accepted JSON domain."""


def _reject_surrogates(value: str, path: str) -> None:
    for char in value:
        codepoint = ord(char)
        if 0xD800 <= codepoint <= 0xDFFF:
            raise ValueDomainError(f"LONE_SURROGATE:{path}")


def _utf16_sort_key(value: str) -> bytes:
    # RFC 8785 §3.2.3 sorts raw property names by unsigned UTF-16 code units.
    _reject_surrogates(value, "$key")
    return value.encode("utf-16-be")


def validate_value(value: Any, *, path: str = "$") -> None:
    """Validate the intentionally restricted LRPv1 JSON value domain.

    Accepted values: null, Boolean, Unicode string, safe integer, array, and
    object with string keys. Floats are intentionally excluded from v1 even
    when finite; applications needing decimal or higher-precision values must
    encode them as strings under an application/profile-level convention.
    """
    if value is None or type(value) is bool:
        return
    if type(value) is int:
        if not MIN_SAFE_INTEGER <= value <= MAX_SAFE_INTEGER:
            raise ValueDomainError(f"INTEGER_OUT_OF_SAFE_RANGE:{path}")
        return
    if type(value) is float:
        raise ValueDomainError(f"FLOAT_NOT_ALLOWED:{path}")
    if type(value) is str:
        _reject_surrogates(value, path)
        return
    if type(value) is list:
        for index, item in enumerate(value):
            validate_value(item, path=f"{path}[{index}]")
        return
    if type(value) is dict:
        for key, item in value.items():
            if type(key) is not str:
                raise ValueDomainError(f"NON_STRING_OBJECT_KEY:{path}")
            _reject_surrogates(key, f"{path}.<key>")
            validate_value(item, path=f"{path}.{key}")
        return
    raise ValueDomainError(f"UNSUPPORTED_TYPE:{path}:{type(value).__name__}")


def _quote_string(value: str) -> str:
    _reject_surrogates(value, "$string")
    return json.dumps(value, ensure_ascii=False, separators=(",", ":"))


def _serialize(value: Any) -> str:
    if value is None:
        return "null"
    if type(value) is bool:
        return "true" if value else "false"
    if type(value) is int:
        return str(value)
    if type(value) is str:
        return _quote_string(value)
    if type(value) is list:
        return "[" + ",".join(_serialize(item) for item in value) + "]"
    if type(value) is dict:
        ordered_keys = sorted(value.keys(), key=_utf16_sort_key)
        return "{" + ",".join(
            _quote_string(key) + ":" + _serialize(value[key])
            for key in ordered_keys
        ) + "}"
    raise AssertionError("validate_value must run before serialization")


def canonicalize_text(value: Any) -> str:
    validate_value(value)
    return _serialize(value)


def canonicalize(value: Any) -> bytes:
    """Return LRPv1 canonical UTF-8 bytes without mutating *value*."""
    return canonicalize_text(value).encode("utf-8")


def sha256_hex(data: bytes | bytearray | memoryview) -> str:
    if not isinstance(data, (bytes, bytearray, memoryview)):
        raise TypeError("sha256_hex requires a bytes-like value")
    return hashlib.sha256(bytes(data)).hexdigest()


def digest(value: Any) -> str:
    return sha256_hex(canonicalize(value))


def digest_file(path: str | Path) -> str:
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def _body(payload: Any) -> dict[str, Any]:
    validate_value(payload)
    return {
        "protocol": PROTOCOL,
        "protocol_version": PROTOCOL_VERSION,
        "canonicalization": CANONICALIZATION,
        "digest_algorithm": DIGEST_ALGORITHM,
        "payload": deepcopy(payload),
    }


def create_receipt(payload: Any) -> dict[str, Any]:
    """Create a new receipt; the caller's payload is never mutated or retained."""
    body = _body(payload)
    return {**body, "lineage_digest": digest(body)}


def _verification(
    *,
    state: str,
    reasons: list[str],
    claimed_digest: str | None,
    computed_digest: str | None,
) -> dict[str, Any]:
    return {
        "state": state,
        "protocol": PROTOCOL,
        "protocol_version": PROTOCOL_VERSION,
        "claimed_digest": claimed_digest,
        "computed_digest": computed_digest,
        "reasons": sorted(set(reasons)),
    }


def verify_receipt(receipt: Any) -> dict[str, Any]:
    """Verify envelope identity and content digest without mutating *receipt*."""
    reasons: list[str] = []
    claimed_digest: str | None = None
    computed_digest: str | None = None

    if type(receipt) is not dict:
        return _verification(
            state="INVALID",
            reasons=["RECEIPT_NOT_OBJECT"],
            claimed_digest=None,
            computed_digest=None,
        )

    if set(receipt.keys()) != _RECEIPT_KEYS:
        missing = sorted(_RECEIPT_KEYS - set(receipt.keys()))
        extra = sorted(set(receipt.keys()) - _RECEIPT_KEYS)
        reasons.extend(f"MISSING_FIELD:{item}" for item in missing)
        reasons.extend(f"UNDECLARED_FIELD:{item}" for item in extra)

    if receipt.get("protocol") != PROTOCOL:
        reasons.append("PROTOCOL_MISMATCH")
    if receipt.get("protocol_version") != PROTOCOL_VERSION:
        reasons.append("PROTOCOL_VERSION_MISMATCH")
    if receipt.get("canonicalization") != CANONICALIZATION:
        reasons.append("CANONICALIZATION_MISMATCH")
    if receipt.get("digest_algorithm") != DIGEST_ALGORITHM:
        reasons.append("DIGEST_ALGORITHM_MISMATCH")

    raw_claimed = receipt.get("lineage_digest")
    if isinstance(raw_claimed, str):
        claimed_digest = raw_claimed
    if not isinstance(raw_claimed, str) or not _SHA256_RE.fullmatch(raw_claimed):
        reasons.append("LINEAGE_DIGEST_INVALID")

    if _BODY_KEYS.issubset(receipt.keys()):
        try:
            body = {key: deepcopy(receipt[key]) for key in _BODY_KEYS}
            validate_value(body)
            computed_digest = digest(body)
        except LRPError as exc:
            reasons.append(str(exc))
    elif "payload" in receipt:
        try:
            validate_value(receipt["payload"])
        except LRPError as exc:
            reasons.append(str(exc))

    if computed_digest is not None and claimed_digest is not None:
        if computed_digest != claimed_digest:
            reasons.append("LINEAGE_DIGEST_MISMATCH")

    return _verification(
        state="VALID" if not reasons else "INVALID",
        reasons=reasons,
        claimed_digest=claimed_digest,
        computed_digest=computed_digest,
    )


__all__ = [
    "PROTOCOL",
    "PROTOCOL_VERSION",
    "CANONICALIZATION",
    "DIGEST_ALGORITHM",
    "MAX_SAFE_INTEGER",
    "MIN_SAFE_INTEGER",
    "LRPError",
    "ValueDomainError",
    "validate_value",
    "canonicalize_text",
    "canonicalize",
    "sha256_hex",
    "digest",
    "digest_file",
    "create_receipt",
    "verify_receipt",
]
