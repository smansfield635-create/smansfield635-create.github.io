from __future__ import annotations

from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from enum import Enum
from pathlib import Path
from typing import Any, Iterable, Mapping, Sequence
import hashlib
import json
import math
import re


PLATFORM_ID = "ROUTE_OPERATOR_RESEARCH_PLATFORM_v1"
PLATFORM_VERSION = "1.0.0"
MODE = "READ_ONLY_SHADOW_RESEARCH"
RELEASE_CLASS = "PLATFORM_CORE_WITH_EXTERNAL_FROZEN_IMI_AUTHORITY"
NUMERIC_TOLERANCE = 1e-12
MCCI_ID = "MCCI"
MCCI_VERSION = "1.0.0"
GESI_ID = "GESI"
GESI_VERSION = "1.0.0"
EMPIRICAL_ENGINE_VERSION = "1.0.0"
THEORY_REGISTRY_VERSION = "1.0.0"
SOURCE_REGISTRY_VERSION = "1.0.0"
APPROVED_IMI_ZIP_SHA256 = (
    "0be0608fa9aab10d75eeba796530421e96efc7829364172e52f7925ca74d9c87"
)

REGISTERED_SOURCE_CLASSES = frozenset({
    "S",
    "SYNTHETIC_FIXTURE",
    "H_EARTH_NATIVE_RECEIPT",
    "FOUR_COMPASS_NATIVE_RECEIPT",
})

REGISTERED_HARD_RULE_FUNCTIONS = frozenset({
    "VALUE_EQUALS_ONE",
    "VALUE_AT_LEAST_HALF",
})

EXPECTED_MANIFEST_PATHS = frozenset({
    ".github/workflows/route-operator-platform-v1-conformance.yml",
    "research/route-operator-platform-v1/ARCHITECTURE.md",
    "research/route-operator-platform-v1/IMI_PACKAGE_POINTER.json",
    "research/route-operator-platform-v1/PLATFORM_AUTHORITY.json",
    "research/route-operator-platform-v1/README.md",
    "research/route-operator-platform-v1/demo_route_operator_platform_v1.py",
    "research/route-operator-platform-v1/route_operator_platform_v1.py",
    "research/route-operator-platform-v1/test_route_operator_platform_v1.py",
})

_SHA256_RE = re.compile(r"^[0-9a-f]{64}$")


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
    instrument_id: str = "GENERIC_ROUTE_OPERATOR"
    component_version: str = "1.0.0"
    source_registry_version: str = SOURCE_REGISTRY_VERSION
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
class NativeFieldRule:
    value_field: str
    hard_rule: str
    hard_field: str | None = None
    threshold: float | None = None
    hard_rule_function_id: str | None = None


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
    analysis_started_at: str
    analysis_completed_at: str
    declared_input_receipt_sha256: str
    data_sha256: str
    analysis_code_sha256: str
    data_lock_mode: str = "RECEIPT_SHA256"
    data_pointer: str | None = None


def canonical_json(value: Any) -> str:
    return json.dumps(
        value,
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=False,
        allow_nan=False,
    )


def canonical_sha256(value: Any) -> str:
    return hashlib.sha256(canonical_json(value).encode("utf-8")).hexdigest()


def file_sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def is_sha256(value: Any) -> bool:
    return isinstance(value, str) and bool(_SHA256_RE.fullmatch(value))


def _nonempty_string(value: Any) -> bool:
    return isinstance(value, str) and bool(value.strip())


def _rehash(receipt: dict[str, Any]) -> dict[str, Any]:
    receipt.pop("receipt_sha256", None)
    receipt["receipt_sha256"] = canonical_sha256(receipt)
    return receipt


def verify_receipt_sha256(receipt: Mapping[str, Any]) -> bool:
    digest = receipt.get("receipt_sha256")
    if not is_sha256(digest):
        return False
    unhashed = dict(receipt)
    unhashed.pop("receipt_sha256", None)
    try:
        return digest == canonical_sha256(unhashed)
    except (TypeError, ValueError):
        return False


