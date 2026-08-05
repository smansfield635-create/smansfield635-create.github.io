#!/usr/bin/env python3
"""Build a frozen non-CMS hospital package from public DATASUS SIH/SUS data."""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import tempfile
from collections import defaultdict
from pathlib import Path
from typing import Any

import requests
import datasus_dbc
from dbfread import DBF

SOURCE_FILES = (
    ("2024-01", "https://ftp.datasus.gov.br/dissemin/publicos/SIHSUS/200801_/Dados/RDSP2401.dbc"),
    ("2024-02", "https://ftp.datasus.gov.br/dissemin/publicos/SIHSUS/200801_/Dados/RDSP2402.dbc"),
    ("2024-03", "https://ftp.datasus.gov.br/dissemin/publicos/SIHSUS/200801_/Dados/RDSP2403.dbc"),
)
MIN_ADMISSIONS = 20
MIN_INSTITUTIONS = 500
SAFETY_RANGES = (("T80", "T88"), ("Y40", "Y59"), ("Y60", "Y84"))


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def normalize_code(value: Any) -> str:
    return re.sub(r"[^A-Z0-9]", "", str(value or "").upper())


def is_safety_event(code: str) -> bool:
    code = normalize_code(code)
    if len(code) < 3:
        return False
    prefix = code[:3]
    return any(start <= prefix <= end for start, end in SAFETY_RANGES)


def text(record: dict[str, Any], key: str) -> str:
    return str(record.get(key, "") or "").strip()


