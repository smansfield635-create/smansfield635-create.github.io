"""Frozen Gen2971 diagnostic atlas export from qualified saved application.
Run from the extracted corrected numerical packet/workroom root; output path supplied.
No transport solve. Per-source-parent charts prevent coordinate owner selection.
"""
from pathlib import Path
import argparse,json,hashlib,importlib.util,sys
sys.path.insert(0,str(Path.cwd()))
import numpy as np
from PIL import Image
from scipy.spatial import cKDTree
from matplotlib.tri import Triangulation
parser=argparse.ArgumentParser();parser.add_argument('--output',required=True);args=parser.parse_args();OUT=Path(args.output);OUT.mkdir(parents=True,exist_ok=True)
sp=importlib.util.spec_from_file_location('reference','source-reference.py');ref=importlib.util.module_from_spec(sp);sp.loader.exec_module(ref)
mesh=Path('evidence-inputs/original-mesh/mesh');pos=np.fromfile(mesh/'upload-positions.bin',np.float32).reshape(-1,3).astype(float);idx=np.fromfile(mesh/'upload-indices.bin',np.uint32);normal=np.fromfile(mesh/'upload-normals.bin',np.float32).reshape(-1,3).astype(float);coast=np.fromfile(mesh/'upload-coastDistances.bin',np.float32).astype(float)
STEP=.25;WIDTH=4096;SCALE=1024.
manifest={'schema':'H_EARTH_CORRECTED_MATERIAL_ATLAS_v1','sourceHead':'cb57c275b95d0d48883bc4da4dcfcf17cbec5060','stepMeters':STEP,'atlasWidth':WIDTH,'decode':'(rgb*255-128)/1024','mipmaps':False,'filter':'LINEAR','boundaryWidthMeters':12,'charts':[],'atlases':[],'inputHashes':{}}
report={'schema':'H_EARTH_CORRECTED_EXPORT_FIDELITY_v1','thresholdCodes':1,'groups':[],'witnesses':[],'newTransportSolves':0,'gpuRuns':0}
chartData={}
def taper(p,seg):
 v=seg[:,1]-seg[:,0];dv=p[:,None,:]-seg[:,0];q=np.clip(np.sum(dv*v,2)/np.sum(v*v,1),0,1);dist=np.linalg.norm(dv-q[:,:,None]*v,axis=2).min(1);s=np.clip(dist/12,0,1);return s*s*(3-2*s)
