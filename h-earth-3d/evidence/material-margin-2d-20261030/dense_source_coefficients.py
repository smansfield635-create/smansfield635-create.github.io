"""Pose-bound dense source coefficient sampler; numerical evidence, not a renderer.
Uses pinned archived source arithmetic, original indexed triangles, and current atlas.
No owner selection across overlapping XZ triangles. P stays an independent input.
"""
from pathlib import Path
import hashlib, importlib.util, json,re,textwrap
import numpy as np
from PIL import Image
ROOT=Path(__file__).resolve().parent.parent
OUT=Path(__file__).resolve().parent
PAIRED=ROOT/'recovered/paired'
INPUT=OUT/'dense-input'
F=np.float32

def module(name,path):
 spec=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m
f=module('dense_native_fields',PAIRED/'input/material-cpu/source-fields.py')
ec=module('dense_ecological',PAIRED/'ecological.py')
source=(PAIRED/'input/material-cpu/full-p-screen.py').read_text()
# Reuse the actual archived source transcription rather than approximating noise,
# triplanar projection, material variation, or ecological selectors.
height_code=compile(textwrap.dedent(source[source.index(' broad=noise'):source.index(' fw=lambda')]),'pinned-height-fields','exec')
palette_code=compile(textwrap.dedent(source[source.index(' low=(1-sm'):source.index(' # All selected coast')]),'pinned-palette-fields','exec')
clamp=lambda x,a=0,b=1:np.clip(x,a,b)
sm=ec.sm
mix=lambda a,b,t:a*(1-t)+b*t
norm=lambda v:v/np.maximum(np.linalg.norm(v,axis=-1,keepdims=True),F(1e-30))
noise=lambda xz,scale,off=(0,0):f.noise32(xz*F(scale)+np.array(off,dtype=F))
def limit(n,c):
 co=clamp(np.sum(n*c,axis=-1),-1,1);tan=c-n*co[...,None];le=np.linalg.norm(tan,axis=-1)
 b=norm(n*F(.9271838545667874)+tan/np.maximum(le[...,None],F(1e-30))*F(.3746065934159120))
 return np.where((co>=F(.9271838545667874))[...,None],c,np.where((le<F(.00001))[...,None],n,b))
positions=np.fromfile(INPUT/'upload-positions.bin',dtype='<f4').reshape(-1,3)
normals=np.fromfile(INPUT/'presentation-normals.bin',dtype='<f4').reshape(-1,3)
indices=np.fromfile(INPUT/'upload-indices.bin',dtype='<u4')
coasts=np.fromfile(INPUT/'presentation-coastDistances.bin',dtype='<f4')
package=json.loads((INPUT/'package.json').read_text())
spans=[s for s in package['primitiveSpans'] if s['role']=='TERRAIN' or s['primitiveId']=='H_EARTH_WORLD_MANIFOLD:FAR_LAND_CONTINUATION']
terrain_offsets=np.concatenate([np.arange(s['indexStart'],s['indexStart']+s['indexCount'],3) for s in spans])
receipt=json.loads((INPUT/'world-receipt.json').read_text())
renderer=ROOT/'repo/showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js'
manifest=json.loads(re.search(r'const CORRECTED_MANIFEST=(\{.*?\});',renderer.read_text()).group(1))
charts={c['sourceOffset']:c for c in manifest['charts']}
atlases=[np.asarray(Image.open(renderer.parent/'corrected-material-v1'/a['file']),dtype=float) for a in manifest['atlases']]

def atlas_delta(xz,offsets):
 out=np.zeros((len(xz),3));covered=np.zeros(len(xz),bool)
 for offset in np.unique(offsets):
  if int(offset) not in charts:continue
  c=charts[int(offset)];take=offsets==offset;a=atlases[c['atlasIndex']]
  uv=(xz[take]-c['originXZ'])/manifest['stepMeters']+[c['atlasX'],c['atlasY']]
  ij=np.floor(uv).astype(int);frac=uv-ij;x,y=ij.T;u,v=frac.T
  pixel=lambda x,y:a[np.clip(y,0,a.shape[0]-1),np.clip(x,0,a.shape[1]-1)]
  encoded=(pixel(x,y)*(1-u[:,None])+pixel(x+1,y)*u[:,None])*(1-v[:,None])+(pixel(x,y+1)*(1-u[:,None])+pixel(x+1,y+1)*u[:,None])*v[:,None]
  out[take]=(encoded-128)/1024;covered[take]=True
 return out,covered

