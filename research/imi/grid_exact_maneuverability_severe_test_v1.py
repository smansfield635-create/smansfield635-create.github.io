#!/usr/bin/env python3
import json, math, warnings
from pathlib import Path
import numpy as np
import pandas as pd
from scipy.optimize import linprog
from scipy.stats import spearmanr
from sklearn.metrics import brier_score_loss, roc_auc_score, average_precision_score
from sklearn.preprocessing import StandardScaler
from lightgbm import LGBMClassifier
from pypower.api import case14, case30, case39, case57, case118, rundcopf, ppoption

warnings.filterwarnings('ignore')
SEED=20260823
RNG=np.random.default_rng(SEED)
CASES={'case14':case14,'case30':case30,'case39':case39,'case57':case57,'case118':case118}
N_STATES=80
RAMP_FRAC=0.20
M_DIFF=0.15
STATE_FEATURES=['max_util','mean_util','std_util','p95_util','up_headroom_ratio','down_headroom_ratio','min_up_frac','min_down_frac','dispatch_hhi','headroom_hhi','nb','nl','ng','case_idx']
CONT_FEATURES=['outage_util','outage_rate','outage_x','deg_from','deg_to']
XCOLS=STATE_FEATURES+CONT_FEATURES

# PYPOWER column indices
BUS_I,PD=0,2
GEN_BUS,PG,GEN_STATUS,PMAX,PMIN=0,1,7,8,9
F_BUS,T_BUS,BR_X,RATE_A,BR_STATUS=0,1,3,5,10


def case_internal(mpc):
    m={k:(v.copy() if hasattr(v,'copy') else v) for k,v in mpc.items()}
    bus=m['bus']; branch=m['branch']; gen=m['gen']
    ids=bus[:,BUS_I].astype(int); mp={b:i for i,b in enumerate(ids)}
    branch[:,F_BUS]=np.array([mp[int(x)] for x in branch[:,F_BUS]])
    branch[:,T_BUS]=np.array([mp[int(x)] for x in branch[:,T_BUS]])
    gen[:,GEN_BUS]=np.array([mp[int(x)] for x in gen[:,GEN_BUS]])
    bus[:,BUS_I]=np.arange(len(bus))
    return m


def network_matrices(m, branch_mask=None):
    bus,br=m['bus'],m['branch']; nb=len(bus)
    active=(br[:,BR_STATUS]>0)
    if branch_mask is not None: active &= branch_mask
    idx=np.where(active)[0]; ba=br[idx]
    C=np.zeros((len(idx),nb))
    C[np.arange(len(idx)),ba[:,F_BUS].astype(int)]=1
    C[np.arange(len(idx)),ba[:,T_BUS].astype(int)]=-1
    x=ba[:,BR_X].astype(float)
    b=1/np.where(np.abs(x)<1e-9,1e-9,x)
    B=C.T@(b[:,None]*C)
    return idx,C,b,B


def connected(nb, br, mask):
    adj=[[] for _ in range(nb)]
    for k,row in enumerate(br):
        if mask[k] and row[BR_STATUS]>0:
            a,b=int(row[F_BUS]),int(row[T_BUS]); adj[a].append(b); adj[b].append(a)
    seen={0}; stack=[0]
    while stack:
        u=stack.pop()
        for v in adj[u]:
            if v not in seen: seen.add(v); stack.append(v)
    return len(seen)==nb


def flows_and_sens(m, pg, branch_mask=None):
    bus,gen,br=m['bus'],m['gen'],m['branch']; nb=len(bus); base=float(m['baseMVA'])
    idx,C,b,B=network_matrices(m,branch_mask)
    inj=-bus[:,PD].astype(float)
    for g,p in zip(gen,pg):
        if g[GEN_STATUS]>0: inj[int(g[GEN_BUS])]+=p
    # Numerical mismatch is absorbed at slack, consistent with DC slack convention.
    inj[0]-=inj.sum()
    keep=np.arange(1,nb)
    try: theta_r=np.linalg.solve(B[np.ix_(keep,keep)],inj[keep]/base)
    except np.linalg.LinAlgError: return None,None,None
    theta=np.zeros(nb); theta[keep]=theta_r
    f=base*b*(C@theta)
    online=np.where(gen[:,GEN_STATUS]>0)[0]
    G=np.zeros((nb,len(online)))
    for j,gi in enumerate(online): G[int(gen[gi,GEN_BUS]),j]+=1
    # Sensitivity to balanced dg with sum dg=0: slack response unnecessary because dg constrained to sum zero.
    S=np.zeros((len(idx),len(online)))
    for j in range(len(online)):
        rhs=G[:,j].copy(); rhs[0]-=rhs.sum()
        tr=np.linalg.solve(B[np.ix_(keep,keep)],rhs[keep]/base)
        tt=np.zeros(nb); tt[keep]=tr
        S[:,j]=base*b*(C@tt)
    return idx,f,S


