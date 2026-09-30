"""Full Bird Kernel v3.1 canonical reference engine.

Standard-library-only executable reference for the v3 control-layer specification.
This module does not claim empirical or domain validity.
"""

from __future__ import annotations

from dataclasses import dataclass
from enum import Enum
import hashlib
import json
from typing import Any, Iterable, Mapping, Sequence

KERNEL_VERSION = "3.1.0"
HASH_ALGORITHM = "sha256"

GOVERNANCE_PREDICATES = (
    "g_scope",
    "g_class",
    "g_invariant",
    "g_name",
    "g_sequence",
    "g_layer_binding",
    "g_metadata_runtime_separation",
    "g_free_will",
    "g_contradiction_clear",
    "g_illicit_skip_clear",
    "g_semantic_leakage_clear",
    "g_hidden_fail_clear",
    "g_threshold_lock",
    "g_evidence_complete",
    "g_receipt_correspondence",
)


class KernelError(ValueError):
    """Defined validation failure."""


class RouteClass(str, Enum):
    FORWARD_CANDIDATE = "FORWARD_CANDIDATE"
    LOCAL_REPAIR = "LOCAL_REPAIR"
    UNDERBOUND = "UNDERBOUND"
    WRONG_SLOT = "WRONG_SLOT"
    REJECT_REQUIRED = "REJECT_REQUIRED"


class Disposition(str, Enum):
    PASS_FORWARD = "PASS_FORWARD"
    CORRECT_AND_RETURN = "CORRECT_AND_RETURN"
    HOLD_IN_MOTION = "HOLD_IN_MOTION"
    RESLOT_AND_REDIRECT = "RESLOT_AND_REDIRECT"
    REJECT = "REJECT"


class LifecycleStage(str, Enum):
    EXECUTING = "EXECUTING"
    GLOCK_QUALIFIED = "GLOCK_QUALIFIED"
    PROVISIONALLY_SEALED = "PROVISIONALLY_SEALED"
    HOME_RETURN_VERIFIED = "HOME_RETURN_VERIFIED"
    FINAL_CLOSED = "FINAL_CLOSED"


PERMITTED_STAGE_CLAIMS = {
    LifecycleStage.EXECUTING: "NOT_CLOSED",
    LifecycleStage.GLOCK_QUALIFIED: "GLOCK_QUALIFIED_NOT_CLOSED",
    LifecycleStage.PROVISIONALLY_SEALED: "PROVISIONALLY_SEALED_NOT_CLOSED",
    LifecycleStage.HOME_RETURN_VERIFIED: "HOME_RETURN_VERIFIED_FINAL_RECEIPT_PENDING",
    LifecycleStage.FINAL_CLOSED: "CLOSED_UNDER_DECLARED_ABSTRACT_SCOPE",
}


def canonical_json(value: Any) -> str:
    """Return deterministic UTF-8 JSON text for hashing and comparison."""
    return json.dumps(
        value,
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=False,
        allow_nan=False,
    )


def canonical_hash(value: Any) -> str:
    return hashlib.sha256(canonical_json(value).encode("utf-8")).hexdigest()


def _require_fields(record: Mapping[str, Any], fields: Iterable[str], label: str) -> None:
    missing = [field for field in fields if field not in record]
    if missing:
        raise KernelError(f"{label}: missing required fields: {', '.join(missing)}")


@dataclass(frozen=True)
class EvaluationContext:
    scope_id: str
    construct_id: str
    kernel_version: str
    parameter_set_id: str
    governance_assignment_id: str
    semantic_adjudication_assignment_id: str
    evidence_window_id: str

    def as_dict(self) -> dict[str, str]:
        return {
            "scope_id": self.scope_id,
            "construct_id": self.construct_id,
            "kernel_version": self.kernel_version,
            "parameter_set_id": self.parameter_set_id,
            "governance_assignment_id": self.governance_assignment_id,
            "semantic_adjudication_assignment_id": self.semantic_adjudication_assignment_id,
            "evidence_window_id": self.evidence_window_id,
        }


def validate_context(context: EvaluationContext) -> None:
    for key, value in context.as_dict().items():
        if not isinstance(value, str) or not value:
            raise KernelError(f"context.{key} must be a non-empty string")
    if context.kernel_version != KERNEL_VERSION:
        raise KernelError(
            f"context.kernel_version must be {KERNEL_VERSION}, got {context.kernel_version}"
        )


