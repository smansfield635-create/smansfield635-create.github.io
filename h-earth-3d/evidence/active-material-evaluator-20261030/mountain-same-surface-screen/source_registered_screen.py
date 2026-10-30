#!/usr/bin/env python3
"""H-Earth Gen3000 read-only historical mountain screen triage.
Exact frozen mesh + original archived stage images; NO product or GPU mutation.
Requires numpy scipy pillow. CLI --mesh-zip --stage-zip --ridge-zip --output.
"""
import argparse, hashlib, io, json, math, zipfile
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter, maximum_filter

SHA={
 'mesh':'5bfce62703c70fd5b68e894fca8634e5206c1ca681d7a127c192312a8e06aa3c',
 'stages':'df23ee1d2b697ba09c3e805b42d790708900c04dd80d3b153953589bf4eda539',
 'ridge':'08783a00f26d39a8145c58f5a7b8e35d4967c3f0bdb513e2b4da976436332d38',
 'positions':'342a2a788009410bf48a6b5889a55cad4afd97552ff02b72f98b1308f7f84b83',
 'indices':'483f7693f29225e52fa90700837015741e78edb291de9adb785a8db3a74d616c'
}
CAMERA=[88.00614407254056,29.26418157783337,-260.0181529415971]
MODES=['reference-lit','pre-worldsoil-unlit','post-worldsoil-unlit','post-identity-unlit','primitive-role-raw','worldsoil-weight-raw','identity-weight-raw']

def verify_file(path,expected):
 h=hashlib.sha256()
 with open(path,'rb') as f:
  for chunk in iter(lambda:f.read(1<<20),b''):h.update(chunk)
 got=h.hexdigest()
 if got!=expected:raise ValueError(f'input identity mismatch {path}: {got}')
 return got

def zip_read(z,name):
 data=z.read(name)
 if len(data)==0:raise ValueError(f'empty required item {name}')
 return data

