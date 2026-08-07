#!/usr/bin/env python3
from __future__ import annotations

import datetime as dt
import json
import math
import statistics
import sys
import time
from pathlib import Path
from typing import Any

import requests

HERE = Path(__file__).resolve().parent
PROTOCOL_PATH = HERE / "arm-b-fdic-longitudinal-protocol.v1.json"
OUTPUT_PATH = HERE / "arm-b-fdic-longitudinal-result.v1.json"

BANKFIND_FINANCIAL_ENDPOINTS = [
    "https://api.fdic.gov/banks/financials",
    "https://banks.data.fdic.gov/api/financials",
]
BANKFIND_FAILURE_ENDPOINTS = [
    "https://api.fdic.gov/banks/failures",
    "https://banks.data.fdic.gov/api/failures",
]

QUARTERS = [
    "20200331","20200630","20200930","20201231",
    "20210331","20210630","20210930","20211231",
    "20220331","20220630","20220930","20221231",
    "20230331","20230630","20230930","20231231",
    "20240331","20240630","20240930","20241231",
    "20250331","20250630","20250930","20251231",
    "20260331",
]
REQUIRED_FIELDS = ["CERT", "REPDTE", "ASSET", "DEP", "ROA", "NCLNLSR"]
OPTIONAL_FIELDS = ["BKCLASS", "LEVCAP", "RBC1AAJ", "RBCT1J"]

SESSION = requests.Session()
SESSION.headers.update({
    "User-Agent": "UCIC-FDIC-longitudinal-collapse-extension-v1/1.0",
    "Accept": "application/json",
})


class AcquisitionError(RuntimeError):
    pass


def api_rows(payload: dict[str, Any]) -> list[dict[str, Any]]:
    raw = payload.get("data", [])
    rows: list[dict[str, Any]] = []
    for item in raw:
        if isinstance(item, dict) and isinstance(item.get("data"), dict):
            rows.append(item["data"])
        elif isinstance(item, dict):
            rows.append(item)
    return rows


def get_json(url: str, params: dict[str, Any], attempts: int = 3) -> dict[str, Any]:
    last: Exception | None = None
    for attempt in range(attempts):
        try:
            response = SESSION.get(url, params=params, timeout=120)
            if response.status_code != 200:
                raise AcquisitionError(
                    f"HTTP {response.status_code} from {response.url}: {response.text[:300]}"
                )
            payload = response.json()
            if not isinstance(payload, dict):
                raise AcquisitionError(f"Non-object JSON from {response.url}")
            return payload
        except Exception as exc:
            last = exc
            if attempt + 1 < attempts:
                time.sleep(2 ** attempt)
    raise AcquisitionError(str(last))


def test_endpoint(endpoint: str) -> bool:
    try:
        payload = get_json(
            endpoint,
            {
                "filters": "CERT:24735",
                "fields": "CERT,REPDTE,ASSET,DEP,ROA,NCLNLSR",
                "sort_by": "REPDTE",
                "sort_order": "DESC",
                "limit": 1,
                "offset": 0,
                "format": "json",
            },
            attempts=1,
        )
        rows = api_rows(payload)
        return bool(rows)
    except Exception:
        return False


def choose_financial_endpoint() -> str:
    for endpoint in BANKFIND_FINANCIAL_ENDPOINTS:
        if test_endpoint(endpoint):
            return endpoint
    raise AcquisitionError("No registered FDIC BankFind financial endpoint was reachable.")


def field_supported(endpoint: str, field: str) -> bool:
    try:
        payload = get_json(
            endpoint,
            {
                "filters": "CERT:24735",
                "fields": f"CERT,REPDTE,{field}",
                "sort_by": "REPDTE",
                "sort_order": "DESC",
                "limit": 2,
                "offset": 0,
                "format": "json",
            },
            attempts=1,
        )
        rows = api_rows(payload)
        if not rows:
            return False
        return any(field in row for row in rows)
    except Exception:
        return False


def normalize_date(value: Any) -> str | None:
    if value is None:
        return None
    digits = "".join(ch for ch in str(value) if ch.isdigit())
    if len(digits) >= 8:
        return digits[:8]
    return None


def num(value: Any) -> float | None:
    if value is None or value == "":
        return None
    try:
        x = float(value)
    except (TypeError, ValueError):
        return None
    if not math.isfinite(x):
        return None
    return x


