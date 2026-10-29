import json,numpy as np
from PIL import Image
r=json.load(open('/tmp/diagnostic/receipt.json'));out=[]
for pose in r['poses']:
 name=pose['name'];vs=[v for v in r['views'] if v['pose']['name']==name];ds=[]
 for mode in ['world-x','world-y','world-z']:
  v=next(v for v in vs if v['mode']==mode);a=np.array(Image.open('/tmp/diagnostic/'+v['image'])).astype(int);c=a[:,:,0]*65536+a[:,:,1]*256+a[:,:,2];ds.append((-128 if mode=='world-y' else -32768)+(c-1)*(1/4096 if mode=='world-y' else 1/16))
 xyz=np.stack(ds,-1);y0,y1=(260,300) if name.endswith('near') else (470,520);yy,xx=np.mgrid[y0:y1+1,128:401];p=xyz[yy,xx]
 vp=np.array(vs[0]['worldActualPacket']['camera']['viewProjectionMatrix'],dtype=np.float32).astype(float).reshape(4,4).T
 inv=np.linalg.inv(vp);a=np.stack([2*(xx+.5)/529-1,1-2*(yy+.5)/980,np.zeros_like(xx),np.ones_like(xx)],-1)@inv.T;a=a[...,:3]/a[...,3,None];b=np.stack([2*(xx+.5)/529-1,1-2*(yy+.5)/980,np.ones_like(xx),np.ones_like(xx)],-1)@inv.T;b=b[...,:3]/b[...,3,None];d=(b-a);d/=np.linalg.norm(d,axis=-1,keepdims=True)
 eps=np.array([.625/16,.625/4096,.625/16]); t0=(p-eps-a)/d;t1=(p+eps-a)/d;tlo=np.minimum(t0,t1).max(-1);thi=np.maximum(t0,t1).min(-1);bad=tlo>thi
 xs=np.isin(xx,[*range(128,137),*range(260,269),*range(392,401)])
 print(name,'incompatible',int(bad[xs].sum()),'of',int(xs.sum()),'depth interval width',np.percentile((thi-tlo)[xs],[0,50,100]))
 out.append({'pose':name,'samples':int(xs.sum()),'incompatible':int(bad[xs].sum()),'nominalRayDepthWidthQuantiles':np.percentile((thi-tlo)[xs],[0,50,100]).tolist()})
json.dump({'result':'EXPLORATORY_NOMINAL_RAY_BOX_COMPATIBILITY_ONLY','groups':out,'limits':['Float32 uploaded matrix inverted in CPU float64; no established GPU interpolation/projection error bound.','Passing ray-box compatibility does not establish true correlated intervals or mesh connectivity.']},open('/tmp/ray-screen.json','w'),indent=2)
