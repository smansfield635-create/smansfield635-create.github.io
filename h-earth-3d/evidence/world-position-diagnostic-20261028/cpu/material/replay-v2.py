"""Explicit CPU precision correction and fixed round-even mip model; diagnostic only."""
from pathlib import Path
import json,hashlib,numpy as np
root=Path(__file__).resolve().parent
source=(root/'full-p-screen.py').read_text()
changes={
 'np.floor(a.astype(float).reshape(h//2,2,w//2,2,4).mean((1,3))+.5)': 'np.rint(a.astype(float).reshape(h//2,2,w//2,2,4).mean((1,3)))',
 'np.where(det<0,-1,1)': 'np.where(det<0,F(-1),F(1))',
 'np.where(det<0,F(-1),F(1))[...,None]*grad)': 'np.where(det<0,F(-1),F(1))[...,None]*grad).astype(F)',
}
code=source
for old,new in changes.items():
 assert code.count(old)==1,old
 code=code.replace(old,new)
code=code.replace(" np.savez_compressed('/tmp/material-cpu/'+pose+'-nominal-p.npz',", " if False: np.savez_compressed('/tmp/material-cpu/'+pose+'-nominal-p.npz',")
code=code[:code.index("Path('/tmp/material-cpu/full-p-result.json').write_text")]
needle=' factors={}'
code=code.replace(needle," dtypeReports=locals().get('dtypeReports',[]);dtypeReports.append({'pose':pose,'normals':str(sn.dtype),'triWeights':str(tw.dtype),'palette':str(pal.dtype),'P':str(P.dtype),'exceptions':[{'x':int(xx[i]),'y':int(yy[i]),'error':error[i].tolist(),'predicted':code[i].tolist(),'observed':obs[i].tolist(),'world':p[yy[i],xx[i]].tolist(),'lod':float(lod[yy[i],xx[i]])} for i in np.where(np.any(error>1,axis=1))[0]]})\n"+needle)
scope={'__file__':str(root/'full-p-screen.py')};exec(compile(code,str(root/'full-p-screen.py'),'exec'),scope)
out=scope['out'];out['schema']='H_EARTH_CPU_MATERIAL_REPLAY_V2_SCREEN_v1';out['result']='CPU_MODEL_SCREEN_ONLY_NOT_GPU_EQUIVALENCE';out['baselineScriptSha256']=hashlib.sha256(source.encode()).hexdigest();out['changes']=changes;out['dtypeAndExceptions']=scope['dtypeReports'];out['implementation']='Same source-expression emulator with explicit Float32 perturb orientation and recursive round-to-even RGBA8 box mip model. Sampler choice is an attribution model, not captured GPU bytes.'
(root/'replay-v2-result.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(out,indent=2))
