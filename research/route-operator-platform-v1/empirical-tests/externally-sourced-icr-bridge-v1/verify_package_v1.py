from __future__ import annotations
import hashlib
import json
from pathlib import Path

root = Path(__file__).resolve().parent
manifest = json.loads((root / "MANIFEST_SHA256.json").read_text())
failures = []
for relative, expected in manifest["files"].items():
    path = root / relative
    if not path.is_file():
        failures.append(f"missing:{relative}")
        continue
    actual = hashlib.sha256(path.read_bytes()).hexdigest()
    if actual != expected:
        failures.append(f"hash:{relative}:{actual}")
checks = {
    "manifest_files": len(manifest["files"]),
    "software_summary_present": (root / "software/exploratory-execution-summary.json").is_file(),
    "prospective_uci_report_absent_at_freeze_allowed": True,
    "failures": failures,
}
print(json.dumps(checks, indent=2))
raise SystemExit(1 if failures else 0)
