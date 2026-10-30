"""Independent all-cell support audit plus randomized actual RG8 bilinear decode."""
from pathlib import Path
import json,hashlib
import numpy as np
from basis_safe_margin import supported_vertices,project,encode_rg8
R=Path(__file__).parent;p=np.load(R/'adaptive-habitat.npz');q=np.load(R/'basis-safe-margin.npz');rg=q['rg8'];h,w=rg.shape[:2]
# Independent loop over offsets: any cell carrying correction must have only admissible corners.
vertex_ok=(p['insideBand']-p['distance']>0)&(p['outsideBand']+p['distance']>0)&(p['alpha']>0)
cell_ok=np.ones((h-1,w-1),bool);cell_changed=np.zeros_like(cell_ok)
for j,i in [(0,0),(0,1),(1,0),(1,1)]:
 cell_ok&=vertex_ok[j:h-1+j,i:w-1+i]
 cell_changed|=np.any(rg[j:h-1+j,i:w-1+i]!=0,axis=-1)
violations=int((cell_changed&~cell_ok).sum());assert violations==0
assert not rg[0].any() and not rg[-1].any() and not rg[:,0].any() and not rg[:,-1].any()
# Match normalized UNORM texture channels and decode after linear filtering.
rng=np.random.default_rng(993);n=500000;row=rng.integers(0,h-1,n);col=rng.integers(0,w-1,n);u=rng.random(n);v=rng.random(n)
weights=[(1-u)*(1-v),u*(1-v),(1-u)*v,u*v]
fields={k:np.zeros(n) for k in ['distance','insideBand','outsideBand','alpha']};channels=np.zeros((n,2))
for (j,i),wt in zip([(0,0),(0,1),(1,0),(1,1)],weights):
 channels+=wt[:,None]*(rg[row+j,col+i].astype(float)/255)
 for k in fields:fields[k]+=wt*p[k][row+j,col+i]
decoded=(channels[:,0]-channels[:,1])*255/1024
core=(fields['distance']>=fields['insideBand'])|(fields['distance']<=-fields['outsideBand']);domain=fields['alpha']<=0
assert np.all(decoded[core|domain]==0)
# Reflection/transposition and border adversaries must preserve definition.
d=rng.uniform(-3,3,(9,13));hi=np.ones_like(d)*2;lo=hi.copy();g=np.ones_like(d)
safe,cells=supported_vertices(d,hi,lo,g)
assert np.array_equal(safe.T,supported_vertices(d.T,hi.T,lo.T,g.T)[0]);assert np.array_equal(safe[:,::-1],supported_vertices(d[:,::-1],hi[:,::-1],lo[:,::-1],g[:,::-1])[0])
zero=encode_rg8(np.zeros((3,3)));assert np.all(zero==0)
report={'inputSha256':hashlib.sha256((R/'basis-safe-margin.npz').read_bytes()).hexdigest(),'allCellsAudited':int(cell_ok.size),'changedCellsTouchingPredeterminedCoreOrDomain':violations,'randomBilinearSamples':n,'randomCoreSamples':int(core.sum()),'randomCoreLeaks':int((decoded[core]!=0).sum()),'maxCoreDelta':float(abs(decoded[core]).max(initial=0)),'normalizedRG8DecodeTested':True,'boundaryZerosAndReflectionTranspose':True,'coreGuardDisposition':'PASS_FOR_FIXED_BILINEAR_SOURCE_CORE_DEFINITION','overallDisposition':'HOLD_TRANSITION_GUARD_FAILS','limits':['No texture upload or GPU sampler execution. Runtime must use same grid convention and linear decode, no mipmap support expansion.','Proof protects bilinearly interpolated original source-width fields, not an unsampled exact native-distance geometry.','Core fix does not cure known gradient amplification.']}
(R/'independent-basis-review.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
