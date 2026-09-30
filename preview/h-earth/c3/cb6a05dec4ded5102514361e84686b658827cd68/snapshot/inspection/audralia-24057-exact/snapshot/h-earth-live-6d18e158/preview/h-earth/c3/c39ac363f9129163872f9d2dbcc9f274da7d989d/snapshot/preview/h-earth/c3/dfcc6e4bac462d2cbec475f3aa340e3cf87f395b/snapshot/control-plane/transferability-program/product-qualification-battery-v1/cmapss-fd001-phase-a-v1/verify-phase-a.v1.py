#!/usr/bin/env python3
"""Static verifier for the C-MAPSS FD001 Phase A construction candidate.

This verifier performs no network access, source acquisition, model execution,
or outcome access.
"""
from __future__ import annotations

import argparse
import ast
import hashlib
import json
from pathlib import Path

EXPECTED_MAIN = "4d8ba163f23e29a7c3cccb701ccf69e9ae04958e"
EXPECTED_TREE = "7c04bf4e3631bdb91e873ebb89323afd1095a53e"
EXPECTED_URL = (
    "https://phm-datasets.s3.amazonaws.com/NASA/"
    "6.+Turbofan+Engine+Degradation+Simulation+Data+Set.zip"
)
EXPECTED_MD5 = "a83e8f128c59fc5614a4ca2e42a2e30c"
SAFE = ["train_FD001.txt", "test_FD001.txt"]
OUTCOME = "RUL_FD001.txt"
BUILDER = "GALAXY_TAB_A9_RESEARCH_TRANSFERABILITY_TRANSLATION_BUILDER"

FORBIDDEN_SOURCE_FRAGMENTS = (
    "hankroark/Turbofan-Engine-Degradation",
    "raw.githubusercontent.com/hankroark",
)
FORBIDDEN_RESULT_TOKENS = (
    "RESULT_POINTER",
    "observed_rul",
    "true_rul",
    "rul_values",
    "outcome_values",
)


class VerificationError(RuntimeError):
    pass


def require(condition: bool, message: str) -> None:
    if not condition:
        raise VerificationError(message)


def load_json(path: Path) -> dict:
    with path.open("r", encoding="utf-8") as stream:
        return json.load(stream)


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def inspect_adapter(path: Path) -> dict[str, object]:
    source = path.read_text(encoding="utf-8")
    tree = ast.parse(source, filename=str(path))

    imported_roots: set[str] = set()
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            imported_roots.update(alias.name.split(".")[0] for alias in node.names)
        elif isinstance(node, ast.ImportFrom) and node.module:
            imported_roots.add(node.module.split(".")[0])

    allowed_imports = {
        "__future__", "argparse", "hashlib", "json", "platform", "shutil",
        "sys", "tempfile", "urllib", "zipfile", "pathlib"
    }
    require(imported_roots <= allowed_imports, f"non-stdlib/unapproved imports: {sorted(imported_roots - allowed_imports)}")
    constants: dict[str, object] = {}
    for node in tree.body:
        if isinstance(node, ast.Assign) and len(node.targets) == 1 and isinstance(node.targets[0], ast.Name):
            try:
                constants[node.targets[0].id] = ast.literal_eval(node.value)
            except (ValueError, TypeError):
                pass
    require(constants.get("OFFICIAL_DISTRIBUTION_URL") == EXPECTED_URL, "official NASA distribution URL missing or drifted")
    require(constants.get("EXPECTED_ARCHIVE_MD5") == EXPECTED_MD5, "frozen expected archive MD5 missing or drifted")
    require(f'FORBIDDEN_OUTCOME_BASENAME = "{OUTCOME}"' in source, "outcome prohibition constant missing")
    require("archive_hashes = hash_file(archive_path)" in source, "archive hashing missing")
    require('if archive_hashes["md5"] != EXPECTED_ARCHIVE_MD5:' in source, "pre-member MD5 gate missing")
    require("with zipfile.ZipFile(archive_path, \"r\") as zf:" in source, "archive open missing")
    require(
        source.index('if archive_hashes["md5"] != EXPECTED_ARCHIVE_MD5:')
        < source.index('with zipfile.ZipFile(archive_path, "r") as zf:'),
        "archive is opened before checksum gate",
    )
    require("zf.open(info, \"r\")" in source, "safe member streaming missing")
    require("Path(info.filename).name not in SAFE_MEMBER_BASENAMES" in source, "safe-member open guard missing")
    require(".extract(" not in source and ".extractall(" not in source, "ZipFile extraction API is forbidden")
    for fragment in FORBIDDEN_SOURCE_FRAGMENTS:
        require(fragment not in source, f"third-party mirror reference present: {fragment}")
    return {"sha256": sha256(path), "imports": sorted(imported_roots)}