def rates_for(m, idx):
    r=m['branch'][idx,RATE_A].astype(float)
    return np.where(r>1e-6,r,1e9)


def feasible_intact(m,pg):
    out=flows_and_sens(m,pg)
    if out[0] is None:return False
    idx,f,_=out; return bool(np.all(np.abs(f)<=rates_for(m,idx)+1e-6))


def max_pair_step(m,pg,i,j):
    gen=m['gen']; online=np.where(gen[:,GEN_STATUS]>0)[0]
    gi,gj=online[i],online[j]
    genlim=min(gen[gi,PMAX]-pg[gi], pg[gj]-gen[gj,PMIN])
    genlim=max(0.0,float(genlim))
    if genlim<=0:return 0.0,0.0
    idx,f,S=flows_and_sens(m,pg); rate=rates_for(m,idx); d=S[:,i]-S[:,j]
    lim=genlim
    pos=d>1e-10; neg=d<-1e-10
    if np.any(pos): lim=min(lim,float(np.min((rate[pos]-f[pos])/d[pos])))
    if np.any(neg): lim=min(lim,float(np.min((-rate[neg]-f[neg])/d[neg])))
    return max(0.0,lim),genlim


def maneuverability(m,pg):
    online=np.where(m['gen'][:,GEN_STATUS]>0)[0]; num=den=0.0
    for i in range(len(online)):
        for j in range(i+1,len(online)):
            a,ga=max_pair_step(m,pg,i,j); b,gb=max_pair_step(m,pg,j,i)
            num+=a+b; den+=ga+gb
    return num/den if den>0 else 0.0


def make_states(m,n):
    pp=ppoption(VERBOSE=0,OUT_ALL=0)
    ext={k:(v.copy() if hasattr(v,'copy') else v) for k,v in m.items()}
    # m is already internal and can be solved by PYPOWER.
    res=rundcopf(ext,pp)
    if not res.get('success',False): raise RuntimeError('base DC OPF failed')
    pg=res['gen'][:,PG].copy(); states=[]
    if feasible_intact(m,pg): states.append(pg.copy())
    attempts=0
    while len(states)<n and attempts<5000:
        attempts+=1; q=states[RNG.integers(len(states))].copy() if states else pg.copy()
        online=np.where(m['gen'][:,GEN_STATUS]>0)[0]
        for _ in range(int(RNG.integers(2,8))):
            if len(online)<2:break
            i,j=RNG.choice(len(online),2,replace=False)
            lim,_=max_pair_step(m,q,i,j)
            if lim>1e-6:
                step=float(lim*RNG.uniform(.05,.95)); q[online[i]]+=step; q[online[j]]-=step
        if feasible_intact(m,q):
            # reject near-duplicate dispatches
            if all(np.linalg.norm(q-s)>1e-3 for s in states): states.append(q)
    if len(states)<n: raise RuntimeError(f'only generated {len(states)} feasible states')
    return states[:n]


def state_features(m,pg,case_idx):
    idx,f,_=flows_and_sens(m,pg); rate=rates_for(m,idx); util=np.abs(f)/rate
    gen=m['gen']; on=np.where(gen[:,GEN_STATUS]>0)[0]; g=gen[on]; p=pg[on]
    up=np.maximum(0,g[:,PMAX]-p); dn=np.maximum(0,p-g[:,PMIN]); span=np.maximum(1e-9,g[:,PMAX]-g[:,PMIN])
    total_load=float(m['bus'][:,PD].sum())
    def hhi(v):
        v=np.maximum(0,np.asarray(v,float)); s=v.sum(); return float(np.sum((v/s)**2)) if s>0 else 1.0
    return dict(max_util=float(util.max()),mean_util=float(util.mean()),std_util=float(util.std()),p95_util=float(np.quantile(util,.95)),
      up_headroom_ratio=float(up.sum()/max(total_load,1e-9)),down_headroom_ratio=float(dn.sum()/max(total_load,1e-9)),
      min_up_frac=float(np.min(up/span)),min_down_frac=float(np.min(dn/span)),dispatch_hhi=hhi(p),headroom_hhi=hhi(up+dn),
      nb=len(m['bus']),nl=int(np.sum(m['branch'][:,BR_STATUS]>0)),ng=len(on),case_idx=case_idx)


