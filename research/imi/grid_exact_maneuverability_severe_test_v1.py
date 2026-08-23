#!/usr/bin/env python3
"""Exact grid maneuverability severe test v1 — optimized execution.
Scientific protocol is unchanged. This revision caches DC transfer matrices by topology/outage;
it changes computation only, not states, transition definition, outcomes, models, or thresholds.
"""
import json, warnings
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
BUS_I,PD=0,2
GEN_BUS,PG,GEN_STATUS,PMAX,PMIN=0,1,7,8,9
F_BUS,T_BUS,BR_X,RATE_A,BR_STATUS=0,1,3,5,10


def internalize(raw):
    m={k:(v.copy() if hasattr(v,'copy') else v) for k,v in raw.items()}
    ids=m['bus'][:,BUS_I].astype(int); mp={b:i for i,b in enumerate(ids)}
    m['branch'][:,F_BUS]=[mp[int(x)] for x in m['branch'][:,F_BUS]]
    m['branch'][:,T_BUS]=[mp[int(x)] for x in m['branch'][:,T_BUS]]
    m['gen'][:,GEN_BUS]=[mp[int(x)] for x in m['gen'][:,GEN_BUS]]
    m['bus'][:,BUS_I]=np.arange(len(ids))
    return m


def is_connected(m,mask):
    nb=len(m['bus']); adj=[[] for _ in range(nb)]
    for k,r in enumerate(m['branch']):
        if mask[k] and r[BR_STATUS]>0:
            a,b=int(r[F_BUS]),int(r[T_BUS]); adj[a].append(b); adj[b].append(a)
    seen={0}; stack=[0]
    while stack:
        u=stack.pop()
        for v in adj[u]:
            if v not in seen: seen.add(v); stack.append(v)
    return len(seen)==nb


def build_net(m,mask=None):
    br=m['branch']; nb=len(m['bus']); active=br[:,BR_STATUS]>0
    if mask is not None: active &= mask
    idx=np.where(active)[0]; ba=br[idx]
    C=np.zeros((len(idx),nb)); rr=np.arange(len(idx))
    C[rr,ba[:,F_BUS].astype(int)]=1; C[rr,ba[:,T_BUS].astype(int)]=-1
    x=ba[:,BR_X].astype(float); b=1/np.where(np.abs(x)<1e-10,1e-10,x)
    B=C.T@(b[:,None]*C); keep=np.arange(1,nb)
    try: Binv=np.linalg.inv(B[np.ix_(keep,keep)])
    except np.linalg.LinAlgError: return None
    H=np.zeros((len(idx),nb)); H[:,keep]=(b[:,None]*C[:,keep])@Binv
    rates=ba[:,RATE_A].astype(float); rates=np.where(rates>1e-6,rates,1e9)
    on=np.where(m['gen'][:,GEN_STATUS]>0)[0]
    G=np.zeros((nb,len(on)))
    for j,gi in enumerate(on): G[int(m['gen'][gi,GEN_BUS]),j]=1.0
    S=H@G
    return {'idx':idx,'H':H,'S':S,'rates':rates,'on':on}


def injection(m,pg):
    q=-m['bus'][:,PD].astype(float).copy()
    for gi,g in enumerate(m['gen']):
        if g[GEN_STATUS]>0:q[int(g[GEN_BUS])]+=pg[gi]
    q[0]-=q.sum()
    return q


def flows(m,net,pg): return net['H']@injection(m,pg)


def pair_step(m,net,pg,i,j,f=None):
    on=net['on']; gen=m['gen']; gi,gj=on[i],on[j]
    genlim=max(0.0,float(min(gen[gi,PMAX]-pg[gi],pg[gj]-gen[gj,PMIN])))
    if genlim<=0:return 0.0,0.0
    if f is None:f=flows(m,net,pg)
    d=net['S'][:,i]-net['S'][:,j]; rate=net['rates']; lim=genlim
    pos=d>1e-10; neg=d<-1e-10
    if np.any(pos):lim=min(lim,float(np.min((rate[pos]-f[pos])/d[pos])))
    if np.any(neg):lim=min(lim,float(np.min((-rate[neg]-f[neg])/d[neg])))
    return max(0.0,lim),genlim


