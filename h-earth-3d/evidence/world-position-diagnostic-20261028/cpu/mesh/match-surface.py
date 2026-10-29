import json,hashlib
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.optimize import linprog
root=Path('/tmp/mesh-cpu');p=json.load(open(root/'package.json'));r=json.load(open('/tmp/diagnostic/receipt.json'))
pos=np.fromfile(root/'upload-positions.bin',np.float32).reshape(-1,3).astype(float);norm=np.fromfile(root/'upload-normals.bin',np.float32).reshape(-1,3).astype(float);idx=np.fromfile(root/'upload-indices.bin',np.uint32)
spans=[s for s in p['primitiveSpans'] if s['role']=='TERRAIN' or s['primitiveId']=='H_EARTH_WORLD_MANIFOLD:FAR_LAND_CONTINUATION']
offsets=np.concatenate([np.arange(s['indexStart'],s['indexStart']+s['indexCount'],3) for s in spans]);tri=idx[offsets[:,None]+np.arange(3)];verts=pos[tri];mins=verts.min(1);maxs=verts.max(1)
area=np.linalg.norm(np.cross(verts[:,1]-verts[:,0],verts[:,2]-verts[:,0]),axis=1)/2
assert np.all(area>0)
eps=np.array([.625/16,.625/4096,.625/16]);groups=[];samples=[]
for pose,y0,y1 in [('inland-seam-near',260,300),('inland-seam-far',470,520)]:
 ds=[]
 for mode in ['world-x','world-y','world-z']:
  v=next(v for v in r['views'] if v['pose']['name']==pose and v['mode']==mode);f=Path('/tmp/diagnostic')/v['image'];assert hashlib.sha256(f.read_bytes()).hexdigest()==v['imageSha256'];a=np.array(Image.open(f)).astype(int);c=a[:,:,0]*65536+a[:,:,1]*256+a[:,:,2];ds.append((-128 if mode=='world-y' else -32768)+(c-1)*(1/4096 if mode=='world-y' else 1/16))
 xyz=np.stack(ds,-1);counts=[];selected=set();fail=[]
 for yy in range(y0,y1+1):
  for xx in [*range(128,137),*range(260,269),*range(392,401)]:
   q=xyz[yy,xx];cand=np.where(np.all(maxs>=q-eps,axis=1)&np.all(mins<=q+eps,axis=1))[0];valid=[]
   for k in cand:
    v=verts[k];b=(v[1:]-v[0]).T
    sol=linprog([0,0],A_ub=np.vstack([b,-b,[1,1]]),b_ub=np.r_[q+eps-v[0],v[0]-q+eps,1],bounds=[(0,1),(0,1)],method='highs',options={'primal_feasibility_tolerance':1e-9})
    if sol.success:
     weights=np.r_[1-sol.x.sum(),sol.x];pt=weights@v
     if np.all(abs(pt-q)<=eps+1e-8):valid.append(int(k));selected.add(int(k))
   counts.append(len(valid));samples.append({'pose':pose,'pixel':[xx,yy],'world':q.tolist(),'candidateOffsets':[int(offsets[k]) for k in valid]})
   if not valid:fail.append([xx,yy])
 used=sorted(selected);groups.append({'pose':pose,'samples':len(counts),'unmatched':len(fail),'uniqueTriangleMatches':counts.count(1),'ambiguousTriangleMatches':sum(c>1 for c in counts),'maximumCandidateCount':max(counts),'selectedSourceTriangles':len(used),'selectedTriangleAreaRangeMeters2':[float(area[used].min()),float(area[used].max())] if used else None,'unmatchedPixels':fail})
summary={'schema':'H_EARTH_CAPTURE_SOURCE_MESH_ASSOCIATION_v1','result':'ALL_CAPTURE_BOXES_INTERSECT_SOURCE_MESH' if all(g['unmatched']==0 for g in groups) else 'SOURCE_MESH_ASSOCIATION_INCOMPLETE','sourcePackage':p['packageIdentity'],'method':'Linear-program feasibility of exact Float32 triangle barycentric point inside measured .625-bin coordinate box. No ideal-camera-ray assumption. All intersecting triangles retained.','terrainTriangles':len(tri),'minimumTerrainTriangleAreaMeters2':float(area.min()),'groups':groups,'limits':['Scalar measurement intervals remain the declared instrument arithmetic model, not a new formal GPU interpolation bound.','Ambiguous mesh membership is retained; no arbitrary single-triangle selection.','Mesh areas established for source triangles, not pixel quadrature or qualified full transport domain.','Cross-primitive T-junction adjacency/protection and selected triangle retirement need separate checks.']}
json.dump(summary,open(root/'surface-match.json','w'),indent=2);json.dump(samples,open(root/'surface-samples.json','w'),separators=(',',':'));print(json.dumps(summary,indent=2))
