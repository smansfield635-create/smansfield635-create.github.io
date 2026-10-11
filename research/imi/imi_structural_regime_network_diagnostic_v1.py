#!/usr/bin/env python3
import json, time
from pathlib import Path
import requests

STATES=['KS','OR','PA','OH','FL']
YEARS=list(range(2018,2026))
BASE='https://echo.epa.gov/files/echodownloads/NPDES_by_state_year/{s}_FY{y}_NPDES_DMRS_LIMITS.zip'
UA={'User-Agent':'Mozilla/5.0 wastewater-research-diagnostic/1.0'}

def probe(s,y):
    url=BASE.format(s=s,y=y)
    t=time.time()
    try:
        r=requests.get(url,headers=UA,stream=True,timeout=(10,20))
        elapsed=time.time()-t
        return {'state':s,'year':y,'ok':r.ok,'status':r.status_code,'elapsed_sec':elapsed,'content_length':r.headers.get('content-length'),'content_type':r.headers.get('content-type')}
    except Exception as e:
        return {'state':s,'year':y,'ok':False,'elapsed_sec':time.time()-t,'error':repr(e)}

rows=[]
for s in STATES:
    for y in YEARS:
        row=probe(s,y); rows.append(row); print(json.dumps(row),flush=True)
summary={'rows':rows,'failures':[r for r in rows if not r.get('ok')],'slow':[r for r in rows if r.get('elapsed_sec',0)>5]}
Path('imi_structural_regime_network_diagnostic_v1.json').write_text(json.dumps(summary,indent=2))
print(json.dumps({'n':len(rows),'failures':len(summary['failures']),'slow':len(summary['slow'])},indent=2),flush=True)