def maneuverability(m,net,pg):
    f=flows(m,net,pg); n=len(net['on']); num=den=0.0
    for i in range(n):
        for j in range(i+1,n):
            a,ga=pair_step(m,net,pg,i,j,f); bb,gb=pair_step(m,net,pg,j,i,f)
            num+=a+bb; den+=ga+gb
    return num/den if den>0 else 0.0


def feasible(m,net,pg):
    return bool(np.all(np.abs(flows(m,net,pg))<=net['rates']+1e-7))


def make_states(raw,m,net,n):
    res=rundcopf(raw,ppoption(VERBOSE=0,OUT_ALL=0))
    if not res.get('success',False):raise RuntimeError('base DC OPF failed')
    pg=res['gen'][:,PG].copy(); states=[]
    if feasible(m,net,pg):states.append(pg.copy())
    attempts=0
    while len(states)<n and attempts<6000:
        attempts+=1; q=states[int(RNG.integers(len(states)))].copy() if states else pg.copy(); on=net['on']
        for _ in range(int(RNG.integers(2,8))):
            if len(on)<2:break
            i,j=RNG.choice(len(on),2,replace=False); f=flows(m,net,q); lim,_=pair_step(m,net,q,int(i),int(j),f)
            if lim>1e-7:
                s=float(lim*RNG.uniform(.05,.95)); q[on[i]]+=s; q[on[j]]-=s
        if feasible(m,net,q) and all(np.linalg.norm(q-s)>1e-3 for s in states):states.append(q)
    if len(states)<n:raise RuntimeError(f'only generated {len(states)} feasible states')
    return states[:n]


def hhi(v):
    v=np.maximum(0,np.asarray(v,float)); s=v.sum(); return float(np.sum((v/s)**2)) if s>0 else 1.0


def state_features(m,net,pg,ci):
    f=flows(m,net,pg); u=np.abs(f)/net['rates']; g=m['gen'][net['on']]; p=pg[net['on']]
    up=np.maximum(0,g[:,PMAX]-p); dn=np.maximum(0,p-g[:,PMIN]); span=np.maximum(1e-9,g[:,PMAX]-g[:,PMIN]); load=float(m['bus'][:,PD].sum())
    return dict(max_util=float(u.max()),mean_util=float(u.mean()),std_util=float(u.std()),p95_util=float(np.quantile(u,.95)),
      up_headroom_ratio=float(up.sum()/max(load,1e-9)),down_headroom_ratio=float(dn.sum()/max(load,1e-9)),
      min_up_frac=float(np.min(up/span)),min_down_frac=float(np.min(dn/span)),dispatch_hhi=hhi(p),headroom_hhi=hhi(up+dn),
      nb=len(m['bus']),nl=len(net['idx']),ng=len(net['on']),case_idx=ci)


def contingency_models(m,intact):
    br=m['branch']; active=br[:,BR_STATUS]>0; nb=len(m['bus']); basef_dummy=np.zeros(len(br)); deg=np.zeros(nb,int)
    for k,r in enumerate(br):
        if active[k]:deg[int(r[F_BUS])]+=1;deg[int(r[T_BUS])]+=1
    out=[]
    for k,r in enumerate(br):
        if not active[k]:continue
        mask=active.copy();mask[k]=False
        if not is_connected(m,mask):continue
        net=build_net(m,mask)
        if net is None:continue
        rate=float(r[RATE_A]) if r[RATE_A]>1e-6 else 1e9
        out.append({'k':k,'net':net,'rate_desc':rate if rate<1e8 else 1e8,'x':abs(float(r[BR_X])),
                    'df':int(deg[int(r[F_BUS])]),'dt':int(deg[int(r[T_BUS])])})
    return out


