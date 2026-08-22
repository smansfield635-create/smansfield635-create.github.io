from __future__ import annotations

import hashlib
import json
import math
import os
from pathlib import Path
from typing import Dict, List, Tuple

import joblib
import numpy as np
import pandas as pd
from scipy.stats import spearmanr
from sklearn.linear_model import Ridge
from sklearn.model_selection import GroupKFold
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

ROOT = Path(__file__).resolve().parent
DATA = ROOT / "data"
OUT = ROOT / "output"
OUT.mkdir(parents=True, exist_ok=True)

CONTRACT_ID = "IMI_CMAPSS_FD001_FACTORIAL_TEMPORAL_RUL_UNTOUCHED_VALIDATION_v1"
ALPHAS = [0.0, 0.01, 0.1, 1.0, 10.0, 100.0]
FRACTIONS = [0.40, 0.55, 0.70, 0.80, 0.90]
SENSOR_COLS = [f"s{i}" for i in range(1, 22)]
COLS = ["unit", "cycle", "setting1", "setting2", "setting3"] + SENSOR_COLS


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for block in iter(lambda: f.read(1024 * 1024), b""):
            h.update(block)
    return h.hexdigest()


def load_frame(path: Path) -> pd.DataFrame:
    df = pd.read_csv(path, sep=r"\s+", header=None)
    if df.shape[1] != 26:
        raise ValueError(f"{path.name}: expected 26 columns, found {df.shape[1]}")
    df.columns = COLS
    return df


def pooled_segments(train: pd.DataFrame) -> Tuple[pd.DataFrame, pd.DataFrame]:
    early_parts = []
    late_parts = []
    for _, g in train.groupby("unit", sort=True):
        g = g.sort_values("cycle")
        n = len(g)
        early_parts.append(g.iloc[: max(1, math.ceil(n * 0.20))])
        late_parts.append(g.iloc[max(0, math.floor(n * 0.90)) :])
    return pd.concat(early_parts, ignore_index=True), pd.concat(late_parts, ignore_index=True)


def derive_factor_dictionary(train: pd.DataFrame) -> Dict[str, dict]:
    early, late = pooled_segments(train)
    progress = train["cycle"] / train.groupby("unit")["cycle"].transform("max")
    candidates = []
    for sensor in SENSOR_COLS:
        std = float(train[sensor].std(ddof=0))
        if not np.isfinite(std) or std <= 1e-8:
            continue
        nominal = float(early[sensor].median())
        degraded = float(late[sensor].median())
        delta = degraded - nominal
        if abs(delta) <= max(1e-8, 1e-6 * max(1.0, abs(nominal))):
            continue
        direction = 1.0 if delta > 0 else -1.0
        rho = float(spearmanr(train[sensor], progress, nan_policy="omit").statistic)
        if not np.isfinite(rho) or abs(rho) < 0.40:
            continue
        scale = abs(delta)
        candidates.append(
            {
                "sensor": sensor,
                "nominal": nominal,
                "degraded_anchor": degraded,
                "direction": direction,
                "scale": scale,
                "training_monotonicity_abs": abs(rho),
                "training_monotonicity_signed": rho,
                "training_std": std,
            }
        )

    if not candidates:
        raise RuntimeError("No sensors passed the frozen factor-admission rule")

    candidates.sort(key=lambda x: (-x["training_monotonicity_abs"], x["sensor"]))
    selected: List[dict] = []
    oriented = {}
    for c in candidates:
        oriented[c["sensor"]] = c["direction"] * train[c["sensor"]].to_numpy(float)
    for c in candidates:
        duplicate = False
        for s in selected:
            corr = np.corrcoef(oriented[c["sensor"]], oriented[s["sensor"]])[0, 1]
            if np.isfinite(corr) and abs(corr) >= 0.95:
                duplicate = True
                break
        if not duplicate:
            selected.append(c)

    return {c["sensor"]: c for c in selected}


def severity_frame(df: pd.DataFrame, factors: Dict[str, dict]) -> pd.DataFrame:
    out = pd.DataFrame(index=df.index)
    for sensor, spec in factors.items():
        sev = spec["direction"] * (df[sensor].astype(float) - spec["nominal"]) / spec["scale"]
        out[sensor] = sev.clip(lower=0.0, upper=1.0)
    return out


def slope(values: np.ndarray) -> float:
    values = np.asarray(values, dtype=float)
    if len(values) < 3:
        return float("nan")
    x = np.arange(len(values), dtype=float)
    return float(np.polyfit(x, values, 1)[0])


