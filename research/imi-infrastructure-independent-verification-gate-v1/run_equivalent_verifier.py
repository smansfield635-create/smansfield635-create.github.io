#!/usr/bin/env python3

from __future__ import annotations

import datetime as dt
import hashlib
import json
import platform
import subprocess
import sys
from pathlib import Path

AUTHORITATIVE_HEAD = "5941e4841f2faf2664a0ec400642d85fd68e37e9"
AUTHORITATIVE_TREE = "fd9c7e0402075725f3262c4c1394ae2b7db53d49"
PACKAGE_DIR = Path("research/route-operator-platform-v1")
OUTPUT_DIR = Path("verification-output")


def run(command: list[str], cwd: Path) -> dict[str, object]:
    completed = subprocess.run(
        command,
        cwd=cwd,
        text=True,
        capture_output=True,
        check=False,
    )
    return {
        "command": command,
        "returncode": completed.returncode,
        "stdout": completed.stdout,
        "stderr": completed.stderr,
    }


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def git_value(repository_root: Path, expression: str) -> str:
    return subprocess.check_output(
        ["git", "rev-parse", expression],
        cwd=repository_root,
        text=True,
    ).strip()


def main() -> int:
    repository_root = Path(__file__).resolve().parents[2]
    package_dir = repository_root / PACKAGE_DIR
    output_dir = repository_root / OUTPUT_DIR
    output_dir.mkdir(exist_ok=True)

    head = git_value(repository_root, "HEAD")
    tree = git_value(repository_root, "HEAD^{tree}")

    if head != AUTHORITATIVE_HEAD or tree != AUTHORITATIVE_TREE:
        raise SystemExit(
            json.dumps(
                {
                    "status": "FAIL",
                    "reason": "AUTHORITATIVE_IDENTITY_MISMATCH",
                    "expected_head": AUTHORITATIVE_HEAD,
                    "observed_head": head,
                    "expected_tree": AUTHORITATIVE_TREE,
                    "observed_tree": tree,
                },
                indent=2,
                sort_keys=True,
            )
        )

    commands = [
        [sys.executable, "-m", "unittest", "-v", "test_route_operator_platform_v1.py"],
        [sys.executable, "-m", "unittest", "-v", "test_pointer_custody_v1.py"],
    ]
    command_results = [run(command, package_dir) for command in commands]

    demonstration_path = output_dir / "route-operator-platform-v1-demo.receipt.json"
    demonstration = run(
        [sys.executable, "demo_route_operator_platform_v1.py"],
        package_dir,
    )
    demonstration_path.write_text(str(demonstration["stdout"]), encoding="utf-8")

    integrity_script = """
from pathlib import Path
import json
from route_operator_platform_v1 import verify_imi_package_pointer, verify_platform_manifest
repository_root = Path.cwd().parents[1]
manifest_errors = verify_platform_manifest(repository_root)
pointer = json.loads(Path('IMI_PACKAGE_POINTER.json').read_text(encoding='utf-8'))
pointer_errors = verify_imi_package_pointer(pointer)
print(json.dumps({'manifest_errors': manifest_errors, 'pointer_errors': pointer_errors}, sort_keys=True))
raise SystemExit(1 if manifest_errors or pointer_errors else 0)
"""
    integrity = run([sys.executable, "-c", integrity_script], package_dir)

    json_targets = [
        package_dir / "PLATFORM_AUTHORITY.json",
        package_dir / "IMI_PACKAGE_POINTER.json",
        package_dir / "MANIFEST_SHA256.json",
        demonstration_path,
    ]
    json_validation_errors: list[str] = []
    for target in json_targets:
        try:
            json.loads(target.read_text(encoding="utf-8"))
        except Exception as exc:  # noqa: BLE001
            json_validation_errors.append(f"{target}: {exc}")

    input_hashes = {
        str(path.relative_to(repository_root)): sha256(path)
        for path in json_targets[:-1]
    }

    all_commands_pass = all(result["returncode"] == 0 for result in command_results)
    overall_pass = (
        all_commands_pass
        and demonstration["returncode"] == 0
        and integrity["returncode"] == 0
        and not json_validation_errors
    )

    receipt = {
        "receipt_id": "IMI_INFRASTRUCTURE_INDEPENDENT_EQUIVALENT_VERIFIER_RECEIPT_v1",
        "timestamp_utc": dt.datetime.now(dt.timezone.utc).isoformat(),
        "authoritative_head": AUTHORITATIVE_HEAD,
        "authoritative_tree": AUTHORITATIVE_TREE,
        "observed_head": head,
        "observed_tree": tree,
        "python_version": platform.python_version(),
        "platform": platform.platform(),
        "commands": command_results,
        "demonstration": demonstration,
        "integrity": integrity,
        "json_validation_errors": json_validation_errors,
        "input_sha256": input_hashes,
        "demonstration_receipt_sha256": sha256(demonstration_path),
        "overall": "PASS" if overall_pass else "FAIL",
    }

    receipt_path = output_dir / "imi-equivalent-verifier.receipt.json"
    receipt_path.write_text(json.dumps(receipt, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(json.dumps(receipt, indent=2, sort_keys=True))
    return 0 if overall_pass else 1


if __name__ == "__main__":
    raise SystemExit(main())
