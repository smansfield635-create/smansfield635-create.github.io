from __future__ import annotations

import json
import math
import platform
import re
from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression, Ridge
from sklearn.metrics import average_precision_score, balanced_accuracy_score, f1_score, mean_squared_error, r2_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from ucimlrepo import fetch_ucirepo

ROOT = Path(__file__).resolve().parent
OPERATION = "EXTERNALLY_SOURCED_UCI_MULTI_SYSTEM_IDENTITY_CONDITIONED_REACHABILITY_BRIDGE_v1"
BOUNDARY = (
    "Prospective exact-head analysis of third-party UCI datasets using theory-team-defined "
    "feature partitions and models. The datasets are externally authored, but the analysis is "
    "not independently conducted and does not establish a universal law."
)
RANDOM_STATE = 451


def clean_frame(frame: pd.DataFrame) -> pd.DataFrame:
    output = frame.copy()
    output.columns = [str(c).strip() for c in output.columns]
    return output


def split_ordered(x: pd.DataFrame, y: pd.Series, fraction: float = 0.70):
    cut = max(1, min(len(x) - 1, int(len(x) * fraction)))
    return x.iloc[:cut].copy(), x.iloc[cut:].copy(), y.iloc[:cut].copy(), y.iloc[cut:].copy()


def classification_pipeline(x: pd.DataFrame, model: Any) -> Pipeline:
    numeric = [c for c in x.columns if pd.api.types.is_numeric_dtype(x[c])]
    categorical = [c for c in x.columns if c not in numeric]
    transformer = ColumnTransformer([
        ("num", Pipeline([("impute", SimpleImputer(strategy="median")), ("scale", StandardScaler())]), numeric),
        ("cat", Pipeline([("impute", SimpleImputer(strategy="most_frequent")), ("onehot", OneHotEncoder(handle_unknown="ignore"))]), categorical),
    ])
    return Pipeline([("preprocess", transformer), ("model", model)])


def ai4i_system() -> dict[str, Any]:
    dataset = fetch_ucirepo(id=601)
    x = clean_frame(dataset.data.features)
    targets = clean_frame(dataset.data.targets)
    target_name = next((c for c in targets.columns if "machine failure" in c.lower()), targets.columns[0])
    y = pd.to_numeric(targets[target_name], errors="coerce").fillna(0).astype(int)

    def find(fragment: str) -> str:
        return next(c for c in x.columns if fragment in c.lower())

    type_col = next(c for c in x.columns if c.lower() == "type")
    air = find("air temperature")
    process = find("process temperature")
    speed = find("rotational speed")
    torque = find("torque")
    wear = find("tool wear")

    output = x[[type_col, speed, torque]].copy()
    relational = x[[type_col, air, process, speed, torque, wear]].copy()
    relational["temperature_gap"] = pd.to_numeric(relational[process], errors="coerce") - pd.to_numeric(relational[air], errors="coerce")
    relational["mechanical_power_proxy"] = pd.to_numeric(relational[speed], errors="coerce") * pd.to_numeric(relational[torque], errors="coerce")
    relational["wear_load_interaction"] = pd.to_numeric(relational[wear], errors="coerce") * pd.to_numeric(relational[torque], errors="coerce")
    full = x.copy()

    result: dict[str, Any] = {"system_id": "UCI_AI4I_2020", "target": target_name, "rows": len(x), "models": {}}
    for name, features, model in [
        ("output_history", output, LogisticRegression(max_iter=3000, class_weight="balanced", random_state=RANDOM_STATE)),
        ("route_relational", relational, LogisticRegression(max_iter=3000, class_weight="balanced", random_state=RANDOM_STATE)),
        ("black_box_full", full, RandomForestClassifier(n_estimators=300, min_samples_leaf=2, class_weight="balanced_subsample", random_state=RANDOM_STATE, n_jobs=-1)),
    ]:
        x_train, x_test, y_train, y_test = split_ordered(features, y)
        pipe = classification_pipeline(x_train, model)
        pipe.fit(x_train, y_train)
        pred = pipe.predict(x_test)
        if hasattr(pipe, "predict_proba"):
            score = pipe.predict_proba(x_test)[:, 1]
        else:
            score = pred.astype(float)
        ap = average_precision_score(y_test, score) if y_test.nunique() > 1 else float("nan")
        result["models"][name] = {
            "balanced_accuracy": balanced_accuracy_score(y_test, pred),
            "average_precision": ap,
            "test_positive_rate": float(y_test.mean()),
        }
    result["primary_metric"] = "average_precision"
    return result


