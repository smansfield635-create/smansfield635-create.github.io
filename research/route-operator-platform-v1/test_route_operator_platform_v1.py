from __future__ import annotations

import math
import unittest

from route_operator_platform_v1 import (
    ComponentObservation,
    ComparisonRule,
    RelationObservation,
    RouteDefinition,
    StudyIdentity,
    TheoryRecord,
    VisualObservation,
    adapt_compass_receipt,
    adapt_h_earth_receipt,
    canonical_sha256,
    evaluate_theory,
    score_gesi,
    score_mcci,
    score_required_route,
)


class PlatformConformance(unittest.TestCase):
    def test_operator_family(self):
        route = RouteDefinition("R", "1", "TEST", ("A", "B"))
        receipt = score_required_route(route, [
            ComponentObservation("A", 0.5, True, "S", "RA"),
            ComponentObservation("B", 0.8, False, "S", "RB"),
        ])
        self.assertEqual(receipt["state"], "NUMERIC")
        self.assertTrue(math.isclose(receipt["continuous_capacity"], 0.4))
        self.assertEqual(receipt["weakest_component"], 0.5)
        self.assertFalse(receipt["hard_conjunction_pass"])

    def test_invalid_precedes_unevaluable(self):
        route = RouteDefinition("R", "1", "TEST", ("A",))
        receipt = score_required_route(route, [
            ComponentObservation("A", None, None, None, None, version="wrong")
        ])
        self.assertEqual(receipt["state"], "INVALID")

    def test_mcci(self):
        receipt = score_mcci(
            route_id="M", route_version="1", relation_ids=("AB", "BC"),
            observations=(
                RelationObservation("AB", 1.0, True, "S", "R1"),
                RelationObservation("BC", 0.7, True, "S", "R2"),
            ),
        )
        self.assertEqual(receipt["MCCI"], 0.7)
        self.assertFalse(receipt["native_verdict_override"])

    def test_gesi(self):
        receipt = score_gesi(
            route_id="G", route_version="1", factor_ids=("A", "B"),
            observations=(
                VisualObservation("A", 0.9, True, "S", "R1"),
                VisualObservation("B", 0.8, True, "S", "R2"),
            ),
        )
        self.assertTrue(math.isclose(receipt["GESI"], 0.72))
        self.assertTrue(receipt["difference_is_not_automatically_degradation"])

    def test_h_earth_shadow_adapter(self):
        native = {
            "registry_to_matrix": True,
            "matrix_to_cell": 0.95,
            "cell_to_zone": 0.90,
            "zone_to_object": 0.85,
            "object_to_readout": 0.80,
            "readout_to_receipt": True,
        }
        mapping = {
            "REGISTRY_MATRIX": "registry_to_matrix",
            "MATRIX_CELL": "matrix_to_cell",
            "CELL_ZONE": "cell_to_zone",
            "ZONE_OBJECT": "zone_to_object",
            "OBJECT_READOUT": "object_to_readout",
            "READOUT_RECEIPT": "readout_to_receipt",
        }
        receipt = adapt_h_earth_receipt(
            native, mapping, route_id="H", route_version="1",
            source_receipt_id="H-SYNTHETIC-1",
        )
        self.assertTrue(math.isclose(receipt["MCCI"], 0.5814))
        self.assertEqual(receipt["native_receipt_preserved"], native)
        hashed = dict(receipt)
        digest = hashed.pop("receipt_sha256")
        self.assertEqual(digest, canonical_sha256(hashed))

    def test_compass_shadow_adapter(self):
        native = {
            "root_rendered": True,
            "scene_rendered": True,
            "interaction_stability": 0.95,
            "state_identity": 0.90,
            "return_route": True,
            "cross_viewport_continuity": 0.85,
        }
        mapping = {
            "ROOT": "root_rendered",
            "SCENE": "scene_rendered",
            "INTERACTION": "interaction_stability",
            "STATE_IDENTITY": "state_identity",
            "RETURN_ROUTE": "return_route",
            "CROSS_VIEWPORT": "cross_viewport_continuity",
        }
        receipt = adapt_compass_receipt(
            native, mapping, route_id="C", route_version="1",
            source_receipt_id="C-SYNTHETIC-1",
        )
        self.assertTrue(math.isclose(receipt["GESI"], 0.72675))
        self.assertEqual(receipt["weakest_visual_factor"], 0.85)

    def test_prospective_theory_support(self):
        theory = TheoryRecord(
            theory_id="T", theory_version="1", claim_text="x",
            perspective_class="FORMAL_PREREGISTERED_PREDICTION",
            frozen_at="2026-08-01T00:00:00Z", commit_sha="abcdef0",
            content_sha256="a" * 64,
            prediction=ComparisonRule("MCCI", "LESS_THAN", 0.8),
            falsification=ComparisonRule("MCCI", "GREATER_OR_EQUAL", 0.95),
        )
        study = StudyIdentity(
            study_id="S", study_version="1", instrument_id="MCCI",
            instrument_version="1", route_id="R", route_version="1",
            analysis_plan_version="1", data_locked_at="2026-08-02T00:00:00Z",
            data_sha256="b" * 64, analysis_code_sha256="c" * 64,
        )
        result = evaluate_theory(study=study, theory=theory, observed={"MCCI": 0.7})
        self.assertEqual(result["disposition"], "SUPPORTED_WITHIN_DECLARED_SCOPE")

    def test_post_result_theory_not_confirmatory(self):
        theory = TheoryRecord(
            theory_id="T", theory_version="1", claim_text="x",
            perspective_class="POST_RESULT_INTERPRETATION",
            frozen_at="2026-08-03T00:00:00Z", commit_sha="abcdef0",
            content_sha256="a" * 64,
            prediction=ComparisonRule("MCCI", "LESS_THAN", 0.8),
        )
        study = StudyIdentity(
            study_id="S", study_version="1", instrument_id="MCCI",
            instrument_version="1", route_id="R", route_version="1",
            analysis_plan_version="1", data_locked_at="2026-08-02T00:00:00Z",
            data_sha256="b" * 64, analysis_code_sha256="c" * 64,
        )
        result = evaluate_theory(study=study, theory=theory, observed={"MCCI": 0.7})
        self.assertEqual(result["disposition"], "RETROSPECTIVE_OR_INVALID_PRIORITY")


if __name__ == "__main__":
    unittest.main()
