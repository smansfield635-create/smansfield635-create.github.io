import json,numpy as np
from pathlib import Path
root=Path('/tmp/material-cpu');script=(root/'primitive-lod-screen.py').read_text();scope={'__file__':str(root/'primitive-lod-screen.py')};exec(compile(script[:script.index("driver=(root/")],str(root/'primitive-lod-screen.py'),'exec'),scope)
samples=scope['samples'];lods=scope['lods'];positions=scope['positions'];indices=scope['indices'];receipt=scope['receipt'];localuv=scope['localuv'];nchoices=0;maxdiff=0;parities=set();fail=[]
for s in samples:
 pose=s['pose'];x,y=s['pixel'];choices=lods[pose,x,y];assert [c[0] for c in choices]==s['candidateOffsets'];parities.add((x%2,y%2));nchoices+=len(choices)
 view=next(v for v in receipt['views'] if v['pose']['name']==pose);M=np.array(view['worldActualPacket']['camera']['viewProjectionMatrix'],np.float32).astype(float).reshape(4,4).T
 for offset,lod in choices:
  # Independent forward projection and perspective-correct barycentric interpolation,
  # including out-of-triangle helper extrapolation, instead of inverse ray-plane.
  tri=positions[indices[offset:offset+3]];clip=np.c_[tri,np.ones(3)]@M.T;ndc=clip[:,:2]/clip[:,3,None];mat=np.vstack([ndc.T,np.ones(3)]);out=[]
  for yy in [y//2*2,y//2*2+1]:
   row=[]
   for xx in [x//2*2,x//2*2+1]:
    w=np.linalg.solve(mat,np.array([2*(xx+.5)/529-1,1-2*(yy+.5)/980,1]));w=w/clip[:,3];w=w/w.sum();row.append(w@tri)
   out.append(row)
  u=localuv(np.array(out));du=u[y%2,1]-u[y%2,0];dv=u[1,x%2]-u[0,x%2];other=float(np.clip(np.log2(max(np.linalg.norm(du),np.linalg.norm(dv))*256),0,8));diff=abs(other-lod);maxdiff=max(maxdiff,diff)
  if diff>1e-7:fail.append([pose,x,y,offset,lod,other])
assert len(lods)==len(samples)==2484 and not fail
assert parities=={(0,0),(0,1),(1,0),(1,1)}
r={'schema':'H_EARTH_PRIMITIVE_LOD_INDEPENDENT_REVIEW_v1','result':'PASS_IMPLEMENTATION_WITH_EXPLICIT_MODEL_LIMITS','sourceSamples':len(samples),'allCandidateMemberships':nchoices,'ambiguousSamples':sum(len(s['candidateOffsets'])>1 for s in samples),'candidateDroppingDetected':False,'allFourPixelParitiesChecked':True,'independentMethod':'Forward projected triangle with perspective-correct barycentric helper extrapolation; compared against inverse ray-plane model for every candidate.','maximumIndependentLODDisagreement':maxdiff,'checks':['Pixel [x,y] indexes UV[y,x] and observed row j consistently.','Horizontal finite difference uses target quad row; vertical finite difference uses target quad column.','Top-origin PNG row parity is compatible with even980 viewport height; derivative vertical sign reversal cannot change norm-based LOD.','Every candidate is evaluated; summaries distinguish any failing candidate from all failing candidates.','LOD changes only texture sampling; measured center UV and source palette retained.','Fixed round-even mip model applied uniformly; no exception-specific pixel rule.'],'limits':['This checks implementation, not actual hardware derivative mode, mip bytes, projection arithmetic or sampler behavior.','Absolute inverse-ray coordinates failed earlier interval checks; derivative model remains an explicit approximation.','Normal/procedural derivatives still use visible-neighbor model and ambiguity is only propagated through source LOD here.','No proof of source normal membership uncertainty, GPU equivalence, fine-reference split, conservative integration or product repair.']}
json.dump(r,open(root/'primitive-lod-independent-review.json','w'),indent=2);print(json.dumps(r,indent=2))
