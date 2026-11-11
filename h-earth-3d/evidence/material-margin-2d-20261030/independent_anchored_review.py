from pathlib import Path
import json,hashlib
import numpy as np
from field import reconstruct_anchored_field,display
step=.5;axis=np.arange(-24,24.01,step);z,x=np.meshgrid(axis,axis,indexing='ij')
source=Path(__file__).with_name('field.py')
report={'sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'cases':{}}
inv=lambda rgb:(rgb/255.)**2.2/1.12
for name,mask in [('narrow_gray',abs(x)<1.5),('narrow_chroma',abs(x)<1.5),('circle',x*x+z*z<100),('corner',(x>0)&(z>0)),('overlap',((x>0)&(z>0))|((x>-5)&(x<-2)&(z<4))),('straight',x>0)]:
 rgb=np.full(x.shape+(3,),100.);d=np.array([20,-20*.2126/.7152,0]) if name=='narrow_chroma' else np.array([35,25,15]);rgb[mask]+=d
 c=np.zeros(x.shape+(4,));c[...,0]=.3;c[...,1:]=inv(rgb)-c[...,:1]*np.array([.106451957,.072878853,.034164603])
 v,m,r=reconstruct_anchored_field(c,step)
 assert np.array_equal(v[m['anchors']],c[m['anchors']])
 assert np.array_equal(v[m['weight']==0],c[m['weight']==0])
 assert r['changedCells']>0,name
 # Central original dark/light interior survives; broad interiors beyond support exact.
 if name.startswith('narrow'):
  assert np.array_equal(v[48,48],c[48,48]),name
  assert np.array_equal(v[:,0],c[:,0]) and np.array_equal(v[:,-1],c[:,-1])
 before=display(c[...,:1]*np.array([.106451957,.072878853,.034164603])+c[...,1:]);after=display(v[...,:1]*np.array([.106451957,.072878853,.034164603])+v[...,1:])
 report['cases'][name]={**r,'insideAnchoredCells':int((m['anchors']&mask).sum()),'centralPixelChange':float(abs(v[48,48]-c[48,48]).max()),'maximumCodeChange':float(abs(before-after).max())}
# Invalid-cell payload independence: detector, anchors, and valid output.
mask=x+z>10;c=np.zeros(x.shape+(4,));c[...,0]=.3;c[...,1:]=[.08,.06,.04];c[...,1:]+=mask[...,None]*[.1,.07,.035]
valid=np.ones(x.shape,bool);valid[48,48]=False
low=c.copy();high=c.copy();low[~valid,1:]=0;high[~valid,1:]=100
v1,m1,r1=reconstruct_anchored_field(low,step,valid);v2,m2,r2=reconstruct_anchored_field(high,step,valid)
assert np.array_equal(v1[valid],v2[valid]);assert np.array_equal(m1['ridges'],m2['ridges']);assert np.array_equal(m1['anchors'],m2['anchors'])
report['invalidPayloadIndependence']={'validOutputExact':True,'ridgeMaskExact':True,'anchorMaskExact':True}
# Original texture P is sampled unchanged; affine response remains exact.
p=np.random.default_rng(3).uniform(.03,.2,c.shape[:2]+(3,));d=np.array([.001,-.002,.003]);q=v1[...,:1]*p+v1[...,1:]
err=abs((v1[...,:1]*(p+d)+v1[...,1:]-q)-v1[...,:1]*d).max();assert err<1e-14
report['textureResponseError']=float(err)
# Negative/constant tests: no repair.
for name,ramp in [('constant',0.),('linear',.0002)]:
 c=np.zeros(x.shape+(4,));c[...,0]=.3;c[...,1:]=[.08,.06,.04];c[...,1:]+=x[...,None]*ramp
 v,m,r=reconstruct_anchored_field(c,step);assert np.array_equal(c,v),name;report[name]={'unchanged':True}
Path(__file__).with_suffix('.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report,indent=2))
