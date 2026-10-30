from pathlib import Path
import json,hashlib
import numpy as np
from field import reconstruct_field
step=.5;axis=np.arange(-24,24.01,step);z,x=np.meshgrid(axis,axis,indexing='ij')
c=np.zeros(x.shape+(4,));c[...,0]=.3;c[...,1:]=[.08,.06,.04];c[...,1:]+=(x+z>10)[...,None]*[.1,.07,.035]
valid=np.ones(x.shape,bool);valid[(abs(x)<.01)&(abs(z)<.01)]=False
low=c.copy();high=c.copy();low[~valid,1:]=0;high[~valid,1:]=100
v1,m1,r1=reconstruct_field(low,step,valid);v2,m2,r2=reconstruct_field(high,step,valid)
delta=np.max(abs(v1-v2),axis=-1);delta[~valid]=0;zz,xx=np.unravel_index(np.argmax(delta),delta.shape)
print('contamination',delta[zz,xx],'world',axis[xx],axis[zz],'distance',np.hypot(axis[xx],axis[zz]),'weight',m1['weight'][zz,xx],m2['weight'][zz,xx])
# Rotation symmetry, native scalar stripe at arbitrary angle; localized attenuation
out={'sourceSha256':hashlib.sha256(Path(__file__).with_name('field.py').read_bytes()).hexdigest(),'invalidPayloadInfluence':{'max':float(delta[zz,xx]),'worldXZ':[float(axis[xx]),float(axis[zz])],'distanceToInvalid':float(np.hypot(axis[xx],axis[zz])),'weights':[float(m1['weight'][zz,xx]),float(m2['weight'][zz,xx])]}}
# Isoluminant thin patch independent from original 1-D case.
base=np.full(x.shape+(3,),100.);direction=np.array([20,-20*.2126/.7152,0]);base[(abs(x)<1.5)]+=direction
inv=lambda rgb:(rgb/255)**2.2/1.12
cc=np.zeros(x.shape+(4,));cc[...,1:]=inv(base)
vv,mm,rr=reconstruct_field(cc,step)
out['narrowChromatic']={'changed':int(np.any(vv!=cc,axis=-1).sum()),'maxDelta':float(abs(vv-cc).max()),'report':rr}
print('narrow chroma',out['narrowChromatic'])
out['detectorInvalidPayloadCases']=[]
for angle,offset in [(.4,6.),(.8,7.)]:
 c=np.zeros(x.shape+(4,));c[...,0]=.3;c[...,1:]=[.08,.06,.04];c[...,1:]+=(x*np.cos(angle)+z*np.sin(angle)>offset)[...,None]*[.1,.07,.035]
 low=c.copy();high=c.copy();low[~valid,1:]=0;high[~valid,1:]=100
 va,ma,ra=reconstruct_field(low,step,valid);vb,mb,rb=reconstruct_field(high,step,valid)
 different=ma['acceptedRidges']!=mb['acceptedRidges']
 out['detectorInvalidPayloadCases'].append({'angleRadians':angle,'offsetMeters':offset,'changedAcceptedRidgeCells':int(different.sum()),'maxValidOutputDelta':float(abs(va[valid]-vb[valid]).max())})
Path(__file__).with_suffix('.json').write_text(json.dumps(out,indent=2)+'\n')