def contingencies(m,pg):
    br=m['branch']; nb=len(m['bus']); active=br[:,BR_STATUS]>0
    base_idx,base_f,_=flows_and_sens(m,pg); fmap={k:f for k,f in zip(base_idx,base_f)}
    deg=np.zeros(nb,int)
    for k,row in enumerate(br):
        if active[k]:deg[int(row[F_BUS])]+=1;deg[int(row[T_BUS])]+=1
    out=[]
    for k,row in enumerate(br):
        if not active[k]:continue
        mask=active.copy();mask[k]=False
        if not connected(nb,br,mask):continue
        rate=float(row[RATE_A]) if row[RATE_A]>1e-6 else 1e9
        out.append((k,dict(outage_util=abs(float(fmap.get(k,0.0)))/rate,outage_rate=rate if rate<1e8 else 1e8,
                           outage_x=abs(float(row[BR_X])),deg_from=int(deg[int(row[F_BUS])]),deg_to=int(deg[int(row[T_BUS])]))))
    return out


def survives(m,pg,k):
    br=m['branch']; mask=(br[:,BR_STATUS]>0);mask[k]=False
    if not connected(len(m['bus']),br,mask):return 0
    idx,f,S=flows_and_sens(m,pg,mask)
    if idx is None:return 0
    rate=rates_for(m,idx); gen=m['gen']; on=np.where(gen[:,GEN_STATUS]>0)[0]; g=gen[on]; p=pg[on]
    ramp=RAMP_FRAC*np.maximum(0,g[:,PMAX]-g[:,PMIN])
    lo=np.maximum(g[:,PMIN]-p,-ramp); hi=np.minimum(g[:,PMAX]-p,ramp)
    # S dg <= rate-f ; -S dg <= rate+f
    A=np.vstack([S,-S]); b=np.concatenate([rate-f,rate+f])
    r=linprog(np.zeros(len(on)),A_ub=A,b_ub=b,A_eq=np.ones((1,len(on))),b_eq=[0.0],bounds=list(zip(lo,hi)),method='highs')
    return int(r.success)


def model():
    return LGBMClassifier(n_estimators=250,learning_rate=.035,num_leaves=15,max_depth=-1,min_child_samples=30,subsample=.9,colsample_bytree=.9,reg_lambda=5,reg_alpha=1,random_state=SEED,verbosity=-1)


def metric(y,p):
    return {'brier':float(brier_score_loss(y,p)),'auroc':float(roc_auc_score(y,p)) if len(np.unique(y))>1 else None,
            'ap':float(average_precision_score(y,p)) if np.sum(y)>0 else None}


def matched_test(states_df):
    rows=[]
    sf=[c for c in STATE_FEATURES if c not in ['case_idx','nb','nl','ng']]
    for case,g in states_df.groupby('case'):
        z=StandardScaler().fit_transform(g[sf]); ids=list(g.index); used=set()
        candidates=[]
        for a in range(len(g)):
            for b in range(a+1,len(g)):
                if abs(float(g.iloc[a].M-g.iloc[b].M))>=M_DIFF:
                    d=float(np.linalg.norm(z[a]-z[b]));candidates.append((d,a,b))
        candidates.sort()
        for d,a,b in candidates:
            ia,ib=ids[a],ids[b]
            if ia in used or ib in used:continue
            used|={ia,ib}; ra,rb=states_df.loc[ia],states_df.loc[ib]
            hi,lo=(ra,rb) if ra.M>rb.M else (rb,ra)
            rows.append({'case':case,'distance':d,'M_hi':hi.M,'M_lo':lo.M,'surv_hi':hi.survival,'surv_lo':lo.survival,'diff':hi.survival-lo.survival})
    return pd.DataFrame(rows)


