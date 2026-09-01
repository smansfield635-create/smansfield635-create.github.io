#!/usr/bin/env python3
"""Deterministic MAPS Diagnostic v0.1 calculator.

This module maps already-adjudicated BASE and PROBE records to four secondary
measurements. It does not run power flow or adjudicate physical viability.
"""

from __future__ import annotations

import hashlib
import json
import math
from dataclasses import dataclass
from typing import Any, Iterable, Mapping, Sequence


INSTRUMENT_ID = "MAPS_DIAGNOSTIC_v0.1"
BINDING_ID = "MAPS_SIMBENCH_BINDING_v0.1"
INPUT_SCHEMA_ID = "MAPS_DIAGNOSTIC_INPUT_v0.1"
OUTPUT_SCHEMA_ID = "MAPS_DIAGNOSTIC_OUTPUT_v0.1"
NETWORK_CODE = "1-HV-urban--0-sw"
TOLERANCE = 1e-12

FORMULAS = {
    "E_sup": "MAPS_E_SUP_SAFE_DELIVERY_v0.1",
    "C_coh": "MAPS_C_COH_AC_PHASOR_v0.1",
    "H_ent": "MAPS_H_ENT_SUPPORT_DISTRIBUTION_v0.1",
    "phi_phase": "MAPS_PHI_PHASE_BASE_INCREMENT_v0.1",
}

CONFIGURATION = {
    "instrument_id": INSTRUMENT_ID,
    "binding_id": BINDING_ID,
    "network_code": NETWORK_CODE,
    "probe_physical_failure_contribution": 0.0,
    "entropy_denominator": "LOG_FULL_FROZEN_PROBE_COUNT",
    "phase_wrap": "[-PI,PI)",
    "phase_weights": "EQUAL_CANONICAL_BUS_WEIGHTS",
    "atomic_bundle": True,
    "tolerance": TOLERANCE,
    "formulas": FORMULAS,
}


def canonical_json_bytes(value: Any) -> bytes:
    """Return the package's frozen canonical JSON representation."""
    return json.dumps(
        value,
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=False,
        allow_nan=False,
    ).encode("utf-8")


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


CONFIGURATION_SHA256 = sha256_bytes(canonical_json_bytes(CONFIGURATION))


@dataclass(frozen=True)
class MeasurementError(Exception):
    reason_code: str
    typed_category: str
    detail: str

    def __str__(self) -> str:
        return f"{self.reason_code}: {self.detail}"


def _fail(reason_code: str, typed_category: str, detail: str) -> None:
    raise MeasurementError(reason_code, typed_category, detail)


def _require_mapping(value: Any, path: str) -> Mapping[str, Any]:
    if not isinstance(value, Mapping):
        _fail("SCHEMA_OR_SEMANTIC_INVALID", "SEMANTIC_MAPPING_INVALID", f"{path} must be an object")
    return value


def _require_exact_keys(value: Mapping[str, Any], allowed: set[str], path: str) -> None:
    actual = set(value)
    if actual != allowed:
        missing = sorted(allowed - actual)
        extra = sorted(actual - allowed)
        _fail(
            "SCHEMA_OR_SEMANTIC_INVALID",
            "SEMANTIC_MAPPING_INVALID",
            f"{path} key mismatch; missing={missing}; extra={extra}",
        )


def _forbidden_challenge_paths(value: Any, path: str = "$") -> list[str]:
    found: list[str] = []
    if isinstance(value, Mapping):
        for key, child in value.items():
            child_path = f"{path}.{key}"
            if "challenge" in str(key).casefold():
                found.append(child_path)
            found.extend(_forbidden_challenge_paths(child, child_path))
    elif isinstance(value, list):
        for index, child in enumerate(value):
            found.extend(_forbidden_challenge_paths(child, f"{path}[{index}]"))
    return found


def _finite_number(value: Any, path: str) -> float:
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        _fail("SCHEMA_OR_SEMANTIC_INVALID", "MEASUREMENT_INVALID", f"{path} must be a real number")
    number = float(value)
    if not math.isfinite(number):
        _fail("NONFINITE_MEASUREMENT", "MEASUREMENT_INVALID", f"{path} must be finite")
    return number


def _finite_vector(value: Any, length: int, path: str, *, positive: bool = False) -> list[float]:
    if not isinstance(value, list) or len(value) != length:
        _fail(
            "BUS_REGISTRY_MISMATCH",
            "SEMANTIC_MAPPING_INVALID",
            f"{path} must contain exactly {length} values",
        )
    result = [_finite_number(item, f"{path}[{index}]") for index, item in enumerate(value)]
    if positive and any(item <= 0.0 for item in result):
        _fail("INVALID_VOLTAGE_MAGNITUDE", "MEASUREMENT_INVALID", f"{path} must be strictly positive")
    return result