def cert_int(value: Any) -> int | None:
    try:
        return int(float(value))
    except (TypeError, ValueError):
        return None


def fetch_quarter(endpoint: str, repdte: str, fields: list[str]) -> list[dict[str, Any]]:
    payload = get_json(
        endpoint,
        {
            "filters": f"REPDTE:{repdte}",
            "fields": ",".join(fields),
            "sort_by": "CERT",
            "sort_order": "ASC",
            "limit": 10000,
            "offset": 0,
            "format": "json",
        },
    )
    rows = api_rows(payload)
    meta_total = payload.get("meta", {}).get("total") if isinstance(payload.get("meta"), dict) else None
    if isinstance(meta_total, int) and meta_total > 10000:
        raise AcquisitionError(f"Quarter {repdte} exceeds one-page frozen maximum: {meta_total}")
    out: list[dict[str, Any]] = []
    for row in rows:
        c = cert_int(row.get("CERT"))
        d = normalize_date(row.get("REPDTE"))
        if c is None or d != repdte:
            continue
        cleaned = dict(row)
        cleaned["CERT"] = c
        cleaned["REPDTE"] = d
        out.append(cleaned)
    return out


def parse_failure_date(value: Any) -> dt.date | None:
    if value is None:
        return None
    text = str(value).strip()
    candidates = [
        "%m/%d/%Y", "%m/%d/%y", "%Y-%m-%d", "%Y%m%d",
        "%B %d, %Y", "%b %d, %Y",
    ]
    for fmt in candidates:
        try:
            return dt.datetime.strptime(text, fmt).date()
        except ValueError:
            pass
    digits = "".join(ch for ch in text if ch.isdigit())
    if len(digits) == 8:
        for fmt in ("%Y%m%d", "%m%d%Y"):
            try:
                return dt.datetime.strptime(digits, fmt).date()
            except ValueError:
                pass
    return None


def fetch_known_failures(frozen: list[dict[str, Any]]) -> dict[int, dt.date]:
    known = {int(x["cert"]): dt.date.fromisoformat(x["failure_date"]) for x in frozen}
    for endpoint in BANKFIND_FAILURE_ENDPOINTS:
        try:
            payload = get_json(
                endpoint,
                {
                    "fields": "CERT,FAILDATE",
                    "sort_by": "FAILDATE",
                    "sort_order": "DESC",
                    "limit": 10000,
                    "offset": 0,
                    "format": "json",
                },
                attempts=1,
            )
            rows = api_rows(payload)
            for row in rows:
                c = cert_int(row.get("CERT"))
                fd = parse_failure_date(row.get("FAILDATE"))
                if c is not None and fd is not None:
                    known[c] = fd
            if rows:
                break
        except Exception:
            continue
    return known


def quarter_date(repdte: str) -> dt.date:
    return dt.datetime.strptime(repdte, "%Y%m%d").date()


def empirical_adverse_percentile(value: float, peers: list[float], direction: str) -> float | None:
    vals = [x for x in peers if x is not None and math.isfinite(x)]
    if len(vals) < 20:
        return None
    eps = 1e-12
    if direction == "HIGH":
        less = sum(1 for x in vals if x < value - eps)
        equal = sum(1 for x in vals if abs(x - value) <= eps)
        return (less + 0.5 * equal) / len(vals)
    if direction == "LOW":
        greater = sum(1 for x in vals if x > value + eps)
        equal = sum(1 for x in vals if abs(x - value) <= eps)
        return (greater + 0.5 * equal) / len(vals)
    raise ValueError(direction)


def mean_or_none(values: list[float]) -> float | None:
    vals = [x for x in values if x is not None and math.isfinite(x)]
    if not vals:
        return None
    return float(statistics.mean(vals))


def iso_from_repdte(repdte: str) -> str:
    return quarter_date(repdte).isoformat()


def consecutive_quarters(a: str, b: str) -> bool:
    da, db = quarter_date(a), quarter_date(b)
    if db <= da:
        return False
    y, m = da.year, da.month
    if m == 3:
        expected = dt.date(y, 6, 30)
    elif m == 6:
        expected = dt.date(y, 9, 30)
    elif m == 9:
        expected = dt.date(y, 12, 31)
    else:
        expected = dt.date(y + 1, 3, 31)
    return db == expected


