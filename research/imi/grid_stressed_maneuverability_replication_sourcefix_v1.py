#!/usr/bin/env python3
# execution trigger after source-adapter freeze
import importlib.util
from pathlib import Path
import numpy as np

TARGET=Path(__file__).with_name('grid_stressed_maneuverability_replication_v1.py')
spec=importlib.util.spec_from_file_location('frozen_stressed_grid',TARGET)
mod=importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)


def balanced_seed(m):
    gen=m['gen']; on=np.where(gen[:,mod.GEN_STATUS]>0)[0]
    q=gen[:,mod.PG].copy()
    q[on]=np.minimum(np.maximum(q[on],gen[on,mod.PMIN]),gen[on,mod.PMAX])
    target=float(m['bus'][:,mod.PD].sum()); delta=target-float(q[on].sum())
    if delta>0:
        for gi in on:
            room=float(gen[gi,mod.PMAX]-q[gi]); take=min(delta,max(0.0,room)); q[gi]+=take; delta-=take
            if delta<=1e-9: break
    elif delta<0:
        need=-delta
        for gi in on:
            room=float(q[gi]-gen[gi,mod.PMIN]); take=min(need,max(0.0,room)); q[gi]-=take; need-=take
            if need<=1e-9: break
        delta=-need
    if abs(delta)>1e-6:
        raise RuntimeError(f'published generator bounds cannot balance frozen load: residual={delta}')
    return mod.repair_feasible(m,q)


def fixed_make_states(m,n):
    base=balanced_seed(m); states=[base.copy()]; attempts=0
    while len(states)<n and attempts<30000:
        attempts+=1; q=states[int(mod.RNG.integers(len(states)))].copy(); on=np.where(m['gen'][:,mod.GEN_STATUS]>0)[0]
        for _ in range(int(mod.RNG.integers(2,10))):
            i,j=mod.RNG.choice(len(on),2,replace=False); lim,_=mod.pair_step(m,q,int(i),int(j))
            if lim>1e-5:
                step=float(lim*mod.RNG.uniform(.08,.95)); q[on[i]]+=step; q[on[j]]-=step
        if mod.feasible(m,q) and all(np.linalg.norm(q-s)>0.05 for s in states): states.append(q)
    if len(states)<n: raise RuntimeError(f'only generated {len(states)} states')
    return states

mod.make_states=fixed_make_states

if __name__=='__main__':
    mod.main()
