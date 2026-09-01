from __future__ import annotations

import unittest

from route_operator_platform_v1 import State
from route_operator_platform_v1 import (
    ComparisonRule,
    MCCI_ID,
    MCCI_VERSION,
    RelationObservation,
    StudyIdentity,
    TheoryRecord,
    evaluate_theory,
    score_mcci,
    summarize_study,
    validate_theory_crosswalk,
)

ANALYSIS_CODE_SHA256 = "c" * 64


def receipt():
    return score_mcci(
        route_id="R",
        route_version="1.0.0",
        relation_ids=("AB",),
        observations=(RelationObservation("AB", 0.7, True, "S", "SRC"),),
    )


def theory(prediction, falsification=None):
    return TheoryRecord(
        theory_id="T",
        theory_version="1.0.0",
        claim_text="Pointer-only custody cannot support a scientific disposition.",
        perspective_class="FORMAL_PREREGISTERED_PREDICTION",
        frozen_at="2026-08-01T00:00:00Z",
        commit_sha="abcdef0",
        content_sha256="a" * 64,
        prediction=prediction,
        falsification=falsification,
    )


def pointer_study(observed):
    return StudyIdentity(
        study_id="S",
        study_version="1.0.0",
        instrument_id=MCCI_ID,
        instrument_version=MCCI_VERSION,
        route_id=observed["route_id"],
        route_version=observed["route_version"],
        analysis_plan_version="1.0.0",
        data_locked_at="2026-08-02T00:00:00Z",
        analysis_started_at="2026-08-02T00:00:00Z",
        analysis_completed_at="2026-08-02T01:00:00Z",
        declared_input_receipt_sha256=observed["receipt_sha256"],
        data_sha256="b" * 64,
        analysis_code_sha256=ANALYSIS_CODE_SHA256,
        data_lock_mode="POINTER_ONLY",
        data_pointer="drive://private-data-object",
    )


class PointerCustodyConformance(unittest.TestCase):
    def evaluate(self, prediction, falsification=None):
        observed = receipt()
        return evaluate_theory(
            study=pointer_study(observed),
            theory=theory(prediction, falsification),
            observed=observed,
            executed_analysis_code_sha256=ANALYSIS_CODE_SHA256,
        )

    def assert_pointer_blocked(self, result):
        self.assertEqual(result["state"], State.UNEVALUABLE.value)
        self.assertIsNone(result["scientific_disposition"])
        self.assertFalse(result["confirmatory_eligible"])
        self.assertTrue(result["scientific_disposition_blocked"])
        self.assertEqual(
            result["custody_disposition"],
            "INCONCLUSIVE_DATA_CUSTODY_NOT_CRYPTOGRAPHICALLY_VERIFIED",
        )
        self.assertEqual(validate_theory_crosswalk(result), [])

    def test_pointer_only_cannot_return_supported(self):
        self.assert_pointer_blocked(
            self.evaluate(ComparisonRule("MCCI", "LESS_THAN", 0.8))
        )

    def test_pointer_only_cannot_return_falsified(self):
        self.assert_pointer_blocked(
            self.evaluate(
                ComparisonRule("MCCI", "LESS_THAN", 0.8),
                ComparisonRule("MCCI", "GREATER_OR_EQUAL", 0.6),
            )
        )

    def test_pointer_only_cannot_return_not_supported(self):
        self.assert_pointer_blocked(
            self.evaluate(ComparisonRule("MCCI", "GREATER_THAN", 0.8))
        )

    def test_pointer_only_propagates_to_study_summary(self):
        result = self.evaluate(ComparisonRule("MCCI", "LESS_THAN", 0.8))
        summary = summarize_study([result])
        self.assertEqual(summary["state"], State.UNEVALUABLE.value)
        self.assertEqual(summary["unevaluable_crosswalk_count"], 1)


if __name__ == "__main__":
    unittest.main()
