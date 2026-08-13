#!/usr/bin/env python3
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONTROL = ROOT / "laws/control-plane/cp6-context"


def load(name: str) -> dict:
    return json.loads((CONTROL / name).read_text(encoding="utf-8"))


def ids(path: str) -> set[str]:
    text = (ROOT / path).read_text(encoding="utf-8")
    return set(re.findall(r'data-content-id="(CP6-CONTENT-\d+)"', text))


def main() -> None:
    crosswalk = load("laws-frontier-compatibility-crosswalk-v1.json")
    legacy = load("legacy-benchmark-disposition-v1.json")
    receipt = load("contextual-renewal-verification-v1.json")
    routes = json.loads((ROOT / "laws/control-plane/cp6-1/cp6-2-route-contract.json").read_text(encoding="utf-8"))

    assert crosswalk["contract"] == "LAWS_FRONTIER_COMPATIBILITY_CROSSWALK_v1"
    assert len(crosswalk["mappings"]) == 11
    assert routes["compatibility_binding_count"] == 9
    assert routes["bindings_with_complete_required_field_set"] == 9
    assert receipt["frontier_files_mutated"] == 0
    assert receipt["compass_runtime_files_mutated"] == 0
    assert legacy["current_compass_contract"]["top_level_authorities"] == 6
    assert legacy["current_compass_contract"]["law_authorities"] == 4
    assert legacy["current_compass_contract"]["total_child_routes"] == 24

    expected = {
        "laws/research/applied-investigations/index.html": 11,
        "laws/research/evidence-and-sources/index.html": 6,
        "laws/research/methods-and-models/index.html": 10,
        "laws/research/findings-and-boundaries/index.html": 7,
        "laws/test/admission-and-baseline/index.html": 2,
        "laws/test/forward-construction/index.html": 1,
        "laws/test/reverse-audit/index.html": 4,
        "laws/test/result-and-record/index.html": 7,
    }
    seen: set[str] = set()
    for path, count in expected.items():
        current = ids(path)
        assert len(current) == count, f"{path}: expected {count}, found {len(current)}"
        assert seen.isdisjoint(current), f"{path}: duplicate CP6 identity"
        seen.update(current)
    assert len(seen) == 48

    laws = (ROOT / "laws/index.html").read_text(encoding="utf-8")
    assert 'data-laws-category-count="6"' in laws
    assert 'data-laws-child-route-count="24"' in laws
    assert 'data-laws-controller-navigation-authority="true"' in laws
    assert 'data-laws-evidence-claim-authority="false"' in laws

    interactions = (ROOT / "laws/index.interactions.js").read_text(encoding="utf-8")
    assert 'const D=Object.freeze(["flow","integrity","reality","structure","test","research"])' in interactions
    assert 'build:"LAWS_COMPASS_CHECKPOINT_5_SINGLE_ACTIVE_OUTER_LABEL_v1"' in interactions
    assert 'getAuthorityFieldContract' in interactions

    print(json.dumps({
        "contract": "LAWS_CP6_CURRENT_AUTHORITY_VERIFICATION_v1",
        "status": "PASS",
        "canonical_records": len(seen),
        "current_compass_authorities": 6,
        "retired_public_instrumentation_required": False,
    }, indent=2))


if __name__ == "__main__":
    main()
