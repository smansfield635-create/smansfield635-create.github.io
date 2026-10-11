#!/usr/bin/env python3
"""Reproduce IMI v3 conditional-information test from post2020_predictions.csv.
Protocol authority: IMI_v3_CONDITIONAL_INFORMATION_TEST_PROTOCOL_v1.md
"""
import argparse, json
from pathlib import Path
import numpy as np
import pandas as pd


def main(path):
    d=pd.read_csv(path).copy()
    d['stratum']=-1
    for yr,g in d.groupby('year'):
        order=g.sort_values(['p_history','idx']).index.to_numpy()
        n=len(order)
        d.loc[order,'stratum']=(np.arange(n)*10)//n
    d['r']=d['y']-d['p_history']
    d['delta']=d['p_aug']-d['p_history']
    d['dc']=d['delta']-d.groupby(['year','stratum'])['delta'].transform('mean')
    d['prod']=d['dc']*d['r']
    obs=float(d['prod'].sum())
    yearT={int(k):float(v) for k,v in d.groupby('year')['prod'].sum().to_dict().items()}
    const=float(sum(np.dot(g.dc.to_numpy(),g.p_history.to_numpy()) for _,g in d.groupby(['year','stratum'])))
    groups=[]
    for (yr,s),g in d.groupby(['year','stratum']):
        m=int(g.y.sum())
        if m:
            groups.append((int(yr),int(s),g.dc.to_numpy(),m))
    B=100000; rng=np.random.default_rng(256)
    perm=np.full(B,-const)
    const_y={int(yr):float(np.dot(g.dc.to_numpy(),g.p_history.to_numpy())) for yr,g in d.groupby('year')}
    py={yr:np.full(B,-c) for yr,c in const_y.items()}
    for yr,s,vals,m in groups:
        sums=np.empty(B)
        for i in range(B): sums[i]=vals[rng.choice(len(vals),size=m,replace=False)].sum()
        perm += sums; py[yr] += sums
    p_pool=float((1+(perm>=obs).sum())/(B+1))
    p_year={yr:float((1+(py[yr]>=yearT[yr]).sum())/(B+1)) for yr in yearT}
    result={'T_pooled':obs,'T_year':yearT,'p_pooled_one_sided':p_pool,'p_year_one_sided':p_year,
            'permutations':B,'seed':256,'verdict':'PASS' if p_pool<.01 and obs>0 and all(v>0 for v in yearT.values()) else 'FAIL'}
    print(json.dumps(result,indent=2))

if __name__=='__main__':
    ap=argparse.ArgumentParser(); ap.add_argument('predictions'); args=ap.parse_args(); main(args.predictions)
