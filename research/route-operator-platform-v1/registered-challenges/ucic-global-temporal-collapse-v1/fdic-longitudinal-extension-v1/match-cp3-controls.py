#!/usr/bin/env python3
import hashlib
import json
import math
import pathlib
import time
import urllib.parse
import urllib.request
from datetime import datetime, timezone

ROOT = pathlib.Path(__file__).resolve().parent
CP1 = ROOT / "checkpoint-1-protocol-freeze.v1.json"
CP2 = ROOT / "checkpoint-2-failure-source-extraction.v1.json"
OUT = ROOT / "checkpoint-3-control-match-freeze.v1.json"
API_FIN = "https://api.fdic.gov/banks/financials"
API_FAIL = "https://api.fdic.gov/banks/failures"
HISTORY_FIELDS = ["CERT", "REPDTE", "ASSET", "DEP", "EQ", "LNLSNET", "ROA", "NIMY"]


def get_json(url):
    req = urllib.request.Request(url, headers={"Accept":"application/json", "User-Agent":"UCIC-FDIC-longitudinal-extension-v1/1.0"})
    with urllib.request.urlopen(req, timeout=45) as response:
        raw = response.read()
    return json.loads(raw.decode("utf-8")), hashlib.sha256(raw).hexdigest()


def query(base, params):
    return get_json(base + "?" + urllib.parse.urlencode(params))


def rows_from(payload):
    out=[]
    for item in payload.get("data", []) if isinstance(payload, dict) else []:
        row=item.get("data", item) if isinstance(item, dict) else {}
        if isinstance(row, dict): out.append(row)
    return out


def repdate_key(v):
    return str(v or "").replace("-", "")[:8]


cp1=json.load(CP1.open())
cp2=json.load(CP2.open())
if cp1.get("status") != "PASS_CLOSED": raise SystemExit("CP1_NOT_CLOSED")
if cp2.get("status") != "PASS_CLOSED" or cp2.get("source_evaluable_banks") != 11: raise SystemExit("CP2_NOT_CLOSED_11_OF_11")

frozen_failure_certs={int(x["cert"]) for x in cp1["failure_cohort"]}
cp2_by_cert={int(x["cert"]):x for x in cp2["records"]}

# Source-schema probe: use one financial record without a field projection so
# charter and name identifiers are discovered before the matching queries.
probe_payload, probe_sha = query(API_FIN, {"filters":"CERT:24735", "sort_by":"REPDTE", "sort_order":"DESC", "limit":"1", "offset":"0", "format":"json"})
probe_rows=rows_from(probe_payload)
if not probe_rows: raise SystemExit("CP3_SCHEMA_PROBE_EMPTY")
probe=probe_rows[0]
if "BKCLASS" not in probe: raise SystemExit("CP3_BKCLASS_NOT_AVAILABLE")
name_field = "NAME" if "NAME" in probe else ("NAMEFULL" if "NAMEFULL" in probe else None)
if not name_field: raise SystemExit("CP3_NAME_FIELD_NOT_AVAILABLE")

# Exclude every institution appearing on the current FDIC failure list. This
# is stricter than excluding only the 11-target cohort and guarantees controls
# remain nonfailed through the frozen study cutoff.
fail_payload, fail_sha = query(API_FAIL, {"fields":"CERT", "limit":"10000", "offset":"0", "format":"json"})
all_failed_certs=set()
for row in rows_from(fail_payload):
    try: all_failed_certs.add(int(row.get("CERT")))
    except Exception: pass
if not frozen_failure_certs.issubset(all_failed_certs):
    raise SystemExit("CP3_FAILURE_LIST_DOES_NOT_CONTAIN_FROZEN_COHORT")

assignments=[]
quarter_ledgers={}
selected_control_certs=set()

