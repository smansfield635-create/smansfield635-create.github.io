#!/usr/bin/env python3
import hashlib,json,os,time,urllib.request
from datetime import datetime
from pathlib import Path
import numpy as np,pandas as pd
from netCDF4 import Dataset
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score,average_precision_score,brier_score_loss

R=Path(__file__).resolve().parent
P=R/'raw-tc-radar-mechanistic-protocol.v1.json'
O=R/'raw-tc-radar-mechanistic-result.v1.json'
F=R/'raw-tc-radar-mechanistic-features.v1.csv'
PROTO=json.loads(P.read_text()); SEED=45125661
META='https://raw.githubusercontent.com/MichaelFischerWx/TC-ATLAS/main/tc_radar_metadata_merge.json'
ERAS=[
('early','https://www.aoml.noaa.gov/ftp/pub/hrd/data/radar/level3/tc_radar_v3m_1997_2019_xy_rel_merge_ships.nc',0,'ed66d0a3aa42ce6fca27cedc5b6c2ee26893db97a04eb4e57d6808c126327bef'),
('recent','https://www.aoml.noaa.gov/ftp/pub/hrd/data/radar/level3/tc_radar_v3m_2020_2024_xy_rel_merge_ships.nc',215,'55185569e94d4261c9f90eb4abd45ec6ff877cba5f01ca169f104119a51ff712')]
RAW=['r1','r2','r3','r4','r5']; SCO=[x+'s' for x in RAW]
BASE=['vmax0','pres0','dvprev','shear0','sst0','rhlo0','mpi0']

def clean(x):
    try:x=float(x)
    except:return np.nan
    return x if np.isfinite(x) and abs(x)<9000 else np.nan

def a(x):
    if np.ma.isMaskedArray(x):x=x.filled(np.nan)
    x=np.asarray(x,dtype=float); x[(~np.isfinite(x))|(np.abs(x)>=9000)]=np.nan; return x

def getjson(url):
    q=urllib.request.Request(url,headers={'User-Agent':'UCIC-raw-TC-RADAR/1.0'})
    with urllib.request.urlopen(q,timeout=120) as r:return json.loads(r.read())

def dl(url,path):
    h=hashlib.sha256(); n=0; t=time.time(); q=urllib.request.Request(url,headers={'User-Agent':'UCIC-raw-TC-RADAR/1.0'})
    with urllib.request.urlopen(q,timeout=180) as r,path.open('wb') as f:
        while True:
            b=r.read(8*1024*1024)
            if not b:break
            f.write(b); h.update(b); n+=len(b)
    return {'bytes':n,'sha256':h.hexdigest(),'seconds':round(time.time()-t,3)}

def near(v,t):
    v=np.asarray(v,float); m=np.isfinite(v); ii=np.flatnonzero(m); return int(ii[np.argmin(abs(v[m]-t))])

def ann(x,rad,edges,pos=False):
    x=a(x); x=np.where(x>0,x,0) if pos else x; z=[]
    for lo,hi in zip(edges[:-1],edges[1:]):
        m=(rad>=lo)&(rad<hi)&np.isfinite(x); z.append(np.nanmean(x[m]) if m.any() else np.nan)
    return np.asarray(z,float)

def corr(x,y):
    m=np.isfinite(x)&np.isfinite(y)
    if m.sum()<4 or np.std(x[m])==0 or np.std(y[m])==0:return np.nan
    return float(np.corrcoef(x[m],y[m])[0,1])

def cos(x,y):
    m=np.isfinite(x)&np.isfinite(y)
    if m.sum()<3:return np.nan
    x=x[m];y=y[m];d=np.linalg.norm(x)*np.linalg.norm(y)
    return float(x@y/d) if d else np.nan

def meanmask(x,m):
    x=a(x); q=m&np.isfinite(x); return float(np.mean(x[q])) if q.any() else np.nan

def pct(train,x,high=True):
    tr=np.sort(np.asarray(train,float));tr=tr[np.isfinite(tr)]; x=np.asarray(x,float); out=np.full(len(x),np.nan);m=np.isfinite(x)
    if len(tr):
        p=np.searchsorted(tr,x[m],side='right')/len(tr);out[m]=p if high else 1-p
    return out

def model(train,test,cols):
    m=make_pipeline(StandardScaler(),LogisticRegression(C=1,penalty='l2',solver='liblinear',random_state=SEED,max_iter=4000));m.fit(train[cols],train.ri);return m.predict_proba(test[cols])[:,1]

def met(y,p):return {'roc_auc':float(roc_auc_score(y,p)),'average_precision':float(average_precision_score(y,p)),'brier':float(brier_score_loss(y,p))}

def bootstrap(test,preds):
    rng=np.random.default_rng(SEED);storms=np.array(sorted(test.storm_id.unique()));pos={s:np.flatnonzero(test.storm_id.to_numpy()==s) for s in storms};y=test.ri.to_numpy(int);res={k:[] for k in preds if k!='BASE'}
    for _ in range(2000):
        idx=np.concatenate([pos[s] for s in rng.choice(storms,len(storms),replace=True)]);yy=y[idx]
        if np.unique(yy).size<2:continue
        b=roc_auc_score(yy,preds['BASE'][idx])
        for k in res:res[k].append(roc_auc_score(yy,preds[k][idx])-b)
    return {k+'_minus_BASE':{'n':len(v),'median':float(np.median(v)),'ci95':[float(np.quantile(v,.025)),float(np.quantile(v,.975))]} for k,v in res.items() if v}