def score_required_route(
    route: RouteDefinition,
    observations: Sequence[ComponentObservation],
    *,
    asserted_versions: Mapping[str, str] | None = None,
) -> dict[str, Any]:
    """Score one frozen required route with strict state precedence.

    INVALID > UNEVALUABLE > NUMERIC is enforced at both snapshot and series
    levels. No value, source class, Boolean, identifier, or tolerance is
    silently coerced into admissibility.
    """
    asserted_versions = asserted_versions or {}
    invalid: list[str] = []
    unevaluable: list[str] = []

    if not _nonempty_string(route.route_id):
        invalid.append("EMPTY_ROUTE_ID")
    if not _nonempty_string(route.route_version):
        invalid.append("EMPTY_ROUTE_VERSION")
    if not _nonempty_string(route.construct_id):
        invalid.append("EMPTY_CONSTRUCT_ID")
    if not _nonempty_string(route.instrument_id):
        invalid.append("EMPTY_INSTRUMENT_ID")
    if not _nonempty_string(route.instrument_version):
        invalid.append("EMPTY_INSTRUMENT_VERSION")
    if not route.required_component_ids:
        invalid.append("EMPTY_REQUIRED_ROUTE")
    if any(not _nonempty_string(item) for item in route.required_component_ids):
        invalid.append("EMPTY_REQUIRED_COMPONENT_ID")
    if len(route.required_component_ids) != len(set(route.required_component_ids)):
        invalid.append("DUPLICATE_REQUIRED_COMPONENT_ID")

    tolerance_valid = (
        isinstance(route.tolerance, (int, float))
        and not isinstance(route.tolerance, bool)
        and math.isfinite(float(route.tolerance))
        and float(route.tolerance) >= 0.0
    )
    if not tolerance_valid:
        invalid.append("INVALID_TOLERANCE")
    tolerance = float(route.tolerance) if tolerance_valid else NUMERIC_TOLERANCE

    if route.source_registry_version != SOURCE_REGISTRY_VERSION:
        invalid.append("SOURCE_REGISTRY_VERSION_MISMATCH")

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
    for observed_id in ids:
        if not _nonempty_string(observed_id):
            invalid.append("EMPTY_OBSERVED_COMPONENT_ID")
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
            unevaluable.append(
                f"UNEVALUABLE_COMPONENT:{component_id}:{item.unevaluable_reason}"
            )
            continue
        if item.version != route.component_version:
            invalid.append(f"COMPONENT_VERSION_MISMATCH:{component_id}")
            continue
        if item.value is None or item.hard_pass is None:
            unevaluable.append(f"INCOMPLETE_COMPONENT:{component_id}")
            continue
        if type(item.hard_pass) is not bool:
            invalid.append(f"NON_BOOLEAN_HARD_PASS:{component_id}")
            continue
        if not _nonempty_string(item.source_class):
            unevaluable.append(f"MISSING_SOURCE_CLASS:{component_id}")
            continue
        if item.source_class not in REGISTERED_SOURCE_CLASSES:
            invalid.append(f"UNREGISTERED_SOURCE_CLASS:{component_id}")
            continue
        if item.source_receipt_id is None:
            unevaluable.append(f"MISSING_SOURCE_RECEIPT_ID:{component_id}")
            continue
        if not _nonempty_string(item.source_receipt_id):
            invalid.append(f"EMPTY_SOURCE_RECEIPT_ID:{component_id}")
            continue
        if isinstance(item.value, bool):
            invalid.append(f"BOOLEAN_VALUE_NOT_NUMERIC:{component_id}")
            continue
        try:
            value = float(item.value)
        except (TypeError, ValueError):
            invalid.append(f"NON_NUMERIC_VALUE:{component_id}")
            continue
        if not math.isfinite(value) or value < -tolerance or value > 1 + tolerance:
            invalid.append(f"VALUE_OUT_OF_RANGE:{component_id}")
            continue
        values[component_id] = min(1.0, max(0.0, value))
        hard[component_id] = item.hard_pass
        sources[component_id] = {
            "source_class": item.source_class,
            "source_receipt_id": item.source_receipt_id.strip(),
        }

    base = {
        "platform_id": PLATFORM_ID,
        "platform_version": PLATFORM_VERSION,
        "release_class": RELEASE_CLASS,
        "mode": MODE,
        "instrument_id": route.instrument_id,
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
    zero_count = sum(value <= tolerance for value in ordered)
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


def _receipt_identity(receipt: Mapping[str, Any], index: int) -> str:
    value = receipt.get("receipt_sha256")
    return value if is_sha256(value) else f"SERIES_INDEX_{index}"


def summarize_route_series(
    receipts: Iterable[Mapping[str, Any]],
    *,
    aggregation_policy: str = "BLOCK_ON_INVALID_OR_UNEVALUABLE",
) -> dict[str, Any]:
    items = list(receipts)
    counts = {
        State.NUMERIC.value: 0,
        State.INVALID.value: 0,
        State.UNEVALUABLE.value: 0,
    }
    exclusions: list[dict[str, Any]] = []
    numeric: list[Mapping[str, Any]] = []
    contaminated_invalid = False
    contaminated_unevaluable = False

    for index, item in enumerate(items):
        state = item.get("state")
        receipt_id = _receipt_identity(item, index)
        if not verify_receipt_sha256(item):
            counts[State.INVALID.value] += 1
            contaminated_invalid = True
            exclusions.append({
                "receipt_id": receipt_id,
                "state": State.INVALID.value,
                "reasons": ["RECEIPT_HASH_INVALID"],
            })
            continue
        if state == State.NUMERIC.value:
            counts[State.NUMERIC.value] += 1
            numeric.append(item)
        elif state == State.INVALID.value:
            counts[State.INVALID.value] += 1
            contaminated_invalid = True
            exclusions.append({
                "receipt_id": receipt_id,
                "state": State.INVALID.value,
                "reasons": list(item.get("invalid_reasons", ["INVALID_RECEIPT"])),
            })
        elif state == State.UNEVALUABLE.value:
            counts[State.UNEVALUABLE.value] += 1
            contaminated_unevaluable = True
            exclusions.append({
                "receipt_id": receipt_id,
                "state": State.UNEVALUABLE.value,
                "reasons": list(
                    item.get("unevaluable_reasons", ["UNEVALUABLE_RECEIPT"])
                ),
            })
        else:
            counts[State.INVALID.value] += 1
            contaminated_invalid = True
            exclusions.append({
                "receipt_id": receipt_id,
                "state": State.INVALID.value,
                "reasons": ["UNKNOWN_RECEIPT_STATE"],
            })

    base = {
        "platform_id": PLATFORM_ID,
        "platform_version": PLATFORM_VERSION,
        "aggregation_policy": aggregation_policy,
        "total_receipt_count": len(items),
        "numeric_count": counts[State.NUMERIC.value],
        "invalid_count": counts[State.INVALID.value],
        "unevaluable_count": counts[State.UNEVALUABLE.value],
        "excluded_receipt_ids": [item["receipt_id"] for item in exclusions],
        "exclusion_reasons": exclusions,
    }

    if aggregation_policy != "BLOCK_ON_INVALID_OR_UNEVALUABLE":
        return _rehash({
            **base,
            "state": State.INVALID.value,
            "invalid_reasons": ["UNKNOWN_AGGREGATION_POLICY"],
        })
    if contaminated_invalid:
        return _rehash({
            **base,
            "state": State.INVALID.value,
            "invalid_reasons": ["SERIES_CONTAINS_INVALID_RECEIPT"],
        })
    if contaminated_unevaluable:
        return _rehash({
            **base,
            "state": State.UNEVALUABLE.value,
            "unevaluable_reasons": ["SERIES_CONTAINS_UNEVALUABLE_RECEIPT"],
        })
    if not numeric:
        return _rehash({
            **base,
            "state": State.UNEVALUABLE.value,
            "unevaluable_reasons": ["NO_NUMERIC_RECEIPTS"],
        })

    capacities = [float(item["continuous_capacity"]) for item in numeric]
    return _rehash({
        **base,
        "state": State.NUMERIC.value,
        "capacity_minimum": min(capacities),
        "capacity_maximum": max(capacities),
        "capacity_mean": sum(capacities) / len(capacities),
        "weakest_component_minimum": min(
            float(item["weakest_component"]) for item in numeric
        ),
        "collapse_proportion": (
            sum(bool(item["hard_collapse"]) for item in numeric) / len(numeric)
        ),
        "hard_pass_proportion": (
            sum(bool(item["hard_conjunction_pass"]) for item in numeric)
            / len(numeric)
        ),
    })


def score_mcci(
    *,
    route_id: str,
    route_version: str,
    relation_ids: Sequence[str],
    observations: Sequence[RelationObservation],
) -> dict[str, Any]:
    route = RouteDefinition(
        route_id=route_id,
        route_version=route_version,
        construct_id="MATHEMATICAL_COMPONENT_CONTINUITY",
        required_component_ids=tuple(relation_ids),
        instrument_id=MCCI_ID,
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
        )
        for item in observations
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
    *,
    route_id: str,
    route_version: str,
    factor_ids: Sequence[str],
    observations: Sequence[VisualObservation],
) -> dict[str, Any]:
    route = RouteDefinition(
        route_id=route_id,
        route_version=route_version,
        construct_id="GRAPHIC_EXPRESSION_STABILITY",
        required_component_ids=tuple(factor_ids),
        instrument_id=GESI_ID,
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
        )
        for item in observations
    ])
    if receipt.get("state") == State.NUMERIC.value:
        receipt["GESI"] = receipt["continuous_capacity"]
        receipt["GESI_severity"] = receipt["complementary_severity"]
        receipt["weakest_visual_factor"] = receipt["weakest_component"]
        receipt["all_graphic_invariants_pass"] = receipt[
            "hard_conjunction_pass"
        ]
    receipt["difference_is_not_automatically_degradation"] = True
    receipt["native_authority_mutation"] = False
    receipt["native_verdict_override"] = False
    return _rehash(receipt)


