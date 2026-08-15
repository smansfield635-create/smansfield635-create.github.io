from __future__ import annotations
from dataclasses import dataclass
from typing import Any

@dataclass(frozen=True)
class Outcome:
    visible_pass: bool
    original_challenge_pass: bool
    provenance: str
    route_id: str
    evidence: dict[str, Any]

class ExternalSystem:
    system_id: str
    package: str
    relations: tuple[str, ...]
    decoys: tuple[str, ...]
    def baseline(self) -> Outcome: raise NotImplementedError
    def ablate(self, relation: str) -> Outcome: raise NotImplementedError
    def support_after_ablation(self, relation: str) -> Outcome: raise NotImplementedError
    def unrelated_capacity_after_ablation(self, relation: str) -> Outcome: raise NotImplementedError
    def substitute(self) -> Outcome: raise NotImplementedError
    def restore(self, relation: str) -> Outcome: raise NotImplementedError
    def withdrawal_after_support(self, relation: str) -> Outcome: raise NotImplementedError