def process(name,url,off,sha,meta,tmp):
    path=tmp/(name+'.nc'); receipt=dl(url,path)
    if receipt['sha256']!=sha:raise RuntimeError('SOURCE_HASH_MISMATCH_'+name)
    rows=[]
    with Dataset(path) as ds:
        l=a(ds['ships_lag_times'][:]);li={h:near(l,h) for h in (-24,0,24)};hv=a(ds['height'][:]);scale=1000 if np.nanmax(abs(hv))>100 else 1;hi={h:near(hv,h*scale) for h in (2,4,6,8,10)}
        n=a(ds['northward_distance'][:]);e=a(ds['eastward_distance'][:]);yy,xx=np.meshgrid(n,e,indexing='ij');rad=np.sqrt(xx*xx+yy*yy);rad/=1000 if np.nanmax(rad)>1000 else 1;inner=rad<=100
        tv=ds['recentered_tangential_wind'];vv=ds['recentered_relative_vorticity'];dv=ds['recentered_divergence'];rv=ds['recentered_reflectivity'];tilt=ds['tc_tilt_magnitude'];rmw=ds['tc_rmw'];vmax=ds['vmax_ships'];pres=ds['pres_ships'];sst=ds['sst_ships'];rhlo=ds['rhlo_ships'];mpi=ds['mpi_ships'];shear=ds['shdc_ships'] if 'shdc_ships' in ds.variables else ds['shgc_ships']
        for i in range(len(ds.dimensions['num_cases'])):
            g=off+i;m=meta.get(g,{});year=m.get('year')
            if year is None or not 2004<=int(year)<=2024:continue
            year=int(year);v0=clean(vmax[i,li[0]]);vm=clean(vmax[i,li[-24]]);vp=clean(vmax[i,li[24]])
            t8=clean(tilt[i,hi[8]]);w2=clean(rmw[i,hi[2]]);r1=t8/max(w2,10) if np.isfinite(t8) and np.isfinite(w2) else np.nan
            b=ann(tv[i,:,:,hi[2]],rad,np.arange(0,165,15));r2=np.nanmedian([corr(b,ann(tv[i,:,:,hi[h]],rad,np.arange(0,165,15))) for h in (4,6,8)])
            b=ann(vv[i,:,:,hi[2]],rad,np.arange(0,120,20),True);r3=np.nanmedian([cos(b,ann(vv[i,:,:,hi[h]],rad,np.arange(0,120,20),True)) for h in (4,6,8)])
            low=np.nanmean([meanmask(dv[i,:,:,hi[h]],inner) for h in (2,4)]);up=np.nanmean([meanmask(dv[i,:,:,hi[h]],inner) for h in (8,10)]);r4=min(-low,up) if np.isfinite(low) and np.isfinite(up) else np.nan
            z=a(rv[i,:,:,hi[2]]);lm=inner&np.isfinite(z)&(z>=20);q=[]
            for h in (6,8):
                u=a(rv[i,:,:,hi[h]]);mm=lm&np.isfinite(u);q.append(np.mean(u[mm]>=20) if mm.any() else np.nan)
            r5=np.nanmean(q) if lm.any() else np.nan
            dt=m.get('datetime');storm=f"{year}_{m.get('storm_name','UNKNOWN')}"
            rows.append({'case_index':g,'year':year,'storm_id':storm,'datetime':dt,'vmax0':v0,'pres0':clean(pres[i,li[0]]),'dvprev':v0-vm if np.isfinite(v0) and np.isfinite(vm) else np.nan,'shear0':clean(shear[i,li[0]]),'sst0':clean(sst[i,li[0]]),'rhlo0':clean(rhlo[i,li[0]]),'mpi0':clean(mpi[i,li[0]]),'future':vp-v0 if np.isfinite(vp) and np.isfinite(v0) else np.nan,'ri':int(vp-v0>=30) if np.isfinite(vp) and np.isfinite(v0) else np.nan,'r1':r1,'r2':r2,'r3':r3,'r4':r4,'r5':r5})
            if (i+1)%25==0:print(name,i+1,flush=True)
    path.unlink(missing_ok=True);return rows,receipt

