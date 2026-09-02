#!/usr/bin/env python3
import io, json, re, requests
import pandas as pd
from urllib.parse import quote

BASE='https://raw.githubusercontent.com/joshevanbarker/Call_Report_Data_Project/main/FFIEC%20CDR%20Call%20Data/'
YEARS=[2019,2020,2021,2022,2023]
PATTERNS={
 'asset':[r'total assets'],
 'equity':[r'total equity capital',r'equity capital'],
 'tier1':[r'tier 1 capital',r'tier one capital'],
 'rwa':[r'risk-weighted assets',r'risk weighted assets'],
 'noncurrent':[r'noncurrent loans',r'past due 90',r'nonaccrual'],
 'gross_loans':[r'total loans and leases',r'loans and leases.*gross'],
 'net_loans':[r'loans and leases.*net',r'net loans and leases'],
 'deposits':[r'total deposits'],
 'net_income':[r'net income'],
 'roa':[r'return on assets',r'average assets']
}

def match(desc):
    s=str(desc).lower()
    hits=[]
    for k, pats in PATTERNS.items():
        if any(re.search(p,s) for p in pats): hits.append(k)
    return hits

out={'source_repo':'joshevanbarker/Call_Report_Data_Project','years':{}}
for year in YEARS:
  y=[]
  for half in (1,2):
    name=f'FFIEC CDR Call Subset of Schedules {year}({half} of 2).txt'
    url=BASE+quote(name, safe='()%20')
    # quote() above may double-escape; use direct replacement fallback
    url=BASE+name.replace(' ','%20')
    r=requests.get(url,timeout=180)
    r.raise_for_status()
    # Parse only header + description row. These files are tab-delimited and row 1 is MDRM description.
    df=pd.read_csv(io.BytesIO(r.content),sep='\t',nrows=1,dtype=str,low_memory=False)
    row=df.iloc[0]
    matches=[]
    for col in df.columns:
      desc=row.get(col,'')
      hits=match(desc)
      if hits:
        matches.append({'column':col,'description':str(desc),'hits':hits})
    y.append({'file':name,'bytes':len(r.content),'columns':len(df.columns),'matches':matches})
  out['years'][str(year)]=y
with open('post2020_schema_audit.json','w') as f: json.dump(out,f,indent=2)
print(json.dumps(out,indent=2)[:60000])
