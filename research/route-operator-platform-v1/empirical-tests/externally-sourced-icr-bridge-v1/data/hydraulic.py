from __future__ import annotations
import re
from typing import Any
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import balanced_accuracy_score, f1_score
from ucimlrepo import fetch_ucirepo
from common import clean_frame, classification_pipeline, split_ordered
RANDOM_STATE=451

def aggregate(raw: pd.DataFrame) -> pd.DataFrame:
    groups={}
    for c in raw.columns:
        m=re.match(r"([A-Za-z]+\d*)",str(c)); groups.setdefault(m.group(1) if m else str(c),[]).append(c)
    out={}
    for p,cols in groups.items():
        n=raw[cols].apply(pd.to_numeric,errors="coerce"); out[f"{p}_mean"]=n.mean(axis=1); out[f"{p}_std"]=n.std(axis=1).fillna(0); out[f"{p}_min"]=n.min(axis=1); out[f"{p}_max"]=n.max(axis=1)
    return pd.DataFrame(out,index=raw.index)

def run() -> dict[str,Any]:
    ds=fetch_ucirepo(id=447); raw=clean_frame(ds.data.features); targets=clean_frame(ds.data.targets); target=next((c for c in targets if "pump" in c.lower()),targets.columns[0]); y=targets[target].astype(str); agg=aggregate(raw)
    outcols=[c for c in agg if c.startswith(("EPS1_","FS1_","FS2_"))] or list(agg.columns[:min(12,len(agg.columns))]); routecols=[c for c in agg if c.startswith(("PS","TS","VS","CE","CP","SE","EPS","FS"))] or list(agg.columns)
    output=agg[outcols].copy(); relational=agg[routecols].copy(); pm=[c for c in relational if c.startswith("PS") and c.endswith("_mean")]; tm=[c for c in relational if c.startswith("TS") and c.endswith("_mean")]
    if len(pm)>=2: relational["pressure_span"]=relational[pm].max(axis=1)-relational[pm].min(axis=1)
    if len(tm)>=2: relational["temperature_span"]=relational[tm].max(axis=1)-relational[tm].min(axis=1)
    result={"system_id":"UCI_HYDRAULIC_TEST_RIG","target":target,"rows":len(raw),"aggregated_features":len(agg.columns),"models":{},"primary_metric":"macro_f1"}
    specs=[("output_history",output,LogisticRegression(max_iter=4000,class_weight="balanced",random_state=RANDOM_STATE)),("route_relational",relational,LogisticRegression(max_iter=4000,class_weight="balanced",random_state=RANDOM_STATE)),("black_box_full",agg,RandomForestClassifier(n_estimators=400,min_samples_leaf=2,class_weight="balanced_subsample",random_state=RANDOM_STATE,n_jobs=-1))]
    for name,features,model in specs:
        xt,xv,yt,yv=split_ordered(features,y); pipe=classification_pipeline(xt,model); pipe.fit(xt,yt); pred=pipe.predict(xv); result["models"][name]={"balanced_accuracy":balanced_accuracy_score(yv,pred),"macro_f1":f1_score(yv,pred,average="macro",zero_division=0)}
    return result
