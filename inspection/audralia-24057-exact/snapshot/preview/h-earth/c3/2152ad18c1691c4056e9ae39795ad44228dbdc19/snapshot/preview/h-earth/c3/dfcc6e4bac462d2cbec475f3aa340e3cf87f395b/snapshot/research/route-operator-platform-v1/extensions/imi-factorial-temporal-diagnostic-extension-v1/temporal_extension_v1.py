from __future__ import annotations

import argparse
import hashlib
import json
import math
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, Iterable, List, Mapping, Sequence

EXTENSION_ID = "IMI_FACTORIAL_TEMPORAL_DIAGNOSTIC_EXTENSION_v1"
EXTENSION_VERSION = "1.0.0"
COMPARABILITY_FIELDS = (
    "route_id",
    "route_version",
    "factor_dictionary_version",
    "normalization_version",
    "source_registry_version",
    "temporal_protocol_version",
    "implementation_version",
)


class TemporalExtensionError(ValueError):
    """Fail-closed validation error for factorial-temporal analysis."""


@dataclass(frozen=True)
class TemporalRules:
    meaningful_change_threshold: float
    persistence_window: int
    minimum_observations: int
    interval_mode: str
    expected_interval: float | None = None
    interval_tolerance: float = 1e-12
    condition_bands: tuple[tuple[str, float], ...] = ()

    @staticmethod
    def from_mapping(value: Mapping[str, Any]) -> "TemporalRules":
        threshold = float(value["meaningful_change_threshold"])
        if not math.isfinite(threshold) or threshold <= 0:
            raise TemporalExtensionError("INVALID_MEANINGFUL_CHANGE_THRESHOLD")

        persistence_window = int(value["persistence_window"])
        minimum_observations = int(value["minimum_observations"])
        if persistence_window < 2:
            raise TemporalExtensionError("PERSISTENCE_WINDOW_TOO_SHORT")
        if minimum_observations < persistence_window + 1:
            raise TemporalExtensionError("MINIMUM_OBSERVATIONS_INSUFFICIENT_FOR_WINDOW")

        interval_mode = str(value["interval_mode"]).upper()
        if interval_mode not in {"EXACT", "RATE_NORMALIZED"}:
            raise TemporalExtensionError("UNKNOWN_INTERVAL_MODE")

        expected_interval = value.get("expected_interval")
        if interval_mode == "EXACT":
            if expected_interval is None:
                raise TemporalExtensionError("MISSING_EXPECTED_INTERVAL")
            expected_interval = float(expected_interval)
            if not math.isfinite(expected_interval) or expected_interval <= 0:
                raise TemporalExtensionError("INVALID_EXPECTED_INTERVAL")
        elif expected_interval is not None:
            expected_interval = float(expected_interval)

        interval_tolerance = float(value.get("interval_tolerance", 1e-12))
        if interval_tolerance < 0 or not math.isfinite(interval_tolerance):
            raise TemporalExtensionError("INVALID_INTERVAL_TOLERANCE")

        bands: List[tuple[str, float]] = []
        for item in value.get("condition_bands", []):
            label = str(item["label"])
            lower = float(item["lower_inclusive"])
            if not label or not math.isfinite(lower) or lower < 0 or lower > 1:
                raise TemporalExtensionError("INVALID_CONDITION_BAND")
            bands.append((label, lower))
        bands.sort(key=lambda x: x[1], reverse=True)

        return TemporalRules(
            meaningful_change_threshold=threshold,
            persistence_window=persistence_window,
            minimum_observations=minimum_observations,
            interval_mode=interval_mode,
            expected_interval=expected_interval,
            interval_tolerance=interval_tolerance,
            condition_bands=tuple(bands),
        )


def _canonical_json(value: Any) -> bytes:
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")


def _sha256(value: Any) -> str:
    return hashlib.sha256(_canonical_json(value)).hexdigest()


def _require_sha256(value: Any, code: str) -> str:
    text = str(value)
    if len(text) != 64 or any(ch not in "0123456789abcdef" for ch in text):
        raise TemporalExtensionError(code)
    return text