def build(args):
 for key,path in [('mesh',args.mesh_zip),('stages',args.stage_zip),('ridge',args.ridge_zip)]:verify_file(path,SHA[key])
 with zipfile.ZipFile(args.mesh_zip) as z:
  assert z.testzip() is None
  prefix='evidence-inputs/original-mesh/mesh/'
  Vbytes=zip_read(z,prefix+'upload-positions.bin');Ibytes=zip_read(z,prefix+'upload-indices.bin')
  assert hashlib.sha256(Vbytes).hexdigest()==SHA['positions']
  assert hashlib.sha256(Ibytes).hexdigest()==SHA['indices']
  V=np.frombuffer(Vbytes,'<f4').reshape(-1,3).astype('f8')
  N=np.frombuffer(zip_read(z,prefix+'upload-normals.bin'),'<f4').reshape(-1,3).astype('f8')
  I=np.frombuffer(Ibytes,'<u4').reshape(-1,3)
  meta=json.loads(zip_read(z,prefix+'package.json'))
  spans=meta['primitiveSpans']
  assert V.shape==(141373,3) and I.shape==(122222,3) and N.shape==V.shape
 with zipfile.ZipFile(args.stage_zip) as z:
  assert z.testzip() is None
  rec=json.loads(z.read('receipt.json'))
  assert rec['sourceProductSha256']=='fa6acc426c75c3b2292b3ed76a756157698d8e7a5562511ad7ced5af58e25dec'
  assert rec['heads']['baseline']=='cb57c275b95d0d48883bc4da4dcfcf17cbec5060'
  image={}
  for mode in MODES:
   names=[n for n in z.namelist() if n.endswith('-'+mode+'.png')]
   assert len(names)==1,(mode,names)
   image[mode]=np.asarray(Image.open(io.BytesIO(z.read(names[0]))).convert('RGB')).astype('f4')
 with zipfile.ZipFile(args.ridge_zip) as z:
  assert z.testzip() is None
  rg=json.loads(z.read('receipt.json'))
  assert rg['heads']['baseline']=='cb57c275b95d0d48883bc4da4dcfcf17cbec5060' and rg['sourceProductSha256']=='fa6acc426c75c3b2292b3ed76a756157698d8e7a5562511ad7ced5af58e25dec'
 H,W=image['reference-lit'].shape[:2]
 assert (W,H)==(529,980)
 C=np.array(CAMERA);yaw=math.radians(118);pitch=math.radians(-13)
 forward=np.array([math.sin(yaw)*math.cos(pitch),math.sin(pitch),-math.cos(yaw)*math.cos(pitch)])
 right=np.cross(forward,[0,1,0]);right/=np.linalg.norm(right)
 up=np.cross(right,forward);up/=np.linalg.norm(up)
 tan=math.tan(math.radians(28))
 A=V[I[:,0]];E1=V[I[:,1]]-A;E2=V[I[:,2]]-A
 mask=(image['primitive-role-raw'][:,:,0]==255)&(image['primitive-role-raw'][:,:,1]==0)&(image['primitive-role-raw'][:,:,2]==0)
 def ray(x,y):
  d=forward+((2*(x+.5)/W-1)*W/H*tan)*right+((1-2*(y+.5)/H)*tan)*up;d/=np.linalg.norm(d)
  p=np.cross(np.broadcast_to(d,E2.shape),E2)
  det=np.einsum('ij,ij->i',E1,p);ok=np.abs(det)>1e-12
  inv=np.divide(1,det,out=np.zeros_like(det),where=ok)
  T=C-A;B=np.einsum('ij,ij->i',T,p)*inv;Q=np.cross(T,E1);D=np.einsum('j,ij->i',d,Q)*inv;t=np.einsum('ij,ij->i',E2,Q)*inv
  ok&=(B>=-1e-7)&(D>=-1e-7)&(B+D<=1+1e-7)&(t>=.25)&(t<=1200)
  ii=np.flatnonzero(ok)
  if not len(ii):return None
  k=int(ii[np.argmin(t[ii])]);dist=float(t[k]);xyz=(C+dist*d).tolist()
  normal=(1-B[k]-D[k])*N[I[k,0]]+B[k]*N[I[k,1]]+D[k]*N[I[k,2]]
  normal=normal/np.linalg.norm(normal)
  ofs=k*3;span=next((s for s in spans if s['indexStart']<=ofs<s['indexStart']+s['indexCount']),None)
  return {'xyz':xyz,'distance':dist,'normal':normal.tolist(),'triangleOffset':ofs,'roleCode':span['roleCode'] if span else None,'primitive':span['primitiveId'] if span else None,'slope':float(1-np.clip(normal[1],0,1))}

 pairs=[];half=3
 for mode in ['reference-lit','post-worldsoil-unlit','post-identity-unlit']:
  sm=gaussian_filter(image[mode],(1.,1.,0))
  for direction in ['H','V']:
   if direction=='H':
    diff=np.linalg.norm(sm[:,2*half:]-sm[:,:-2*half],axis=2);valid=mask[:,2*half:]&mask[:,:-2*half]
    score=np.full((H,W),-1.,dtype='f4');score[:,half:W-half]=np.where(valid,diff,-1)
   else:
    diff=np.linalg.norm(sm[2*half:]-sm[:-2*half],axis=2);valid=mask[2*half:]&mask[:-2*half]
    score=np.full((H,W),-1.,dtype='f4');score[half:H-half,:]=np.where(valid,diff,-1)
   score[:10,:]=-1;score[-10:,:]=-1;score[:,:10]=-1;score[:,-10:]=-1
   ys,xs=np.where((score==maximum_filter(score,size=21,mode='nearest'))&(score>5))
   ranked=sorted(zip(ys.tolist(),xs.tolist()),key=lambda q:-float(score[q]))[:80]
   for y,x in ranked:
    a,b=((x-half,y),(x+half,y)) if direction=='H' else ((x,y-half),(x,y+half))
    pairs.append({'mode':mode,'direction':direction,'pair':[[*a],[*b]],'score':float(score[y,x])})
 seen=set();selected=[]
 for p in sorted(pairs,key=lambda v:-v['score']):
  key=tuple(tuple(v) for v in p['pair'])
  if key not in seen:seen.add(key);selected.append(p)
 cache={};sample=[]
 for p in selected:
  a,b=p['pair'];v=[]
  for pt in (a,b):
   key=tuple(pt)
   if key not in cache:cache[key]=ray(*pt)
   v.append(cache[key])
  if any(q is None for q in v):continue
  sep=float(np.linalg.norm(np.array(v[0]['xyz'])-v[1]['xyz']));depth=abs(v[0]['distance']-v[1]['distance'])
  angle=float(np.degrees(np.arccos(np.clip(np.dot(v[0]['normal'],v[1]['normal']),-1,1))))
  same=v[0]['primitive']==v[1]['primitive'] and v[0]['roleCode']==v[1]['roleCode']==1
  preliminary=bool(same and sep<5 and depth<5 and angle<35)
  stage={}
  for mode,img in image.items():
   first=img[a[1],a[0]];last=img[b[1],b[0]]
   stage[mode]={'delta':(last-first).astype(int).tolist(),'magnitude':round(float(np.linalg.norm(last-first)),3)}
  sample.append({'pair':p['pair'],'peakStage':p['mode'],'orientation':p['direction'],'peakContrast':round(p['score'],4),'worldSeparationMeters':round(sep,5),'depthDifferenceMeters':round(depth,5),'normalAngleDegrees':round(angle,4),'sameTerrainRole':bool(same),'preliminaryContinuous':preliminary,'surfaceHits':v,'stages':stage})
 prelim=[s for s in sample if s['preliminaryContinuous']]
 meaningful=[s for s in prelim if .1<=s['worldSeparationMeters']<=5 and s['stages']['post-worldsoil-unlit']['magnitude']>=20]
 overview={
  'candidatesConsidered':len(selected),'rayPairsResolved':len(sample),'sameTerrainRolePairs':sum(s['sameTerrainRole'] for s in sample),
  'preliminaryContinuous':len(prelim),'continuousUnderPointOneMetres':sum(s['worldSeparationMeters']<.1 for s in prelim),
  'continuousPointOneToOneMetre':sum(.1<=s['worldSeparationMeters']<1 for s in prelim),
  'continuousOneToFiveMetres':sum(1<=s['worldSeparationMeters']<5 for s in prelim),
  'rejectedPreliminary':len(sample)-len(prelim),'preliminaryContinuousHighPostworldsoilContrastAtMeaningfulSpan':len(meaningful)
 }
 report={'schema':'H_EARTH_GEN3000_FROZEN_MOUNTAIN_SAME_SURFACE_SCREEN_v1','status':'SCREEN_NEGATIVE_REQUIRES_ALTERNATE_OWNER_DEFECT_CAMERA','sourceHead':'cb57c275b95d0d48883bc4da4dcfcf17cbec5060','sha256':SHA,'viewport':[W,H],'camera':CAMERA,'method':'6px peak side pair; gaussian sigma1, 21px maximum filter and 80 peaks per source stage/orientation; exact original uploaded mesh rays; preliminary continuity requires same ordinary terrain role, <5m world separation, <5m depth difference, <35 degrees normal angle; meaningful-span screen test additionally >=0.1m and post-worldsoil unlit RGB magnitude>=20/255 (heuristic, not universal closure)','overview':overview,'screenPairs':sample,'limitations':['preliminary continuity is NOT verified shared topology: sampled positions can still straddle an occlusion','screen selection excludes gradients outside sampled ranked peaks','submetre near-field texture peaks do not establish a wide tan/olive border','archived image is old published Gen2928 product, not current frozen candidate 3ea','the two owner Android photographs lack world camera telemetry and do not match this proven archived pose','screen threshold is only a triage heuristic, not proof that other views or the world are defect-free']}
 Path(args.output).write_text(json.dumps(report,indent=2)+'\n')
 print(json.dumps(overview,indent=2))
 return report

def main():
 ap=argparse.ArgumentParser();ap.add_argument('--mesh-zip',type=Path,required=True);ap.add_argument('--stage-zip',type=Path,required=True);ap.add_argument('--ridge-zip',type=Path,required=True);ap.add_argument('--output',type=Path,required=True)
 args=ap.parse_args();build(args)
if __name__=='__main__':main()