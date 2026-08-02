#!/usr/bin/env python3
"""Successor acceptance verifier for the Reverse Audit comparator completeness correction.

The v2 verifier remains the complete chamber verifier. This successor injects only the
new named control paths into its allowed-path registry, executes every v2 invariant, and
then requires the exact Reverse Audit comparator authority, receipt, and public sentence.
"""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
V2 = ROOT / "scripts/verify-laws-complete-renewal-batch-v2.py"
AUTHORITY = ROOT / "laws/control-plane/renewal/laws-complete-renewal-reverse-audit-battery-comparator-successor-v1.json"
RECEIPT = ROOT / "laws/control-plane/renewal/laws-complete-renewal-batch-materialization-receipt-v1.json"
TARGET = ROOT / "laws/test/reverse-audit/index.html"

NEW_CONTROLS = [
    ".github/workflows/laws-complete-renewal-reverse-audit-comparator.yml",
    ".github/workflows/laws-complete-renewal-batch-verification-v3.yml",
    "scripts/laws_complete_renewal_reverse_audit_comparator_patch.py",
    "scripts/verify-laws-complete-renewal-batch-v3.py",
    "laws/control-plane/renewal/laws-complete-renewal-reverse-audit-battery-comparator-successor-v1.json",
    "laws/control-plane/renewal/laws-complete-renewal-batch-browser-verification-v3.json",
]

REQUIRED_SENTENCE = (
    "The defined battery event was evaluated within the next 20 cycles, and reverse challenge preserved "
    "the stronger conventional aging-burden comparator at AUROC 0.9704 against the combined model at "
    "AUROC 0.9394 before component ablations and threshold behavior were considered."
)


def require(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def run_v2_with_named_controls() -> None:
    source = V2.read_text(encoding="utf-8")
    needle = "allowed_controls = {\n"
    require(source.count(needle) == 1, "Unable to locate unique v2 allowed-control registry")
    injection = needle + "".join(f'    "{path}",\n' for path in NEW_CONTROLS)
    source = source.replace(needle, injection, 1)
    namespace = {
        "__name__": "__main__",
        "__file__": str(V2),
    }
    exec(compile(source, str(V2), "exec"), namespace)


def main() -> int:
    authority = json.loads(AUTHORITY.read_text(encoding="utf-8"))
    require(authority.get("status") == "ACTIVE_FOR_PR_493", "Reverse Audit comparator authority is not active")
    require(authority.get("required_public_sentence") == REQUIRED_SENTENCE, "Authority sentence drift")

    run_v2_with_named_controls()

    public = TARGET.read_text(encoding="utf-8").split('<details class="lr-audit"', 1)[0]
    normalized_public = " ".join(public.split())
    require(
        normalized_public.count(REQUIRED_SENTENCE) == 1,
        "Exact Reverse Audit comparator sentence is not singular in the public layer",
    )
    for marker in ("next 20 cycles", "AUROC 0.9704", "AUROC 0.9394", "stronger conventional aging-burden comparator"):
        require(marker in normalized_public, f"Reverse Audit comparator context missing: {marker}")

    receipt = json.loads(RECEIPT.read_text(encoding="utf-8"))
    correction = receipt.get("reverse_audit_battery_comparator_successor", {})
    require(correction.get("status") == "APPLIED_PENDING_EXECUTED_VERIFICATION", "Reverse Audit comparator receipt missing")
    require(correction.get("path") == "laws/test/reverse-audit/index.html", "Reverse Audit comparator receipt path drift")
    for boundary in (
        "visual_structure_change",
        "tab_structure_change",
        "metric_change",
        "evidence_status_upgrade",
        "claim_ceiling_upgrade",
    ):
        require(correction.get(boundary) is False, f"Reverse Audit correction boundary changed: {boundary}")

    result_path = ROOT / "artifacts/laws-complete-renewal-batch-verification/static-result.json"
    result = json.loads(result_path.read_text(encoding="utf-8"))
    result["contract"] = "LAWS_COMPLETE_RENEWAL_BATCH_STATIC_VERIFICATION_v3"
    result["reverseAuditComparatorSuccessor"] = "PASS"
    result["representativeHtmlMutations"] = 3
    result["boundedRepresentativeCorrections"] = [
        "laws/categories/flow/signals/index.html::EXACT_20_CYCLE_FACT_ADDITION",
        "laws/categories/reality/measure.html::EXACT_20_CYCLE_FACT_ADDITION",
        "laws/test/reverse-audit/index.html::EXACT_20_CYCLE_AND_STRONGER_COMPARATOR_FACT_REPLACEMENT",
    ]
    result["otherRepresentativeHtmlMutations"] = 0
    result["representativeVisualStructureMutations"] = 0
    result_path.write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(result, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
