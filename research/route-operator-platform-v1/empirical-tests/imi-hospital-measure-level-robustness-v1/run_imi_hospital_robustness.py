#!/usr/bin/env python3
"""Reproduce HOSPITAL_MEASURE_LEVEL_IMI_ROBUSTNESS_EXTENSION_1B."""
from __future__ import annotations
import argparse, hashlib, json
from pathlib import Path
import numpy as np
import pandas as pd
from scipy.stats import spearmanr

EXPECTED_SHA256 = "0ba1b358e54e8812c9d1cf72c37f715b7bfeb3da12009bb6705158f0d15f91b5"
MORT = ["MORT_30_AMI","MORT_30_CABG","MORT_30_COPD","MORT_30_HF","MORT_30_PN","MORT_30_STK"]
SAFETY = ["COMP_HIP_KNEE","PSI_03","PSI_06","PSI_08","PSI_09","PSI_10","PSI_11","PSI_12","PSI_13","PSI_14","PSI_15"]
THRESHOLDS = {"ANY_COMPARABLE":0.0,"AT_LEAST_50_PERCENT":0.5,"AT_LEAST_75_PERCENT":0.75,"ALL_REQUIRED":1.0}
VARIANTS = {
  "BASE_NONOVERLAPPING": (MORT, SAFETY),
  "PSI04_TO_MORT": (MORT+["PSI_04"], SAFETY),
  "PSI04_TO_SAFETY": (MORT, SAFETY+["PSI_04"]),
  "PSI90_INCLUDED": (MORT, SAFETY+["PSI_90"]),
  "ALL_SENSITIVITY": (MORT+["PSI_04"], SAFETY+["PSI_90"]),
}

def sha256(path: Path) -> str:
    h=hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda:f.read(1<<20),b""): h.update(chunk)
    return h.hexdigest()

def score(c,w,identity,mort,safety,name):
    mc=c[mort].sum(1).astype(int); mw=w[mort].sum(1).astype(int)
    sc=c[safety].sum(1).astype(int); sw=w[safety].sum(1).astype(int)
    am=(mc-mw)/mc.replace(0,np.nan); ass=(sc-sw)/sc.replace(0,np.nan)
    out=identity.copy(); out["route"]=name
    out["MORT_required"]=len(mort); out["MORT_comparable"]=mc; out["MORT_worse"]=mw; out["MORT_coverage"]=mc/len(mort); out["a_MORT"]=am
    out["SAFETY_required"]=len(safety); out["SAFETY_comparable"]=sc; out["SAFETY_worse"]=sw; out["SAFETY_coverage"]=sc/len(safety); out["a_SAFETY"]=ass
    out["IMI"]=am*ass; out["CS"]=1-out["IMI"]; out["weakest_factor"]=pd.concat([am,ass],axis=1).min(axis=1,skipna=False)
    out["hard_collapse"]=((am==0)|(ass==0)).fillna(False)
    out["additive_nonworse"]=((mc-mw)+(sc-sw))/(mc+sc).replace(0,np.nan)
    out["total_comparable"]=mc+sc; out["overall_coverage"]=(mc+sc)/(len(mort)+len(safety))
    for key,t in THRESHOLDS.items():
        ok=(mc>0)&(sc>0) if key=="ANY_COMPARABLE" else ((mc==len(mort))&(sc==len(safety)) if key=="ALL_REQUIRED" else ((mc/len(mort)>=t)&(sc/len(safety)>=t)))
        out["state_"+key]=np.where(ok,"NUMERIC","UNEVALUABLE")
    return out

def summarize(x):
    rows=[]
    for key in THRESHOLDS:
        mask=x["state_"+key].eq("NUMERIC"); v=x.loc[mask,"IMI"].dropna()
        rows.append({"threshold":key,"evaluatable":int(mask.sum()),"unevaluable":int(len(x)-mask.sum()),"percent_evaluatable":float(mask.mean()*100),"mean_IMI":float(v.mean()),"sd_IMI":float(v.std()),"variance_IMI":float(v.var()),"minimum_IMI":float(v.min()),"q1_IMI":float(v.quantile(.25)),"median_IMI":float(v.median()),"q3_IMI":float(v.quantile(.75)),"maximum_IMI":float(v.max()),"exact_IMI_1":int(np.isclose(v,1).sum()),"exact_IMI_1_percent":float(np.isclose(v,1).mean()*100),"hard_collapse_count":int(x.loc[mask,"hard_collapse"].sum()),"any_worse_count":int((v<1-1e-12).sum()),"unique_IMI_scores":int(v.nunique())})
    return pd.DataFrame(rows)

def main():
    ap=argparse.ArgumentParser(); ap.add_argument("source_csv",type=Path); ap.add_argument("--output-dir",type=Path,default=Path("output")); a=ap.parse_args()
    if sha256(a.source_csv)!=EXPECTED_SHA256: raise SystemExit("source SHA-256 mismatch")
    d=pd.read_csv(a.source_csv,dtype=str,keep_default_na=False)
    if d.duplicated(["Facility ID","Measure ID"]).any(): raise SystemExit("duplicate facility-measure rows")
    status=d["Compared to National"]
    d["_c"]=status.str.startswith(("Better","No Different","Worse")); d["_w"]=status.str.startswith("Worse")
    c=d.pivot(index="Facility ID",columns="Measure ID",values="_c").astype(bool); w=d.pivot(index="Facility ID",columns="Measure ID",values="_w").astype(bool)
    ident=d[["Facility ID","Facility Name","State"]].drop_duplicates("Facility ID").set_index("Facility ID",drop=False).loc[c.index]
    scored={k:score(c,w,ident,*spec,k) for k,spec in VARIANTS.items()}; base=scored["BASE_NONOVERLAPPING"]
    out=a.output_dir; (out/"results").mkdir(parents=True,exist_ok=True)
    summary=summarize(base); summary.to_csv(out/"results/IMI_Hospital_Robustness_Summary.csv",index=False)
    base.to_csv(out/"results/IMI_Hospital_Level_Results.csv",index=False)
    hidden=base.loc[base.state_ANY_COMPARABLE.eq("NUMERIC")&base.hard_collapse]; hidden.to_csv(out/"results/IMI_Additive_Hidden_Collapse_Examples.csv",index=False)
    sensitivity=[]; bmask=base.state_ANY_COMPARABLE.eq("NUMERIC")
    for name,x in scored.items():
        if name=="BASE_NONOVERLAPPING": continue
        common=bmask&x.state_ANY_COMPARABLE.eq("NUMERIC"); delta=x.loc[common,"IMI"]-base.loc[common,"IMI"]
        common_stats={"variant":name,"common_numeric_hospitals":int(common.sum()),"changed_score_count":int((delta.abs()>1e-12).sum()),"changed_score_percent":float((delta.abs()>1e-12).mean()*100),"mean_delta":float(delta.mean()),"mean_absolute_delta":float(delta.abs().mean()),"maximum_absolute_delta":float(delta.abs().max()),"spearman_rank_correlation":float(spearmanr(base.loc[common,"IMI"],x.loc[common,"IMI"]).statistic),"lowered_count":int((delta<-1e-12).sum()),"raised_count":int((delta>1e-12).sum())}
        for row in summarize(x).to_dict("records"): sensitivity.append({"route":name,**row,**common_stats})
    pd.DataFrame(sensitivity).to_csv(out/"results/IMI_Hospital_Sensitivity_Results.csv",index=False)
    print(json.dumps(summary.to_dict("records"),indent=2))
if __name__=="__main__": main()
