#!/usr/bin/env python3
import json, math
from pathlib import Path
import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import roc_auc_score, average_precision_score
from imi_viable_decision_space_test_v1 import build, A_COLS

TRAIN = [
 {'name':'J.C. Penney','cik':1166126,'group':'failure','terminal':'2020-05-15'},
 {'name':'Pier 1 Imports','cik':278130,'group':'failure','terminal':'2020-02-17'},
 {'name':'RadioShack','cik':96289,'group':'failure','terminal':'2015-02-05'},
 {'name':'Sears Holdings','cik':1310067,'group':'failure','terminal':'2018-10-15'},
 {'name':'Tailored Brands','cik':884217,'group':'failure','terminal':'2020-08-02'},
 {'name':'Ascena Retail Group','cik':1498301,'group':'failure','terminal':'2020-07-23'},
 {'name':'Stein Mart','cik':884940,'group':'failure','terminal':'2020-08-12'},
 {'name':'Bed Bath & Beyond','cik':886158,'group':'failure','terminal':'2023-04-23'},
 {'name':'Party City Holdco','cik':1592058,'group':'failure','terminal':'2023-01-17'},
 {'name':'Tuesday Morning','cik':878726,'group':'failure','terminal':'2023-02-14'},
 {'name':'Macys','cik':794367,'group':'survivor','terminal':None},
 {'name':'Kohls','cik':885639,'group':'survivor','terminal':None},
 {'name':'Nordstrom','cik':72333,'group':'survivor','terminal':None},
 {'name':'Target','cik':27419,'group':'healthy','terminal':None},
 {'name':'Lowes','cik':60667,'group':'healthy','terminal':None},
 {'name':'TJX Companies','cik':109198,'group':'healthy','terminal':None},
 {'name':'Gap','cik':39911,'group':'survivor','terminal':None},
 {'name':'Best Buy','cik':764478,'group':'survivor','terminal':None},
 {'name':'Dicks Sporting Goods','cik':1089063,'group':'survivor','terminal':None},
 {'name':'Walmart','cik':104169,'group':'healthy','terminal':None},
 {'name':'Home Depot','cik':354950,'group':'healthy','terminal':None},
 {'name':'Costco','cik':909832,'group':'healthy','terminal':None},
]

CONFIRM = [
 {'name':'Big Lots','cik':768835,'group':'failure','terminal':'2024-09-09'},
 {'name':'Rite Aid','cik':84129,'group':'failure','terminal':'2023-10-15'},
 {'name':'Revlon','cik':887921,'group':'failure','terminal':'2022-06-15'},
 {'name':'Abercrombie & Fitch','cik':1018840,'group':'survivor','terminal':None},
 {'name':'Foot Locker','cik':850209,'group':'survivor','terminal':None},
 {'name':'Ross Stores','cik':745732,'group':'survivor','terminal':None},
 {'name':'Kroger','cik':56873,'group':'healthy','terminal':None},
 {'name':'AutoZone','cik':866787,'group':'healthy','terminal':None},
 {'name':'Tractor Supply','cik':916365,'group':'healthy','terminal':None},
]

SEED = 314159
RNG = np.random.default_rng(SEED)


def make_windows(company):
    p = build(company).sort_values('quarter').reset_index(drop=True)
    rows=[]
    for i in range(3, len(p)):
        w = p.iloc[i-3:i+1].copy()
        if (w['dims_observed'] < 4).any():
            continue
        gaps = w['quarter'].diff().dt.days.dropna().to_numpy()
        if len(gaps) and np.any(gaps > 130):
            continue
        arr = w[A_COLS].to_numpy(float)
        masks = np.isfinite(arr).astype(float)
        r = p.iloc[i]
        rows.append({
            'company': company['name'],
            'group': company['group'],
            'terminal': r['terminal'],
            'quarter': r['quarter'],
            'quarters_to_terminal': r['quarters_to_terminal'],
            'y': int(r['terminal_within_4q']),
            'raw': arr,
            'mask': masks,
        })
    return rows


def collect(cases, stage):
    out=[]; errors=[]
    for c in cases:
        try:
            w=make_windows(c)
            print(stage, c['name'], c['group'], 'WINDOWS', len(w), flush=True)
            out.extend(w)
        except Exception as e:
            errors.append({'stage':stage,'company':c['name'],'error':repr(e)})
            print('ERROR', stage, c['name'], repr(e), flush=True)
    return out, errors