def barycentric(xz,offsets):
 v=positions[indices[offsets[:,None]+np.arange(3)]].astype(float)
 # Explicit x/z determinants avoid object-level inversion selection.
 e1=v[:,1][:,[0,2]]-v[:,0][:,[0,2]];e2=v[:,2][:,[0,2]]-v[:,0][:,[0,2]];q=xz-v[:,0][:,[0,2]]
 det=e1[:,0]*e2[:,1]-e1[:,1]*e2[:,0]
 u=(q[:,0]*e2[:,1]-q[:,1]*e2[:,0])/det;w=(e1[:,0]*q[:,1]-e1[:,1]*q[:,0])/det
 return np.stack([1-u-w,u,w],-1)

def owners(xz):
 counts=np.zeros(len(xz),int);offsets=np.full(len(xz),-1,int);members=[]
 bounds=np.array([xz.min(0),xz.max(0)])
 for offset in terrain_offsets:
  tri=positions[indices[offset:offset+3]][:,[0,2]].astype(float)
  if np.any(tri.max(0)<bounds[0]) or np.any(tri.min(0)>bounds[1]):continue
  e1,e2=tri[1]-tri[0],tri[2]-tri[0]
  if abs(e1[0]*e2[1]-e1[1]*e2[0])<1e-12:continue
  boxes=np.all((xz>=tri.min(0)-1e-9)&(xz<=tri.max(0)+1e-9),1);ii=np.flatnonzero(boxes)
  if not len(ii):continue
  w=barycentric(xz[ii],np.full(len(ii),offset));ii=ii[np.min(w,1)>=-1e-10]
  counts[ii]+=1;offsets[ii]=offset
  members.extend((int(i),int(offset)) for i in ii)
 offsets[counts!=1]=-1
 return counts,offsets,members

def point_attributes(xz,offsets):
 ids=indices[offsets[:,None]+np.arange(3)];w=barycentric(xz,offsets)
 y=np.sum(w*positions[ids,1],1);p=np.column_stack([xz[:,0],y,xz[:,1]]).astype(F)
 n=np.sum(w[:,:,None]*normals[ids],1);n=np.where(n[:,1,None]<0,-n,n);n=norm(n).astype(F)
 coast=np.sum(w*coasts[ids],1).astype(F)
 return p,n,coast

