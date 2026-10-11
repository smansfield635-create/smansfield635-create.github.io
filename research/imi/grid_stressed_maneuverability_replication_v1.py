#!/usr/bin/env python3
import hashlib, io, json, re, warnings
from pathlib import Path
import numpy as np
import pandas as pd
import requests
from scipy.optimize import linprog
from scipy.stats import spearmanr
from sklearn.metrics import brier_score_loss, roc_auc_score, average_precision_score
from sklearn.preprocessing import StandardScaler
from lightgbm import LGBMClassifier

warnings.filterwarnings('ignore')
SEED=20260823
RNG=np.random.default_rng(SEED)
N_STATES=240
RAMP_FRAC=0.20
M_DIFF=0.10
SOURCE_COMMIT='a93255d827292922165c05396b600904e0a6130e'
SOURCE_URL=f'https://raw.githubusercontent.com/Power-Agent/PowerAgentBench/{SOURCE_COMMIT}/cases/case39/matpower/case39.m'

BUS_I, BUS_TYPE, PD = 0,1,2
GEN_BUS, PG, GEN_STATUS, PMAX, PMIN = 0,1,7,8,9
F_BUS,T_BUS,BR_X,RATE_A,BR_STATUS=0,1,3,5,10

STATE_FEATURES=['max_util','mean_util','std_util','p95_util','up_headroom_ratio','down_headroom_ratio','min_up_frac','min_down_frac','dispatch_hhi','headroom_hhi']
CONT_FEATURES=['outage_util','outage_rate','outage_x','deg_from','deg_to']
XCOLS=STATE_FEATURES+CONT_FEATURES


def parse_matrix(text,name):
    m=re.search(rf'mpc\.{name}\s*=\s*\[(.*?)\];',text,re.S)
    if not m: raise RuntimeError(f'missing matrix {name}')
    rows=[]
    for raw in m.group(1).splitlines():
        raw=raw.split('%',1)[0].strip()
        if not raw: continue
        raw=raw.rstrip(';').strip()
        if not raw: continue
        vals=[float(x) for x in re.split(r'[\s,]+',raw) if x]
        rows.append(vals)
    width=max(len(r) for r in rows)
    if any(len(r)!=width for r in rows): raise RuntimeError(f'ragged {name}')
    return np.array(rows,float)


def load_case():
    r=requests.get(SOURCE_URL,timeout=120,headers={'User-Agent':'Mozilla/5.0'})
    r.raise_for_status(); raw=r.content; text=raw.decode('utf-8')
    mm=re.search(r'mpc\.baseMVA\s*=\s*([0-9.eE+-]+)',text)
    if not mm: raise RuntimeError('missing baseMVA')
    m={'baseMVA':float(mm.group(1)),'bus':parse_matrix(text,'bus'),'gen':parse_matrix(text,'gen'),'branch':parse_matrix(text,'branch')}
    return m, hashlib.sha256(raw).hexdigest()


def internalize(m):
    q={k:(v.copy() if hasattr(v,'copy') else v) for k,v in m.items()}
    ids=q['bus'][:,BUS_I].astype(int); mp={b:i for i,b in enumerate(ids)}
    q['branch'][:,F_BUS]=[mp[int(x)] for x in q['branch'][:,F_BUS]]
    q['branch'][:,T_BUS]=[mp[int(x)] for x in q['branch'][:,T_BUS]]
    q['gen'][:,GEN_BUS]=[mp[int(x)] for x in q['gen'][:,GEN_BUS]]
    q['bus'][:,BUS_I]=np.arange(len(ids))
    return q


def network_matrices(m,mask=None):
    br=m['branch']; nb=len(m['bus']); active=br[:,BR_STATUS]>0
    if mask is not None: active &= mask
    idx=np.where(active)[0]; ba=br[idx]
    C=np.zeros((len(idx),nb)); C[np.arange(len(idx)),ba[:,F_BUS].astype(int)]=1; C[np.arange(len(idx)),ba[:,T_BUS].astype(int)]=-1
    x=ba[:,BR_X].astype(float); b=1/np.where(np.abs(x)<1e-12,1e-12,x); B=C.T@(b[:,None]*C)
    return idx,C,b,B


def connected(m,mask):
    nb=len(m['bus']); br=m['branch']; adj=[[] for _ in range(nb)]
    for k,row in enumerate(br):
        if mask[k] and row[BR_STATUS]>0:
            a,b=int(row[F_BUS]),int(row[T_BUS]); adj[a].append(b); adj[b].append(a)
    seen={0}; stack=[0]
    while stack:
        u=stack.pop()
        for v in adj[u]:
            if v not in seen: seen.add(v); stack.append(v)
    return len(seen)==nb


