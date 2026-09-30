"""Full Bird Kernel v3.2 end-to-end executable reference.

This successor closes two trust gaps from v3.1:
1. M_score and HFnum are derived internally from exactly-eight-bit microstates.
2. lifecycle advancement validates the actual receipt and prior receipt chain;
   no caller-supplied receipt_valid Boolean is accepted.

This is a computational reference. It does not claim empirical, domain, or
autonomous semantic validity.
"""

from __future__ import annotations

from dataclasses import dataclass
from enum import Enum
import hashlib
import itertools
import json
import math
from typing import Any, Iterable, Mapping, Sequence

KERNEL_VERSION = "3.2.0"
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

PHASE_RANK = {
    "collapsed": 0,
    "strained": 1,
    "transitional": 2,
    "coherent": 3,
    "integrated": 4,
}


class KernelError(ValueError):
    """Defined fail-closed validation error."""


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

NEXT_LIFECYCLE = {
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


def canonical_json(value: Any) -> str:
    """Return deterministic UTF-8 JSON text."""
    return json.dumps(
        value,
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=False,
        allow_nan=False,
    )


def canonical_hash(value: Any) -> str:
    return hashlib.sha256(canonical_json(value).encode("utf-8")).hexdigest()


def issue_receipt(
    payload: Mapping[str, Any], *, hash_field: str = "receipt_hash"
) -> dict[str, Any]:
    """Create a deterministic hash-custodied receipt for tests and integrations."""
    record = dict(payload)
    if hash_field in record:
        raise KernelError(f"{hash_field} must not be pre-populated")
    record[hash_field] = canonical_hash(record)
    return record


def verify_record_hash(
    record: Mapping[str, Any], *, hash_field: str = "receipt_hash"
) -> bool:
    if not isinstance(record, Mapping):
        return False
    payload = dict(record)
    supplied = payload.pop(hash_field, None)
    return isinstance(supplied, str) and supplied == canonical_hash(payload)


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


@dataclass(frozen=True)
class LifecycleIdentity:
    object_id: str
    origin_id: str
    scope_id: str
    construct_id: str
    kernel_version: str
    parameter_set_id: str
    execution_history_id: str
    closure_suffix_id: str

    def as_dict(self) -> dict[str, str]:
        return {
            "object_id": self.object_id,
            "origin_id": self.origin_id,
            "scope_id": self.scope_id,
            "construct_id": self.construct_id,
            "kernel_version": self.kernel_version,
            "parameter_set_id": self.parameter_set_id,
            "execution_history_id": self.execution_history_id,
            "closure_suffix_id": self.closure_suffix_id,
        }


def validate_context(context: EvaluationContext) -> None:
    for key, value in context.as_dict().items():
        if not isinstance(value, str) or not value:
            raise KernelError(f"context.{key} must be a non-empty string")
    if context.kernel_version != KERNEL_VERSION:
        raise KernelError(
            f"context.kernel_version must be {KERNEL_VERSION}, got {context.kernel_version}"
        )


def validate_lifecycle_identity(identity: LifecycleIdentity) -> None:
    for key, value in identity.as_dict().items():
        if not isinstance(value, str) or not value:
            raise KernelError(f"lifecycle_identity.{key} must be a non-empty string")
    if identity.kernel_version != KERNEL_VERSION:
        raise KernelError(
            f"lifecycle_identity.kernel_version must be {KERNEL_VERSION}"
        )


def parse_microstate(value: str | Sequence[int]) -> tuple[int, ...]:
    """Parse exactly eight binary bits in E1,E2,E3,I1,I2,I3,V1,V2 order."""
    if isinstance(value, str):
        if len(value) != 8 or any(ch not in "01" for ch in value):
            raise KernelError("microstate string must contain exactly eight binary characters")
        return tuple(int(ch) for ch in value)
    if isinstance(value, Sequence) and not isinstance(value, (bytes, bytearray)):
        bits = tuple(value)
        if len(bits) != 8 or any(type(bit) is not int or bit not in (0, 1) for bit in bits):
            raise KernelError("microstate sequence must contain exactly eight integer bits")
        return bits
    raise KernelError("microstate must be an eight-bit string or integer sequence")


def microstate_text(value: str | Sequence[int]) -> str:
    return "".join(str(bit) for bit in parse_microstate(value))


def binary_entropy(p: float) -> float:
    if p == 0.0 or p == 1.0:
        return 0.0
    if not 0.0 < p < 1.0:
        raise KernelError("binary entropy input must lie in [0,1]")
    return -p * math.log2(p) - (1.0 - p) * math.log2(1.0 - p)


def classify_phase(*, energy: float, coherence: float, entropy: float, value: float) -> str:
    """Apply the canonical total ordered partition."""
    if coherence < (1 / 3) and energy < (1 / 3):
        return "collapsed"
    if coherence < (1 / 3):
        return "strained"
    if coherence < (2 / 3):
        return "transitional"
    if entropy < (1 / 3) and value == 1.0:
        return "integrated"
    return "coherent"


def diagnose_microstate(value: str | Sequence[int]) -> dict[str, Any]:
    bits = parse_microstate(value)
    e1, e2, e3, i1, i2, i3, v1, v2 = bits
    e = (e1 + e2 + e3) / 3
    i = (i1 + i2 + i3) / 3
    v = (v1 + v2) / 2
    en = sum(bits) / 8

    cp = 1.0 - (abs(e - i) + abs(i - v) + abs(e - v)) / 2.0
    cr = (
        (1 - abs(e1 - i1))
        + (1 - abs(e2 - i2))
        + (1 - abs(e3 - i3))
        + (1 - abs(v1 - v2))
    ) / 4.0
    ci = min(i, (e + v) / 2.0)
    ck = min(v, cr)
    coherence = min(cp, cr, ci, ck)
    entropy = (binary_entropy(e) + binary_entropy(i) + binary_entropy(v)) / 3.0
    phase = classify_phase(
        energy=en,
        coherence=coherence,
        entropy=entropy,
        value=v,
    )
    readiness = 0.4 * en + 0.4 * coherence + 0.2 * (1.0 - entropy)

    g1 = int(e >= (2 / 3))
    g2 = int(i >= (2 / 3))
    g3 = int(v == 1.0)
    g4 = int(cr >= (2 / 3))
    engine = 8 * g1 + 4 * g2 + 2 * g3 + g4

    return {
        "microstate": "".join(str(bit) for bit in bits),
        "bits": {
            "E1": e1,
            "E2": e2,
            "E3": e3,
            "I1": i1,
            "I2": i2,
            "I3": i3,
            "V1": v1,
            "V2": v2,
        },
        "e": e,
        "i": i,
        "v": v,
        "En": en,
        "Cp": cp,
        "Cr": cr,
        "Ci": ci,
        "Ck": ck,
        "C": coherence,
        "H": entropy,
        "phase": phase,
        "phase_rank": PHASE_RANK[phase],
        "R": readiness,
        "engine_bits": {"g1": g1, "g2": g2, "g3": g3, "g4": g4},
        "engine": engine,
    }


def hamming_distance(source: str | Sequence[int], target: str | Sequence[int]) -> float:
    x = parse_microstate(source)
    y = parse_microstate(target)
    return sum(int(a != b) for a, b in zip(x, y)) / 8.0


def compute_numeric_transition(
    source: str | Sequence[int],
    target: str | Sequence[int],
) -> dict[str, Any]:
    """Compute N, S, E, W, Mκ, and HFnum from raw microstates."""
    dx = diagnose_microstate(source)
    dy = diagnose_microstate(target)
    d = hamming_distance(source, target)

    north = max(
        0.0,
        1.0
        - d
        - max(0.0, dx["C"] - dy["C"])
        - 0.25 * max(0, dx["phase_rank"] - dy["phase_rank"]),
    )
    south = min(dy["En"], 1.0 - dy["H"])
    east = min(1.0, max(0.0, 0.5 + 0.5 * (dy["R"] - dx["R"])))
    west = min(dy["C"], 1.0 - dy["H"], 1.0 - d / 2.0)
    m_score = min(north, south, east, west)

    numeric_failures: list[str] = []
    if d > (1 / 2):
        numeric_failures.append("HAMMING_DISTANCE_GT_ONE_HALF")
    if dy["C"] < (1 / 3) and dy["H"] > (2 / 3):
        numeric_failures.append("LOW_COHERENCE_HIGH_ENTROPY_TARGET")
    if dx["phase_rank"] - dy["phase_rank"] > 1:
        numeric_failures.append("PHASE_REGRESSION_GT_ONE_LEVEL")

    return {
        "source": dx,
        "target": dy,
        "d": d,
        "N": north,
        "S": south,
        "E": east,
        "W": west,
        "M_score": m_score,
        "HFnum": bool(numeric_failures),
        "numeric_failure_reasons": numeric_failures,
    }


def enumerate_microstates() -> tuple[str, ...]:
    return tuple("".join(map(str, bits)) for bits in itertools.product((0, 1), repeat=8))


def reproduce_numeric_fixture() -> dict[str, Any]:
    phases = {name: 0 for name in PHASE_RANK}
    occupancy = {engine: 0 for engine in range(16)}
    for state in enumerate_microstates():
        diagnostic = diagnose_microstate(state)
        phases[diagnostic["phase"]] += 1
        occupancy[diagnostic["engine"]] += 1
    return {
        "total_states": 256,
        "phase_counts": phases,
        "engine_occupancy": occupancy,
        "unclassified_phase_states": 256 - sum(phases.values()),
        "empty_engine_classes": sum(1 for count in occupancy.values() if count == 0),
    }


def validate_governance_receipts(
    receipts: Sequence[Mapping[str, Any]],
    *,
    object_id: str,
    edge_id: str,
    execution_history_id: str,
    source_microstate: str,
    target_microstate: str,
    context: EvaluationContext,
) -> tuple[dict[str, bool], list[str]]:
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
        "source_microstate",
        "target_microstate",
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
        valid &= receipt.get("source_microstate") == source_microstate
        valid &= receipt.get("target_microstate") == target_microstate
        valid &= receipt.get("status") == "VERIFIED"
        valid &= verify_record_hash(receipt)

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
    source_microstate: str,
    target_microstate: str,
    context: EvaluationContext,
) -> tuple[bool, bool, RouteClass | None, str | None]:
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
        "source_microstate",
        "target_microstate",
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
    valid &= receipt.get("source_microstate") == source_microstate
    valid &= receipt.get("target_microstate") == target_microstate
    valid &= receipt.get("status") == "VERIFIED"
    valid &= verify_record_hash(receipt)

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
    source_microstate: str | Sequence[int],
    target_microstate: str | Sequence[int],
    governance_receipts: Sequence[Mapping[str, Any]],
    semantic_receipt: Mapping[str, Any] | None,
    context: EvaluationContext,
    sequence_index: int = 0,
    prior_edge_hash: str | None = None,
) -> dict[str, Any]:
    """Evaluate one edge with internally derived M_score and HFnum."""
    validate_context(context)
    for name, value in {
        "object_id": object_id,
        "origin_id": origin_id,
        "execution_history_id": execution_history_id,
        "edge_id": edge_id,
    }.items():
        if not isinstance(value, str) or not value:
            raise KernelError(f"{name} must be a non-empty string")
    if not isinstance(sequence_index, int) or sequence_index < 0:
        raise KernelError("sequence_index must be a nonnegative integer")
    if prior_edge_hash is not None and (
        not isinstance(prior_edge_hash, str) or len(prior_edge_hash) != 64
    ):
        raise KernelError("prior_edge_hash must be null or a 64-character hash")

    source_text = microstate_text(source_microstate)
    target_text = microstate_text(target_microstate)
    numeric = compute_numeric_transition(source_text, target_text)

    governance, governance_ids = validate_governance_receipts(
        governance_receipts,
        object_id=object_id,
        edge_id=edge_id,
        execution_history_id=execution_history_id,
        source_microstate=source_text,
        target_microstate=target_text,
        context=context,
    )
    hf_gov = not all(governance.values())

    sem_valid, object_real, route_class, adjudication_receipt_id = validate_semantic_receipt(
        semantic_receipt,
        object_id=object_id,
        edge_id=edge_id,
        execution_history_id=execution_history_id,
        source_microstate=source_text,
        target_microstate=target_text,
        context=context,
    )
    hf_disp = not sem_valid
    hf_num = bool(numeric["HFnum"])
    hf_v3 = bool(hf_num or hf_gov or hf_disp)
    av3 = 0.0 if hf_v3 else float(numeric["M_score"])
    disposition = assign_disposition(
        hf_v3=hf_v3,
        object_real=object_real,
        route_class=route_class,
        av3=av3,
    )
    f_score = av3 if disposition is Disposition.PASS_FORWARD else 0.0

    source_diag = numeric["source"]
    target_diag = numeric["target"]
    record: dict[str, Any] = {
        "record_type": "EXECUTION_EDGE_RECORD",
        "kernel_version": context.kernel_version,
        "object_id": object_id,
        "origin_id": origin_id,
        "execution_history_id": execution_history_id,
        "edge_id": edge_id,
        "context": context.as_dict(),
        "source_microstate": source_text,
        "target_microstate": target_text,
        "source_engine": source_diag["engine"],
        "target_engine": target_diag["engine"],
        "En_source": source_diag["En"],
        "En_target": target_diag["En"],
        "C_source": source_diag["C"],
        "C_target": target_diag["C"],
        "H_source": source_diag["H"],
        "H_target": target_diag["H"],
        "phase_source": source_diag["phase"],
        "phase_target": target_diag["phase"],
        "north_score": numeric["N"],
        "south_score": numeric["S"],
        "east_score": numeric["E"],
        "west_score": numeric["W"],
        "M_score": numeric["M_score"],
        "HFnum": hf_num,
        "numeric_failure_reasons": numeric["numeric_failure_reasons"],
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


def validate_edge_hash(edge: Mapping[str, Any]) -> bool:
    return verify_record_hash(edge, hash_field="edge_hash")


def validate_history_for_closure(
    edge_records: Sequence[Mapping[str, Any]],
    resolution_receipts: Sequence[Mapping[str, Any]],
) -> tuple[bool, list[str]]:
    errors: list[str] = []
    resolution_by_edge: dict[Any, list[Mapping[str, Any]]] = {}
    for resolution in resolution_receipts:
        resolution_by_edge.setdefault(resolution.get("source_edge_id"), []).append(resolution)

    for edge in edge_records:
        try:
            disposition = Disposition(edge["disposition"])
        except (KeyError, ValueError):
            errors.append("invalid edge disposition")
            continue
        if disposition is Disposition.PASS_FORWARD:
            continue

        candidates = resolution_by_edge.get(edge.get("edge_id"), [])
        if len(candidates) != 1:
            errors.append(f"exactly one resolution required for {edge.get('edge_id')}")
            continue
        resolution = candidates[0]
        if not verify_record_hash(resolution):
            errors.append(f"resolution hash invalid for {edge.get('edge_id')}")
            continue
        if resolution.get("execution_history_id") != edge.get("execution_history_id"):
            errors.append(f"resolution history mismatch for {edge.get('edge_id')}")
            continue
        if resolution.get("source_disposition") != disposition.value:
            errors.append(f"resolution disposition mismatch for {edge.get('edge_id')}")
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
) -> dict[str, Any]:
    """Evaluate GLOCK admission from edge records; terminal data is derived."""
    errors: list[str] = []
    if not edge_records:
        errors.append("closure suffix is empty")
        terminal = None
    else:
        terminal = diagnose_microstate(edge_records[-1].get("target_microstate", ""))

    history_ok, history_errors = validate_history_for_closure(
        edge_records, resolution_receipts
    )
    if not history_ok:
        errors.extend(history_errors)

    contexts = {canonical_json(edge.get("context")) for edge in edge_records}
    histories = {edge.get("execution_history_id") for edge in edge_records}
    if len(contexts) != 1:
        errors.append("closure suffix context is not constant")
    if len(histories) != 1:
        errors.append("closure suffix history is not constant")

    prior_hash = None
    for expected_index, edge in enumerate(edge_records):
        if not validate_edge_hash(edge):
            errors.append(f"edge hash mismatch: {edge.get('edge_id')}")
        if edge.get("sequence_index") != expected_index:
            errors.append(f"sequence index mismatch: {edge.get('edge_id')}")
        if edge.get("prior_edge_hash") != prior_hash:
            errors.append(f"prior edge hash mismatch: {edge.get('edge_id')}")
        prior_hash = edge.get("edge_hash")
        if edge.get("disposition") != Disposition.PASS_FORWARD.value:
            errors.append(f"nonforward edge in closure suffix: {edge.get('edge_id')}")
        if float(edge.get("F_score", 0.0)) < (2 / 3):
            errors.append(f"insufficient forward authority: {edge.get('edge_id')}")

    if terminal is not None:
        if terminal["engine"] != 15:
            errors.append("terminal engine is not 15")
        if terminal["C"] < (2 / 3):
            errors.append("terminal coherence below 2/3")
        if terminal["H"] >= (1 / 3):
            errors.append("terminal entropy not below 1/3")
        if terminal["v"] != 1.0:
            errors.append("terminal value is not complete")
        if terminal["phase"] != "integrated":
            errors.append("terminal phase is not integrated")
        if edge_records:
            last = edge_records[-1]
            if float(last.get("south_score", 0.0)) < (2 / 3):
                errors.append("final south score below 2/3")
            if float(last.get("west_score", 0.0)) < (2 / 3):
                errors.append("final west score below 2/3")

    admissible = not errors
    receipt = {
        "record_type": "CLOSURE_SUFFIX_EVALUATION",
        "kernel_version": KERNEL_VERSION,
        "admissible": admissible,
        "errors": errors,
        "edge_ids": [edge.get("edge_id") for edge in edge_records],
        "execution_history_id": (
            edge_records[0].get("execution_history_id") if edge_records else None
        ),
        "terminal_microstate": terminal["microstate"] if terminal else None,
        "terminal_engine": terminal["engine"] if terminal else None,
        "terminal_diagnostics": terminal,
        "resulting_stage": (
            LifecycleStage.GLOCK_QUALIFIED.value
            if admissible
            else LifecycleStage.EXECUTING.value
        ),
    }
    receipt["receipt_hash"] = canonical_hash(receipt)
    return receipt