def main():
    allrows=[]; staterows=[]
    for ci,(name,fn) in enumerate(CASES.items()):
        print('CASE_START',name,flush=True)
        m=case_internal(fn()); states=make_states(m,N_STATES)
        for si,pg in enumerate(states):
            M=float(maneuverability(m,pg)); sf=state_features(m,pg,ci); conts=contingencies(m,pg); ys=[]
            for k,cf in conts:
                y=survives(m,pg,k);ys.append(y)
                allrows.append({'case':name,'state':si,'M':M,'y':y,**sf,**cf})
            staterows.append({'case':name,'state':si,'M':M,'survival':float(np.mean(ys)) if ys else np.nan,**sf,'n_cont':len(ys)})
        print('CASE_DONE',name,'states',len(states),flush=True)
    df=pd.DataFrame(allrows); sd=pd.DataFrame(staterows)
    if len(df)==0 or df.y.nunique()<2: raise RuntimeError('outcome has insufficient variation')
    preds=[]; folds=[]
    for hold in CASES:
        tr=df.case!=hold; te=df.case==hold
        a=model();b=model();a.fit(df.loc[tr,XCOLS],df.loc[tr,'y']);b.fit(df.loc[tr,XCOLS+['M']],df.loc[tr,'y'])
        p0=a.predict_proba(df.loc[te,XCOLS])[:,1];p1=b.predict_proba(df.loc[te,XCOLS+['M']])[:,1];y=df.loc[te,'y'].to_numpy()
        m0=metric(y,p0);m1=metric(y,p1); folds.append({'case':hold,'n':len(y),'events':int(y.sum()),'base':m0,'aug':m1,'brier_rel_improve':(m0['brier']-m1['brier'])/m0['brier'] if m0['brier'] else 0})
        q=df.loc[te,['case','state','M','y']].copy();q['p_base']=p0;q['p_aug']=p1;preds.append(q)
    pred=pd.concat(preds,ignore_index=True); pool0=metric(pred.y,pred.p_base); pool1=metric(pred.y,pred.p_aug)
    rel=(pool0['brier']-pool1['brier'])/pool0['brier']; aucdelta=pool1['auroc']-pool0['auroc']
    brier_wins=sum(x['aug']['brier']<x['base']['brier'] for x in folds)
    mt=matched_test(sd); informative=mt[mt['diff']!=0] if len(mt) else mt
    pair_rate=float((informative['diff']>0).mean()) if len(informative) else 0.0
    case_pair=mt.groupby('case')['diff'].mean().to_dict() if len(mt) else {}
    positive_pair_cases=sum(v>0 for v in case_pair.values())
    corrs={}; positive_corr_cases=0
    for case,g in sd.groupby('case'):
        rho,p=spearmanr(g.M,g.survival);corrs[case]={'rho':float(rho),'p':float(p)};positive_corr_cases+=int(rho>0)
    criteria={'brier_rel_improve_ge_5pct':rel>=.05,'auroc_non_degrade':aucdelta>=0,'brier_win_4of5':brier_wins>=4,
              'matched_direction_70pct':pair_rate>=.70,'matched_positive_4of5':positive_pair_cases>=4,'spearman_positive_4of5':positive_corr_cases>=4}
    verdict='PASS' if all(criteria.values()) else 'FAIL'
    findings={'verdict':verdict,'seed':SEED,'cases':list(CASES),'states_per_case':N_STATES,'rows':len(df),'survival_rate':float(df.y.mean()),
      'pooled_base':pool0,'pooled_aug':pool1,'brier_relative_improvement':float(rel),'auroc_delta':float(aucdelta),'folds':folds,
      'matched_pairs':int(len(mt)),'informative_pairs':int(len(informative)),'higher_M_win_rate':pair_rate,'positive_pair_cases':positive_pair_cases,
      'spearman':corrs,'positive_spearman_cases':positive_corr_cases,'criteria':criteria}
    Path('grid_exact_maneuverability_findings_v1.json').write_text(json.dumps(findings,indent=2))
    df.to_csv('grid_state_contingency_rows_v1.csv',index=False);sd.to_csv('grid_state_summary_v1.csv',index=False);pred.to_csv('grid_predictions_v1.csv',index=False);mt.to_csv('grid_matched_pairs_v1.csv',index=False)
    Path('GRID_EXACT_MANEUVERABILITY_VERDICT_v1.txt').write_text(verdict+'\n'+json.dumps(findings,indent=2))
    print(json.dumps(findings,indent=2),flush=True)

if __name__=='__main__':main()
