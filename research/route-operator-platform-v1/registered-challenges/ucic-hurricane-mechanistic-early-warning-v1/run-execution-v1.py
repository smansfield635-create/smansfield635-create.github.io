#!/usr/bin/env python3
import hashlib
import json
import math
import urllib.request
from pathlib import Path
from datetime import datetime

import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score, average_precision_score, brier_score_loss
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

ROOT = Path(__file__).resolve().parent
PROTOCOL = json.loads((ROOT / "execution-protocol.v1.json").read_text())
OUT = ROOT / "execution-result.v1.json"
SOURCE_COPY = ROOT / "tc-radar-metadata-merge.source.json"
SEED = 45125661


def download(url):
    req = urllib.request.Request(url, headers={"User-Agent": "UCIC-TC-RADAR-execution/1.0"})
    with urllib.request.urlopen(req, timeout=120) as r:
        data = r.read()
    SOURCE_COPY.write_bytes(data)
    return data


def parse_dt(s):
    return datetime.strptime(s, "%Y-%m-%d %H:%M UTC")


def ecdf_apply(train_values, values):
    arr = np.sort(np.asarray(train_values, dtype=float))
    vals = np.asarray(values, dtype=float)
    return np.searchsorted(arr, vals, side="right") / len(arr)


def fit_predict(train, test, cols):
    model = make_pipeline(
        StandardScaler(),
        LogisticRegression(C=1.0, penalty="l2", solver="liblinear", random_state=SEED, max_iter=2000),
    )
    model.fit(train[cols], train["ri"])
    return model, model.predict_proba(test[cols])[:, 1]


def metrics(y, p):
    return {
        "roc_auc": float(roc_auc_score(y, p)),
        "average_precision": float(average_precision_score(y, p)),
        "brier": float(brier_score_loss(y, p)),
    }


def bootstrap_increment(test, p_base, p_combined, reps=2000):
    rng = np.random.default_rng(SEED)
    storms = np.array(sorted(test["storm_id"].unique()))
    vals = []
    idx_by_storm = {s: np.flatnonzero(test["storm_id"].to_numpy() == s) for s in storms}
    y = test["ri"].to_numpy()
    for _ in range(reps):
        sampled = rng.choice(storms, size=len(storms), replace=True)
        idx = np.concatenate([idx_by_storm[s] for s in sampled])
        yy = y[idx]
        if len(np.unique(yy)) < 2:
            continue
        vals.append(roc_auc_score(yy, p_combined[idx]) - roc_auc_score(yy, p_base[idx]))
    if not vals:
        return {"valid_replicates": 0, "ci95": [None, None], "median": None}
    a = np.asarray(vals)
    return {
        "valid_replicates": int(len(a)),
        "ci95": [float(np.quantile(a, 0.025)), float(np.quantile(a, 0.975))],
        "median": float(np.median(a)),
    }


def matched_state_contrast(test, baseline_cols):
    if len(test) < 10:
        return {"status": "UNEVALUABLE"}
    x = test[baseline_cols].to_numpy(dtype=float)
    mu = x.mean(axis=0)
    sd = x.std(axis=0)
    sd[sd == 0] = 1.0
    z = (x - mu) / sd
    c = test["C_t"].to_numpy()
    y = test["ri"].to_numpy()
    med = float(np.median(c))
    hi = np.flatnonzero(c > med)
    lo = np.flatnonzero(c <= med)
    used = set()
    pairs = []
    for i in hi:
        cand = [j for j in lo if j not in used and test.iloc[j]["storm_id"] != test.iloc[i]["storm_id"]]
        if not cand:
            continue
        d = np.array([np.linalg.norm(z[i] - z[j]) for j in cand])
        j = cand[int(np.argmin(d))]
        used.add(j)
        pairs.append((i, j))
    if len(pairs) < 5:
        return {"status": "UNEVALUABLE", "pairs": len(pairs)}
    hi_y = np.array([y[i] for i, _ in pairs])
    lo_y = np.array([y[j] for _, j in pairs])
    return {
        "status": "EVALUABLE",
        "pairs": len(pairs),
        "high_C_ri_rate": float(hi_y.mean()),
        "low_C_ri_rate": float(lo_y.mean()),
        "risk_difference": float(hi_y.mean() - lo_y.mean()),
    }


