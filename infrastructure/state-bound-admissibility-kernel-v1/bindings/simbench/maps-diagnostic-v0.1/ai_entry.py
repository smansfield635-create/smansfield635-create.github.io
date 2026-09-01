#!/usr/bin/env python3
"""Single supported operational entry point for MAPS Diagnostic v0.1."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys
from typing import Any

from maps_diagnostic import (
    CONFIGURATION_SHA256,
    INSTRUMENT_ID,
    canonical_json_bytes,
    compute_from_json_bytes,
    sha256_bytes,
)


ROOT = Path(__file__).resolve().parent
GENERATED_PREFIXES = {"receipts", "__pycache__"}
SOURCE_SUFFIXES = {".py", ".md", ".json"}


def _write_json(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(json.dumps(value, indent=2, sort_keys=True, ensure_ascii=False, allow_nan=False).encode("utf-8") + b"\n")


def _receipt(payload: dict[str, Any]) -> dict[str, Any]:
    digest = sha256_bytes(canonical_json_bytes(payload))
    return {**payload, "receipt_sha256": digest}


def _source_files() -> list[Path]:
    files: list[Path] = []
    for path in ROOT.rglob("*"):
        if not path.is_file() or path.suffix not in SOURCE_SUFFIXES:
            continue
        relative = path.relative_to(ROOT)
        if relative.parts[0] in GENERATED_PREFIXES:
            continue
        files.append(path)
    return sorted(files, key=lambda path: path.relative_to(ROOT).as_posix())


def command_compute(args: argparse.Namespace) -> int:
    input_path = Path(args.input).resolve()
    output_path = Path(args.output).resolve()
    receipt_path = Path(args.receipt).resolve()
    raw = input_path.read_bytes()
    output = compute_from_json_bytes(raw)
    _write_json(output_path, output)
    output_bytes = output_path.read_bytes()
    receipt = _receipt({
        "schema": "MAPS_COMPUTATION_RECEIPT_v0.1",
        "instrument_id": INSTRUMENT_ID,
        "entrypoint": "ai_entry.py compute",
        "input_file": input_path.name,
        "input_sha256": hashlib.sha256(raw).hexdigest(),
        "output_file": output_path.name,
        "output_sha256": hashlib.sha256(output_bytes).hexdigest(),
        "implementation_sha256": hashlib.sha256((ROOT / "maps_diagnostic.py").read_bytes()).hexdigest(),
        "adapter_sha256": hashlib.sha256((ROOT / "simbench_maps_adapter.py").read_bytes()).hexdigest(),
        "configuration_sha256": CONFIGURATION_SHA256,
        "measurement_state": output["measurement_state"],
        "parent_execution_disposition": "DO_NOT_EXECUTE",
    })
    _write_json(receipt_path, receipt)
    print(json.dumps({"result": "COMPUTED", "measurement_state": output["measurement_state"], "receipt_sha256": receipt["receipt_sha256"]}, sort_keys=True))
    return 0


def command_compute_batch(args: argparse.Namespace) -> int:
    input_path = Path(args.input).resolve()
    output_path = Path(args.output).resolve()
    receipt_path = Path(args.receipt).resolve()
    raw = input_path.read_bytes()
    try:
        payloads = json.loads(
            raw.decode("utf-8"),
            parse_constant=lambda token: (_ for _ in ()).throw(ValueError(f"nonfinite token {token}")),
        )
    except (UnicodeDecodeError, json.JSONDecodeError, ValueError) as exc:
        raise SystemExit(f"BATCH_INPUT_INVALID_JSON:{exc}") from exc
    if not isinstance(payloads, list):
        raise SystemExit("BATCH_INPUT_MUST_BE_JSON_ARRAY")
    outputs = []
    for payload in payloads:
        row_raw = canonical_json_bytes(payload)
        outputs.append(compute_from_json_bytes(row_raw))
    _write_json(output_path, outputs)
    output_bytes = output_path.read_bytes()
    valid_count = sum(output["measurement_state"] == "VALID" for output in outputs)
    uninterpretable_count = len(outputs) - valid_count
    receipt = _receipt({
        "schema": "MAPS_BATCH_COMPUTATION_RECEIPT_v0.1",
        "instrument_id": INSTRUMENT_ID,
        "entrypoint": "ai_entry.py compute-batch",
        "input_file": input_path.name,
        "input_sha256": hashlib.sha256(raw).hexdigest(),
        "output_file": output_path.name,
        "output_sha256": hashlib.sha256(output_bytes).hexdigest(),
        "implementation_sha256": hashlib.sha256((ROOT / "maps_diagnostic.py").read_bytes()).hexdigest(),
        "configuration_sha256": CONFIGURATION_SHA256,
        "row_count": len(outputs),
        "valid_count": valid_count,
        "uninterpretable_count": uninterpretable_count,
        "parent_execution_disposition": "DO_NOT_EXECUTE",
    })
    _write_json(receipt_path, receipt)
    print(json.dumps({
        "result": "BATCH_COMPUTED",
        "row_count": len(outputs),
        "valid_count": valid_count,
        "uninterpretable_count": uninterpretable_count,
        "receipt_sha256": receipt["receipt_sha256"],
    }, sort_keys=True))
    return 0


def _run_tests() -> tuple[bool, str]:
    result = subprocess.run(
        [sys.executable, "-m", "unittest", "discover", "-s", str(ROOT / "tests"), "-p", "test_*.py", "-v"],
        cwd=ROOT,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        check=False,
    )
    return result.returncode == 0, result.stdout


def command_self_test(args: argparse.Namespace) -> int:
    passed, output = _run_tests()
    report = _receipt({
        "schema": "MAPS_SELF_TEST_REPORT_v0.1",
        "instrument_id": INSTRUMENT_ID,
        "result": "PASS" if passed else "FAIL",
        "python_version": sys.version.split()[0],
        "configuration_sha256": CONFIGURATION_SHA256,
        "test_output": output,
        "parent_execution_disposition": "DO_NOT_EXECUTE",
    })
    _write_json(Path(args.report).resolve(), report)
    print(json.dumps({"result": report["result"], "receipt_sha256": report["receipt_sha256"]}, sort_keys=True))
    return 0 if passed else 1


def command_build_manifest(args: argparse.Namespace) -> int:
    entries = []
    for path in _source_files():
        relative = path.relative_to(ROOT).as_posix()
        entries.append({"path": relative, "sha256": hashlib.sha256(path.read_bytes()).hexdigest(), "size_bytes": path.stat().st_size})
    root_material = b"".join(f"{entry['path']}\0{entry['sha256']}\n".encode("utf-8") for entry in entries)
    manifest = _receipt({
        "schema": "MAPS_SOURCE_MANIFEST_v0.1",
        "instrument_id": INSTRUMENT_ID,
        "files": entries,
        "source_root_sha256": hashlib.sha256(root_material).hexdigest(),
        "configuration_sha256": CONFIGURATION_SHA256,
        "parent_execution_disposition": "DO_NOT_EXECUTE",
    })
    _write_json(Path(args.output).resolve(), manifest)
    print(json.dumps({"result": "MANIFEST_BUILT", "file_count": len(entries), "source_root_sha256": manifest["source_root_sha256"]}, sort_keys=True))
    return 0


def command_verify_package(args: argparse.Namespace) -> int:
    manifest_path = Path(args.manifest).resolve()
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    failures: list[str] = []
    for entry in manifest.get("files", []):
        path = ROOT / entry["path"]
        if not path.is_file():
            failures.append(f"MISSING:{entry['path']}")
            continue
        actual = hashlib.sha256(path.read_bytes()).hexdigest()
        if actual != entry["sha256"]:
            failures.append(f"DIGEST_MISMATCH:{entry['path']}")
    tests_passed, test_output = _run_tests()
    if not tests_passed:
        failures.append("SELF_TEST_FAILURE")
    result = "PASS" if not failures else "FAIL"
    report = _receipt({
        "schema": "MAPS_PACKAGE_VERIFICATION_RECEIPT_v0.1",
        "instrument_id": INSTRUMENT_ID,
        "result": result,
        "manifest_sha256": hashlib.sha256(manifest_path.read_bytes()).hexdigest(),
        "verified_file_count": len(manifest.get("files", [])),
        "failures": failures,
        "test_output": test_output,
        "source_definition_status": "COMPLETE" if result == "PASS" else "HELD",
        "repository_ai_entry_status": "OPEN_FULL_CHECKOUT_AND_CANONICAL_INTAKE_REQUIRED",
        "parent_experiment_status": "CONSTRUCTION_COMPLETE_NOT_FROZEN",
        "parent_execution_disposition": "DO_NOT_EXECUTE",
        "claim_entitlement": "NONE",
    })
    _write_json(Path(args.report).resolve(), report)
    print(json.dumps({"result": result, "receipt_sha256": report["receipt_sha256"], "failures": failures}, sort_keys=True))
    return 0 if result == "PASS" else 1


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="MAPS Diagnostic v0.1 AI entry")
    subparsers = parser.add_subparsers(dest="command", required=True)

    compute = subparsers.add_parser("compute", help="compute one atomic MAPS record")
    compute.add_argument("--input", required=True)
    compute.add_argument("--output", required=True)
    compute.add_argument("--receipt", required=True)
    compute.set_defaults(handler=command_compute)

    compute_batch = subparsers.add_parser("compute-batch", help="compute a JSON array of atomic MAPS records")
    compute_batch.add_argument("--input", required=True)
    compute_batch.add_argument("--output", required=True)
    compute_batch.add_argument("--receipt", required=True)
    compute_batch.set_defaults(handler=command_compute_batch)

    self_test = subparsers.add_parser("self-test", help="run packaged conformance tests")
    self_test.add_argument("--report", required=True)
    self_test.set_defaults(handler=command_self_test)

    manifest = subparsers.add_parser("build-manifest", help="hash every source artifact")
    manifest.add_argument("--output", required=True)
    manifest.set_defaults(handler=command_build_manifest)

    verify = subparsers.add_parser("verify-package", help="verify source hashes and tests")
    verify.add_argument("--manifest", required=True)
    verify.add_argument("--report", required=True)
    verify.set_defaults(handler=command_verify_package)
    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    return int(args.handler(args))


if __name__ == "__main__":
    raise SystemExit(main())
