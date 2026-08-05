#!/usr/bin/env python3
"""Run the frozen IMI hospital temporal holdout make-or-break test."""
from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any, Iterable

import duckdb
from pysus import sih

REPO_ROOT = Path(__file__).resolve().parents[3]
PROTOCOL_PATH = REPO_ROOT / "h-earth-3d/tools/imi-empirical-platform/generalizability/imi-hospital-temporal-holdout-make-or-break-protocol.v1.json"
ROUTE_PATH = REPO_ROOT / "h-earth-3d/tools/imi-empirical-platform/routes/cms-hospital-refresh-2026-route.v1.json"
EXPECTED_ROUTE_ID = "CMS_HOSPITAL_REFRESH_2026_BASE_ROUTE_v1"
EXPECTED_ROUTE_BLOB_SHA = "698e11bcc7b1609dd7ddc6458387349131ff8ea1"
EXPECTED_PROTOCOL_STATUS = "FROZEN_BEFORE_OUTCOME_EXECUTION"
MIN_BASELINE_INSTITUTIONS = 500


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def git_blob_sha1(data: bytes) -> str:
    header = f"blob {len(data)}\0".encode("utf-8")
    return hashlib.sha1(header + data).hexdigest()


def canonical_sha256(value: Any) -> str:
    text = json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
    return sha256_bytes(text.encode("utf-8"))


def quote_identifier(value: str) -> str:
    return '"' + value.replace('"', '""') + '"'


def quantile(values: Iterable[float], q: float) -> float | None:
    clean = sorted(float(value) for value in values if math.isfinite(float(value)))
    if not clean:
        return None
    position = (len(clean) - 1) * q
    low = math.floor(position)
    high = math.ceil(position)
    if low == high:
        return clean[low]
    return clean[low] + (clean[high] - clean[low]) * (position - low)


def average_ranks(values: list[float]) -> list[float]:
    indexed = sorted(enumerate(values), key=lambda item: item[1])
    ranks = [0.0] * len(values)
    index = 0
    while index < len(indexed):
        end = index + 1
        while end < len(indexed) and indexed[end][1] == indexed[index][1]:
            end += 1
        average = (index + 1 + end) / 2
        for position in range(index, end):
            ranks[indexed[position][0]] = average
        index = end
    return ranks


def pearson(xs: list[float], ys: list[float]) -> float | None:
    if len(xs) != len(ys) or len(xs) < 2:
        return None
    mean_x = sum(xs) / len(xs)
    mean_y = sum(ys) / len(ys)
    numerator = sum((x - mean_x) * (y - mean_y) for x, y in zip(xs, ys))
    denominator_x = sum((x - mean_x) ** 2 for x in xs)
    denominator_y = sum((y - mean_y) ** 2 for y in ys)
    if denominator_x == 0 or denominator_y == 0:
        return None
    return numerator / math.sqrt(denominator_x * denominator_y)


def spearman(xs: list[float], ys: list[float]) -> float | None:
    return pearson(average_ranks(xs), average_ranks(ys))


def lcg(seed: int):
    state = seed & 0xFFFFFFFF
    while True:
        state = (1664525 * state + 1013904223) & 0xFFFFFFFF
        yield state / 2**32


