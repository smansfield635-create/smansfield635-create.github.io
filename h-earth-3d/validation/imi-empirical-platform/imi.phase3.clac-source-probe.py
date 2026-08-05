#!/usr/bin/env python3
"""Inspect the public CLAC ZIP by HTTP range without downloading the 23.9 GB archive."""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

from remotezip import RemoteZip

ARCHIVE_URL = "https://data.csail.mit.edu/placesaudio/CLAC-Dataset.zip"


def classify(name: str) -> list[str]:
    lowered = name.lower()
    labels = []
    if any(token in lowered for token in ("metadata", "demographic", "speaker", "worker")):
        labels.append("METADATA_CANDIDATE")
    if "cookie" in lowered:
        labels.append("COOKIE_THEFT_CANDIDATE")
    if any(lowered.endswith(ext) for ext in (".txt", ".csv", ".json", ".tsv")):
        labels.append("TEXT_OR_TABLE")
    if any(lowered.endswith(ext) for ext in (".png", ".jpg", ".jpeg", ".tif", ".tiff")):
        labels.append("IMAGE")
    if lowered.endswith((".wav", ".flac", ".mp3")):
        labels.append("AUDIO")
    return labels


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output-dir", required=True)
    parser.add_argument("--clock", default="2026-08-05T19:05:00.000Z")
    args = parser.parse_args()
    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    try:
        with RemoteZip(ARCHIVE_URL) as archive:
            infos = archive.infolist()
            inventory = [
                {
                    "name": info.filename,
                    "compressedBytes": info.compress_size,
                    "uncompressedBytes": info.file_size,
                    "crc32": f"{info.CRC:08x}",
                    "classes": classify(info.filename),
                }
                for info in infos
            ]
        candidates = [entry for entry in inventory if entry["classes"]]
        cookie = [entry for entry in candidates if "COOKIE_THEFT_CANDIDATE" in entry["classes"]]
        metadata = [entry for entry in candidates if "METADATA_CANDIDATE" in entry["classes"]]
        status = "PASS_CLAC_REMOTE_ZIP_INVENTORY"
        error = None
    except Exception as exc:
        inventory = []
        candidates = []
        cookie = []
        metadata = []
        status = "HELD_CLAC_REMOTE_ZIP_INVENTORY_FAILED"
        error = f"{type(exc).__name__}:{exc}"

    digest_source = json.dumps(inventory, sort_keys=True, separators=(",", ":"))
    result = {
        "schemaVersion": "IMI_PHASE_3_CLAC_SOURCE_PROBE_v1",
        "result": status,
        "observedAt": args.clock,
        "archiveUrl": ARCHIVE_URL,
        "archiveEntries": len(inventory),
        "classifiedCandidates": len(candidates),
        "cookieTheftCandidates": cookie,
        "metadataCandidates": metadata,
        "inventorySha256": hashlib.sha256(digest_source.encode("utf-8")).hexdigest(),
        "error": error,
        "boundaries": {
            "fullArchiveDownloaded": False,
            "audioDownloaded": False,
            "participantContentInspected": False,
            "featureExtractionExecuted": False,
            "routeRetuned": False,
        },
    }
    (output_dir / "clac-source-probe.v1.json").write_text(
        json.dumps(result, indent=2) + "\n", encoding="utf-8"
    )
    (output_dir / "clac-source-inventory.v1.json").write_text(
        json.dumps(inventory, indent=2) + "\n", encoding="utf-8"
    )
    print(json.dumps(result, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
