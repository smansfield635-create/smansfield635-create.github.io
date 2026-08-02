from __future__ import annotations

from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from enum import Enum
from typing import Any, Iterable, Mapping, Sequence
import hashlib
import json
import math


PLATFORM_ID = "ROUTE_OPERATOR_RESEARCH_PLATFORM_v1"
PLATFORM_VERSION = "1.0.0"
MODE = "READ_ONLY_SHADOW_RESEARCH"
NUMERIC_TOLERANCE = 1e-12
MCCI_VERSION = "1.0.0"
GESI_VERSION = "1.0.0"
EMPIRICAL_ENGINE_VERSION = "1.0.0"
THEORY_REGISTRY_VERSION = "1.0.0"


class State(str, Enum):
    INVALID = "INVALID"
    UNEVALUABLE = "UNEVALUABLE"
    NUMERIC = "NUMERIC"


@dataclass(frozen=True)
class ComponentObservation:
    component_id: str
    value: float | None
    hard_pass: bool | None
    source_class: str | None
    source_receipt_id: str | None
    version: str = "1.0.0"
    present: bool = True
    invalid_reason: str | None = None
    unevaluable_reason: str | None = None


@dataclass(frozen=True)
class RouteDefinition:
    route_id: str
    route_version: str
    construct_id: str
    required_component_ids: tuple[str, ...]
    component_version: str = "1.0.0"
    source_registry_version: str = "1.0.0"
    instrument_version: str = "1.0.0"
    tolerance: float = NUMERIC_TOLERANCE


@dataclass(frozen=True)
class RelationObservation:
    relation_id: str
    continuity: float | None
    contract_pass: bool | None
    source_class: str | None
    source_receipt_id: str | None
    version: str = "1.0.0"
    present: bool = True
    invalid_reason: str | None = None
    unevaluable_reason: str | None = None


@dataclass(frozen=True)
class VisualObservation:
    factor_id: str
    stability: float | None
    invariant_pass: bool | None
    source_class: str | None
    source_receipt_id: str | None
    version: str = "1.0.0"
    present: bool = True
    invalid_reason: str | None = None
    unevaluable_reason: str | None = None


@dataclass(frozen=True)
class ComparisonRule:
    field: str
    operator: str
    expected: float | str | bool | tuple[float, float]


@dataclass(frozen=True)
class TheoryRecord:
    theory_id: str
    theory_version: str
    claim_text: str
    perspective_class: str
    frozen_at: str
    commit_sha: str
    content_sha256: str
    prediction: ComparisonRule
    falsification: ComparisonRule | None = None
    boundary_conditions: tuple[str, ...] = ()

    def receipt(self) -> dict[str, Any]:
        payload = asdict(self)
        payload["theory_registry_version"] = THEORY_REGISTRY_VERSION
        payload["registry_receipt_sha256"] = canonical_sha256(payload)
        return payload


@dataclass(frozen=True)
class StudyIdentity:
    study_id: str
    study_version: str
    instrument_id: str
    instrument_version: str
    route_id: str
    route_version: str
    analysis_plan_version: str
    data_locked_at: str
    data_sha256: str
    analysis_code_sha256: str


def canonical_sha256(value: Mapping[str, Any]) -> str:
    payload = json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def _rehash(receipt: dict[str, Any]) -> dict[str, Any]:
    receipt.pop("receipt_sha256", None)
    receipt["receipt_sha256"] = canonical_sha256(receipt)
    return receipt


