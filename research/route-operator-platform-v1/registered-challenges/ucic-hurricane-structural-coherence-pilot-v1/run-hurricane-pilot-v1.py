#!/usr/bin/env python3
import csv
import hashlib
import io
import json
import math
import random
import statistics
import sys
import urllib.request
from collections import defaultdict
from datetime import datetime, timedelta, timezone
from pathlib import Path

OPERATION = "UCIC_HURRICANE_STRUCTURAL_COHERENCE_TEMPORAL_HOLDOUT_PILOT_v1"
ROOT = Path(__file__).resolve().parent
PROTOCOL_PATH = ROOT / "protocol.v1.json"
RESULT_PATH = ROOT / "result.v1.json"


def fail(msg):
    print(json.dumps({"status": "TECHNICAL_FAILURE", "message": msg}, sort_keys=True))
    raise SystemExit(2)


def parse_radius(x):
    v = int(x.strip())
    return v


def parse_latlon(x):
    x = x.strip()
    if not x:
        return None
    hemi = x[-1].upper()
    value = float(x[:-1])
    if hemi in ("S", "W"):
        value = -value
    return value


def download_text(url):
    headers = {
        "User-Agent": "Mozilla/5.0 (compatible; UCIC empirical research; +https://github.com/smansfield635-create/smansfield635-create.github.io)",
        "Accept": "text/plain,*/*;q=0.8",
        "Referer": "https://www.nhc.noaa.gov/data/",
    }
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=60) as resp:
        payload = resp.read()
    return payload


def parse_hurdat2(payload):
    text = payload.decode("utf-8", errors="strict")
    rows = []
    storm_id = None
    storm_name = None
    expected = None
    observed_for_storm = 0
    for raw in text.splitlines():
        line = raw.strip()
        if not line:
            continue
        parts = [p.strip() for p in line.split(",")]
        if parts[0].startswith("AL") and len(parts[0]) == 8 and parts[0][2:].isdigit():
            if storm_id is not None and expected is not None and observed_for_storm != expected:
                fail(f"HURDAT2 count mismatch for {storm_id}: expected {expected}, observed {observed_for_storm}")
            storm_id = parts[0]
            storm_name = parts[1]
            expected = int(parts[2])
            observed_for_storm = 0
            continue
        if storm_id is None:
            fail("Encountered HURDAT2 data line before storm header")
        if len(parts) < 20:
            fail(f"Unexpected HURDAT2 field count {len(parts)} for {storm_id}: {line[:120]}")
        observed_for_storm += 1
        date = parts[0]
        time = parts[1]
        dt = datetime.strptime(date + time, "%Y%m%d%H%M").replace(tzinfo=timezone.utc)
        wind = int(parts[6])
        pressure = int(parts[7])
        radii = [parse_radius(x) for x in parts[8:20]]
        rows.append({
            "storm_id": storm_id,
            "storm_name": storm_name,
            "dt": dt,
            "year": dt.year,
            "record_id": parts[2],
            "status": parts[3],
            "lat": parse_latlon(parts[4]),
            "lon": parse_latlon(parts[5]),
            "wind": wind,
            "pressure": pressure,
            "r34": radii[0:4],
            "r50": radii[4:8],
            "r64": radii[8:12],
        })
    if storm_id is not None and expected is not None and observed_for_storm != expected:
        fail(f"HURDAT2 count mismatch for {storm_id}: expected {expected}, observed {observed_for_storm}")
    return rows


def symmetry(q):
    if any(v < 0 for v in q):
        return None
    mx = max(q)
    if mx <= 0:
        return 0.0
    return min(q) / mx