def validate_governance_receipts(
    receipts: Sequence[Mapping[str, Any]],
    *,
    object_id: str,
    edge_id: str,
    execution_history_id: str,
    context: EvaluationContext,
) -> tuple[dict[str, bool], list[str]]:
    """Validate the complete governance assignment.

    Missing, duplicated, mismatched, unverified, false, or hash-invalid
    predicates evaluate as failure.
    """
    by_name: dict[str, Mapping[str, Any]] = {}
    duplicate_names: set[str] = set()
    for receipt in receipts:
        name = str(receipt.get("predicate_name"))
        if name in by_name:
            duplicate_names.add(name)
        else:
            by_name[name] = receipt

    values: dict[str, bool] = {}
    ids: list[str] = []
    required = (
        "receipt_id",
        "predicate_name",
        "predicate_value",
        "object_id",
        "scope_id",
        "construct_id",
        "kernel_version",
        "execution_history_id",
        "edge_id",
        "receipt_hash",
        "status",
    )

    for predicate in GOVERNANCE_PREDICATES:
        receipt = by_name.get(predicate)
        if receipt is None or predicate in duplicate_names:
            values[predicate] = False
            continue
        try:
            _require_fields(receipt, required, f"governance receipt {predicate}")
        except KernelError:
            values[predicate] = False
            continue

        valid = receipt.get("predicate_name") == predicate
        valid &= isinstance(receipt.get("predicate_value"), bool)
        valid &= receipt.get("predicate_value") is True
        valid &= receipt.get("object_id") == object_id
        valid &= receipt.get("scope_id") == context.scope_id
        valid &= receipt.get("construct_id") == context.construct_id
        valid &= receipt.get("kernel_version") == context.kernel_version
        valid &= receipt.get("execution_history_id") == execution_history_id
        valid &= receipt.get("edge_id") == edge_id
        valid &= receipt.get("status") == "VERIFIED"

        supplied_hash = receipt.get("receipt_hash")
        payload = dict(receipt)
        payload.pop("receipt_hash", None)
        valid &= supplied_hash == canonical_hash(payload)

        values[predicate] = bool(valid)
        if valid:
            ids.append(str(receipt["receipt_id"]))

    return values, ids


def validate_semantic_receipt(
    receipt: Mapping[str, Any] | None,
    *,
    object_id: str,
    edge_id: str,
    execution_history_id: str,
    context: EvaluationContext,
) -> tuple[bool, bool, RouteClass | None, str | None]:
    """Return (valid, object_real, route_class, receipt_id)."""
    if receipt is None:
        return False, False, None, None
    required = (
        "adjudication_receipt_id",
        "object_real",
        "route_class",
        "object_id",
        "scope_id",
        "construct_id",
        "kernel_version",
        "execution_history_id",
        "edge_id",
        "receipt_hash",
        "status",
    )
    try:
        _require_fields(receipt, required, "semantic adjudication receipt")
        route_class = RouteClass(receipt["route_class"])
    except (KernelError, ValueError, TypeError):
        return False, False, None, None

    valid = isinstance(receipt.get("object_real"), bool)
    valid &= receipt.get("object_id") == object_id
    valid &= receipt.get("scope_id") == context.scope_id
    valid &= receipt.get("construct_id") == context.construct_id
    valid &= receipt.get("kernel_version") == context.kernel_version
    valid &= receipt.get("execution_history_id") == execution_history_id
    valid &= receipt.get("edge_id") == edge_id
    valid &= receipt.get("status") == "VERIFIED"

    payload = dict(receipt)
    supplied_hash = payload.pop("receipt_hash", None)
    valid &= supplied_hash == canonical_hash(payload)

    return (
        bool(valid),
        bool(receipt.get("object_real")) if valid else False,
        route_class if valid else None,
        str(receipt.get("adjudication_receipt_id")) if valid else None,
    )


def assign_disposition(
    *,
    hf_v3: bool,
    object_real: bool,
    route_class: RouteClass | None,
    av3: float,
) -> Disposition:
    """Apply v3 ordered disposition precedence."""
    if (
        hf_v3
        or not object_real
        or route_class is RouteClass.REJECT_REQUIRED
        or av3 < (1 / 3)
    ):
        return Disposition.REJECT
    if route_class is RouteClass.WRONG_SLOT:
        return Disposition.RESLOT_AND_REDIRECT
    if route_class is RouteClass.LOCAL_REPAIR and av3 >= (1 / 2):
        return Disposition.CORRECT_AND_RETURN
    if route_class is RouteClass.UNDERBOUND and av3 >= (1 / 3):
        return Disposition.HOLD_IN_MOTION
    if route_class is RouteClass.FORWARD_CANDIDATE and av3 >= (2 / 3):
        return Disposition.PASS_FORWARD
    return Disposition.REJECT


