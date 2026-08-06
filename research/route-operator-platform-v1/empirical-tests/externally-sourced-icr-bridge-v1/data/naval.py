from __future__ import annotations

import io
import math
import zipfile
from typing import Any
from urllib.request import Request, urlopen

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.impute import SimpleImputer
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

from common import split_ordered

RANDOM_STATE = 451
DATA_URL = "https://archive.ics.uci.edu/static/public/316/condition+based+maintenance+of+naval+propulsion+plants.zip"
FEATURE_NAMES = (
    "lever_position",
    "ship_speed",
    "gt_shaft_torque",
    "gt_revolutions",
    "gas_generator_revolutions",
    "starboard_propeller_torque",
    "port_propeller_torque",
    "hp_turbine_exit_temperature",
    "compressor_inlet_air_temperature",
    "compressor_outlet_air_temperature",
    "hp_turbine_exit_pressure",
    "compressor_inlet_air_pressure",
    "compressor_outlet_air_pressure",
    "exhaust_gas_pressure",
    "turbine_injection_control",
    "fuel_flow",
)
TARGET_NAMES = ("gt_compressor_decay", "gt_turbine_decay")


def _download_zip() -> zipfile.ZipFile:
    request = Request(DATA_URL, headers={"User-Agent": "IMI-research-exact-head-bridge/1.0"})
    with urlopen(request, timeout=300) as response:
        payload = response.read()
    return zipfile.ZipFile(io.BytesIO(payload))


def _member(archive: zipfile.ZipFile, basename: str) -> str:
    matches = [name for name in archive.namelist() if name.rsplit("/", 1)[-1] == basename]
    if len(matches) != 1:
        raise RuntimeError(f"Expected one {basename}, found {matches}")
    return matches[0]


def run() -> dict[str, Any]:
    archive = _download_zip()
    with archive.open(_member(archive, "data.txt")) as handle:
        matrix = np.loadtxt(handle)
    if matrix.ndim != 2 or matrix.shape[1] != 18:
        raise RuntimeError(f"Unexpected naval data shape: {matrix.shape}")

    x = pd.DataFrame(matrix[:, :16], columns=FEATURE_NAMES)
    targets = pd.DataFrame(matrix[:, 16:18], columns=TARGET_NAMES)
    target = TARGET_NAMES[0]
    y = targets[target]
    cols = list(x.columns)
    output = x[cols[:5]].copy()
    relational = x.copy()
    for left, right, name in [(0, 1, "input_gap_01"), (2, 3, "input_gap_23"), (4, 5, "input_gap_45")]:
        relational[name] = relational[cols[left]] - relational[cols[right]]
    for left, right, name in [(6, 7, "ratio_67"), (8, 9, "ratio_89"), (10, 11, "ratio_1011")]:
        relational[name] = relational[cols[left]] / relational[cols[right]].replace(0, np.nan)

    result: dict[str, Any] = {
        "system_id": "UCI_NAVAL_PROPULSION_SIMULATOR",
        "target": target,
        "rows": len(x),
        "retrieval": "official_uci_zip",
        "models": {},
        "primary_metric": "normalized_rmse_lower_is_better",
    }
    specs = [
        ("output_history", output, Ridge(alpha=1.0)),
        ("route_relational", relational, Ridge(alpha=1.0)),
        ("black_box_full", x, RandomForestRegressor(n_estimators=400, min_samples_leaf=2, random_state=RANDOM_STATE, n_jobs=-1)),
    ]
    for name, features, model in specs:
        x_train, x_test, y_train, y_test = split_ordered(features, y)
        pipe = Pipeline([("impute", SimpleImputer(strategy="median")), ("scale", StandardScaler()), ("model", model)])
        pipe.fit(x_train, y_train)
        prediction = pipe.predict(x_test)
        rmse = math.sqrt(mean_squared_error(y_test, prediction))
        scale = float(y_test.max() - y_test.min()) or 1.0
        result["models"][name] = {"normalized_rmse": rmse / scale, "r2": r2_score(y_test, prediction)}
    return result