def aggregate_hydraulic(raw: pd.DataFrame) -> pd.DataFrame:
    groups: dict[str, list[str]] = {}
    for column in raw.columns:
        match = re.match(r"([A-Za-z]+\d*)", str(column))
        prefix = match.group(1) if match else str(column)
        groups.setdefault(prefix, []).append(column)
    aggregated: dict[str, pd.Series] = {}
    for prefix, columns in groups.items():
        numeric = raw[columns].apply(pd.to_numeric, errors="coerce")
        aggregated[f"{prefix}_mean"] = numeric.mean(axis=1)
        aggregated[f"{prefix}_std"] = numeric.std(axis=1).fillna(0)
        aggregated[f"{prefix}_min"] = numeric.min(axis=1)
        aggregated[f"{prefix}_max"] = numeric.max(axis=1)
    return pd.DataFrame(aggregated, index=raw.index)


def hydraulic_system() -> dict[str, Any]:
    dataset = fetch_ucirepo(id=447)
    raw = clean_frame(dataset.data.features)
    targets = clean_frame(dataset.data.targets)
    target_name = next((c for c in targets.columns if "pump" in c.lower()), targets.columns[0])
    y = targets[target_name].astype(str)
    agg = aggregate_hydraulic(raw)
    output_cols = [c for c in agg.columns if c.startswith(("EPS1_", "FS1_", "FS2_"))]
    if not output_cols:
        output_cols = list(agg.columns[: min(12, len(agg.columns))])
    route_cols = [c for c in agg.columns if c.startswith(("PS", "TS", "VS", "CE", "CP", "SE", "EPS", "FS"))]
    if not route_cols:
        route_cols = list(agg.columns)
    output = agg[output_cols].copy()
    relational = agg[route_cols].copy()
    pressure_means = [c for c in relational.columns if c.startswith("PS") and c.endswith("_mean")]
    temperature_means = [c for c in relational.columns if c.startswith("TS") and c.endswith("_mean")]
    if len(pressure_means) >= 2:
        relational["pressure_span"] = relational[pressure_means].max(axis=1) - relational[pressure_means].min(axis=1)
    if len(temperature_means) >= 2:
        relational["temperature_span"] = relational[temperature_means].max(axis=1) - relational[temperature_means].min(axis=1)
    full = agg.copy()

    result: dict[str, Any] = {"system_id": "UCI_HYDRAULIC_TEST_RIG", "target": target_name, "rows": len(raw), "aggregated_features": len(agg.columns), "models": {}}
    for name, features, model in [
        ("output_history", output, LogisticRegression(max_iter=4000, class_weight="balanced", random_state=RANDOM_STATE)),
        ("route_relational", relational, LogisticRegression(max_iter=4000, class_weight="balanced", random_state=RANDOM_STATE)),
        ("black_box_full", full, RandomForestClassifier(n_estimators=400, min_samples_leaf=2, class_weight="balanced_subsample", random_state=RANDOM_STATE, n_jobs=-1)),
    ]:
        x_train, x_test, y_train, y_test = split_ordered(features, y)
        pipe = classification_pipeline(x_train, model)
        pipe.fit(x_train, y_train)
        pred = pipe.predict(x_test)
        result["models"][name] = {
            "balanced_accuracy": balanced_accuracy_score(y_test, pred),
            "macro_f1": f1_score(y_test, pred, average="macro", zero_division=0),
        }
    result["primary_metric"] = "macro_f1"
    return result