def main():
    raw = download(PROTOCOL["source"])
    source_sha = hashlib.sha256(raw).hexdigest()
    data = json.loads(raw)
    df = pd.DataFrame(data["cases"])

    req = PROTOCOL["required_fields"]
    missing_cols = [c for c in req if c not in df.columns]
    if missing_cols:
        raise SystemExit(f"Missing required fields: {missing_cols}")

    df = df[(df["year"] >= 2004) & (df["year"] <= 2024)].copy()
    df = df.dropna(subset=req).copy()
    df["dt"] = df["datetime"].map(parse_dt)
    df["storm_id"] = df["year"].astype(int).astype(str) + "_" + df["storm_name"].astype(str)
    df["ri"] = (df["dvmax_24h"].astype(float) >= 30.0).astype(int)

    train_mask = (df["year"] >= 2004) & (df["year"] <= 2018)
    hold_mask = (df["year"] >= 2019) & (df["year"] <= 2024)
    train0 = df[train_mask].copy()
    if len(train0) < 20:
        raise SystemExit("Insufficient calibration rows")

    tilt_pct = ecdf_apply(train0["tilt_magnitude_km"], df["tilt_magnitude_km"])
    rmw_pct = ecdf_apply(train0["rmw_km"], df["rmw_km"])
    cov_pct = ecdf_apply(train0["coverage"], df["coverage"])
    df["R_tilt"] = 1.0 - tilt_pct
    df["R_rmw"] = 1.0 - rmw_pct
    df["R_coverage"] = cov_pct
    df["C_t"] = np.minimum.reduce([df["R_tilt"].to_numpy(), df["R_rmw"].to_numpy(), df["R_coverage"].to_numpy()])

    df = df.sort_values(["storm_id", "dt"]).reset_index(drop=True)
    df["M_t"] = np.nan
    df["previous_interval_hours"] = np.nan
    for sid, g in df.groupby("storm_id", sort=False):
        idxs = list(g.index)
        for k in range(1, len(idxs)):
            i = idxs[k]
            j = idxs[k - 1]
            hours = (df.at[i, "dt"] - df.at[j, "dt"]).total_seconds() / 3600.0
            if 6.0 <= hours <= 36.0:
                df.at[i, "M_t"] = float(df.at[i, "C_t"] - df.at[j, "C_t"])
                df.at[i, "previous_interval_hours"] = hours

    baseline_cols = ["vmax_kt", "min_pressure_hpa", "shear_magnitude_kt", "sst", "rhlo", "vmpi"]
    structural_cols = ["C_t", "M_t"]
    combined_cols = baseline_cols + structural_cols

    model_df = df.dropna(subset=["M_t"] + baseline_cols + ["ri"]).copy()
    train = model_df[(model_df["year"] >= 2004) & (model_df["year"] <= 2018)].copy()
    test = model_df[(model_df["year"] >= 2019) & (model_df["year"] <= 2024)].copy()

    result = {
        "operation": PROTOCOL["operation"],
        "source_sha256": source_sha,
        "source_total_cases": int(data.get("total_cases", len(data.get("cases", [])))),
        "eligible_complete_rows": int(len(df)),
        "momentum_evaluable_rows": int(len(model_df)),
        "calibration_rows": int(len(train)),
        "holdout_rows": int(len(test)),
        "calibration_storms": int(train["storm_id"].nunique()),
        "holdout_storms": int(test["storm_id"].nunique()),
        "calibration_ri_events": int(train["ri"].sum()),
        "holdout_ri_events": int(test["ri"].sum()),
        "holdout_non_ri": int((1 - test["ri"]).sum()),
        "primary_metric": PROTOCOL["primary_metric"],
        "claim_ceiling": PROTOCOL["claim_ceiling"],
    }

    # C-only all-eligible secondary analysis.
    all_train = df[(df["year"] <= 2018)].copy()
    all_test = df[(df["year"] >= 2019)].copy()
    if len(all_test) >= 10 and all_test["ri"].nunique() == 2 and all_train["ri"].nunique() == 2:
        _, p_c = fit_predict(all_train, all_test, ["C_t"])
        result["C_only_all_eligible"] = metrics(all_test["ri"], p_c)
        result["C_only_all_holdout_rows"] = int(len(all_test))
        result["C_only_all_holdout_events"] = int(all_test["ri"].sum())

    if len(test) < 10 or test["ri"].nunique() < 2 or train["ri"].nunique() < 2:
        result["terminal_disposition"] = "UNEVALUABLE"
        OUT.write_text(json.dumps(result, indent=2, sort_keys=True) + "\n")
        print(json.dumps(result, indent=2, sort_keys=True))
        return

    _, p_base = fit_predict(train, test, baseline_cols)
    _, p_struct = fit_predict(train, test, structural_cols)
    _, p_comb = fit_predict(train, test, combined_cols)

    m_base = metrics(test["ri"], p_base)
    m_struct = metrics(test["ri"], p_struct)
    m_comb = metrics(test["ri"], p_comb)
    inc = m_comb["roc_auc"] - m_base["roc_auc"]
    boot = bootstrap_increment(test, p_base, p_comb, reps=2000)

    result["state_environment_model"] = m_base
    result["structural_C_M_model"] = m_struct
    result["combined_model"] = m_comb
    result["incremental_auc"] = float(inc)
    result["storm_cluster_bootstrap"] = boot
    result["matched_state_contrast"] = matched_state_contrast(test.reset_index(drop=True), baseline_cols)
    result["holdout_predictions"] = [
        {
            "storm_id": str(r.storm_id),
            "datetime": r.datetime,
            "ri": int(r.ri),
            "C_t": float(r.C_t),
            "M_t": float(r.M_t),
            "p_state_environment": float(pb),
            "p_structural": float(ps),
            "p_combined": float(pc),
        }
        for r, pb, ps, pc in zip(test.itertuples(index=False), p_base, p_struct, p_comb)
    ]

    lo = boot["ci95"][0]
    if inc <= 0:
        disp = "NOT_SUPPORTED"
    elif lo is not None and lo > 0:
        disp = "SUPPORTED_WITH_LIMITATIONS"
    else:
        disp = "SIGNAL_PRESENT_INCONCLUSIVE"
    result["terminal_disposition"] = disp

    OUT.write_text(json.dumps(result, indent=2, sort_keys=True) + "\n")
    print(json.dumps(result, indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