def evaluate_edge(
    *,
    object_id: str,
    origin_id: str,
    execution_history_id: str,
    edge_id: str,
    source_microstate: str,
    target_microstate: str,
    m_score: float,
    hf_num: bool,
    governance_receipts: Sequence[Mapping[str, Any]],
    semantic_receipt: Mapping[str, Any] | None,
    context: EvaluationContext,
    sequence_index: int = 0,
    prior_edge_hash: str | None = None,
) -> dict[str, Any]:
    """Evaluate one edge and emit a canonical execution-edge record."""
    validate_context(context)
    identity_values = (
        object_id,
        origin_id,
        execution_history_id,
        edge_id,
        source_microstate,
        target_microstate,
    )
    if not all(isinstance(v, str) and v for v in identity_values):
        raise KernelError("identity and microstate fields must be non-empty strings")
    if isinstance(m_score, bool) or not isinstance(m_score, (int, float)):
        raise KernelError("m_score must be numeric")
    if not 0.0 <= float(m_score) <= 1.0:
        raise KernelError("m_score must be within [0,1]")
    if not isinstance(hf_num, bool):
        raise KernelError("hf_num must be Boolean")
    if not isinstance(sequence_index, int) or sequence_index < 0:
        raise KernelError("sequence_index must be a nonnegative integer")

    governance, governance_ids = validate_governance_receipts(
        governance_receipts,
        object_id=object_id,
        edge_id=edge_id,
        execution_history_id=execution_history_id,
        context=context,
    )
    hf_gov = not all(governance.values())

    sem_valid, object_real, route_class, adjudication_receipt_id = validate_semantic_receipt(
        semantic_receipt,
        object_id=object_id,
        edge_id=edge_id,
        execution_history_id=execution_history_id,
        context=context,
    )
    hf_disp = not sem_valid
    hf_v3 = bool(hf_num or hf_gov or hf_disp)
    av3 = 0.0 if hf_v3 else float(m_score)
    disposition = assign_disposition(
        hf_v3=hf_v3,
        object_real=object_real,
        route_class=route_class,
        av3=av3,
    )
    f_score = av3 if disposition is Disposition.PASS_FORWARD else 0.0

    record: dict[str, Any] = {
        "record_type": "EXECUTION_EDGE_RECORD",
        "kernel_version": context.kernel_version,
        "object_id": object_id,
        "origin_id": origin_id,
        "execution_history_id": execution_history_id,
        "edge_id": edge_id,
        "context": context.as_dict(),
        "source_microstate": source_microstate,
        "target_microstate": target_microstate,
        "M_score": float(m_score),
        "HFnum": hf_num,
        "governance_predicates": governance,
        "governance_receipt_ids": governance_ids,
        "HFgov": hf_gov,
        "adjudication_receipt_id": adjudication_receipt_id,
        "route_class": route_class.value if route_class else None,
        "object_real": object_real,
        "HFdisp": hf_disp,
        "HFv3": hf_v3,
        "Av3_score": av3,
        "disposition": disposition.value,
        "F_score": f_score,
        "sequence_index": sequence_index,
        "prior_edge_hash": prior_edge_hash,
        "status": "EVALUATED",
    }
    record["edge_hash"] = canonical_hash(record)
    return record


def validate_history_for_closure(
    edge_records: Sequence[Mapping[str, Any]],
    resolution_receipts: Sequence[Mapping[str, Any]],
) -> tuple[bool, list[str]]:
    """Check whether prior nonpass history is lawfully resolved."""
    errors: list[str] = []
    resolution_by_edge = {r.get("source_edge_id"): r for r in resolution_receipts}

    for edge in edge_records:
        try:
            disposition = Disposition(edge["disposition"])
        except (KeyError, ValueError):
            errors.append("invalid edge disposition")
            continue
        if disposition is Disposition.PASS_FORWARD:
            continue
        resolution = resolution_by_edge.get(edge.get("edge_id"))
        if not resolution:
            errors.append(f"missing resolution for {edge.get('edge_id')}")
            continue
        status = resolution.get("resolution_status")
        if disposition is Disposition.CORRECT_AND_RETURN:
            if status != "RESOLVED" or not resolution.get("linked_successor_edge_id"):
                errors.append(f"correction unresolved for {edge.get('edge_id')}")
        elif disposition is Disposition.HOLD_IN_MOTION:
            if status not in {"RESOLVED", "DISCHARGED"}:
                errors.append(f"hold unresolved for {edge.get('edge_id')}")
        elif disposition is Disposition.RESLOT_AND_REDIRECT:
            if status != "RESLOTTED":
                errors.append(f"reslot unresolved for {edge.get('edge_id')}")
            elif resolution.get("resulting_history_id") == edge.get("execution_history_id"):
                errors.append(f"reslot reused history for {edge.get('edge_id')}")
        elif disposition is Disposition.REJECT:
            if status != "TERMINATED":
                errors.append(f"rejection not terminated for {edge.get('edge_id')}")
            errors.append(f"rejected history cannot close: {edge.get('execution_history_id')}")

    return not errors, errors


