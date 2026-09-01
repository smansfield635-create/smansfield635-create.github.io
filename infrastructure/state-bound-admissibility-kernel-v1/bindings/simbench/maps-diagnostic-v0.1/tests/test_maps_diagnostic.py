from __future__ import annotations

import copy
import json
import math
from pathlib import Path
import sys
import unittest


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from maps_diagnostic import canonical_json_bytes, compute_from_json_bytes, compute_maps  # noqa: E402


def load_fixture(name: str) -> dict:
    return json.loads((ROOT / "fixtures" / name).read_text(encoding="utf-8"))


def diagnostic_values(output: dict) -> dict[str, float | None]:
    return {key: record["value"] for key, record in output["diagnostics"].items()}


class MapsDiagnosticTests(unittest.TestCase):
    def test_valid_mixed_fixture_has_exact_energy_and_phase(self) -> None:
        payload = load_fixture("valid_mixed.json")
        output = compute_maps(payload)
        self.assertEqual(output["measurement_state"], "VALID")
        e0 = 100.0 / 102.0
        e1 = (99.0 / 100.0) * (99.0 / 102.0)
        e3 = 100.0 / 101.0
        expected_energy = (e0 + e1 + 0.0 + e3) / 4.0
        expected_phase = math.sqrt(2.0 / 3.0) * math.pi / 180.0
        self.assertAlmostEqual(output["diagnostics"]["E_sup"]["value"], expected_energy, places=15)
        self.assertAlmostEqual(output["diagnostics"]["phi_phase"]["value"], expected_phase, places=15)
        self.assertEqual(output["support"], {
            "probe_count": 4,
            "viable_count": 3,
            "physical_failure_count": 1,
            "viable_fraction": 0.75,
        })

    def test_all_component_ranges_hold(self) -> None:
        output = compute_maps(load_fixture("valid_mixed.json"))
        values = diagnostic_values(output)
        self.assertGreaterEqual(values["E_sup"], 0.0)
        self.assertLessEqual(values["E_sup"], 1.0)
        self.assertGreaterEqual(values["C_coh"], 0.0)
        self.assertLessEqual(values["C_coh"], 1.0)
        self.assertGreaterEqual(values["H_ent"], 0.0)
        self.assertLessEqual(values["H_ent"], 1.0)
        self.assertGreaterEqual(values["phi_phase"], 0.0)
        self.assertLessEqual(values["phi_phase"], math.pi)

    def test_noninterpretable_probe_atomically_nulls_bundle(self) -> None:
        output = compute_maps(load_fixture("uninterpretable_probe.json"))
        self.assertEqual(output["measurement_state"], "UNINTERPRETABLE")
        self.assertEqual(output["typed_uninterpretability"]["reason_code"], "NONINTERPRETABLE_SIMULATION_PRESENT")
        self.assertTrue(all(value is None for value in diagnostic_values(output).values()))

    def test_forbidden_challenge_named_field_fails_provenance(self) -> None:
        output = compute_maps(load_fixture("forbidden_challenge_key.json"))
        self.assertEqual(output["measurement_state"], "UNINTERPRETABLE")
        self.assertEqual(output["typed_uninterpretability"]["reason_code"], "PROHIBITED_CHALLENGE_FIELD")
        self.assertEqual(output["typed_uninterpretability"]["category"], "PROVENANCE_INVALID")
        self.assertEqual(output["provenance"]["challenge_field_audit"], "FAIL")

    def test_global_phase_rotation_invariance(self) -> None:
        payload = load_fixture("valid_mixed.json")
        baseline = compute_maps(payload)
        rotated = copy.deepcopy(payload)
        rotated["base_previous"]["angle_degree"] = [value + 17.0 for value in rotated["base_previous"]["angle_degree"]]
        rotated["base_current"]["angle_degree"] = [value + 43.0 for value in rotated["base_current"]["angle_degree"]]
        for index, probe in enumerate(rotated["probes_current"]):
            if probe["status"] == "VIABLE":
                probe["angle_degree"] = [value + 61.0 + index for value in probe["angle_degree"]]
        candidate = compute_maps(rotated)
        self.assertAlmostEqual(candidate["diagnostics"]["C_coh"]["value"], baseline["diagnostics"]["C_coh"]["value"], places=14)
        self.assertAlmostEqual(candidate["diagnostics"]["phi_phase"]["value"], baseline["diagnostics"]["phi_phase"]["value"], places=14)

    def test_uniform_probe_voltage_scaling_does_not_change_coherence(self) -> None:
        payload = load_fixture("valid_mixed.json")
        baseline = compute_maps(payload)
        scaled = copy.deepcopy(payload)
        for probe in scaled["probes_current"]:
            if probe["status"] == "VIABLE":
                probe["voltage_pu"] = [2.5 * value for value in probe["voltage_pu"]]
        candidate = compute_maps(scaled)
        self.assertAlmostEqual(candidate["diagnostics"]["C_coh"]["value"], baseline["diagnostics"]["C_coh"]["value"], places=14)

    def test_entropy_uses_full_probe_count(self) -> None:
        payload = load_fixture("valid_mixed.json")
        equal_viable = {
            "probe_id": "P0",
            "status": "VIABLE",
            "served_demand_mw": 100.0,
            "active_loss_mw": 0.0,
            "voltage_pu": [1.0, 0.995, 0.985],
            "angle_degree": [0.0, -4.0, -9.0],
        }
        payload["probes_current"] = [
            equal_viable,
            {**equal_viable, "probe_id": "P1"},
            {"probe_id": "P2", "status": "PHYSICAL_FAILURE", "reason_code": "ISLANDING"},
            {"probe_id": "P3", "status": "PHYSICAL_FAILURE", "reason_code": "THERMAL_LIMIT_EXCEEDED"},
        ]
        output = compute_maps(payload)
        self.assertEqual(output["measurement_state"], "VALID")
        self.assertAlmostEqual(output["diagnostics"]["H_ent"]["value"], 0.5, places=15)

    def test_all_physical_failures_are_valid_zero_support_not_missing(self) -> None:
        payload = load_fixture("valid_mixed.json")
        payload["probes_current"] = [
            {"probe_id": probe_id, "status": "PHYSICAL_FAILURE", "reason_code": "FROZEN_PHYSICAL_FAILURE"}
            for probe_id in payload["expected_probe_ids"]
        ]
        output = compute_maps(payload)
        self.assertEqual(output["measurement_state"], "VALID")
        self.assertEqual(output["diagnostics"]["E_sup"]["value"], 0.0)
        self.assertEqual(output["diagnostics"]["C_coh"]["value"], 0.0)
        self.assertEqual(output["diagnostics"]["H_ent"]["value"], 0.0)
        self.assertGreater(output["diagnostics"]["phi_phase"]["value"], 0.0)

    def test_reordered_probe_registry_is_uninterpretable(self) -> None:
        payload = load_fixture("valid_mixed.json")
        payload["probes_current"][0], payload["probes_current"][1] = payload["probes_current"][1], payload["probes_current"][0]
        output = compute_maps(payload)
        self.assertEqual(output["typed_uninterpretability"]["reason_code"], "PROBE_REGISTRY_ORDER_MISMATCH")
        self.assertEqual(output["typed_uninterpretability"]["category"], "EXECUTION_IDENTITY_INVALID")

    def test_duplicate_bus_identity_is_uninterpretable(self) -> None:
        payload = load_fixture("valid_mixed.json")
        payload["bus_ids"] = ["B0", "B1", "B1"]
        output = compute_maps(payload)
        self.assertEqual(output["typed_uninterpretability"]["reason_code"], "DUPLICATE_REGISTRY_IDENTITY")

    def test_served_demand_above_request_is_uninterpretable(self) -> None:
        payload = load_fixture("valid_mixed.json")
        payload["probes_current"][0]["served_demand_mw"] = 100.1
        output = compute_maps(payload)
        self.assertEqual(output["typed_uninterpretability"]["reason_code"], "INVALID_SERVED_DEMAND")
        self.assertTrue(all(value is None for value in diagnostic_values(output).values()))

    def test_same_input_bytes_are_deterministic(self) -> None:
        raw = (ROOT / "fixtures" / "valid_mixed.json").read_bytes()
        first = compute_from_json_bytes(raw)
        second = compute_from_json_bytes(raw)
        self.assertEqual(canonical_json_bytes(first), canonical_json_bytes(second))

    def test_schema_artifacts_are_valid_json_and_match_ids(self) -> None:
        input_schema = json.loads((ROOT / "schemas" / "maps_input.schema.json").read_text(encoding="utf-8"))
        output_schema = json.loads((ROOT / "schemas" / "maps_output.schema.json").read_text(encoding="utf-8"))
        self.assertEqual(input_schema["$id"], "MAPS_DIAGNOSTIC_INPUT_v0.1")
        self.assertEqual(output_schema["$id"], "MAPS_DIAGNOSTIC_OUTPUT_v0.1")


if __name__ == "__main__":
    unittest.main()
