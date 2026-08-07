#!/usr/bin/env python3
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent
commitment = json.loads((ROOT / "commitment.v1.json").read_text())

assert commitment["operation"] == "UCIC_THEORY_TEAM_PROSPECTIVE_FINAL_REPORT_SPECIFICITY_FREEZE_v1"
assert commitment["classification"] == "THEORY_TEAM_PROSPECTIVE_TO_AUTHORITATIVE_FINAL_REPORT_PROCESS_SEPARATED"
assert commitment["fixed_invariant_head"] == "cac25b781909d12f6b53b4c3440adcd7c1356eb0"
assert commitment["packet_parent_head"] == "fb8cfb622ca992a158e53eee9cb55845b11edc54"
assert commitment["source_cutoff"] == "2026-08-06T20:34:00-05:00"
assert commitment["freeze_time"] == "2026-08-06T21:55:00-05:00"
assert commitment["target_count"] == 5
assert commitment["decoy_count"] == 15
assert commitment["scientific_result"] is None
assert commitment["independent_human_confirmation"] == "NOT_CLAIMED"
assert commitment["prospective_status"] == "PREDICTIONS_FROZEN_BEFORE_AUTHORITATIVE_FINAL_REPORT"
assert commitment["plaintext_sha256"] == "b58fcb031f332b36712d77269dbc20e7757601536b7803beab2c2d4195988bee"
assert commitment["sealed_blob_sha256"] == "b75eb657370a7ad2daa0e4220a1764b6c014721be0012aef7d684c9d73b5880b"
assert commitment["algorithm"] == "AES-256-GCM"
assert commitment["aad"] == "UCIC_THEORY_TEAM_PROSPECTIVE_FINAL_REPORT_SPECIFICITY_FREEZE_v1"

print(json.dumps({
    "status": "PASS",
    "operation": commitment["operation"],
    "targets": commitment["target_count"],
    "decoys": commitment["decoy_count"],
    "plaintext_sha256": commitment["plaintext_sha256"],
    "sealed_blob_sha256": commitment["sealed_blob_sha256"],
    "scientific_result": commitment["scientific_result"]
}, sort_keys=True))
