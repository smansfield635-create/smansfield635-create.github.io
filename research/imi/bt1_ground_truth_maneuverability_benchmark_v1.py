#!/usr/bin/env python3
import json
import numpy as np
import pandas as pd
from scipy.stats import pearsonr, spearmanr
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score, log_loss
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

DT=0.1
N=12000
SEED=20260823
UGRID=np.linspace(-1,1,401)

def in_kernel(p,v,a):
    if abs(p)>1 or abs(v)>1: return False
    if v>0: return p+v*v/(2*a)<=1+1e-12
    if v<0: return p-v*v/(2*a)>=-1-1e-12
    return True

def mfrac(p,v,a):
    pp=p+v*DT+0.5*a*UGRID*DT**2
    vv=v+a*UGRID*DT
    ok=(np.abs(pp)<=1)&(np.abs(vv)<=1)
    pos=vv>0; neg=vv<0
    ok &= (~pos | (pp+vv*vv/(2*a)<=1+1e-12))
    ok &= (~neg | (pp-vv*vv/(2*a)>=-1-1e-12))
    return float(ok.mean())

def generate():
    rng=np.random.default_rng(SEED); rows=[]; attempts=0
    while len(rows)<N and attempts<200000:
        attempts+=1; a=float(rng.uniform(.35,1.0))
        for _ in range(100):
            p=float(rng.uniform(-.85,.85)); v=float(rng.uniform(-.7,.7))
            if in_kernel(p,v,a): break
        else: continue
        ps=[p]; vs=[v]; us=[]; good=True
        for _ in range(6):
            chosen=None
            for u in rng.permutation(np.linspace(-1,1,81)):
                pn=p+v*DT+0.5*a*float(u)*DT**2; vn=v+a*float(u)*DT
                if in_kernel(pn,vn,a): chosen=float(u); p,v=pn,vn; break
            if chosen is None: good=False; break
            us.append(chosen); ps.append(p); vs.append(v)
        if not good: continue
        uarr=np.array(us); dvs=np.diff(np.array(vs)); denom=DT*np.sum(uarr*uarr)
        ahat=float(np.clip(np.sum(uarr*dvs)/denom,.1,1.2))
        mh=mfrac(p,v,ahat); mt=mfrac(p,v,a)
        mag=float(rng.uniform(0,.9)); sign=int(rng.choice([-1,1])); y=int(not in_kernel(p,v+sign*mag,a))
        psarr=np.array(ps); vsarr=np.array(vs); dps=np.diff(psarr); dvs=np.diff(vsarr)
        f={'p':p,'v':v,'p_headroom':1-abs(p),'v_headroom':1-abs(v)}
        for j,x in enumerate(psarr[-6:]): f[f'p_l{j}']=float(x)
        for j,x in enumerate(vsarr[-6:]): f[f'v_l{j}']=float(x)
        for j,x in enumerate(dps[-5:]): f[f'dp{j}']=float(x)
        for j,x in enumerate(dvs[-5:]): f[f'dv{j}']=float(x)
        for j,x in enumerate(us): f[f'u{j}']=float(x)
        f.update(mean_abs_u=float(np.mean(np.abs(us))),p_mean=float(psarr.mean()),v_mean=float(vsarr.mean()),
                 p_slope=float(np.polyfit(np.arange(len(psarr)),psarr,1)[0]),v_slope=float(np.polyfit(np.arange(len(vsarr)),vsarr,1)[0]),
                 acc_abs_mean=float(np.mean(np.abs(dvs/DT))),acc_abs_max=float(np.max(np.abs(dvs/DT))),pert_mag=mag,pert_sign=sign,
                 alpha_true=a,alpha_hat=ahat,M_true=mt,M_hat=mh,y=y)
        rows.append(f)
    return pd.DataFrame(rows)

def fit_eval(model,xtr,ytr,xte,yte):
    model.fit(xtr,ytr); p=model.predict_proba(xte)[:,1]
    return {'auroc':float(roc_auc_score(yte,p)),'log_loss':float(log_loss(yte,p))}

def main():
    d=generate(); conv=[c for c in d.columns if c not in ['alpha_true','alpha_hat','M_true','M_hat','y']]
    tr,te=train_test_split(np.arange(len(d)),test_size=.30,random_state=SEED,stratify=d.y)
    ytr=d.iloc[tr].y; yte=d.iloc[te].y
    logistic=lambda: make_pipeline(StandardScaler(),LogisticRegression(max_iter=2000,C=1.0))
    hgb=lambda: HistGradientBoostingClassifier(max_iter=200,max_leaf_nodes=31,learning_rate=.08,l2_regularization=1.0,random_state=SEED)
    scores={}
    scores['logistic_conventional']=fit_eval(logistic(),d.iloc[tr][conv],ytr,d.iloc[te][conv],yte)
    scores['hgb_conventional']=fit_eval(hgb(),d.iloc[tr][conv],ytr,d.iloc[te][conv],yte)
    scores['logistic_plus_M']=fit_eval(logistic(),d.iloc[tr][conv+['M_hat']],ytr,d.iloc[te][conv+['M_hat']],yte)
    scores['hgb_plus_M']=fit_eval(hgb(),d.iloc[tr][conv+['M_hat']],ytr,d.iloc[te][conv+['M_hat']],yte)
    rng=np.random.default_rng(SEED); a=d.iloc[tr].M_hat.to_numpy().copy(); b=d.iloc[te].M_hat.to_numpy().copy(); rng.shuffle(a); rng.shuffle(b)
    xtr=d.iloc[tr][conv].copy(); xte=d.iloc[te][conv].copy(); xtr['M_hat_shuffled']=a; xte['M_hat_shuffled']=b
    scores['hgb_plus_shuffled_M']=fit_eval(hgb(),xtr,ytr,xte,yte)
    scores['hgb_plus_true_M_oracle']=fit_eval(hgb(),d.iloc[tr][conv+['M_true']],ytr,d.iloc[te][conv+['M_true']],yte)
    h1={'pearson':float(pearsonr(d.iloc[te].M_hat,d.iloc[te].M_true).statistic),'spearman':float(spearmanr(d.iloc[te].M_hat,d.iloc[te].M_true).statistic),
        'mae':float(np.mean(np.abs(d.iloc[te].M_hat-d.iloc[te].M_true))),'rmse':float(np.sqrt(np.mean((d.iloc[te].M_hat-d.iloc[te].M_true)**2)))}
    base=scores['hgb_conventional']; aug=scores['hgb_plus_M']
    delta={'auroc':aug['auroc']-base['auroc'],'log_loss_improvement':base['log_loss']-aug['log_loss']}
    h1_pass=h1['pearson']>=.85 and h1['spearman']>=.85 and h1['mae']<=.10
    h2_material=delta['auroc']>=.02 and delta['log_loss_improvement']>=.01
    verdict='SUPPORTED' if h1_pass and h2_material else ('SUPPORTED_BUT_NOT_DISTINGUISHED' if h1_pass else 'MATERIALLY_WEAKENED')
    out={'design':'BT1 ground-truth maneuverability benchmark v1','n':len(d),'test_n':len(te),'positive_rate':float(d.y.mean()),'h1':h1,'scores':scores,'primary_increment':delta,'h1_pass':h1_pass,'h2_material_increment':h2_material,'verdict':verdict}
    print(json.dumps(out,indent=2)); open('bt1_ground_truth_maneuverability_findings_v1.json','w').write(json.dumps(out,indent=2))

if __name__=='__main__': main()