def validate_binding(binding: dict) -> None:
    require(binding.get("schema") == "CONTROL_PLANE_CMAPSS_FD001_SOURCE_BINDING_v1", "source binding schema mismatch")
    gpq = binding.get("governingProductQualification", {})
    require(gpq.get("main") == EXPECTED_MAIN and gpq.get("tree") == EXPECTED_TREE, "governing Product Qualification identity mismatch")
    official = binding.get("officialSource", {})
    require(official.get("authority") == "NASA_AMES_PROGNOSTICS_CENTER_OF_EXCELLENCE", "official source authority mismatch")
    require(official.get("distributionUrl") == EXPECTED_URL, "official source URL mismatch")
    preservation = binding.get("independentPreservationEvidence", {})
    require(preservation.get("expectedArchiveMd5") == EXPECTED_MD5, "preservation checksum mismatch")
    require(preservation.get("role") == "INDEPENDENT_PRESERVATION_CHECKSUM_EVIDENCE_NOT_SOURCE_AUTHORITY", "preservation role inflation")
    boundary = binding.get("archiveBoundary", {})
    require(boundary.get("admissibleMemberBasenames") == SAFE, "safe archive member set mismatch")
    forbidden = boundary.get("forbiddenMembers", [])
    require(len(forbidden) == 1 and forbidden[0].get("basename") == OUTCOME, "outcome member prohibition missing")
    require(forbidden[0].get("contentRead") is False and forbidden[0].get("extract") is False and forbidden[0].get("handoff") is False, "outcome prohibition weakened")
    require(boundary.get("blindExecutorMayReceiveArchive") is False, "blind executor may not receive source archive")
    roles = binding.get("roleSeparation", {})
    require(roles.get("translationBuilder") == BUILDER, "translation builder mismatch")
    require(roles.get("sourceBindingExecutor") == "UNASSIGNED_SEPARATE_ADMISSION_REQUIRED", "source-binding executor prematurely assigned")
    require(roles.get("blindExecutor") == "UNASSIGNED_SEPARATE_ADMISSION_REQUIRED", "blind executor prematurely assigned")
    require(roles.get("pairwiseDistinctRequired") is True, "pairwise role separation missing")
    execution = binding.get("executionState", {})
    require(execution.get("sourceDownload") == "NOT_STARTED", "source download state inflated")
    require(execution.get("heldOutOutcomeAccess") == "PROHIBITED", "outcome access not prohibited")
    require(execution.get("scientificClaimAuthority") is False, "scientific claim authority inflated")