def _stable_string_list(value: Any, path: str, minimum: int) -> list[str]:
    if not isinstance(value, list) or len(value) < minimum:
        _fail(
            "INSUFFICIENT_REGISTRY_CARDINALITY",
            "SEMANTIC_MAPPING_INVALID",
            f"{path} must have at least {minimum} entries",
        )
    if any(not isinstance(item, str) or not item for item in value):
        _fail("INVALID_REGISTRY_IDENTITY", "EXECUTION_IDENTITY_INVALID", f"{path} entries must be nonempty strings")
    if len(set(value)) != len(value):
        _fail("DUPLICATE_REGISTRY_IDENTITY", "EXECUTION_IDENTITY_INVALID", f"{path} contains duplicate identities")
    return list(value)


def _validate_base_state(value: Any, bus_count: int, path: str) -> tuple[list[float], list[float]]:
    state = _require_mapping(value, path)
    _require_exact_keys(state, {"status", "voltage_pu", "angle_degree"}, path)
    if state["status"] != "VALID":
        _fail("BASE_STATE_INVALID", "MEASUREMENT_INVALID", f"{path}.status must be VALID")
    voltage = _finite_vector(state["voltage_pu"], bus_count, f"{path}.voltage_pu", positive=True)
    angle = _finite_vector(state["angle_degree"], bus_count, f"{path}.angle_degree")
    return voltage, angle


def _wrap_radians(value: float) -> float:
    return (value + math.pi) % (2.0 * math.pi) - math.pi


def _clamp_closed_unit(value: float, path: str) -> float:
    if value < -TOLERANCE or value > 1.0 + TOLERANCE:
        _fail("NUMERICAL_RANGE_VIOLATION", "MEASUREMENT_INVALID", f"{path}={value} is outside [0,1]")
    return min(1.0, max(0.0, value))


def _complex_voltage(voltage: Sequence[float], angle_degree: Sequence[float]) -> list[complex]:
    return [magnitude * complex(math.cos(math.radians(angle)), math.sin(math.radians(angle)))
            for magnitude, angle in zip(voltage, angle_degree)]


def _phasor_coherence(base: Sequence[complex], probe: Sequence[complex]) -> float:
    numerator = abs(math.fsum((a.conjugate() * b).real for a, b in zip(base, probe))
                    + 1j * math.fsum((a.conjugate() * b).imag for a, b in zip(base, probe)))
    base_norm = math.sqrt(math.fsum(abs(item) ** 2 for item in base))
    probe_norm = math.sqrt(math.fsum(abs(item) ** 2 for item in probe))
    if base_norm <= 0.0 or probe_norm <= 0.0:
        _fail("ZERO_PHASOR_NORM", "MEASUREMENT_INVALID", "complex voltage vector norm must be positive")
    return _clamp_closed_unit(numerator / (base_norm * probe_norm), "probe coherence")


def _diagnostic_record(value: float | None, unit: str, lower: float, upper: float, formula_id: str) -> dict[str, Any]:
    return {
        "value": value,
        "unit": unit,
        "range": [lower, upper],
        "formula_id": formula_id,
    }


def _uninterpretable_output(
    error: MeasurementError,
    input_sha256: str,
    payload: Mapping[str, Any] | None,
) -> dict[str, Any]:
    time_index = payload.get("time_index") if isinstance(payload, Mapping) else None
    previous_time_index = payload.get("previous_time_index") if isinstance(payload, Mapping) else None
    diagnostics = {
        "E_sup": _diagnostic_record(None, "1", 0.0, 1.0, FORMULAS["E_sup"]),
        "C_coh": _diagnostic_record(None, "1", 0.0, 1.0, FORMULAS["C_coh"]),
        "H_ent": _diagnostic_record(None, "1", 0.0, 1.0, FORMULAS["H_ent"]),
        "phi_phase": _diagnostic_record(None, "rad", 0.0, math.pi, FORMULAS["phi_phase"]),
    }
    return {
        "schema": OUTPUT_SCHEMA_ID,
        "instrument_id": INSTRUMENT_ID,
        "binding_id": BINDING_ID,
        "measurement_state": "UNINTERPRETABLE",
        "typed_uninterpretability": {
            "reason_code": error.reason_code,
            "category": error.typed_category,
            "detail": error.detail,
        },
        "time": {"previous_time_index": previous_time_index, "time_index": time_index, "step_minutes": 15},
        "diagnostics": diagnostics,
        "support": {
            "probe_count": None,
            "viable_count": None,
            "physical_failure_count": None,
            "viable_fraction": None,
        },
        "provenance": {
            "input_sha256": input_sha256,
            "configuration_sha256": CONFIGURATION_SHA256,
            "source_lanes": ["BASE", "PROBE"],
            "challenge_field_audit": "FAIL" if error.reason_code == "PROHIBITED_CHALLENGE_FIELD" else "PASS",
        },
        "claim_ceiling": "NO_EMPIRICAL_CLAIM_MEASUREMENT_UNINTERPRETABLE",
        "parent_execution_disposition": "DO_NOT_EXECUTE",
    }


