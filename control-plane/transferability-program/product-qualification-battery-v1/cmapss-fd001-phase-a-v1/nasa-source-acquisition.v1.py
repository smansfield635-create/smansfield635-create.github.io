#!/usr/bin/env python3
"""C-MAPSS FD001 official-source binding adapter.

Construction of this file does not authorize execution. Execution requires a
separate admitted source-binding operation and must remain distinct from the
translation builder and blind executor.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import platform
import shutil
import sys
import tempfile
import urllib.request
import zipfile
from pathlib import Path

SCHEMA = "CONTROL_PLANE_CMAPSS_FD001_SOURCE_BINDING_RECEIPT_v1"
OFFICIAL_SOURCE_AUTHORITY = "NASA_AMES_PROGNOSTICS_CENTER_OF_EXCELLENCE"
OFFICIAL_DISTRIBUTION_URL = (
    "https://phm-datasets.s3.amazonaws.com/NASA/"
    "6.+Turbofan+Engine+Degradation+Simulation+Data+Set.zip"
)
EXPECTED_ARCHIVE_MD5 = "a83e8f128c59fc5614a4ca2e42a2e30c"
SAFE_MEMBER_BASENAMES = ("train_FD001.txt", "test_FD001.txt")
FORBIDDEN_OUTCOME_BASENAME = "RUL_FD001.txt"
EXPECTED_UNIQUE_UNITS = 100
EXPECTED_COLUMNS = 26


class SourceBindingError(RuntimeError):
    pass


def hash_file(path: Path) -> dict[str, object]:
    md5 = hashlib.md5()
    sha256 = hashlib.sha256()
    size = 0
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            md5.update(chunk)
            sha256.update(chunk)
            size += len(chunk)
    return {"md5": md5.hexdigest(), "sha256": sha256.hexdigest(), "sizeBytes": size}


def locate_unique_member(zf: zipfile.ZipFile, basename: str) -> zipfile.ZipInfo:
    matches = [info for info in zf.infolist() if Path(info.filename).name == basename]
    if len(matches) != 1:
        raise SourceBindingError(f"Expected exactly one {basename}; observed {len(matches)}")
    return matches[0]


def copy_safe_member(zf: zipfile.ZipFile, info: zipfile.ZipInfo, destination: Path) -> dict[str, object]:
    if Path(info.filename).name not in SAFE_MEMBER_BASENAMES:
        raise SourceBindingError("Refusing to open a non-safe archive member")
    sha256 = hashlib.sha256()
    size = 0
    with zf.open(info, "r") as source, destination.open("xb") as target:
        while True:
            chunk = source.read(1024 * 1024)
            if not chunk:
                break
            target.write(chunk)
            sha256.update(chunk)
            size += len(chunk)
    return {"sha256": sha256.hexdigest(), "sizeBytes": size}


def validate_fd001_text(path: Path) -> dict[str, object]:
    unit_ids: set[int] = set()
    rows = 0
    with path.open("r", encoding="utf-8") as stream:
        for line_number, line in enumerate(stream, start=1):
            stripped = line.strip()
            if not stripped:
                continue
            fields = stripped.split()
            if len(fields) != EXPECTED_COLUMNS:
                raise SourceBindingError(
                    f"{path.name}:{line_number} expected {EXPECTED_COLUMNS} columns, got {len(fields)}"
                )
            try:
                unit_id = int(fields[0])
                int(fields[1])
                for value in fields[2:]:
                    float(value)
            except ValueError as exc:
                raise SourceBindingError(f"{path.name}:{line_number} contains non-numeric data") from exc
            unit_ids.add(unit_id)
            rows += 1
    if len(unit_ids) != EXPECTED_UNIQUE_UNITS:
        raise SourceBindingError(
            f"{path.name} expected {EXPECTED_UNIQUE_UNITS} unique units, got {len(unit_ids)}"
        )
    if rows == 0:
        raise SourceBindingError(f"{path.name} is empty")
    return {
        "rowCount": rows,
        "uniqueUnitCount": len(unit_ids),
        "columnCount": EXPECTED_COLUMNS,
    }


def ensure_clean_output_dir(path: Path) -> None:
    if path.exists():
        if not path.is_dir():
            raise SourceBindingError("Output path exists and is not a directory")
        if any(path.iterdir()):
            raise SourceBindingError("Output directory must be empty")
    else:
        path.mkdir(parents=True)
    if (path / FORBIDDEN_OUTCOME_BASENAME).exists():
        raise SourceBindingError("Forbidden outcome file present in output directory")


def download_official_archive(destination: Path) -> None:
    request = urllib.request.Request(
        OFFICIAL_DISTRIBUTION_URL,
        headers={"User-Agent": "control-plane-cmapss-fd001-source-binding-v1"},
    )
    with urllib.request.urlopen(request, timeout=120) as response, destination.open("xb") as target:
        if getattr(response, "status", 200) != 200:
            raise SourceBindingError(f"NASA source returned HTTP {getattr(response, 'status', None)}")
        shutil.copyfileobj(response, target, length=1024 * 1024)


def bind_source(output_dir: Path) -> dict[str, object]:
    ensure_clean_output_dir(output_dir)
    safe_objects: dict[str, object] = {}
    archive_hashes: dict[str, object]

    with tempfile.TemporaryDirectory(prefix="cmapss-fd001-source-binding-") as temp_dir:
        archive_path = Path(temp_dir) / "CMAPSSData.zip"
        download_official_archive(archive_path)

        # Critical blinding/provenance law: hash and verify the entire archive
        # before ZipFile is opened and before any member content can be read.
        archive_hashes = hash_file(archive_path)
        if archive_hashes["md5"] != EXPECTED_ARCHIVE_MD5:
            raise SourceBindingError(
                "NASA archive MD5 mismatch; no archive member content was opened"
            )

        with zipfile.ZipFile(archive_path, "r") as zf:
            safe_infos = {
                basename: locate_unique_member(zf, basename)
                for basename in SAFE_MEMBER_BASENAMES
            }
            # Observe only the forbidden member's name/metadata presence. Its
            # bytes are never opened, read, extracted, copied, or emitted.
            locate_unique_member(zf, FORBIDDEN_OUTCOME_BASENAME)

            for basename, info in safe_infos.items():
                destination = output_dir / basename
                copied = copy_safe_member(zf, info, destination)
                validation = validate_fd001_text(destination)
                safe_objects[basename] = {**copied, **validation}

        # TemporaryDirectory removes the archive before safe handoff.
        archive_path.unlink(missing_ok=True)

    adapter_sha256 = hashlib.sha256(Path(__file__).read_bytes()).hexdigest()
    return {
        "schema": SCHEMA,
        "status": "SOURCE_BOUND_SAFE_HANDOFF_READY",
        "officialSourceAuthority": OFFICIAL_SOURCE_AUTHORITY,
        "officialDistributionUrl": OFFICIAL_DISTRIBUTION_URL,
        "expectedArchiveMd5": EXPECTED_ARCHIVE_MD5,
        "observedArchiveMd5": archive_hashes["md5"],
        "archiveSha256": archive_hashes["sha256"],
        "archiveSizeBytes": archive_hashes["sizeBytes"],
        "safeObjects": safe_objects,
        "forbiddenOutcomeMemberBasename": FORBIDDEN_OUTCOME_BASENAME,
        "outcomeMemberObservedByNameOnly": True,
        "outcomeBytesRead": False,
        "outcomeExtracted": False,
        "outcomeHandedOff": False,
        "archiveRetained": False,
        "adapterSha256": adapter_sha256,
        "runtime": {
            "python": sys.version.split()[0],
            "implementation": platform.python_implementation(),
            "platform": platform.platform(),
        },
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output-dir", required=True, type=Path)
    parser.add_argument("--receipt", required=True, type=Path)
    args = parser.parse_args()

    if args.receipt.exists():
        raise SourceBindingError("Receipt path already exists")
    receipt = bind_source(args.output_dir)
    args.receipt.parent.mkdir(parents=True, exist_ok=True)
    args.receipt.write_text(json.dumps(receipt, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(json.dumps(receipt, sort_keys=True))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except SourceBindingError as exc:
        print(json.dumps({"schema": SCHEMA, "status": "FAIL_CLOSED", "error": str(exc)}), file=sys.stderr)
        raise SystemExit(2)
