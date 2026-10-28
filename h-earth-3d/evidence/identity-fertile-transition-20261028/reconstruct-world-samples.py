"""Recover bounded world positions from existing height probes and source camera law."""
import json,hashlib
from pathlib import Path
import numpy as np
from PIL import Image
def inv(v):
 lo=np.zeros_like(v);hi=np.ones_like(v)
 for _ in range(60):
  m=(lo+hi)/2;s=m*m*(3-2*m);lo=np.where(s<v,m,lo);hi=np.where(s>=v,m,hi)
 return (lo+hi)/2
def smooth(a,b,x):
 t=np.clip((x-a)/(b-a),0,1);return t*t*(3-2*t)
def sphere(p):
 x,y,z=p;R=420000.;r=np.hypot(x,z);a=r/R;k=(R+y)*np.sin(a)/r
 return np.array([x*k,(R+y)*np.cos(a)-R,z*k])
def unit(p):return p/np.linalg.norm(p)
r=json.loads(Path('diagnostic/receipt.json').read_text());imgs={}
for v in r['views']:
 p=Path('diagnostic')/v['image'];assert hashlib.sha256(p.read_bytes()).hexdigest()==v['imageSha256'];imgs[v['pose']['name'],v['mode']]=np.array(Image.open(p))
out=[]
for pose,y0,y1 in [('inland-seam-near',260,300),('inland-seam-far',470,520)]:
 v=next(v for v in r['views'] if v['pose']['name']==pose);state=v['state'];cam=np.array([v['lastFrame']['cameraPosition'][k] for k in ['x','y','z']]);local=np.array([state['position'][k] for k in ['x','y','z']],float)
 # Invert spherical radial height so source terrain-camera reconciliation is retained.
 local[1]=np.linalg.norm(cam+np.array([0,420000.,0]))-420000.
 assert np.max(abs(sphere(local)-cam))<1e-7
 yaw,pitch=np.radians([state['yawDegrees'],state['pitchDegrees']]);direction=np.array([np.sin(yaw)*np.cos(pitch),np.sin(pitch),-np.cos(yaw)*np.cos(pitch)])
 forward=unit(sphere(local+18*direction)-cam);up=unit(cam+np.array([0,420000.,0]));right=unit(np.cross(forward,up));up=np.cross(right,forward)
 H,W=imgs[pose,'identity-protection-factors-raw'].shape[:2];f=np.tan(np.radians(state['verticalFovDegrees'])/2)
 yy=np.repeat(np.arange(y0,y1+1),27);xx=np.tile(np.r_[128:137,260:269,392:401],y1-y0+1)
 ray=forward+((2*(xx+.5)/W-1)*W/H*f)[:,None]*right+((1-2*(yy+.5)/H)*f)[:,None]*up
 code=imgs[pose,'identity-protection-factors-raw'][yy,xx,2].astype(float);lo=np.maximum(0,code-1)/255;hi=np.minimum(255,code+1)/255;assert np.all((lo>0)&(hi<1))
 heights=np.stack([8+22*inv(lo),8+22*inv(hi)]);ts=(heights-cam[1])/ray[:,1];assert np.all(ts>0)
 points=cam+ts[:,:,None]*ray;dist=np.linalg.norm(points-cam,axis=2)
 nearlo=1-smooth(55,220,dist.max(0));nearhi=1-smooth(55,220,dist.min(0));nc=imgs[pose,'identity-brightness-factors-raw'][yy,xx,2].astype(float);nlo=np.maximum(0,nc-1)/255;nhi=np.minimum(255,nc+1)/255
 mismatch=(nearlo>nhi+1e-6)|(nearhi<nlo-1e-6)
 out.append({'pose':pose,'cameraPosition':cam.tolist(),'recoveredLocalCameraHeight':float(local[1]),'samples':len(xx),'nearMaterialIntervalMismatches':int(mismatch.sum()),'maximumPositionIntervalWidthMeters':np.max(abs(points[1]-points[0]),axis=0).tolist(),'xPixels':xx.tolist(),'yPixels':yy.tolist(),'worldEndpoint0':points[0].tolist(),'worldEndpoint1':points[1].tolist(),'worldAreaWeightsEstablished':False})
report={'schema':'H_EARTH_ARCHIVED_WORLD_SAMPLE_RECOVERY_v1','method':'Source spherical camera law, actual captured camera position, pixel-center rays, invert interior heightDry smoothstep; independent nearMaterial interval cross-check.','sourceHead':'cb57c275b95d0d48883bc4da4dcfcf17cbec5060','groups':out,'limits':['Quantized height yields intervals, not exact positions.','Actual original projection matrix was not captured; source reconstruction assumes recorded state/FOV and unjittered standard pixel centers.','NearMaterial agreement is a cross-check, not proof of exact raster geometry.','No complete neighboring surface, area quadrature or correction validated.']}
Path('world-samples.json').write_text(json.dumps(report,separators=(',',':'))+'\n')
print(json.dumps([{k:v for k,v in x.items() if k not in ['xPixels','yPixels','worldEndpoint0','worldEndpoint1']} for x in out],indent=2))
