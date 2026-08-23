#!/usr/bin/env python3
import io, json, os, zipfile, requests, pandas as pd
URLS={
 'balance':'https://www.newyorkfed.org/medialibrary/media/research/banking_research/balance-sheets-income-statements/call-reports-balance-sheets-Jan2026',
 'income':'https://www.newyorkfed.org/medialibrary/media/research/banking_research/balance-sheets-income-statements/call-reports-income-statements-Jan2026',
 'dictionary':'https://www.newyorkfed.org/medialibrary/media/research/banking_research/balance-sheets-income-statements/historical_call_data_dictionary'
}
out={'source':'Federal Reserve Bank of New York 1959-2025 time-consistent Call Reports','urls':URLS}
os.makedirs('nyfed_audit',exist_ok=True)
for k,u in URLS.items():
    r=requests.get(u,timeout=300); r.raise_for_status()
    out[k]={'bytes':len(r.content),'content_type':r.headers.get('content-type')}
    if k=='dictionary':
        p='nyfed_audit/dictionary.xlsx'; open(p,'wb').write(r.content)
        xl=pd.ExcelFile(p)
        out[k]['sheets']=xl.sheet_names
        hits=[]
        for s in xl.sheet_names:
            df=pd.read_excel(p,sheet_name=s,dtype=str)
            txt=df.fillna('').astype(str).agg(' | '.join,axis=1)
            mask=txt.str.contains('tier 1|risk.weight|total assets|equity capital|nonaccr|past due 90|loans and leases|total deposits|net income|average assets|return on assets',case=False,regex=True)
            for i,row in df[mask].head(200).iterrows():
                hits.append({'sheet':s,'row':int(i),'values':[str(x) for x in row.tolist()]})
        out[k]['hits']=hits
    else:
        p=f'nyfed_audit/{k}.zip'; open(p,'wb').write(r.content)
        z=zipfile.ZipFile(io.BytesIO(r.content)); out[k]['members']=z.namelist()
        for m in z.namelist():
            if m.lower().endswith('.dta'):
                ep='nyfed_audit/'+os.path.basename(m); open(ep,'wb').write(z.read(m))
                reader=pd.io.stata.StataReader(ep)
                labels=reader.variable_labels()
                cols=list(reader.varlist)
                matches=[]
                for c in cols:
                    s=(c+' '+str(labels.get(c,''))).lower()
                    if any(t in s for t in ['tier 1','risk-weight','risk weight','total asset','equity','nonaccr','past due','loan','deposit','net income','average asset','return on asset']):
                        matches.append({'column':c,'label':labels.get(c,'')})
                out[k]['stata_file']=m; out[k]['columns']=len(cols); out[k]['matches']=matches[:500]
with open('nyfed_schema_audit.json','w') as f: json.dump(out,f,indent=2)
print(json.dumps(out,indent=2)[:120000])
