import json,hashlib
from pathlib import Path
from PIL import Image
import numpy as np
root=Path('/tmp/diagnostic');r=json.loads((root/'receipt.json').read_text());checks=[]
def check(name,b):
 checks.append({'check':name,'pass':bool(b)})
 if not b: raise AssertionError(name)
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
check('archive_sha256',sha('/tmp/diagnostic.zip')=='36bda9bb3fe0d3711fe1ef557c07505c2e93316de4a39f1321b50e8ab4cce4a3')
check('scene_head',r['sceneIdentity']['sourceHead']=='cb57c275b95d0d48883bc4da4dcfcf17cbec5060')
check('renderer_source_hash',r['sceneIdentity']['rendererSha256']=='fa6acc426c75c3b2292b3ed76a756157698d8e7a5562511ad7ced5af58e25dec')
check('tooling_head',r['sceneIdentity']['toolingHead']=='e29a1b6a95e3073bc527ebb8971ecce09a87f10b')
check('eight_frames_no_errors',len(r['views'])==8 and r['errors']==[] and len(r['runs'])==1)
check('budget_no_retry',r['frameCap']==8 and r['runBudget']==1 and r['automaticRetry']==False)
indices=[0,1,253,254,255,256,65533,65534,65535,65536,524287,524288,1048575,1048576,-1,-2]
expected=np.array([[((i+1 if i>=0 else 0 if i==-1 else 16777215)>>s)&255 for s in [16,8,0]]+[255] for i in indices])
masks={};arr={};summaries=[]
for v in r['views']:
 n=v['image'];p=root/n;a=np.asarray(Image.open(p).convert('RGBA'));code=(a[:,:,0].astype(np.int64)<<16)+(a[:,:,1].astype(np.int64)<<8)+a[:,:,2]
 check(n+':sha256',sha(p)==v['imageSha256'])
 check(n+':dimensions',a.shape==(980,529,4))
 check(n+':opacity',np.all(a[:,:,3]==255))
 check(n+':calibration',np.array_equal(a[979,:16],expected))
 code[979,:16]=0;valid=code>0
 check(n+':range',np.all(code<=1048577))
 pose=v['pose']['name'];mode=v['mode'];step=1/4096 if mode=='world-y' else 1/16;low=-128 if mode=='world-y' else -32768
 val=low+(code-1)*step
 check(n+':count',np.count_nonzero(valid)==v['worldData']['validPixels'])
 check(n+':minmax',val[valid].min()==v['worldData']['min'] and val[valid].max()==v['worldData']['max'])
 if pose in masks:check(n+':same_mask',np.array_equal(valid,masks[pose]))
 masks[pose]=valid;arr[pose,mode]=val
 check(n+':actual_camera_equals_expected',v['worldPacket']['camera']==v['worldActualPacket']['camera'])
 check(n+':source_head',v['sourceHead']==r['sceneIdentity']['sourceHead'])
 check(n+':renderer_hash',v['rendererHash']==r['sceneIdentity']['rendererSha256'])
 summaries.append({'image':n,'validPixels':int(valid.sum()),'range':[float(val[valid].min()),float(val[valid].max())]})
check('stable_asset_signature',len({v['assetSignature'] for v in r['views']})==1)
# Conservative independent interval cross product: every coordinate may differ by .625 bin.
eps=np.array([.625/16,.625/4096,.625/16]);area=[]
def mul(a,b):
 v=np.array([a[0]*b[0],a[0]*b[1],a[1]*b[0],a[1]*b[1]]);return v.min(axis=0),v.max(axis=0)