def diagnosis_codes(record: dict[str, Any]) -> list[str]:
    return [
        normalize_code(value)
        for key, value in record.items()
        if key.upper().startswith("DIAG") and normalize_code(value)
    ]


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output-dir", required=True)
    parser.add_argument("--clock", default="2026-08-05T19:05:00.000Z")
    args = parser.parse_args()
    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    aggregate: dict[str, dict[str, Any]] = defaultdict(
        lambda: {
            "mortality_worse": 0,
            "mortality_reported": 0,
            "safety_worse": 0,
            "safety_reported": 0,
            "source_periods": set(),
        }
    )
    seen_admissions: set[str] = set()
    source_records: list[dict[str, Any]] = []
    total_dbf_rows = 0
    duplicate_admissions = 0

    session = requests.Session()
    session.headers["User-Agent"] = "H-Earth-IMI-Empirical-Platform/1.0"

    with tempfile.TemporaryDirectory(prefix="imi-datasus-") as tmp:
        tmp_path = Path(tmp)
        for period, url in SOURCE_FILES:
            response = session.get(url, timeout=180)
            response.raise_for_status()
            dbc_bytes = response.content
            if len(dbc_bytes) < 100_000:
                raise RuntimeError(f"DATASUS_SOURCE_TOO_SMALL:{period}:{len(dbc_bytes)}")
            dbf_bytes = datasus_dbc.decompress_bytes(dbc_bytes)
            dbf_path = tmp_path / f"RDSP{period.replace('-', '')[2:]}.dbf"
            dbf_path.write_bytes(dbf_bytes)
            period_rows = 0
            for row_index, record in enumerate(
                DBF(str(dbf_path), load=False, raw=False, char_decode_errors="ignore")
            ):
                period_rows += 1
                total_dbf_rows += 1
                cnes = text(record, "CNES")
                if not cnes or not cnes.isdigit():
                    continue
                admission = text(record, "N_AIH")
                identity = f"N_AIH:{admission}" if admission else f"{period}:{row_index}"
                if identity in seen_admissions:
                    duplicate_admissions += 1
                    continue
                seen_admissions.add(identity)

                codes = diagnosis_codes(record)
                out = aggregate[cnes]
                out["mortality_reported"] += 1
                out["mortality_worse"] += 1 if text(record, "MORTE") == "1" else 0
                if codes:
                    out["safety_reported"] += 1
                    if any(is_safety_event(code) for code in codes):
                        out["safety_worse"] += 1
                out["source_periods"].add(period)
            source_records.append(
                {
                    "period": period,
                    "url": url,
                    "httpStatus": response.status_code,
                    "dbcBytes": len(dbc_bytes),
                    "dbcSha256": sha256_bytes(dbc_bytes),
                    "dbfBytes": len(dbf_bytes),
                    "dbfSha256": sha256_bytes(dbf_bytes),
                    "dbfRows": period_rows,
                }
            )

    rows = []
    excluded_low_volume = 0
    for cnes in sorted(aggregate):
        item = aggregate[cnes]
        if item["mortality_reported"] < MIN_ADMISSIONS:
            excluded_low_volume += 1
            continue
        rows.append(
            {
                "facility_id": cnes,
                "mortality_worse": item["mortality_worse"],
                "mortality_reported": item["mortality_reported"],
                "safety_worse": item["safety_worse"],
                "safety_reported": item["safety_reported"],
                "overall_rating": None,
                "source_periods": sorted(item["source_periods"]),
            }
        )

    if len(rows) < MIN_INSTITUTIONS:
        raise RuntimeError(f"DATASUS_MINIMUM_INSTITUTIONS_NOT_MET:{len(rows)}")
    if len({row["facility_id"] for row in rows}) != len(rows):
        raise RuntimeError("DATASUS_DUPLICATE_FACILITY_ID")

    source_identity = {
        "schemaVersion": "IMI_PHASE_3_DATASUS_HOSPITAL_SOURCE_IDENTITY_v1",
        "observedAt": args.clock,
        "sourceId": "BRAZIL_DATASUS_SIH_SUS_SAO_PAULO_Q1_2024_v1",
        "country": "Brazil",
        "state": "Sao Paulo",
        "informationSystem": "SIH/SUS AIH Reduced Data",
        "sourceFiles": source_records,
        "totalDbfRows": total_dbf_rows,
        "deduplicatedAdmissions": len(seen_admissions),
        "duplicateAdmissionRowsExcluded": duplicate_admissions,
        "institutionsBeforeVolumeGate": len(aggregate),
        "institutionsExcludedBelowMinimumAdmissions": excluded_low_volume,
        "admittedInstitutions": len(rows),
        "minimumAdmissionsPerInstitution": MIN_ADMISSIONS,
        "minimumInstitutionsRequired": MIN_INSTITUTIONS,
        "sourceOverlapWithCmsDevelopmentData": False,
        "mappingContract": {
            "caseIdentity": "CNES",
            "mortalityReported": "ALL_DEDUPLICATED_ADMISSIONS",
            "mortalityWorse": "MORTE_EQUALS_1",
            "safetyReported": "ADMISSIONS_WITH_ANY_USABLE_DIAGNOSIS",
            "safetyWorse": "ANY_DIAGNOSIS_IN_T80_T88_Y40_Y59_Y60_Y84",
        },
    }
    package = {
        "schemaVersion": "IMI_PHASE_3_NON_CMS_HOSPITAL_PACKAGE_v1",
        "sourceIdentity": source_identity,
        "rows": rows,
        "admission": {
            "uniqueInstitutionIdentities": True,
            "minimumInstitutionCountSatisfied": len(rows) >= MIN_INSTITUTIONS,
            "requiredFactorCountsPresent": all(
                row["mortality_reported"] > 0 and row["safety_reported"] > 0
                for row in rows
            ),
            "developmentSourceOverlapExcluded": True,
        },
    }
    canonical = json.dumps(package, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
    package["packageSha256"] = hashlib.sha256(canonical.encode("utf-8")).hexdigest()

    (output_dir / "datasus-hospital-source-identity.v1.json").write_text(
        json.dumps(source_identity, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )
    (output_dir / "datasus-hospital-package.v1.json").write_text(
        json.dumps(package, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )
    print(json.dumps({
        "result": "PASS_DATASUS_NON_CMS_PACKAGE_CONSTRUCTED",
        "admittedInstitutions": len(rows),
        "totalDbfRows": total_dbf_rows,
        "packageSha256": package["packageSha256"],
    }, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