def flows_sens(m,pg,mask=None):
    bus,gen=m['bus'],m['gen']; nb=len(bus); base=float(m['baseMVA'])
    idx,C,b,B=network_matrices(m,mask); inj=-bus[:,PD].astype(float)
    on=np.where(gen[:,GEN_STATUS]>0)[0]
    for gi in on: inj[int(gen[gi,GEN_BUS])]+=pg[gi]
    mismatch=inj.sum()
    if abs(mismatch)>1e-6: raise RuntimeError(f'unbalanced dispatch {mismatch}')
    keep=np.arange(1,nb)
    try: tr=np.linalg.solve(B[np.ix_(keep,keep)],inj[keep]/base)
    except np.linalg.LinAlgError: return None,None,None,None
    th=np.zeros(nb); th[keep]=tr; f=base*b*(C@th)
    S=np.zeros((len(idx),len(on)))
    for j,gi in enumerate(on):
        rhs=np.zeros(nb); rhs[int(gen[gi,GEN_BUS])]=1; rhs[0]-=1
        rr=np.linalg.solve(B[np.ix_(keep,keep)],rhs[keep]/base); tt=np.zeros(nb); tt[keep]=rr
        S[:,j]=base*b*(C@tt)
    return idx,f,S,on


def rates(m,idx):
    r=m['branch'][idx,RATE_A].astype(float); return np.where(r>1e-6,r,1e9)


def rebalance_slack(m):
    pg=m['gen'][:,PG].copy(); load=float(m['bus'][:,PD].sum())
    slack_bus=int(np.where(m['bus'][:,BUS_TYPE]==3)[0][0])
    cand=np.where((m['gen'][:,GEN_STATUS]>0)&(m['gen'][:,GEN_BUS].astype(int)==slack_bus))[0]
    if len(cand)!=1: raise RuntimeError('slack generator unresolved')
    gi=int(cand[0]); pg[gi]=load-(pg.sum()-pg[gi])
    if pg[gi] < m['gen'][gi,PMIN]-1e-6 or pg[gi] > m['gen'][gi,PMAX]+1e-6:
        raise RuntimeError(f'slack rebalance outside limits: {pg[gi]}')
    return pg


def repair_feasible(m,pg):
    idx,f,S,on=flows_sens(m,pg); rate=rates(m,idx); gen=m['gen']; g=gen[on]; p=pg[on]
    lo=g[:,PMIN]-p; hi=g[:,PMAX]-p
    A=np.vstack([S,-S]); b=np.concatenate([rate-f,rate+f])
    res=linprog(np.zeros(len(on)),A_ub=A,b_ub=b,A_eq=np.ones((1,len(on))),b_eq=[0.0],bounds=list(zip(lo,hi)),method='highs')
    if not res.success: raise RuntimeError('published stressed benchmark has no intact-feasible DC redispatch under published limits')
    q=pg.copy(); q[on]+=res.x; return q


def feasible(m,pg):
    out=flows_sens(m,pg)
    if out[0] is None:return False
    idx,f,_,_=out; return bool(np.all(np.abs(f)<=rates(m,idx)+1e-7))


def pair_step(m,pg,i,j):
    idx,f,S,on=flows_sens(m,pg); gen=m['gen']; gi,gj=on[i],on[j]
    glim=max(0.0,min(float(gen[gi,PMAX]-pg[gi]),float(pg[gj]-gen[gj,PMIN])))
    if glim<=0:return 0.0,0.0
    rate=rates(m,idx); d=S[:,i]-S[:,j]; lim=glim
    pos=d>1e-10; neg=d<-1e-10
    if np.any(pos): lim=min(lim,float(np.min((rate[pos]-f[pos])/d[pos])))
    if np.any(neg): lim=min(lim,float(np.min((-rate[neg]-f[neg])/d[neg])))
    return max(0.0,lim),glim


def maneuverability(m,pg):
    on=np.where(m['gen'][:,GEN_STATUS]>0)[0]; num=den=0.0
    for i in range(len(on)):
        for j in range(i+1,len(on)):
            a,ga=pair_step(m,pg,i,j); b,gb=pair_step(m,pg,j,i); num+=a+b; den+=ga+gb
    return num/den if den>0 else 0.0


def make_states(m,n):
    base=repair_feasible(m,rebalance_slack(m)); states=[base.copy()]; attempts=0
    while len(states)<n and attempts<30000:
        attempts+=1; q=states[int(RNG.integers(len(states)))].copy(); on=np.where(m['gen'][:,GEN_STATUS]>0)[0]
        for _ in range(int(RNG.integers(2,10))):
            i,j=RNG.choice(len(on),2,replace=False); lim,_=pair_step(m,q,int(i),int(j))
            if lim>1e-5:
                step=float(lim*RNG.uniform(.08,.95)); q[on[i]]+=step; q[on[j]]-=step
        if feasible(m,q) and all(np.linalg.norm(q-s)>0.05 for s in states): states.append(q)
    if len(states)<n: raise RuntimeError(f'only generated {len(states)} states')
    return states