_COMMON_LIFECYCLE_FIELDS = (
    "record_type",
    "object_id",
    "scope_id",
    "construct_id",
    "kernel_version",
    "execution_history_id",
    "closure_suffix_id",
    "receipt_hash",
)


def _check_identity_fields(
    receipt: Mapping[str, Any],
    identity: LifecycleIdentity,
    *,
    include_origin: bool,
    include_parameter_set: bool,
) -> list[str]:
    errors: list[str] = []
    expected = identity.as_dict()
    fields = [
        "object_id",
        "scope_id",
        "construct_id",
        "kernel_version",
        "execution_history_id",
        "closure_suffix_id",
    ]
    if include_origin:
        fields.append("origin_id")
    if include_parameter_set:
        fields.append("parameter_set_id")
    for field in fields:
        if receipt.get(field) != expected[field]:
            errors.append(f"identity mismatch: {field}")
    return errors


def validate_glock_receipt(
    receipt: Mapping[str, Any],
    *,
    identity: LifecycleIdentity,
    closure_evaluation: Mapping[str, Any],
) -> list[str]:
    errors: list[str] = []
    required = _COMMON_LIFECYCLE_FIELDS + (
        "glock_receipt_id",
        "origin_id",
        "parameter_set_id",
        "closure_suffix_start_edge",
        "closure_suffix_end_edge",
        "micro_edge_ids",
        "terminal_microstate",
        "terminal_engine",
        "terminal_diagnostics",
        "qualification_status",
        "closure_evaluation_hash",
    )
    try:
        _require_fields(receipt, required, "GLOCK receipt")
    except KernelError as exc:
        return [str(exc)]
    if not verify_record_hash(receipt):
        errors.append("GLOCK receipt hash invalid")
    if receipt.get("record_type") != "GLOCK_QUALIFICATION_RECEIPT":
        errors.append("GLOCK record_type invalid")
    errors.extend(
        _check_identity_fields(
            receipt, identity, include_origin=True, include_parameter_set=True
        )
    )
    if receipt.get("qualification_status") != "GLOCK_QUALIFIED_NOT_CLOSED":
        errors.append("GLOCK qualification_status invalid")
    if not closure_evaluation.get("admissible"):
        errors.append("closure evaluation is not admissible")
    if not verify_record_hash(closure_evaluation):
        errors.append("closure evaluation hash invalid")
    if receipt.get("closure_evaluation_hash") != closure_evaluation.get("receipt_hash"):
        errors.append("GLOCK closure evaluation correspondence failed")
    edge_ids = closure_evaluation.get("edge_ids")
    if not isinstance(edge_ids, list) or not edge_ids:
        errors.append("GLOCK edge list is empty")
    else:
        if receipt.get("micro_edge_ids") != edge_ids:
            errors.append("GLOCK micro edge list mismatch")
        if receipt.get("closure_suffix_start_edge") != edge_ids[0]:
            errors.append("GLOCK start edge mismatch")
        if receipt.get("closure_suffix_end_edge") != edge_ids[-1]:
            errors.append("GLOCK end edge mismatch")
    if receipt.get("terminal_microstate") != closure_evaluation.get("terminal_microstate"):
        errors.append("GLOCK terminal microstate mismatch")
    if receipt.get("terminal_engine") != closure_evaluation.get("terminal_engine"):
        errors.append("GLOCK terminal engine mismatch")
    if receipt.get("terminal_diagnostics") != closure_evaluation.get("terminal_diagnostics"):
        errors.append("GLOCK terminal diagnostics mismatch")
    return errors