def build_index(rows_by_date: dict[str, list[dict[str, Any]]]) -> tuple[
    dict[str, dict[int, dict[str, Any]]], dict[int, dict[str, dict[str, Any]]]
]:
    date_cert: dict[str, dict[int, dict[str, Any]]] = {}
    cert_date: dict[int, dict[str, dict[str, Any]]] = {}
    for repdte, rows in rows_by_date.items():
        date_cert[repdte] = {}
        for row in rows:
            c = int(row["CERT"])
            date_cert[repdte][c] = row
            cert_date.setdefault(c, {})[repdte] = row
    return date_cert, cert_date


def raw_metric(
    cert: int,
    repdte: str,
    route_id: str,
    field: str | None,
    cert_date: dict[int, dict[str, dict[str, Any]]],
) -> float | None:
    record = cert_date.get(cert, {}).get(repdte)
    if record is None:
        return None
    if route_id == "FUNDING_STABILITY":
        idx = QUARTERS.index(repdte)
        if idx == 0:
            return None
        prev = cert_date.get(cert, {}).get(QUARTERS[idx - 1])
        if prev is None:
            return None
        current_dep = num(record.get("DEP"))
        previous_dep = num(prev.get("DEP"))
        if current_dep is None or previous_dep in (None, 0):
            return None
        return (current_dep - previous_dep) / abs(previous_dep)
    if field is None:
        return None
    return num(record.get(field))


def candidate_peers(
    target_cert: int,
    repdte: str,
    target_asset: float,
    target_class: str | None,
    date_cert: dict[str, dict[int, dict[str, Any]]],
    asset_low: float,
    asset_high: float,
    same_class: bool,
) -> list[int]:
    out: list[int] = []
    for c, row in date_cert.get(repdte, {}).items():
        if c == target_cert:
            continue
        asset = num(row.get("ASSET"))
        if asset is None or asset <= 0:
            continue
        if not (target_asset * asset_low <= asset <= target_asset * asset_high):
            continue
        if same_class and target_class is not None:
            if str(row.get("BKCLASS") or "") != target_class:
                continue
        out.append(c)
    return out


def select_capital_field(
    cert: int,
    scoring_dates: list[str],
    protocol: dict[str, Any],
    cert_date: dict[int, dict[str, dict[str, Any]]],
    date_cert: dict[str, dict[int, dict[str, Any]]],
    supported_fields: set[str],
) -> str | None:
    route = next(r for r in protocol["routes"] if r["route_id"] == "CAPITAL_ADEQUACY")
    for field in route["field_priority"]:
        if field not in supported_fields:
            continue
        target_vals = [raw_metric(cert, d, "CAPITAL_ADEQUACY", field, cert_date) for d in scoring_dates]
        target_present = sum(v is not None for v in target_vals)
        if not scoring_dates or target_present / len(scoring_dates) < 0.75:
            continue
        peer_present = 0
        peer_total = 0
        for d in scoring_dates:
            tr = cert_date.get(cert, {}).get(d)
            if tr is None:
                continue
            ta = num(tr.get("ASSET"))
            if ta is None or ta <= 0:
                continue
            tc = str(tr.get("BKCLASS") or "") or None
            peers = candidate_peers(cert, d, ta, tc, date_cert, 0.25, 4.0, tc is not None)
            if len(peers) < 20:
                peers = candidate_peers(cert, d, ta, tc, date_cert, 0.25, 4.0, False)
            if len(peers) < 20:
                peers = candidate_peers(cert, d, ta, tc, date_cert, 0.10, 10.0, False)
            for p in peers:
                peer_total += 1
                if raw_metric(p, d, "CAPITAL_ADEQUACY", field, cert_date) is not None:
                    peer_present += 1
        if peer_total and peer_present / peer_total >= 0.75:
            return field
    return None


