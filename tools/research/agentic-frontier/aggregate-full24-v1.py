#!/usr/bin/env python3
import json, pathlib, collections
root=pathlib.Path('.')
prior=json.loads((root/'tools/research/agentic-frontier/prior-af-ir-01-receipt.json').read_text())
rows=[prior]
for p in sorted((root/'downloaded').rglob('results.jsonl')):
    rows.extend(json.loads(x) for x in p.read_text().splitlines() if x.strip())
ids=[r['task_id'] for r in rows]
if len(rows)!=24 or len(set(ids))!=24:
    raise SystemExit(f'EXPECTED_24_UNIQUE_RECEIPTS got rows={len(rows)} unique={len(set(ids))} ids={ids}')
rows.sort(key=lambda r:r['task_id'])
out=root/'aggregate'; out.mkdir(exist_ok=True)
(out/'results-v1.jsonl').write_text(''.join(json.dumps(r,separators=(',',':'))+'\n' for r in rows))
counts=collections.Counter(r['paired_result'] for r in rows)
strata={}
for r in rows:
    s=r.get('stratum') or r.get('manifest',{}).get('stratum')
    strata.setdefault(s,collections.Counter())[r['paired_result']]+=1
dg=sum(bool(r['diamond_gate']['pass']) for r in rows)
oh=sum(bool(r['openhands']['pass']) for r in rows)
lines=['# Agentic Frontier Comparative Study v1 — aggregate execution receipt','',f'Population receipts: **{len(rows)}/24**',f'Diamond Gate PASS: **{dg}/24**',f'OpenHands PASS: **{oh}/24**',f'Paired completion difference: **{dg-oh:+d} tasks**','', '## Paired outcomes']
for k in ['BOTH_PASS','DG_ONLY','OH_ONLY','NEITHER']: lines.append(f'- {k}: {counts.get(k,0)}')
lines += ['', '## By stratum']
for s in sorted(strata): lines.append(f'- {s}: '+', '.join(f'{k}={strata[s].get(k,0)}' for k in ['BOTH_PASS','DG_ONLY','OH_ONLY','NEITHER']))
lines += ['', '## Claim boundary', 'These are the raw outcomes for the frozen 24-task population under the tested configurations. They do not establish universal rank, superiority across all configurations, or architecture-only causation.']
(out/'summary-v1.md').write_text('\n'.join(lines)+'\n')
print('\n'.join(lines))