for pose,y0,y1 in [('inland-seam-near',260,300),('inland-seam-far',470,520)]:
 xyz=np.stack([arr[pose,'world-'+c] for c in 'xyz'],axis=-1)
 for cx in [132,264,396]:
  yy,xx=np.mgrid[y0:y1,cx-4:cx+4];p=xyz[yy,xx];u=xyz[yy,xx+1]-p;v=xyz[yy+1,xx]-p
  cross=np.cross(u,v);nom=np.linalg.norm(cross,axis=-1)/2;bounds=[]
  for i,j in [(1,2),(2,0),(0,1)]:
   a=mul((u[...,i]-2*eps[i],u[...,i]+2*eps[i]),(v[...,j]-2*eps[j],v[...,j]+2*eps[j]));b=mul((u[...,j]-2*eps[j],u[...,j]+2*eps[j]),(v[...,i]-2*eps[i],v[...,i]+2*eps[i]));bounds.append((a[0]-b[1],a[1]-b[0]))
  lo=np.stack([np.where((a<=0)&(b>=0),0,np.minimum(abs(a),abs(b))) for a,b in bounds],axis=-1)
  hi=np.stack([np.maximum(abs(a),abs(b)) for a,b in bounds],axis=-1)
  lower=np.linalg.norm(lo,axis=-1)/2;upper=np.linalg.norm(hi,axis=-1)/2
  area.append({'pose':pose,'column':cx,'triangles':int(nom.size),'nominalAreaM2MinMedianMax':[float(nom.min()),float(np.median(nom)),float(nom.max())],'areaLowerBoundZeroCount':int((lower==0).sum()),'relativeIntervalWidthMedian':float(np.median((upper-lower)/np.maximum(nom,1e-30))),'absoluteIntervalWidthMaxM2':float((upper-lower).max())})
out={'schema':'H_EARTH_INDEPENDENT_WORLD_CAPTURE_REVIEW_v1','result':'CAPTURE_CUSTODY_AND_BYTE_CALIBRATION_PASS_AREA_WEIGHTS_NOT_QUALIFIED','runId':40790969812,'checks':checks,'frames':summaries,'coordinateHalfWidthsMeters':eps.tolist(),'perPixelTriangleAreaScreen':area,'limits':['All reported head identities are verified against artifact receipt and requested immutable identities, not independently fetched source bytes.','Calibration uses the declared same framebuffer/presentation path; numerical bounds conditional on declared .625-bin arithmetic allowance.','Area screen uses one right/down triangle per sampled cell, not complete visible world surface quadrature. Conservative independent coordinate interval products overbound shared-anchor errors.','Some per-pixel area intervals can include zero; precise decoded positions alone do not qualify positive area weights or conservative world-space transport.','Archived material image alignment and source equation preservation need separate reconciliation. No shader repair, visual acceptance, performance or publication claim.']}
old_path=Path('/tmp/old-diagnostic/receipt.json')
if old_path.exists():
 old=json.loads(old_path.read_text());reconciliation=[]
 for pose in ['inland-seam-near','inland-seam-far']:
  a=[v for v in old['views'] if v['pose']['name']==pose];b=[v for v in r['views'] if v['pose']['name']==pose]
  normal=lambda v:{k:x for k,x in v['state'].items() if k!='sequence'}
  fields={'pose':lambda v:v['pose'],'state_except_sequence':normal,'actual_camera_position':lambda v:v['lastFrame']['cameraPosition'],'expected_camera_position':lambda v:v['expectedCameraPosition'],'asset_signature':lambda v:v['assetSignature'],'source_head':lambda v:v['sourceHead'],'renderer_source_hash':lambda v:v['rendererHash'],'canvas':lambda v:v['canvas']}
  reconciliation.append({'pose':pose,'archivedFrames':len(a),'newFrames':len(b),'checks':{k:all(f(v)==f(a[0]) for v in a+b) for k,f in fields.items()}})
 out['archivedIdentityDiagnosticReconciliation']=reconciliation
Path('/tmp/world-independent-review.json').write_text(json.dumps(out,indent=2)+'\n')
print(json.dumps({'result':out['result'],'checks':len(checks),'area':area},indent=2))
