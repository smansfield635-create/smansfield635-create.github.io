import json,numpy as np
from PIL import Image
from pathlib import Path
p=json.load(open('/tmp/mesh-cpu/package.json'));r=json.load(open('/tmp/diagnostic/receipt.json'));pos=np.fromfile('/tmp/mesh-cpu/upload-positions.bin',np.float32).reshape(-1,3).astype(float);norm=np.fromfile('/tmp/mesh-cpu/upload-normals.bin',np.float32).reshape(-1,3).astype(float);idx=np.fromfile('/tmp/mesh-cpu/upload-indices.bin',np.uint32)
sp=[s for s in p['primitiveSpans'] if s['role']=='TERRAIN' or s['primitiveId']=='H_EARTH_WORLD_MANIFOLD:FAR_LAND_CONTINUATION'];offs=np.concatenate([np.arange(s['indexStart'],s['indexStart']+s['indexCount'],3) for s in sp]);ids=idx[offs[:,None]+np.arange(3)];vs=pos[ids]
for pose,y0,y1 in [('inland-seam-near',256,304),('inland-seam-far',466,524)]:
 ds=[]
 for mode in ['world-x','world-y','world-z']:
  v=next(v for v in r['views'] if v['pose']['name']==pose and v['mode']==mode);a=np.array(Image.open('/tmp/diagnostic/'+v['image'])).astype(int);c=a[:,:,0]*65536+a[:,:,1]*256+a[:,:,2];ds.append((-128 if mode=='world-y' else -32768)+(c-1)*(1/4096 if mode=='world-y' else 1/16))
 xyz=np.stack(ds,-1);yy,xx=np.mgrid[y0:y1+1,124:405];q=xyz[yy,xx].reshape(-1,3);out=np.full_like(q,np.nan);best=np.full(len(q),np.inf);offsets=np.full(len(q),-1)
 for k,v in enumerate(vs):
  if np.any(v[:,[0,2]].max(0)<q[:,[0,2]].min(0)) or np.any(v[:,[0,2]].min(0)>q[:,[0,2]].max(0)):continue
  b=(v[1:,[0,2]]-v[0,[0,2]]).T
  if abs(np.linalg.det(b))<1e-12:continue
  uv=(q[:,[0,2]]-v[0,[0,2]])@np.linalg.inv(b).T;w=np.c_[1-uv.sum(1),uv];delta=abs(w@v[:,1]-q[:,1]);take=(w.min(1)>=-1e-10)&(delta<best)
  ns=w[take]@norm[ids[k]];ns=np.where(ns[:,1,None]<0,-ns,ns);ns/=np.linalg.norm(ns,axis=1,keepdims=True);out[take]=ns;best[take]=delta[take];offsets[take]=offs[k]
 full=np.full_like(xyz,np.nan);full[yy,xx]=out.reshape((*yy.shape,3));np.save('/tmp/mesh-cpu/'+pose+'-nominal-normals.npy',full)
 print(pose,'missing',int(np.isnan(out[:,0]).sum()),'normal source plane max y error',float(best.max()))
