#!/usr/bin/env python3
"""Narrow adapter from already-solved pandapower-like objects to MAPS records.

The adapter deliberately does not import or call pandapower. The caller must
provide a solved network object and an upstream viability result.
"""

from __future__ import annotations

import math
from typing import Any, Iterable, Mapping, Sequence


class AdapterError(ValueError):
    pass


def _finite(value: Any, label: str) -> float:
    try:
        number = float(value)
    except (TypeError, ValueError) as exc:
        raise AdapterError(f"{label} is not numeric") from exc
    if not math.isfinite(number):
        raise AdapterError(f"{label} is not finite")
    return number


def _table(net: Any, name: str) -> Any:
    if isinstance(net, Mapping):
        value = net.get(name)
    else:
        value = getattr(net, name, None)
    if value is None:
        raise AdapterError(f"required solved result table is absent: {name}")
    return value


def _ordered_column(table: Any, indices: Sequence[Any], column: str, label: str) -> list[float]:
    if column not in table.columns:
        raise AdapterError(f"required column is absent: {label}.{column}")
    try:
        values = table.loc[list(indices), column].tolist()
    except Exception as exc:  # Exact table/index error is preserved by the message.
        raise AdapterError(f"cannot align {label}.{column} to frozen indices: {exc}") from exc
    return [_finite(value, f"{label}.{column}[{index!r}]") for index, value in zip(indices, values)]


def _sum_sources(net: Any, sources: Sequence[tuple[str, str]], label: str) -> float:
    if not sources:
        raise AdapterError(f"{label} source list cannot be empty")
    total = 0.0
    for table_name, column in sources:
        table = _table(net, table_name)
        if column not in table.columns:
            raise AdapterError(f"required column is absent: {table_name}.{column}")
        values = [_finite(value, f"{table_name}.{column}") for value in table[column].tolist()]
        total = math.fsum((total, math.fsum(values)))
    return total


def extract_base_state(net: Any, *, bus_indices: Sequence[Any]) -> dict[str, Any]:
    """Extract only the BASE voltage state from an already-solved network."""
    table = _table(net, "res_bus")
    return {
        "status": "VALID",
        "voltage_pu": _ordered_column(table, bus_indices, "vm_pu", "res_bus"),
        "angle_degree": _ordered_column(table, bus_indices, "va_degree", "res_bus"),
    }


def extract_viable_probe(
    net: Any,
    *,
    probe_id: str,
    bus_indices: Sequence[Any],
    served_demand_sources: Sequence[tuple[str, str]],
    active_loss_sources: Sequence[tuple[str, str]],
) -> dict[str, Any]:
    """Extract one upstream-adjudicated VIABLE PROBE result."""
    if not probe_id:
        raise AdapterError("probe_id must be nonempty")
    table = _table(net, "res_bus")
    served = _sum_sources(net, served_demand_sources, "served demand")
    loss = _sum_sources(net, active_loss_sources, "active loss")
    return {
        "probe_id": probe_id,
        "status": "VIABLE",
        "served_demand_mw": served,
        "active_loss_mw": loss,
        "voltage_pu": _ordered_column(table, bus_indices, "vm_pu", "res_bus"),
        "angle_degree": _ordered_column(table, bus_indices, "va_degree", "res_bus"),
    }


def physical_failure_probe(*, probe_id: str, reason_code: str) -> dict[str, str]:
    if not probe_id or not reason_code:
        raise AdapterError("physical failure requires probe_id and reason_code")
    return {"probe_id": probe_id, "status": "PHYSICAL_FAILURE", "reason_code": reason_code}


def noninterpretable_probe(*, probe_id: str, reason_code: str) -> dict[str, str]:
    if not probe_id or not reason_code:
        raise AdapterError("noninterpretable simulation requires probe_id and reason_code")
    return {"probe_id": probe_id, "status": "NONINTERPRETABLE_SIMULATION", "reason_code": reason_code}


def build_maps_input(
    *,
    time_index: int,
    bus_ids: Sequence[str],
    phase_reference_bus_id: str,
    expected_probe_ids: Sequence[str],
    requested_demand_mw: float,
    base_previous: Mapping[str, Any],
    base_current: Mapping[str, Any],
    probes_current: Sequence[Mapping[str, Any]],
    source_receipt_digest: str,
) -> dict[str, Any]:
    """Build the exact MAPS input envelope without changing any scientific state."""
    return {
        "schema": "MAPS_DIAGNOSTIC_INPUT_v0.1",
        "instrument_id": "MAPS_DIAGNOSTIC_v0.1",
        "lane": "BASE_PROBE_ONLY",
        "network_code": "1-HV-urban--0-sw",
        "time_index": time_index,
        "previous_time_index": time_index - 1,
        "step_minutes": 15,
        "bus_ids": list(bus_ids),
        "phase_reference_bus_id": phase_reference_bus_id,
        "expected_probe_ids": list(expected_probe_ids),
        "requested_demand_mw": requested_demand_mw,
        "base_previous": dict(base_previous),
        "base_current": dict(base_current),
        "probes_current": [dict(probe) for probe in probes_current],
        "provenance": {
            "source_lanes": ["BASE", "PROBE"],
            "source_receipt_digest": source_receipt_digest,
        },
    }


__all__ = [
    "AdapterError",
    "build_maps_input",
    "extract_base_state",
    "extract_viable_probe",
    "noninterpretable_probe",
    "physical_failure_probe",
]
