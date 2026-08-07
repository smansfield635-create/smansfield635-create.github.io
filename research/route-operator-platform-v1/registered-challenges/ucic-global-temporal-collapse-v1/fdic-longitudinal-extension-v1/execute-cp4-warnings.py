#!/usr/bin/env python3
import json
import pathlib
import statistics
from datetime import datetime, timezone

ROOT=pathlib.Path(__file__).resolve().parent
CP1=json.load((ROOT/'checkpoint-1-protocol-freeze.v1.json').open())
CP2=json.load((ROOT/'checkpoint-2-failure-source-extraction.v1.json').open())
CP4OPS=json.load((ROOT/'checkpoint-4-operationalization-freeze.v1.json').open())
OUT=ROOT/'checkpoint-4-warning-execution.v1.json'
if CP1.get('status')!='PASS_CLOSED': raise SystemExit('CP1_NOT_CLOSED')
if CP2.get('status')!='PASS_CLOSED': raise SystemExit('CP2_NOT_CLOSED')
if CP4OPS.get('status')!='PASS_CLOSED': raise SystemExit('CP4_OPS_NOT_CLOSED')


def dkey(v): return str(v or '').replace('-','')[:8]
def pdate(v): return datetime.strptime(dkey(v),'%Y%m%d').date()
def num(v):
    try:
        if v is None: return None
        return float(v)
    except Exception: return None

def avg_tie_rank(values,current,higher_healthier=True):
    vals=[float(x) for x in values]
    ordered=sorted(vals, reverse=not higher_healthier)
    positions=[i+1 for i,v in enumerate(ordered) if v==float(current)]
    if not positions: raise ValueError('CURRENT_NOT_IN_WINDOW')
    return sum(positions)/len(positions)

def factor_rows(rows):
    rows=sorted(rows,key=lambda r:dkey(r.get('REPDTE')))
    base=[]
    prev_dep=None
    for r in rows:
        asset=num(r.get('ASSET')); dep=num(r.get('DEP')); eq=num(r.get('EQ')); loans=num(r.get('LNLSNET')); roa=num(r.get('ROA')); nimy=num(r.get('NIMY'))
        factors={
            'CAPITAL_CUSHION': (eq/asset if asset not in (None,0) and eq is not None else None),
            'LOAN_FUNDING_STRAIN': (loans/dep if dep not in (None,0) and loans is not None else None),
            'EARNINGS_CAPACITY': roa,
            'MARGIN_CAPACITY': nimy,
            'DEPOSIT_CONTINUITY': ((dep/prev_dep)-1 if dep is not None and prev_dep not in (None,0) else None),
        }
        base.append({'report_date':dkey(r.get('REPDTE')),'factors':factors})
        if dep is not None: prev_dep=dep
    orientations={
        'CAPITAL_CUSHION':True,
        'LOAN_FUNDING_STRAIN':False,
        'EARNINGS_CAPACITY':True,
        'MARGIN_CAPACITY':True,
        'DEPOSIT_CONTINUITY':True,
    }
    histories={k:[] for k in orientations}
    result=[]
    prev_two_imp=False
    for item in base:
        ranks={}; impaired={}
        for k,higher in orientations.items():
            value=item['factors'][k]
            if value is not None:
                histories[k].append(value)
                if len(histories[k])>=9:
                    window=histories[k][-9:]
                    rank=avg_tie_rank(window,value,higher)
                    ranks[k]=rank
                    impaired[k]=bool(rank<=2.0)
                else:
                    ranks[k]=None; impaired[k]=None
            else:
                ranks[k]=None; impaired[k]=None
        evaluable_count=sum(v is not None for v in ranks.values())
        impaired_count=sum(v is True for v in impaired.values())
        warning_evaluable=evaluable_count>=2
        two_imp=warning_evaluable and impaired_count>=2
        acute=warning_evaluable and impaired_count>=3
        persistent=bool(two_imp and prev_two_imp)
        warning=bool(acute or persistent)
        result.append({
            'report_date':item['report_date'],
            'factor_values':item['factors'],
            'health_ranks_1_to_9':ranks,
            'factor_impaired':impaired,
            'evaluable_factor_count':evaluable_count,
            'impaired_factor_count':impaired_count,
            'warning_evaluable':warning_evaluable,
            'acute_warning':acute,
            'persistent_warning':persistent,
            'ucic_warning':warning,
        })
        prev_two_imp=two_imp
    return result