def _normalize_native_rule(
    rule: str | Mapping[str, Any] | NativeFieldRule,
) -> NativeFieldRule:
    if isinstance(rule, NativeFieldRule):
        return rule
    if isinstance(rule, str):
        return NativeFieldRule(
            value_field=rule,
            hard_rule="EXPLICIT_NATIVE_BOOLEAN_FIELD",
        )
    if not isinstance(rule, Mapping):
        raise ValueError("MALFORMED_NATIVE_MAPPING_RULE")
    return NativeFieldRule(
        value_field=str(rule.get("value_field", "")),
        hard_rule=str(rule.get("hard_rule", "")),
        hard_field=(
            str(rule["hard_field"]) if rule.get("hard_field") is not None else None
        ),
        threshold=rule.get("threshold"),
        hard_rule_function_id=(
            str(rule["hard_rule_function_id"])
            if rule.get("hard_rule_function_id") is not None
            else None
        ),
    )


def _native_numeric(raw: Any) -> float:
    if isinstance(raw, bool):
        return 1.0 if raw else 0.0
    if not isinstance(raw, (int, float)) or not math.isfinite(float(raw)):
        raise ValueError("MALFORMED_NATIVE_VALUE")
    value = float(raw)
    if value < 0.0 or value > 1.0:
        raise ValueError("NATIVE_VALUE_OUT_OF_RANGE")
    return value


