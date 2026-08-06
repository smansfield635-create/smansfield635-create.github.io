from __future__ import annotations

import hashlib
import json
from pathlib import Path

import numpy as np
import pandas as pd
from scipy.stats import spearmanr

ROOT = Path(__file__).resolve().parent
DATA = ROOT / "data"
OUT = ROOT / "output"
CONTRACT_ID = "IMI_CMAPSS_FD001_FACTORIAL_TEMPORAL_RUL_UNTOUCHED_VALIDATION_v1"
MODELS = [
    "M0_AGE_ONLY",
    "M1_IMI_CONDITION",
    "M2_IMI_FACTORIAL",
    "M3_ADDITIVE_FACTORIAL",
    "M4_WEAKEST_FACTORIAL",
    "M5_FULL_SENSOR_RIDGE",
]


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for block in iter(lambda: f.read(1024 * 1024), b""):
            h.update(block)
    return h.hexdigest()


def metrics(y: np.ndarray, p: np.ndarray) -> dict:
    err = p - y
    if np.std(p) > 0:
        slope, intercept = np.polyfit(p, y, 1)
    else:
        slope, intercept = float("nan"), float("nan")
    rho = float(spearmanr(y, p).statistic)
    return {
        "rmse": float(np.sqrt(np.mean(err**2))),
        "mae": float(np.mean(np.abs(err))),
        "spearman": rho,
        "calibration_intercept": float(intercept),
        "calibration_slope": float(slope),
        "mean_error": float(np.mean(err)),
    }


def bootstrap_improvement(y: np.ndarray, p_model: np.ndarray, p_comp: np.ndarray, n: int = 10000) -> dict:
    rng = np.random.default_rng(256)
    size = len(y)
    vals = np.empty(n, dtype=float)
    for i in range(n):
        idx = rng.integers(0, size, size=size)
        rm_model = np.sqrt(np.mean((p_model[idx] - y[idx]) ** 2))
        rm_comp = np.sqrt(np.mean((p_comp[idx] - y[idx]) ** 2))
        vals[i] = 1.0 - (rm_model / rm_comp) if rm_comp > 0 else np.nan
    vals = vals[np.isfinite(vals)]
    point_rm_model = np.sqrt(np.mean((p_model - y) ** 2))
    point_rm_comp = np.sqrt(np.mean((p_comp - y) ** 2))
    point = 1.0 - point_rm_model / point_rm_comp
    low, high = np.quantile(vals, [0.025, 0.975])
    return {
        "relative_rmse_improvement": float(point),
        "bootstrap_95_ci": [float(low), float(high)],
        "material": bool(point >= 0.05 and low > 0.0),
        "bootstrap_resamples": int(len(vals)),
    }