def compute_maps(payload: Any, *, input_sha256: str | None = None) -> dict[str, Any]:
    """Compute MAPS values or an atomic typed-uninterpretable record."""
    if input_sha256 is None:
        try:
            input_sha256 = sha256_bytes(canonical_json_bytes(payload))
        except (TypeError, ValueError):
            input_sha256 = sha256_bytes(repr(payload).encode("utf-8"))

    mapping = payload if isinstance(payload, Mapping) else None
    try:
        payload = _require_mapping(payload, "$")
        forbidden = _forbidden_challenge_paths(payload)
        if forbidden:
            _fail(
                "PROHIBITED_CHALLENGE_FIELD",
                "PROVENANCE_INVALID",
                f"forbidden field names: {forbidden}",
            )

        _require_exact_keys(
            payload,
            {
                "schema",
                "instrument_id",
                "lane",
                "network_code",
                "time_index",
                "previous_time_index",
                "step_minutes",
                "bus_ids",
                "phase_reference_bus_id",
                "expected_probe_ids",
                "requested_demand_mw",
                "base_previous",
                "base_current",
                "probes_current",
                "provenance",
            },
            "$",
        )

        if payload["schema"] != INPUT_SCHEMA_ID or payload["instrument_id"] != INSTRUMENT_ID:
            _fail("INSTRUMENT_IDENTITY_INVALID", "EXECUTION_IDENTITY_INVALID", "schema or instrument identity mismatch")
        if payload["lane"] != "BASE_PROBE_ONLY":
            _fail("PROHIBITED_INFORMATION_LANE", "PROVENANCE_INVALID", "lane must be BASE_PROBE_ONLY")
        if payload["network_code"] != NETWORK_CODE:
            _fail("NETWORK_IDENTITY_INVALID", "EXECUTION_IDENTITY_INVALID", f"network_code must be {NETWORK_CODE}")
        if payload["step_minutes"] != 15:
            _fail("TEMPORAL_SUPPORT_INVALID", "SEMANTIC_MAPPING_INVALID", "step_minutes must be 15")
        if isinstance(payload["time_index"], bool) or not isinstance(payload["time_index"], int):
            _fail("TEMPORAL_SUPPORT_INVALID", "SEMANTIC_MAPPING_INVALID", "time_index must be an integer")
        if isinstance(payload["previous_time_index"], bool) or not isinstance(payload["previous_time_index"], int):
            _fail("INSUFFICIENT_LOOKBACK", "SEMANTIC_MAPPING_INVALID", "previous_time_index must be an integer")
        if payload["time_index"] != payload["previous_time_index"] + 1:
            _fail("INSUFFICIENT_LOOKBACK", "SEMANTIC_MAPPING_INVALID", "BASE lookback must be exactly one step")

        provenance = _require_mapping(payload["provenance"], "$.provenance")
        _require_exact_keys(provenance, {"source_lanes", "source_receipt_digest"}, "$.provenance")
        if provenance["source_lanes"] != ["BASE", "PROBE"]:
            _fail("PROHIBITED_INFORMATION_LANE", "PROVENANCE_INVALID", "source_lanes must equal [BASE, PROBE]")
        digest = provenance["source_receipt_digest"]
        if not isinstance(digest, str) or len(digest) != 64 or any(ch not in "0123456789abcdef" for ch in digest):
            _fail("SOURCE_RECEIPT_INVALID", "PROVENANCE_INVALID", "source_receipt_digest must be lowercase SHA-256")

        bus_ids = _stable_string_list(payload["bus_ids"], "$.bus_ids", 2)
        probe_ids = _stable_string_list(payload["expected_probe_ids"], "$.expected_probe_ids", 2)
        reference_bus = payload["phase_reference_bus_id"]
        if reference_bus not in bus_ids:
            _fail("PHASE_REFERENCE_INVALID", "SEMANTIC_MAPPING_INVALID", "phase_reference_bus_id is absent from bus registry")
        reference_index = bus_ids.index(reference_bus)

        previous_voltage, previous_angle = _validate_base_state(payload["base_previous"], len(bus_ids), "$.base_previous")
        current_voltage, current_angle = _validate_base_state(payload["base_current"], len(bus_ids), "$.base_current")
        del previous_voltage  # Required and validated for complete BASE-state identity.

        requested = _finite_number(payload["requested_demand_mw"], "$.requested_demand_mw")
        if requested <= 0.0:
            _fail("INVALID_REQUESTED_DEMAND", "MEASUREMENT_INVALID", "requested_demand_mw must be positive")

        probes = payload["probes_current"]
        if not isinstance(probes, list) or len(probes) != len(probe_ids):
            _fail("PROBE_REGISTRY_MISMATCH", "EXECUTION_IDENTITY_INVALID", "probes_current cardinality mismatch")
        actual_probe_ids: list[str] = []
        normalized_probes: list[Mapping[str, Any]] = []
        for index, raw_probe in enumerate(probes):
            probe = _require_mapping(raw_probe, f"$.probes_current[{index}]")
            if "probe_id" not in probe or "status" not in probe:
                _fail("PROBE_REGISTRY_MISMATCH", "EXECUTION_IDENTITY_INVALID", f"probe {index} lacks identity or status")
            actual_probe_ids.append(probe["probe_id"])
            normalized_probes.append(probe)
        if actual_probe_ids != probe_ids:
            _fail(
                "PROBE_REGISTRY_ORDER_MISMATCH",
                "EXECUTION_IDENTITY_INVALID",
                f"expected {probe_ids}; received {actual_probe_ids}",
            )

        noninterpretable = [probe for probe in normalized_probes if probe["status"] == "NONINTERPRETABLE_SIMULATION"]
        if noninterpretable:
            for probe in noninterpretable:
                _require_exact_keys(probe, {"probe_id", "status", "reason_code"}, f"probe {probe['probe_id']}")
                if not isinstance(probe["reason_code"], str) or not probe["reason_code"]:
                    _fail("SIMULATION_REASON_INVALID", "SEMANTIC_MAPPING_INVALID", "noninterpretable probe requires reason_code")
            _fail(
                "NONINTERPRETABLE_SIMULATION_PRESENT",
                "MEASUREMENT_INVALID",
                "noninterpretable probes: " + ",".join(probe["probe_id"] for probe in noninterpretable),
            )

        base_phasor = _complex_voltage(current_voltage, current_angle)
        energy_contributions: list[float] = []
        coherence_contributions: list[float] = []
        viable_count = 0
        physical_failure_count = 0

        for index, probe in enumerate(normalized_probes):
            path = f"$.probes_current[{index}]"
            status = probe["status"]
            if status == "PHYSICAL_FAILURE":
                _require_exact_keys(probe, {"probe_id", "status", "reason_code"}, path)
                if not isinstance(probe["reason_code"], str) or not probe["reason_code"]:
                    _fail("PHYSICAL_FAILURE_REASON_INVALID", "SEMANTIC_MAPPING_INVALID", f"{path}.reason_code is required")
                energy_contributions.append(0.0)
                coherence_contributions.append(0.0)
                physical_failure_count += 1
                continue
            if status != "VIABLE":
                _fail("UNKNOWN_PROBE_STATUS", "SEMANTIC_MAPPING_INVALID", f"{path}.status={status!r}")

            _require_exact_keys(
                probe,
                {"probe_id", "status", "served_demand_mw", "active_loss_mw", "voltage_pu", "angle_degree"},
                path,
            )
            served = _finite_number(probe["served_demand_mw"], f"{path}.served_demand_mw")
            loss = _finite_number(probe["active_loss_mw"], f"{path}.active_loss_mw")
            if served < -TOLERANCE or served > requested + TOLERANCE:
                _fail("INVALID_SERVED_DEMAND", "MEASUREMENT_INVALID", f"{path}.served_demand_mw outside [0, requested]")
            if loss < -TOLERANCE:
                _fail("INVALID_ACTIVE_LOSS", "MEASUREMENT_INVALID", f"{path}.active_loss_mw must be nonnegative")
            served = min(requested, max(0.0, served))
            loss = max(0.0, loss)
            delivery_fraction = served / requested
            denominator = served + loss
            efficiency = served / denominator if denominator > 0.0 else 0.0
            energy = _clamp_closed_unit(delivery_fraction * efficiency, f"{path} energy support")

            voltage = _finite_vector(probe["voltage_pu"], len(bus_ids), f"{path}.voltage_pu", positive=True)
            angle = _finite_vector(probe["angle_degree"], len(bus_ids), f"{path}.angle_degree")
            probe_phasor = _complex_voltage(voltage, angle)
            coherence = _phasor_coherence(base_phasor, probe_phasor)

            energy_contributions.append(energy)
            coherence_contributions.append(coherence)
            viable_count += 1

        probe_count = len(probe_ids)
        energy_support = _clamp_closed_unit(math.fsum(energy_contributions) / probe_count, "E_sup")
        coherence = _clamp_closed_unit(math.fsum(coherence_contributions) / probe_count, "C_coh")

        total_support = math.fsum(energy_contributions)
        if total_support > 0.0:
            probabilities = [value / total_support for value in energy_contributions if value > 0.0]
            entropy = -math.fsum(probability * math.log(probability) for probability in probabilities) / math.log(probe_count)
            entropy = _clamp_closed_unit(entropy, "H_ent")
        else:
            entropy = 0.0

        previous_reference = math.radians(previous_angle[reference_index])
        current_reference = math.radians(current_angle[reference_index])
        squared_increments: list[float] = []
        for previous, current in zip(previous_angle, current_angle):
            previous_centered = _wrap_radians(math.radians(previous) - previous_reference)
            current_centered = _wrap_radians(math.radians(current) - current_reference)
            increment = _wrap_radians(current_centered - previous_centered)
            squared_increments.append(increment * increment)
        phase_increment = math.sqrt(math.fsum(squared_increments) / len(bus_ids))
        if phase_increment < -TOLERANCE or phase_increment > math.pi + TOLERANCE:
            _fail("NUMERICAL_RANGE_VIOLATION", "MEASUREMENT_INVALID", "phi_phase outside [0,pi]")
        phase_increment = min(math.pi, max(0.0, phase_increment))

        return {
            "schema": OUTPUT_SCHEMA_ID,
            "instrument_id": INSTRUMENT_ID,
            "binding_id": BINDING_ID,
            "measurement_state": "VALID",
            "typed_uninterpretability": None,
            "time": {
                "previous_time_index": payload["previous_time_index"],
                "time_index": payload["time_index"],
                "step_minutes": 15,
            },
            "diagnostics": {
                "E_sup": _diagnostic_record(energy_support, "1", 0.0, 1.0, FORMULAS["E_sup"]),
                "C_coh": _diagnostic_record(coherence, "1", 0.0, 1.0, FORMULAS["C_coh"]),
                "H_ent": _diagnostic_record(entropy, "1", 0.0, 1.0, FORMULAS["H_ent"]),
                "phi_phase": _diagnostic_record(phase_increment, "rad", 0.0, math.pi, FORMULAS["phi_phase"]),
            },
            "support": {
                "probe_count": probe_count,
                "viable_count": viable_count,
                "physical_failure_count": physical_failure_count,
                "viable_fraction": viable_count / probe_count,
            },
            "provenance": {
                "input_sha256": input_sha256,
                "configuration_sha256": CONFIGURATION_SHA256,
                "source_lanes": ["BASE", "PROBE"],
                "source_receipt_digest": provenance["source_receipt_digest"],
                "challenge_field_audit": "PASS",
            },
            "claim_ceiling": "DETERMINISTIC_SECONDARY_MEASUREMENT_ONLY",
            "parent_execution_disposition": "DO_NOT_EXECUTE",
        }
    except MeasurementError as error:
        return _uninterpretable_output(error, input_sha256, mapping)


def compute_from_json_bytes(raw: bytes) -> dict[str, Any]:
    """Parse strict JSON bytes and compute the atomic MAPS record."""
    input_digest = sha256_bytes(raw)
    try:
        text = raw.decode("utf-8")
        payload = json.loads(
            text,
            parse_constant=lambda token: (_ for _ in ()).throw(ValueError(f"nonfinite token {token}")),
        )
    except (UnicodeDecodeError, json.JSONDecodeError, ValueError) as exc:
        error = MeasurementError("INVALID_JSON", "SEMANTIC_MAPPING_INVALID", str(exc))
        return _uninterpretable_output(error, input_digest, None)
    return compute_maps(payload, input_sha256=input_digest)


__all__ = [
    "BINDING_ID",
    "CONFIGURATION_SHA256",
    "FORMULAS",
    "INSTRUMENT_ID",
    "canonical_json_bytes",
    "compute_from_json_bytes",
    "compute_maps",
    "sha256_bytes",
]
