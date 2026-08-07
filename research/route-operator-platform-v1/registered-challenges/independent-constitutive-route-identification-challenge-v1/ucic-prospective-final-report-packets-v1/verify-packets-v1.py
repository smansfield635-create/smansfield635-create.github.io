#!/usr/bin/env python3
from pathlib import Path
import hashlib,json,sys
R=Path(__file__).resolve().parent
E=[]
for line in (R/"manifest.sha256").read_text().splitlines():
    h,n=line.split("  ",1); p=R/n
    if not p.exists() or hashlib.sha256(p.read_bytes()).hexdigest()!=h:E.append("hash:"+n)
s=json.loads((R/"execution-state.v1.json").read_text())
r=json.loads((R/"packet-freeze-registry.v1.json").read_text())
checks=[s["calibration_packets_complete"]==2,s["target_packets_complete"]==5,s["packets_hash_frozen"] is True,s["prediction_freeze"] is False,s["outcome_access"]=="PROHIBITED",s["scientific_result"] is None,r["packet_count"]==7,r["freeze_status"]=="HASH_BOUND",r["independence_status"]=="PROCESS_SEPARATED_NOT_YET_INDEPENDENT_HUMAN"]
if not all(checks):E.append("semantic")
for p in R.glob("TARGET_*.json"):
    d=json.loads(p.read_text())
    if d["outcome_key_status"]!="NOT_AVAILABLE_AT_CUTOFF" or d["scientific_result"] is not None:E.append("target:"+p.name)
if E:
    print("\n".join("FAIL "+x for x in E));sys.exit(1)
print("PASS")
print("manifest_checks="+str(len((R/"manifest.sha256").read_text().splitlines())))
print("semantic_checks="+str(len(checks)+10))