def main():
    mo=getjson(META);meta={int(x['case_index']):x for x in mo['cases']};tmp=Path(os.environ.get('RUNNER_TEMP','/tmp'))/'rawtc';tmp.mkdir(exist_ok=True);rows=[];rec=[]
    for e in ERAS:
        x,r=process(*e,meta,tmp);rows+=x;rec.append({'era':e[0],**r})
    d=pd.DataFrame(rows);cal=d.year<=2018
    dirs=[False,True,True,True,True]
    for r,s,h in zip(RAW,SCO,dirs):d[s]=pct(d.loc[cal,r],d[r],h)
    d['C_t']=d[SCO].min(axis=1,skipna=False);d['A_t']=d[SCO].mean(axis=1,skipna=False);d['dt']=pd.to_datetime(d.datetime,errors='coerce');d=d.sort_values(['storm_id','dt','case_index']).reset_index(drop=True);d['M_t']=np.nan;d['dA_t']=np.nan
    for s in SCO:d[s+'d']=np.nan
    for _,g in d.groupby('storm_id',sort=False):
        ix=list(g.index)
        for k in range(1,len(ix)):
            i,j=ix[k],ix[k-1]
            if pd.isna(d.at[i,'dt']) or pd.isna(d.at[j,'dt']):continue
            h=(d.at[i,'dt']-d.at[j,'dt']).total_seconds()/3600
            if 6<=h<=36 and np.isfinite(d.at[i,'C_t']) and np.isfinite(d.at[j,'C_t']):
                d.at[i,'M_t']=d.at[i,'C_t']-d.at[j,'C_t'];d.at[i,'dA_t']=d.at[i,'A_t']-d.at[j,'A_t']
                for s in SCO:d.at[i,s+'d']=d.at[i,s]-d.at[j,s]
    dels=[s+'d' for s in SCO];need=BASE+SCO+dels+['C_t','M_t','A_t','dA_t','ri'];p=d.dropna(subset=need);tr=p[p.year<=2018];te=p[p.year>=2019].reset_index(drop=True)
    out={'operation':PROTO['operation'],'protocol_sha256':hashlib.sha256(P.read_bytes()).hexdigest(),'source_receipts':rec,'raw_rows':len(d),'primary_rows':len(p),'calibration_rows':len(tr),'holdout_rows':len(te),'calibration_storms':tr.storm_id.nunique(),'holdout_storms':te.storm_id.nunique(),'calibration_ri':int(tr.ri.sum()) if len(tr) else 0,'holdout_ri':int(te.ri.sum()) if len(te) else 0,'claim_ceiling':PROTO['claim_ceiling']}
    if len(te)<10 or tr.ri.nunique()<2 or te.ri.nunique()<2:
        out['terminal_disposition']='RAW_TC_RADAR_MECHANISTIC_UNEVALUABLE';F.write_text(d.to_csv(index=False));O.write_text(json.dumps(out,indent=2,sort_keys=True)+'\n');print(json.dumps(out,indent=2));return
    cols={'BASE':BASE,'STRUCTURAL_NONCOMP':['C_t','M_t'],'STRUCTURAL_ADDITIVE':['A_t','dA_t'],'STRUCTURAL_COMPONENT':SCO+dels,'COMBINED_NONCOMP':BASE+['C_t','M_t'],'COMBINED_ADDITIVE':BASE+['A_t','dA_t'],'COMBINED_COMPONENT':BASE+SCO+dels};pred={k:model(tr,te,v) for k,v in cols.items()};mets={k:met(te.ri,v) for k,v in pred.items()};out['models']=mets;out['primary_incremental_auc']=mets['COMBINED_NONCOMP']['roc_auc']-mets['BASE']['roc_auc'];out['noncomp_minus_additive_auc']=mets['COMBINED_NONCOMP']['roc_auc']-mets['COMBINED_ADDITIVE']['roc_auc'];out['noncomp_minus_component_auc']=mets['COMBINED_NONCOMP']['roc_auc']-mets['COMBINED_COMPONENT']['roc_auc'];out['bootstrap']=bootstrap(te,pred)
    c=d.dropna(subset=BASE+SCO+['C_t','A_t','ri']);ct=c[c.year<=2018];ce=c[c.year>=2019]
    if len(ct)>=10 and len(ce)>=10 and ct.ri.nunique()==2 and ce.ri.nunique()==2:out['C_t_only']=met(ce.ri,model(ct,ce,['C_t']));out['A_t_only']=met(ce.ri,model(ct,ce,['A_t']));out['C_t_holdout_rows']=len(ce);out['C_t_holdout_ri']=int(ce.ri.sum())
    inc=out['primary_incremental_auc'];lo=out['bootstrap']['COMBINED_NONCOMP_minus_BASE']['ci95'][0];non=mets['COMBINED_NONCOMP']['roc_auc'];add=mets['COMBINED_ADDITIVE']['roc_auc'];comp=mets['COMBINED_COMPONENT']['roc_auc']
    if inc<=0:disp='RAW_TC_RADAR_MECHANISTIC_NOT_SUPPORTED'
    elif lo<=0:disp='RAW_TC_RADAR_SIGNAL_PRESENT_INCONCLUSIVE'
    elif max(add,comp)>non:disp='STRUCTURAL_SIGNAL_PRESENT_NONCOMPENSATORY_SPECIFICITY_NOT_SUPPORTED'
    else:disp='RAW_TC_RADAR_MECHANISTIC_SUPPORTED_WITH_LIMITATIONS'
    out['terminal_disposition']=disp;F.write_text(d.to_csv(index=False));O.write_text(json.dumps(out,indent=2,sort_keys=True)+'\n');print(json.dumps(out,indent=2,sort_keys=True))
if __name__=='__main__':main()