def validate_provisional_seal_receipt(
    receipt: Mapping[str, Any],
    *,
    identity: LifecycleIdentity,
    glock_receipt: Mapping[str, Any],
) -> list[str]:
    errors: list[str] = []
    required = _COMMON_LIFECYCLE_FIELDS + (
        "seal_receipt_id",
        "glock_receipt_id",
        "map_hash",
        "route_hash",
        "diagnostic_hash",
        "governance_hash",
        "witness_hash",
        "invariant_hash",
        "name",
        "sequence_hash",
        "full_stack_agreement",
        "seal_status",
        "glock_receipt_hash",
    )
    try:
        _require_fields(receipt, required, "provisional seal receipt")
    except KernelError as exc:
        return [str(exc)]
    if not verify_record_hash(receipt):
        errors.append("provisional seal receipt hash invalid")
    if receipt.get("record_type") != "PROVISIONAL_SEAL_RECEIPT":
        errors.append("provisional seal record_type invalid")
    errors.extend(
        _check_identity_fields(
            receipt, identity, include_origin=False, include_parameter_set=False
        )
    )
    if not verify_record_hash(glock_receipt):
        errors.append("referenced GLOCK receipt hash invalid")
    if receipt.get("glock_receipt_id") != glock_receipt.get("glock_receipt_id"):
        errors.append("provisional seal GLOCK id mismatch")
    if receipt.get("glock_receipt_hash") != glock_receipt.get("receipt_hash"):
        errors.append("provisional seal GLOCK hash mismatch")
    if receipt.get("full_stack_agreement") is not True:
        errors.append("provisional seal full_stack_agreement must be true")
    if receipt.get("seal_status") != "PROVISIONALLY_SEALED_NOT_CLOSED":
        errors.append("provisional seal status invalid")
    return errors


