import unittest

from fbk_v3_1 import (
    Disposition,
    EvaluationContext,
    GOVERNANCE_PREDICATES,
    KERNEL_VERSION,
    KernelError,
    LifecycleStage,
    RouteClass,
    advance_lifecycle,
    claim_authorized,
    evaluate_closure_suffix,
    evaluate_edge,
    issue_receipt,
)


class FullBirdKernelConformanceTests(unittest.TestCase):
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

    def governance(self, *, object_id="OBJ-1", edge_id="EDGE-1", history_id="HIST-1"):
        receipts = []
        for index, predicate in enumerate(GOVERNANCE_PREDICATES):
            receipts.append(issue_receipt({
                "receipt_id": f"G-{index:02d}",
                "predicate_name": predicate,
                "predicate_value": True,
                "object_id": object_id,
                "scope_id": self.context.scope_id,
                "construct_id": self.context.construct_id,
                "kernel_version": self.context.kernel_version,
                "execution_history_id": history_id,
                "edge_id": edge_id,
                "status": "VERIFIED",
            }))
        return receipts

    def semantic(self, route_class=RouteClass.FORWARD_CANDIDATE, *,
                 object_real=True, object_id="OBJ-1", edge_id="EDGE-1",
                 history_id="HIST-1"):
        return issue_receipt({
            "adjudication_receipt_id": "S-01",
            "object_real": object_real,
            "route_class": route_class.value,
            "object_id": object_id,
            "scope_id": self.context.scope_id,
            "construct_id": self.context.construct_id,
            "kernel_version": self.context.kernel_version,
            "execution_history_id": history_id,
            "edge_id": edge_id,
            "status": "VERIFIED",
        })

    def evaluate(self, **overrides):
        args = dict(
            object_id="OBJ-1",
            origin_id="ORIGIN-1",
            execution_history_id="HIST-1",
            edge_id="EDGE-1",
            source_microstate="00000000",
            target_microstate="11111111",
            m_score=0.75,
            hf_num=False,
            governance_receipts=self.governance(),
            semantic_receipt=self.semantic(),
            context=self.context,
        )
        args.update(overrides)
        return evaluate_edge(**args)

    def test_valid_forward_pass(self):
        record = self.evaluate()
        self.assertEqual(record["disposition"], Disposition.PASS_FORWARD.value)
        self.assertEqual(record["F_score"], 0.75)
        self.assertFalse(record["HFv3"])

    def test_missing_governance_receipt_rejects(self):
        record = self.evaluate(governance_receipts=self.governance()[:-1])
        self.assertEqual(record["disposition"], Disposition.REJECT.value)
        self.assertTrue(record["HFgov"])
        self.assertEqual(record["F_score"], 0.0)

    def test_numeric_pass_does_not_override_semantic_rejection(self):
        record = self.evaluate(semantic_receipt=self.semantic(RouteClass.REJECT_REQUIRED))
        self.assertEqual(record["disposition"], Disposition.REJECT.value)
        self.assertEqual(record["Av3_score"], 0.75)
        self.assertEqual(record["F_score"], 0.0)

    def test_local_repair(self):
        record = self.evaluate(semantic_receipt=self.semantic(RouteClass.LOCAL_REPAIR), m_score=0.6)
        self.assertEqual(record["disposition"], Disposition.CORRECT_AND_RETURN.value)

    def test_underbound_hold(self):
        record = self.evaluate(semantic_receipt=self.semantic(RouteClass.UNDERBOUND), m_score=0.4)
        self.assertEqual(record["disposition"], Disposition.HOLD_IN_MOTION.value)

    def test_wrong_slot_reslots(self):
        record = self.evaluate(semantic_receipt=self.semantic(RouteClass.WRONG_SLOT))
        self.assertEqual(record["disposition"], Disposition.RESLOT_AND_REDIRECT.value)

    def test_missing_semantic_receipt_rejects(self):
        record = self.evaluate(semantic_receipt=None)
        self.assertTrue(record["HFdisp"])
        self.assertEqual(record["disposition"], Disposition.REJECT.value)

    def test_tampered_receipt_rejects(self):
        receipts = self.governance()
        receipts[0] = dict(receipts[0])
        receipts[0]["object_id"] = "OTHER"
        record = self.evaluate(governance_receipts=receipts)
        self.assertTrue(record["HFgov"])
        self.assertEqual(record["disposition"], Disposition.REJECT.value)

    def test_lifecycle_cannot_skip(self):
        with self.assertRaises(KernelError):
            advance_lifecycle(
                LifecycleStage.EXECUTING,
                receipt_type="FINAL_CLOSURE_RECEIPT",
                receipt_valid=True,
            )

    def test_lifecycle_reaches_final_only_in_order(self):
        stage = LifecycleStage.EXECUTING
        stage = advance_lifecycle(stage, receipt_type="GLOCK_QUALIFICATION_RECEIPT", receipt_valid=True)
        stage = advance_lifecycle(stage, receipt_type="PROVISIONAL_SEAL_RECEIPT", receipt_valid=True)
        stage = advance_lifecycle(stage, receipt_type="HOME_RETURN_RECEIPT_v3", receipt_valid=True)
        stage = advance_lifecycle(stage, receipt_type="FINAL_CLOSURE_RECEIPT", receipt_valid=True)
        self.assertEqual(stage, LifecycleStage.FINAL_CLOSED)

    def test_stage_claim_authority(self):
        self.assertTrue(claim_authorized(LifecycleStage.EXECUTING, "NOT_CLOSED"))
        self.assertFalse(claim_authorized(LifecycleStage.EXECUTING, "CLOSED_UNDER_DECLARED_ABSTRACT_SCOPE"))

    def test_valid_closure_suffix_reaches_glock_only(self):
        edge = self.evaluate()
        terminal = {
            "terminal_engine": 15,
            "integrated": True,
            "value_bit": 1,
            "coherence": 0.75,
            "entropy": 0.2,
            "south_score": 0.75,
            "west_score": 0.75,
        }
        result = evaluate_closure_suffix(edge_records=[edge], resolution_receipts=[], terminal=terminal)
        self.assertTrue(result["admissible"])
        self.assertEqual(result["resulting_stage"], LifecycleStage.GLOCK_QUALIFIED.value)

    def test_rejected_history_cannot_close(self):
        rejected = self.evaluate(semantic_receipt=self.semantic(RouteClass.REJECT_REQUIRED))
        terminal = {
            "terminal_engine": 15,
            "integrated": True,
            "value_bit": 1,
            "coherence": 0.75,
            "entropy": 0.2,
            "south_score": 0.75,
            "west_score": 0.75,
        }
        result = evaluate_closure_suffix(
            edge_records=[rejected],
            resolution_receipts=[{"source_edge_id": "EDGE-1", "resolution_status": "TERMINATED"}],
            terminal=terminal,
        )
        self.assertFalse(result["admissible"])
        self.assertTrue(any("rejected history cannot close" in e for e in result["errors"]))


if __name__ == "__main__":
    unittest.main()