def hhi(v):
    v=np.maximum(0,np.asarray(v,float)); s=v.sum(); return float(np.sum((v/s)**2)) if s>0 else 1.0


def state_features(m,pg):
    idx,f,_,on=flows_sens(m,pg); rate=rates(m,idx); util=np.abs(f)/rate; g=m['gen'][on]; p=pg[on]
    up=np.maximum(0,g[:,PMAX]-p); dn=np.maximum(0,p-g[:,PMIN]); span=np.maximum(1e-9,g[:,PMAX]-g[:,PMIN]); load=float(m['bus'][:,PD].sum())
    return {'max_util':float(util.max()),'mean_util':float(util.mean()),'std_util':float(util.std()),'p95_util':float(np.quantile(util,.95)),
            'up_headroom_ratio':float(up.sum()/load),'down_headroom_ratio':float(dn.sum()/load),'min_up_frac':float(np.min(up/span)),
            'min_down_frac':float(np.min(dn/span)),'dispatch_hhi':hhi(p),'headroom_hhi':hhi(up+dn)}


def contingencies(m,pg):
    br=m['branch']; active=br[:,BR_STATUS]>0; idx,f,_,_=flows_sens(m,pg); fmap={k:v for k,v in zip(idx,f)}; nb=len(m['bus']); deg=np.zeros(nb,int)
    for k,row in enumerate(br):
        if active[k]: deg[int(row[F_BUS])]+=1; deg[int(row[T_BUS])]+=1
    out=[]
    for k,row in enumerate(br):
        if not active[k]:continue
        mask=active.copy(); mask[k]=False
        if not connected(m,mask):continue
        rt=float(row[RATE_A]) if row[RATE_A]>1e-6 else 1e9
        out.append((k,{'outage_util':abs(float(fmap.get(k,0)))/rt,'outage_rate':min(rt,1e8),'outage_x':abs(float(row[BR_X])),
                       'deg_from':int(deg[int(row[F_BUS])]),'deg_to':int(deg[int(row[T_BUS])])}))
    return out


def survives(m,pg,k):
    active=m['branch'][:,BR_STATUS]>0; active[k]=False
    if not connected(m,active):return 0
    idx,f,S,on=flows_sens(m,pg,active)
    if idx is None:return 0
    rate=rates(m,idx); g=m['gen'][on]; p=pg[on]; ramp=RAMP_FRAC*np.maximum(0,g[:,PMAX]-g[:,PMIN])
    lo=np.maximum(g[:,PMIN]-p,-ramp); hi=np.minimum(g[:,PMAX]-p,ramp)
    A=np.vstack([S,-S]); b=np.concatenate([rate-f,rate+f])
    res=linprog(np.zeros(len(on)),A_ub=A,b_ub=b,A_eq=np.ones((1,len(on))),b_eq=[0.0],bounds=list(zip(lo,hi)),method='highs')
    return int(res.success)


def mdl():
    return LGBMClassifier(n_estimators=300,learning_rate=.03,num_leaves=15,min_child_samples=40,subsample=.9,colsample_bytree=.9,reg_lambda=5,reg_alpha=1,random_state=SEED,verbosity=-1)


def metrics(y,p):
    return {'brier':float(brier_score_loss(y,p)),'auroc':float(roc_auc_score(y,p)) if len(np.unique(y))>1 else None,
            'ap':float(average_precision_score(y,p)) if len(np.unique(y))>1 else None}


def matched(sd):
    z=StandardScaler().fit_transform(sd[STATE_FEATURES]); cand=[]
    for a in range(len(sd)):
        for b in range(a+1,len(sd)):
            if abs(float(sd.iloc[a].M-sd.iloc[b].M))>=M_DIFF:
                cand.append((float(np.linalg.norm(z[a]-z[b])),a,b))
    cand.sort(); used=set(); rows=[]
    for d,a,b in cand:
        if a in used or b in used:continue
        used|={a,b}; ra,rb=sd.iloc[a],sd.iloc[b]; hi,lo=(ra,rb) if ra.M>rb.M else (rb,ra)
        rows.append({'distance':d,'M_hi':float(hi.M),'M_lo':float(lo.M),'surv_hi':float(hi.survival),'surv_lo':float(lo.survival),'diff':float(hi.survival-lo.survival)})
    return pd.DataFrame(rows)


