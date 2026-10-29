import numpy as np,json,hashlib,sys
from pathlib import Path
root=Path(sys.argv[1])
p=json.loads((root/'package.json').read_text());P=np.fromfile(root/'upload-positions.bin',np.float32).reshape(-1,3);N=np.fromfile(root/'upload-normals.bin',np.float32).reshape(-1,3);C=np.fromfile(root/'upload-coastDistances.bin',np.float32);I=np.fromfile(root/'upload-indices.bin',np.uint32)
near=next(s for s in p['primitiveSpans'] if s['primitiveIndex']==0);far=next(s for s in p['primitiveSpans'] if s['primitiveId']=='H_EARTH_WORLD_MANIFOLD:FAR_LAND_CONTINUATION')
def edges(s):
 t=I[s['indexStart']:s['indexStart']+s['indexCount']].reshape(-1,3);e=np.sort(np.concatenate([t[:,[0,1]],t[:,[1,2]],t[:,[2,0]]]),axis=1);u,c=np.unique(e,axis=0,return_counts=True);return u[c==1]
e=edges(near);a=P[e[:,0]].astype(float);d=P[e[:,1]].astype(float)-a;l=(d*d).sum(1);l[l==0]=1
rows=[]
for v in np.unique(edges(far)):
 q=P[v].astype(float);t=np.clip(((q-a)*d).sum(1)/l,0,1);dist=np.linalg.norm(q-a-t[:,None]*d,axis=1);k=dist.argmin();tol=max(1e-6,2*abs(q).max()*2**-23)
 if dist[k]>tol:continue
 x,y=e[k];f=t[k];n=N[x]*(1-f)+N[y]*f;c=C[x]*(1-f)+C[y]*f
 rows.append({'vertex':int(v),'positionResidualMeters':float(dist[k]),'normalRawSignAdjustedMaxError':float(abs(N[v]+n).max()),'coastMetersError':float(abs(C[v]-c))})
r={'schema':'H_EARTH_SAVED_NEAR_FAR_INTERFACE_CHECK_v1','sourceScene':'cb57c275b95d0d48883bc4da4dcfcf17cbec5060','matchedVertices':len(rows),'maxPositionResidualMeters':max(x['positionResidualMeters'] for x in rows),'maxNormalRawSignAdjustedError':max(x['normalRawSignAdjustedMaxError'] for x in rows),'maxCoastMetersError':max(x['coastMetersError'] for x in rows),'scope':'Matched far boundary vertices against nearest original indexed near boundary edge; not full segment or final fragment-color certification','files':{n:hashlib.sha256((root/n).read_bytes()).hexdigest() for n in ['upload-positions.bin','upload-indices.bin','upload-normals.bin','upload-coastDistances.bin']}}
cap=json.load(open(sys.argv[2]));r['captureViews']=len(cap['views']);r['refinementCreatedViews']=sum(bool(v['resources']['refinementResourceCreated']) for v in cap['views']);r['refinementDrawCalls']=[v['resources']['counters']['refinementDrawCallCount'] for v in cap['views']]
Path(sys.argv[3]).write_text(json.dumps(r,indent=2)+'\n');print(json.dumps(r,indent=2))