def route_state(
    cert: int,
    repdte: str,
    route: dict[str, Any],
    field: str | None,
    cert_date: dict[int, dict[str, dict[str, Any]]],
    date_cert: dict[str, dict[int, dict[str, Any]]],
) -> dict[str, Any]:
    record = cert_date.get(cert, {}).get(repdte)
    if record is None:
        return {"evaluable": False, "reason": "missing_bank_quarter"}
    target_asset = num(record.get("ASSET"))
    if target_asset is None or target_asset <= 0:
        return {"evaluable": False, "reason": "missing_asset"}

    target_class = str(record.get("BKCLASS") or "") or None
    value = raw_metric(cert, repdte, route["route_id"], field, cert_date)
    if value is None:
        return {"evaluable": False, "reason": "missing_route_value"}

    peer_ids = candidate_peers(
        cert, repdte, target_asset, target_class, date_cert, 0.25, 4.0, target_class is not None
    )
    peer_mode = "same_class_asset_0.25_4"
    peer_values = [raw_metric(p, repdte, route["route_id"], field, cert_date) for p in peer_ids]
    peer_values = [x for x in peer_values if x is not None]

    if len(peer_values) < 20:
        peer_ids = candidate_peers(cert, repdte, target_asset, target_class, date_cert, 0.25, 4.0, False)
        peer_mode = "all_class_asset_0.25_4"
        peer_values = [raw_metric(p, repdte, route["route_id"], field, cert_date) for p in peer_ids]
        peer_values = [x for x in peer_values if x is not None]

    if len(peer_values) < 20:
        peer_ids = candidate_peers(cert, repdte, target_asset, target_class, date_cert, 0.10, 10.0, False)
        peer_mode = "all_class_asset_0.10_10"
        peer_values = [raw_metric(p, repdte, route["route_id"], field, cert_date) for p in peer_ids]
        peer_values = [x for x in peer_values if x is not None]

    if len(peer_values) < 20:
        return {"evaluable": False, "reason": "insufficient_peer_values", "peer_count": len(peer_values)}

    adverse = empirical_adverse_percentile(value, peer_values, route["adverse_direction"])
    if adverse is None:
        return {"evaluable": False, "reason": "percentile_failure"}

    idx = QUARTERS.index(repdte)
    prior_values: list[float] = []
    for j in range(max(0, idx - 4), idx):
        d = QUARTERS[j]
        v = raw_metric(cert, d, route["route_id"], field, cert_date)
        if v is not None:
            prior_values.append(v)
    if len(prior_values) < 2:
        confirmation = None
    else:
        med = statistics.median(prior_values)
        if route["adverse_direction"] == "LOW":
            confirmation = value <= med
        else:
            confirmation = value >= med

    degraded = bool(
        adverse >= float(protocol_global["peer_standardization"]["adverse_percentile_threshold"])
        and confirmation is True
    )
    return {
        "evaluable": True,
        "field": field if route["route_id"] != "FUNDING_STABILITY" else "DEP_QOQ",
        "value": value,
        "adverse_peer_percentile": adverse,
        "within_bank_confirmation": confirmation,
        "degraded": degraded,
        "peer_count": len(peer_values),
        "peer_mode": peer_mode,
    }


