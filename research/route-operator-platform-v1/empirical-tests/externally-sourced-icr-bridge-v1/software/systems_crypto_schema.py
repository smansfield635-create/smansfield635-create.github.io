from __future__ import annotations
import hashlib, json
from typing import Any
from cryptography.exceptions import InvalidSignature
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey
from jsonschema import Draft202012Validator
from model import ExternalSystem, Outcome

class CryptoSystem(ExternalSystem):
    system_id = "SYS_CRYPTOGRAPHIC_VERIFICATION"
    package = "cryptography"
    relations = ("R01", "R02", "R03")
    decoys = ("R04", "R05")
    def __init__(self) -> None:
        self.message = b"external-system identity challenge v1"
        self.private = Ed25519PrivateKey.from_private_bytes(bytes(range(1, 33)))
        self.public = self.private.public_key()
        self.sub_private = Ed25519PrivateKey.from_private_bytes(bytes(range(33, 65)))
        self.sub_public = self.sub_private.public_key()
    @staticmethod
    def _verify(message: bytes, signature: bytes, public: Any) -> bool:
        try:
            public.verify(signature, message); return True
        except InvalidSignature:
            return False
    def baseline(self) -> Outcome:
        sig = self.private.sign(self.message); ok = self._verify(self.message, sig, self.public)
        return Outcome(ok, ok, "endogenous", "ed25519-original", {"signature_sha256": hashlib.sha256(sig).hexdigest()})
    def ablate(self, relation: str) -> Outcome:
        sig = self.private.sign(self.message); msg, pub = self.message, self.public
        if relation == "R01": pub = self.sub_public
        elif relation == "R02": msg = self.message + b"!"
        elif relation == "R03": sig = sig[:-1] + bytes([sig[-1] ^ 1])
        ok = self._verify(msg, sig, pub)
        return Outcome(ok, ok, "endogenous", "ed25519-original", {"ablated": relation})
    def support_after_ablation(self, relation: str) -> Outcome:
        internal = self.ablate(relation)
        return Outcome(True, internal.original_challenge_pass, "external_support", "support-oracle", {"internal_visible": internal.visible_pass})
    def unrelated_capacity_after_ablation(self, relation: str) -> Outcome:
        for i in range(5000): hashlib.sha256(f"{i}".encode()).digest()
        return self.ablate(relation)
    def substitute(self) -> Outcome:
        sig = self.sub_private.sign(self.message)
        generic = self._verify(self.message, sig, self.sub_public); original = self._verify(self.message, sig, self.public)
        return Outcome(generic, original, "functional_substitute", "ed25519-substitute", {"substitute_verified": generic})
    def restore(self, relation: str) -> Outcome: return self.baseline()
    def withdrawal_after_support(self, relation: str) -> Outcome: return self.ablate(relation)

class SchemaSystem(ExternalSystem):
    system_id = "SYS_JSON_SCHEMA_VALIDATION"
    package = "jsonschema"
    relations = ("R11", "R12", "R13")
    decoys = ("R14", "R15")
    def __init__(self) -> None:
        self.schema = {"$schema":"https://json-schema.org/draft/2020-12/schema","type":"object","required":["id","lineage","payload"],"properties":{"id":{"type":"integer"},"lineage":{"const":"ORIGINAL_V1"},"payload":{"type":"string","minLength":3},"note":{"type":"string"}},"additionalProperties":True,"title":"Original envelope","description":"External schema system"}
        self.sub_schema = json.loads(json.dumps(self.schema)); self.sub_schema["properties"]["lineage"] = {"const":"SUBSTITUTE_V1"}
        self.original = {"id":7,"lineage":"ORIGINAL_V1","payload":"PASS"}
    @staticmethod
    def _valid(schema: dict[str, Any], obj: dict[str, Any]) -> bool: return Draft202012Validator(schema).is_valid(obj)
    def baseline(self) -> Outcome:
        ok = self._valid(self.schema, self.original); digest = hashlib.sha256(json.dumps(self.original, sort_keys=True).encode()).hexdigest()
        return Outcome(ok, ok, "endogenous", "draft2020-original", {"object_sha256": digest})
    def ablate(self, relation: str) -> Outcome:
        obj = dict(self.original)
        if relation == "R11": obj.pop("id")
        elif relation == "R12": obj["payload"] = 1
        elif relation == "R13": obj["lineage"] = "BROKEN"
        elif relation == "R14": obj["note"] = "decoy"
        elif relation == "R15": obj["extra"] = 999
        ok = self._valid(self.schema, obj)
        return Outcome(ok, ok, "endogenous", "draft2020-original", {"ablated": relation})
    def support_after_ablation(self, relation: str) -> Outcome:
        internal = self.ablate(relation)
        return Outcome(True, internal.original_challenge_pass, "external_support", "support-oracle", {"internal_visible": internal.visible_pass})
    def unrelated_capacity_after_ablation(self, relation: str) -> Outcome:
        obj = dict(self.original)
        if relation == "R11": obj.pop("id")
        elif relation == "R12": obj["payload"] = 1
        elif relation == "R13": obj["lineage"] = "BROKEN"
        obj.update({f"extra_{i}":i for i in range(100)}); ok = self._valid(self.schema, obj)
        return Outcome(ok, ok, "endogenous", "draft2020-original", {"extra_fields":100})
    def substitute(self) -> Outcome:
        obj = dict(self.original); obj["lineage"] = "SUBSTITUTE_V1"
        generic = self._valid(self.sub_schema, obj); original = self._valid(self.schema, obj)
        return Outcome(generic, original, "functional_substitute", "draft2020-substitute", {})
    def restore(self, relation: str) -> Outcome: return self.baseline()
    def withdrawal_after_support(self, relation: str) -> Outcome: return self.ablate(relation)
