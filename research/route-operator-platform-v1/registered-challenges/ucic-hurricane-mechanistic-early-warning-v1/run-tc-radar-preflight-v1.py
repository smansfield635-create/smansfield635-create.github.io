#!/usr/bin/env python3
import hashlib
import json
import os
import time
import urllib.request
from pathlib import Path

from netCDF4 import Dataset

ROOT = Path(__file__).resolve().parent
CONTRACT = json.loads((ROOT / "preflight-contract.v1.json").read_text())
OUT = ROOT / "preflight-result.v1.json"

KEYWORDS = (
    "tilt", "rmw", "radius", "year_ships", "hour_ships", "tcid_ships",
    "ships_lag", "vmax_ships", "pres_ships", "shdc_ships", "sddc_ships",
    "rhlo_ships", "rhmd_ships", "rhhi_ships", "sst_ships", "ohc_ships",
    "pw2m_ships", "pw5m_ships", "vertical_velocity", "tangential",
    "radial_velocity", "vorticity", "divergence", "reflectivity"
)


def head(url):
    req = urllib.request.Request(url, method="HEAD", headers={"User-Agent": "UCIC-TC-RADAR-preflight/1.0"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return {
            "status": getattr(r, "status", None),
            "content_length": int(r.headers.get("Content-Length")) if r.headers.get("Content-Length") else None,
            "last_modified": r.headers.get("Last-Modified"),
            "etag": r.headers.get("ETag"),
            "content_type": r.headers.get("Content-Type"),
        }


def download(url, dest):
    req = urllib.request.Request(url, headers={"User-Agent": "UCIC-TC-RADAR-preflight/1.0"})
    h = hashlib.sha256()
    total = 0
    t0 = time.monotonic()
    with urllib.request.urlopen(req, timeout=120) as r, open(dest, "wb") as f:
        while True:
            chunk = r.read(1024 * 1024)
            if not chunk:
                break
            f.write(chunk)
            h.update(chunk)
            total += len(chunk)
    return {
        "bytes": total,
        "sha256": h.hexdigest(),
        "download_seconds": round(time.monotonic() - t0, 3),
    }


def var_meta(v):
    attrs = {}
    for name in ("long_name", "units", "_FillValue", "missing_value", "standard_name"):
        if name in v.ncattrs():
            value = getattr(v, name)
            if hasattr(value, "item"):
                try:
                    value = value.item()
                except Exception:
                    pass
            attrs[name] = str(value)
    return {
        "dtype": str(v.dtype),
        "dimensions": list(v.dimensions),
        "shape": list(v.shape),
        "attributes": attrs,
    }


def safe_small_values(v, max_elements=20000):
    size = 1
    for n in v.shape:
        size *= int(n)
    if size > max_elements:
        return None
    try:
        data = v[:]
        if hasattr(data, "filled"):
            data = data.filled(None)
        if getattr(data, "dtype", None) is not None and data.dtype.kind in ("S", "U"):
            return {"small_value_read": "STRING_OR_CHAR_METADATA_PRESENT", "elements": size}
        flat = data.ravel().tolist() if hasattr(data, "ravel") else list(data)
        cleaned = []
        for x in flat[:20000]:
            if hasattr(x, "item"):
                x = x.item()
            if isinstance(x, (int, float, str)) or x is None:
                cleaned.append(x)
        numeric = [x for x in cleaned if isinstance(x, (int, float))]
        if numeric:
            return {
                "elements": size,
                "finite_numeric_count": sum(1 for x in numeric if x == x),
                "min": min(numeric),
                "max": max(numeric),
            }
        return {"elements": size, "metadata_values_present": bool(cleaned)}
    except Exception as e:
        return {"read_error": type(e).__name__ + ": " + str(e)}


def inspect_nc(path):
    t0 = time.monotonic()
    with Dataset(path, "r") as ds:
        dims = {name: {"size": len(dim), "unlimited": bool(dim.isunlimited())} for name, dim in ds.dimensions.items()}
        matched = {}
        all_names = list(ds.variables.keys())
        for name, v in ds.variables.items():
            lname = name.lower()
            if any(k in lname for k in KEYWORDS):
                meta = var_meta(v)
                # Only coordinate/identity metadata may be read. Predictor/outcome values are not consumed here.
                if lname in {"ships_lag_times", "year_ships", "hour_ships", "tcid_ships"}:
                    meta["coverage_metadata"] = safe_small_values(v)
                matched[name] = meta
        groups = {}
        for gname, g in ds.groups.items():
            groups[gname] = {
                "dimensions": {name: len(dim) for name, dim in g.dimensions.items()},
                "variable_names": list(g.variables.keys()),
            }
        return {
            "dimensions": dims,
            "global_attributes": {a: str(getattr(ds, a)) for a in ds.ncattrs()},
            "variable_count": len(all_names),
            "matched_variable_count": len(matched),
            "matched_variables": matched,
            "groups": groups,
            "inspection_seconds": round(time.monotonic() - t0, 3),
        }


def main():
    if CONTRACT.get("outcome_access") != "PROHIBITED":
        raise SystemExit("Preflight contract does not prohibit outcome access")
    files = []
    total_start = time.monotonic()
    tmp = Path(os.environ.get("RUNNER_TEMP", "/tmp"))
    for i, url in enumerate(CONTRACT["sources"], start=1):
        rec = {"url": url}
        rec["http_head"] = head(url)
        dest = tmp / f"tc-radar-preflight-{i}.nc"
        rec["download"] = download(url, dest)
        rec["netcdf"] = inspect_nc(dest)
        try:
            dest.unlink()
        except OSError:
            pass
        files.append(rec)
    result = {
        "operation": CONTRACT["operation"],
        "classification": CONTRACT["classification"],
        "scientific_result": "NONE",
        "outcome_access": "PROHIBITED",
        "files": files,
        "total_seconds": round(time.monotonic() - total_start, 3),
        "terminal_disposition": "PREFLIGHT_COMPLETE_NO_SCIENTIFIC_SCORING",
    }
    OUT.write_text(json.dumps(result, indent=2, sort_keys=True) + "\n")
    print(json.dumps(result, indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
