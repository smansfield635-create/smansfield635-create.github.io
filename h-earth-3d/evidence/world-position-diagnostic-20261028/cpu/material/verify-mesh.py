import json,hashlib
from pathlib import Path
import numpy as np
root=Path('/tmp/mesh-cpu'); p=json.load(open(root/'package.json')); receipt=json.load(open(root/'upload-replay.json'))
checks={k:hashlib.sha256((root/('upload-'+k+'.bin')).read_bytes()).hexdigest()==v for k,v in receipt['hashes'].items()}
verts=np.fromfile(root/'upload-positions.bin',np.float32).reshape(-1,3).astype(float); idx=np.fromfile(root/'upload-indices.bin',np.uint32)
spans=[s for s in p['primitiveSpans'] if s['role']=='TERRAIN' or s['primitiveId']=='H_EARTH_WORLD_MANIFOLD:FAR_LAND_CONTINUATION']; offsets=np.concatenate([np.arange(s['indexStart'],s['indexStart']+s['indexCount'],3) for s in spans]); triangles=verts[idx[offsets[:,None]+np.arange(3)]]; mins=triangles.min(1); maxs=triangles.max(1); eps=np.array([.625/16,.625/4096,.625/16])
# Independent 2D convex-polygon clipping, no optimizer or LP tolerances.
def intersects(v,q):
 poly=[np.array([0.,0.]),np.array([1.,0.]),np.array([0.,1.])]; b=(v[1:]-v[0]).T
 for a,rhs in list(zip(b,q+eps-v[0]))+list(zip(-b,v[0]-q+eps)):
  out=[]
  for x,y in zip(poly,poly[1:]+poly[:1]):
   fx=a@x-rhs;fy=a@y-rhs
   if fx<=0:out.append(x)
   if (fx<=0)!=(fy<=0):out.append(x+(y-x)*(-fx/(fy-fx)))
  poly=out
  if not poly:return False
 return True
samples=json.load(open(root/'surface-samples.json')); failures=[]; counts=[]
for s in samples:
 q=np.array(s['world']); cand=np.where(np.all(maxs>=q-eps,1)&np.all(mins<=q+eps,1))[0]; got=[int(offsets[k]) for k in cand if intersects(triangles[k],q)]; counts.append(len(got))
 if got!=s['candidateOffsets']:failures.append({'pose':s['pose'],'pixel':s['pixel'],'clip':got,'lp':s['candidateOffsets']})
r={'result':'INDEPENDENT_POLYGON_CLIPPING_MATCH' if not failures and all(checks.values()) else 'MISMATCH','bufferHashes':checks,'samples':len(samples),'unique':counts.count(1),'ambiguous':sum(c>1 for c in counts),'candidateSetDifferences':failures,'method':'Independent double-precision polygon clipping of the barycentric unit triangle against six measured XYZ box half-planes. Tests all bounding-box candidates without LP solver or numerical padding.','limits':['Verifies source box association and upload hashes, not GPU readback or mesh package construction.','Measurement uncertainty model inherited, not newly certified.']};json.dump(r,open('/tmp/material-cpu/mesh-independent-review.json','w'),indent=2);print(json.dumps(r,indent=2))