def survive(m,cm,pg):
    net=cm['net']; f=flows(m,net,pg); g=m['gen'][net['on']]; p=pg[net['on']]
    ramp=RAMP_FRAC*np.maximum(0,g[:,PMAX]-g[:,PMIN]); lo=np.maximum(g[:,PMIN]-p,-ramp); hi=np.minimum(g[:,PMAX]-p,ramp)
    A=np.vstack([net['S'],-net['S']]); b=np.concatenate([net['rates']-f,net['rates']+f])
    r=linprog(np.zeros(len(net['on'])),A_ub=A,b_ub=b,A_eq=np.ones((1,len(net['on']))),b_eq=[0.0],bounds=list(zip(lo,hi)),method='highs')
    return int(r.success)


def model():
    return LGBMClassifier(n_estimators=250,learning_rate=.035,num_leaves=15,min_child_samples=30,subsample=.9,colsample_bytree=.9,reg_lambda=5,reg_alpha=1,random_state=SEED,verbosity=-1)


def metric(y,p):
    return {'brier':float(brier_score_loss(y,p)),'auroc':float(roc_auc_score(y,p)) if len(np.unique(y))>1 else None,
            'ap':float(average_precision_score(y,p)) if np.sum(y)>0 else None}


def matched_test(sd):
    rows=[]; sf=[c for c in STATE_FEATURES if c not in ['case_idx','nb','nl','ng']]
    for case,g in sd.groupby('case'):
        z=StandardScaler().fit_transform(g[sf]); ids=list(g.index); used=set(); cand=[]
        for a in range(len(g)):
            for b in range(a+1,len(g)):
                if abs(float(g.iloc[a].M-g.iloc[b].M))>=M_DIFF:cand.append((float(np.linalg.norm(z[a]-z[b])),a,b))
        cand.sort()
        for d,a,b in cand:
            ia,ib=ids[a],ids[b]
            if ia in used or ib in used:continue
            used|={ia,ib}; A,B=sd.loc[ia],sd.loc[ib]; hi,lo=(A,B) if A.M>B.M else (B,A)
            rows.append({'case':case,'distance':d,'M_hi':hi.M,'M_lo':lo.M,'surv_hi':hi.survival,'surv_lo':lo.survival,'diff':hi.survival-lo.survival})
    return pd.DataFrame(rows)


