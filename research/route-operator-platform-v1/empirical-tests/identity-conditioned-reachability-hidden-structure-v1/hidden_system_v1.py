from __future__ import annotations
from dataclasses import dataclass
from typing import Dict, List, Set

CONSTITUTIVE = ("R01", "R02", "R03", "R04", "R05")
DECOYS = ("R06", "R07", "R08")

@dataclass(frozen=True)
class Case:
    case_id: str
    disabled_relations: tuple[str, ...] = ()
    external_support: bool = False
    functional_substitute: bool = False
    extra_capacity_units: int = 0
    prior_fracture_latched: bool = False
    reentry_clearance: bool = False


def execute(case: Case) -> Dict[str, object]:
    disabled: Set[str] = set(case.disabled_relations)
    original_route_intact = all(r not in disabled for r in CONSTITUTIVE)
    constitutive_disrupted = not original_route_intact

    generic_output = False
    identity_challenge = False
    support_draw = False
    substitute_draw = False
    clearance_used = False
    failure_code = "NO_VALID_ROUTE"

    if case.prior_fracture_latched and not case.reentry_clearance:
        failure_code = "REENTRY_CLEARANCE_REQUIRED"
    elif original_route_intact:
        generic_output = True
        identity_challenge = True
        clearance_used = bool(case.prior_fracture_latched and case.reentry_clearance)
        failure_code = "NONE"
    elif case.functional_substitute:
        generic_output = True
        substitute_draw = True
        failure_code = "NONE"
    elif case.external_support:
        generic_output = True
        support_draw = True
        failure_code = "NONE"
    elif case.extra_capacity_units > 0:
        failure_code = "UNRELATED_CAPACITY_CANNOT_REPAIR_ROUTE"
    elif constitutive_disrupted:
        failure_code = "CONSTITUTIVE_ROUTE_CLOSED"

    fracture_latched = bool(case.prior_fracture_latched or (constitutive_disrupted and not generic_output))
    return {
        "case_id": case.case_id,
        "generic_output": generic_output,
        "identity_challenge": identity_challenge,
        "support_draw": support_draw,
        "substitute_draw": substitute_draw,
        "fracture_latched": fracture_latched,
        "clearance_used": clearance_used,
        "failure_code": failure_code,
        "extra_capacity_units": case.extra_capacity_units,
        "disabled_relations": sorted(disabled),
    }
