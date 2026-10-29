import json,subprocess,hashlib
from pathlib import Path
import numpy as np
from PIL import Image
D=Path('/tmp/mesh-cpu');S=Path('/tmp/h-earth-scene-cb57');p=json.load(open(D/'package.json'));samples=json.load(open(D/'surface-samples.json'));receipt=json.load(open('/tmp/diagnostic/receipt.json'))
assert subprocess.check_output(['git','-C',str(S),'rev-parse','HEAD'],text=True).strip()=='cb57c275b95d0d48883bc4da4dcfcf17cbec5060'
files=list(S.rglob('*.js'))+list(S.rglob('*.mjs'));verified=0
for f in files:
 rel=str(f.relative_to(S));original=subprocess.check_output(['git','-C',str(S),'show','HEAD:'+rel]);assert original==f.read_bytes(),rel;verified+=1
pos=np.fromfile(D/'upload-positions.bin',np.float32).reshape(-1,3).astype(float);idx=np.fromfile(D/'upload-indices.bin',np.uint32)
assert np.array_equal(pos,np.array(p['buffers']['positions'],dtype=np.float32).reshape(-1,3));assert np.array_equal(idx,np.array(p['buffers']['indices'],dtype=np.uint32))
spans=[s for s in p['primitiveSpans'] if s['role']=='TERRAIN' or s['primitiveId']=='H_EARTH_WORLD_MANIFOLD:FAR_LAND_CONTINUATION'];offsets=np.concatenate([np.arange(s['indexStart'],s['indexStart']+s['indexCount'],3) for s in spans]);verts=pos[idx[offsets[:,None]+np.arange(3)]];mins=verts.min(1);maxs=verts.max(1);areas=np.linalg.norm(np.cross(verts[:,1]-verts[:,0],verts[:,2]-verts[:,0]),axis=1)/2;assert np.all(areas>0)
eps=np.array([.625/16,.625/4096,.625/16]);images={}
for view in receipt['views']:
 if view['mode'] not in ['world-x','world-y','world-z']:continue
 f=Path('/tmp/diagnostic')/view['image'];assert hashlib.sha256(f.read_bytes()).hexdigest()==view['imageSha256'];a=np.array(Image.open(f)).astype(np.int64);code=a[:,:,0]*65536+a[:,:,1]*256+a[:,:,2];images[view['pose']['name'],view['mode']]=(code,a[:,:,3])
def intersects(v,q):
 # Convex polygon clipping in barycentric parameter space, independent of LP.
 poly=[np.array([0.,0.]),np.array([1.,0.]),np.array([0.,1.])];B=(v[1:]-v[0]).T
 for axis in range(3):
  for sign in [-1,1]:
   a=sign*B[axis];b=eps[axis]+sign*(q[axis]-v[0,axis]);out=[]
   for prev,cur in zip(poly[-1:]+poly[:-1],poly):
    fp=prev@a-b;fc=cur@a-b
    if (fp<=0)!=(fc<=0):out.append(prev+(cur-prev)*fp/(fp-fc))
    if fc<=0:out.append(cur)
   poly=out
   if not poly:return False
 return True
mismatches=[];namb=0
for s in samples:
 x,y=s['pixel'];q=[]
 for mode in ['world-x','world-y','world-z']:
  c,a=images[s['pose'],mode];assert a[y,x]==255 and c[y,x]>=1;q.append((-128 if mode=='world-y' else -32768)+(int(c[y,x])-1)*(1/4096 if mode=='world-y' else 1/16))
 q=np.array(q);assert np.array_equal(q,s['world']);cand=np.where(np.all(maxs>=q-eps,axis=1)&np.all(mins<=q+eps,axis=1))[0];got=[int(offsets[k]) for k in cand if intersects(verts[k],q)]
 if got!=s['candidateOffsets']:mismatches.append({'pixel':s['pixel'],'pose':s['pose'],'clip':got,'lp':s['candidateOffsets']})
 namb+=len(got)>1
assert not mismatches,mismatches
selected=sorted({o for s in samples for o in s['candidateOffsets']});v=pos[idx[np.array(selected)[:,None]+np.arange(3)]];h=np.hypot(v[:,:,0],v[:,:,2]);authorz=v[:,:,2]*np.arctan2(h,v[:,:,1]+420000)*420000/h;assert authorz.max() < -568.01
r={'schema':'H_EARTH_INDEPENDENT_MESH_REVIEW_v1','result':'PASS_WITH_STATED_LIMITS','reviewer':'independent West mesh review','checks':{'exactSourceCommit':'cb57c275b95d0d48883bc4da4dcfcf17cbec5060','sourceFilesByteComparedToGit':verified,'positionsEqualPackageFloat32':True,'indicesEqualPackageUint32':True,'sourceTriangles':len(offsets),'minimumSourceAreaMeters2':float(areas.min()),'independentPolygonClippingSamples':len(samples),'candidateSetDisagreements':len(mismatches),'ambiguitiesRetained':namb,'selectedTriangles':len(selected),'maximumAuthoringZ':float(authorz.max()),'geologicalRetirementDisjointIncluding001MeterAllowance':True},'limits':['Source replay is not hardware buffer readback.','Declared .625-bin scalar interval model is conditional, not proof of GPU interpolation error bounds.','86 ambiguous memberships retained; no arbitrary triangle assignment.','Positive triangle source areas are not pixel weights or a quadrature scheme.','Six tolerance-qualified seam links are candidate local adjacency only; no closed conservative transport domain certified.','Zero contact-distance placeholder does not reconstruct contact fields.','No product repair, deployment, GPU run or new capture authorized by this review.']}
json.dump(r,open(D/'independent-review.json','w'),indent=2);print(json.dumps(r,indent=2))
direct=json.load(open(D/'direct-reconstruction.json'));upload=json.load(open(D/'upload-replay.json'))
assert direct['allNineBuffersEqualToSourceSliceReplay'] and direct['validation']['eligible'] and direct['contentDigest']=='fnv1a32:4f1b7ff2'
assert len(receipt['views'])==8
assert all(view['resources']['terrainSeamPresentation']==upload['seam'] for view in receipt['views'])
for name,digest in upload['hashes'].items():assert hashlib.sha256((D/('upload-'+name+'.bin')).read_bytes()).hexdigest()==digest
r['checks'].update({'originalModuleReplayRerunByReviewer':True,'originalValidatorEligible':True,'allNineBuffersMatch':True,'uploadReplayRerunByReviewer':True,'seamReceiptExactlyMatchesAllEightCapturedViews':True,'matchedSeamVertices':upload['seam']['matchedVertices'],'maximumSeamResidualMeters':upload['seam']['maxPositionResidualMeters'],'uploadHashesVerified':True,'otherSuppressionScopesInspected':'P2_GRASS; P2_ROCK; eight explicit oasis BARK/CANOPY spans; disjoint from TERRAIN/FAR_LAND','candidateSeamLinksReviewed':6})
json.dump(r,open(D/'independent-review.json','w'),indent=2)