def fit_medians(rows):
    vals=np.concatenate([r['raw'] for r in rows],axis=0)
    med=np.nanmedian(vals,axis=0)
    med=np.where(np.isfinite(med),med,0.5)
    return med


def fill(arr, med):
    z=arr.copy().astype(float)
    bad=~np.isfinite(z)
    if bad.any():
        z[bad]=np.take(med,np.where(bad)[1])
    return z


def features(rows, med, permute_history=False, rng=None):
    Xs=[]; Xq=[]
    for r in rows:
        arr=r['raw'].copy()
        mask=r['mask'].copy()
        if permute_history:
            order=np.array([0,1,2])
            rng.shuffle(order)
            arr[:3]=arr[order]
            mask[:3]=mask[order]
        z=fill(arr,med)
        state=np.concatenate([z[-1],mask[-1]])
        hist=np.concatenate([z.reshape(-1),mask.reshape(-1)])
        d=np.diff(z,axis=0).reshape(-1)
        steps=np.linalg.norm(np.diff(z,axis=0),axis=1)
        plen=float(np.sum(steps))
        net=float(np.linalg.norm(z[-1]-z[0]))
        persistence=0.0 if plen<=1e-12 else net/plen
        seq=np.concatenate([hist,d,[plen,persistence]])
        Xs.append(state); Xq.append(seq)
    return np.asarray(Xs,float),np.asarray(Xq,float)


def threshold_90spec(y,score):
    cand=np.unique(np.round(score,12))
    best=None
    for t in sorted(cand):
        pred=score>=t
        neg=(y==0); pos=(y==1)
        if neg.sum()==0 or pos.sum()==0: continue
        spec=float((~pred[neg]).mean())
        sens=float(pred[pos].mean())
        if spec>=0.90 and sens>0:
            best={'threshold':float(t),'specificity':spec,'sensitivity':sens}
            break
    return best


def persistent_alert(g):
    a=g.sort_values('quarter').alert.astype(int).to_numpy()
    return bool(len(a)>1 and np.any(a[:-1]+a[1:]>=2))


def survivor_ok(g):
    g=g.sort_values('quarter').reset_index(drop=True)
    hits=np.where(g.alert.to_numpy())[0]
    if len(hits)==0: return {'entered':False,'recovered':True,'recovery_quarters':None}
    i=int(hits[0]); fut=g.iloc[i+1:i+5]
    rec=np.where(~fut.alert.to_numpy())[0]
    return {'entered':True,'recovered':bool(len(rec)),'recovery_quarters':None if not len(rec) else int(rec[0]+1)}