def validate_home_return_receipt(
    receipt: Mapping[str, Any],
    *,
    identity: LifecycleIdentity,
    glock_receipt: Mapping[str, Any],
    provisional_seal_receipt: Mapping[str, Any],
) -> list[str]:
    errors: list[str] = []
    required = _COMMON_LIFECYCLE_FIELDS + (
        "home_receipt_id",
        "provisional_seal_receipt_id",
        "glock_receipt_id",
        "origin_id",
        "terminal_microstate",
        "terminal_engine",
        "locked_invariant_hash",
        "returned_invariant_hash",
        "locked_name",
        "returned_name",
        "locked_sequence_hash",
        "returned_sequence_hash",
        "destination_id",
        "owner_choice_preserved",
        "return_status",
        "glock_receipt_hash",
        "provisional_seal_receipt_hash",
    )
    try:
        _require_fields(receipt, required, "HOME return receipt")
    except KernelError as exc:
        return [str(exc)]
    if not verify_record_hash(receipt):
        errors.append("HOME return receipt hash invalid")
    if receipt.get("record_type") != "HOME_RETURN_RECEIPT_v3":
        errors.append("HOME return record_type invalid")
    errors.extend(
        _check_identity_fields(
            receipt, identity, include_origin=True, include_parameter_set=False
        )
    )
    if not verify_record_hash(glock_receipt):
        errors.append("referenced GLOCK receipt hash invalid")
    if not verify_record_hash(provisional_seal_receipt):
        errors.append("referenced provisional seal receipt hash invalid")
    if receipt.get("glock_receipt_id") != glock_receipt.get("glock_receipt_id"):
        errors.append("HOME GLOCK id mismatch")
    if receipt.get("glock_receipt_hash") != glock_receipt.get("receipt_hash"):
        errors.append("HOME GLOCK hash mismatch")
    if (
        receipt.get("provisional_seal_receipt_id")
        != provisional_seal_receipt.get("seal_receipt_id")
    ):
        errors.append("HOME provisional seal id mismatch")
    if (
        receipt.get("provisional_seal_receipt_hash")
        != provisional_seal_receipt.get("receipt_hash")
    ):
        errors.append("HOME provisional seal hash mismatch")
    if receipt.get("terminal_microstate") != glock_receipt.get("terminal_microstate"):
        errors.append("HOME terminal microstate mismatch")
    if receipt.get("terminal_engine") != glock_receipt.get("terminal_engine"):
        errors.append("HOME terminal engine mismatch")
    if receipt.get("locked_invariant_hash") != provisional_seal_receipt.get("invariant_hash"):
        errors.append("HOME locked invariant does not match seal")
    if receipt.get("locked_invariant_hash") != receipt.get("returned_invariant_hash"):
        errors.append("HOME invariant was not preserved")
    if receipt.get("locked_name") != provisional_seal_receipt.get("name"):
        errors.append("HOME locked name does not match seal")
    if receipt.get("locked_name") != receipt.get("returned_name"):
        errors.append("HOME name was not preserved")
    if receipt.get("locked_sequence_hash") != provisional_seal_receipt.get("sequence_hash"):
        errors.append("HOME locked sequence does not match seal")
    if receipt.get("locked_sequence_hash") != receipt.get("returned_sequence_hash"):
        errors.append("HOME sequence was not preserved")
    if receipt.get("owner_choice_preserved") is not True:
        errors.append("HOME owner choice not preserved")
    if receipt.get("return_status") != "RETURNED_WITH_PROVISIONAL_SEAL_PRESERVED":
        errors.append("HOME return status invalid")
    return errors