def main():
    allrows=[]; st=[]
    for ci,(name,fn) in enumerate(CASES.items()):
        print('CASE_START',name,flush=True); raw=fn(); m=internalize(raw); intact=build_net(m)
        states=make_states(raw,m,intact,N_STATES); cms=contingency_models(m,intact)
        base_idx_to_pos={k:i for i,k in enumerate(intact['idx'])}
        for si,pg in enumerate(states):
            M=float(maneuverability(m,intact,pg)); sf=state_features(m,intact,pg,ci); bf=flows(m,intact,pg); ys=[]
            for cm in cms:
                y=survive(m,cm,pg);ys.append(y); k=cm['k']; pos=base_idx_to_pos[k]; rate=float(m['branch'][k,RATE_A]) if m['branch'][k,RATE_A]>1e-6 else 1e9
                cf=dict(outage_util=abs(float(bf[pos]))/rate,outage_rate=cm['rate_desc'],outage_x=cm['x'],deg_from=cm['df'],deg_to=cm['dt'])
                allrows.append({'case':name,'state':si,'M':M,'y':y,**sf,**cf})
            st.append({'case':name,'state':si,'M':M,'survival':float(np.mean(ys)) if ys else np.nan,**sf,'n_cont':len(ys)})
        print('CASE_DONE',name,'states',len(states),'contingencies',len(cms),flush=True)
    df=pd.DataFrame(allrows); sd=pd.DataFrame(st)
    if len(df)==0 or df.y.nunique()<2:
        findings={'verdict':'UNEVALUABLE','reason':'outcome has insufficient variation','rows':len(df),'survival_rate':float(df.y.mean()) if len(df) else None}
        Path('grid_exact_maneuverability_findings_v1.json').write_text(json.dumps(findings,indent=2)); Path('GRID_EXACT_MANEUVERABILITY_VERDICT_v1.txt').write_text(json.dumps(findings,indent=2)); print(json.dumps(findings,indent=2)); return
    preds=[]; folds=[]
    for hold in CASES:
        tr=df.case!=hold; te=df.case==hold; a=model(); b=model(); a.fit(df.loc[tr,XCOLS],df.loc[tr,'y']); b.fit(df.loc[tr,XCOLS+['M']],df.loc[tr,'y'])
        p0=a.predict_proba(df.loc[te,XCOLS])[:,1]; p1=b.predict_proba(df.loc[te,XCOLS+['M']])[:,1]; y=df.loc[te,'y'].to_numpy(); m0=metric(y,p0);m1=metric(y,p1)
        folds.append({'case':hold,'n':len(y),'successes':int(y.sum()),'base':m0,'aug':m1,'brier_rel_improve':(m0['brier']-m1['brier'])/m0['brier'] if m0['brier'] else 0})
        q=df.loc[te,['case','state','M','y']].copy();q['p_base']=p0;q['p_aug']=p1;preds.append(q)
    pred=pd.concat(preds,ignore_index=True); pool0=metric(pred.y,pred.p_base);pool1=metric(pred.y,pred.p_aug); rel=(pool0['brier']-pool1['brier'])/pool0['brier']; aucdelta=pool1['auroc']-pool0['auroc']; bw=sum(x['aug']['brier']<x['base']['brier'] for x in folds)
    mt=matched_test(sd); informative=mt[mt['diff']!=0] if len(mt) else mt; pr=float((informative['diff']>0).mean()) if len(informative) else 0.0; cp=mt.groupby('case')['diff'].mean().to_dict() if len(mt) else {}; ppc=sum(v>0 for v in cp.values())
    corrs={}; pc=0
    for case,g in sd.groupby('case'):
        rho,p=spearmanr(g.M,g.survival);rho=0.0 if np.isnan(rho) else float(rho);p=1.0 if np.isnan(p) else float(p);corrs[case]={'rho':rho,'p':p};pc+=int(rho>0)
    crit={'brier_rel_improve_ge_5pct':rel>=.05,'auroc_non_degrade':aucdelta>=0,'brier_win_4of5':bw>=4,'matched_direction_70pct':pr>=.70,'matched_positive_4of5':ppc>=4,'spearman_positive_4of5':pc>=4}; verdict='PASS' if all(crit.values()) else 'FAIL'
    findings={'verdict':verdict,'seed':SEED,'cases':list(CASES),'states_per_case':N_STATES,'rows':len(df),'survival_rate':float(df.y.mean()),'pooled_base':pool0,'pooled_aug':pool1,'brier_relative_improvement':float(rel),'auroc_delta':float(aucdelta),'folds':folds,'matched_pairs':int(len(mt)),'informative_pairs':int(len(informative)),'higher_M_win_rate':pr,'positive_pair_cases':ppc,'spearman':corrs,'positive_spearman_cases':pc,'criteria':crit}
    Path('grid_exact_maneuverability_findings_v1.json').write_text(json.dumps(findings,indent=2));df.to_csv('grid_state_contingency_rows_v1.csv',index=False);sd.to_csv('grid_state_summary_v1.csv',index=False);pred.to_csv('grid_predictions_v1.csv',index=False);mt.to_csv('grid_matched_pairs_v1.csv',index=False);Path('GRID_EXACT_MANEUVERABILITY_VERDICT_v1.txt').write_text(verdict+'\n'+json.dumps(findings,indent=2));print(json.dumps(findings,indent=2),flush=True)

if __name__=='__main__':main()