def main():
    train, e1=collect(TRAIN,'TRAIN')
    conf, e2=collect(CONFIRM,'CONFIRMATION')
    findings={'design':'IMI multivariate trajectory test v1','errors':e1+e2,'seed':SEED}
    if not train or not conf:
        findings['verdict']='UNEVALUABLE'
        Path('imi_multivariate_trajectory_findings_v1.json').write_text(json.dumps(findings,indent=2,default=str))
        print(json.dumps(findings,indent=2),flush=True); return

    med=fit_medians(train)
    Xst,Xqt=features(train,med)
    Xsc,Xqc=features(conf,med)
    yt=np.asarray([r['y'] for r in train],int)
    yc=np.asarray([r['y'] for r in conf],int)

    ss=StandardScaler().fit(Xst); sq=StandardScaler().fit(Xqt)
    ms=LogisticRegression(C=1.0,class_weight='balanced',max_iter=3000,random_state=SEED).fit(ss.transform(Xst),yt)
    mq=LogisticRegression(C=1.0,class_weight='balanced',max_iter=3000,random_state=SEED).fit(sq.transform(Xqt),yt)
    pst=ms.predict_proba(ss.transform(Xst))[:,1]
    pqt=mq.predict_proba(sq.transform(Xqt))[:,1]
    psc=ms.predict_proba(ss.transform(Xsc))[:,1]
    pqc=mq.predict_proba(sq.transform(Xqc))[:,1]
    cut=threshold_90spec(yt,pqt)

    counts=pd.DataFrame([{'group':r['group'],'company':r['company']} for r in conf]).groupby(['group','company']).size().reset_index(name='n')
    elig=counts[counts.n>=12]
    ec=elig.groupby('group').size().to_dict()
    A=bool(ec.get('failure',0)>=3 and ec.get('survivor',0)>=2 and ec.get('healthy',0)>=2 and len(np.unique(yc))==2 and cut)
    findings['usable_counts']=counts.to_dict('records'); findings['eligible_counts']=ec; findings['training_alert_threshold']=cut
    if not A:
        findings['criteria']={'A_evaluable':False}; findings['verdict']='UNEVALUABLE'
    else:
        auc_s=float(roc_auc_score(yc,psc)); auc_q=float(roc_auc_score(yc,pqc))
        ap_s=float(average_precision_score(yc,psc)); ap_q=float(average_precision_score(yc,pqc))
        B=auc_q-auc_s>=0.05; C=ap_q-ap_s>=0.05
        df=pd.DataFrame([{'company':r['company'],'group':r['group'],'quarter':r['quarter'],'terminal':r['terminal'],'quarters_to_terminal':r['quarters_to_terminal'],'y':r['y'],'state_score':ps,'sequence_score':pq,'alert':bool(pq>=cut['threshold'])} for r,ps,pq in zip(conf,psc,pqc)])
        frows=[]
        for name,g in df[df.group=='failure'].groupby('company'):
            g=g.sort_values('quarter'); hit=g[g.alert]
            if hit.empty:
                frows.append({'company':name,'first_alert':None,'crossed':False,'lead_quarters':None,'within_8_5q':False})
            else:
                h=hit.iloc[0]; lead=float(h.quarters_to_terminal)
                frows.append({'company':name,'first_alert':str(pd.Timestamp(h.quarter).date()),'crossed':True,'lead_quarters':lead,'within_8_5q':bool(lead<=8.5)})
        D=bool(len(frows)>=3 and all(x['crossed'] for x in frows) and sum(x['within_8_5q'] for x in frows)>=2)
        hdf=df[df.group=='healthy']; hrows=[]
        for name,g in hdf.groupby('company'):
            hrows.append({'company':name,'persistent_alert':persistent_alert(g),'prevalence':float(g.alert.mean())})
        hp=float(hdf.alert.mean()) if len(hdf) else math.nan
        E=bool(hp<=0.10 and all(not x['persistent_alert'] for x in hrows))
        srows=[]
        for name,g in df[df.group=='survivor'].groupby('company'):
            x=survivor_ok(g); x['company']=name; srows.append(x)
        F=bool(sum(x['recovered'] for x in srows)>=2)

        perm_aucs=[]
        for k in range(100):
            rg=np.random.default_rng(SEED+k+1)
            _,Xp=features(conf,med,permute_history=True,rng=rg)
            pp=mq.predict_proba(sq.transform(Xp))[:,1]
            perm_aucs.append(float(roc_auc_score(yc,pp)))
        mean_perm=float(np.mean(perm_aucs)); G=bool(auc_q-mean_perm>=0.03)

        criteria={'A_evaluable':A,'B_incremental_auroc':B,'C_incremental_average_precision':C,'D_failure_localization':D,'E_healthy_specificity':E,'F_survivor_distinction':F,'G_history_ablation':G}
        findings.update({
          'metrics':{'state_auroc':auc_s,'sequence_auroc':auc_q,'auroc_gain':auc_q-auc_s,'state_ap':ap_s,'sequence_ap':ap_q,'ap_gain':ap_q-ap_s},
          'failure_results':frows,'healthy_results':hrows,'healthy_alert_prevalence':hp,'survivor_results':srows,
          'history_ablation':{'intact_sequence_auroc':auc_q,'mean_permuted_history_auroc':mean_perm,'order_gain':auc_q-mean_perm,'n_permutations':100},
          'criteria':criteria,'verdict':'TRAJECTORY_CONFIRMED' if all(criteria.values()) else 'FAIL'})
        df.to_csv('imi_multivariate_trajectory_confirmation_panel_v1.csv',index=False)
    Path('imi_multivariate_trajectory_findings_v1.json').write_text(json.dumps(findings,indent=2,default=str))
    Path('IMI_MULTIVARIATE_TRAJECTORY_VERDICT_v1.txt').write_text(findings['verdict']+'\n'+json.dumps(findings,indent=2,default=str))
    print(json.dumps(findings,indent=2,default=str),flush=True)

if __name__=='__main__': main()
