#!/usr/bin/env python3
import hashlib
import json
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import average_precision_score, brier_score_loss, roc_auc_score
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

ROOT = Path(__file__).resolve().parent
PROTOCOL = ROOT / "cross-class-relational-scope-protocol.v1.json"
INPUT = Path(__import__("os").environ.get("CROSS_CLASS_INPUT", str(ROOT / "cross-class-relational-scope-frozen-input.v1.csv")))
RESULT = ROOT / "cross-class-relational-scope-result.v1.json"
FEATURES = ROOT / "cross-class-relational-scope-derived-features.v1.csv"

SEED = 45125661
EXPECTED_INPUT_SHA256 = "8fb7684683a8f8a4a846299e1f3e19e44524297c7a3dcd2d49508d740760a306"
EXPECTED_PROTOCOL_SHA256 = "4eccb876ce31958761502946d564ca6cfbf1b5427abd4413d5ce4abcd5ded182"

BASE = ["vmax0", "pres0", "dvprev", "shear0", "sst0", "rhlo0", "mpi0"]

def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def pct_from_calibration(train, values, high=True):
    tr = np.asarray(train, dtype=float)
    tr = np.sort(tr[np.isfinite(tr)])
    x = np.asarray(values, dtype=float)
    out = np.full(len(x), np.nan, dtype=float)
    m = np.isfinite(x)
    if len(tr):
        p = np.searchsorted(tr, x[m], side="right") / len(tr)
        out[m] = p if high else 1.0 - p
    return out

def model(train, test, cols):
    pipe = make_pipeline(
        StandardScaler(),
        LogisticRegression(
            C=1.0,
            penalty="l2",
            solver="liblinear",
            random_state=SEED,
            max_iter=4000,
        ),
    )
    pipe.fit(train[cols], train["ri"].astype(int))
    return pipe.predict_proba(test[cols])[:, 1]

def metrics(y, p):
    return {
        "roc_auc": float(roc_auc_score(y, p)),
        "average_precision": float(average_precision_score(y, p)),
        "brier": float(brier_score_loss(y, p)),
    }

def storm_cluster_bootstrap(test, predictions):
    rng = np.random.default_rng(SEED)
    storms = np.array(sorted(test["storm_id"].unique()))
    positions = {
        s: np.flatnonzero(test["storm_id"].to_numpy() == s)
        for s in storms
    }
    y = test["ri"].to_numpy(dtype=int)
    contrasts = {
        "FULL_CROSS_CLASS_minus_BASE": [],
        "FULL_CROSS_CLASS_minus_INTERNAL_ONLY": [],
        "COUPLING_ONLY_minus_BASE": [],
    }
    for _ in range(2000):
        sampled = rng.choice(storms, len(storms), replace=True)
        idx = np.concatenate([positions[s] for s in sampled])
        yy = y[idx]
        if np.unique(yy).size < 2:
            continue
        auc = {
            k: roc_auc_score(yy, v[idx])
            for k, v in predictions.items()
        }
        contrasts["FULL_CROSS_CLASS_minus_BASE"].append(
            auc["FULL_CROSS_CLASS"] - auc["BASE"]
        )
        contrasts["FULL_CROSS_CLASS_minus_INTERNAL_ONLY"].append(
            auc["FULL_CROSS_CLASS"] - auc["INTERNAL_ONLY"]
        )
        contrasts["COUPLING_ONLY_minus_BASE"].append(
            auc["COUPLING_ONLY"] - auc["BASE"]
        )
    out = {}
    for name, values in contrasts.items():
        if not values:
            continue
        a = np.asarray(values, dtype=float)
        out[name] = {
            "n": int(len(a)),
            "median": float(np.median(a)),
            "ci95": [
                float(np.quantile(a, 0.025)),
                float(np.quantile(a, 0.975)),
            ],
        }
    return out

def terminal_disposition(delta_base, delta_internal, bootstrap):
    b1 = bootstrap["FULL_CROSS_CLASS_minus_BASE"]["ci95"][0]
    b2 = bootstrap["FULL_CROSS_CLASS_minus_INTERNAL_ONLY"]["ci95"][0]
    if delta_base <= 0:
        return "CROSS_CLASS_RELATIONAL_SCOPE_NOT_SUPPORTED"
    if delta_internal <= 0:
        return "CROSS_CLASS_NO_ADVANTAGE_OVER_INTERNAL_ONLY"
    if b1 > 0 and b2 > 0:
        return "CROSS_CLASS_RELATIONAL_SCOPE_SUPPORTED_WITH_LIMITATIONS"
    return "CROSS_CLASS_RELATIONAL_SIGNAL_PRESENT_SCOPE_SPECIFICITY_INCONCLUSIVE"

