#!/usr/bin/env python3
"""Reconstruct HOSPITAL_MEASURE_LEVEL_IMI_ROBUSTNESS_EXTENSION_1B outputs.

Uses only the Python standard library. It validates the exact source SHA-256 by
default, builds hospital-level route results, coverage summaries, sensitivity
results, and hidden-collapse examples.
"""
from __future__ import annotations
import argparse, csv, hashlib, math, statistics
from collections import defaultdict
from pathlib import Path

EXPECTED_SHA256 = "0ba1b358e54e8812c9d1cf72c37f715b7bfeb3da12009bb6705158f0d15f91b5"
MORT = ["MORT_30_AMI","MORT_30_CABG","MORT_30_COPD","MORT_30_HF","MORT_30_PN","MORT_30_STK"]
SAFETY = ["COMP_HIP_KNEE","PSI_03","PSI_06","PSI_08","PSI_09","PSI_10","PSI_11","PSI_12","PSI_13","PSI_14","PSI_15"]
ROUTES = {
  "BASE_NONOVERLAPPING": (MORT, SAFETY),
  "PSI04_TO_MORT": (MORT+["PSI_04"], SAFETY),
  "PSI04_TO_SAFETY": (MORT, SAFETY+["PSI_04"]),
  "PSI90_INCLUDED": (MORT, SAFETY+["PSI_90"]),
  "ALL_SENSITIVITY": (MORT+["PSI_04"], SAFETY+["PSI_90"]),
}
THRESHOLDS = [("ANY_COMPARABLE",0.0),("AT_LEAST_50_PERCENT",0.5),("AT_LEAST_75_PERCENT",0.75),("ALL_REQUIRED",1.0)]
META = ["Facility ID","Facility Name","Address","City/Town","State","ZIP Code","County/Parish","Telephone Number"]

def sha256(p):
  h=hashlib.sha256()
  with open(p,'rb') as f:
    for b in iter(lambda:f.read(1<<20),b''): h.update(b)
  return h.hexdigest()

def norm(s): return ' '.join((s or '').strip().lower().replace('_',' ').split())
def comparable(v):
  x=norm(v)
  return ('better' in x) or ('worse' in x) or ('no different' in x) or x in {'same','better','worse'}
def worse(v): return 'worse' in norm(v)
def mean(xs): return sum(xs)/len(xs) if xs else math.nan

def ranks(xs):
  order=sorted(range(len(xs)), key=lambda i: xs[i]); out=[0.0]*len(xs); i=0
  while i<len(order):
    j=i+1
    while j<len(order) and xs[order[j]]==xs[order[i]]: j+=1
    r=(i+j-1)/2+1
    for k in range(i,j): out[order[k]]=r
    i=j
  return out

def pearson(x,y):
  if len(x)<2:return math.nan
  mx,my=mean(x),mean(y); dx=[a-mx for a in x]; dy=[b-my for b in y]
  den=math.sqrt(sum(a*a for a in dx)*sum(b*b for b in dy))
  return sum(a*b for a,b in zip(dx,dy))/den if den else math.nan

def quantile(xs,q):
  ys=sorted(xs); pos=(len(ys)-1)*q; lo=math.floor(pos); hi=math.ceil(pos)
  return ys[lo] if lo==hi else ys[lo]+(ys[hi]-ys[lo])*(pos-lo)

def load(path):
  with open(path,newline='',encoding='utf-8-sig') as f:
    rows=list(csv.DictReader(f))
  grouped=defaultdict(list)
  for r in rows: grouped[r['Facility ID']].append(r)
  return rows,grouped

def build(grouped, route, mort_ids, safety_ids):
  out=[]
  for fid, rows in grouped.items():
    meta={k:rows[0].get(k,'') for k in META}; by={r['Measure ID']:r for r in rows}
    vals={}
    for label, ids in [('MORT',mort_ids),('SAFETY',safety_ids)]:
      rr=[by[i] for i in ids if i in by and comparable(by[i].get('Compared to National',''))]
      nw=sum(not worse(r.get('Compared to National','')) for r in rr); wc=sum(worse(r.get('Compared to National','')) for r in rr)
      vals[label]=(len(ids),len(rr),wc,nw,len(rr)/len(ids),nw/len(rr) if rr else None)
    mr,mc,mw,mn,mcover,ma=vals['MORT']; sr,sc,sw,sn,scover,sa=vals['SAFETY']
    numeric=ma is not None and sa is not None
    imi=ma*sa if numeric else None; total=mc+sc
    add=(mn+sn)/total if total else None
    rec={**meta,'MORT_required':mr,'MORT_comparable':mc,'MORT_worse':mw,'MORT_nonworse':mn,'MORT_coverage':mcover,'a_MORT':ma,
      'SAFETY_required':sr,'SAFETY_comparable':sc,'SAFETY_worse':sw,'SAFETY_nonworse':sn,'SAFETY_coverage':scover,'a_SAFETY':sa,
      'IMI':imi,'CS':1-imi if numeric else None,'weakest_factor':min(ma,sa) if numeric else None,'hard_collapse':bool(numeric and (ma==0 or sa==0)),
      'additive_nonworse':add,'total_comparable':total,'overall_coverage':total/(mr+sr),'route':route}
    for name,t in THRESHOLDS:
      ok=numeric and ((mc>=1 and sc>=1) if name=='ANY_COMPARABLE' else (mcover>=t and scover>=t))
      rec['state_'+name]='NUMERIC' if ok else 'UNEVALUABLE'
    out.append(rec)
  return out