def persistence(values: np.ndarray) -> float:
    values = np.asarray(values, dtype=float)
    if len(values) < 3:
        return float("nan")
    d = np.diff(values)
    return float(np.mean(d > 0.0))


def aggregate_history(history: pd.DataFrame, factors: Dict[str, dict]) -> dict:
    sev = severity_frame(history, factors)
    avail = 1.0 - sev
    product_avail = avail.prod(axis=1)
    cs = 1.0 - product_avail
    mean_sev = sev.mean(axis=1)
    weakest_sev = sev.max(axis=1)
    window = min(10, len(history))
    cs_tail = cs.iloc[-window:].to_numpy(float)
    mean_tail = mean_sev.iloc[-window:].to_numpy(float)
    weak_tail = weakest_sev.iloc[-window:].to_numpy(float)
    result = {
        "cycle": float(history["cycle"].iloc[-1]),
        "cs": float(cs.iloc[-1]),
        "cs_direction": slope(cs_tail),
        "cs_persistence": persistence(cs_tail),
        "mean_severity": float(mean_sev.iloc[-1]),
        "mean_direction": slope(mean_tail),
        "mean_persistence": persistence(mean_tail),
        "weakest_severity": float(weakest_sev.iloc[-1]),
        "weakest_direction": slope(weak_tail),
        "weakest_persistence": persistence(weak_tail),
    }
    for sensor in factors:
        vals = sev[sensor].iloc[-window:].to_numpy(float)
        result[f"{sensor}_severity"] = float(vals[-1])
        result[f"{sensor}_slope"] = slope(vals)
    return result


def build_development_rows(train: pd.DataFrame, factors: Dict[str, dict]) -> pd.DataFrame:
    rows = []
    for unit, g in train.groupby("unit", sort=True):
        g = g.sort_values("cycle").reset_index(drop=True)
        max_cycle = int(g["cycle"].max())
        endpoints = sorted({max(3, int(math.floor(max_cycle * f))) for f in FRACTIONS})
        for endpoint in endpoints:
            history = g[g["cycle"] <= endpoint]
            features = aggregate_history(history, factors)
            features.update({"unit": int(unit), "endpoint": endpoint, "rul": float(max_cycle - endpoint)})
            rows.append(features)
    dev = pd.DataFrame(rows)
    if dev.isna().any().any():
        bad = dev.columns[dev.isna().any()].tolist()
        raise RuntimeError(f"Development features contain UNEVALUABLE values: {bad}")
    return dev


def build_test_rows(test: pd.DataFrame, factors: Dict[str, dict]) -> pd.DataFrame:
    rows = []
    for unit, g in test.groupby("unit", sort=True):
        g = g.sort_values("cycle").reset_index(drop=True)
        features = aggregate_history(g, factors)
        features.update({"unit": int(unit), "endpoint": int(g["cycle"].max())})
        rows.append(features)
    test_rows = pd.DataFrame(rows).sort_values("unit").reset_index(drop=True)
    if len(test_rows) != 100:
        raise RuntimeError(f"Expected 100 test engines, found {len(test_rows)}")
    if test_rows.isna().any().any():
        bad = test_rows.columns[test_rows.isna().any()].tolist()
        raise RuntimeError(f"Test features contain UNEVALUABLE values: {bad}")
    return test_rows


def model_columns(factors: Dict[str, dict]) -> Dict[str, List[str]]:
    full = ["cycle"]
    for sensor in factors:
        full.extend([f"{sensor}_severity", f"{sensor}_slope"])
    return {
        "M0_AGE_ONLY": ["cycle"],
        "M1_IMI_CONDITION": ["cycle", "cs"],
        "M2_IMI_FACTORIAL": ["cycle", "cs", "cs_direction", "cs_persistence"],
        "M3_ADDITIVE_FACTORIAL": ["cycle", "mean_severity", "mean_direction", "mean_persistence"],
        "M4_WEAKEST_FACTORIAL": ["cycle", "weakest_severity", "weakest_direction", "weakest_persistence"],
        "M5_FULL_SENSOR_RIDGE": full,
    }