def aggregate_window(months: list[int], label: str, minimum_admissions: int) -> dict[str, Any]:
    paths = [Path(item) for item in sih(
        state="SP",
        year=2024,
        month=months,
        show_progress=False,
        as_dataframe=False,
    )]
    if len(paths) < len(months):
        raise RuntimeError(f"PYSUS_WINDOW_FILE_COUNT_TOO_SMALL:{label}:{len(paths)}")
    missing = [str(path) for path in paths if not path.exists()]
    if missing:
        raise RuntimeError(f"PYSUS_WINDOW_FILES_MISSING:{label}:{','.join(missing)}")

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
        raise RuntimeError("PYSUS_SIH_REQUIRED_COLUMNS_MISSING:" + json.dumps({
            "window": label,
            "CNES": bool(cnes_column),
            "MORTE": bool(morte_column),
            "N_AIH": bool(admission_column),
            "diagnosisColumns": diagnosis_columns,
        }, sort_keys=True))

    cnes = quote_identifier(cnes_column)
    morte = quote_identifier(morte_column)
    admission = quote_identifier(admission_column) if admission_column else None
    diag_exprs = [
        f"regexp_replace(upper(coalesce(cast({quote_identifier(column)} as varchar), '')), '[^A-Z0-9]', '', 'g')"
        for column in diagnosis_columns
    ]
    has_diagnosis = " OR ".join(f"length({expression}) > 0" for expression in diag_exprs)
    safety_event = " OR ".join(
        f"(substr({expression}, 1, 3) between 'T80' and 'T88' OR "
        f"substr({expression}, 1, 3) between 'Y40' and 'Y59' OR "
        f"substr({expression}, 1, 3) between 'Y60' and 'Y84')"
        for expression in diag_exprs
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
        HAVING count(*) >= {minimum_admissions}
        ORDER BY facility_id
    """
    records = duckdb.sql(query).fetchall()
    rows = {}
    for record in records:
        row = {
            "facility_id": str(record[0]),
            "mortality_worse": int(record[1]),
            "mortality_reported": int(record[2]),
            "safety_worse": int(record[3]),
            "safety_reported": int(record[4]),
        }
        if row["safety_reported"] <= 0:
            continue
        if row["mortality_worse"] > row["mortality_reported"]:
            raise RuntimeError(f"MORTALITY_COUNT_INVALID:{label}:{row['facility_id']}")
        if row["safety_worse"] > row["safety_reported"]:
            raise RuntimeError(f"SAFETY_COUNT_INVALID:{label}:{row['facility_id']}")
        rows[row["facility_id"]] = row

    source_files = [{
        "localPath": str(path),
        "basename": path.name,
        "bytes": path.stat().st_size,
        "sha256": sha256_file(path),
    } for path in sorted(paths, key=lambda item: item.name)]
    return {
        "label": label,
        "months": months,
        "rows": rows,
        "sourceFiles": source_files,
        "schemaColumns": columns,
        "diagnosisColumnsUsed": diagnosis_columns,
    }


def descending_order(cases: list[dict[str, Any]], field: str) -> list[str]:
    return [case["facility_id"] for case in sorted(cases, key=lambda case: (-case[field], case["facility_id"]))]


def top_selection(cases: list[dict[str, Any]], field: str, count: int) -> set[str]:
    return set(descending_order(cases, field)[:count])


def recall(selection: set[str], positives: set[str]) -> float:
    return len(selection & positives) / len(positives) if positives else 0.0


def bootstrap_difference(
    cases: list[dict[str, Any]],
    positives: set[str],
    imi_selection: set[str],
    comparator_selection: set[str],
    replicates: int,
    seed: int,
) -> dict[str, Any]:
    random_values = lcg(seed)
    n = len(cases)
    differences = []
    for _ in range(replicates):
        sampled = [cases[min(int(next(random_values) * n), n - 1)] for _ in range(n)]
        denominator = sum(1 for case in sampled if case["facility_id"] in positives)
        if denominator == 0:
            continue
        imi_hits = sum(1 for case in sampled if case["facility_id"] in positives and case["facility_id"] in imi_selection)
        comparator_hits = sum(1 for case in sampled if case["facility_id"] in positives and case["facility_id"] in comparator_selection)
        differences.append(imi_hits / denominator - comparator_hits / denominator)
    if len(differences) < int(replicates * 0.95):
        raise RuntimeError(f"BOOTSTRAP_VALID_REPLICATES_TOO_SMALL:{len(differences)}")
    return {
        "requestedReplicates": replicates,
        "validReplicates": len(differences),
        "seed": seed,
        "lower95": quantile(differences, 0.025),
        "median": quantile(differences, 0.5),
        "upper95": quantile(differences, 0.975),
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output-dir", required=True)
    parser.add_argument("--clock", default="2026-08-05T23:00:00.000Z")
    args = parser.parse_args()
    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    protocol_bytes = PROTOCOL_PATH.read_bytes()
    route_bytes = ROUTE_PATH.read_bytes()
    protocol = json.loads(protocol_bytes)
    route = json.loads(route_bytes)
    if protocol.get("status") != EXPECTED_PROTOCOL_STATUS:
        raise RuntimeError("MAKE_OR_BREAK_PROTOCOL_NOT_FROZEN")
    if route.get("routeId") != EXPECTED_ROUTE_ID:
        raise RuntimeError("MAKE_OR_BREAK_ROUTE_ID_MISMATCH")
    if git_blob_sha1(route_bytes) != EXPECTED_ROUTE_BLOB_SHA:
        raise RuntimeError(f"MAKE_OR_BREAK_ROUTE_BLOB_MISMATCH:{git_blob_sha1(route_bytes)}")
    if len(route.get("requiredFactors", [])) != 2:
        raise RuntimeError("MAKE_OR_BREAK_ROUTE_FACTOR_COUNT_MISMATCH")

    minimum_admissions = int(protocol["sourceDesign"]["minimumAdmissionsPerWindow"])
    baseline = aggregate_window(protocol["sourceDesign"]["baselineMonths"], "BASELINE_Q1_2024", minimum_admissions)
    if len(baseline["rows"]) < MIN_BASELINE_INSTITUTIONS:
        raise RuntimeError(f"BASELINE_INSTITUTION_MINIMUM_NOT_MET:{len(baseline['rows'])}")
    held_out = aggregate_window(protocol["sourceDesign"]["heldOutOutcomeMonths"], "HELD_OUT_Q2_Q4_2024", minimum_admissions)

    paired_ids = sorted(set(baseline["rows"]) & set(held_out["rows"]))
    minimum_intersection = int(protocol["analysisPopulation"]["minimumIntersectionInstitutions"])
    retention = len(paired_ids) / len(baseline["rows"]) if baseline["rows"] else 0.0
    minimum_retention = float(protocol["analysisPopulation"]["minimumBaselineRetentionFraction"])

    cases: list[dict[str, Any]] = []
    for facility_id in paired_ids:
        before = baseline["rows"][facility_id]
        after = held_out["rows"][facility_id]
        baseline_mortality = before["mortality_worse"] / before["mortality_reported"]
        baseline_safety = before["safety_worse"] / before["safety_reported"]
        mortality_availability = 1 - baseline_mortality
        safety_availability = 1 - baseline_safety
        imi = mortality_availability * safety_availability
        case = {
            "facility_id": facility_id,
            "baseline": before,
            "heldOut": after,
            "baseline_mortality_rate": baseline_mortality,
            "baseline_safety_rate": baseline_safety,
            "held_out_mortality_rate": after["mortality_worse"] / after["mortality_reported"],
            "held_out_safety_rate": after["safety_worse"] / after["safety_reported"],
            "imi_risk": 1 - imi,
            "additive_risk": 1 - ((mortality_availability + safety_availability) / 2),
            "weakest_factor_risk": 1 - min(mortality_availability, safety_availability),
            "baseline_mortality_risk": baseline_mortality,
            "baseline_safety_risk": baseline_safety,
            "geometric_mean_control_risk": 1 - math.sqrt(imi),
        }
        cases.append(case)

    minimum_evidence = len(cases) >= minimum_intersection and retention >= minimum_retention
    if not minimum_evidence:
        held_result = {
            "schemaVersion": "IMI_HOSPITAL_TEMPORAL_HOLDOUT_MAKE_OR_BREAK_RESULT_v1",
            "operation": protocol["operation"],
            "generatedAt": args.clock,
            "verdict": protocol["makeOrBreakDecision"]["heldDisposition"],
            "minimumEvidenceSatisfied": False,
            "analysisPopulation": {
                "baselineEligible": len(baseline["rows"]),
                "heldOutEligible": len(held_out["rows"]),
                "pairedInstitutions": len(cases),
                "baselineRetentionFraction": retention,
                "minimumPairedRequired": minimum_intersection,
                "minimumRetentionRequired": minimum_retention,
            },
            "routeRetuned": False,
        }
        (output_dir / "imi-hospital-temporal-holdout-make-or-break-result.v1.json").write_text(
            json.dumps(held_result, indent=2) + "\n", encoding="utf-8"
        )
        print(json.dumps(held_result, indent=2))
        return 2

    n = len(cases)
    top_count = math.ceil(n * float(protocol["primaryOutcome"]["reviewBudgetFraction"]))
    later_mortality_top = top_selection(cases, "held_out_mortality_rate", top_count)
    later_safety_top = top_selection(cases, "held_out_safety_rate", top_count)
    positives = later_mortality_top | later_safety_top

    score_fields = {
        "IMI_RISK": "imi_risk",
        "ADDITIVE_RISK": "additive_risk",
        "WEAKEST_FACTOR_RISK": "weakest_factor_risk",
        "BASELINE_MORTALITY_RISK": "baseline_mortality_risk",
        "BASELINE_SAFETY_RISK": "baseline_safety_risk",
        "GEOMETRIC_MEAN_CONTROL": "geometric_mean_control_risk",
    }
    selections = {name: top_selection(cases, field, top_count) for name, field in score_fields.items()}
    if descending_order(cases, "imi_risk") != descending_order(cases, "geometric_mean_control_risk"):
        raise RuntimeError("GEOMETRIC_MEAN_CONTROL_RANKING_NOT_IDENTICAL_TO_IMI")

    recalls = {name: recall(selection, positives) for name, selection in selections.items()}
    comparator_names = [
        "ADDITIVE_RISK",
        "WEAKEST_FACTOR_RISK",
        "BASELINE_MORTALITY_RISK",
        "BASELINE_SAFETY_RISK",
    ]
    best_comparator = sorted(comparator_names, key=lambda name: (-recalls[name], name))[0]
    improvement = recalls["IMI_RISK"] - recalls[best_comparator]
    bootstrap = bootstrap_difference(
        cases,
        positives,
        selections["IMI_RISK"],
        selections[best_comparator],
        int(protocol["uncertainty"]["replicates"]),
        int(protocol["uncertainty"]["seed"]),
    )
    minimum_improvement = float(protocol["makeOrBreakDecision"]["minimumAbsoluteRecallImprovement"])
    passed = (
        improvement >= minimum_improvement
        and bootstrap["lower95"] is not None
        and bootstrap["lower95"] > 0
    )
    verdict = (
        protocol["makeOrBreakDecision"]["passDisposition"]
        if passed
        else protocol["makeOrBreakDecision"]["failDisposition"]
    )

    future_mortality = [case["held_out_mortality_rate"] for case in cases]
    future_safety = [case["held_out_safety_rate"] for case in cases]
    associations = {}
    for name, field in score_fields.items():
        scores = [case[field] for case in cases]
        associations[name] = {
            "spearmanWithHeldOutMortality": spearman(scores, future_mortality),
            "spearmanWithHeldOutSafety": spearman(scores, future_safety),
        }

    for case in cases:
        case["primary_outcome_positive"] = case["facility_id"] in positives
        case["selected_by"] = [name for name, selection in selections.items() if case["facility_id"] in selection]

    source_identity = {
        "schemaVersion": "IMI_HOSPITAL_TEMPORAL_HOLDOUT_SOURCE_IDENTITY_v1",
        "observedAt": args.clock,
        "country": "Brazil",
        "state": "Sao Paulo",
        "informationSystem": "SIH/SUS AIH Reduced Data",
        "accessRepresentation": "PYSUS_2_7_0_DUCKLAKE_PARQUET_MIRROR_OF_DATASUS",
        "baseline": {
            "months": baseline["months"],
            "eligibleInstitutions": len(baseline["rows"]),
            "sourceFiles": baseline["sourceFiles"],
            "diagnosisColumnsUsed": baseline["diagnosisColumnsUsed"],
        },
        "heldOut": {
            "months": held_out["months"],
            "eligibleInstitutions": len(held_out["rows"]),
            "sourceFiles": held_out["sourceFiles"],
            "diagnosisColumnsUsed": held_out["diagnosisColumnsUsed"],
        },
        "mappingContract": {
            "caseIdentity": "CNES",
            "deduplicationIdentity": "N_AIH_WHEN_PRESENT_OTHERWISE_SOURCE_ROW",
            "mortalityReported": "ALL_DEDUPLICATED_ADMISSIONS",
            "mortalityWorse": "MORTE_EQUALS_1",
            "safetyReported": "ADMISSIONS_WITH_ANY_USABLE_DIAGNOSIS",
            "safetyWorse": "ANY_DIAGNOSIS_IN_T80_T88_Y40_Y59_Y60_Y84",
        },
    }

    result_body = {
        "schemaVersion": "IMI_HOSPITAL_TEMPORAL_HOLDOUT_MAKE_OR_BREAK_RESULT_v1",
        "operation": protocol["operation"],
        "generatedAt": args.clock,
        "verdict": verdict,
        "continueProgram": passed,
        "stopAndArchiveProgram": not passed,
        "minimumEvidenceSatisfied": True,
        "protocolIdentity": {
            "path": str(PROTOCOL_PATH.relative_to(REPO_ROOT)),
            "sha256": sha256_bytes(protocol_bytes),
            "status": protocol["status"],
            "preFreezeSubjectHead": protocol["preFreezeSubjectHead"],
        },
        "routeIdentity": {
            "path": str(ROUTE_PATH.relative_to(REPO_ROOT)),
            "routeId": route["routeId"],
            "routeVersion": route["routeVersion"],
            "gitBlobSha": git_blob_sha1(route_bytes),
            "sha256": sha256_bytes(route_bytes),
            "routeRetuned": False,
        },
        "sourceIdentity": source_identity,
        "analysisPopulation": {
            "baselineEligible": len(baseline["rows"]),
            "heldOutEligible": len(held_out["rows"]),
            "pairedInstitutions": n,
            "baselineRetentionFraction": retention,
            "reviewBudgetCount": top_count,
            "primaryOutcomePositiveCount": len(positives),
            "laterMortalityTopCount": len(later_mortality_top),
            "laterSafetyTopCount": len(later_safety_top),
        },
        "primaryTest": {
            "metric": protocol["primaryOutcome"]["primaryMetric"],
            "recalls": recalls,
            "bestNonEquivalentComparator": best_comparator,
            "imiMinusBestComparator": improvement,
            "minimumRequiredImprovement": minimum_improvement,
            "pairedBootstrap": bootstrap,
            "geometricMeanControlRankingIdentical": True,
            "pass": passed,
        },
        "secondaryAssociations": associations,
        "boundaries": {
            "heldOutOutcomeExecuted": True,
            "routeRetuned": False,
            "thresholdRetuned": False,
            "causalClaimMade": False,
            "clinicalUseClaimed": False,
            "mainMergeAuthorized": False,
            "publicReleaseAuthorized": False,
        },
        "cases": cases,
    }
    result = {**result_body, "packageSha256": canonical_sha256(result_body)}
    result_path = output_dir / "imi-hospital-temporal-holdout-make-or-break-result.v1.json"
    result_path.write_text(json.dumps(result, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    (output_dir / "imi-hospital-temporal-holdout-source-identity.v1.json").write_text(
        json.dumps(source_identity, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )
    print(json.dumps({
        "verdict": verdict,
        "continueProgram": passed,
        "pairedInstitutions": n,
        "primaryOutcomePositiveCount": len(positives),
        "imiRecall": recalls["IMI_RISK"],
        "bestComparator": best_comparator,
        "bestComparatorRecall": recalls[best_comparator],
        "absoluteImprovement": improvement,
        "bootstrapLower95": bootstrap["lower95"],
        "packageSha256": result["packageSha256"],
    }, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