def score_required_route(
    route: RouteDefinition,
    observations: Sequence[ComponentObservation],
    *,
    asserted_versions: Mapping[str, str] | None = None,
) -> dict[str, Any]:
    """Construct-neutral product/minimum/conjunction route scorer.

    Enforces INVALID > UNEVALUABLE > NUMERIC, nonempty finite routes,
    unique component identities, source provenance, and version compatibility.
    """
    asserted_versions = asserted_versions or {}
    invalid: list[str] = []
    unevaluable: list[str] = []

    if not route.required_component_ids:
        invalid.append("EMPTY_REQUIRED_ROUTE")
    if len(route.required_component_ids) != len(set(route.required_component_ids)):
        invalid.append("DUPLICATE_REQUIRED_COMPONENT_ID")

    expected_versions = {
        "route_version": route.route_version,
        "component_version": route.component_version,
        "source_registry_version": route.source_registry_version,
        "instrument_version": route.instrument_version,
    }
    for key, expected in expected_versions.items():
        if key in asserted_versions and asserted_versions[key] != expected:
            invalid.append(f"VERSION_MISMATCH:{key}")

    ids = [item.component_id for item in observations]
    if len(ids) != len(set(ids)):
        invalid.append("DUPLICATE_COMPONENT_OBSERVATION")
    by_id = {item.component_id: item for item in observations}
    for observed_id in by_id:
        if observed_id not in route.required_component_ids:
            invalid.append(f"UNDECLARED_COMPONENT:{observed_id}")

    values: dict[str, float] = {}
    hard: dict[str, bool] = {}
    sources: dict[str, dict[str, str]] = {}
    for component_id in route.required_component_ids:
        item = by_id.get(component_id)
        if item is None or not item.present:
            unevaluable.append(f"MISSING_REQUIRED_COMPONENT:{component_id}")
            continue
        if item.invalid_reason:
            invalid.append(f"INVALID_COMPONENT:{component_id}:{item.invalid_reason}")
            continue
        if item.unevaluable_reason:
            unevaluable.append(f"UNEVALUABLE_COMPONENT:{component_id}:{item.unevaluable_reason}")
            continue
        if item.version != route.component_version:
            invalid.append(f"COMPONENT_VERSION_MISMATCH:{component_id}")
            continue
        if item.value is None or item.hard_pass is None:
            unevaluable.append(f"INCOMPLETE_COMPONENT:{component_id}")
            continue
        if item.source_class is None or item.source_receipt_id is None:
            unevaluable.append(f"MISSING_PROVENANCE:{component_id}")
            continue
        try:
            value = float(item.value)
        except (TypeError, ValueError):
            invalid.append(f"NON_NUMERIC_VALUE:{component_id}")
            continue
        if not math.isfinite(value) or value < -route.tolerance or value > 1 + route.tolerance:
            invalid.append(f"VALUE_OUT_OF_RANGE:{component_id}")
            continue
        values[component_id] = min(1.0, max(0.0, value))
        hard[component_id] = bool(item.hard_pass)
        sources[component_id] = {
            "source_class": item.source_class,
            "source_receipt_id": item.source_receipt_id,
        }

    base = {
        "platform_id": PLATFORM_ID,
        "platform_version": PLATFORM_VERSION,
        "mode": MODE,
        "instrument_version": route.instrument_version,
        "construct_id": route.construct_id,
        "route_id": route.route_id,
        "route_version": route.route_version,
        "component_version": route.component_version,
        "source_registry_version": route.source_registry_version,
    }
    if invalid:
        return _rehash({
            **base,
            "state": State.INVALID.value,
            "invalid_reasons": sorted(set(invalid)),
            "unevaluable_reasons": sorted(set(unevaluable)),
        })
    if unevaluable:
        return _rehash({
            **base,
            "state": State.UNEVALUABLE.value,
            "invalid_reasons": [],
            "unevaluable_reasons": sorted(set(unevaluable)),
        })

    ordered = [values[item] for item in route.required_component_ids]
    product = math.prod(ordered)
    minimum = min(ordered)
    conjunction = all(hard[item] for item in route.required_component_ids)
    zero_count = sum(value <= route.tolerance for value in ordered)
    return _rehash({
        **base,
        "state": State.NUMERIC.value,
        "component_values": values,
        "source_provenance": sources,
        "continuous_capacity": product,
        "complementary_severity": 1.0 - product,
        "weakest_component": minimum,
        "hard_conjunction_pass": conjunction,
        "zero_count": zero_count,
        "hard_collapse": zero_count > 0,
    })


def summarize_route_series(receipts: Iterable[Mapping[str, Any]]) -> dict[str, Any]:
    numeric = [item for item in receipts if item.get("state") == State.NUMERIC.value]
    if not numeric:
        return {"state": State.UNEVALUABLE.value, "reason": "NO_NUMERIC_RECEIPTS"}
    capacities = [float(item["continuous_capacity"]) for item in numeric]
    return {
        "state": State.NUMERIC.value,
        "observation_count": len(numeric),
        "capacity_minimum": min(capacities),
        "capacity_maximum": max(capacities),
        "capacity_mean": sum(capacities) / len(capacities),
        "weakest_component_minimum": min(float(item["weakest_component"]) for item in numeric),
        "collapse_proportion": sum(bool(item["hard_collapse"]) for item in numeric) / len(numeric),
        "hard_pass_proportion": sum(bool(item["hard_conjunction_pass"]) for item in numeric) / len(numeric),
    }