def score_bank(
    cert: int,
    scoring_dates: list[str],
    protocol: dict[str, Any],
    cert_date: dict[int, dict[str, dict[str, Any]]],
    date_cert: dict[str, dict[int, dict[str, Any]]],
    supported_fields: set[str],
) -> dict[str, Any]:
    capital_field = select_capital_field(cert, scoring_dates, protocol, cert_date, date_cert, supported_fields)
    field_map = {
        "CAPITAL_ADEQUACY": capital_field,
        "EARNINGS": "ROA" if "ROA" in supported_fields else None,
        "ASSET_QUALITY": "NCLNLSR" if "NCLNLSR" in supported_fields else None,
        "FUNDING_STABILITY": "DEP" if "DEP" in supported_fields else None,
    }
    quarter_states: list[dict[str, Any]] = []
    for repdte in scoring_dates:
        routes: dict[str, Any] = {}
        for route in protocol["routes"]:
            rid = route["route_id"]
            routes[rid] = route_state(cert, repdte, route, field_map[rid], cert_date, date_cert)
        evaluable_routes = [x for x in routes.values() if x.get("evaluable")]
        degraded_routes = [rid for rid, x in routes.items() if x.get("degraded")]
        warning_quarter = (
            len(evaluable_routes) >= int(protocol["warning_rule"]["minimum_routes_observed_per_quarter"])
            and len(degraded_routes) >= 2
        )

        roa = routes["EARNINGS"]
        roa_warning_quarter = bool(
            roa.get("evaluable")
            and roa.get("adverse_peer_percentile", -1) >= 0.90
            and roa.get("within_bank_confirmation") is True
        )
        percentiles = [
            x["adverse_peer_percentile"] for x in evaluable_routes
            if x.get("adverse_peer_percentile") is not None
        ]
        additive_mean = mean_or_none(percentiles)
        additive_warning_quarter = bool(
            len(evaluable_routes) >= 3
            and additive_mean is not None
            and additive_mean >= 0.90
        )
        quarter_states.append({
            "repdte": repdte,
            "date": iso_from_repdte(repdte),
            "routes": routes,
            "evaluable_route_count": len(evaluable_routes),
            "degraded_routes": degraded_routes,
            "warning_quarter": warning_quarter,
            "roa_only_warning_quarter": roa_warning_quarter,
            "additive_mean_adverse_percentile": additive_mean,
            "additive_mean_warning_quarter": additive_warning_quarter,
        })

    def first_persistent(flag: str) -> str | None:
        for a, b in zip(quarter_states, quarter_states[1:]):
            if a.get(flag) and b.get(flag) and consecutive_quarters(a["repdte"], b["repdte"]):
                return a["repdte"]
        return None

    return {
        "cert": cert,
        "scoring_dates": scoring_dates,
        "capital_field": capital_field,
        "evaluable_quarter_count": sum(
            q["evaluable_route_count"] >= int(protocol["warning_rule"]["minimum_routes_observed_per_quarter"])
            for q in quarter_states
        ),
        "quarter_states": quarter_states,
        "ucic_first_warning_repdte": first_persistent("warning_quarter"),
        "roa_only_first_warning_repdte": first_persistent("roa_only_warning_quarter"),
        "additive_mean_first_warning_repdte": first_persistent("additive_mean_warning_quarter"),
    }


def latest_pre_failure_dates(failure_date: dt.date, count: int) -> list[str]:
    eligible = [q for q in QUARTERS if quarter_date(q) < failure_date]
    return eligible[-count:]


def control_candidates_for_target(
    target: dict[str, Any],
    anchor: str,
    date_cert: dict[str, dict[int, dict[str, Any]]],
    known_failures: dict[int, dt.date],
    cohort_certs: set[int],
) -> list[int]:
    tc = int(target["cert"])
    tr = date_cert.get(anchor, {}).get(tc)
    if tr is None:
        return []
    ta = num(tr.get("ASSET"))
    if ta is None or ta <= 0:
        return []
    tclass = str(tr.get("BKCLASS") or "") or None
    tfd = dt.date.fromisoformat(target["failure_date"])
    horizon = tfd + dt.timedelta(days=365)

    ranked: list[tuple[int, float, int]] = []
    for c, row in date_cert.get(anchor, {}).items():
        if c == tc:
            continue
        asset = num(row.get("ASSET"))
        if asset is None or asset <= 0:
            continue
        fd = known_failures.get(c)
        if fd is not None and fd <= horizon:
            continue
        if c in cohort_certs:
            continue
        same_class_rank = 0 if (tclass is not None and str(row.get("BKCLASS") or "") == tclass) else 1
        distance = abs(math.log(asset) - math.log(ta))
        ranked.append((same_class_rank, distance, c))
    ranked.sort()
    return [c for _, _, c in ranked]


def warning_bool(score: dict[str, Any], key: str) -> bool:
    return score.get(key) is not None


def balanced_accuracy(sensitivity: float, fpr: float) -> float:
    return 0.5 * (sensitivity + (1.0 - fpr))


def comparator_metrics(
    failure_scores: list[dict[str, Any]],
    control_scores: list[dict[str, Any]],
    warning_key: str,
) -> dict[str, Any]:
    ef = [s for s in failure_scores if s["evaluable_quarter_count"] >= 4]
    ec = [s for s in control_scores if s["evaluable_quarter_count"] >= 4]
    sensitivity = sum(warning_bool(s, warning_key) for s in ef) / len(ef) if ef else 0.0
    fpr = sum(warning_bool(s, warning_key) for s in ec) / len(ec) if ec else 1.0
    return {
        "evaluable_failures": len(ef),
        "evaluable_controls": len(ec),
        "failure_sensitivity": sensitivity,
        "control_false_positive_rate": fpr,
        "balanced_accuracy": balanced_accuracy(sensitivity, fpr),
    }


