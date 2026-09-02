from __future__ import annotations

import io
import zipfile
from typing import Any
from urllib.request import Request, urlopen

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import balanced_accuracy_score, f1_score

from common import classification_pipeline, split_ordered

RANDOM_STATE = 451
DATA_URL = "https://archive.ics.uci.edu/static/public/447/condition+monitoring+of+hydraulic+systems.zip"
SENSORS = ("PS1", "PS2", "PS3", "PS4", "PS5", "PS6", "EPS1", "FS1", "FS2", "TS1", "TS2", "TS3", "TS4", "VS1", "CE", "CP", "SE")


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


def _aggregate_from_archive(archive: zipfile.ZipFile) -> pd.DataFrame:
    columns: dict[str, np.ndarray] = {}
    row_count: int | None = None
    for sensor in SENSORS:
        with archive.open(_member(archive, f"{sensor}.txt")) as handle:
            values = np.loadtxt(handle, delimiter="\t")
        if values.ndim == 1:
            values = values.reshape(-1, 1)
        if row_count is None:
            row_count = values.shape[0]
        elif values.shape[0] != row_count:
            raise RuntimeError(f"Row-count mismatch for {sensor}: {values.shape[0]} != {row_count}")
        columns[f"{sensor}_mean"] = values.mean(axis=1)
        columns[f"{sensor}_std"] = values.std(axis=1, ddof=1)
        columns[f"{sensor}_min"] = values.min(axis=1)
        columns[f"{sensor}_max"] = values.max(axis=1)
    return pd.DataFrame(columns)


def run() -> dict[str, Any]:
    archive = _download_zip()
    agg = _aggregate_from_archive(archive)
    with archive.open(_member(archive, "profile.txt")) as handle:
        profile = np.loadtxt(handle, delimiter="\t")
    if profile.ndim != 2 or profile.shape[1] < 3:
        raise RuntimeError(f"Unexpected profile shape: {profile.shape}")
    y = pd.Series(profile[:, 2].astype(int).astype(str), name="internal_pump_leakage")
    if len(y) != len(agg):
        raise RuntimeError(f"Target row mismatch: {len(y)} != {len(agg)}")

    output_cols = [c for c in agg.columns if c.startswith(("EPS1_", "FS1_", "FS2_"))]
    route_cols = [c for c in agg.columns if c.startswith(("PS", "TS", "VS", "CE", "CP", "SE", "EPS", "FS"))]
    output = agg[output_cols].copy()
    relational = agg[route_cols].copy()
    pressure_means = [c for c in relational if c.startswith("PS") and c.endswith("_mean")]
    temperature_means = [c for c in relational if c.startswith("TS") and c.endswith("_mean")]
    relational["pressure_span"] = relational[pressure_means].max(axis=1) - relational[pressure_means].min(axis=1)
    relational["temperature_span"] = relational[temperature_means].max(axis=1) - relational[temperature_means].min(axis=1)

    result: dict[str, Any] = {
        "system_id": "UCI_HYDRAULIC_TEST_RIG",
        "target": y.name,
        "rows": len(agg),
        "aggregated_features": len(agg.columns),
        "retrieval": "official_uci_zip",
        "models": {},
        "primary_metric": "macro_f1",
    }
    specs = [
        ("output_history", output, LogisticRegression(max_iter=4000, class_weight="balanced", random_state=RANDOM_STATE)),
        ("route_relational", relational, LogisticRegression(max_iter=4000, class_weight="balanced", random_state=RANDOM_STATE)),
        ("black_box_full", agg, RandomForestClassifier(n_estimators=400, min_samples_leaf=2, class_weight="balanced_subsample", random_state=RANDOM_STATE, n_jobs=-1)),
    ]
    for name, features, model in specs:
        x_train, x_test, y_train, y_test = split_ordered(features, y)
        pipe = classification_pipeline(x_train, model)
        pipe.fit(x_train, y_train)
        prediction = pipe.predict(x_test)
        result["models"][name] = {
            "balanced_accuracy": balanced_accuracy_score(y_test, prediction),
            "macro_f1": f1_score(y_test, prediction, average="macro", zero_division=0),
        }
    return result
