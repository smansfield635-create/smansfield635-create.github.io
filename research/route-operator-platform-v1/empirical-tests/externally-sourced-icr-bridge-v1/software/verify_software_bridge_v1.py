from __future__ import annotations
import json
from pathlib import Path

root = Path(__file__).resolve().parent
report_path = root / "execution-report.json"
report = json.loads(report_path.read_text()) if report_path.is_file() else json.loads((root / "exploratory-execution-summary.json").read_text())
summary = report["summary"]
checks = {
    "operation": report["operation"] == "EXTERNALLY_AUTHORED_SOFTWARE_IDENTITY_CONDITIONED_REACHABILITY_BRIDGE_v1",
    "result_class": report["result_class"] == "EXPLORATORY_POST_HOC_EXTERNAL_SOFTWARE_BRIDGE",
    "systems_4": summary["systems"] == 4,
    "relation_recovery_4_of_4": summary["exact_relation_recovery"] == "4/4",
    "route_held_out_24_of_24": summary["held_out_predictions"]["route_aware"] == "24/24",
    "output_only_16_of_24": summary["held_out_predictions"]["output_continuity_identity"] == "16/24",
    "additive_12_of_24": summary["held_out_predictions"]["additive_capacity"] == "12/24",
    "route_matched_12_of_12": summary["matched_output_discrimination"]["route_aware_cases"] == "12/12",
    "output_matched_4_of_12": summary["matched_output_discrimination"]["output_continuity_identity_cases"] == "4/12",
    "boundary_not_natural": "not a preregistered natural-system test" in report["scientific_boundary"],
    "boundary_not_universal": "universal law" in report["scientific_boundary"],
}
failed = [name for name, passed in checks.items() if not passed]
print(json.dumps({"checks": checks, "pass_count": len(checks)-len(failed), "total": len(checks), "failed": failed}, indent=2))
raise SystemExit(1 if failed else 0)