def source_quads(p,offsets,pose):
 view=next(v for v in receipt['views'] if v['pose']['name']==pose)
 mat=np.array(view['worldActualPacket']['camera']['viewProjectionMatrix'],F).astype(float).reshape(4,4).T
 inv=np.linalg.inv(mat);clip=np.column_stack([p,np.ones(len(p))])@mat.T;ndc=clip[:,:3]/clip[:,3,None]
 pixel=np.floor(np.column_stack([(ndc[:,0]+1)*529/2,(1-ndc[:,1])*980/2])).astype(int)
 xy=(pixel//2*2)[:,None,:]+np.array([[0,0],[1,0],[0,1],[1,1]])
 rays=[]
 for depth in [0,1]:
  q=np.stack([2*(xy[:,:,0]+.5)/529-1,1-2*(xy[:,:,1]+.5)/980,np.full(xy.shape[:2],depth),np.ones(xy.shape[:2])],-1)@inv.T;rays.append(q[:,:,:3]/q[:,:,3,None])
 origin,finish=rays;direction=finish-origin;tri=positions[indices[offsets[:,None]+np.arange(3)]].astype(float);normal=np.cross(tri[:,1]-tri[:,0],tri[:,2]-tri[:,0]);den=np.sum(direction*normal[:,None,:],-1)
 safe=np.all(abs(den)>1e-12,1)&np.all(np.isfinite(ndc),1)
 distance=np.sum((tri[:,0,None,:]-origin)*normal[:,None,:],-1)/den
 quad=(origin+direction*distance[:,:,None]).astype(F)
 return quad,pixel,safe,np.array([view['lastFrame']['cameraPosition'][k] for k in ['x','y','z']],F)

def coefficients(p,n,coast,offsets,pose):
 quad,pixel,quad_safe,cam=source_quads(p,offsets,pose)
 base={'np':np,'F':F,'f':f,'noise':noise,'sm':sm,'mix':mix,'clamp':clamp,'norm':norm}
 def height_scope(q):
  scope={**base,'p':q,'world':q[...,[0,2]],'dist':np.linalg.norm(q-cam,axis=-1)}
  exec(height_code,scope);return scope
 h=height_scope(quad)['height'];rows=np.arange(len(p));ix=pixel[:,0]%2;iy=pixel[:,1]%2
 px=quad[rows,iy*2+1]-quad[rows,iy*2];py=quad[rows,2+ix]-quad[rows,ix]
 hx=h[rows,iy*2+1]-h[rows,iy*2];hy=h[rows,2+ix]-h[rows,ix]
 scope=height_scope(p);slope=1-clamp(n[:,1]);scope.update(n=n,slope=slope,slopeR=sm(.025,.58,slope))
 c=np.cross(py,n);grad=hx[:,None]*c+hy[:,None]*np.cross(n,px);det=np.sum(px*c,-1)
 perturbed=norm(abs(det)[:,None]*n-np.where(det<0,F(-1),F(1))[:,None]*grad).astype(F)
 footprint=np.maximum.reduce([np.linalg.norm(abs(px[:,[0,2]]*F(z))+abs(py[:,[0,2]]*F(z)),axis=-1) for z in [.19,.47,1.13]])
 env=(1-sm(.72,1.45,footprint))*(1-sm(105,285,scope['dist']))*mix(F(.72),F(1),sm(.04,.58,slope))
 scope['sn']=norm(mix(n,limit(n,perturbed),env[:,None])).astype(F)
 exec(palette_code,scope)
 # Q's coefficient dependence on P is exactly affine. A fixed reference is
 # supplied only to exercise source ecological(); P is not baked into A/B.
 scope['P']=np.broadcast_to(np.array([.20,.18,.12],F),(len(p),3));ecology=ec.ecological(scope,coast)
 wi=ecology['wI'].astype(float)[:,None];wg=ecology['wG'].astype(float)[:,None]
 A=(1-wi)*(1-wg);B=(1-wg)*wi*ecology['TI'].astype(float)+wg*ecology['TG'].astype(float)
 D,atlas_covered=atlas_delta(p[:,[0,2]].astype(float),offsets)
 return np.concatenate([A,B+D],1),{'microEnvelope':env,'quadSafe':quad_safe,'atlasCovered':atlas_covered,'atlasDelta':D,'ecology':ecology}

def main():
 report={'schema':'H_EARTH_DENSE_SOURCE_COEFFICIENTS_v1','domains':[],'witnessChecks':[],'gridStepMeters':.5,'limits':['Pose-bound CPU field model; no GPU or 2-D repair qualification.','Current source near/far seam normal/coast reconciliation applied with unmodified module; contact placeholder is not consumed by this coefficient model.','Micro-normal helper derivatives use parent-triangle camera rays; inherited native model used captured visible-neighbor derivatives.','P remains an independent original-texture input; no dense texture P or texture averaging introduced.','Original TERRAIN and FAR_LAND indexed support only; all XZ multiple owners excluded rather than visually selecting one.','No geological replacement/retirement or later overlays/lighting modeled.','Source Float32 noise transcription and operation order inherit existing non-GPU-equivalence limits.']}
 for name,pose,cx,cz in [('near','inland-seam-near',-211.,-809.),('far','inland-seam-far',-189.,-735.)]:
  axisx=np.arange(cx-24,cx+24+.25,.5);axisz=np.arange(cz-24,cz+24+.25,.5);xx,zz=np.meshgrid(axisx,axisz);xz=np.column_stack([xx.ravel(),zz.ravel()]);counts,offsets,members=owners(xz);valid=counts==1;C=np.full((len(xz),4),np.nan);pall=np.full((len(xz),3),np.nan);nall=np.full_like(pall,np.nan);coastall=np.full(len(xz),np.nan);envall=np.full(len(xz),np.nan);Dall=np.full_like(pall,np.nan)
  p,n,coast=point_attributes(xz[valid],offsets[valid]);c,meta=coefficients(p,n,coast,offsets[valid],pose);valid_ids=np.flatnonzero(valid);valid[valid_ids[~meta['quadSafe']]]=False
  C[valid_ids]=c;pall[valid_ids]=p;nall[valid_ids]=n;coastall[valid_ids]=coast;envall[valid_ids]=meta['microEnvelope'];Dall[valid_ids]=meta['atlasDelta'];C[~valid]=np.nan
  np.savez_compressed(OUT/f'dense-source-{name}.npz',x=axisx,z=axisz,shape=np.array(xx.shape),positions=pall.reshape(*xx.shape,3),normals=nall.reshape(*xx.shape,3),coastDistance=coastall.reshape(xx.shape),coefficients=C.reshape(*xx.shape,4),atlasDelta=Dall.reshape(*xx.shape,3),supported=valid.reshape(xx.shape),ownerCount=counts.reshape(xx.shape),sourceOffsets=offsets.reshape(xx.shape),allMemberships=np.array(members),microEnvelope=envall.reshape(xx.shape),referenceP=np.array([.2,.18,.12]))
  report['domains'].append({'name':name,'pose':pose,'bounds':[float(axisx[0]),float(axisz[0]),float(axisx[-1]),float(axisz[-1])],'shape':list(xx.shape),'uniqueSupported':int(valid.sum()),'multipleOwners':int((counts>1).sum()),'noOwner':int((counts==0).sum()),'quadUnsafe':int((~meta['quadSafe']).sum()),'coastRange':[float(coast.min()),float(coast.max())],'microEnvelopeRange':[float(meta['microEnvelope'].min()),float(meta['microEnvelope'].max())],'sourceOffsets':np.unique(offsets[valid]).tolist()})
 # Re-evaluate archived source sample centers with their retained parent offsets.
 # Preserve their existing nominal normal and encoded coast inputs for this
 # arithmetic comparison; dense point attributes are independently identified.
 samples=json.loads((PAIRED/'input/mesh-cpu/surface-samples.json').read_text());world={(s['pose'],*s['pixel']):s['world'] for s in samples}
 for side in ['near','far']:
  pose='inland-seam-'+side;a=np.load(PAIRED/f'results/native-{pose}.npz');p=np.array([world[(pose,*xy)] for xy in a['pixels']],F);normal_image=np.load(PAIRED/f'input/mesh-cpu/{pose}-nominal-normals.npy');n=normal_image[a['pixels'][:,1],a['pixels'][:,0]].astype(F)
  # The original recorded coast exceeds595m: all ecological coast branches
  # saturate.620m is equivalent for coefficients, not a physical coast claim.
  c,meta=coefficients(p,n,np.full(len(p),620,F),a['offsets'],pose);wi=a['wI'].astype(float)[:,None];wg=a['wG'].astype(float)[:,None];expected=np.concatenate([(1-wi)*(1-wg),(1-wg)*wi*a['TI']+wg*a['TG']+meta['atlasDelta']],1);diff=abs(c-expected)
  report['witnessChecks'].append({'pose':pose,'memberships':len(p),'coefficientMaxError':diff.max(0).tolist(),'maxReferenceColorLinearError':float(abs((c[:,:1]-expected[:,:1])*np.array([.2,.18,.12])+c[:,1:]-expected[:,1:]).max()),'microEnvelopeNonzero':int((meta['microEnvelope']>0).sum()),'scope':'Archived center+nominal normals, independent source-parent derivative model; source offsets retained, not owner selection.'})
 files=[Path(__file__),PAIRED/'ecological.py',PAIRED/'input/material-cpu/source-fields.py',PAIRED/'input/material-cpu/full-p-screen.py',renderer,*INPUT.iterdir()]
 report['inputHashes']={str(p):hashlib.sha256(p.read_bytes()).hexdigest() for p in files if p.is_file()}
 (OUT/'dense-source-coefficients.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({k:v for k,v in report.items() if k!='inputHashes'},indent=2))
if __name__=='__main__':main()