def fit_models(dev: pd.DataFrame, test_rows: pd.DataFrame, cols_by_model: Dict[str, List[str]]) -> Tuple[dict, pd.DataFrame]:
    y = dev["rul"].to_numpy(float)
    groups = dev["unit"].to_numpy(int)
    folds = list(GroupKFold(n_splits=5).split(dev, y, groups=groups))
    models = {}
    predictions = pd.DataFrame({"unit": test_rows["unit"].astype(int)})
    cv_receipts = {}

    for model_id, cols in cols_by_model.items():
        X = dev[cols].to_numpy(float)
        Xt = test_rows[cols].to_numpy(float)
        alpha_scores = {}
        for alpha in ALPHAS:
            fold_rmse = []
            for tr_idx, va_idx in folds:
                pipe = Pipeline([("scale", StandardScaler()), ("ridge", Ridge(alpha=alpha, fit_intercept=True))])
                pipe.fit(X[tr_idx], y[tr_idx])
                pred = pipe.predict(X[va_idx])
                rmse = float(np.sqrt(np.mean((y[va_idx] - pred) ** 2)))
                fold_rmse.append(rmse)
            alpha_scores[str(alpha)] = {"fold_rmse": fold_rmse, "mean_rmse": float(np.mean(fold_rmse))}
        best_alpha = min(ALPHAS, key=lambda a: (alpha_scores[str(a)]["mean_rmse"], a))
        model = Pipeline([("scale", StandardScaler()), ("ridge", Ridge(alpha=best_alpha, fit_intercept=True))])
        model.fit(X, y)
        predictions[model_id] = model.predict(Xt)
        models[model_id] = {"columns": cols, "best_alpha": best_alpha, "pipeline": model}
        cv_receipts[model_id] = {"columns": cols, "best_alpha": best_alpha, "alpha_scores": alpha_scores}

    return {"models": models, "cv": cv_receipts}, predictions


def main() -> None:
    contract = ROOT / "PREDICTION_CONTRACT_FROZEN_BEFORE_OUTCOME_ACCESS.md"
    train_path = DATA / "train_FD001.txt"
    test_path = DATA / "test_FD001.txt"
    forbidden = DATA / "RUL_FD001.txt"
    if forbidden.exists():
        raise RuntimeError("OUTCOME_ACCESS_VIOLATION: RUL_FD001.txt exists before model and prediction freeze")
    for path in (contract, train_path, test_path):
        if not path.is_file():
            raise FileNotFoundError(path)

    train = load_frame(train_path)
    test = load_frame(test_path)
    factors = derive_factor_dictionary(train)
    dev = build_development_rows(train, factors)
    test_rows = build_test_rows(test, factors)
    cols = model_columns(factors)
    fitted, predictions = fit_models(dev, test_rows, cols)

    factor_path = OUT / "FACTOR_DICTIONARY_FROZEN.json"
    factor_path.write_text(json.dumps(factors, indent=2, sort_keys=True), encoding="utf-8")
    dev_path = OUT / "DEVELOPMENT_FEATURES.csv"
    dev.to_csv(dev_path, index=False)
    test_feature_path = OUT / "TEST_FEATURES_FROZEN.csv"
    test_rows.to_csv(test_feature_path, index=False)
    pred_path = OUT / "TEST_PREDICTIONS_FROZEN_BEFORE_OUTCOME_ACCESS.csv"
    predictions.to_csv(pred_path, index=False, float_format="%.12f")

    bundle = {
        "contract_id": CONTRACT_ID,
        "factors": factors,
        "model_columns": cols,
        "cv": fitted["cv"],
        "models": fitted["models"],
        "train_sha256": sha256(train_path),
        "test_sha256": sha256(test_path),
        "contract_sha256": sha256(contract),
        "prediction_sha256": sha256(pred_path),
    }
    bundle_path = OUT / "FROZEN_MODEL_BUNDLE.joblib"
    joblib.dump(bundle, bundle_path, compress=3)

    receipt = {
        "contract_id": CONTRACT_ID,
        "status": "PREDICTIONS_FROZEN_BEFORE_OUTCOME_ACCESS",
        "outcome_file_present_during_freeze": False,
        "admitted_factor_count": len(factors),
        "admitted_factors": list(factors.keys()),
        "development_row_count": int(len(dev)),
        "test_engine_count": int(len(test_rows)),
        "train_sha256": sha256(train_path),
        "test_sha256": sha256(test_path),
        "contract_sha256": sha256(contract),
        "prepare_code_sha256": sha256(Path(__file__)),
        "factor_dictionary_sha256": sha256(factor_path),
        "development_features_sha256": sha256(dev_path),
        "test_features_sha256": sha256(test_feature_path),
        "frozen_predictions_sha256": sha256(pred_path),
        "frozen_model_bundle_sha256": sha256(bundle_path),
        "selected_alphas": {k: v["best_alpha"] for k, v in fitted["cv"].items()},
    }
    receipt_path = OUT / "PREDICTION_FREEZE_RECEIPT.json"
    receipt_path.write_text(json.dumps(receipt, indent=2, sort_keys=True), encoding="utf-8")
    print(json.dumps(receipt, indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