def validate_final_closure_receipt(
    receipt: Mapping[str, Any],
    *,
    identity: LifecycleIdentity,
    glock_receipt: Mapping[str, Any],
    provisional_seal_receipt: Mapping[str, Any],
    home_receipt: Mapping[str, Any],
) -> list[str]:
    errors: list[str] = []
    required = _COMMON_LIFECYCLE_FIELDS + (
        "final_closure_receipt_id",
        "origin_id",
        "parameter_set_id",
        "glock_receipt_id",
        "provisional_seal_receipt_id",
        "home_receipt_id",
        "terminal_microstate",
        "terminal_engine",
        "terminal_diagnostics_hash",
        "final_south_score",
        "final_west_score",
        "governance_complete",
        "no_unresolved_condition",
        "full_stack_agreement",
        "home_return_verified",
        "owner_choice_preserved",
        "final_status",
        "glock_receipt_hash",
        "provisional_seal_receipt_hash",
        "home_receipt_hash",
    )
    try:
        _require_fields(receipt, required, "final closure receipt")
    except KernelError as exc:
        return [str(exc)]
    if not verify_record_hash(receipt):
        errors.append("final closure receipt hash invalid")
    if receipt.get("record_type") != "FINAL_CLOSURE_RECEIPT":
        errors.append("final closure record_type invalid")
    errors.extend(
        _check_identity_fields(
            receipt, identity, include_origin=True, include_parameter_set=True
        )
    )
    for label, prior in (
        ("GLOCK", glock_receipt),
        ("provisional seal", provisional_seal_receipt),
        ("HOME", home_receipt),
    ):
        if not verify_record_hash(prior):
            errors.append(f"referenced {label} receipt hash invalid")
    expected_refs = {
        "glock_receipt_id": glock_receipt.get("glock_receipt_id"),
        "glock_receipt_hash": glock_receipt.get("receipt_hash"),
        "provisional_seal_receipt_id": provisional_seal_receipt.get("seal_receipt_id"),
        "provisional_seal_receipt_hash": provisional_seal_receipt.get("receipt_hash"),
        "home_receipt_id": home_receipt.get("home_receipt_id"),
        "home_receipt_hash": home_receipt.get("receipt_hash"),
    }
    for field, expected in expected_refs.items():
        if receipt.get(field) != expected:
            errors.append(f"final closure reference mismatch: {field}")
    if receipt.get("terminal_microstate") != glock_receipt.get("terminal_microstate"):
        errors.append("final terminal microstate mismatch")
    if receipt.get("terminal_engine") != glock_receipt.get("terminal_engine"):
        errors.append("final terminal engine mismatch")
    if receipt.get("terminal_diagnostics_hash") != canonical_hash(
        glock_receipt.get("terminal_diagnostics")
    ):
        errors.append("final terminal diagnostics hash mismatch")
    for field in (
        "governance_complete",
        "no_unresolved_condition",
        "full_stack_agreement",
        "home_return_verified",
        "owner_choice_preserved",
    ):
        if receipt.get(field) is not True:
            errors.append(f"final closure {field} must be true")
    if float(receipt.get("final_south_score", 0.0)) < (2 / 3):
        errors.append("final South score below 2/3")
    if float(receipt.get("final_west_score", 0.0)) < (2 / 3):
        errors.append("final West score below 2/3")
    if receipt.get("final_status") != "FINAL_CLOSED":
        errors.append("final status invalid")
    return errors