def structural_features(r):
    s34 = symmetry(r["r34"])
    s50 = symmetry(r["r50"])
    s64 = symmetry(r["r64"])
    if None in (s34, s50, s64):
        return None
    rel = []
    for q in range(4):
        a, b, c = r["r34"][q], r["r50"][q], r["r64"][q]
        if min(a, b, c) < 0:
            return None
        rel.append(1.0 if a >= b else 0.0)
        rel.append(1.0 if b >= c else 0.0)
    nesting = sum(rel) / len(rel)
    vals = [s34, s50, s64, nesting]
    return {
        "sym34": s34,
        "sym50": s50,
        "sym64": s64,
        "nesting": nesting,
        "ucic": min(vals),
        "additive": sum(vals) / len(vals),
    }


def build_samples(rows):
    by_storm_time = {(r["storm_id"], r["dt"]): r for r in rows}
    samples = []
    exclusion = defaultdict(int)
    for r in rows:
        if not (2004 <= r["year"] <= 2025):
            exclusion["outside_year_window"] += 1
            continue
        if r["status"] != "HU" or r["wind"] < 65:
            exclusion["not_current_hurricane"] += 1
            continue
        if r["pressure"] < 800 or r["pressure"] > 1100:
            exclusion["missing_or_invalid_pressure"] += 1
            continue
        feat = structural_features(r)
        if feat is None:
            exclusion["missing_radius_field"] += 1
            continue
        prior = by_storm_time.get((r["storm_id"], r["dt"] - timedelta(hours=24)))
        future = by_storm_time.get((r["storm_id"], r["dt"] + timedelta(hours=24)))
        if prior is None:
            exclusion["missing_prior_24h"] += 1
            continue
        if future is None:
            exclusion["missing_future_24h"] += 1
            continue
        if prior["wind"] < 0 or future["wind"] < 0:
            exclusion["invalid_temporal_wind"] += 1
            continue
        delta_prior = r["wind"] - prior["wind"]
        delta_future = future["wind"] - r["wind"]
        samples.append({
            "storm_id": r["storm_id"],
            "storm_name": r["storm_name"],
            "dt": r["dt"].isoformat(),
            "year": r["year"],
            "wind": float(r["wind"]),
            "pressure": float(r["pressure"]),
            "prior_delta": float(delta_prior),
            "future_delta": float(delta_future),
            "ri": 1 if delta_future >= 30 else 0,
            **feat,
        })
    return samples, dict(exclusion)


def sigmoid(z):
    if z >= 0:
        ez = math.exp(-z)
        return 1.0 / (1.0 + ez)
    ez = math.exp(z)
    return ez / (1.0 + ez)


def fit_logistic(rows, feature_names, iterations=4000, lr=0.08, l2=0.001):
    if not rows:
        fail("No calibration rows")
    means = []
    stds = []
    for f in feature_names:
        vals = [r[f] for r in rows]
        m = statistics.fmean(vals)
        var = statistics.fmean([(x - m) ** 2 for x in vals])
        s = math.sqrt(var) if var > 1e-12 else 1.0
        means.append(m)
        stds.append(s)
    X = []
    y = []
    for r in rows:
        X.append([1.0] + [(r[f] - means[i]) / stds[i] for i, f in enumerate(feature_names)])
        y.append(float(r["ri"]))
    w = [0.0] * (len(feature_names) + 1)
    n = len(X)
    for _ in range(iterations):
        grad = [0.0] * len(w)
        for xi, yi in zip(X, y):
            p = sigmoid(sum(a * b for a, b in zip(w, xi)))
            err = p - yi
            for j in range(len(w)):
                grad[j] += err * xi[j]
        for j in range(len(w)):
            grad[j] /= n
            if j > 0:
                grad[j] += l2 * w[j]
            w[j] -= lr * grad[j]
    return {"features": feature_names, "means": means, "stds": stds, "weights": w}


def predict(model, r):
    x = [1.0]
    for i, f in enumerate(model["features"]):
        x.append((r[f] - model["means"][i]) / model["stds"][i])
    return sigmoid(sum(a * b for a, b in zip(model["weights"], x)))


