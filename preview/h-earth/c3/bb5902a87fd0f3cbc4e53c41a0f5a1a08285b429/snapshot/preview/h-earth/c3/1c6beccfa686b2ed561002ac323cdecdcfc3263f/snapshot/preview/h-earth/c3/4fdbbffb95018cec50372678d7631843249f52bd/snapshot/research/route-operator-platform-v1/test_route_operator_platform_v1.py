from __future__ import annotations

from pathlib import Path
import json
import math
import shutil
import tempfile
import unittest

from route_operator_platform_v1 import (
    APPROVED_IMI_ZIP_SHA256,
    ComponentObservation,
    ComparisonRule,
    EXPECTED_MANIFEST_PATHS,
    MCCI_ID,
    MCCI_VERSION,
    NativeFieldRule,
    RelationObservation,
    RouteDefinition,
    State,
    StudyIdentity,
    TheoryRecord,
    VisualObservation,
    adapt_compass_receipt,
    adapt_h_earth_receipt,
    evaluate_theory,
    score_gesi,
    score_mcci,
    score_required_route,
    summarize_route_series,
    validate_platform_receipt,
    validate_theory_crosswalk,
    verify_imi_package_pointer,
    verify_platform_manifest,
    verify_receipt_sha256,
)

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
ANALYSIS_HASH = "c" * 64


def obs(
    component_id="A", value=0.8, hard_pass=True, source_class="S",
    source_receipt_id="R1", version="1.0.0",
):
    return ComponentObservation(
        component_id, value, hard_pass, source_class, source_receipt_id,
        version=version,
    )


def mcci(route_id="R", route_version="1.0.0", value=0.7):
    return score_mcci(
        route_id=route_id,
        route_version=route_version,
        relation_ids=("AB",),
        observations=(RelationObservation("AB", value, True, "S", "SRC"),),
    )


def theory(**changes):
    values = {
        "theory_id": "T",
        "theory_version": "1.0.0",
        "claim_text": "MCCI will be below 0.8.",
        "perspective_class": "FORMAL_PREREGISTERED_PREDICTION",
        "frozen_at": "2026-08-01T00:00:00Z",
        "commit_sha": "abcdef0",
        "content_sha256": "a" * 64,
        "prediction": ComparisonRule("MCCI", "LESS_THAN", 0.8),
        "falsification": ComparisonRule("MCCI", "GREATER_OR_EQUAL", 0.95),
    }
    values.update(changes)
    return TheoryRecord(**values)


def study(receipt, **changes):
    values = {
        "study_id": "S",
        "study_version": "1.0.0",
        "instrument_id": MCCI_ID,
        "instrument_version": MCCI_VERSION,
        "route_id": receipt["route_id"],
        "route_version": receipt["route_version"],
        "analysis_plan_version": "1.0.0",
        "data_locked_at": "2026-08-02T00:00:00Z",
        "analysis_started_at": "2026-08-02T00:00:00Z",
        "analysis_completed_at": "2026-08-02T01:00:00Z",
        "declared_input_receipt_sha256": receipt["receipt_sha256"],
        "data_sha256": receipt["receipt_sha256"],
        "analysis_code_sha256": ANALYSIS_HASH,
    }
    values.update(changes)
    return StudyIdentity(**values)


def evaluate(receipt, *, study_changes=None, theory_changes=None, code_hash=ANALYSIS_HASH):
    return evaluate_theory(
        study=study(receipt, **(study_changes or {})),
        theory=theory(**(theory_changes or {})),
        observed=receipt,
        executed_analysis_code_sha256=code_hash,
    )


