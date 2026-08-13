#!/usr/bin/env python3
"""Current CP6 static synchronization compatibility gate."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def main() -> int:
    methods = (ROOT / "laws/research/methods-and-models/index.html").read_text(encoding="utf-8")
    manifest = (ROOT / "laws/research/methods-and-models/canonical-records-v1.html").read_text(encoding="utf-8")
    if "METHODS_MODELS_CANONICAL_ARCHIVE_v1_DRAFT" not in methods:
        raise SystemExit("CP6_STATIC_FAILURE:METHODS_ARCHIVE_BINDING")
    if 'data-record-class="READ_ONLY_CANONICAL_MANIFEST"' not in manifest:
        raise SystemExit("CP6_STATIC_FAILURE:METHODS_MANIFEST_CONTRACT")
    if "Read-only record and custody manifest" not in manifest:
        raise SystemExit("CP6_STATIC_FAILURE:METHODS_MANIFEST_CUSTODY")
    result = {"contract":"LAWS_CP6_CURRENT_STATIC_SYNCHRONIZATION_v1","status":"PASS","methodsModelsCustody":"READ_ONLY_CANONICAL_MANIFEST"}
    out = ROOT / "artifacts/laws-cp6-final-synchronization/static-result.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(result, indent=2))
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