def _validate_record(record: Mapping[str, Any]) -> Dict[str, Any]:
    required = {
        "case_id",
        "timepoint",
        "core_receipt_sha256",
        "IMI",
        "CS",
        "WMI",
        "factor_vector",
        *COMPARABILITY_FIELDS,
    }
    missing = sorted(required.difference(record))
    if missing:
        raise TemporalExtensionError("MISSING_RECORD_FIELDS:" + ",".join(missing))

    normalized = dict(record)
    normalized["case_id"] = str(record["case_id"])
    normalized["timepoint"] = float(record["timepoint"])
    if not math.isfinite(normalized["timepoint"]):
        raise TemporalExtensionError("INVALID_TIMEPOINT")

    normalized["core_receipt_sha256"] = _require_sha256(
        record["core_receipt_sha256"], "INVALID_CORE_RECEIPT_SHA256"
    )

    for field in ("IMI", "CS", "WMI"):
        number = float(record[field])
        if not math.isfinite(number) or number < 0 or number > 1:
            raise TemporalExtensionError(f"{field}_OUT_OF_RANGE")
        normalized[field] = number

    if not math.isclose(normalized["CS"], 1.0 - normalized["IMI"], rel_tol=0.0, abs_tol=1e-12):
        raise TemporalExtensionError("CS_IMI_COMPLEMENT_MISMATCH")

    vector = record["factor_vector"]
    if not isinstance(vector, Mapping) or not vector:
        raise TemporalExtensionError("INVALID_FACTOR_VECTOR")
    normalized_vector: Dict[str, float] = {}
    for key, value in vector.items():
        number = float(value)
        if not math.isfinite(number) or number < 0 or number > 1:
            raise TemporalExtensionError("FACTOR_VALUE_OUT_OF_RANGE")
        normalized_vector[str(key)] = number
    normalized["factor_vector"] = dict(sorted(normalized_vector.items()))

    minimum = min(normalized_vector.values())
    if not math.isclose(normalized["WMI"], minimum, rel_tol=0.0, abs_tol=1e-12):
        raise TemporalExtensionError("WMI_FACTOR_VECTOR_MISMATCH")

    for field in COMPARABILITY_FIELDS:
        text = str(record[field])
        if not text:
            raise TemporalExtensionError("EMPTY_COMPARABILITY_FIELD:" + field)
        normalized[field] = text

    return normalized


def _validate_comparability(records: Sequence[Mapping[str, Any]], rules: TemporalRules) -> None:
    first = records[0]
    for record in records[1:]:
        for field in COMPARABILITY_FIELDS:
            if record[field] != first[field]:
                raise TemporalExtensionError("COMPARABILITY_MISMATCH:" + field)
        if set(record["factor_vector"]) != set(first["factor_vector"]):
            raise TemporalExtensionError("FACTOR_VECTOR_IDENTITY_MISMATCH")

    for left, right in zip(records, records[1:]):
        interval = right["timepoint"] - left["timepoint"]
        if interval <= 0:
            raise TemporalExtensionError("NONINCREASING_TIME_ORDER")
        if rules.interval_mode == "EXACT" and not math.isclose(
            interval,
            float(rules.expected_interval),
            rel_tol=0.0,
            abs_tol=rules.interval_tolerance,
        ):
            raise TemporalExtensionError("NONCOMPARABLE_OBSERVATION_INTERVAL")


def _direction(delta: float, threshold: float) -> str:
    if delta > threshold:
        return "IMPROVING"
    if delta < -threshold:
        return "DETERIORATING"
    return "STABLE"


def _condition_label(imi: float, bands: Sequence[tuple[str, float]]) -> str:
    if not bands:
        return "UNCLASSIFIED_NO_ROUTE_SPECIFIC_BANDS"
    for label, lower in bands:
        if imi >= lower:
            return label
    return "BELOW_LOWEST_DECLARED_BAND"


def _persistence(directions: Sequence[str], window: int) -> str:
    recent = list(directions[-window:])
    if len(recent) < window:
        return "UNEVALUABLE_INSUFFICIENT_DIRECTION_INTERVALS"
    if all(item == "IMPROVING" for item in recent):
        return "SUSTAINED_IMPROVEMENT"
    if all(item == "DETERIORATING" for item in recent):
        return "SUSTAINED_DETERIORATION"
    if all(item == "STABLE" for item in recent):
        return "SUSTAINED_STABILITY"
    if recent[-1] == "DETERIORATING" and "IMPROVING" in recent[:-1]:
        return "RELAPSE_OR_REVERSAL_TOWARD_DETERIORATION"
    if recent[-1] == "IMPROVING" and "DETERIORATING" in recent[:-1]:
        return "RECOVERY_REVERSAL_OR_EMERGING_IMPROVEMENT"
    return "MIXED_OR_EMERGING"