def _apply_hard_rule(
    *,
    native_receipt: Mapping[str, Any],
    rule: NativeFieldRule,
    value: float,
) -> bool:
    kind = rule.hard_rule.upper()
    if kind == "EXPLICIT_NATIVE_BOOLEAN_FIELD":
        field = rule.hard_field or rule.value_field
        if field not in native_receipt:
            raise KeyError(f"NATIVE_HARD_FIELD_ABSENT:{field}")
        raw = native_receipt[field]
        if type(raw) is not bool:
            raise ValueError(f"NATIVE_HARD_FIELD_NOT_BOOLEAN:{field}")
        return raw
    if kind == "EXPLICIT_PREDECLARED_THRESHOLD":
        threshold = rule.threshold
        if (
            not isinstance(threshold, (int, float))
            or isinstance(threshold, bool)
            or not math.isfinite(float(threshold))
            or float(threshold) < 0.0
            or float(threshold) > 1.0
        ):
            raise ValueError("INVALID_NATIVE_HARD_THRESHOLD")
        return value >= float(threshold)
    if kind == "EXPLICIT_HARD_RULE_FUNCTION_ID":
        function_id = rule.hard_rule_function_id
        if function_id not in REGISTERED_HARD_RULE_FUNCTIONS:
            raise ValueError("UNREGISTERED_HARD_RULE_FUNCTION_ID")
        if function_id == "VALUE_EQUALS_ONE":
            return math.isclose(value, 1.0, abs_tol=NUMERIC_TOLERANCE)
        if function_id == "VALUE_AT_LEAST_HALF":
            return value >= 0.5
    if kind == "NO_HARD_GATE":
        return True
    raise ValueError("UNKNOWN_NATIVE_HARD_RULE")


def _invalid_native_observation(
    *,
    component_id: str,
    source_class: str,
    source_receipt_id: str,
    reason: str,
    observation_kind: str,
) -> RelationObservation | VisualObservation:
    kwargs = dict(
        source_class=source_class,
        source_receipt_id=source_receipt_id,
        invalid_reason=reason,
    )
    if observation_kind == "H_EARTH_NATIVE_RECEIPT":
        return RelationObservation(component_id, None, None, **kwargs)
    return VisualObservation(component_id, None, None, **kwargs)


def _unevaluable_native_observation(
    *,
    component_id: str,
    source_class: str,
    source_receipt_id: str,
    reason: str,
    observation_kind: str,
) -> RelationObservation | VisualObservation:
    kwargs = dict(
        source_class=source_class,
        source_receipt_id=source_receipt_id,
        unevaluable_reason=reason,
    )
    if observation_kind == "H_EARTH_NATIVE_RECEIPT":
        return RelationObservation(component_id, None, None, **kwargs)
    return VisualObservation(component_id, None, None, **kwargs)


