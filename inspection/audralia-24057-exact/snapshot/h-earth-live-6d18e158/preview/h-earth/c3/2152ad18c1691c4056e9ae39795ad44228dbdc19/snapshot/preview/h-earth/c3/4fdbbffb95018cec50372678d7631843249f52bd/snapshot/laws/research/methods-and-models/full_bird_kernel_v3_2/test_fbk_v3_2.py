import inspect
import unittest

from fbk_v3_2 import (
    Disposition,
    EvaluationContext,
    GOVERNANCE_PREDICATES,
    KERNEL_VERSION,
    KernelError,
    LifecycleIdentity,
    LifecycleStage,
    RouteClass,
    advance_lifecycle,
    canonical_hash,
    claim_authorized,
    compute_numeric_transition,
    enumerate_microstates,
    evaluate_closure_suffix,
    evaluate_edge,
    issue_receipt,
    reproduce_numeric_fixture,
)


class FullBirdKernelV32Tests(unittest.TestCase):
    def setUp(self):
        self.context = EvaluationContext(
            scope_id="SCOPE-1",
            construct_id="CONSTRUCT-1",
            kernel_version=KERNEL_VERSION,
            parameter_set_id="PARAM-1",
            governance_assignment_id="GOV-1",
            semantic_adjudication_assignment_id="SEM-1",
            evidence_window_id="EVID-1",
        )
        self.identity = LifecycleIdentity(
            object_id="OBJ-1",
            origin_id="ORIGIN-1",
            scope_id=self.context.scope_id,
            construct_id=self.context.construct_id,
            kernel_version=KERNEL_VERSION,
            parameter_set_id=self.context.parameter_set_id,
            execution_history_id="HIST-1",
            closure_suffix_id="CLOSE-1",
        )

    def governance(self, source, target, *, edge_id="EDGE-1"):
        return [
            issue_receipt(
                {
                    "receipt_id": f"G-{index:02d}",
                    "predicate_name": predicate,
                    "predicate_value": True,
                    "object_id": "OBJ-1",
                    "scope_id": self.context.scope_id,
                    "construct_id": self.context.construct_id,
                    "kernel_version": KERNEL_VERSION,
                    "execution_history_id": "HIST-1",
                    "edge_id": edge_id,
                    "source_microstate": source,
                    "target_microstate": target,
                    "status": "VERIFIED",
                }
            )
            for index, predicate in enumerate(GOVERNANCE_PREDICATES)
        ]

    def semantic(
        self,
        source,
        target,
        route_class=RouteClass.FORWARD_CANDIDATE,
        *,
        edge_id="EDGE-1",
        object_real=True,
    ):
        return issue_receipt(
            {
                "adjudication_receipt_id": "SEM-REC-1",
                "object_real": object_real,
                "route_class": route_class.value,
                "object_id": "OBJ-1",
                "scope_id": self.context.scope_id,
                "construct_id": self.context.construct_id,
                "kernel_version": KERNEL_VERSION,
                "execution_history_id": "HIST-1",
                "edge_id": edge_id,
                "source_microstate": source,
                "target_microstate": target,
                "status": "VERIFIED",
            }
        )

    def evaluate(self, source="11111100", target="11111111", **overrides):
        edge_id = overrides.pop("edge_id", "EDGE-1")
        args = {
            "object_id": "OBJ-1",
            "origin_id": "ORIGIN-1",
            "execution_history_id": "HIST-1",
            "edge_id": edge_id,
            "source_microstate": source,
            "target_microstate": target,
            "governance_receipts": self.governance(source, target, edge_id=edge_id),
            "semantic_receipt": self.semantic(source, target, edge_id=edge_id),
            "context": self.context,
            "sequence_index": 0,
            "prior_edge_hash": None,
        }
        args.update(overrides)
        return evaluate_edge(**args)

    def closure_and_edge(self):
        edge = self.evaluate()
        closure = evaluate_closure_suffix(edge_records=[edge], resolution_receipts=[])
        self.assertTrue(closure["admissible"], closure["errors"])
        return edge, closure

    def glock(self, closure):
        return issue_receipt(
            {
                "record_type": "GLOCK_QUALIFICATION_RECEIPT",
                **self.identity.as_dict(),
                "glock_receipt_id": "GLOCK-1",
                "closure_suffix_start_edge": closure["edge_ids"][0],
                "closure_suffix_end_edge": closure["edge_ids"][-1],
                "micro_edge_ids": closure["edge_ids"],
                "terminal_microstate": closure["terminal_microstate"],
                "terminal_engine": closure["terminal_engine"],
                "terminal_diagnostics": closure["terminal_diagnostics"],
                "qualification_status": "GLOCK_QUALIFIED_NOT_CLOSED",
                "closure_evaluation_hash": closure["receipt_hash"],
            }
        )

    def seal(self, glock):
        return issue_receipt(
            {
                "record_type": "PROVISIONAL_SEAL_RECEIPT",
                "object_id": self.identity.object_id,
                "scope_id": self.identity.scope_id,
                "construct_id": self.identity.construct_id,
                "kernel_version": KERNEL_VERSION,
                "execution_history_id": self.identity.execution_history_id,
                "closure_suffix_id": self.identity.closure_suffix_id,
                "seal_receipt_id": "SEAL-1",
                "glock_receipt_id": glock["glock_receipt_id"],
                "glock_receipt_hash": glock["receipt_hash"],
                "map_hash": "a" * 64,
                "route_hash": "b" * 64,
                "diagnostic_hash": "c" * 64,
                "governance_hash": "d" * 64,
                "witness_hash": "e" * 64,
                "invariant_hash": "f" * 64,
                "name": "FULL_BIRD_KERNEL_CASE",
                "sequence_hash": "1" * 64,
                "full_stack_agreement": True,
                "seal_status": "PROVISIONALLY_SEALED_NOT_CLOSED",
            }
        )

    def home(self, glock, seal):
        return issue_receipt(
            {
                "record_type": "HOME_RETURN_RECEIPT_v3",
                "object_id": self.identity.object_id,
                "origin_id": self.identity.origin_id,
                "scope_id": self.identity.scope_id,
                "construct_id": self.identity.construct_id,
                "kernel_version": KERNEL_VERSION,
                "execution_history_id": self.identity.execution_history_id,
                "closure_suffix_id": self.identity.closure_suffix_id,
                "home_receipt_id": "HOME-1",
                "provisional_seal_receipt_id": seal["seal_receipt_id"],
                "glock_receipt_id": glock["glock_receipt_id"],
                "terminal_microstate": glock["terminal_microstate"],
                "terminal_engine": glock["terminal_engine"],
                "locked_invariant_hash": seal["invariant_hash"],
                "returned_invariant_hash": seal["invariant_hash"],
                "locked_name": seal["name"],
                "returned_name": seal["name"],
                "locked_sequence_hash": seal["sequence_hash"],
                "returned_sequence_hash": seal["sequence_hash"],
                "destination_id": "HOME",
                "owner_choice_preserved": True,
                "return_status": "RETURNED_WITH_PROVISIONAL_SEAL_PRESERVED",
                "glock_receipt_hash": glock["receipt_hash"],
                "provisional_seal_receipt_hash": seal["receipt_hash"],
            }
        )

    def final(self, edge, glock, seal, home):
        return issue_receipt(
            {
                "record_type": "FINAL_CLOSURE_RECEIPT",
                **self.identity.as_dict(),
                "final_closure_receipt_id": "FINAL-1",
                "glock_receipt_id": glock["glock_receipt_id"],
                "provisional_seal_receipt_id": seal["seal_receipt_id"],
                "home_receipt_id": home["home_receipt_id"],
                "terminal_microstate": glock["terminal_microstate"],
                "terminal_engine": glock["terminal_engine"],
                "terminal_diagnostics_hash": canonical_hash(glock["terminal_diagnostics"]),
                "final_south_score": edge["south_score"],
                "final_west_score": edge["west_score"],
                "governance_complete": True,
                "no_unresolved_condition": True,
                "full_stack_agreement": True,
                "home_return_verified": True,
                "owner_choice_preserved": True,
                "final_status": "FINAL_CLOSED",
                "glock_receipt_hash": glock["receipt_hash"],
                "provisional_seal_receipt_hash": seal["receipt_hash"],
                "home_receipt_hash": home["receipt_hash"],
            }
        )

    def test_phase_counts_reproduced(self):
        fixture = reproduce_numeric_fixture()
        self.assertEqual(
            fixture["phase_counts"],
            {
                "collapsed": 37,
                "strained": 153,
                "transitional": 56,
                "coherent": 3,
                "integrated": 7,
            },
        )
        self.assertEqual(fixture["unclassified_phase_states"], 0)

    def test_engine_occupancy_reproduced(self):
        fixture = reproduce_numeric_fixture()
        self.assertEqual(
            fixture["engine_occupancy"],
            {
                0: 30, 1: 18, 2: 6, 3: 10,
                4: 42, 5: 6, 6: 10, 7: 6,
                8: 42, 9: 6, 10: 10, 11: 6,
                12: 30, 13: 18, 14: 6, 15: 10,
            },
        )
        self.assertEqual(fixture["empty_engine_classes"], 0)

    def test_known_strict_edges_are_reproduced(self):
        fixtures = (
            ("11111100", "11111111", 13, 15, 0.75),
            ("01110111", "11111111", 14, 15, 0.7112197222702993),
            ("01101111", "11111111", 15, 15, 0.677886388936966),
        )
        for source, target, source_engine, target_engine, expected in fixtures:
            with self.subTest(source=source, target=target):
                numeric = compute_numeric_transition(source, target)
                self.assertAlmostEqual(numeric["M_score"], expected)
                self.assertFalse(numeric["HFnum"])
                self.assertEqual(numeric["source"]["engine"], source_engine)
                self.assertEqual(numeric["target"]["engine"], target_engine)

    def test_edge_evaluation_computes_numeric_authority_internally(self):
        signature = inspect.signature(evaluate_edge)
        self.assertNotIn("m_score", signature.parameters)
        self.assertNotIn("hf_num", signature.parameters)
        record = self.evaluate()
        self.assertEqual(record["M_score"], 0.75)
        self.assertFalse(record["HFnum"])
        self.assertEqual(record["disposition"], Disposition.PASS_FORWARD.value)
        self.assertEqual(record["F_score"], 0.75)

    def test_exact_eight_bit_input_is_required(self):
        with self.assertRaises(KernelError):
            compute_numeric_transition("111", "11111111")
        with self.assertRaises(KernelError):
            compute_numeric_transition("1111111x", "11111111")

    def test_numeric_hard_fail_is_derived(self):
        numeric = compute_numeric_transition("00000000", "11111000")
        self.assertTrue(numeric["HFnum"])
        self.assertIn("HAMMING_DISTANCE_GT_ONE_HALF", numeric["numeric_failure_reasons"])

    def test_all_65536_numeric_pairs_are_total(self):
        states = enumerate_microstates()
        count = 0
        for source in states:
            for target in states:
                numeric = compute_numeric_transition(source, target)
                self.assertGreaterEqual(numeric["M_score"], 0.0)
                self.assertLessEqual(numeric["M_score"], 1.0)
                self.assertIsInstance(numeric["HFnum"], bool)
                count += 1
        self.assertEqual(count, 65536)

    def test_closure_terminal_is_derived_from_microstate(self):
        _, closure = self.closure_and_edge()
        self.assertEqual(closure["terminal_microstate"], "11111111")
        self.assertEqual(closure["terminal_engine"], 15)
        self.assertEqual(closure["terminal_diagnostics"]["phase"], "integrated")

    def test_lifecycle_signature_has_no_receipt_valid_boolean(self):
        signature = inspect.signature(advance_lifecycle)
        self.assertNotIn("receipt_valid", signature.parameters)
        self.assertIn("receipt", signature.parameters)

    def test_actual_receipt_chain_reaches_final_in_order(self):
        edge, closure = self.closure_and_edge()
        glock = self.glock(closure)
        seal = self.seal(glock)
        home = self.home(glock, seal)
        final = self.final(edge, glock, seal, home)

        stage = LifecycleStage.EXECUTING
        stage = advance_lifecycle(stage, receipt=glock, identity=self.identity, closure_evaluation=closure, prior_receipts=[])
        stage = advance_lifecycle(stage, receipt=seal, identity=self.identity, closure_evaluation=closure, prior_receipts=[glock])
        stage = advance_lifecycle(stage, receipt=home, identity=self.identity, closure_evaluation=closure, prior_receipts=[glock, seal])
        stage = advance_lifecycle(stage, receipt=final, identity=self.identity, closure_evaluation=closure, prior_receipts=[glock, seal, home])
        self.assertEqual(stage, LifecycleStage.FINAL_CLOSED)

    def test_tampered_lifecycle_receipt_is_blocked(self):
        _, closure = self.closure_and_edge()
        glock = self.glock(closure)
        glock["terminal_engine"] = 14
        with self.assertRaises(KernelError):
            advance_lifecycle(LifecycleStage.EXECUTING, receipt=glock, identity=self.identity, closure_evaluation=closure, prior_receipts=[])

    def test_lifecycle_identity_mismatch_is_blocked(self):
        _, closure = self.closure_and_edge()
        glock = self.glock(closure)
        glock = dict(glock)
        glock.pop("receipt_hash")
        glock["object_id"] = "OTHER"
        glock = issue_receipt(glock)
        with self.assertRaises(KernelError):
            advance_lifecycle(LifecycleStage.EXECUTING, receipt=glock, identity=self.identity, closure_evaluation=closure, prior_receipts=[])

    def test_lifecycle_skip_is_blocked_by_actual_record_type(self):
        _, closure = self.closure_and_edge()
        fake_final = issue_receipt({"record_type": "FINAL_CLOSURE_RECEIPT", **self.identity.as_dict()})
        with self.assertRaises(KernelError):
            advance_lifecycle(LifecycleStage.EXECUTING, receipt=fake_final, identity=self.identity, closure_evaluation=closure, prior_receipts=[])

    def test_home_mismatch_is_blocked(self):
        _, closure = self.closure_and_edge()
        glock = self.glock(closure)
        seal = self.seal(glock)
        home = self.home(glock, seal)
        home = dict(home)
        home.pop("receipt_hash")
        home["returned_name"] = "DRIFTED_NAME"
        home = issue_receipt(home)
        with self.assertRaises(KernelError):
            advance_lifecycle(LifecycleStage.PROVISIONALLY_SEALED, receipt=home, identity=self.identity, closure_evaluation=closure, prior_receipts=[glock, seal])

    def test_final_without_complete_prior_chain_is_blocked(self):
        edge, closure = self.closure_and_edge()
        glock = self.glock(closure)
        seal = self.seal(glock)
        home = self.home(glock, seal)
        final = self.final(edge, glock, seal, home)
        with self.assertRaises(KernelError):
            advance_lifecycle(LifecycleStage.HOME_RETURN_VERIFIED, receipt=final, identity=self.identity, closure_evaluation=closure, prior_receipts=[glock, seal])

    def test_claim_authority_remains_stage_bound(self):
        self.assertTrue(claim_authorized(LifecycleStage.EXECUTING, "NOT_CLOSED"))
        self.assertFalse(claim_authorized(LifecycleStage.EXECUTING, "CLOSED_UNDER_DECLARED_ABSTRACT_SCOPE"))


if __name__ == "__main__":
    unittest.main()
