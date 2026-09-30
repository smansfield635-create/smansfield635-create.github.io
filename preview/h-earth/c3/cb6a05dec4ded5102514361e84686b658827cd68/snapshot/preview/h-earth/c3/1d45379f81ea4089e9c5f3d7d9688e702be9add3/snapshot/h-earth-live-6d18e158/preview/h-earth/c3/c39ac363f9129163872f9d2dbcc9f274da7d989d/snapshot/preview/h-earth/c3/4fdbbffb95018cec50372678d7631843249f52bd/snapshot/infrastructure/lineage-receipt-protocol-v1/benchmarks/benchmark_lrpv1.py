from __future__ import annotations

from copy import deepcopy
from pathlib import Path
from time import perf_counter
import argparse
import json
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "python"))

from lineage_receipt_protocol_v1 import create_receipt, verify_receipt  # noqa: E402


CORRUPTION_NAMES = (
    "payload_result",
    "payload_configuration",
    "protocol_metadata",
    "digest_bit_flip",
    "undeclared_field",
    "missing_field",
)


def corrupt(receipt: dict, mode: int) -> dict:
    """Return one of six deterministic corruption classes."""
    item = deepcopy(receipt)
    mode %= len(CORRUPTION_NAMES)
    if mode == 0:
        item["payload"]["result"]["status"] = "FAIL"
    elif mode == 1:
        item["payload"]["configuration"]["mode"] = "changed"
    elif mode == 2:
        item["protocol_version"] = "9.9.9"
    elif mode == 3:
        digest = item["lineage_digest"]
        item["lineage_digest"] = ("0" if digest[0] != "0" else "1") + digest[1:]
    elif mode == 4:
        item["undeclared"] = True
    else:
        item.pop("digest_algorithm")
    return item


def run(iterations: int) -> dict[str, float | int | dict[str, int]]:
    base = {
        "input_identity": {"sha256": "a" * 64},
        "code_identity": {"sha256": "b" * 64},
        "configuration": {"attempt": 0, "mode": "benchmark"},
        "result": {"status": "PASS"},
    }

    started = perf_counter()
    for index in range(iterations):
        payload = deepcopy(base)
        payload["configuration"]["attempt"] = index
        create_receipt(payload)
    create_seconds = perf_counter() - started

    reference = create_receipt(base)
    started = perf_counter()
    valid_count = sum(
        verify_receipt(reference)["state"] == "VALID"
        for _ in range(iterations)
    )
    verify_seconds = perf_counter() - started

    corruptions = [corrupt(reference, mode) for mode in range(len(CORRUPTION_NAMES))]
    corruption_counts = {name: 0 for name in CORRUPTION_NAMES}
    false_accepts = 0
    started = perf_counter()
    for index in range(iterations):
        mode = index % len(CORRUPTION_NAMES)
        corruption_counts[CORRUPTION_NAMES[mode]] += 1
        if verify_receipt(corruptions[mode])["state"] == "VALID":
            false_accepts += 1
    corruption_seconds = perf_counter() - started

    return {
        "iterations": iterations,
        "valid_receipts": valid_count,
        "corrupt_receipts_tested": iterations,
        "corrupt_receipts_accepted": false_accepts,
        "corruption_classes": corruption_counts,
        "create_seconds": create_seconds,
        "verify_seconds": verify_seconds,
        "corruption_verify_seconds": corruption_seconds,
        "create_per_second": iterations / create_seconds if create_seconds else 0.0,
        "verify_per_second": iterations / verify_seconds if verify_seconds else 0.0,
        "corruption_verify_per_second": iterations / corruption_seconds if corruption_seconds else 0.0,
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--iterations", type=int, default=100_000)
    args = parser.parse_args()
    if args.iterations <= 0:
        raise SystemExit("iterations must be positive")
    print(json.dumps(run(args.iterations), indent=2, sort_keys=True))