def score_mcci(
    *, route_id: str, route_version: str, relation_ids: Sequence[str],
    observations: Sequence[RelationObservation],
) -> dict[str, Any]:
    route = RouteDefinition(
        route_id=route_id,
        route_version=route_version,
        construct_id="MATHEMATICAL_COMPONENT_CONTINUITY",
        required_component_ids=tuple(relation_ids),
        instrument_version=MCCI_VERSION,
    )
    receipt = score_required_route(route, [
        ComponentObservation(
            component_id=item.relation_id,
            value=item.continuity,
            hard_pass=item.contract_pass,
            source_class=item.source_class,
            source_receipt_id=item.source_receipt_id,
            version=item.version,
            present=item.present,
            invalid_reason=item.invalid_reason,
            unevaluable_reason=item.unevaluable_reason,
        ) for item in observations
    ])
    if receipt.get("state") == State.NUMERIC.value:
        receipt["MCCI"] = receipt["continuous_capacity"]
        receipt["MCCI_severity"] = receipt["complementary_severity"]
        receipt["weakest_relation_continuity"] = receipt["weakest_component"]
        receipt["all_required_relations_pass"] = receipt["hard_conjunction_pass"]
    receipt["native_authority_mutation"] = False
    receipt["native_verdict_override"] = False
    return _rehash(receipt)


def score_gesi(
    *, route_id: str, route_version: str, factor_ids: Sequence[str],
    observations: Sequence[VisualObservation],
) -> dict[str, Any]:
    route = RouteDefinition(
        route_id=route_id,
        route_version=route_version,
        construct_id="GRAPHIC_EXPRESSION_STABILITY",
        required_component_ids=tuple(factor_ids),
        instrument_version=GESI_VERSION,
    )
    receipt = score_required_route(route, [
        ComponentObservation(
            component_id=item.factor_id,
            value=item.stability,
            hard_pass=item.invariant_pass,
            source_class=item.source_class,
            source_receipt_id=item.source_receipt_id,
            version=item.version,
            present=item.present,
            invalid_reason=item.invalid_reason,
            unevaluable_reason=item.unevaluable_reason,
        ) for item in observations
    ])
    if receipt.get("state") == State.NUMERIC.value:
        receipt["GESI"] = receipt["continuous_capacity"]
        receipt["GESI_severity"] = receipt["complementary_severity"]
        receipt["weakest_visual_factor"] = receipt["weakest_component"]
        receipt["all_graphic_invariants_pass"] = receipt["hard_conjunction_pass"]
    receipt["difference_is_not_automatically_degradation"] = True
    receipt["native_authority_mutation"] = False
    receipt["native_verdict_override"] = False
    return _rehash(receipt)


def _adapt_native_receipt(
    *, native_receipt: Mapping[str, Any], mapping: Mapping[str, str],
    source_receipt_id: str, observation_kind: str,
) -> list[RelationObservation] | list[VisualObservation]:
    output: list[Any] = []
    for component_id, field in mapping.items():
        if field not in native_receipt:
            common = dict(
                source_class=observation_kind,
                source_receipt_id=source_receipt_id,
                unevaluable_reason=f"NATIVE_FIELD_ABSENT:{field}",
            )
            if observation_kind == "H_EARTH_NATIVE_RECEIPT":
                output.append(RelationObservation(component_id, None, None, **common))
            else:
                output.append(VisualObservation(component_id, None, None, **common))
            continue
        raw = native_receipt[field]
        value = 1.0 if raw is True else 0.0 if raw is False else float(raw)
        hard_pass = bool(raw) if isinstance(raw, bool) else value > 0.0
        if observation_kind == "H_EARTH_NATIVE_RECEIPT":
            output.append(RelationObservation(component_id, value, hard_pass, observation_kind, source_receipt_id))
        else:
            output.append(VisualObservation(component_id, value, hard_pass, observation_kind, source_receipt_id))
    return output


def adapt_h_earth_receipt(
    native_receipt: Mapping[str, Any], mapping: Mapping[str, str], *,
    route_id: str, route_version: str, source_receipt_id: str,
) -> dict[str, Any]:
    receipt = score_mcci(
        route_id=route_id,
        route_version=route_version,
        relation_ids=tuple(mapping.keys()),
        observations=_adapt_native_receipt(
            native_receipt=native_receipt,
            mapping=mapping,
            source_receipt_id=source_receipt_id,
            observation_kind="H_EARTH_NATIVE_RECEIPT",
        ),
    )
    receipt.update({
        "adapter_id": "H_EARTH_MCCI_READ_ONLY_ADAPTER_v1",
        "adapter_version": "1.0.0",
        "integration_mode": MODE,
        "native_receipt_preserved": dict(native_receipt),
    })
    return _rehash(receipt)