def main():
    raw,source_sha=load_case(); m=internalize(raw); states=make_states(m,N_STATES)
    rows=[]; srows=[]
    for sid,pg in enumerate(states):
        M=float(maneuverability(m,pg)); sf=state_features(m,pg); ys=[]
        for k,cf in contingencies(m,pg):
            y=survives(m,pg,k); ys.append(y); rows.append({'state':sid,'fold':sid%5,'M':M,'y':y,'branch':k,**sf,**cf})
        srows.append({'state':sid,'fold':sid%5,'M':M,'survival':float(np.mean(ys)), 'n_cont':len(ys), **sf})
        if sid%20==0: print('STATE',sid,'M',M,'SURV',np.mean(ys),flush=True)
    df=pd.DataFrame(rows); sd=pd.DataFrame(srows)
    failure_rate=float(1-df.y.mean()); m_range=float(sd.M.max()-sd.M.min()); mt=matched(sd); inf=mt[np.abs(mt['diff'])>1e-12] if len(mt) else mt
    evaluable=(m_range>=0.15 and failure_rate>=0.05 and failure_rate<=0.95 and len(inf)>=30)
    preds=[]; folds=[]
    if evaluable:
        for fold in range(5):
            tr=df['fold']!=fold; te=df['fold']==fold; y=df.loc[te,'y'].to_numpy()
            a=mdl(); b=mdl(); a.fit(df.loc[tr,XCOLS],df.loc[tr,'y']); b.fit(df.loc[tr,XCOLS+['M']],df.loc[tr,'y'])
            p0=a.predict_proba(df.loc[te,XCOLS])[:,1]; p1=b.predict_proba(df.loc[te,XCOLS+['M']])[:,1]
            m0=metrics(y,p0); m1=metrics(y,p1); folds.append({'fold':fold,'n':len(y),'failures':int((1-y).sum()),'base':m0,'aug':m1,'brier_rel_improve':(m0['brier']-m1['brier'])/m0['brier']})
            q=df.loc[te,['state','fold','M','y','branch']].copy(); q['p_base']=p0; q['p_aug']=p1; preds.append(q)
        pred=pd.concat(preds,ignore_index=True); pool0=metrics(pred.y,pred.p_base); pool1=metrics(pred.y,pred.p_aug)
        rel=(pool0['brier']-pool1['brier'])/pool0['brier']; aucdelta=pool1['auroc']-pool0['auroc']; wins=sum(x['aug']['brier']<x['base']['brier'] for x in folds)
        pair_win=float((inf['diff']>0).mean()); rho,pval=spearmanr(sd.M,sd.survival)
        criteria={'brier_rel_improve_ge_5pct':bool(rel>=.05),'auroc_delta_nonnegative':bool(aucdelta>=0),'brier_wins_ge_4_of_5':bool(wins>=4),
                  'matched_higher_M_win_ge_70pct':bool(pair_win>=.70),'spearman_positive_p_lt_0_01':bool(rho>0 and pval<.01)}
        verdict='PASS' if all(criteria.values()) else 'FAIL'
    else:
        pred=pd.DataFrame(); folds=[]; pool0=pool1={}; rel=aucdelta=None; wins=0; pair_win=float((inf['diff']>0).mean()) if len(inf) else None; rho,pval=spearmanr(sd.M,sd.survival); criteria={}; verdict='UNEVALUABLE'
    findings={'verdict':verdict,'source_url':SOURCE_URL,'source_commit':SOURCE_COMMIT,'source_sha256':source_sha,'seed':SEED,'n_states':len(sd),'n_rows':len(df),
              'failure_rate':failure_rate,'M_min':float(sd.M.min()),'M_max':float(sd.M.max()),'M_range':m_range,'matched_pairs':len(mt),'informative_pairs':len(inf),
              'matched_higher_M_win_rate':pair_win,'spearman_rho':float(rho) if np.isfinite(rho) else None,'spearman_p':float(pval) if np.isfinite(pval) else None,
              'pooled_base':pool0,'pooled_aug':pool1,'pooled_brier_rel_improve':rel,'pooled_auroc_delta':aucdelta,'fold_brier_wins':wins,'folds':folds,'criteria':criteria}
    Path('grid_stressed_maneuverability_findings_v1.json').write_text(json.dumps(findings,indent=2))
    df.to_csv('grid_stressed_state_contingency_rows_v1.csv',index=False); sd.to_csv('grid_stressed_state_summary_v1.csv',index=False); mt.to_csv('grid_stressed_matched_pairs_v1.csv',index=False)
    if len(pred): pred.to_csv('grid_stressed_predictions_v1.csv',index=False)
    Path('GRID_STRESSED_MANEUVERABILITY_VERDICT_v1.txt').write_text(verdict+'\n'+json.dumps(findings,indent=2))
    print(json.dumps(findings,indent=2),flush=True)

if __name__=='__main__': main()