def terminal_disposition(metrics: dict[str, Any]) -> str:
    ef = metrics["evaluable_failure_count"]
    ec = metrics["evaluable_control_count"]
    sensitivity = metrics["failure_sensitivity"]
    fpr = metrics["control_false_positive_rate"]
    lead = metrics["median_failure_lead_time_days"]
    advantage = metrics["ucic_minus_best_comparator_balanced_accuracy"]

    if ef < 7 or ec < 20:
        return "FDIC_LONGITUDINAL_UNEVALUABLE_DATA_OR_MATCHING_FAILURE"
    if sensitivity < 0.60 or fpr > 0.20 or lead < 90:
        return "FDIC_LONGITUDINAL_EARLY_WARNING_NOT_SUPPORTED"
    if advantage <= 0.05:
        return "FDIC_LONGITUDINAL_SIGNAL_REDUNDANT_WITH_SIMPLE_FINANCIAL_DISTRESS"
    strict = (
        ef == 11
        and ec >= 40
        and sensitivity >= 0.70
        and fpr <= 0.15
        and lead >= 180
        and advantage >= 0.10
    )
    if strict:
        return "FDIC_LONGITUDINAL_EARLY_WARNING_SUPPORTED"
    return "FDIC_LONGITUDINAL_EARLY_WARNING_SUPPORTED_WITH_LIMITATIONS"


