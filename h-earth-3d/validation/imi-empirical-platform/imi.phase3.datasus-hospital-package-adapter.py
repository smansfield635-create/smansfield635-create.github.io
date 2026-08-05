#!/usr/bin/env python3
"""Build a frozen non-CMS hospital package from public DATASUS SIH/SUS data.

The execution uses the PySUS 2.7.0 DuckLake mirror of DATASUS parquet objects.
This is an access-path repair only; the frozen source periods, case identity,
and mortality/safety mappings remain unchanged.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

import duckdb
from pysus import sih

MIN_ADMISSIONS = 20
MIN_INSTITUTIONS = 500
SOURCE_PERIODS = ("2024-01", "2024-02", "2024-03")


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def quote_identifier(value: str) -> str:
    return '"' + value.replace('"', '""') + '"'


def canonical_sha256(value: Any) -> str:
    text = json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output-dir", required=True)
    parser.add_argument("--clock", default="2026-08-05T19:45:00.000Z")
    args = parser.parse_args()
    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    paths = [Path(item) for item in sih(
        state="SP",
        year=2024,
        month=[1, 2, 3],
        show_progress=False,
        as_dataframe=False,
    )]
    if len(paths) < 3:
        raise RuntimeError(f"PYSUS_DUCKLAKE_EXPECTED_THREE_MONTH_FILES:{len(paths)}")
    missing_paths = [str(path) for path in paths if not path.exists()]
    if missing_paths:
        raise RuntimeError(f"PYSUS_DUCKLAKE_LOCAL_FILES_MISSING:{','.join(missing_paths)}")

    path_sql = ", ".join("'" + str(path).replace("'", "''") + "'" for path in paths)
    relation_sql = f"read_parquet([{path_sql}], union_by_name=true)"
    schema_rows = duckdb.sql(f"DESCRIBE SELECT * FROM {relation_sql}").fetchall()
    columns = [str(row[0]) for row in schema_rows]
    by_upper = {column.upper(): column for column in columns}

    cnes_column = by_upper.get("CNES")
    morte_column = by_upper.get("MORTE")
    admission_column = by_upper.get("N_AIH")
    diagnosis_columns = [column for column in columns if column.upper().startswith("DIAG")]
    if not cnes_column or not morte_column or not diagnosis_columns:
        raise RuntimeError(
            "PYSUS_SIH_REQUIRED_COLUMNS_MISSING:"
            + json.dumps({
                "CNES": bool(cnes_column),
                "MORTE": bool(morte_column),
                "N_AIH": bool(admission_column),
                "diagnosisColumns": diagnosis_columns,
            }, sort_keys=True)
        )

    cnes = quote_identifier(cnes_column)
    morte = quote_identifier(morte_column)
    admission = quote_identifier(admission_column) if admission_column else None
    diag_exprs = [
        f"regexp_replace(upper(coalesce(cast({quote_identifier(column)} as varchar), '')), '[^A-Z0-9]', '', 'g')"
        for column in diagnosis_columns
    ]
    has_diagnosis = " OR ".join(f"length({expr}) > 0" for expr in diag_exprs)
    safety_event = " OR ".join(
        f"(substr({expr}, 1, 3) between 'T80' and 'T88' OR "
        f"substr({expr}, 1, 3) between 'Y40' and 'Y59' OR "
        f"substr({expr}, 1, 3) between 'Y60' and 'Y84')"
        for expr in diag_exprs
    )
    admission_identity = (
        f"case when trim(coalesce(cast({admission} as varchar), '')) <> '' "
        f"then trim(cast({admission} as varchar)) else concat('ROW:', cast(source_row as varchar)) end"
        if admission
        else "concat('ROW:', cast(source_row as varchar))"
    )

    query = f"""
        WITH raw AS (
            SELECT *, row_number() OVER () AS source_row
            FROM {relation_sql}
        ), normalized AS (
            SELECT
                regexp_replace(trim(cast({cnes} as varchar)), '[^0-9]', '', 'g') AS facility_id,
                {admission_identity} AS admission_identity,
                CASE WHEN trim(coalesce(cast({morte} as varchar), '0')) IN ('1', '1.0') THEN 1 ELSE 0 END AS mortality_event,
                CASE WHEN ({has_diagnosis}) THEN 1 ELSE 0 END AS safety_reported_event,
                CASE WHEN ({safety_event}) THEN 1 ELSE 0 END AS safety_event,
                source_row
            FROM raw
        ), deduplicated AS (
            SELECT *, row_number() OVER (PARTITION BY admission_identity ORDER BY source_row) AS duplicate_rank
            FROM normalized
            WHERE facility_id <> ''
        )
        SELECT
            facility_id,
            sum(mortality_event)::BIGINT AS mortality_worse,
            count(*)::BIGINT AS mortality_reported,
            sum(safety_event)::BIGINT AS safety_worse,
            sum(safety_reported_event)::BIGINT AS safety_reported
        FROM deduplicated
        WHERE duplicate_rank = 1
        GROUP BY facility_id
        HAVING count(*) >= {MIN_ADMISSIONS}
        ORDER BY facility_id
    """
    aggregated = duckdb.sql(query).fetchall()
    rows = [
        {
            "facility_id": str(record[0]),
            "mortality_worse": int(record[1]),
            "mortality_reported": int(record[2]),
            "safety_worse": int(record[3]),
            "safety_reported": int(record[4]),
            "overall_rating": None,
            "source_periods": list(SOURCE_PERIODS),
        }
        for record in aggregated
    ]
    rows = [row for row in rows if row["safety_reported"] > 0]
    if len(rows) < MIN_INSTITUTIONS:
        raise RuntimeError(f"DATASUS_MINIMUM_INSTITUTIONS_NOT_MET:{len(rows)}")
    if len({row["facility_id"] for row in rows}) != len(rows):
        raise RuntimeError("DATASUS_DUPLICATE_FACILITY_ID")
    for row in rows:
        if row["mortality_worse"] > row["mortality_reported"]:
            raise RuntimeError(f"DATASUS_MORTALITY_COUNT_INVALID:{row['facility_id']}")
        if row["safety_worse"] > row["safety_reported"]:
            raise RuntimeError(f"DATASUS_SAFETY_COUNT_INVALID:{row['facility_id']}")

    source_files = [
        {
            "localPath": str(path),
            "basename": path.name,
            "bytes": path.stat().st_size,
            "sha256": sha256_file(path),
        }
        for path in sorted(paths, key=lambda item: item.name)
    ]
    source_identity = {
        "schemaVersion": "IMI_PHASE_3_DATASUS_HOSPITAL_SOURCE_IDENTITY_v1",
        "observedAt": args.clock,
        "sourceId": "BRAZIL_DATASUS_SIH_SUS_SAO_PAULO_Q1_2024_v1",
        "country": "Brazil",
        "state": "Sao Paulo",
        "informationSystem": "SIH/SUS AIH Reduced Data",
        "accessRepresentation": "PYSUS_2_7_0_DUCKLAKE_PARQUET_MIRROR_OF_DATASUS",
        "sourcePeriods": list(SOURCE_PERIODS),
        "sourceFiles": source_files,
        "schemaColumns": columns,
        "diagnosisColumnsUsed": diagnosis_columns,
        "admittedInstitutions": len(rows),
        "minimumAdmissionsPerInstitution": MIN_ADMISSIONS,
        "minimumInstitutionsRequired": MIN_INSTITUTIONS,
        "sourceOverlapWithCmsDevelopmentData": False,
        "mappingContract": {
            "caseIdentity": "CNES",
            "deduplicationIdentity": "N_AIH_WHEN_PRESENT_OTHERWISE_SOURCE_ROW",
            "mortalityReported": "ALL_DEDUPLICATED_ADMISSIONS",
            "mortalityWorse": "MORTE_EQUALS_1",
            "safetyReported": "ADMISSIONS_WITH_ANY_USABLE_DIAGNOSIS",
            "safetyWorse": "ANY_DIAGNOSIS_IN_T80_T88_Y40_Y59_Y60_Y84"
        }
    }
    package_body = {
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
            "developmentSourceOverlapExcluded": True
        }
    }
    package = {**package_body, "packageSha256": canonical_sha256(package_body)}

    (output_dir / "datasus-hospital-source-identity.v1.json").write_text(
        json.dumps(source_identity, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )
    (output_dir / "datasus-hospital-package.v1.json").write_text(
        json.dumps(package, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )
    print(json.dumps({
        "result": "PASS_DATASUS_NON_CMS_PACKAGE_CONSTRUCTED",
        "accessRepresentation": source_identity["accessRepresentation"],
        "admittedInstitutions": len(rows),
        "packageSha256": package["packageSha256"]
    }, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