def display(q):return np.clip(q*1.12,0,1)**(1/2.2)*255
for gi,group in enumerate(['NEAR','FAR']):
 z=dict(np.load(f'resolved-output/{group}-3.npz'));app=np.load(f'corrected-output/{group}-3-application.npz');c=app['c'][1];seg=pos[app['perimeterIndices']][:,:,[0,2]];layouts=[];px=0;py=0;rowh=0
 for parent,o in enumerate(z['sourceOffsets']):
  orig=idx[o+np.arange(3)];v=pos[orig];lo=np.floor(v[:,[0,2]].min(0)/STEP)*STEP-2*STEP;size=np.ceil((v[:,[0,2]].max(0)-lo)/STEP).astype(int)+3;w,h=map(int,size)
  if px+w>WIDTH:px=0;py+=rowh;rowh=0
  layouts.append((parent,int(o),orig,lo,w,h,px,py));px+=w;rowh=max(rowh,h)
 height=py+rowh;assert height<=8192;
 allOrig=idx[z['sourceOffsets'][:,None]+np.arange(3)];evalCache={}
 def evaluateParent(parent,points):
  if parent not in evalCache:
   original=allOrig[parent];children=np.flatnonzero(z['parent']==parent);tri=z['triangles'][children];un,iv=np.unique(tri,return_inverse=True);xy=z['xyz'][un][:,[0,2]];finder=Triangulation(xy[:,0],xy[:,1],iv.reshape(-1,3)).get_trifinder();vv=z['xyz'][tri][:,:,[0,2]];ivm=np.linalg.inv(np.concatenate([vv,np.ones((len(tri),3,1))],axis=2).transpose(0,2,1));tree=cKDTree(vv.mean(1));sourceinv=np.linalg.inv(np.column_stack((pos[original][:,[0,2]],np.ones(3))));evalCache[parent]=(original,tri,finder,ivm,tree,sourceinv)
  original,tri,finder,ivm,tree,sourceinv=evalCache[parent];bs=np.column_stack((points,np.ones(len(points))))@sourceinv;world=bs@pos[original];nn=bs@normal[original];nn=np.where(nn[:,1,None]<0,-nn,nn);co=bs@coast[original];P,Q,L=ref.evaluate(world,nn,co);chosen=np.asarray(finder(points[:,0],points[:,1])).astype(int);outside=chosen<0
  if outside.any():
   _,near=tree.query(points[outside],k=min(16,len(tri)));near=np.asarray(near).reshape(outside.sum(),-1);bb=np.einsum('nkij,nj->nki',ivm[near],np.column_stack((points[outside],np.ones(outside.sum()))));best=bb.min(2).argmax(1);chosen[outside]=near[np.arange(len(best)),best]
  b=np.einsum('nij,nj->ni',ivm[chosen],np.column_stack((points,np.ones(len(points)))));evolved=np.einsum('ni,nij->nj',b,z['L32'][tri[chosen]]);return taper(points,seg)[:,None]*(evolved-L.astype(float)-c),Q.astype(float)
 atlas=np.full((height,WIDTH,3),128,np.uint8);maxCode=0.;maxLinear=0.;nodeCount=0
 for parent,o,orig,lo,w,h,px,py in layouts:
  children=np.flatnonzero(z['parent']==parent);tri=z['triangles'][children];unique,inv=np.unique(tri,return_inverse=True);tv=z['xyz'][unique][:,[0,2]];localtri=inv.reshape(-1,3);finder=Triangulation(tv[:,0],tv[:,1],localtri).get_trifinder();cent=z['xyz'][tri].mean(1)[:,[0,2]];tree=cKDTree(cent);vv=z['xyz'][tri][:,:,[0,2]];invs=np.linalg.inv(np.concatenate([vv,np.ones((len(tri),3,1))],axis=2).transpose(0,2,1));sourceinv=np.linalg.inv(np.column_stack((pos[orig][:,[0,2]],np.ones(3))))
  adjacent=np.flatnonzero(np.any(np.isin(allOrig,orig),axis=1));adjacent=adjacent[adjacent!=parent]
  adjacentInverse={int(k):np.linalg.inv(np.column_stack((pos[allOrig[k]][:,[0,2]],np.ones(3)))) for k in adjacent}
  def exact(points):
   # Extend only chart padding through original shared-index neighbours.
   # Actual triangle interiors always retain their original parent identity.
   direct,Q=evaluateParent(parent,points);bs=np.column_stack((points,np.ones(len(points))))@sourceinv;outside=np.flatnonzero(bs.min(1)<-1e-9)
   if len(outside):
    chosen=np.full(len(outside),-1,int);strict=np.zeros(len(outside),int);pp=np.column_stack((points[outside],np.ones(len(outside))))
    for other in adjacent:
     b=pp@adjacentInverse[int(other)];inside=b.min(1)>=-1e-9;strict+=(b.min(1)>1e-9);chosen[(chosen<0)&inside]=other
    assert strict.max(initial=0)<=1,'AMBIGUOUS_INDEXED_NEIGHBOUR_INTERIOR'
    for other in np.unique(chosen[chosen>=0]):
     use=outside[chosen==other];direct[use],Q[use]=evaluateParent(int(other),points[use])
   return direct,Q
  tile=np.empty((h,w,3),np.uint8)
  for row in range(0,h,8):
   xx,zz=np.meshgrid(np.arange(w),np.arange(row,min(row+8,h)));points=np.column_stack((lo[0]+xx.ravel()*STEP,lo[1]+zz.ravel()*STEP));d,Q=exact(points);sourceB=np.column_stack((points,np.ones(len(points))))@sourceinv;pv=pos[orig][:,[0,2]];projectedTwiceArea=abs(np.linalg.det(np.column_stack((pv[1]-pv[0],pv[2]-pv[0]))));heights=projectedTwiceArea/np.linalg.norm(np.roll(pv,-1,axis=0)-np.roll(pv,-2,axis=0),axis=1);d[np.any(sourceB*heights < -2*STEP,axis=1)]=0;encoded=np.rint(d*SCALE+128);assert encoded.min()>=0 and encoded.max()<=255, 'ENCODING_RANGE';tile[row:row+xx.shape[0]]=encoded.reshape(*xx.shape,3).astype(np.uint8)
  atlas[py:py+h,px:px+w]=tile
  info={'sourceOffset':o,'group':group,'atlasIndex':gi,'originXZ':lo.tolist(),'width':w,'height':h,'atlasX':px,'atlasY':py};manifest['charts'].append(info);chartData[o]=(tile,info,exact)
  # Every original vertex/edge quarter point/centroid, with source reference Q.
  verts=pos[orig][:,[0,2]];points=np.concatenate([verts,verts.mean(0)[None],*[((1-t)*verts+t*np.roll(verts,1,axis=0)) for t in [.25,.5,.75]]]);direct,Q=exact(points)
  def sample(points):
   uv=(points-lo)/STEP;i=np.floor(uv).astype(int);f=uv-i;i[:,0]=np.clip(i[:,0],0,w-2);i[:,1]=np.clip(i[:,1],0,h-2);a=tile[i[:,1],i[:,0]].astype(float);b=tile[i[:,1],i[:,0]+1].astype(float);cc=tile[i[:,1]+1,i[:,0]].astype(float);dd=tile[i[:,1]+1,i[:,0]+1].astype(float);return (((a*(1-f[:,0,None])+b*f[:,0,None])*(1-f[:,1,None])+(cc*(1-f[:,0,None])+dd*f[:,0,None])*f[:,1,None])-128)/SCALE
  decoded=sample(points);maxCode=max(maxCode,float(abs(display(Q+direct)-display(Q+decoded)).max()));maxLinear=max(maxLinear,float(abs(direct-decoded).max()));nodeCount+=len(points)
  # Store evaluator-independent chart test samples for review, no live closures.
  chartData[o]=(tile,info)
 filename=group.lower()+'-atlas.png';Image.fromarray(atlas).save(OUT/filename);manifest['atlases'].append({'file':filename,'width':WIDTH,'height':height,'sha256':hashlib.sha256((OUT/filename).read_bytes()).hexdigest()});report['groups'].append({'group':group,'sourceEdgeTestSamples':nodeCount,'maxSourceEdgeDisplayError':maxCode,'maxSourceEdgeLinearError':maxLinear,'bytes':(OUT/filename).stat().st_size});print(group,height,maxCode,flush=True)