def write_result(payload: dict[str, Any]) -> None:
    OUTPUT_PATH.write_text(json.dumps(payload, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def acquisition_unevaluable(protocol: dict[str, Any], message: str) -> None:
    result = {
        "operation": protocol["operation"],
        "protocol_status": protocol["protocol_status"],
        "terminal_disposition": "FDIC_LONGITUDINAL_UNEVALUABLE_DATA_OR_MATCHING_FAILURE",
        "acquisition_status": "FAILED_AFTER_FROZEN_RETRIES",
        "acquisition_error": message,
        "scientific_result": "UNEVALUABLE",
        "post_result_scientific_repair_permitted": False,
    }
    write_result(result)
    print(json.dumps(result, sort_keys=True))


def main() -> int:
    global protocol_global
    protocol = json.loads(PROTOCOL_PATH.read_text(encoding="utf-8"))
    protocol_global = protocol
    if protocol["protocol_status"] != "FROZEN_BEFORE_BANK_QUARTER_VALUE_EXTRACTION":
        raise SystemExit("Protocol is not frozen.")

    try:
        endpoint = choose_financial_endpoint()
        supported = set()
        for field in REQUIRED_FIELDS + OPTIONAL_FIELDS:
            if field_supported(endpoint, field):
                supported.add(field)
        missing_required = [f for f in REQUIRED_FIELDS if f not in supported]
        if missing_required:
            raise AcquisitionError(f"Required FDIC fields unavailable: {missing_required}")

        fields = [f for f in REQUIRED_FIELDS + OPTIONAL_FIELDS if f in supported]
        rows_by_date: dict[str, list[dict[str, Any]]] = {}
        for q in QUARTERS:
            rows = fetch_quarter(endpoint, q, fields)
            if not rows:
                raise AcquisitionError(f"No FDIC financial rows for frozen quarter {q}")
            rows_by_date[q] = rows
            print(f"ACQUIRED {q} rows={len(rows)}")

        date_cert, cert_date = build_index(rows_by_date)
        known_failures = fetch_known_failures(protocol["cohort"])
    except Exception as exc:
        acquisition_unevaluable(protocol, str(exc))
        return 0

    cohort_certs = {int(x["cert"]) for x in protocol["cohort"]}
    failure_scores: list[dict[str, Any]] = []
    control_scores: list[dict[str, Any]] = []
    target_results: list[dict[str, Any]] = []

    for target in protocol["cohort"]:
        cert = int(target["cert"])
        failure_date = dt.date.fromisoformat(target["failure_date"])
        dates = latest_pre_failure_dates(failure_date, int(protocol["observation_window"]["target_quarters"]))
        score = score_bank(cert, dates, protocol, cert_date, date_cert, supported)
        score["name"] = target["name"]
        score["failure_date"] = target["failure_date"]
        if score["ucic_first_warning_repdte"]:
            score["ucic_lead_time_days"] = (
                failure_date - quarter_date(score["ucic_first_warning_repdte"])
            ).days
        else:
            score["ucic_lead_time_days"] = None
        failure_scores.append(score)

        controls_for_target: list[dict[str, Any]] = []
        anchor = dates[-1] if dates else None
        if anchor is not None:
            for candidate in control_candidates_for_target(target, anchor, date_cert, known_failures, cohort_certs):
                cscore = score_bank(candidate, dates, protocol, cert_date, date_cert, supported)
                if cscore["evaluable_quarter_count"] < 4:
                    continue
                cscore["matched_target_cert"] = cert
                cscore["matched_target_failure_date"] = target["failure_date"]
                controls_for_target.append(cscore)
                control_scores.append(cscore)
                if len(controls_for_target) >= int(protocol["controls"]["controls_per_failure"]):
                    break

        target_results.append({
            "target": score,
            "controls": controls_for_target,
            "control_count": len(controls_for_target),
        })
        print(
            f"SCORED target={cert} evaluable_quarters={score['evaluable_quarter_count']} "
            f"warning={bool(score['ucic_first_warning_repdte'])} controls={len(controls_for_target)}"
        )

    evaluable_failures = [s for s in failure_scores if s["evaluable_quarter_count"] >= 4]
    evaluable_controls = [s for s in control_scores if s["evaluable_quarter_count"] >= 4]
    sensitivity = (
        sum(bool(s["ucic_first_warning_repdte"]) for s in evaluable_failures) / len(evaluable_failures)
        if evaluable_failures else 0.0
    )
    fpr = (
        sum(bool(s["ucic_first_warning_repdte"]) for s in evaluable_controls) / len(evaluable_controls)
        if evaluable_controls else 1.0
    )
    leads = [s["ucic_lead_time_days"] for s in evaluable_failures if s.get("ucic_lead_time_days") is not None]
    median_lead = float(statistics.median(leads)) if leads else 0.0
    ucic_ba = balanced_accuracy(sensitivity, fpr)

    roa_metrics = comparator_metrics(failure_scores, control_scores, "roa_only_first_warning_repdte")
    additive_metrics = comparator_metrics(failure_scores, control_scores, "additive_mean_first_warning_repdte")
    best_comp = max(roa_metrics["balanced_accuracy"], additive_metrics["balanced_accuracy"])
    metrics = {
        "evaluable_failure_count": len(evaluable_failures),
        "evaluable_control_count": len(evaluable_controls),
        "failure_sensitivity": sensitivity,
        "control_false_positive_rate": fpr,
        "median_failure_lead_time_days": median_lead,
        "balanced_accuracy": ucic_ba,
        "roa_only": roa_metrics,
        "additive_mean": additive_metrics,
        "best_comparator_balanced_accuracy": best_comp,
        "ucic_minus_best_comparator_balanced_accuracy": ucic_ba - best_comp,
    }
    disposition = terminal_disposition(metrics)

    result = {
        "operation": protocol["operation"],
        "parent_operation": protocol["parent_operation"],
        "protocol_status": protocol["protocol_status"],
        "acquisition_status": "PASS",
        "bankfind_endpoint_used": endpoint,
        "supported_fields": sorted(supported),
        "quarter_range": [QUARTERS[0], QUARTERS[-1]],
        "quarter_count": len(QUARTERS),
        "target_count": len(protocol["cohort"]),
        "target_results": target_results,
        "metrics": metrics,
        "terminal_disposition": disposition,
        "scientific_classification": protocol["scientific_ceiling"],
        "post_result_scientific_repair_permitted": False,
        "global_multiplicative_operator": "REMAINS_REJECTED",
        "independent_human_confirmation": "NOT_ESTABLISHED",
        "universal_law": "NOT_ESTABLISHED",
    }
    write_result(result)

    terminal_summary = {
        "terminal_disposition": disposition,
        "metrics": metrics,
        "supported_fields": sorted(supported),
        "endpoint": endpoint,
    }
    print("TERMINAL_RESULT_BEGIN")
    print(json.dumps(terminal_summary, indent=2, sort_keys=True))
    print("TERMINAL_RESULT_END")
    return 0


protocol_global: dict[str, Any] = {}

if __name__ == "__main__":
    raise SystemExit(main())