def _adapt_native_receipt(
    *,
    native_receipt: Mapping[str, Any],
    mapping: Mapping[str, str | Mapping[str, Any] | NativeFieldRule],
    source_receipt_id: str,
    observation_kind: str,
) -> list[RelationObservation] | list[VisualObservation]:
    output: list[Any] = []
    for component_id, raw_rule in mapping.items():
        try:
            rule = _normalize_native_rule(raw_rule)
        except (TypeError, ValueError) as error:
            output.append(_invalid_native_observation(
                component_id=component_id,
                source_class=observation_kind,
                source_receipt_id=source_receipt_id,
                reason=str(error),
                observation_kind=observation_kind,
            ))
            continue

        if not _nonempty_string(rule.value_field):
            output.append(_invalid_native_observation(
                component_id=component_id,
                source_class=observation_kind,
                source_receipt_id=source_receipt_id,
                reason="EMPTY_NATIVE_VALUE_FIELD",
                observation_kind=observation_kind,
            ))
            continue
        if rule.value_field not in native_receipt:
            output.append(_unevaluable_native_observation(
                component_id=component_id,
                source_class=observation_kind,
                source_receipt_id=source_receipt_id,
                reason=f"NATIVE_FIELD_ABSENT:{rule.value_field}",
                observation_kind=observation_kind,
            ))
            continue

        try:
            value = _native_numeric(native_receipt[rule.value_field])
            hard_pass = _apply_hard_rule(
                native_receipt=native_receipt,
                rule=rule,
                value=value,
            )
        except KeyError as error:
            output.append(_unevaluable_native_observation(
                component_id=component_id,
                source_class=observation_kind,
                source_receipt_id=source_receipt_id,
                reason=str(error).strip("'"),
                observation_kind=observation_kind,
            ))
            continue
        except (TypeError, ValueError) as error:
            output.append(_invalid_native_observation(
                component_id=component_id,
                source_class=observation_kind,
                source_receipt_id=source_receipt_id,
                reason=str(error),
                observation_kind=observation_kind,
            ))
            continue

        if observation_kind == "H_EARTH_NATIVE_RECEIPT":
            output.append(RelationObservation(
                component_id,
                value,
                hard_pass,
                observation_kind,
                source_receipt_id,
            ))
        else:
            output.append(VisualObservation(
                component_id,
                value,
                hard_pass,
                observation_kind,
                source_receipt_id,
            ))
    return output


def _serialize_mapping(
    mapping: Mapping[str, str | Mapping[str, Any] | NativeFieldRule],
) -> dict[str, Any]:
    serialized: dict[str, Any] = {}
    for component_id, raw_rule in mapping.items():
        try:
            serialized[component_id] = asdict(_normalize_native_rule(raw_rule))
        except (TypeError, ValueError):
            serialized[component_id] = {"malformed_rule": repr(raw_rule)}
    return serialized


def adapt_h_earth_receipt(
    native_receipt: Mapping[str, Any],
    mapping: Mapping[str, str | Mapping[str, Any] | NativeFieldRule],
    *,
    route_id: str,
    route_version: str,
    source_receipt_id: str,
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
        "adapter_mapping": _serialize_mapping(mapping),
        "native_receipt_preserved": dict(native_receipt),
    })
    return _rehash(receipt)


def adapt_compass_receipt(
    native_receipt: Mapping[str, Any],
    mapping: Mapping[str, str | Mapping[str, Any] | NativeFieldRule],
    *,
    route_id: str,
    route_version: str,
    source_receipt_id: str,
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
        "adapter_mapping": _serialize_mapping(mapping),
        "native_receipt_preserved": dict(native_receipt),
    })
    return _rehash(receipt)


def parse_utc(value: str) -> datetime:
    if not _nonempty_string(value):
        raise ValueError("EMPTY_TIMESTAMP")
    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    except (TypeError, ValueError) as error:
        raise ValueError("INVALID_TIMESTAMP") from error
    if parsed.tzinfo is None or parsed.utcoffset() is None:
        raise ValueError("NAIVE_TIMESTAMP")
    return parsed.astimezone(timezone.utc)


def _finite_number(value: Any, code: str) -> float:
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        raise ValueError(code)
    numeric = float(value)
    if not math.isfinite(numeric):
        raise ValueError(code)
    return numeric


