from __future__ import annotations

from pathlib import Path
import sys
import unittest


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from simbench_maps_adapter import (  # noqa: E402
    AdapterError,
    build_maps_input,
    extract_base_state,
    extract_viable_probe,
    physical_failure_probe,
)


class FakeSeries(list):
    def tolist(self):
        return list(self)


class FakeLoc:
    def __init__(self, table):
        self.table = table

    def __getitem__(self, key):
        indices, column = key
        return FakeSeries(self.table.rows[index][column] for index in indices)


class FakeTable:
    def __init__(self, rows):
        self.rows = rows
        self.columns = set(next(iter(rows.values()))) if rows else set()
        self.loc = FakeLoc(self)

    def __getitem__(self, column):
        return FakeSeries(row[column] for row in self.rows.values())


class SimBenchAdapterTests(unittest.TestCase):
    def setUp(self):
        self.net = {
            "res_bus": FakeTable({
                10: {"vm_pu": 1.0, "va_degree": 0.0},
                20: {"vm_pu": 0.99, "va_degree": -4.0},
            }),
            "res_load": FakeTable({
                0: {"p_mw": 60.0},
                1: {"p_mw": 40.0},
            }),
            "res_line": FakeTable({
                0: {"pl_mw": 1.2},
                1: {"pl_mw": 0.8},
            }),
        }

    def test_extracts_already_solved_base_and_viable_probe(self):
        base = extract_base_state(self.net, bus_indices=[10, 20])
        probe = extract_viable_probe(
            self.net,
            probe_id="L10",
            bus_indices=[10, 20],
            served_demand_sources=[("res_load", "p_mw")],
            active_loss_sources=[("res_line", "pl_mw")],
        )
        self.assertEqual(base["angle_degree"], [0.0, -4.0])
        self.assertEqual(probe["served_demand_mw"], 100.0)
        self.assertEqual(probe["active_loss_mw"], 2.0)
        self.assertEqual(probe["status"], "VIABLE")

    def test_missing_frozen_result_source_fails_closed(self):
        with self.assertRaises(AdapterError):
            extract_viable_probe(
                self.net,
                probe_id="L10",
                bus_indices=[10, 20],
                served_demand_sources=[("res_load", "p_mw")],
                active_loss_sources=[("res_trafo", "pl_mw")],
            )

    def test_builds_exact_base_probe_envelope(self):
        base = extract_base_state(self.net, bus_indices=[10, 20])
        envelope = build_maps_input(
            time_index=8,
            bus_ids=["10", "20"],
            phase_reference_bus_id="10",
            expected_probe_ids=["L10", "L20"],
            requested_demand_mw=100.0,
            base_previous=base,
            base_current=base,
            probes_current=[
                physical_failure_probe(probe_id="L10", reason_code="ISLANDING"),
                physical_failure_probe(probe_id="L20", reason_code="THERMAL_LIMIT_EXCEEDED"),
            ],
            source_receipt_digest="d" * 64,
        )
        self.assertEqual(envelope["lane"], "BASE_PROBE_ONLY")
        self.assertEqual(envelope["previous_time_index"], 7)
        self.assertEqual(envelope["provenance"]["source_lanes"], ["BASE", "PROBE"])


if __name__ == "__main__":
    unittest.main()