def auc(y, scores):
    pos = sum(y)
    neg = len(y) - pos
    if pos == 0 or neg == 0:
        return None
    ordered = sorted(zip(scores, y), key=lambda z: z[0])
    rank_sum_pos = 0.0
    i = 0
    rank = 1
    while i < len(ordered):
        j = i + 1
        while j < len(ordered) and ordered[j][0] == ordered[i][0]:
            j += 1
        avg_rank = (rank + (rank + (j - i) - 1)) / 2.0
        rank_sum_pos += avg_rank * sum(v for _, v in ordered[i:j])
        rank += j - i
        i = j
    return (rank_sum_pos - pos * (pos + 1) / 2.0) / (pos * neg)


def ranks(vals):
    order = sorted(range(len(vals)), key=lambda i: vals[i])
    out = [0.0] * len(vals)
    k = 0
    while k < len(order):
        j = k + 1
        while j < len(order) and vals[order[j]] == vals[order[k]]:
            j += 1
        avg = ((k + 1) + j) / 2.0
        for t in range(k, j):
            out[order[t]] = avg
        k = j
    return out


def pearson(a, b):
    if len(a) < 2:
        return None
    ma = statistics.fmean(a)
    mb = statistics.fmean(b)
    da = [x - ma for x in a]
    db = [x - mb for x in b]
    den = math.sqrt(sum(x*x for x in da) * sum(x*x for x in db))
    if den <= 0:
        return 0.0
    return sum(x*y for x, y in zip(da, db)) / den


def spearman(a, b):
    return pearson(ranks(a), ranks(b))