summaries=[]
for rec in CP2['records']:
    cert=int(rec['cert']); faildate=datetime.strptime(rec['faildate'],'%Y-%m-%d').date()
    q=factor_rows(rec['rows'])
    pre=[x for x in q if pdate(x['report_date'])<faildate]
    evaluable=any(x['warning_evaluable'] for x in pre)
    warned=[x for x in pre if x['ucic_warning']]
    first=min(warned,key=lambda x:x['report_date']) if warned else None
    lead=(faildate-pdate(first['report_date'])).days if first else None
    summaries.append({
        'cert':cert,'name':rec['name'],'faildate':rec['faildate'],'evaluable':evaluable,
        'first_warning_date':first['report_date'] if first else None,
        'lead_days':lead,
        'detected_pre_failure':bool(first and lead>0),
        'actionable_30d':bool(first and lead>=30),
        'early_90d':bool(first and lead>=90),
        'quarter_states':q,
    })

evaluable=[x for x in summaries if x['evaluable']]
detected=[x for x in evaluable if x['detected_pre_failure']]
leads=[x['lead_days'] for x in detected]
metrics={
    'evaluable_failed_banks':len(evaluable),
    'pre_failure_detections':len(detected),
    'sensitivity':(len(detected)/len(evaluable) if evaluable else None),
    'actionable_30d_detections':sum(x['actionable_30d'] for x in evaluable),
    'early_90d_detections':sum(x['early_90d'] for x in evaluable),
    'median_lead_days_detected':statistics.median(leads) if leads else None,
}
t=CP1['continuation_thresholds']
gates={
    'minimum_evaluable_failures':metrics['evaluable_failed_banks']>=t['minimum_evaluable_failures'],
    'minimum_ucic_sensitivity':metrics['sensitivity'] is not None and metrics['sensitivity']>=t['minimum_ucic_sensitivity'],
    'minimum_actionable_30d_failures':metrics['actionable_30d_detections']>=t['minimum_actionable_30d_failures'],
    'minimum_median_lead_days':metrics['median_lead_days_detected'] is not None and metrics['median_lead_days_detected']>=t['minimum_median_lead_days'],
}
result={
    'operation':'UCIC_ARM_B_FDIC_LONGITUDINAL_COLLAPSE_EARLY_WARNING_EXTENSION_v1',
    'checkpoint':'CP4_FACTOR_SERIES_AND_WARNING_EXECUTION',
    'generated_at_utc':datetime.now(timezone.utc).isoformat(),
    'status':'PASS_CLOSED',
    'scientific_rule_source':'checkpoint-1-protocol-freeze.v1.json',
    'operationalization_source':'checkpoint-4-operationalization-freeze.v1.json',
    'failed_bank_summaries':summaries,
    'failed_side_metrics':metrics,
    'failed_side_threshold_gates':gates,
    'failed_side_all_thresholds_pass':all(gates.values()),
    'terminal_extension_disposition':'NOT_YET_AUTHORIZED_PENDING_CP5_CONTROLS_AND_COMPARATOR',
    'next_checkpoint':'CP5_COMPARATOR_AND_FALSE_POSITIVE_EXECUTION'
}
OUT.write_text(json.dumps(result,indent=2,sort_keys=True)+'\n')
print(json.dumps({'checkpoint':result['checkpoint'],'status':result['status'],'metrics':metrics,'gates':gates},sort_keys=True))