def main():
    protocol = json.loads(PROTOCOL.read_text())
    assert sha256(PROTOCOL) == EXPECTED_PROTOCOL_SHA256, "PROTOCOL_HASH_MISMATCH"
    assert sha256(INPUT) == EXPECTED_INPUT_SHA256, "INPUT_HASH_MISMATCH"

    d = pd.read_csv(INPUT)
    assert len(d) == 426, "RAW_ROW_COUNT_DRIFT"
    if d["sst0"].abs().ge(900).fillna(False).any():
        raise RuntimeError("SST_SENTINEL_SURVIVED_FROZEN_INPUT")

    d["dt2"] = pd.to_datetime(d["datetime"], errors="coerce")
    calibration_mask = d["year"] <= 2018

    d["resource_support"] = (
        pct_from_calibration(d.loc[calibration_mask, "sst0"], d["sst0"], True)
        + pct_from_calibration(d.loc[calibration_mask, "mpi0"], d["mpi0"], True)
    ) / 2.0

    d["atmospheric_permissiveness"] = (
        pct_from_calibration(d.loc[calibration_mask, "shear0"], d["shear0"], False)
        + pct_from_calibration(d.loc[calibration_mask, "rhlo0"], d["rhlo0"], True)
    ) / 2.0

    d["coupled_alignment"] = (
        d["resource_support"]
        * d["atmospheric_permissiveness"]
        * d["A_t"]
    )
    d["coupled_momentum"] = np.nan

    d = d.sort_values(["storm_id", "dt2", "case_index"]).reset_index(drop=True)
    for _, g in d.groupby("storm_id", sort=False):
        ix = list(g.index)
        for k in range(1, len(ix)):
            i, j = ix[k], ix[k - 1]
            if pd.isna(d.at[i, "dt2"]) or pd.isna(d.at[j, "dt2"]):
                continue
            hours = (d.at[i, "dt2"] - d.at[j, "dt2"]).total_seconds() / 3600.0
            if 6 <= hours <= 36:
                a = d.at[i, "coupled_alignment"]
                b = d.at[j, "coupled_alignment"]
                if np.isfinite(a) and np.isfinite(b):
                    d.at[i, "coupled_momentum"] = a - b

    models = {
        "BASE": BASE,
        "INTERNAL_ONLY": BASE + ["A_t", "dA_t"],
        "COUPLING_ONLY": BASE + ["coupled_alignment", "coupled_momentum"],
        "FULL_CROSS_CLASS": BASE
        + ["A_t", "dA_t", "coupled_alignment", "coupled_momentum"],
    }

    required = sorted(set(sum(models.values(), [])) | {"ri"})
    p = d.dropna(subset=required).copy()
    train = p[p["year"] <= 2018].copy()
    test = p[p["year"] >= 2019].reset_index(drop=True)

    out = {
        "operation": protocol["operation"],
        "development_class": protocol["development_class"],
        "protocol_sha256": sha256(PROTOCOL),
        "input_sha256": sha256(INPUT),
        "prior_result_preserved": protocol["prior_result_preservation"],
        "claim_ceiling": protocol["claim_ceiling"],
        "grand_scope_status": protocol["grand_scope_status"],
        "warning_time_claim": "NOT_TESTED",
        "raw_rows": int(len(d)),
        "primary_rows": int(len(p)),
        "calibration_rows": int(len(train)),
        "evaluation_rows": int(len(test)),
        "calibration_storms": int(train["storm_id"].nunique()),
        "evaluation_storms": int(test["storm_id"].nunique()),
        "calibration_ri": int(train["ri"].sum()) if len(train) else 0,
        "evaluation_ri": int(test["ri"].sum()) if len(test) else 0,
        "class_coverage": {
            "RESOURCE_SUPPORT": ["sst0", "mpi0"],
            "ATMOSPHERIC_PERMISSIVENESS": ["shear0", "rhlo0"],
            "INTERNAL_ORGANIZATION": ["A_t"],
            "CURRENT_STATE": ["vmax0", "pres0"],
            "RECENT_TRAJECTORY": ["dvprev", "dA_t"],
            "CROSS_CLASS_COUPLING_PROXY": [
                "coupled_alignment",
                "coupled_momentum",
            ],
            "UNMEASURED_DIRECT_TRANSFER_OR_FEEDBACK": True,
        },
    }

    if (
        len(train) < 20
        or len(test) < 20
        or train["ri"].nunique() < 2
        or test["ri"].nunique() < 2
    ):
        out["terminal_disposition"] = "CROSS_CLASS_RELATIONAL_SCOPE_UNEVALUABLE"
        FEATURES.write_text(d.to_csv(index=False))
        RESULT.write_text(json.dumps(out, indent=2, sort_keys=True) + "\n")
        print(json.dumps(out, indent=2, sort_keys=True))
        return

    predictions = {
        name: model(train, test, cols)
        for name, cols in models.items()
    }
    model_metrics = {
        name: metrics(test["ri"].astype(int), pred)
        for name, pred in predictions.items()
    }
    bootstrap = storm_cluster_bootstrap(test, predictions)

    delta_base = (
        model_metrics["FULL_CROSS_CLASS"]["roc_auc"]
        - model_metrics["BASE"]["roc_auc"]
    )
    delta_internal = (
        model_metrics["FULL_CROSS_CLASS"]["roc_auc"]
        - model_metrics["INTERNAL_ONLY"]["roc_auc"]
    )

    out["models"] = model_metrics
    out["primary_contrasts"] = {
        "FULL_CROSS_CLASS_minus_BASE_auc": float(delta_base),
        "FULL_CROSS_CLASS_minus_INTERNAL_ONLY_auc": float(delta_internal),
        "COUPLING_ONLY_minus_BASE_auc": float(
            model_metrics["COUPLING_ONLY"]["roc_auc"]
            - model_metrics["BASE"]["roc_auc"]
        ),
    }
    out["bootstrap"] = bootstrap
    out["terminal_disposition"] = terminal_disposition(
        delta_base, delta_internal, bootstrap
    )

    FEATURES.write_text(d.to_csv(index=False))
    RESULT.write_text(json.dumps(out, indent=2, sort_keys=True) + "\n")
    print(json.dumps(out, indent=2, sort_keys=True))

if __name__ == "__main__":
    main()