class PlatformConformance(unittest.TestCase):
    def test_operator_family_and_receipt_hash(self):
        receipt = score_required_route(
            RouteDefinition("R", "1", "TEST", ("A", "B")),
            [obs("A", 0.5, True, source_receipt_id="RA"),
             obs("B", 0.8, False, source_receipt_id="RB")],
        )
        self.assertEqual(receipt["state"], "NUMERIC")
        self.assertTrue(math.isclose(receipt["continuous_capacity"], 0.4))
        self.assertEqual(receipt["weakest_component"], 0.5)
        self.assertFalse(receipt["hard_conjunction_pass"])
        self.assertEqual(validate_platform_receipt(receipt), [])

    def test_route_negative_surfaces(self):
        cases = [
            ("EMPTY_ROUTE", RouteDefinition("R", "1", "T", ()), [],
             "EMPTY_REQUIRED_ROUTE"),
            ("DUPLICATE_ROUTE", RouteDefinition("R", "1", "T", ("A", "A")),
             [obs()], "DUPLICATE_REQUIRED_COMPONENT_ID"),
            ("DUPLICATE_OBSERVATION", RouteDefinition("R", "1", "T", ("A",)),
             [obs(), obs(source_receipt_id="R2")], "DUPLICATE_COMPONENT_OBSERVATION"),
            ("UNDECLARED_COMPONENT", RouteDefinition("R", "1", "T", ("A",)),
             [obs(), obs("B")], "UNDECLARED_COMPONENT:B"),
            ("UNREGISTERED_SOURCE", RouteDefinition("R", "1", "T", ("A",)),
             [obs(source_class="anything")], "UNREGISTERED_SOURCE_CLASS:A"),
            ("EMPTY_SOURCE_ID", RouteDefinition("R", "1", "T", ("A",)),
             [obs(source_receipt_id=" ")], "EMPTY_SOURCE_RECEIPT_ID:A"),
            ("NON_BOOLEAN_HARD", RouteDefinition("R", "1", "T", ("A",)),
             [ComponentObservation("A", 0.8, "false", "S", "R")],
             "NON_BOOLEAN_HARD_PASS:A"),
            ("VERSION_MISMATCH", RouteDefinition("R", "1", "T", ("A",)),
             [obs(version="2")], "COMPONENT_VERSION_MISMATCH:A"),
        ]
        for name, route, observations, reason in cases:
            with self.subTest(name=name):
                result = score_required_route(route, observations)
                self.assertEqual(result["state"], "INVALID")
                self.assertIn(reason, result["invalid_reasons"])

    def test_missing_and_precedence_surfaces(self):
        missing = score_required_route(
            RouteDefinition("R", "1", "T", ("A", "B")), [obs("A")]
        )
        self.assertEqual(missing["state"], "UNEVALUABLE")
        self.assertIn("MISSING_REQUIRED_COMPONENT:B", missing["unevaluable_reasons"])

        provenance = score_required_route(
            RouteDefinition("R", "1", "T", ("A",)),
            [ComponentObservation("A", 0.8, True, None, None)],
        )
        self.assertEqual(provenance["state"], "UNEVALUABLE")

        mixed = score_required_route(
            RouteDefinition("R", "1", "T", ("A", "B")),
            [ComponentObservation("A", None, None, None, None, version="wrong")],
        )
        self.assertEqual(mixed["state"], "INVALID")
        self.assertIn("MISSING_REQUIRED_COMPONENT:B", mixed["unevaluable_reasons"])

    def test_numeric_and_tolerance_rejection(self):
        for value in (float("nan"), float("inf"), -0.1, 1.1):
            with self.subTest(value=value):
                result = score_required_route(
                    RouteDefinition("R", "1", "T", ("A",)), [obs(value=value)]
                )
                self.assertEqual(result["state"], "INVALID")
        for tolerance in (-1.0, float("nan"), float("inf")):
            with self.subTest(tolerance=tolerance):
                result = score_required_route(
                    RouteDefinition("R", "1", "T", ("A",), tolerance=tolerance),
                    [obs()],
                )
                self.assertEqual(result["state"], "INVALID")
                self.assertIn("INVALID_TOLERANCE", result["invalid_reasons"])

    def test_mcci_gesi_kernels(self):
        m = mcci()
        g = score_gesi(
            route_id="G", route_version="1",
            factor_ids=("A", "B"),
            observations=(
                VisualObservation("A", 0.9, True, "S", "R1"),
                VisualObservation("B", 0.8, True, "S", "R2"),
            ),
        )
        self.assertEqual(m["instrument_id"], "MCCI")
        self.assertEqual(m["MCCI"], 0.7)
        self.assertTrue(math.isclose(g["GESI"], 0.72))
        self.assertFalse(g["native_verdict_override"])

    def test_series_preserves_invalid_and_unevaluable(self):
        valid = mcci()
        invalid = score_required_route(
            RouteDefinition("R", "1", "T", ("A",)),
            [obs(source_class="bad")],
        )
        summary = summarize_route_series([valid, invalid])
        self.assertEqual(summary["state"], "INVALID")
        self.assertEqual((summary["numeric_count"], summary["invalid_count"]), (1, 1))

        unevaluable = score_required_route(
            RouteDefinition("R", "1", "T", ("A", "B")), [obs("A")]
        )
        summary = summarize_route_series([valid, unevaluable])
        self.assertEqual(summary["state"], "UNEVALUABLE")
        self.assertEqual(summary["unevaluable_count"], 1)

    def test_native_hard_rules_are_explicit(self):
        threshold = adapt_h_earth_receipt(
            {"continuity": 0.01},
            {"AB": NativeFieldRule(
                "continuity", "EXPLICIT_PREDECLARED_THRESHOLD", threshold=0.8
            )},
            route_id="H", route_version="1", source_receipt_id="H1",
        )
        self.assertEqual(threshold["state"], "NUMERIC")
        self.assertFalse(threshold["all_required_relations_pass"])

        unsupported = adapt_h_earth_receipt(
            {"continuity": 0.01}, {"AB": "continuity"},
            route_id="H", route_version="1", source_receipt_id="H2",
        )
        self.assertEqual(unsupported["state"], "INVALID")

    def test_malformed_native_value_is_invalid_not_exception(self):
        result = adapt_compass_receipt(
            {"stability": "not-a-number"},
            {"A": NativeFieldRule("stability", "NO_HARD_GATE")},
            route_id="C", route_version="1", source_receipt_id="C1",
        )
        self.assertEqual(result["state"], "INVALID")
        self.assertTrue(any(
            "MALFORMED_NATIVE_VALUE" in reason
            for reason in result["invalid_reasons"]
        ))

    def test_synthetic_adapter_values_preserved_with_explicit_rules(self):
        h = adapt_h_earth_receipt(
            {
                "a": True, "b": 0.95, "c": 0.90,
                "d": 0.85, "e": 0.80, "f": True,
            },
            {
                "A": "a",
                "B": NativeFieldRule("b", "NO_HARD_GATE"),
                "C": NativeFieldRule("c", "NO_HARD_GATE"),
                "D": NativeFieldRule("d", "NO_HARD_GATE"),
                "E": NativeFieldRule("e", "NO_HARD_GATE"),
                "F": "f",
            },
            route_id="H", route_version="1", source_receipt_id="H-SYNTH",
        )
        c = adapt_compass_receipt(
            {"a": True, "b": True, "c": 0.95, "d": 0.90, "e": True, "f": 0.85},
            {
                "A": "a", "B": "b",
                "C": NativeFieldRule("c", "NO_HARD_GATE"),
                "D": NativeFieldRule("d", "NO_HARD_GATE"),
                "E": "e",
                "F": NativeFieldRule("f", "NO_HARD_GATE"),
            },
            route_id="C", route_version="1", source_receipt_id="C-SYNTH",
        )
        self.assertTrue(math.isclose(h["MCCI"], 0.5814))
        self.assertTrue(math.isclose(c["GESI"], 0.72675))

    def test_identity_safe_theory_support(self):
        receipt = mcci()
        result = evaluate(receipt)
        self.assertEqual(result["state"], "NUMERIC")
        self.assertEqual(
            result["scientific_disposition"], "SUPPORTED_WITHIN_DECLARED_SCOPE"
        )
        self.assertEqual(validate_theory_crosswalk(result), [])

    def test_theory_identity_and_lock_mismatches_are_invalid(self):
        receipt = mcci()
        cases = [
            ({"instrument_id": "GESI"}, "OBSERVED_INSTRUMENT_ID_MISMATCH"),
            ({"route_version": "2"}, "OBSERVED_ROUTE_VERSION_MISMATCH"),
            ({
                "declared_input_receipt_sha256": "d" * 64,
                "data_sha256": "d" * 64,
            }, "DECLARED_INPUT_RECEIPT_SHA256_MISMATCH"),
        ]
        for changes, reason in cases:
            with self.subTest(reason=reason):
                result = evaluate(receipt, study_changes=changes)
                self.assertEqual(result["state"], "INVALID")
                self.assertIn(reason, result["invalid_reasons"])

        result = evaluate(receipt, code_hash="d" * 64)
        self.assertEqual(result["state"], "INVALID")
        self.assertIn("ANALYSIS_CODE_SHA256_MISMATCH", result["invalid_reasons"])

    def test_temporal_priority_rejection(self):
        receipt = mcci()
        for changes in (
            {"analysis_started_at": "2026-08-02T00:00:00"},
            {"analysis_started_at": "not-a-time"},
            {
                "data_locked_at": "2026-08-02T02:00:00Z",
                "analysis_started_at": "2026-08-02T01:00:00Z",
            },
        ):
            with self.subTest(changes=changes):
                self.assertEqual(
                    evaluate(receipt, study_changes=changes)["state"], "INVALID"
                )
        self.assertEqual(
            evaluate(
                receipt,
                theory_changes={"frozen_at": "2026-08-03T00:00:00Z"},
            )["state"],
            "INVALID",
        )

    def test_nonnumeric_receipt_and_comparison_rules_are_invalid(self):
        nonnumeric = score_required_route(
            RouteDefinition(
                "R", "1", "MATHEMATICAL_COMPONENT_CONTINUITY", ("A", "B"),
                instrument_id=MCCI_ID, instrument_version=MCCI_VERSION,
            ),
            [obs("A")],
        )
        result = evaluate(nonnumeric)
        self.assertEqual(result["state"], "INVALID")
        self.assertIn("OBSERVED_RECEIPT_NOT_NUMERIC", result["invalid_reasons"])

        receipt = mcci()
        bad_rules = [
            ComparisonRule("MCCI", "LESS_THAN", float("nan")),
            ComparisonRule("MCCI", "UNKNOWN", 0.8),
            ComparisonRule("MCCI", "BETWEEN", (0.9, 0.1)),
        ]
        for rule in bad_rules:
            with self.subTest(rule=rule):
                result = evaluate(receipt, theory_changes={"prediction": rule})
                self.assertEqual(result["state"], "INVALID")

    def test_hash_tampering_is_invalid(self):
        receipt = mcci()
        receipt["MCCI"] = 0.99
        self.assertFalse(verify_receipt_sha256(receipt))
        result = evaluate(receipt)
        self.assertEqual(result["state"], "INVALID")
        self.assertIn("OBSERVED_RECEIPT_HASH_INVALID", result["invalid_reasons"])

    def test_pointer_and_manifest_integrity(self):
        pointer = json.loads(
            (HERE / "IMI_PACKAGE_POINTER.json").read_text(encoding="utf-8")
        )
        self.assertEqual(pointer["zip_sha256"], APPROVED_IMI_ZIP_SHA256)
        self.assertEqual(verify_imi_package_pointer(pointer), [])
        self.assertEqual(verify_platform_manifest(ROOT), [])

        manifest = json.loads(
            (HERE / "MANIFEST_SHA256.json").read_text(encoding="utf-8")
        )
        self.assertEqual(set(manifest["files"]), EXPECTED_MANIFEST_PATHS)

    def test_manifest_tampering_detected(self):
        with tempfile.TemporaryDirectory() as temp:
            target = Path(temp)
            for relative in EXPECTED_MANIFEST_PATHS:
                destination = target / relative
                destination.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(ROOT / relative, destination)
            manifest_target = target / "research/route-operator-platform-v1/MANIFEST_SHA256.json"
            manifest_target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(HERE / "MANIFEST_SHA256.json", manifest_target)
            readme = target / "research/route-operator-platform-v1/README.md"
            readme.write_text(readme.read_text() + "\ntampered\n")
            self.assertTrue(any(
                item.startswith("MANIFEST_DIGEST_MISMATCH")
                for item in verify_platform_manifest(target)
            ))


if __name__ == "__main__":
    unittest.main()