def validate_lifecycle_receipt(
    *,
    current_stage: LifecycleStage,
    receipt: Mapping[str, Any],
    identity: LifecycleIdentity,
    closure_evaluation: Mapping[str, Any],
    prior_receipts: Sequence[Mapping[str, Any]],
) -> list[str]:
    """Validate the actual stage receipt and all required predecessor custody."""
    validate_lifecycle_identity(identity)
    if current_stage is LifecycleStage.FINAL_CLOSED:
        return ["FINAL_CLOSED is terminal"]

    expected_type, _ = NEXT_LIFECYCLE[current_stage]
    if receipt.get("record_type") != expected_type:
        return [
            f"lifecycle skip or mismatch: expected {expected_type}, "
            f"got {receipt.get('record_type')}"
        ]

    by_type: dict[str, list[Mapping[str, Any]]] = {}
    for prior in prior_receipts:
        by_type.setdefault(str(prior.get("record_type")), []).append(prior)

    if current_stage is LifecycleStage.EXECUTING:
        if prior_receipts:
            return ["GLOCK advancement must not receive prior lifecycle receipts"]
        return validate_glock_receipt(
            receipt, identity=identity, closure_evaluation=closure_evaluation
        )

    glocks = by_type.get("GLOCK_QUALIFICATION_RECEIPT", [])
    if len(glocks) != 1:
        return ["exactly one GLOCK receipt is required"]
    glock = glocks[0]

    if current_stage is LifecycleStage.GLOCK_QUALIFIED:
        if len(prior_receipts) != 1:
            return ["provisional seal requires only one prior GLOCK receipt"]
        glock_errors = validate_glock_receipt(
            glock, identity=identity, closure_evaluation=closure_evaluation
        )
        return glock_errors + validate_provisional_seal_receipt(
            receipt, identity=identity, glock_receipt=glock
        )

    seals = by_type.get("PROVISIONAL_SEAL_RECEIPT", [])
    if len(seals) != 1:
        return ["exactly one provisional seal receipt is required"]
    seal = seals[0]
    seal_errors = validate_provisional_seal_receipt(
        seal, identity=identity, glock_receipt=glock
    )

    if current_stage is LifecycleStage.PROVISIONALLY_SEALED:
        if len(prior_receipts) != 2:
            return ["HOME requires exactly GLOCK and provisional seal receipts"]
        glock_errors = validate_glock_receipt(
            glock, identity=identity, closure_evaluation=closure_evaluation
        )
        return (
            glock_errors
            + seal_errors
            + validate_home_return_receipt(
                receipt,
                identity=identity,
                glock_receipt=glock,
                provisional_seal_receipt=seal,
            )
        )

    homes = by_type.get("HOME_RETURN_RECEIPT_v3", [])
    if len(homes) != 1:
        return ["exactly one HOME return receipt is required"]
    home = homes[0]
    if len(prior_receipts) != 3:
        return ["final closure requires exactly GLOCK, seal, and HOME receipts"]
    glock_errors = validate_glock_receipt(
        glock, identity=identity, closure_evaluation=closure_evaluation
    )
    home_errors = validate_home_return_receipt(
        home,
        identity=identity,
        glock_receipt=glock,
        provisional_seal_receipt=seal,
    )
    return (
        glock_errors
        + seal_errors
        + home_errors
        + validate_final_closure_receipt(
            receipt,
            identity=identity,
            glock_receipt=glock,
            provisional_seal_receipt=seal,
            home_receipt=home,
        )
    )


def advance_lifecycle(
    current_stage: LifecycleStage,
    *,
    receipt: Mapping[str, Any],
    identity: LifecycleIdentity,
    closure_evaluation: Mapping[str, Any],
    prior_receipts: Sequence[Mapping[str, Any]],
) -> LifecycleStage:
    """Advance exactly one stage after validating the actual receipt chain."""
    errors = validate_lifecycle_receipt(
        current_stage=current_stage,
        receipt=receipt,
        identity=identity,
        closure_evaluation=closure_evaluation,
        prior_receipts=prior_receipts,
    )
    if errors:
        raise KernelError("; ".join(errors))
    _, next_stage = NEXT_LIFECYCLE[current_stage]
    return next_stage


def claim_authorized(stage: LifecycleStage, claim: str) -> bool:
    return PERMITTED_STAGE_CLAIMS[stage] == claim