def compare(observed: Mapping[str, Any], rule: ComparisonRule) -> bool | None:
    if not _nonempty_string(rule.field):
        raise ValueError("EMPTY_COMPARISON_FIELD")
    if rule.field not in observed or observed[rule.field] is None:
        return None
    actual = observed[rule.field]
    expected = rule.expected
    op = rule.operator.upper()

    if op == "EQUAL":
        return actual == expected
    if op == "NOT_EQUAL":
        return actual != expected
    if op in {
        "GREATER_THAN",
        "GREATER_OR_EQUAL",
        "LESS_THAN",
        "LESS_OR_EQUAL",
    }:
        actual_number = _finite_number(actual, "NONFINITE_OR_NONNUMERIC_OBSERVED_VALUE")
        expected_number = _finite_number(
            expected,
            "NONFINITE_OR_NONNUMERIC_EXPECTED_VALUE",
        )
        if op == "GREATER_THAN":
            return actual_number > expected_number
        if op == "GREATER_OR_EQUAL":
            return actual_number >= expected_number
        if op == "LESS_THAN":
            return actual_number < expected_number
        return actual_number <= expected_number
    if op == "BETWEEN":
        if (
            not isinstance(expected, (tuple, list))
            or len(expected) != 2
        ):
            raise ValueError("MALFORMED_BETWEEN_RULE")
        low = _finite_number(expected[0], "MALFORMED_BETWEEN_RULE")
        high = _finite_number(expected[1], "MALFORMED_BETWEEN_RULE")
        if low > high:
            raise ValueError("MALFORMED_BETWEEN_RULE")
        actual_number = _finite_number(actual, "NONFINITE_OR_NONNUMERIC_OBSERVED_VALUE")
        return low <= actual_number <= high
    raise ValueError(f"UNKNOWN_COMPARISON_OPERATOR:{rule.operator}")


def _invalid_crosswalk(
    *,
    study: StudyIdentity,
    theory: TheoryRecord,
    observed: Mapping[str, Any],
    reasons: Sequence[str],
    temporal_priority_valid: bool | None = None,
) -> dict[str, Any]:
    return _rehash({
        "platform_id": PLATFORM_ID,
        "platform_version": PLATFORM_VERSION,
        "release_class": RELEASE_CLASS,
        "empirical_engine_version": EMPIRICAL_ENGINE_VERSION,
        "state": State.INVALID.value,
        "study": asdict(study),
        "theory_id": theory.theory_id,
        "theory_version": theory.theory_version,
        "theory_commit_sha": theory.commit_sha,
        "theory_content_sha256": theory.content_sha256,
        "temporal_priority_valid": temporal_priority_valid,
        "identity_compatible": False,
        "scientific_disposition": None,
        "invalid_reasons": sorted(set(reasons)),
        "observed": dict(observed),
    })


