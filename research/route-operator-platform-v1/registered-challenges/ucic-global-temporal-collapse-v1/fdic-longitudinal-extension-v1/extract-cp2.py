#!/usr/bin/env python3
import hashlib
import json
import pathlib
import time
import urllib.parse
import urllib.request
from datetime import datetime, timezone

ROOT = pathlib.Path(__file__).resolve().parent
CP1 = ROOT / "checkpoint-1-protocol-freeze.v1.json"
OUT = ROOT / "checkpoint-2-failure-source-extraction.v1.json"
RAW_DIR = ROOT / "cp2-raw"
RAW_DIR.mkdir(exist_ok=True)

API = "https://api.fdic.gov/banks/financials"
FIELDS = ["CERT", "REPDTE", "ASSET", "DEP", "EQ", "LNLSNET", "ROA", "NIM"]

with CP1.open("r", encoding="utf-8") as fh:
    cp1 = json.load(fh)
if cp1.get("checkpoint") != "CP1_PROTOCOL_FREEZE" or cp1.get("status") != "PASS_CLOSED":
    raise SystemExit("CP1_NOT_PASS_CLOSED")

cohort = cp1["failure_cohort"]
records = []
evaluable_source = 0

for bank in cohort:
    cert = int(bank["cert"])
    params = {
        "filters": f"CERT:{cert}",
        "fields": ",".join(FIELDS),
        "sort_by": "REPDTE",
        "sort_order": "DESC",
        "limit": "40",
        "offset": "0",
        "format": "json",
    }
    url = API + "?" + urllib.parse.urlencode(params)
    request = urllib.request.Request(
        url,
        headers={
            "Accept": "application/json",
            "User-Agent": "UCIC-FDIC-longitudinal-extension-v1/1.0",
        },
    )
    entry = {
        "cert": cert,
        "name": bank["name"],
        "faildate": bank["faildate"],
        "request_url": url,
        "status": "UNEVALUABLE_SOURCE_ACCESS",
        "raw_sha256": None,
        "rows": [],
        "row_count": 0,
        "usable_pre_failure_rows": 0,
    }
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            raw = response.read()
        raw_sha = hashlib.sha256(raw).hexdigest()
        (RAW_DIR / f"CERT_{cert}.json").write_bytes(raw)
        parsed = json.loads(raw.decode("utf-8"))
        data = parsed.get("data", []) if isinstance(parsed, dict) else []
        normalized = []
        faildate = datetime.strptime(bank["faildate"], "%Y-%m-%d").date()
        for item in data:
            row = item.get("data", item) if isinstance(item, dict) else {}
            if not isinstance(row, dict):
                continue
            normalized_row = {field: row.get(field) for field in FIELDS}
            normalized.append(normalized_row)
        normalized.sort(key=lambda r: str(r.get("REPDTE") or ""))
        pre = []
        for row in normalized:
            try:
                repdate = datetime.strptime(str(row.get("REPDTE"))[:10], "%Y-%m-%d").date()
            except Exception:
                continue
            if repdate < faildate:
                pre.append(row)
        entry.update(
            {
                "status": "SOURCE_EXTRACTED" if len(pre) >= 9 else "UNEVALUABLE_INSUFFICIENT_PRE_FAILURE_HISTORY",
                "raw_sha256": raw_sha,
                "rows": normalized,
                "row_count": len(normalized),
                "usable_pre_failure_rows": len(pre),
            }
        )
        if len(pre) >= 9:
            evaluable_source += 1
    except Exception as exc:
        entry["error_class"] = type(exc).__name__
        entry["error_text"] = str(exc)[:500]
    records.append(entry)
    time.sleep(0.15)

result = {
    "operation": "UCIC_ARM_B_FDIC_LONGITUDINAL_COLLAPSE_EARLY_WARNING_EXTENSION_v1",
    "checkpoint": "CP2_FAILURE_COHORT_AND_SOURCE_EXTRACTION_FREEZE",
    "generated_at_utc": datetime.now(timezone.utc).isoformat(),
    "source": {
        "authority": "FDIC",
        "endpoint": API,
        "fields": FIELDS,
        "transport": "GitHub Actions HTTPS request to official FDIC BankFind Financials API",
    },
    "cohort_count": len(cohort),
    "source_evaluable_banks": evaluable_source,
    "minimum_required_by_cp1": 9,
    "records": records,
    "status": "PASS_CLOSED" if evaluable_source >= 9 else "FAIL_CLOSED_INSUFFICIENT_SOURCE_EXTRACTION",
    "next_checkpoint": "CP3_CONTROL_MATCH_FREEZE" if evaluable_source >= 9 else None,
}
OUT.write_text(json.dumps(result, indent=2, sort_keys=True) + "\n", encoding="utf-8")
print(json.dumps({
    "checkpoint": result["checkpoint"],
    "status": result["status"],
    "source_evaluable_banks": evaluable_source,
    "cohort_count": len(cohort),
}, sort_keys=True))
if evaluable_source < 9:
    raise SystemExit(2)
