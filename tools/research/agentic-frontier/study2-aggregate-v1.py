#!/usr/bin/env python3
import json, pathlib
root=pathlib.Path('study2-artifacts')
files=sorted(root.glob('**/results.jsonl'))
rows=[]
for f in files:
    rows += [json.loads(x) for x in f.read_text().splitlines() if x.strip()]
by_id={r['task_id']:r for r in rows}
if len(rows)!=24 or len(by_id)!=24:
    raise SystemExit(f'STUDY2_AGGREGATION_INCOMPLETE rows={len(rows)} unique={len(by_id)}')
ordered=[by_id[k] for k in sorted(by_id)]
dg=sum(1 for r in ordered if r['diamond_gate']['pass'])
oh=sum(1 for r in ordered if r['openhands']['pass'])
dg_only=sum(1 for r in ordered if r['paired_result']=='DG_ONLY')
oh_only=sum(1 for r in ordered if r['paired_result']=='OH_ONLY')
both=sum(1 for r in ordered if r['paired_result']=='BOTH_PASS')
neither=sum(1 for r in ordered if r['paired_result']=='NEITHER')
strata={}
for r in ordered:
    s=r['stratum']; d=strata.setdefault(s,{'n':0,'dg_pass':0,'oh_pass':0,'dg_only':0,'oh_only':0})
    d['n']+=1; d['dg_pass']+=int(r['diamond_gate']['pass']); d['oh_pass']+=int(r['openhands']['pass'])
    d['dg_only']+=int(r['paired_result']=='DG_ONLY'); d['oh_only']+=int(r['paired_result']=='OH_ONLY')
advantaged=[s for s,d in strata.items() if d['dg_only']>d['oh_only']]
replicated=(dg>oh and len(advantaged)>=2)
summary={
 'schema':'AGENTIC_FRONTIER_STUDY2_AGGREGATE_v1',
 'population':24,'model':'gpt-5-2025-08-07','openhands_version':'1.14.0',
 'diamond_gate_pass':dg,'openhands_pass':oh,
 'dg_only':dg_only,'oh_only':oh_only,'both_pass':both,'neither_pass':neither,
 'strata':strata,'advantaged_strata':advantaged,
 'replication_criterion_met':replicated,
 'claim_ceiling':('STRONG_MODEL_DIRECTIONAL_REPLICATION_SUPPORTED' if replicated else 'STRONG_MODEL_REPLICATION_NOT_ESTABLISHED')
}
out=pathlib.Path('study2-aggregate'); out.mkdir(exist_ok=True)
(out/'study2-results.jsonl').write_text(''.join(json.dumps(r,separators=(',',':'))+'\n' for r in ordered))
(out/'study2-summary.json').write_text(json.dumps(summary,indent=2)+'\n')
lines=['# Agentic Frontier Comparative Study v2 — aggregate','',f'- Population: 24 frozen paired tasks',f'- Model: `gpt-5-2025-08-07`',f'- Diamond Gate verified completions: **{dg}/24**',f'- OpenHands verified completions: **{oh}/24**',f'- Paired outcomes: DG-only {dg_only}; OpenHands-only {oh_only}; both {both}; neither {neither}',f"- Replication criterion met: **{'YES' if replicated else 'NO'}**",f"- Claim ceiling: `{summary['claim_ceiling']}`",'','## Strata']
for s,d in sorted(strata.items()):
    lines.append(f"- {s}: DG {d['dg_pass']}/{d['n']}; OpenHands {d['oh_pass']}/{d['n']}; DG-only {d['dg_only']}; OH-only {d['oh_only']}")
(out/'study2-summary.md').write_text('\n'.join(lines)+'\n')
print(json.dumps(summary,indent=2))