def main() -> None:
    freeze_receipt_path = OUT / "PREDICTION_FREEZE_RECEIPT.json"
    pred_path = OUT / "TEST_PREDICTIONS_FROZEN_BEFORE_OUTCOME_ACCESS.csv"
    outcome_path = DATA / "RUL_FD001.txt"
    if not freeze_receipt_path.is_file() or not pred_path.is_file():
        raise RuntimeError("MISSING_PREDICTION_FREEZE_OBJECT")
    if not outcome_path.is_file():
        raise FileNotFoundError(outcome_path)

    freeze = json.loads(freeze_receipt_path.read_text(encoding="utf-8"))
    if freeze.get("status") != "PREDICTIONS_FROZEN_BEFORE_OUTCOME_ACCESS":
        raise RuntimeError("INVALID_FREEZE_STATUS")
    if sha256(pred_path) != freeze.get("frozen_predictions_sha256"):
        raise RuntimeError("PREDICTION_HASH_MISMATCH")

    pred = pd.read_csv(pred_path).sort_values("unit").reset_index(drop=True)
    y = pd.read_csv(outcome_path, sep=r"\s+", header=None).iloc[:, 0].to_numpy(float)
    if len(y) != 100 or len(pred) != 100:
        raise RuntimeError(f"EXPECTED_100_OUTCOMES_AND_PREDICTIONS: outcomes={len(y)} predictions={len(pred)}")

    result_metrics = {m: metrics(y, pred[m].to_numpy(float)) for m in MODELS}
    comparisons = {}
    for model in MODELS[1:]:
        comparisons[f"{model}_VS_M0_AGE_ONLY"] = bootstrap_improvement(
            y, pred[model].to_numpy(float), pred["M0_AGE_ONLY"].to_numpy(float)
        )
    comparisons["M2_IMI_FACTORIAL_VS_M1_IMI_CONDITION"] = bootstrap_improvement(
        y, pred["M2_IMI_FACTORIAL"].to_numpy(float), pred["M1_IMI_CONDITION"].to_numpy(float)
    )
    comparisons["M2_IMI_FACTORIAL_VS_M3_ADDITIVE_FACTORIAL"] = bootstrap_improvement(
        y, pred["M2_IMI_FACTORIAL"].to_numpy(float), pred["M3_ADDITIVE_FACTORIAL"].to_numpy(float)
    )
    comparisons["M2_IMI_FACTORIAL_VS_M4_WEAKEST_FACTORIAL"] = bootstrap_improvement(
        y, pred["M2_IMI_FACTORIAL"].to_numpy(float), pred["M4_WEAKEST_FACTORIAL"].to_numpy(float)
    )

    m1_m0 = comparisons["M1_IMI_CONDITION_VS_M0_AGE_ONLY"]["material"]
    m2_m0 = comparisons["M2_IMI_FACTORIAL_VS_M0_AGE_ONLY"]["material"]
    m2_m1 = comparisons["M2_IMI_FACTORIAL_VS_M1_IMI_CONDITION"]["material"]
    m2_m3 = comparisons["M2_IMI_FACTORIAL_VS_M3_ADDITIVE_FACTORIAL"]["material"]

    dispositions = {
        "MULTIDIMENSIONAL_CONDITION_UTILITY": "SUPPORTED" if m1_m0 else "NOT_SUPPORTED",
        "FACTORIAL_TEMPORAL_UTILITY": "SUPPORTED" if (m2_m0 and m2_m1) else "NOT_SUPPORTED",
        "MULTIPLICATIVE_SPECIFICITY": "SUPPORTED" if m2_m3 else "NOT_SUPPORTED",
    }
    if m2_m0 and not m2_m3:
        primary = "OPERATOR_NOT_DISTINGUISHED"
    elif not m2_m0:
        primary = "CLAIM_NOT_SUPPORTED"
    else:
        primary = "FACTORIAL_TEMPORAL_AND_MULTIPLICATIVE_SPECIFICITY_SUPPORTED"

    compressed = ["M2_IMI_FACTORIAL", "M3_ADDITIVE_FACTORIAL", "M4_WEAKEST_FACTORIAL"]
    best_compressed = min(compressed, key=lambda m: result_metrics[m]["rmse"])
    full_vs_best = bootstrap_improvement(
        y, pred["M5_FULL_SENSOR_RIDGE"].to_numpy(float), pred[best_compressed].to_numpy(float)
    )
    dispositions["FULL_COMPLEXITY_INCREMENT"] = "SUPPORTED" if full_vs_best["material"] else "NOT_SUPPORTED"

    any_imi_material_vs_age = any(
        comparisons[f"{m}_VS_M0_AGE_ONLY"]["material"] for m in ["M1_IMI_CONDITION", "M2_IMI_FACTORIAL", "M4_WEAKEST_FACTORIAL"]
    )
    if m2_m0 and m2_m3 and not full_vs_best["material"]:
        personal = "CONTINUE"
    elif any_imi_material_vs_age or comparisons["M3_ADDITIVE_FACTORIAL_VS_M0_AGE_ONLY"]["material"] or full_vs_best["material"]:
        personal = "NARROW_AND_REDESIGN_BEFORE_FURTHER_INVESTMENT"
    else:
        personal = "STOP_OR_FUNDAMENTALLY_REDESIGN"

    out = pred.copy()
    out.insert(1, "true_rul", y)
    for m in MODELS:
        out[f"{m}_error"] = out[m] - y
    predictions_with_outcomes = OUT / "TEST_PREDICTIONS_WITH_OUTCOMES.csv"
    out.to_csv(predictions_with_outcomes, index=False, float_format="%.12f")

    result = {
        "contract_id": CONTRACT_ID,
        "scientific_status": "UNTOUCHED_EXTERNAL_VALIDATION_EXECUTED",
        "outcome_access_after_prediction_freeze": True,
        "test_engine_count": 100,
        "primary_result_category": primary,
        "claim_dispositions": dispositions,
        "personal_portfolio_recommendation": personal,
        "metrics": result_metrics,
        "comparisons": comparisons,
        "best_model_by_rmse": min(MODELS, key=lambda m: result_metrics[m]["rmse"]),
        "best_compressed_model_by_rmse": best_compressed,
        "full_sensor_vs_best_compressed": full_vs_best,
        "freeze_receipt_sha256": sha256(freeze_receipt_path),
        "frozen_predictions_sha256": sha256(pred_path),
        "outcome_sha256": sha256(outcome_path),
        "evaluation_code_sha256": sha256(Path(__file__)),
        "predictions_with_outcomes_sha256": sha256(predictions_with_outcomes),
        "parent_theory_adjudication": "NOT_PERFORMED",
        "support_route_identity_restoration_adjudication": "NOT_PERFORMED",
    }
    result_path = OUT / "VALIDATION_RESULT.json"
    result_path.write_text(json.dumps(result, indent=2, sort_keys=True), encoding="utf-8")

    receipt = {
        "contract_id": CONTRACT_ID,
        "status": "PASS_CLOSED",
        "prediction_freeze_verified": True,
        "post_outcome_model_mutation": False,
        "result_sha256": sha256(result_path),
        "result_category": primary,
        "personal_portfolio_recommendation": personal,
        "parent_theory_adjudication": "NOT_PERFORMED",
    }
    receipt_path = OUT / "VALIDATION_EXECUTION_RECEIPT.json"
    receipt_path.write_text(json.dumps(receipt, indent=2, sort_keys=True), encoding="utf-8")

    print("=== IMI_CMAPSS_VALIDATION_RESULT_BEGIN ===")
    print(json.dumps(result, indent=2, sort_keys=True))
    print("=== IMI_CMAPSS_VALIDATION_RESULT_END ===")
    print("=== IMI_CMAPSS_VALIDATION_RECEIPT ===")
    print(json.dumps(receipt, indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
