import json,hashlib
import numpy as np
from collections import defaultdict
p=json.load(open('/tmp/mesh-cpu/package.json'));samples=json.load(open('/tmp/mesh-cpu/surface-samples.json'));pos=np.fromfile('/tmp/mesh-cpu/upload-positions.bin',np.float32).reshape(-1,3).astype(float);idx=np.fromfile('/tmp/mesh-cpu/upload-indices.bin',np.uint32)
sel=sorted(set(k for s in samples for k in s['candidateOffsets']));t=idx[np.array(sel)[:,None]+np.arange(3)];v=pos[t];bbox=[v.min((0,1)).tolist(),v.max((0,1)).tolist()]
# Actual geology source retirement is two authoring rectangles with z>=-568.
R=420000;h=np.hypot(v[:,:,0],v[:,:,2]);k=np.divide(np.arctan2(h,v[:,:,1]+R)*R,h,out=np.zeros_like(h),where=h!=0);authorz=v[:,:,2]*k
assert authorz.max() < -568
spans=[s for s in p['primitiveSpans'] if s['role']=='TERRAIN' or s['primitiveId']=='H_EARTH_WORLD_MANIFOLD:FAR_LAND_CONTINUATION'];bounds=[]
for span in spans:
 edges=defaultdict(list)
 for o in range(span['indexStart'],span['indexStart']+span['indexCount'],3):
  ids=idx[o:o+3]
  for a,b in zip(ids,np.roll(ids,-1)):edges[tuple(sorted((int(a),int(b))))].append(o)
 bounds.append([(a,b,os[0]) for (a,b),os in edges.items() if len(os)==1])
links=[]
for a,b,no in bounds[0]:
 A,B=pos[a],pos[b];d=B-A;l=np.linalg.norm(d);u=d/l
 for c,e,fo in bounds[1]:
  if no not in sel and fo not in sel:continue
  C,D=pos[c],pos[e];t0,t1=(C-A)@u,(D-A)@u;lo=max(0,min(t0,t1));hi=min(l,max(t0,t1))
  if hi-lo<=1e-7:continue
  # Far segment's interpolated overlap endpoints must agree with near edge.
  if abs(t1-t0)<1e-12:continue
  fc=C+(D-C)*(lo-t0)/(t1-t0);fd=C+(D-C)*(hi-t0)/(t1-t0)
  residual=max(np.linalg.norm(fc-(A+u*lo)),np.linalg.norm(fd-(A+u*hi)))
  tol=max(1e-6,2*max(abs(np.r_[A,B,C,D]))*2**-23)
  if residual<=tol:links.append({'nearTriangleOffset':no,'farTriangleOffset':fo,'overlapMeters':hi-lo,'maxResidualMeters':residual,'toleranceMeters':tol})
report={'schema':'H_EARTH_SELECTED_SOURCE_DOMAIN_AUDIT_v1','selectedTriangles':len(sel),'worldVertexBounds':bbox,'maximumAuthoringZ':float(authorz.max()),'geologyRetirementDisjoint':True,'retirementBasis':'Exact geological-runtime-bridge.v1.js rectangles z[-440,-224] and[-568,-440], requiring triangles wholly inside. Selected triangles wholly z<-568. Other suppression functions are vegetation/rock/tree spans; ordinary TERRAIN/FAR_LAND source spans retained.','selectedSeamLinks':links,'method':'Source-indexed boundary edges, overlapping projected segment intervals; same source Float32-scale tolerance as seam normal reconciliation. Links retained as candidate topology evidence, not new render geometry.','limits':['Partial selected neighborhood only, not closed integration domain.','Tolerance-qualified near/far adjacency does not make microgap disappear or prove continuous reconstructed correction.','No area integration or fine-reference design qualified.']}
json.dump(report,open('/tmp/mesh-cpu/domain-audit.json','w'),indent=2);print(json.dumps({k:v for k,v in report.items() if k!='selectedSeamLinks'},indent=2));print('candidate seam links',len(links))
