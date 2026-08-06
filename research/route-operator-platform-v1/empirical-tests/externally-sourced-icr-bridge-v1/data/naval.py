from __future__ import annotations
import math
from typing import Any
import numpy as np, pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.impute import SimpleImputer
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from ucimlrepo import fetch_ucirepo
from common import clean_frame, split_ordered
RANDOM_STATE=451

def run() -> dict[str,Any]:
    ds=fetch_ucirepo(id=316); x=clean_frame(ds.data.features).apply(pd.to_numeric,errors="coerce"); targets=clean_frame(ds.data.targets).apply(pd.to_numeric,errors="coerce"); target=targets.columns[0]; y=targets[target]; cols=list(x.columns); output=x[cols[:min(5,len(cols))]].copy(); relational=x.copy()
    for l,r,n in [(0,1,"input_gap_01"),(2,3,"input_gap_23"),(4,5,"input_gap_45")]:
        if r<len(cols): relational[n]=relational[cols[l]]-relational[cols[r]]
    for l,r,n in [(6,7,"ratio_67"),(8,9,"ratio_89"),(10,11,"ratio_1011")]:
        if r<len(cols): relational[n]=relational[cols[l]]/relational[cols[r]].replace(0,np.nan)
    result={"system_id":"UCI_NAVAL_PROPULSION_SIMULATOR","target":target,"rows":len(x),"models":{},"primary_metric":"normalized_rmse_lower_is_better"}
    specs=[("output_history",output,Ridge(alpha=1.0)),("route_relational",relational,Ridge(alpha=1.0)),("black_box_full",x,RandomForestRegressor(n_estimators=400,min_samples_leaf=2,random_state=RANDOM_STATE,n_jobs=-1))]
    for name,features,model in specs:
        xt,xv,yt,yv=split_ordered(features,y); pipe=Pipeline([("impute",SimpleImputer(strategy="median")),("scale",StandardScaler()),("model",model)]); pipe.fit(xt,yt); pred=pipe.predict(xv); rmse=math.sqrt(mean_squared_error(yv,pred)); scale=float(yv.max()-yv.min()) or 1.0; result["models"][name]={"normalized_rmse":rmse/scale,"r2":r2_score(yv,pred)}
    return result