def analyze_series(records: Iterable[Mapping[str, Any]], rules_value: Mapping[str, Any]) -> Dict[str, Any]:
    rules = TemporalRules.from_mapping(rules_value)
    normalized_records = [_validate_record(record) for record in records]
    if len(normalized_records) < rules.minimum_observations:
        raise TemporalExtensionError("INSUFFICIENT_OBSERVATIONS")
    normalized_records.sort(key=lambda item: item["timepoint"])
    _validate_comparability(normalized_records, rules)

    transitions: List[Dict[str, Any]] = []
    directions: List[str] = []
    for prior, current in zip(normalized_records, normalized_records[1:]):
        interval = current["timepoint"] - prior["timepoint"]
        raw_delta = current["IMI"] - prior["IMI"]
        delta = raw_delta if rules.interval_mode == "EXACT" else raw_delta / interval
        direction = _direction(delta, rules.meaningful_change_threshold)
        directions.append(direction)
        factor_deltas = {
            factor_id: current["factor_vector"][factor_id] - prior["factor_vector"][factor_id]
            for factor_id in sorted(current["factor_vector"])
        }
        transitions.append(
            {
                "from_timepoint": prior["timepoint"],
                "to_timepoint": current["timepoint"],
                "interval": interval,
                "delta_IMI_raw": raw_delta,
                "delta_IMI_governing": delta,
                "delta_CS_raw": current["CS"] - prior["CS"],
                "direction": direction,
                "factor_deltas": factor_deltas,
            }
        )

    current = normalized_records[-1]
    minimum = min(current["factor_vector"].values())
    bottlenecks = [
        key for key, value in current["factor_vector"].items() if math.isclose(value, minimum, abs_tol=1e-12)
    ]
    acceleration = None
    if len(transitions) >= 2:
        acceleration = transitions[-1]["delta_IMI_governing"] - transitions[-2]["delta_IMI_governing"]

    result: Dict[str, Any] = {
        "extension_id": EXTENSION_ID,
        "extension_version": EXTENSION_VERSION,
        "state": "NUMERIC_TEMPORAL_DIAGNOSTIC",
        "case_id": current["case_id"],
        "comparability": {field: current[field] for field in COMPARABILITY_FIELDS},
        "observation_count": len(normalized_records),
        "transition_count": len(transitions),
        "current_condition": {
            "IMI": current["IMI"],
            "CS": current["CS"],
            "WMI": current["WMI"],
            "condition_class": _condition_label(current["IMI"], rules.condition_bands),
            "factor_vector": current["factor_vector"],
            "bottleneck_factor_ids": bottlenecks,
        },
        "latest_direction": directions[-1],
        "persistence": _persistence(directions, rules.persistence_window),
        "acceleration": acceleration,
        "transitions": transitions,
        "source_core_receipt_sha256_list": [record["core_receipt_sha256"] for record in normalized_records],
        "rules": {
            "meaningful_change_threshold": rules.meaningful_change_threshold,
            "persistence_window": rules.persistence_window,
            "minimum_observations": rules.minimum_observations,
            "interval_mode": rules.interval_mode,
            "expected_interval": rules.expected_interval,
            "condition_bands": [
                {"label": label, "lower_inclusive": lower} for label, lower in rules.condition_bands
            ],
        },
        "core_recalculation_performed": False,
        "core_mutation_performed": False,
    }
    result["receipt_sha256"] = _sha256(result)
    return result


def main() -> int:
    parser = argparse.ArgumentParser(description="Run the IMI factorial-temporal diagnostic extension.")
    parser.add_argument("--input", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()

    payload = json.loads(args.input.read_text(encoding="utf-8"))
    result = analyze_series(payload["records"], payload["rules"])
    args.output.write_text(json.dumps(result, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(json.dumps({"status": "PASS", "receipt_sha256": result["receipt_sha256"]}, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
