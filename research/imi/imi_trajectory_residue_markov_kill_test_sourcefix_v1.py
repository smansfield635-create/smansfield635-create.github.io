#!/usr/bin/env python3
import importlib.util
from pathlib import Path
import pandas as pd

ROOT=Path(__file__).resolve().parent
TARGET=ROOT/'imi_trajectory_residue_markov_kill_test_v1.py'
spec=importlib.util.spec_from_file_location('imikill',TARGET)
mod=importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)


def strata_frame_fixed(te,p0):
    z=pd.DataFrame(index=te.index)
    z['risk']=pd.qcut(pd.Series(p0,index=te.index),10,labels=False,duplicates='drop')
    z['cur']=pd.qcut(te['max_util'],5,labels=False,duplicates='drop')
    try:
        z['slp']=pd.qcut(te['max_util_slope6'],3,labels=False,duplicates='drop')
    except Exception:
        z['slp']=(te['max_util_slope6']>0).astype(int)
    keys=z[['risk','cur','slp']].copy()
    for c in keys.columns:
        keys[c]=keys[c].astype('object').where(keys[c].notna(),'NA').map(str)
    z['key']=keys['risk']+'|'+keys['cur']+'|'+keys['slp']
    return z

mod.strata_frame=strata_frame_fixed

if __name__=='__main__':
    mod.main()