def write_csv(path, rows, fields):
  with open(path,'w',newline='',encoding='utf-8') as f:
    w=csv.DictWriter(f,fieldnames=fields);w.writeheader();w.writerows(rows)

def main():
  ap=argparse.ArgumentParser();ap.add_argument('source');ap.add_argument('--out',default='extension_1b_outputs');ap.add_argument('--skip-hash-check',action='store_true');a=ap.parse_args()
  src=Path(a.source); out=Path(a.out); out.mkdir(parents=True,exist_ok=True)
  digest=sha256(src)
  if not a.skip_hash_check and digest!=EXPECTED_SHA256: raise SystemExit(f'Source hash mismatch: {digest}')
  raw,grouped=load(src); all_results={}
  for route,(m,s) in ROUTES.items(): all_results[route]=build(grouped,route,m,s)
  base=all_results['BASE_NONOVERLAPPING']; fields=list(base[0])
  write_csv(out/'IMI_Hospital_Level_Results.csv',base,fields)
  summary=[]
  for idx,(name,t) in enumerate(THRESHOLDS):
    nums=[r for r in base if r['state_'+name]=='NUMERIC']; xs=[r['IMI'] for r in nums]
    summary.append({'index':idx,'threshold':name,'evaluatable':len(nums),'unevaluable':len(base)-len(nums),'percent_evaluatable':100*len(nums)/len(base),
      'mean_IMI':mean(xs),'sd_IMI':statistics.stdev(xs) if len(xs)>1 else 0,'variance_IMI':statistics.variance(xs) if len(xs)>1 else 0,
      'minimum_IMI':min(xs),'q1_IMI':quantile(xs,.25),'median_IMI':quantile(xs,.5),'q3_IMI':quantile(xs,.75),'maximum_IMI':max(xs),
      'exact_IMI_1':sum(x==1 for x in xs),'exact_IMI_1_percent':100*sum(x==1 for x in xs)/len(xs),'hard_collapse_count':sum(r['hard_collapse'] for r in nums),
      'any_worse_count':sum((r['MORT_worse']+r['SAFETY_worse'])>0 for r in nums),'unique_IMI_scores':len(set(xs))})
  write_csv(out/'IMI_Hospital_Robustness_Summary.csv',summary,list(summary[0]))
  collapses=[r for r in base if r['state_ANY_COMPARABLE']=='NUMERIC' and r['hard_collapse']]
  write_csv(out/'IMI_Additive_Hidden_Collapse_Examples.csv',collapses,fields)
  sens=[]; base_by={r['Facility ID']:r for r in base if r['state_ANY_COMPARABLE']=='NUMERIC'}
  for route,rows in all_results.items():
    for name,t in THRESHOLDS:
      nums=[r for r in rows if r['state_'+name]=='NUMERIC']; xs=[r['IMI'] for r in nums]
      rec={'route':route,'threshold':name,'evaluatable':len(nums),'mean_IMI':mean(xs),'median_IMI':quantile(xs,.5),'exact_IMI_1_percent':100*sum(x==1 for x in xs)/len(xs),'hard_collapse_count':sum(r['hard_collapse'] for r in nums)}
      if route!='BASE_NONOVERLAPPING':
        rb={r['Facility ID']:r for r in rows if r['state_ANY_COMPARABLE']=='NUMERIC'}; ids=sorted(set(base_by)&set(rb)); d=[rb[i]['IMI']-base_by[i]['IMI'] for i in ids]
        rec.update({'variant':route,'common_numeric_hospitals':len(ids),'changed_score_count':sum(abs(x)>1e-12 for x in d),'changed_score_percent':100*sum(abs(x)>1e-12 for x in d)/len(ids),
          'mean_delta':mean(d),'mean_absolute_delta':mean([abs(x) for x in d]),'maximum_absolute_delta':max(abs(x) for x in d),
          'spearman_rank_correlation':pearson(ranks([base_by[i]['IMI'] for i in ids]),ranks([rb[i]['IMI'] for i in ids])),
          'lowered_count':sum(x< -1e-12 for x in d),'raised_count':sum(x>1e-12 for x in d)})
      sens.append(rec)
  sf=[]
  for r in sens:
    for k in ['route','threshold','evaluatable','mean_IMI','median_IMI','exact_IMI_1_percent','hard_collapse_count','variant','common_numeric_hospitals','changed_score_count','changed_score_percent','mean_delta','mean_absolute_delta','maximum_absolute_delta','spearman_rank_correlation','lowered_count','raised_count']:
      r.setdefault(k,'')
  write_csv(out/'IMI_Hospital_Sensitivity_Results.csv',sens,list(sens[0]))
  print(f'PASS: {len(raw)} source rows, {len(grouped)} hospitals, {len(collapses)} collapse examples')
if __name__=='__main__': main()