for bank in cp1["failure_cohort"]:
    cert=int(bank["cert"])
    failed=cp2_by_cert[cert]
    faildate=datetime.strptime(bank["faildate"], "%Y-%m-%d").date()
    pre=[]
    for row in failed["rows"]:
        try:
            d=datetime.strptime(repdate_key(row.get("REPDTE")), "%Y%m%d").date()
        except Exception:
            continue
        if d < faildate: pre.append(row)
    if not pre: raise SystemExit(f"CP3_NO_PRE_FAILURE_ROW_{cert}")
    match_row=max(pre, key=lambda r: repdate_key(r.get("REPDTE")))
    match_date=repdate_key(match_row.get("REPDTE"))
    failed_asset=float(match_row["ASSET"])

    payload, page_sha = query(API_FIN, {
        "filters":f"REPDTE:{match_date}",
        "fields":f"CERT,REPDTE,ASSET,BKCLASS,{name_field}",
        "sort_by":"ASSET", "sort_order":"ASC", "limit":"10000", "offset":"0", "format":"json"
    })
    qrows=rows_from(payload)
    if not qrows:
        raise SystemExit(f"CP3_EMPTY_QUARTER_{match_date}")
    quarter_ledgers[match_date]={"response_sha256":page_sha,"row_count":len(qrows)}
    failed_q=None
    candidates=[]
    for row in qrows:
        try:
            c=int(row.get("CERT")); asset=float(row.get("ASSET"))
        except Exception:
            continue
        if asset <= 0: continue
        if c == cert: failed_q=row
        if c in all_failed_certs: continue
        candidates.append(row)
    if failed_q is None:
        raise SystemExit(f"CP3_FAILED_BANK_ABSENT_FROM_QUARTER_{cert}_{match_date}")
    failed_class=str(failed_q.get("BKCLASS") or "")
    same=[r for r in candidates if str(r.get("BKCLASS") or "") == failed_class]
    pool=same if len(same)>=2 else candidates
    ranked=[]
    for row in pool:
        try:
            c=int(row["CERT"]); a=float(row["ASSET"])
        except Exception:
            continue
        ranked.append((abs(math.log(a)-math.log(failed_asset)), c, row))
    ranked.sort(key=lambda x:(x[0],x[1]))
    chosen=ranked[:2]
    if len(chosen)<2: raise SystemExit(f"CP3_FEWER_THAN_TWO_CONTROLS_{cert}")
    controls=[]
    for diff,c,row in chosen:
        selected_control_certs.add(c)
        controls.append({
            "cert":c,
            "name":row.get(name_field),
            "bkclass":row.get("BKCLASS"),
            "asset":row.get("ASSET"),
            "absolute_log_asset_difference":diff
        })
    assignments.append({
        "failed_cert":cert,
        "failed_name":bank["name"],
        "faildate":bank["faildate"],
        "match_report_date":match_date,
        "failed_asset":failed_asset,
        "failed_bkclass":failed_class,
        "same_class_pool_used":len(same)>=2,
        "same_class_candidate_count":len(same),
        "controls":controls
    })
    time.sleep(0.1)

# Freeze longitudinal histories for each unique selected control now so CP4/5
# operate only on data that existed when CP3 closed.
control_histories=[]
for cert in sorted(selected_control_certs):
    payload, raw_sha = query(API_FIN, {
        "filters":f"CERT:{cert}",
        "fields":",".join(HISTORY_FIELDS),
        "sort_by":"REPDTE", "sort_order":"DESC", "limit":"40", "offset":"0", "format":"json"
    })
    rows=rows_from(payload)
    rows=[{f:r.get(f) for f in HISTORY_FIELDS} for r in rows]
    rows.sort(key=lambda r: repdate_key(r.get("REPDTE")))
    control_histories.append({"cert":cert,"response_sha256":raw_sha,"row_count":len(rows),"rows":rows})
    time.sleep(0.1)

result={
    "operation":"UCIC_ARM_B_FDIC_LONGITUDINAL_COLLAPSE_EARLY_WARNING_EXTENSION_v1",
    "checkpoint":"CP3_CONTROL_MATCH_FREEZE",
    "generated_at_utc":datetime.now(timezone.utc).isoformat(),
    "status":"PASS_CLOSED",
    "source":{"authority":"FDIC","financials_endpoint":API_FIN,"failures_endpoint":API_FAIL,"schema_probe_sha256":probe_sha,"failure_list_sha256":fail_sha,"name_field":name_field},
    "failed_assignments":assignments,
    "assignment_count":sum(len(a["controls"]) for a in assignments),
    "unique_control_count":len(selected_control_certs),
    "quarter_source_ledgers":quarter_ledgers,
    "control_histories":control_histories,
    "control_replacement":"PROHIBITED",
    "next_checkpoint":"CP4_FACTOR_SERIES_AND_WARNING_EXECUTION"
}
OUT.write_text(json.dumps(result, indent=2, sort_keys=True)+"\n")
print(json.dumps({"checkpoint":result["checkpoint"],"status":result["status"],"assignments":result["assignment_count"],"unique_controls":result["unique_control_count"]},sort_keys=True))