def evaluate_theory(
    *,
    study: StudyIdentity,
    theory: TheoryRecord,
    observed: Mapping[str, Any],
    executed_analysis_code_sha256: str,
    boundary_conditions_met: bool = True,
) -> dict[str, Any]:
    invalid: list[str] = []

    if observed.get("state") != State.NUMERIC.value:
        invalid.append("OBSERVED_RECEIPT_NOT_NUMERIC")
    expected_identity = {
        "platform_id": PLATFORM_ID,
        "instrument_id": study.instrument_id,
        "instrument_version": study.instrument_version,
        "route_id": study.route_id,
        "route_version": study.route_version,
    }
    for key, expected in expected_identity.items():
        if observed.get(key) != expected:
            invalid.append(f"OBSERVED_{key.upper()}_MISMATCH")

    if not verify_receipt_sha256(observed):
        invalid.append("OBSERVED_RECEIPT_HASH_INVALID")
    observed_digest = observed.get("receipt_sha256")
    if not is_sha256(study.declared_input_receipt_sha256):
        invalid.append("DECLARED_INPUT_RECEIPT_SHA256_INVALID")
    elif observed_digest != study.declared_input_receipt_sha256:
        invalid.append("DECLARED_INPUT_RECEIPT_SHA256_MISMATCH")

    if not is_sha256(study.data_sha256):
        invalid.append("DATA_SHA256_INVALID")
        data_lock_verification = "INVALID"
    elif study.data_lock_mode == "RECEIPT_SHA256":
        if study.data_sha256 != observed_digest:
            invalid.append("DATA_SHA256_MISMATCH")
            data_lock_verification = "FAILED"
        else:
            data_lock_verification = "VERIFIED_RECEIPT_SHA256"
    elif study.data_lock_mode == "POINTER_ONLY":
        if not _nonempty_string(study.data_pointer):
            invalid.append("DATA_POINTER_REQUIRED")
            data_lock_verification = "INVALID"
        else:
            data_lock_verification = "EXPLICIT_POINTER_ONLY"
    else:
        invalid.append("UNKNOWN_DATA_LOCK_MODE")
        data_lock_verification = "INVALID"

    if not is_sha256(study.analysis_code_sha256):
        invalid.append("ANALYSIS_CODE_SHA256_INVALID")
    if (
        not is_sha256(executed_analysis_code_sha256)
        or executed_analysis_code_sha256 != study.analysis_code_sha256
    ):
        invalid.append("ANALYSIS_CODE_SHA256_MISMATCH")

    if not is_sha256(theory.content_sha256):
        invalid.append("THEORY_CONTENT_SHA256_INVALID")
    if not _nonempty_string(theory.commit_sha):
        invalid.append("THEORY_COMMIT_SHA_EMPTY")
    if type(boundary_conditions_met) is not bool:
        invalid.append("BOUNDARY_CONDITIONS_FLAG_NOT_BOOLEAN")

    temporal_priority_valid: bool | None = None
    try:
        frozen_at = parse_utc(theory.frozen_at)
        data_locked_at = parse_utc(study.data_locked_at)
        analysis_started_at = parse_utc(study.analysis_started_at)
        analysis_completed_at = parse_utc(study.analysis_completed_at)
        temporal_priority_valid = (
            frozen_at < data_locked_at
            <= analysis_started_at
            <= analysis_completed_at
        )
        if not temporal_priority_valid:
            invalid.append("TEMPORAL_PRIORITY_INVALID")
    except ValueError as error:
        invalid.append(str(error))

    if invalid:
        return _invalid_crosswalk(
            study=study,
            theory=theory,
            observed=observed,
            reasons=invalid,
            temporal_priority_valid=temporal_priority_valid,
        )

    try:
        prediction_match = compare(observed, theory.prediction)
        falsification_match = (
            compare(observed, theory.falsification)
            if theory.falsification
            else False
        )
    except ValueError as error:
        return _invalid_crosswalk(
            study=study,
            theory=theory,
            observed=observed,
            reasons=[str(error)],
            temporal_priority_valid=temporal_priority_valid,
        )

    confirmatory_class = theory.perspective_class in {
        "FORMAL_PREREGISTERED_PREDICTION",
        "PRE_RESULT_THEORETICAL_EXPECTATION",
    }
    if not confirmatory_class:
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
        "platform_id": PLATFORM_ID,
        "platform_version": PLATFORM_VERSION,
        "release_class": RELEASE_CLASS,
        "empirical_engine_version": EMPIRICAL_ENGINE_VERSION,
        "state": State.NUMERIC.value,
        "study": asdict(study),
        "theory_id": theory.theory_id,
        "theory_version": theory.theory_version,
        "theory_commit_sha": theory.commit_sha,
        "theory_content_sha256": theory.content_sha256,
        "theory_frozen_at": theory.frozen_at,
        "data_locked_at": study.data_locked_at,
        "analysis_started_at": study.analysis_started_at,
        "analysis_completed_at": study.analysis_completed_at,
        "temporal_priority_valid": temporal_priority_valid,
        "identity_compatible": True,
        "data_lock_verification": data_lock_verification,
        "analysis_code_verified": True,
        "confirmatory_perspective_class": confirmatory_class,
        "prediction_match": prediction_match,
        "falsification_triggered": falsification_match,
        "boundary_conditions_met": boundary_conditions_met,
        "scientific_disposition": disposition,
        "observed_receipt_sha256": observed_digest,
        "observed": dict(observed),
    })


def summarize_study(crosswalks: Sequence[Mapping[str, Any]]) -> dict[str, Any]:
    counts: dict[str, int] = {}
    invalid_count = 0
    for item in crosswalks:
        if item.get("state") == State.INVALID.value:
            invalid_count += 1
            disposition = "INVALID"
        else:
            disposition = str(item.get("scientific_disposition", "UNKNOWN"))
        counts[disposition] = counts.get(disposition, 0) + 1
    state = State.INVALID.value if invalid_count else State.NUMERIC.value
    return _rehash({
        "platform_id": PLATFORM_ID,
        "platform_version": PLATFORM_VERSION,
        "empirical_engine_version": EMPIRICAL_ENGINE_VERSION,
        "state": state,
        "crosswalk_count": len(crosswalks),
        "invalid_crosswalk_count": invalid_count,
        "disposition_counts": counts,
    })


