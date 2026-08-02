from __future__ import annotations

import json
from route_operator_platform_v1 import (
    ComparisonRule, StudyIdentity, TheoryRecord,
    adapt_compass_receipt, adapt_h_earth_receipt, evaluate_theory,
)

h_native = {
    "registry_to_matrix": True, "matrix_to_cell": 0.95,
    "cell_to_zone": 0.90, "zone_to_object": 0.85,
    "object_to_readout": 0.80, "readout_to_receipt": True,
}
h_map = {
    "REGISTRY_MATRIX": "registry_to_matrix", "MATRIX_CELL": "matrix_to_cell",
    "CELL_ZONE": "cell_to_zone", "ZONE_OBJECT": "zone_to_object",
    "OBJECT_READOUT": "object_to_readout", "READOUT_RECEIPT": "readout_to_receipt",
}
c_native = {
    "root_rendered": True, "scene_rendered": True,
    "interaction_stability": 0.95, "state_identity": 0.90,
    "return_route": True, "cross_viewport_continuity": 0.85,
}
c_map = {
    "ROOT": "root_rendered", "SCENE": "scene_rendered",
    "INTERACTION": "interaction_stability", "STATE_IDENTITY": "state_identity",
    "RETURN_ROUTE": "return_route", "CROSS_VIEWPORT": "cross_viewport_continuity",
}
h = adapt_h_earth_receipt(h_native, h_map, route_id="H-EARTH-MCCI-DEMO", route_version="1.0.0", source_receipt_id="H-SYNTHETIC-1")
c = adapt_compass_receipt(c_native, c_map, route_id="FOUR-COMPASS-GESI-DEMO", route_version="1.0.0", source_receipt_id="C-SYNTHETIC-1")
theory = TheoryRecord(
    theory_id="MCCI_GESI_H1", theory_version="1.0.0",
    claim_text="Lower continuity will be associated with lower graphic stability.",
    perspective_class="FORMAL_PREREGISTERED_PREDICTION",
    frozen_at="2026-08-01T00:00:00Z", commit_sha="0123456789abcdef",
    content_sha256="a" * 64,
    prediction=ComparisonRule("GESI", "LESS_THAN", 0.8),
    falsification=ComparisonRule("GESI", "GREATER_OR_EQUAL", 0.95),
)
study = StudyIdentity(
    study_id="SHADOW-DEMO-001", study_version="1.0.0", instrument_id="GESI",
    instrument_version="1.0.0", route_id="FOUR-COMPASS-GESI-DEMO",
    route_version="1.0.0", analysis_plan_version="1.0.0",
    data_locked_at="2026-08-02T00:00:00Z", data_sha256="b" * 64,
    analysis_code_sha256="c" * 64,
)
print(json.dumps({
    "h_earth_mcci": h,
    "four_compass_gesi": c,
    "theory_crosswalk": evaluate_theory(study=study, theory=theory, observed=c),
}, indent=2, sort_keys=True))
