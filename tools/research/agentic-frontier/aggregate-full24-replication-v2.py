#!/usr/bin/env python3
import collections, json, pathlib

root=pathlib.Path('.')
smoke_files=list((root/'downloaded-smoke').rglob('agentic-frontier-ir01-paired-receipt.json'))
if len(smoke_files)!=1:
    raise SystemExit(f'EXPECTED_ONE_CURRENT_SMOKE_RECEIPT got={len(smoke_files)}')
raw=json.loads(smoke_files[0].read_text())
dg=bool(raw['diamond_gate']['pass']); oh=bool(raw['openhands']['pass'])
paired='BOTH_PASS' if dg and oh else 'DG_ONLY' if dg else 'OH_ONLY' if oh else 'NEITHER'
current={
    'schema':'AGENTIC_FRONTIER_REPLICATION_AF_IR_01_NORMALIZED_v2',
    'task_id':'AF-IR-01',
    'stratum':'IMPLEMENTATION_REPAIR',
    'model':raw.get('model'),
    'openhands_version':raw.get('openhands_version'),
    'diamond_gate':raw['diamond_gate'],
    'openhands':raw['openhands'],
    'paired_result':paired,
    'source_schema':raw.get('schema')
}
rows=[current]
for p in sorted((root/'downloaded').rglob('results.jsonl')):
    rows.extend(json.loads(x) for x in p.read_text().splitlines() if x.strip())
ids=[r['task_id'] for r in rows]
if len(rows)!=24 or len(set(ids))!=24:
    raise SystemExit(f'EXPECTED_24_UNIQUE_CURRENT_RECEIPTS got rows={len(rows)} unique={len(set(ids))} ids={ids}')
rows.sort(key=lambda r:r['task_id'])
out=root/'aggregate-v2'; out.mkdir(exist_ok=True)
(out/'results-v2.jsonl').write_text(''.join(json.dumps(r,separators=(',',':'))+'\n' for r in rows))
counts=collections.Counter(r['paired_result'] for r in rows)
dg_count=sum(bool(r['diamond_gate']['pass']) for r in rows)
oh_count=sum(bool(r['openhands']['pass']) for r in rows)
strata={}
for r in rows:
    s=r.get('stratum') or r.get('manifest',{}).get('stratum')
    strata.setdefault(s,collections.Counter())[r['paired_result']]+=1
lines=[
    '# Agentic Frontier Comparative Replication v2 — aggregate execution receipt','',
    f'Population receipts: **{len(rows)}/24**',
    f'Diamond Gate PASS: **{dg_count}/24**',
    f'OpenHands PASS: **{oh_count}/24**',
    f'Paired completion difference: **{dg_count-oh_count:+d} tasks**','',
    '## Paired outcomes'
]
for k in ['BOTH_PASS','DG_ONLY','OH_ONLY','NEITHER']:
    lines.append(f'- {k}: {counts.get(k,0)}')
lines += ['', '## By stratum']
for s in sorted(strata):
    lines.append(f'- {s}: '+', '.join(f'{k}={strata[s].get(k,0)}' for k in ['BOTH_PASS','DG_ONLY','OH_ONLY','NEITHER']))
lines += ['', '## Baseline comparison', '- Prior frozen population: Diamond Gate 7/24, OpenHands 0/24, neither 17/24.', f'- Replication delta: Diamond Gate {dg_count-7:+d}; OpenHands {oh_count:+d}; neither {counts.get("NEITHER",0)-17:+d}.', '', '## Claim boundary', 'These are raw outcomes for the frozen 24-task population under the replication environment captured with this run. They do not establish universal rank, architecture-only causation, or superiority outside the tested configuration.']
(out/'summary-v2.md').write_text('\n'.join(lines)+'\n')
print('\n'.join(lines))
