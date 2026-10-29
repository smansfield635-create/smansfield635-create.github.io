import json,numpy as np
from pathlib import Path
from PIL import Image
D=Path('/tmp/mesh-cpu');r=json.load(open('/tmp/diagnostic/receipt.json'));pkg=json.load(open(D/'package.json'));vs=[v for v in r['views'] if v['pose']['name']=='inland-seam-far'];ds=[]
for mode in ['world-x','world-y','world-z']:
 view=next(v for v in vs if v['mode']==mode);a=np.array(Image.open('/tmp/diagnostic/'+view['image'])).astype(np.int64);c=a[:,:,0]*65536+a[:,:,1]*256+a[:,:,2];ds.append((-128 if mode=='world-y' else -32768)+(c-1)*(1/4096 if mode=='world-y' else 1/16))
xyz=np.stack(ds,-1);pos=np.fromfile(D/'upload-positions.bin',np.float32).reshape(-1,3).astype(float);idx=np.fromfile(D/'upload-indices.bin',np.uint32);tri=pos[idx[73902:73905]];normal=np.cross(tri[1]-tri[0],tri[2]-tri[0]);vp=np.array(vs[0]['worldActualPacket']['camera']['viewProjectionMatrix'],np.float32).astype(float).reshape(4,4).T;inv=np.linalg.inv(vp)
def plane(x,y):
 a=inv@np.array([2*(x+.5)/529-1,1-2*(y+.5)/980,0,1]);b=inv@np.array([2*(x+.5)/529-1,1-2*(y+.5)/980,1,1]);a=a[:3]/a[3];b=b[:3]/b[3];d=b-a;return a+d*((tri[0]-a)@normal)/(d@normal)
def uv(q):
 h=np.hypot(q[...,0],q[...,2]);k=420000*np.arctan2(h,q[...,1]+420000)/h;return q[...,[0,2]]*k[...,None]*.28
def derivatives(q):
 u=uv(q);dx=u[0,1]-u[0,0];dy=u[1,0]-u[0,0];rho=max(np.linalg.norm(dx),np.linalg.norm(dy))*256;return {'duDx':dx.tolist(),'duDy':dy.tolist(),'lod':float(np.clip(np.log2(rho),0,8))}
q=xyz[496:498,400:402];helpers=np.array([[plane(x,y) for x in [400,401]] for y in [496,497]])
# Surface membership via independent barycentric polygon clipping.
eps=np.array([.625/16,.625/4096,.625/16]);spans=[s for s in pkg['primitiveSpans'] if s['role']=='TERRAIN' or s['primitiveId']=='H_EARTH_WORLD_MANIFOLD:FAR_LAND_CONTINUATION'];off=np.concatenate([np.arange(s['indexStart'],s['indexStart']+s['indexCount'],3) for s in spans]);v=pos[idx[off[:,None]+np.arange(3)]];lo=v.min(1);hi=v.max(1)
def intersects(t,p):
 poly=[np.array([0.,0.]),np.array([1.,0.]),np.array([0.,1.])];B=(t[1:]-t[0]).T
 for j in range(3):
  for sign in [-1,1]:
   a=sign*B[j];b=eps[j]+sign*(p[j]-t[0,j]);out=[]
   for prev,cur in zip(poly[-1:]+poly[:-1],poly):
    fp=prev@a-b;fc=cur@a-b
    if (fp<=0)!=(fc<=0):out.append(prev+(cur-prev)*fp/(fp-fc))
    if fc<=0:out.append(cur)
   poly=out
   if not poly:return False
 return True
neighbors=[]
for y in [495,496,497]:
 for x in [400,401]:
  p=xyz[y,x];cand=np.where(np.all(hi>=p-eps,axis=1)&np.all(lo<=p+eps,axis=1))[0];valid=[int(off[k]) for k in cand if intersects(v[k],p)];neighbors.append({'pixel':[x,y],'world':p.tolist(),'sourceTriangleOffsets':valid,'sourcePrimitives':[next(s['primitiveId'] for s in spans if s['indexStart']<=o<s['indexStart']+s['indexCount']) for o in valid]})
out={'schema':'H_EARTH_INDEPENDENT_HELPER_LANE_REVIEW_v1','result':'HELPER_LANE_ATTRIBUTION_PLAUSIBLE_NOT_CERTIFIED','sample':[400,496],'uniqueSourceTriangleOffset':73902,'sourceTriangleVertices':tri.tolist(),'neighbors':neighbors,'visibleQuadWorld':q.tolist(),'sameTriangleNominalHelperWorld':helpers.tolist(),'visibleQuadDerivatives':derivatives(q),'sameTriangleNominalDerivatives':derivatives(helpers),'nominalTargetMinusMeasuredWorld':(helpers[0,0]-q[0,0]).tolist(),'backwardVisibleRowDerivativeUV':(uv(xyz[496,400])-uv(xyz[495,400])).tolist(),'limits':['Nominal uploaded-matrix inverse and infinite triangle-plane extrapolation only; no GPU helper readback.','Earlier ideal-ray screen failed coordinate-box compatibility for many samples; these absolute helper coordinates are not certified replacements.','Visible adjacent row belongs to distinct source primitive, so using visible world coordinates as same-primitive helper values is not justified.','Derivative and LOD attribution only; no arbitrary parameter fit, incoming color evaluator replacement, GPU run or product repair.','GPU derivative choice, mip generation and rounding remain unqualified.']}
json.dump(out,open(D/'helper-lane-review.json','w'),indent=2);print(json.dumps(out,indent=2))