def validate_packet(packet: dict) -> None:
    require(packet.get("schema") == "CONTROL_PLANE_CMAPSS_FD001_BLIND_EXECUTION_PACKET_v1", "blind packet schema mismatch")
    require(packet.get("phase") == "PHASE_A_PACKET_FREEZE_ONLY", "packet phase mismatch")
    allowed = packet.get("allowedBlindInputs", [])
    allowed_basenames = [entry.get("basename") for entry in allowed if entry.get("basename") in SAFE]
    require(allowed_basenames == SAFE, "blind safe input set mismatch")
    require(all(entry.get("basename") != OUTCOME for entry in allowed), "outcome appears in allowed blind inputs")
    forbidden = packet.get("forbiddenBlindInputs", [])
    require(any(entry.get("basename") == OUTCOME for entry in forbidden), "outcome not forbidden from blind inputs")
    roles = packet.get("roleSeparation", {})
    require(roles.get("translationBuilder") == BUILDER, "packet builder mismatch")
    require(roles.get("sourceBindingExecutor") == "UNASSIGNED_SEPARATE_ADMISSION_REQUIRED", "packet source executor prematurely assigned")
    require(roles.get("blindExecutor") == "UNASSIGNED_SEPARATE_ADMISSION_REQUIRED", "packet blind executor prematurely assigned")
    require(roles.get("pairwiseDistinctRequired") is True, "packet pairwise role separation missing")
    authority = packet.get("executionAuthority", {})
    require(all(value is False for value in authority.values()), "Phase A packet contains execution or merge authority")
    receipt = packet.get("sourceBindingReceiptRequirements", {})
    require(receipt.get("expectedArchiveMd5") == EXPECTED_MD5, "packet checksum gate mismatch")
    require(receipt.get("outcomeBytesRead") is False and receipt.get("outcomeExtracted") is False, "packet outcome receipt gate weakened")
    require(receipt.get("archiveRetained") is False, "packet permits archive handoff")


def scan_candidate_text(paths: list[Path]) -> None:
    combined = "\n".join(path.read_text(encoding="utf-8") for path in paths)
    for fragment in FORBIDDEN_SOURCE_FRAGMENTS:
        require(fragment not in combined, f"third-party source fragment leaked into candidate: {fragment}")
    lower = combined.lower()
    for token in FORBIDDEN_RESULT_TOKENS:
        require(token.lower() not in lower, f"historical/result token leaked into candidate: {token}")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dir", type=Path, default=Path(__file__).resolve().parent)
    parser.add_argument("--receipt", type=Path)
    args = parser.parse_args()

    directory = args.dir.resolve()
    binding_path = directory / "source-binding.v1.json"
    adapter_path = directory / "nasa-source-acquisition.v1.py"
    packet_path = directory / "blind-execution-packet.v1.json"
    verifier_path = directory / "verify-phase-a.v1.py"
    exact_paths = [binding_path, adapter_path, packet_path, verifier_path]
    require(all(path.is_file() for path in exact_paths), "one or more exact Phase A files are missing")

    binding = load_json(binding_path)
    packet = load_json(packet_path)
    validate_binding(binding)
    validate_packet(packet)
    adapter_evidence = inspect_adapter(adapter_path)
    scan_candidate_text([binding_path, adapter_path, packet_path])

    receipt = {
        "schema": "CONTROL_PLANE_CMAPSS_FD001_PHASE_A_STATIC_VERIFICATION_RECEIPT_v1",
        "status": "PASS",
        "networkAccess": False,
        "sourceAcquisitionExecuted": False,
        "studyExecuted": False,
        "outcomeAccessed": False,
        "translationBuilder": BUILDER,
        "sourceBindingExecutor": "UNASSIGNED_SEPARATE_ADMISSION_REQUIRED",
        "blindExecutor": "UNASSIGNED_SEPARATE_ADMISSION_REQUIRED",
        "files": {path.name: sha256(path) for path in exact_paths},
        "adapterEvidence": adapter_evidence,
        "stopBoundary": "STOP_BEFORE_SOURCE_BINDING_EXECUTION_OR_PHASE_B_BLIND_TRIAL",
    }
    rendered = json.dumps(receipt, indent=2, sort_keys=True) + "\n"
    if args.receipt:
        if args.receipt.exists():
            raise VerificationError("verification receipt path already exists")
        args.receipt.parent.mkdir(parents=True, exist_ok=True)
        args.receipt.write_text(rendered, encoding="utf-8")
    print(rendered, end="")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except VerificationError as exc:
        print(json.dumps({"schema": "CONTROL_PLANE_CMAPSS_FD001_PHASE_A_STATIC_VERIFICATION_RECEIPT_v1", "status": "FAIL_CLOSED", "error": str(exc)}))
        raise SystemExit(2)
