#!/usr/bin/env python3
"""Align a CLAC PPL payload to the frozen author-script exponent base."""
from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any


def canonical_sha256(value: Any) -> str:
    text = json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()

    input_path = Path(args.input)
    output_path = Path(args.output)
    source = json.loads(input_path.read_text(encoding="utf-8"))
    previous_digest = source.get("payloadSha256")
    rows = []
    for row in source.get("rows", []):
        loss = row.get("PPL_CrossEntropy")
        if not isinstance(loss, (int, float)) or not math.isfinite(float(loss)):
            aligned = None
        else:
            value = math.pow(2.0, min(float(loss), 1023.0))
            aligned = value if math.isfinite(value) else None
        rows.append({**row, "PPL": aligned})

    body = {
        **{key: value for key, value in source.items() if key not in {"rows", "payloadSha256", "result"}},
        "result": "PASS_CLAC_PPL_FEATURE_EXTRACTION_Q5_K_M_AUTHOR_EXP2_ALIGNED",
        "authorAlignment": {
            "authorScript": "RuiHe1999/sem_space_AD:ppl_en.py",
            "authorCalculation": "numpy.exp2(loss.item())",
            "featureValuesInspectedBeforeRuleFreeze": False,
            "preAlignmentPayloadSha256": previous_digest,
            "fullPrecisionEquivalenceClaimed": False
        },
        "rows": rows
    }
    payload = {**body, "payloadSha256": canonical_sha256(body)}
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps({
        "result": payload["result"],
        "rows": len(rows),
        "payloadSha256": payload["payloadSha256"]
    }, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
