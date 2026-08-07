#!/usr/bin/env python3
import hashlib
import json
import pathlib
from datetime import datetime, timezone

ROOT = pathlib.Path(__file__).resolve().parent
PARENT = ROOT.parent
CP1 = json.load((ROOT / "checkpoint-1-protocol-freeze.v1.json").open())
CP2 = json.load((ROOT / "checkpoint-2-failure-source-extraction.v1.json").open())
CP3 = json.load((ROOT / "checkpoint-3-control-match-freeze.v1.json").open())
CP4 = json.load((ROOT / "checkpoint-4-warning-execution.v1.json").open())
CP5OPS = json.load((ROOT / "checkpoint-5-operationalization-freeze.v1.json").open())
CP5 = json.load((ROOT / "checkpoint-5-comparator-false-positive-execution.v1.json").open())
PARENT_RESULT = json.load((PARENT / "RESULT.v1.json").open())

for name, obj in [("CP1",CP1),("CP2",CP2),("CP3",CP3),("CP4",CP4),("CP5OPS",CP5OPS),("CP5",CP5)]:
    if obj.get("status") != "PASS_CLOSED":
        raise SystemExit(f"{name}_NOT_PASS_CLOSED")

candidate = CP5.get("candidate_terminal_disposition_under_frozen_mapping")
if candidate != "FDIC_LONGITUDINAL_EARLY_WARNING_NOT_SUPPORTED":
    raise SystemExit(f"UNEXPECTED_FROZEN_MAPPING_RESULT:{candidate}")

ucic = CP5["ucic_metrics"]
additive = CP5["additive_metrics"]
ucic_gates = CP5["ucic_threshold_gates"]
failed_ucic_gates = sorted([key for key, value in ucic_gates.items() if not value])

arm_a_disposition = PARENT_RESULT["arm_a_disposition"]
systemic_pilot = PARENT_RESULT["arm_b_systemic_pilot"]

result = {
    "operation": "UCIC_ARM_B_FDIC_LONGITUDINAL_COLLAPSE_EARLY_WARNING_EXTENSION_v1",
    "checkpoint": "CP6_TERMINAL_ADJUDICATION_AND_PAGE_READY_RECORD",
    "generated_at_utc": datetime.now(timezone.utc).isoformat(),
    "status": "PASS_CLOSED",
    "terminal_fdic_extension_disposition": candidate,
    "failed_frozen_ucic_thresholds": failed_ucic_gates,
    "ucic_metrics": ucic,
    "additive_comparator_metrics": additive,
    "additive_all_analogous_thresholds_pass": CP5["additive_all_analogous_thresholds_pass"],
    "additive_weak_dominance_rule": CP5["additive_weak_dominance"],
    "interpretation": {
        "failed_bank_sensitivity": "HIGH_BUT_NONDISCRIMINATING",
        "matched_control_specificity": "FAILED",
        "financial_generalization": "NOT_SUPPORTED",
        "post_result_retuning": "PROHIBITED",
        "universal_collapse_metric": "NOT_ESTABLISHED"
    },
    "parent_two_arm_state_after_extension": {
        "arm_a_cross_domain_temporal_transfer": arm_a_disposition,
        "arm_b_systemic_elliott_control_pilot": systemic_pilot,
        "arm_b_fdic_longitudinal_generalization": candidate,
        "overall_noncompensating_state": "MIXED_NONCOMPENSATING_RESULT"
    },
    "scientific_ceiling": "RETROSPECTIVE_EXTERNAL_TEMPORAL_AND_EARLY_WARNING_EVIDENCE_WITH_FAILED_FINANCIAL_GENERALIZATION",
    "does_not_establish": [
        "independent human confirmation",
        "true prospective confirmation",
        "universal collapse metric",
        "universal law",
        "superiority of UCIC over additive models"
    ],
    "scientific_consequence": "The frozen public-financial noncompensatory warning operationalization is falsified as a discriminating bank-collapse early-warning rule. This does not falsify the fixed UCIC invariant candidate; it rejects this registered financial generalization and must remain visible in the portfolio.",
    "page_ready": True,
    "merge_authority": "NOT_GRANTED"
}

result_path = ROOT / "checkpoint-6-terminal-adjudication.v1.json"
result_path.write_text(json.dumps(result, indent=2, sort_keys=True) + "\n")

