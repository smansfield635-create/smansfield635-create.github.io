from __future__ import annotations
from typing import Any
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

def clean_frame(frame: pd.DataFrame) -> pd.DataFrame:
    out = frame.copy(); out.columns = [str(c).strip() for c in out.columns]; return out

def split_ordered(x: pd.DataFrame, y: pd.Series, fraction: float = .70):
    cut = max(1,min(len(x)-1,int(len(x)*fraction))); return x.iloc[:cut].copy(),x.iloc[cut:].copy(),y.iloc[:cut].copy(),y.iloc[cut:].copy()

def classification_pipeline(x: pd.DataFrame, model: Any) -> Pipeline:
    numeric=[c for c in x.columns if pd.api.types.is_numeric_dtype(x[c])]; categorical=[c for c in x.columns if c not in numeric]
    prep=ColumnTransformer([("num",Pipeline([("impute",SimpleImputer(strategy="median")),("scale",StandardScaler())]),numeric),("cat",Pipeline([("impute",SimpleImputer(strategy="most_frequent")),("onehot",OneHotEncoder(handle_unknown="ignore"))]),categorical)])
    return Pipeline([("preprocess",prep),("model",model)])
