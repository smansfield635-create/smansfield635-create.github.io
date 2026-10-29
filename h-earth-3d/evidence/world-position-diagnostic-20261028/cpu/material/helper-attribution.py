"""Declared seam-stencil attribution for the single retained replay-v2 exception."""
from pathlib import Path
import json,numpy as np
root=Path(__file__).resolve().parent
# Reuse the exact v2 transformation; keep all baseline files unchanged.
driver=(root/'replay-v2.py').read_text();prefix=driver[:driver.index("scope={'__file__'")]
scope={'__file__':str(root/'replay-v2.py')};exec(compile(prefix,str(root/'replay-v2.py'),'exec'),scope)
code=scope['code']
old='rho=np.maximum(np.linalg.norm(dx(uv),axis=-1),np.linalg.norm(dy(uv),axis=-1))*F(256)'
new="""dv=dy(uv)
 if pose=='inland-seam-far':
  # The observed bottom partner crosses the source seam. This backward
  # difference is a diagnostic proxy, not a replacement GPU helper value.
  dv[496,400:402]=uv[496,400:402]-uv[495,400:402]
 rho=np.maximum(np.linalg.norm(dx(uv),axis=-1),np.linalg.norm(dv,axis=-1))*F(256)"""
assert code.count(old)==1;code=code.replace(old,new)
scope={'__file__':str(root/'full-p-screen.py')};exec(compile(code,str(root/'full-p-screen.py'),'exec'),scope)
out={'schema':'H_EARTH_SEAM_STENCIL_ATTRIBUTION_v1','result':'ATTRIBUTION_ONLY_NOT_BASELINE_QUALIFICATION','groups':scope['out']['groups'],'exceptions':scope['dtypeReports'],'change':'Only texture dY at far quad top row496 columns400:401 uses preceding visible-row difference, because actual lower visible partner is across source near/far seam. No fitted coefficient or LOD bias.','limits':['This is a diagnostic backward stencil, not exact implicit GPU helper-lane data.','Changing the single failed sample neighborhood cannot establish whole-scene evaluator validity.','Original nominal result and exception remain preserved.','No product edit or GPU run.']}
(root/'helper-attribution-result.json').write_text(json.dumps(out,indent=2)+'\n')
print([(g['pose'],g['incomingAnyChannelBeyondOneCodeCount'],g['incomingNominalDisplayCodeErrorMedianMaxByChannel'][1]) for g in out['groups']])
