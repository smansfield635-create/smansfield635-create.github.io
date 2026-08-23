#!/usr/bin/env python3
import io, itertools, json, math
from pathlib import Path
import numpy as np
import pandas as pd
import requests
from scipy.stats import spearmanr

YEARS=range(2018,2023)
URL='https://echodata.epa.gov/echo/dmr_rest_services.get_state_stats?output=csv&p_year={year}'

EFFECTS=pd.DataFrame([
    ['FL',1400,335, 0.032173899196012545, 0.015235092144909146],
    ['GA',2160,611, 0.01248077371876289,  0.005445675843873787],
    ['MN',421,218,  0.0478502228145826,   0.020969855832241202],
    ['MO',1446,872,-0.014962278717497671,-0.013930289614167535],
    ['NC',1569,431,-0.001739650430409625,-0.002903290259705704],
    ['OH',1010,423,-0.021574388193368807,-0.007728523042597524],
    ['PA',1540,552, 0.0073027261208202555, 0.000621589508889353],
    ['VA',159,101, -0.035107078194092874,-0.021850460908159786],
    ['WI',773,194,  0.02062170587013764,  0.015325926321599792],
],columns=['STATE','n','events','brier_gain','auc_gain'])
EFFECTS=EFFECTS[EFFECTS.n>=300].reset_index(drop=True)

AXES=['major_share','log_permit_universe','loading_coverage_gap','log_major_loading_per_permit','log_major_toxic_per_permit']

def norm(s):
    return ''.join(ch.lower() for ch in str(s) if ch.isalnum())

def pick(cols,*terms):
    n={c:norm(c) for c in cols}
    for c,v in n.items():
        if all(norm(t) in v for t in terms): return c
    raise KeyError((terms,list(cols)))

def fetch_year(y):
    r=requests.get(URL.format(year=y),timeout=60,headers={'User-Agent':'Mozilla/5.0 imi-research/1.0'})
    r.raise_for_status()
    d=pd.read_csv(io.BytesIO(r.content))
    d['SOURCE_YEAR']=y
    return d

def parse_external(raw):
    cols=list(raw.columns)
    state=pick(cols,'state')
    majors=pick(cols,'number','majors','icis')
    nonmaj=pick(cols,'number','nonmajors','icis')
    pm=pick(cols,'percent','majors','pollutant','loadings')
    pn=pick(cols,'percent','nonmajors','pollutant','loadings')
    loadm=pick(cols,'total','pollutant','loading','majors')
    toxm=pick(cols,'total','toxic','weighted','majors')
    z=pd.DataFrame({
      'STATE':raw[state].astype(str).str.strip(),
      'year':raw.SOURCE_YEAR,
      'majors':pd.to_numeric(raw[majors],errors='coerce'),
      'nonmajors':pd.to_numeric(raw[nonmaj],errors='coerce'),
      'pct_major_loading':pd.to_numeric(raw[pm],errors='coerce'),
      'pct_nonmajor_loading':pd.to_numeric(raw[pn],errors='coerce'),
      'major_loading':pd.to_numeric(raw[loadm],errors='coerce'),
      'major_toxic':pd.to_numeric(raw[toxm],errors='coerce'),
    })
    den=z.majors+z.nonmajors
    z['major_share']=z.majors/den.replace(0,np.nan)
    z['log_permit_universe']=np.log1p(den)
    z['loading_coverage_gap']=z.pct_major_loading-z.pct_nonmajor_loading
    z['log_major_loading_per_permit']=np.log1p(z.major_loading/z.majors.replace(0,np.nan))
    z['log_major_toxic_per_permit']=np.log1p(z.major_toxic/z.majors.replace(0,np.nan))
    return z

def exact_pair_p(x,b,a):
    x=np.asarray(x,float); b=np.asarray(b,float); a=np.asarray(a,float)
    rb=float(spearmanr(x,b).statistic); ra=float(spearmanr(x,a).statistic)
    same=np.sign(rb)==np.sign(ra) and rb!=0 and ra!=0
    obs=min(abs(rb),abs(ra)) if same else 0.0
    ge=0; total=0
    for perm in itertools.permutations(range(len(x))):
        bp=b[list(perm)]; ap=a[list(perm)]
        r1=float(spearmanr(x,bp).statistic); r2=float(spearmanr(x,ap).statistic)
        st=min(abs(r1),abs(r2)) if (np.sign(r1)==np.sign(r2) and r1!=0 and r2!=0) else 0.0
        ge += st >= obs-1e-15
        total += 1
    return rb,ra,obs,(ge+1)/(total+1)

def holm(ps):
    order=sorted(ps,key=ps.get); m=len(order); out={}; run=0.0
    for i,k in enumerate(order):
        v=min(1.0,(m-i)*ps[k]); run=max(run,v); out[k]=run
    return out

def main():
    raw=pd.concat([fetch_year(y) for y in YEARS],ignore_index=True)
    ext=parse_external(raw)
    mean=ext.groupby('STATE',as_index=False)[AXES].mean()
    dat=EFFECTS.merge(mean,on='STATE',how='left')
    complete=dat.dropna(subset=AXES).copy()
    findings={'eligible_states':EFFECTS.STATE.tolist(),'complete_states':complete.STATE.tolist(),'n_complete':int(len(complete)),'effects':EFFECTS.to_dict('records')}
    if len(complete)<8:
        findings['verdict']='UNEVALUABLE'
    else:
        res={}; ps={}
        for ax in AXES:
            rb,ra,st,p=exact_pair_p(complete[ax],complete.brier_gain,complete.auc_gain)
            res[ax]={'rho_brier':rb,'rho_auc':ra,'paired_stat':st,'exact_p':p}
            ps[ax]=p
        adj=holm(ps); qual=[]
        for ax,r in res.items():
            r['holm_p']=adj[ax]
            r['same_sign']=bool(np.sign(r['rho_brier'])==np.sign(r['rho_auc']) and r['rho_brier']!=0 and r['rho_auc']!=0)
            r['qualifies']=bool(r['same_sign'] and abs(r['rho_brier'])>=.55 and abs(r['rho_auc'])>=.55 and r['holm_p']<.05)
            if r['qualifies']: qual.append(ax)
        findings.update({'external_state_table':complete.to_dict('records'),'axes':res,'holm_adjusted_p':adj,'qualifying_axes':qual,'verdict':'JURISDICTIONAL_ARCHITECTURE_SIGNAL' if qual else 'FAIL'})
    Path('imi_jurisdictional_architecture_findings_v1.json').write_text(json.dumps(findings,indent=2,default=str))
    Path('IMI_JURISDICTIONAL_ARCHITECTURE_VERDICT_v1.txt').write_text(findings['verdict']+'\n'+json.dumps(findings,indent=2,default=str))
    complete.to_csv('imi_jurisdictional_architecture_state_table_v1.csv',index=False)
    print(json.dumps(findings,indent=2,default=str),flush=True)

if __name__=='__main__': main()
