from __future__ import annotations

from pathlib import Path
import json

from route_operator_platform_v1 import (
    ComparisonRule,
    NativeFieldRule,
    StudyIdentity,
    TheoryRecord,
    adapt_compass_receipt,
    adapt_h_earth_receipt,
    evaluate_theory,
    file_sha256,
    validate_platform_receipt,
    validate_theory_crosswalk,
)


h_native = {
    "registry_to_matrix": True,
    "matrix_to_cell": 0.95,
    "cell_to_zone": 0.90,
    "zone_to_object": 0.85,
    "object_to_readout": 0.80,
    "readout_to_receipt": True,
}
h_map = {
    "REGISTRY_MATRIX": "registry_to_matrix",
    "MATRIX_CELL": NativeFieldRule("matrix_to_cell", "NO_HARD_GATE"),
    "CELL_ZONE": NativeFieldRule("cell_to_zone", "NO_HARD_GATE"),
    "ZONE_OBJECT": NativeFieldRule("zone_to_object", "NO_HARD_GATE"),
    "OBJECT_READOUT": NativeFieldRule("object_to_readout", "NO_HARD_GATE"),
    "READOUT_RECEIPT": "readout_to_receipt",
}

c_native = {
    "root_rendered": True,
    "scene_rendered": True,
    "interaction_stability": 0.95,
    "state_identity": 0.90,
    "return_route": True,
    "cross_viewport_continuity": 0.85,
}
c_map = {
    "ROOT": "root_rendered",
    "SCENE": "scene_rendered",
    "INTERACTION": NativeFieldRule(
        "interaction_stability",
        "NO_HARD_GATE",
    ),
    "STATE_IDENTITY": NativeFieldRule("state_identity", "NO_HARD_GATE"),
    "RETURN_ROUTE": "return_route",
    "CROSS_VIEWPORT": NativeFieldRule(
        "cross_viewport_continuity",
        "NO_HARD_GATE",
    ),
}

h = adapt_h_earth_receipt(
    h_native,
    h_map,
    route_id="H-EARTH-MCCI-DEMO",
    route_version="1.0.0",
    source_receipt_id="H-SYNTHETIC-1",
)
c = adapt_compass_receipt(
    c_native,
    c_map,
    route_id="FOUR-COMPASS-GESI-DEMO",
    route_version="1.0.0",
    source_receipt_id="C-SYNTHETIC-1",
)

theory = TheoryRecord(
    theory_id="MCCI_GESI_H1",
    theory_version="1.0.0",
    claim_text="Lower continuity will be associated with lower graphic stability.",
    perspective_class="FORMAL_PREREGISTERED_PREDICTION",
    frozen_at="2026-08-01T00:00:00Z",
    commit_sha="0123456789abcdef",
    content_sha256="a" * 64,
    prediction=ComparisonRule("GESI", "LESS_THAN", 0.8),
    falsification=ComparisonRule("GESI", "GREATER_OR_EQUAL", 0.95),
)

analysis_hash = file_sha256(Path(__file__))
study = StudyIdentity(
    study_id="SHADOW-DEMO-001",
    study_version="1.0.0",
    instrument_id=c["instrument_id"],
    instrument_version=c["instrument_version"],
    route_id=c["route_id"],
    route_version=c["route_version"],
    analysis_plan_version="1.0.0",
    data_locked_at="2026-08-02T00:00:00Z",
    analysis_started_at="2026-08-02T00:00:00Z",
    analysis_completed_at="2026-08-02T00:01:00Z",
    declared_input_receipt_sha256=c["receipt_sha256"],
    data_sha256=c["receipt_sha256"],
    analysis_code_sha256=analysis_hash,
)
crosswalk = evaluate_theory(
    study=study,
    theory=theory,
    observed=c,
    executed_analysis_code_sha256=analysis_hash,
)

validation_errors = {
    "h_earth_mcci": validate_platform_receipt(h),
    "four_compass_gesi": validate_platform_receipt(c),
    "theory_crosswalk": validate_theory_crosswalk(crosswalk),
}
if any(validation_errors.values()):
    raise SystemExit(
        json.dumps(
            {"status": "INVALID_DEMONSTRATION", "errors": validation_errors},
            sort_keys=True,
        )
    )

print(json.dumps({
    "status": "SYNTHETIC_SHADOW_DEMONSTRATION_VALID",
    "h_earth_mcci": h,
    "four_compass_gesi": c,
    "theory_crosswalk": crosswalk,
    "validation_errors": validation_errors,
}, indent=2, sort_keys=True))