md = f"""# UCIC temporal-transfer and collapse early-warning study — page-ready research record

## Study identity

`UCIC_GLOBAL_TEMPORAL_HOLDOUT_TRANSFER_AND_COLLAPSE_EARLY_WARNING_v1`

The completed study contains two noncompensating empirical arms. Success in one arm does not rescue a failure in the other.

## Arm A — cross-domain temporal transfer

**Disposition:** `{arm_a_disposition}`

Across aviation, railroad, bulk-energy, and pipeline systems, the unchanged constitutive-route representation transferred from pre-final public evidence to later authoritative findings with:

- median route hit rate: `{PARENT_RESULT['arm_a_portfolio_scores']['median_route_hit_rate']}`;
- median causal coverage: `{PARENT_RESULT['arm_a_portfolio_scores']['median_causal_coverage']}`;
- median true-minus-decoy advantage: `{PARENT_RESULT['arm_a_portfolio_scores']['median_true_minus_decoy_advantage']}`;
- positive true-minus-decoy cases: `{PARENT_RESULT['arm_a_portfolio_scores']['positive_true_minus_decoy_cases']}/4`;
- cases with false-route rate > 0.50: `{PARENT_RESULT['arm_a_portfolio_scores']['cases_false_route_rate_gt_0_50']}/4`.

The Merrimack Valley pipeline case preserves one adverse predicted relation that was not part of the terminal probable/contributing-cause statement. Outcome blindness and true prospective prediction are not claimed.

## Arm B — systemic early-warning pilot

**Disposition:** `{systemic_pilot}`

The public FERC/NERC record contained route-level vulnerability warnings 402 days and 64 days before Winter Storm Elliott. Elliott later produced approximately 90,000 MW of coincident unplanned generation loss and more than 5,400 MW of operator-initiated load shed. The January 2024 Gerri/Heather stress control recorded 0 MW of operator-initiated load shed while the official review documented improved coordination, preparedness, fuel support, storage/line pack, alerts, and forecasting.

This remains a bounded systemic pilot. It does not establish a universal collapse metric.

## Arm B — FDIC longitudinal generalization

**Disposition:** `{candidate}`

The extension froze all 11 FDIC bank failures from March 2023 through May 2026, extracted 11/11 official quarterly histories, and deterministically matched 22 surviving control assignments representing 21 unique control institutions.

### Frozen UCIC warning result

- evaluable failed banks: `{ucic['evaluable_failed_banks']}/11`;
- pre-failure detections: `{ucic['pre_failure_detections']}/11`;
- sensitivity: `{ucic['sensitivity']:.3f}`;
- actionable >=30-day detections: `{ucic['actionable_30d_detections']}/11`;
- >=90-day detections: `{ucic['early_90d_detections']}/11`;
- median lead time among detected failures: `{ucic['median_lead_days_detected']}` days;
- evaluable matched-control assignments: `{ucic['evaluable_control_assignments']}/22`;
- false-positive control assignments: `{ucic['false_positive_assignments']}/22`;
- false-positive rate: `{ucic['false_positive_rate']:.3f}`;
- sensitivity minus false-positive-rate margin: `{ucic['discrimination_margin']:.3f}`.

The failure-side sensitivity was perfect, but the same frozen warning rule fired on every matched surviving control assignment. The registered specificity and discrimination thresholds therefore failed.

### Frozen additive comparator

- failed-bank detections: `{additive['pre_failure_detections']}/11`;
- sensitivity: `{additive['sensitivity']:.3f}`;
- actionable >=30-day detections: `{additive['actionable_30d_detections']}/11`;
- median lead time among detected failures: `{additive['median_lead_days_detected']}` days;
- false-positive controls: `{additive['false_positive_assignments']}/22`;
- false-positive rate: `{additive['false_positive_rate']:.3f}`;
- discrimination margin: `{additive['discrimination_margin']:.3f}`.

The additive comparator passed its analogous frozen thresholds while the UCIC financial warning rule did not. This is an adverse result and is retained without post-result repair.

## Scientific interpretation

The study now supports a narrower conclusion than the failure-only result suggested. Constitutive-route representations showed strong retrospective temporal transfer across four engineered-system domains, and the Elliott/Gerri-Heather comparison supports a bounded systemic early-warning/mitigation contrast. However, the registered public-financial UCIC warning rule did **not** discriminate failed banks from matched surviving banks. Its 100% failed-bank sensitivity was accompanied by a 100% matched-control false-positive rate.

Accordingly, this study does **not** support generalizing that particular noncompensatory early-warning operationalization to bank collapse. The result rejects the registered financial generalization; it does not erase the positive Arm A result, the bounded systemic pilot, or establish that the fixed UCIC invariant candidate itself is false.

## Claim boundary for public pages

Permitted summary:

> The frozen UCIC route framework transferred strongly across four retrospective temporal domains and produced a bounded pre-collapse systemic signal in the Winter Storm Elliott case. A preregistered 11-bank FDIC extension then failed its discrimination test: the same noncompensatory warning rule that identified all 11 failed banks also warned on all 22 matched surviving-control assignments. The negative result is preserved and prevents a general bank-collapse early-warning claim. An additive comparator was less sensitive but substantially more discriminating in that extension.

Do not describe this study as prospective, independently replicated, proof of universality, a validated bank-failure predictor, or evidence that UCIC universally outperforms additive models.
"""

page_path = ROOT / "PAGE_READY_RESEARCH_RECORD.md"
page_path.write_text(md)

manifest = {}
for path in [
    ROOT / "checkpoint-1-protocol-freeze.v1.json",
    ROOT / "checkpoint-2-source-schema-correction.v1.json",
    ROOT / "checkpoint-2-failure-source-extraction.v1.json",
    ROOT / "checkpoint-3-control-match-freeze.v1.json",
    ROOT / "checkpoint-4-operationalization-freeze.v1.json",
    ROOT / "checkpoint-4-warning-execution.v1.json",
    ROOT / "checkpoint-5-operationalization-freeze.v1.json",
    ROOT / "checkpoint-5-comparator-false-positive-execution.v1.json",
    result_path,
    page_path,
]:
    manifest[str(path.relative_to(ROOT))] = hashlib.sha256(path.read_bytes()).hexdigest()
(ROOT / "checkpoint-6-manifest.sha256.json").write_text(json.dumps(manifest, indent=2, sort_keys=True) + "\n")

print(json.dumps({
    "checkpoint": result["checkpoint"],
    "status": result["status"],
    "fdic_disposition": candidate,
    "overall": result["parent_two_arm_state_after_extension"]["overall_noncompensating_state"],
    "ucic_false_positive_rate": ucic["false_positive_rate"],
    "additive_false_positive_rate": additive["false_positive_rate"],
}, sort_keys=True))