def adapt_compass_receipt(
    native_receipt: Mapping[str, Any], mapping: Mapping[str, str], *,
    route_id: str, route_version: str, source_receipt_id: str,
) -> dict[str, Any]:
    receipt = score_gesi(
        route_id=route_id,
        route_version=route_version,
        factor_ids=tuple(mapping.keys()),
        observations=_adapt_native_receipt(
            native_receipt=native_receipt,
            mapping=mapping,
            source_receipt_id=source_receipt_id,
            observation_kind="FOUR_COMPASS_NATIVE_RECEIPT",
        ),
    )
    receipt.update({
        "adapter_id": "FOUR_COMPASS_GESI_READ_ONLY_ADAPTER_v1",
        "adapter_version": "1.0.0",
        "integration_mode": MODE,
        "native_receipt_preserved": dict(native_receipt),
    })
    return _rehash(receipt)


def parse_utc(value: str) -> datetime:
    parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)
    return parsed.astimezone(timezone.utc)


def compare(observed: Mapping[str, Any], rule: ComparisonRule) -> bool | None:
    if rule.field not in observed or observed[rule.field] is None:
        return None
    actual = observed[rule.field]
    expected = rule.expected
    op = rule.operator.upper()
    if op == "EQUAL": return actual == expected
    if op == "NOT_EQUAL": return actual != expected
    if op == "GREATER_THAN": return float(actual) > float(expected)
    if op == "GREATER_OR_EQUAL": return float(actual) >= float(expected)
    if op == "LESS_THAN": return float(actual) < float(expected)
    if op == "LESS_OR_EQUAL": return float(actual) <= float(expected)
    if op == "BETWEEN":
        low, high = expected  # type: ignore[misc]
        return float(low) <= float(actual) <= float(high)
    raise ValueError(f"UNKNOWN_COMPARISON_OPERATOR:{rule.operator}")


def evaluate_theory(
    *, study: StudyIdentity, theory: TheoryRecord, observed: Mapping[str, Any],
    boundary_conditions_met: bool = True,
) -> dict[str, Any]:
    temporal_priority = parse_utc(theory.frozen_at) < parse_utc(study.data_locked_at)
    confirmatory_class = theory.perspective_class in {
        "FORMAL_PREREGISTERED_PREDICTION",
        "PRE_RESULT_THEORETICAL_EXPECTATION",
    }
    prediction_match = compare(observed, theory.prediction)
    falsification_match = compare(observed, theory.falsification) if theory.falsification else False

    if not temporal_priority:
        disposition = "RETROSPECTIVE_OR_INVALID_PRIORITY"
    elif not confirmatory_class:
        disposition = "EXPLORATORY_OR_RETROSPECTIVE_INTERPRETATION"
    elif not boundary_conditions_met:
        disposition = "INCONCLUSIVE_BOUNDARY_CONDITIONS_NOT_MET"
    elif prediction_match is None:
        disposition = "NOT_TESTED_OR_INCONCLUSIVE"
    elif falsification_match is True:
        disposition = "FALSIFIED_UNDER_TESTED_CONDITIONS"
    elif prediction_match is True:
        disposition = "SUPPORTED_WITHIN_DECLARED_SCOPE"
    else:
        disposition = "NOT_SUPPORTED"

    return _rehash({
        "empirical_engine_version": EMPIRICAL_ENGINE_VERSION,
        "study": asdict(study),
        "theory_id": theory.theory_id,
        "theory_version": theory.theory_version,
        "theory_commit_sha": theory.commit_sha,
        "theory_content_sha256": theory.content_sha256,
        "theory_frozen_at": theory.frozen_at,
        "data_locked_at": study.data_locked_at,
        "temporal_priority_valid": temporal_priority,
        "confirmatory_perspective_class": confirmatory_class,
        "prediction_match": prediction_match,
        "falsification_triggered": falsification_match,
        "boundary_conditions_met": boundary_conditions_met,
        "disposition": disposition,
        "observed": dict(observed),
    })


def summarize_study(crosswalks: Sequence[Mapping[str, Any]]) -> dict[str, Any]:
    counts: dict[str, int] = {}
    for item in crosswalks:
        disposition = str(item.get("disposition", "UNKNOWN"))
        counts[disposition] = counts.get(disposition, 0) + 1
    return _rehash({
        "empirical_engine_version": EMPIRICAL_ENGINE_VERSION,
        "crosswalk_count": len(crosswalks),
        "disposition_counts": counts,
    })
