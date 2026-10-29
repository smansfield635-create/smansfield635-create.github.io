from pathlib import Path
import json,numpy as np,hashlib
from PIL import Image
O=Path('renderer-export');m=json.load(open(O/'atlas-manifest.json'));p=np.fromfile('evidence-inputs/original-mesh/mesh/upload-positions.bin',np.float32).reshape(-1,3).astype(float);idx=np.fromfile('evidence-inputs/original-mesh/mesh/upload-indices.bin',np.uint32);atlases=[np.asarray(Image.open(O/a['file'])) for a in m['atlases']];charts={c['sourceOffset']:c for c in m['charts']}
for a in m['atlases']:assert hashlib.sha256((O/a['file']).read_bytes()).hexdigest()==a['sha256']
def sample(points,c):
 uv=(points-np.array(c['originXZ']))/m['stepMeters'];ij=np.floor(uv).astype(int);f=uv-ij;assert np.all(ij>=0) and np.all(ij[:,0]+1<c['width']) and np.all(ij[:,1]+1<c['height']);x=ij[:,0]+c['atlasX'];y=ij[:,1]+c['atlasY'];a=atlases[c['atlasIndex']];q00=a[y,x].astype(float);q01=a[y,x+1].astype(float);q10=a[y+1,x].astype(float);q11=a[y+1,x+1].astype(float);return ((q00*(1-f[:,0,None])*(1-f[:,1,None])+q01*f[:,0,None]*(1-f[:,1,None])+q10*(1-f[:,0,None])*f[:,1,None]+q11*f[:,0,None]*f[:,1,None])-128)/1024
r={'result':'PENDING','domainIntegrals':[],'witnessChecks':[],'sourceInspection':['Original indexed sourceOffset selects chart, source normal/coast/height interpolated on original parent.','Source f0, savedL32 and fine correction constant reused; no diffusion solve.','Texture centers lie on0.25m grid; renderer must address half-texel centers and correct imageY orientation with linear color data/no mipmaps.','Export sample gate does not test continuous atlas integral; independent review supplies that below.']}
for group in ['NEAR','FAR']:
 old=np.load('resolved-output/'+group+'-3.npz');offs=old['sourceOffsets'];assert set(offs)==set(c['sourceOffset'] for c in m['charts'] if c['group']==group)
 for pitch in [1.5,.75]:
  integral=np.zeros(3);totalArea=0.;count=0
  for o in offs:
   v=p[idx[o+np.arange(3)]];area=np.linalg.norm(np.cross(v[1]-v[0],v[2]-v[0]))/2;n=max(1,int(np.ceil(np.linalg.norm(v-np.roll(v,1,axis=0),axis=1).max()/pitch)));ii,jj=np.meshgrid(np.arange(n),np.arange(n),indexing='ij');mask=ii+jj<n;i=ii[mask];j=jj[mask];uv=np.column_stack(((i+1/3)/n,(j+1/3)/n));mask=i+j<n-1;uv=np.concatenate([uv,np.column_stack(((i[mask]+2/3)/n,(j[mask]+2/3)/n))]);b=np.column_stack((1-uv.sum(1),uv));assert len(b)==n*n
   points=b@v[:,[0,2]];sm=np.zeros(3)
   for start in range(0,len(points),50000):sm+=sample(points[start:start+50000],charts[int(o)]).sum(0)
   integral+=area*sm/len(points);totalArea+=area;count+=len(points)
  r['domainIntegrals'].append({'group':group,'pitch':pitch,'quadratureSamples':count,'original3DArea':totalArea,'integratedAtlasRGB':integral.tolist(),'normalizedMeanRGB':(integral/totalArea).tolist(),'pass1eMinus5':bool(abs(integral/totalArea).max()<=1e-5)})
for pose in ['inland-seam-near','inland-seam-far']:
 a=np.load(O/(pose+'-export-witnesses.npz'));b=np.load('corrected-output/'+pose+'-3.npz');assert np.array_equal(a['pixels'],b['pixels']) and np.array_equal(a['offsets'],b['offsets']);assert np.array_equal(a['directDelta'],b['delta']);display=lambda q:np.clip(q*1.12,0,1)**(1/2.2)*255;err=float(abs(display(a['nativeQ']+a['atlasDelta'])-display(b['correctedQ'])).max());r['witnessChecks'].append({'pose':pose,'memberships':len(a['pixels']),'maxDisplayCodeError':err})
r['result']='PASS_BOUNDED_ENCODED_MASS_CHECK' if all(x['pass1eMinus5'] for x in r['domainIntegrals']) else 'REJECT_ENCODED_ATLAS_MASS'
r['limits']=['Independent atlas integration uses original source-face centroid subdivision at1.5/.75m; actual WebGL filtering/addressing not executed.','Chart quantization/interpolation need not preserve exact continuity or zero correction on arbitrary boundary segments; separate qualification needed.','No healthy/protected/GPU/visual acceptance.','Sampled fidelity and quadrature-qualified encoded mass do not prove full-scene correctness.']
(O/'independent-review.json').write_text(json.dumps(r,indent=2)+'\n');print(json.dumps(r))
# Additional actual encoded traces: source functional continuity need not survive charts.
r['edgeSampleCheck']=[]
for group in ['NEAR','FAR']:
 offsets=np.load('resolved-output/'+group+'-3.npz')['sourceOffsets'];edgeOwners={}
 for o in offsets:
  tri=idx[o+np.arange(3)]
  for u,v in zip(tri,np.roll(tri,-1)):edgeOwners.setdefault(tuple(sorted((int(u),int(v)))),[]).append(int(o))
 jump=0.;boundary=0.;count=0
 for edge,owners in edgeOwners.items():
  f=np.linspace(0,1,33);points=(1-f[:,None])*p[edge[0],[0,2]]+f[:,None]*p[edge[1],[0,2]];a=sample(points,charts[owners[0]])
  if len(owners)==2:jump=max(jump,float(abs(a-sample(points,charts[owners[1]])).max()))
  else:boundary=max(boundary,float(abs(a).max()))
  count+=len(f)
 r['edgeSampleCheck'].append({'group':group,'edgeSamples':count,'maxSharedParentEdgeLinearJump':jump,'maxPerimeterLinearCorrection':boundary})
r['massResult']=r['result'];r['result']='REJECT_EXPORT_STRICT_SHARED_EDGE_CONTINUITY' if any(d['maxSharedParentEdgeLinearJump']>1e-12 for d in r['edgeSampleCheck']) else r['result'];r['firstFailedInvariant']='Strict shared-parent-edge continuity does not survive separate chart quantization/interpolation.' if r['result'].startswith('REJECT') else None
(O/'independent-review.json').write_text(json.dumps(r,indent=2)+'\n');print(json.dumps({'result':r['result'],'edgeSampleCheck':r['edgeSampleCheck']}))