# Frozen witness world XZ recovered from exact capture, not screen interpolation.
wr=json.load(open('/tmp/diagnostic/receipt.json'))
for pose in ['inland-seam-near','inland-seam-far']:
 a=np.load(f'corrected-output/{pose}-3.npz');x,y=a['pixels'].T;coords=[]
 for mode in ['world-x','world-z']:
  v=next(v for v in wr['views'] if v['pose']['name']==pose and v['mode']==mode);rgb=np.asarray(Image.open('/tmp/diagnostic/'+v['image']))[y,x,:3].astype(np.int64);coords.append(-32768+(rgb@np.array([65536,256,1])-1)/16)
 pts=np.stack(coords,-1);out=[]
 for p,o in zip(pts,a['offsets']):
  tile,ch=chartData[int(o)];uv=(p-np.array(ch['originXZ']))/STEP;ij=np.floor(uv).astype(int);f=uv-ij;ix,iy=ij;assert 0<=ix<ch['width']-1 and 0<=iy<ch['height']-1
  tex=(tile[iy,ix].astype(float)*(1-f[0])+tile[iy,ix+1]*f[0])*(1-f[1])+(tile[iy+1,ix].astype(float)*(1-f[0])+tile[iy+1,ix+1]*f[0])*f[1];out.append((tex-128)/SCALE)
 out=np.array(out);error=abs(display(a['nativeQ']+out)-display(a['correctedQ']));report['witnesses'].append({'pose':pose,'memberships':len(out),'maxDisplayError':float(error.max()),'nativeOutOfGamut':int(np.any((a['nativeQ']+out<0)|(a['nativeQ']+out>1),axis=1).sum())});np.savez_compressed(OUT/(pose+'-export-witnesses.npz'),pixels=a['pixels'],offsets=a['offsets'],nativeQ=a['nativeQ'],directDelta=a['delta'],atlasDelta=out)
report['result']='PASS_EXPORT_SAMPLE_GATE_RENDERER_UNIMPLEMENTED' if max([g['maxSourceEdgeDisplayError'] for g in report['groups']]+[w['maxDisplayError'] for w in report['witnesses']])<=1 and all(w['nativeOutOfGamut']==0 for w in report['witnesses']) else 'REJECT_EXPORT_SAMPLE_GATE'
report['limits']=['Atlas range/edge/witness tests are sampled, not full-scene visual/GPU fidelity.','Original per-parent source identity required in renderer; coordinate-only lookup prohibited.','SignedRGB8 quantization can add small sampled mass error; continuous functional conservation does not transfer automatically to encoded atlas.','No mipmaps; two-cell chart gutters extend only through shared-index neighbours; original triangle interiors retain source identity.','Texture export does not implement renderer or authorize capture.']
(OUT/'atlas-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n');(OUT/'export-report.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
