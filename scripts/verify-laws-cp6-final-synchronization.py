#!/usr/bin/env python3
"""Gen1750 representative checkpoint; replaced by the strict 29-route gate after acceptance."""

from __future__ import annotations

import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main() -> int:
    subprocess.run(
        ["node", "laws/room-carousel/verify-contextual-delivery.v2.mjs", "--representatives", "--static-only"],
        cwd=ROOT,
        check=True,
    )
    changed = subprocess.check_output(
        ["git", "diff", "--name-only", "origin/main...HEAD"], cwd=ROOT, text=True
    ).splitlines()
    protected = [path for path in changed if path.startswith("laws/research/methods-and-models/") or path == "laws/index.html"]
    if protected:
        raise AssertionError(f"PROTECTED_PATH_MUTATION:{protected}")
    result = {
        "contract": "LAWS_CONTEXTUAL_DELIVERY_REPRESENTATIVE_CHECKPOINT_v2",
        "status": "PASS",
        "routes": ["/laws/categories/flow/cycles/", "/laws/categories/flow/handoffs/"],
        "next_gate": "STRICT_29_ROUTE_MATRIX_AFTER_PHYSICAL_ACCEPTANCE",
    }
    artifact = ROOT / "artifacts/laws-cp6-final-synchronization/static-result.json"
    artifact.parent.mkdir(parents=True, exist_ok=True)
    artifact.write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(result, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