def naval_system() -> dict[str, Any]:
    dataset = fetch_ucirepo(id=316)
    x = clean_frame(dataset.data.features).apply(pd.to_numeric, errors="coerce")
    targets = clean_frame(dataset.data.targets).apply(pd.to_numeric, errors="coerce")
    target_name = targets.columns[0]
    y = targets[target_name]
    columns = list(x.columns)
    output = x[columns[: min(5, len(columns))]].copy()
    relational = x.copy()
    for left, right, name in [(0, 1, "input_gap_01"), (2, 3, "input_gap_23"), (4, 5, "input_gap_45")]:
        if right < len(columns):
            relational[name] = relational[columns[left]] - relational[columns[right]]
    for left, right, name in [(6, 7, "ratio_67"), (8, 9, "ratio_89"), (10, 11, "ratio_1011")]:
        if right < len(columns):
            denominator = relational[columns[right]].replace(0, np.nan)
            relational[name] = relational[columns[left]] / denominator
    full = x.copy()

    result: dict[str, Any] = {"system_id": "UCI_NAVAL_PROPULSION_SIMULATOR", "target": target_name, "rows": len(x), "models": {}}
    for name, features, model in [
        ("output_history", output, Ridge(alpha=1.0)),
        ("route_relational", relational, Ridge(alpha=1.0)),
        ("black_box_full", full, RandomForestRegressor(n_estimators=400, min_samples_leaf=2, random_state=RANDOM_STATE, n_jobs=-1)),
    ]:
        x_train, x_test, y_train, y_test = split_ordered(features, y)
        pipe = Pipeline([("impute", SimpleImputer(strategy="median")), ("scale", StandardScaler()), ("model", model)])
        pipe.fit(x_train, y_train)
        pred = pipe.predict(x_test)
        rmse = math.sqrt(mean_squared_error(y_test, pred))
        scale = float(y_test.max() - y_test.min()) or 1.0
        result["models"][name] = {"normalized_rmse": rmse / scale, "r2": r2_score(y_test, pred)}
    result["primary_metric"] = "normalized_rmse_lower_is_better"
    return result


def primary_value(system: dict[str, Any], model: str) -> float:
    metric = system["primary_metric"]
    if metric == "average_precision":
        return float(system["models"][model]["average_precision"])
    if metric == "macro_f1":
        return float(system["models"][model]["macro_f1"])
    return -float(system["models"][model]["normalized_rmse"])


def main() -> None:
    systems = [ai4i_system(), hydraulic_system(), naval_system()]
    route_wins = 0
    route_vs_blackbox = 0
    for system in systems:
        route = primary_value(system, "route_relational")
        output = primary_value(system, "output_history")
        blackbox = primary_value(system, "black_box_full")
        system["comparisons"] = {
            "route_minus_output_primary": route - output,
            "route_minus_black_box_primary": route - blackbox,
            "route_beats_output": route > output,
            "route_within_5_percent_of_black_box": route >= blackbox - 0.05 * max(abs(blackbox), 1e-12),
        }
        route_wins += int(system["comparisons"]["route_beats_output"])
        route_vs_blackbox += int(system["comparisons"]["route_within_5_percent_of_black_box"])

    result = {
        "operation": OPERATION,
        "result_class": "PROSPECTIVE_EXACT_HEAD_EXTERNAL_DATA_BRIDGE",
        "scientific_boundary": BOUNDARY,
        "environment": {"python": platform.python_version(), "pandas": pd.__version__},
        "frozen_decision_rule": {
            "route_beats_output_minimum": "2_of_3_systems",
            "route_within_5_percent_of_black_box_minimum": "2_of_3_systems",
            "terminal_dispositions": [
                "BRIDGE_SURVIVES_EXTERNAL_DATA_TEST",
                "BRIDGE_REDUNDANT_OR_INFERIOR",
                "BRIDGE_MIXED",
                "UNEVALUABLE_DATA_OR_EXECUTION_FAILURE",
            ],
        },
        "systems": systems,
    }
    if route_wins >= 2 and route_vs_blackbox >= 2:
        disposition = "BRIDGE_SURVIVES_EXTERNAL_DATA_TEST"
    elif route_wins == 0:
        disposition = "BRIDGE_REDUNDANT_OR_INFERIOR"
    else:
        disposition = "BRIDGE_MIXED"
    result["summary"] = {
        "systems": len(systems),
        "route_beats_output": f"{route_wins}/3",
        "route_within_5_percent_of_black_box": f"{route_vs_blackbox}/3",
        "disposition": disposition,
        "claim_limit": BOUNDARY,
    }
    (ROOT / "uci-execution-report.json").write_text(json.dumps(result, indent=2, sort_keys=True, allow_nan=False) + "\n")
    print(json.dumps(result["summary"], indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
