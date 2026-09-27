#!/usr/bin/env python3
import io, json, os, zipfile, requests, pandas as pd
URLS={
 'balance':'https://www.newyorkfed.org/medialibrary/media/research/banking_research/balance-sheets-income-statements/call-reports-balance-sheets-Jan2026',
 'income':'https://www.newyorkfed.org/medialibrary/media/research/banking_research/balance-sheets-income-statements/call-reports-income-statements-Jan2026',
 'dictionary':'https://www.newyorkfed.org/medialibrary/media/research/banking_research/balance-sheets-income-statements/historical_call_data_dictionary'
}
TERMS=['tier 1','tier one','risk-weight','risk weight','total asset','equity capital','equity','nonaccr','past due 90','loan','deposit','net income','average asset','return on asset','roa']
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
            mask=txt.str.contains('|'.join(t.replace(' ','[ _-]?') for t in TERMS),case=False,regex=True)
            for i,row in df[mask].head(500).iterrows():
                hits.append({'sheet':s,'row':int(i),'values':[str(x) for x in row.tolist()]})
        out[k]['hits']=hits
    else:
        p=f'nyfed_audit/{k}.zip'; open(p,'wb').write(r.content)
        z=zipfile.ZipFile(io.BytesIO(r.content)); out[k]['members']=z.namelist()
        stata=[]
        for m in z.namelist():
            if m.lower().endswith('.dta'):
                ep='nyfed_audit/'+os.path.basename(m); open(ep,'wb').write(z.read(m))
                reader=pd.io.stata.StataReader(ep)
                labels=reader.variable_labels()
                cols=list(labels.keys())
                matches=[]
                for c in cols:
                    s=(c+' '+str(labels.get(c,''))).lower()
                    if any(t in s for t in TERMS):
                        matches.append({'column':c,'label':labels.get(c,'')})
                stata.append({'file':m,'columns':len(cols),'matches':matches[:1000]})
        out[k]['stata']=stata
with open('nyfed_schema_audit_v2.json','w') as f: json.dump(out,f,indent=2)
print(json.dumps(out,indent=2)[:180000])
