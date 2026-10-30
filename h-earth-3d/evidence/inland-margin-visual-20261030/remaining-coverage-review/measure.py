import json,hashlib
import numpy as np
from PIL import Image
from scipy.ndimage import map_coordinates
from pathlib import Path
D=Path(__file__).resolve().parent;S=D.parent/'capture2998';plan=json.load(open(D.parent/'packet.json'))['coverage'];f=np.load(D/'dense-source-far.npz');a=np.load(D/'far-spatial-margin.npz');r=json.load(open(S/'baseline/receipt.json'));after=json.load(open(S/'candidate/receipt.json'))
macro=a['sourceMacroLuminance'];threshold=float(np.median(macro));dark=macro<threshold;gz,gx=np.gradient(macro,.5);cross=[]
for axis in [0,1]:
 low=dark[:-1,:] if axis==0 else dark[:,:-1];high=dark[1:,:] if axis==0 else dark[:,1:]
 for iz,ix in np.argwhere(low!=high):
  jz,jx=iz+(axis==0),ix+(axis==1);u=(threshold-macro[iz,ix])/(macro[jz,jx]-macro[iz,ix]);cross.append([ix+u*(axis==1),iz+u*(axis==0)])
c=np.unique(np.round(np.array(cross),10),axis=0);interp=lambda arr,coords:map_coordinates(arr,[coords[...,1],coords[...,0]],order=1,mode='constant',cval=np.nan)
norm=np.c_[interp(gx,c),interp(gz,c)];norm/=np.linalg.norm(norm,axis=1)[:,None];records=[];rows=[];hashes={}
for i,pose in enumerate(plan['poses']):
 name=pose['name'];ids=pose['sourceIds'];assert np.allclose(c[ids]*.5+[-213,-759],pose['sourceCentersXZ'],atol=1e-9,rtol=0)
 v=r['views'][i];w=after['views'][i];assert v['state']==w['state'] and v['worldPacket']==w['worldPacket'] and v['assetSignature']==w['assetSignature'];m=np.array(v['worldPacket']['camera']['viewProjectionMatrix']).reshape(4,4).T;assert np.max(abs(m.T.ravel()-pose['viewProjectionMatrix']))<1e-8
 grid=c[ids,None,:]+2*np.linspace(-1,1,9)[None,:,None]*norm[ids,None,:];pos=np.stack([interp(f['positions'][...,k],grid) for k in range(3)],-1);q=np.concatenate([pos,np.ones((*pos.shape[:-1],1))],-1)@m.T;n=q[...,:3]/q[...,3,None];xy=np.stack([(n[...,0]+1)*192,(1-n[...,1])*344],-1)
 assert (q[...,3]>0).all() and (abs(n)<=1).all();assert (xy[...,0]>=8).all() and (xy[...,0]<=376).all() and (xy[...,1]>=8).all() and (xy[...,1]<=680).all();assert np.linalg.norm(np.diff(xy,axis=1),axis=2).min()>1
 vals=[]
 for scene,receipt in [('baseline',r),('candidate',after)]:
  p=S/scene/(name+'.png');digest=hashlib.sha256(p.read_bytes()).hexdigest();assert digest==receipt['views'][i]['imageSha256'];hashes[str(p.relative_to(S))]=digest
  im=np.asarray(Image.open(p))[:,:,:3]@np.array([.2126,.7152,.0722]);vals.append(map_coordinates(im,[xy[...,1]-.5,xy[...,0]-.5],order=1,mode='constant',cval=np.nan))
 for j,k in enumerate(ids):
  b,t=vals[0][j],vals[1][j];records.append({'view':name,'id':k,'centerXZ':pose['sourceCentersXZ'][j],'pixelPoints':xy[j].tolist(),'baselineProfile':b.tolist(),'candidateProfile':t.tolist(),'beforeContrast':float(abs(b[-1]-b[0])),'afterContrast':float(abs(t[-1]-t[0])),'beforeMaxSlope':float(abs(np.diff(b)).max()/.25),'afterMaxSlope':float(abs(np.diff(t)).max()/.25),'beforeRange':float(np.ptp(b)),'afterRange':float(np.ptp(t))})
 rr=[x for x in records if x['view']==name];change=np.array([x['afterContrast']-x['beforeContrast'] for x in rr]);rows.append({'view':name,'profiles':len(rr),'reducedOverHalf':int((change<-.5).sum()),'withinHalf':int((abs(change)<=.5).sum()),'increasedOverHalf':int((change>.5).sum()),'medianContrastBefore':float(np.median([x['beforeContrast'] for x in rr])),'medianContrastAfter':float(np.median([x['afterContrast'] for x in rr])),'maxSlopeBefore':max(x['beforeMaxSlope'] for x in rr),'maxSlopeAfter':max(x['afterMaxSlope'] for x in rr)})
report={'result':'MEASURED_FIFTEEN_PREDECLARED_PROFILES','run':41083373434,'artifact':12991506650,'zipSha256':hashlib.sha256((D.parent/'capture2998.zip').read_bytes()).hexdigest(),'sourceSha256':hashlib.sha256((D/'dense-source-far.npz').read_bytes()).hexdigest(),'correctionSha256':hashlib.sha256((D/'far-spatial-margin.rgba16f').read_bytes()).hexdigest(),'imageSha256':hashes,'views':rows,'records':records,'limits':['Correlated sample counts, not continuous boundary length or map-wide proof.','Bilinear source-position and image sampling; projected points not independent depth ownership.','Display RGB luma weights are not physical luminance.','Half-level categories descriptive only; finite quarter-metre slopes not continuous derivatives.']};(D/'measurement.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(rows,indent=2));print(json.dumps([{k:v for k,v in x.items() if k not in ['pixelPoints','baselineProfile','candidateProfile']} for x in records],indent=2))