def evaluate_closure_suffix(
    *,
    edge_records: Sequence[Mapping[str, Any]],
    resolution_receipts: Sequence[Mapping[str, Any]],
    terminal: Mapping[str, Any],
) -> dict[str, Any]:
    """Evaluate admission to GLOCK qualification, not final closure."""
    errors: list[str] = []
    if not edge_records:
        errors.append("closure suffix is empty")
    history_ok, history_errors = validate_history_for_closure(
        edge_records, resolution_receipts
    )
    if not history_ok:
        errors.extend(history_errors)

    contexts = {canonical_json(edge.get("context")) for edge in edge_records}
    if len(contexts) != 1:
        errors.append("closure suffix context is not constant")

    for edge in edge_records:
        if edge.get("disposition") != Disposition.PASS_FORWARD.value:
            errors.append(f"nonforward edge in closure suffix: {edge.get('edge_id')}")
        if float(edge.get("F_score", 0.0)) < (2 / 3):
            errors.append(f"insufficient forward authority: {edge.get('edge_id')}")
        expected = dict(edge)
        supplied_hash = expected.pop("edge_hash", None)
        if supplied_hash != canonical_hash(expected):
            errors.append(f"edge hash mismatch: {edge.get('edge_id')}")

    terminal_required = {
        "terminal_engine": 15,
        "integrated": True,
        "value_bit": 1,
    }
    for key, required_value in terminal_required.items():
        if terminal.get(key) != required_value:
            errors.append(f"terminal condition failed: {key}")
    if float(terminal.get("coherence", 0.0)) < (2 / 3):
        errors.append("terminal coherence below 2/3")
    if float(terminal.get("entropy", 1.0)) >= (1 / 3):
        errors.append("terminal entropy not below 1/3")
    if float(terminal.get("south_score", 0.0)) < (2 / 3):
        errors.append("final south score below 2/3")
    if float(terminal.get("west_score", 0.0)) < (2 / 3):
        errors.append("final west score below 2/3")

    admissible = not errors
    receipt = {
        "record_type": "CLOSURE_SUFFIX_EVALUATION",
        "kernel_version": KERNEL_VERSION,
        "admissible": admissible,
        "errors": errors,
        "edge_ids": [edge.get("edge_id") for edge in edge_records],
        "terminal": dict(terminal),
        "resulting_stage": (
            LifecycleStage.GLOCK_QUALIFIED.value
            if admissible
            else LifecycleStage.EXECUTING.value
        ),
    }
    receipt["receipt_hash"] = canonical_hash(receipt)
    return receipt


def advance_lifecycle(
    current: LifecycleStage,
    *,
    receipt_type: str,
    receipt_valid: bool,
) -> LifecycleStage:
    """Advance exactly one lifecycle edge; skips and reversals are rejected."""
    if not receipt_valid:
        raise KernelError("invalid lifecycle receipt")
    expected = {
        LifecycleStage.EXECUTING: (
            "GLOCK_QUALIFICATION_RECEIPT",
            LifecycleStage.GLOCK_QUALIFIED,
        ),
        LifecycleStage.GLOCK_QUALIFIED: (
            "PROVISIONAL_SEAL_RECEIPT",
            LifecycleStage.PROVISIONALLY_SEALED,
        ),
        LifecycleStage.PROVISIONALLY_SEALED: (
            "HOME_RETURN_RECEIPT_v3",
            LifecycleStage.HOME_RETURN_VERIFIED,
        ),
        LifecycleStage.HOME_RETURN_VERIFIED: (
            "FINAL_CLOSURE_RECEIPT",
            LifecycleStage.FINAL_CLOSED,
        ),
    }
    if current is LifecycleStage.FINAL_CLOSED:
        raise KernelError("FINAL_CLOSED is terminal")
    required_type, next_stage = expected[current]
    if receipt_type != required_type:
        raise KernelError(
            f"lifecycle skip or mismatch: expected {required_type}, got {receipt_type}"
        )
    return next_stage


def claim_authorized(stage: LifecycleStage, claim: str) -> bool:
    return PERMITTED_STAGE_CLAIMS[stage] == claim


def issue_receipt(payload: Mapping[str, Any], *, hash_field: str = "receipt_hash") -> dict[str, Any]:
    """Create a deterministic receipt used by fixtures and integrations."""
    record = dict(payload)
    if hash_field in record:
        raise KernelError(f"{hash_field} must not be pre-populated")
    record[hash_field] = canonical_hash(record)
    return record