def bootstrap_delta(rows, history_scores, combined_scores, reps=1000, seed=45161):
    grouped = defaultdict(list)
    for i, r in enumerate(rows):
        grouped[r["storm_id"]].append(i)
    storms = sorted(grouped)
    rng = random.Random(seed)
    deltas = []
    for _ in range(reps):
        idx = []
        for _ in storms:
            sid = rng.choice(storms)
            idx.extend(grouped[sid])
        y = [rows[i]["ri"] for i in idx]
        ah = auc(y, [history_scores[i] for i in idx])
        ac = auc(y, [combined_scores[i] for i in idx])
        if ah is not None and ac is not None:
            deltas.append(ac - ah)
    if len(deltas) < max(100, reps // 2):
        return None, len(deltas)
    deltas.sort()
    lo = deltas[int(0.025 * (len(deltas) - 1))]
    hi = deltas[int(0.975 * (len(deltas) - 1))]
    return [lo, hi], len(deltas)


def adjudicate(metrics, minimum):
    if (
        metrics["calibration_count"] < minimum["calibration_observations"] or
        metrics["holdout_count"] < minimum["holdout_observations"] or
        metrics["holdout_ri_count"] < minimum["holdout_ri_events"] or
        metrics["holdout_non_ri_count"] < minimum["holdout_non_ri_events"] or
        metrics["holdout_storm_count"] < minimum["holdout_unique_storms"] or
        metrics["bootstrap_95pct_ci_incremental_auc"] is None or
        metrics["holdout_history_auc"] is None or
        metrics["holdout_history_plus_ucic_auc"] is None or
        metrics["holdout_ucic_only_auc"] is None or
        metrics["holdout_additive_structural_auc"] is None
    ):
        return "HURRICANE_STRUCTURAL_COHERENCE_UNEVALUABLE"
    delta = metrics["incremental_auc"]
    lo, hi = metrics["bootstrap_95pct_ci_incremental_auc"]
    if delta <= 0 or hi <= 0:
        return "HURRICANE_STRUCTURAL_COHERENCE_INCREMENT_NOT_SUPPORTED"
    if delta <= 0.02 and hi <= 0.02:
        return "HURRICANE_STRUCTURAL_COHERENCE_REDUNDANT_WITH_STATE_HISTORY"
    if lo <= 0 or delta < 0.02:
        return "HURRICANE_STRUCTURAL_COHERENCE_AMBIGUOUS"
    if metrics["holdout_additive_structural_auc"] > metrics["holdout_ucic_only_auc"] + 0.02:
        return "HURRICANE_STRUCTURAL_SIGNAL_PRESENT_NONCOMPENSATORY_SPECIFICITY_NOT_SUPPORTED"
    return "UCIC_HURRICANE_STRUCTURAL_COHERENCE_SUPPORTED_WITH_LIMITATIONS"


def main():
    protocol = json.loads(PROTOCOL_PATH.read_text())
    if protocol.get("operation") != OPERATION:
        fail("Protocol operation mismatch")
    url = protocol["source"]["primary_url"]
    payload = download_text(url)
    source_sha256 = hashlib.sha256(payload).hexdigest()
    rows = parse_hurdat2(payload)
    samples, exclusions = build_samples(rows)
    calibration = [r for r in samples if 2004 <= r["year"] <= 2018]
    holdout = [r for r in samples if 2019 <= r["year"] <= 2025]

    hist_features = ["wind", "pressure", "prior_delta"]
    combined_features = ["wind", "pressure", "prior_delta", "ucic"]
    history_model = fit_logistic(calibration, hist_features)
    combined_model = fit_logistic(calibration, combined_features)
    y = [r["ri"] for r in holdout]
    history_scores = [predict(history_model, r) for r in holdout]
    combined_scores = [predict(combined_model, r) for r in holdout]
    ucic_scores = [r["ucic"] for r in holdout]
    additive_scores = [r["additive"] for r in holdout]

    h_auc = auc(y, history_scores)
    c_auc = auc(y, combined_scores)
    u_auc = auc(y, ucic_scores)
    a_auc = auc(y, additive_scores)
    delta_auc = None if h_auc is None or c_auc is None else c_auc - h_auc
    ci, valid_boot = bootstrap_delta(
        holdout, history_scores, combined_scores,
        reps=protocol["metrics"]["bootstrap"]["replicates"],
        seed=protocol["metrics"]["bootstrap"]["seed"],
    )
    metrics = {
        "calibration_count": len(calibration),
        "calibration_ri_count": sum(r["ri"] for r in calibration),
        "holdout_count": len(holdout),
        "holdout_ri_count": sum(y),
        "holdout_non_ri_count": len(y) - sum(y),
        "holdout_storm_count": len(set(r["storm_id"] for r in holdout)),
        "holdout_ri_prevalence": (sum(y) / len(y)) if y else None,
        "holdout_history_auc": h_auc,
        "holdout_history_plus_ucic_auc": c_auc,
        "incremental_auc": delta_auc,
        "bootstrap_95pct_ci_incremental_auc": ci,
        "bootstrap_valid_replicates": valid_boot,
        "holdout_ucic_only_auc": u_auc,
        "holdout_additive_structural_auc": a_auc,
        "ucic_minus_additive_auc": None if u_auc is None or a_auc is None else u_auc - a_auc,
        "spearman_ucic_vs_24h_wind_change": spearman(ucic_scores, [r["future_delta"] for r in holdout]) if holdout else None,
    }
    disposition = adjudicate(metrics, protocol["minimum_evaluability"])
    result = {
        "operation": OPERATION,
        "protocol_status": protocol["protocol_status"],
        "source": {
            "url": url,
            "sha256": source_sha256,
            "bytes": len(payload),
            "parsed_rows": len(rows),
        },
        "sample_exclusions": exclusions,
        "metrics": metrics,
        "terminal_disposition": disposition,
        "scientific_ceiling": protocol["scientific_ceiling"],
        "interpretive_boundary": protocol["frozen_structural_representation"]["interpretive_boundary"],
        "post_result_scientific_repair_permitted": False,
        "history_model": history_model,
        "combined_model": combined_model,
    }
    RESULT_PATH.write_text(json.dumps(result, indent=2, sort_keys=True) + "\n")
    print(json.dumps({
        "terminal_disposition": disposition,
        "source_sha256": source_sha256,
        "metrics": metrics,
    }, indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