def validate_platform_receipt(receipt: Mapping[str, Any]) -> list[str]:
    errors: list[str] = []
    for field in (
        "platform_id",
        "platform_version",
        "instrument_id",
        "instrument_version",
        "route_id",
        "route_version",
        "state",
        "receipt_sha256",
    ):
        if field not in receipt:
            errors.append(f"MISSING_RECEIPT_FIELD:{field}")
    if receipt.get("platform_id") != PLATFORM_ID:
        errors.append("PLATFORM_ID_MISMATCH")
    if receipt.get("state") not in {item.value for item in State}:
        errors.append("INVALID_RECEIPT_STATE")
    if not verify_receipt_sha256(receipt):
        errors.append("RECEIPT_HASH_INVALID")
    return errors


def validate_theory_crosswalk(crosswalk: Mapping[str, Any]) -> list[str]:
    errors: list[str] = []
    for field in (
        "platform_id",
        "empirical_engine_version",
        "state",
        "study",
        "theory_id",
        "receipt_sha256",
    ):
        if field not in crosswalk:
            errors.append(f"MISSING_CROSSWALK_FIELD:{field}")
    if crosswalk.get("state") == State.NUMERIC.value:
        if not crosswalk.get("identity_compatible"):
            errors.append("NUMERIC_CROSSWALK_NOT_IDENTITY_COMPATIBLE")
        if crosswalk.get("scientific_disposition") is None:
            errors.append("NUMERIC_CROSSWALK_MISSING_DISPOSITION")
    if not verify_receipt_sha256(crosswalk):
        errors.append("CROSSWALK_HASH_INVALID")
    return errors


def verify_imi_package_pointer(pointer: Mapping[str, Any]) -> list[str]:
    errors: list[str] = []
    expected = {
        "package_id": "IMI_OBSERVER_GRADE_INSTRUMENT_v1",
        "zip_file_name": "IMI_OBSERVER_GRADE_INSTRUMENT_v1.zip",
        "zip_sha256": APPROVED_IMI_ZIP_SHA256,
        "file_count": 12,
        "sharing_status": "PRIVATE",
        "authority": "DRIVE_BACKED_FROZEN_INSTRUMENT_PACKAGE",
    }
    for key, value in expected.items():
        if pointer.get(key) != value:
            errors.append(f"IMI_POINTER_{key.upper()}_MISMATCH")
    if not is_sha256(pointer.get("zip_sha256")):
        errors.append("IMI_POINTER_SHA256_INVALID")
    folder_id = pointer.get("drive_folder_id")
    folder_url = pointer.get("drive_folder_url")
    if not _nonempty_string(folder_id):
        errors.append("IMI_POINTER_FOLDER_ID_EMPTY")
    if (
        not _nonempty_string(folder_url)
        or not _nonempty_string(folder_id)
        or folder_id not in folder_url
    ):
        errors.append("IMI_POINTER_FOLDER_URL_INVALID")
    return sorted(set(errors))


def verify_platform_manifest(
    repository_root: Path,
    manifest_path: Path | None = None,
) -> list[str]:
    manifest_path = manifest_path or (
        repository_root
        / "research/route-operator-platform-v1/MANIFEST_SHA256.json"
    )
    errors: list[str] = []
    try:
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return ["MANIFEST_UNREADABLE"]

    if manifest.get("platform_id") != PLATFORM_ID:
        errors.append("MANIFEST_PLATFORM_ID_MISMATCH")
    if manifest.get("platform_version") != PLATFORM_VERSION:
        errors.append("MANIFEST_PLATFORM_VERSION_MISMATCH")
    files = manifest.get("files")
    if not isinstance(files, dict):
        return sorted(set(errors + ["MANIFEST_FILES_INVALID"]))
    if set(files) != EXPECTED_MANIFEST_PATHS:
        errors.append("MANIFEST_PATH_SET_MISMATCH")

    for relative_path, expected_digest in files.items():
        if not is_sha256(expected_digest):
            errors.append(f"MANIFEST_DIGEST_INVALID:{relative_path}")
            continue
        path = repository_root / relative_path
        if not path.is_file():
            errors.append(f"MANIFEST_FILE_MISSING:{relative_path}")
            continue
        if file_sha256(path) != expected_digest:
            errors.append(f"MANIFEST_DIGEST_MISMATCH:{relative_path}")
    return sorted(set(errors))
