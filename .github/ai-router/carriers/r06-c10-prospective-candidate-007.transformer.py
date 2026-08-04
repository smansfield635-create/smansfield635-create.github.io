#!/usr/bin/env python3
from __future__ import annotations

import argparse
from pathlib import Path


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"PATCH_TARGET_COUNT:{label}:{count}")
    return text.replace(old, new, 1)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()

    text = Path(args.source).read_text(encoding="utf-8").replace("006", "007")
    text = replace_once(
        text,
        "SOURCE_DIAGNOSTIC_HEAD='0074e438303e10bcdbc389ce900becc3cddf16c4'",
        "SOURCE_DIAGNOSTIC_HEAD='0064e438303e10bcdbc389ce900becc3cddf16c4'",
        "diagnostic_source_head",
    )
    expected_branch = "CARRIER_BRANCH='work/r06-c10-candidate-007-admission'"
    if expected_branch not in text:
        raise RuntimeError("PATCH_TARGET_MISSING:carrier_branch")

    request_marker = (
        "request['operationId']='H_EARTH_R06_C10_PROSPECTIVE_"
        "LANDFORM_CANDIDATE_CONSTRUCTION_007'\n"
    )
    request_correction = """fall_operation=next(operation for operation in request['operations'] if operation['operator']=='FALL_FACE')
fall_operation['centerZ']=-178
fall_operation['halfLength']=14
"""
    text = replace_once(
        text,
        request_marker,
        request_marker + request_correction,
        "request_fall_transition",
    )

    candidate_marker = "candidate=show(source_paths['candidate']).replace('002','007')\n"
    candidate_correction = """candidate=candidate.replace(
    "{operator:'FALL_FACE',centerX:44,centerZ:-180,drop:4,feather:6,halfLength:12,halfWidth:10,rotationDegrees:-90}",
    "{operator:'FALL_FACE',centerX:44,centerZ:-178,drop:4,feather:6,halfLength:14,halfWidth:10,rotationDegrees:-90}"
)
"""
    text = replace_once(
        text,
        candidate_marker,
        candidate_marker + candidate_correction,
        "candidate_fall_transition",
    )

    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(text, encoding="utf-8")


if __name__ == "__main__":
    main()
