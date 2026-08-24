from __future__ import annotations

import hashlib
import hmac
import json
from dataclasses import dataclass
from typing import Any, Dict, List

SYSTEM_ID = "ICR_LEVEL4_DETERMINISTIC_VERIFICATION_PIPELINE_v1"
ORIGINAL_KEY = b"ICR_ORIGINAL_LINEAGE_KEY_v1"
SUBSTITUTE_KEY = b"ICR_SUBSTITUTE_LINEAGE_KEY_v1"
PAYLOAD = {"case_id": "ICR-L4-001", "value": 17, "command": "EMIT_ACCEPTED_RECEIPT"}
CHALLENGE_NONCE = b"ICR_ORIGINAL_LINEAGE_CHALLENGE_v1"


def canonical_bytes(value: Any) -> bytes:
    return json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")


def digest(value: Any) -> str:
    return hashlib.sha256(canonical_bytes(value)).hexdigest()


def sign_payload(key: bytes, payload: Dict[str, Any]) -> str:
    return hmac.new(key, canonical_bytes(payload), hashlib.sha256).hexdigest()


def verify_payload(key: bytes, payload: Dict[str, Any], signature: str) -> bool:
    expected = sign_payload(key, payload)
    return hmac.compare_digest(expected, signature)


def answer_challenge(key: bytes) -> str:
    return hmac.new(key, CHALLENGE_NONCE, hashlib.sha256).hexdigest()


def verify_original_challenge(response: str) -> bool:
    return hmac.compare_digest(answer_challenge(ORIGINAL_KEY), response)


@dataclass(frozen=True)
class Condition:
    condition_id: str
    original_verifier_available: bool
    external_support_available: bool
    substitute_verifier_available: bool
    extra_capacity_units: int
    support_withdrawn: bool
    prior_fracture_latched: bool
    reentry_clearance: bool
    declared_transition: str


def execute_condition(condition: Condition) -> Dict[str, Any]:
    payload = dict(PAYLOAD)
    route_steps: List[str] = ["intake", "canonicalize"]
    provenance = "NONE"
    output_status = "FAIL"
    failure_reason = "NO_VALID_VERIFICATION_ROUTE"
    original_challenge_pass = False

    if condition.prior_fracture_latched and not condition.reentry_clearance:
        route_steps.append("quarantine_hold")
        failure_reason = "REENTRY_CLEARANCE_REQUIRED"
    elif condition.original_verifier_available:
        signature = sign_payload(ORIGINAL_KEY, payload)
        route_steps.extend(["original_signer", "original_verifier"])
        if condition.prior_fracture_latched:
            route_steps.insert(2, "reentry_clearance")
        if verify_payload(ORIGINAL_KEY, payload, signature):
            output_status = "PASS"
            failure_reason = "NONE"
            provenance = "ORIGINAL_KEY_LINEAGE_V1"
            original_challenge_pass = verify_original_challenge(answer_challenge(ORIGINAL_KEY))
            route_steps.append("emit")
    elif condition.substitute_verifier_available:
        signature = sign_payload(SUBSTITUTE_KEY, payload)
        route_steps.extend(["substitute_signer", "substitute_verifier"])
        if verify_payload(SUBSTITUTE_KEY, payload, signature):
            output_status = "PASS"
            failure_reason = "NONE"
            provenance = "SUBSTITUTE_KEY_LINEAGE_V1"
            original_challenge_pass = verify_original_challenge(answer_challenge(SUBSTITUTE_KEY))
            route_steps.append("emit")
    elif condition.external_support_available and not condition.support_withdrawn:
        route_steps.extend(["external_support_oracle", "emit"])
        output_status = "PASS"
        failure_reason = "NONE"
        provenance = "EXTERNAL_SUPPORT_V1"
        original_challenge_pass = False
    else:
        for _ in range(max(0, condition.extra_capacity_units)):
            canonical_bytes(payload)
        if condition.support_withdrawn:
            route_steps.append("support_withdrawn")
            failure_reason = "SUPPORT_WITHDRAWN_WITHOUT_INTERNAL_ROUTE"
        elif condition.extra_capacity_units > 0:
            route_steps.append("unrelated_capacity_exhausted")
            failure_reason = "UNRELATED_CAPACITY_CANNOT_VERIFY"

    original_route_available = (
        output_status == "PASS"
        and provenance == "ORIGINAL_KEY_LINEAGE_V1"
        and (not condition.prior_fracture_latched or condition.reentry_clearance)
    )

    if original_route_available and condition.prior_fracture_latched:
        identity_class = "RESTORED_WITH_HYSTERESIS"
        route_family = "P_ORIGINAL_REENTRY"
    elif original_route_available:
        identity_class = "ENDOGENOUSLY_PRESERVED"
        route_family = "P_ORIGINAL"
    elif output_status == "PASS" and provenance == "EXTERNAL_SUPPORT_V1":
        identity_class = "EXTERNALLY_SUSTAINED"
        route_family = "P_EXTERNAL_SUPPORT"
    elif output_status == "PASS" and provenance == "SUBSTITUTE_KEY_LINEAGE_V1":
        identity_class = "FUNCTIONALLY_SUBSTITUTED"
        route_family = "P_SUBSTITUTE"
    else:
        identity_class = "FRACTURED"
        route_family = "NONE"

    receipt = {
        "system_id": SYSTEM_ID,
        "condition_id": condition.condition_id,
        "declared_transition": condition.declared_transition,
        "output_status": output_status,
        "failure_reason": failure_reason,
        "identity_class": identity_class,
        "route_family": route_family,
        "route_steps": route_steps,
        "provenance": provenance,
        "original_route_available": original_route_available,
        "original_challenge_pass": original_challenge_pass,
        "extra_capacity_units": condition.extra_capacity_units,
        "support_withdrawn": condition.support_withdrawn,
        "prior_fracture_latched": condition.prior_fracture_latched,
        "reentry_clearance": condition.reentry_clearance,
        "payload_sha256": digest(payload),
    }
    receipt["receipt_sha256"] = digest(receipt)
    return receipt
