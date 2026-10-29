"""Strict Float32 CPU source-field screen, not GPU arithmetic equivalence proof.
Bounds cover coordinate uncertainty for fixed CPU lattice hashes; no fit/tuning.
"""
from pathlib import Path
import hashlib,json,itertools
import numpy as np
from PIL import Image
SOURCE='fa6acc426c75c3b2292b3ed76a756157698d8e7a5562511ad7ced5af58e25dec'
F=np.float32

def fract(x): return x-np.floor(x)
def hash32(p):
 p=np.asarray(p,dtype=np.float32);p=fract(p*np.array([123.34,456.21],dtype=np.float32))
 q=p+F(45.32);v=p*q;dot=(v[...,0]+v[...,1]).astype(np.float32)
 p=(p+dot[...,None]).astype(np.float32)
 return fract(p[...,0]*p[...,1])
def noise32(p):
 p=np.asarray(p,dtype=np.float32);i=np.floor(p);f=fract(p);f=f*f*(F(3)-F(2)*f)
 # Explicit non-fused a*(1-t)+b*t mix, as commonly lowered. Alternative lowering is not certified.
 mix=lambda a,b,t:a*(F(1)-t)+b*t
 return mix(mix(hash32(i),hash32(i+np.array([1,0],dtype=F)),f[...,0]),mix(hash32(i+np.array([0,1],dtype=F)),hash32(i+F(1)),f[...,0]),f[...,1])
def hash64(p):
 p=np.asarray(p,dtype=float);p=fract(p*np.array([123.34,456.21]));p=p+np.sum(p*(p+45.32),axis=-1)[...,None];return fract(p[...,0]*p[...,1])
def noise64(p):
 i=np.floor(p);f=fract(p);f=f*f*(3-2*f);mix=lambda a,b,t:a*(1-t)+b*t
 return mix(mix(hash64(i),hash64(i+[1,0]),f[...,0]),mix(hash64(i+[0,1]),hash64(i+[1,1]),f[...,0]),f[...,1])

def capture(root):
 r=json.loads((root/'receipt.json').read_text());out={}
 for v in r['views']:
  p=root/v['image'];assert hashlib.sha256(p.read_bytes()).hexdigest()==v['imageSha256'];out[v['pose']['name'],v['mode']]=np.asarray(Image.open(p).convert('RGBA'))
 return r,out

def coord_enclosure(xz,scale,offset):
 # Monotone Float32 transforms of closed measured scalar intervals. Include each integer grid crossing.
 eps=.625/16
 low=(np.asarray(xz-eps,dtype=F)*F(scale)+np.asarray(offset,dtype=F)).astype(F)
 high=(np.asarray(xz+eps,dtype=F)*F(scale)+np.asarray(offset,dtype=F)).astype(F)
 lower=[];upper=[]
 for a,b in zip(low,high):
  axes=[]
  for x,y in zip(a,b):
   values=[float(x),float(y)]+list(range(int(np.ceil(x)),int(np.floor(y))+1));axes.append(values)
  pts=np.array(list(itertools.product(*axes)),dtype=F)
  vals=noise32(pts)
  lower.append(float(vals.min()));upper.append(float(vals.max()))
 return np.asarray(lower),np.asarray(upper)

def run():
 root=Path('/tmp/material-cpu');source=Path('/tmp/world-renderer.js');assert hashlib.sha256(source.read_bytes()).hexdigest()==SOURCE
 ir,imgs=capture(Path('/tmp/old-diagnostic'));wr,wimgs=capture(Path('/tmp/diagnostic'));rows=[];examples=[]
 for pose,y0,y1 in [('inland-seam-near',260,300),('inland-seam-far',470,520)]:
  yy=np.repeat(np.arange(y0,y1+1),27);xx=np.tile(np.r_[128:137,260:269,392:401],y1-y0+1)
  coords=[]
  for mode in ['world-x','world-z']:
   rgb=wimgs[pose,mode][yy,xx,:3].astype(np.int64);code=rgb[:,0]*65536+rgb[:,1]*256+rgb[:,2];assert np.all((code>0)&(code<16777215));coords.append(-32768+(code-1)/16)
  xz=np.stack(coords,axis=-1)
  raw=imgs[pose,'identity-noise-factors-raw'][yy,xx,:3].astype(float)
  for k,(name,scale,offset) in enumerate([('macro',.018,[5,-11]),('meso',.082,[-13,7]),('detail',.29,[29,-17])]):
   p=(xz.astype(F)*F(scale)+np.asarray(offset,dtype=F)).astype(F);n=noise32(p).astype(float);n64=noise64(xz*scale+offset)
   obs=raw[:,k]/255;ol=np.maximum(raw[:,k]-1,0)/255;oh=np.minimum(raw[:,k]+1,255)/255
   lo,hi=coord_enclosure(xz,scale,offset)
   # No arbitrary widening. Crossing errors include floating operation envelope uncertainty.
   bad=(lo>oh)|(hi<ol);nom=(n<ol)|(n>oh);db=np.maximum(lo-oh,ol-hi)
   rows.append({'pose':pose,'field':name,'samples':len(xx),'strictFloat32NominalOutsideArchivedInterval':int(nom.sum()),'coordinateBoxEnvelopeDisjointCount':int(bad.sum()),'nominalAbsoluteCodeErrorMedianMax':[float(np.median(abs(n-obs)*255)),float(np.max(abs(n-obs)*255))],'coordinateEnvelopeWidthMedianMax':[float(np.median(hi-lo)),float(np.max(hi-lo))],'maximumDisjointGapCodes':float(max(0,db.max())*255),'float64NominalAbsoluteCodeErrorMedianMax':[float(np.median(abs(n64-obs)*255)),float(np.max(abs(n64-obs)*255))]})
   for i in np.where(bad)[0][:5]:examples.append({'pose':pose,'field':name,'pixel':[int(xx[i]),int(yy[i])],'measuredXZ':xz[i].tolist(),'capturedCode':int(raw[i,k]),'cpuNominal':float(n[i]),'cpuCoordinateBoxEnvelope':[float(lo[i]),float(hi[i])],'capturedInterval':[float(ol[i]),float(oh[i])]})
 report={'schema':'H_EARTH_CPU_SOURCE_NOISE_REPLAY_SCREEN_v1','result':'SOURCE_FLOAT32_REPLAY_NOT_GPU_EQUIVALENT' if any(r['coordinateBoxEnvelopeDisjointCount'] for r in rows) else 'COORDINATE_CONDITIONED_SCREEN_COMPATIBLE_NOT_CERTIFIED','sourceHead':ir['heads']['candidate'],'rendererSha256':SOURCE,'coordinateHalfWidthMeters':.625/16,'groups':rows,'firstCounterexamples':examples,'inputReceipts':{n:hashlib.sha256(Path(p).read_bytes()).hexdigest() for n,p in [('identity','/tmp/old-diagnostic/receipt.json'),('world','/tmp/diagnostic/receipt.json')]},'method':['Implement source hash21/noise2 using NumPy Float32 and explicit nonfused operations.','Use each captured XZ decoded center for nominal prediction; use .625-bin coordinate boxes for input uncertainty.','Transform coordinate interval endpoints with Float32 scale/offset; split at integer grid crossings and evaluate all subcell corners. For fixed lattice hashes the mathematical bilinear-in-monotone-smoothstep range has corner extrema.','Compare against inherited +/-1RGB8-code archived factor intervals; no fitted epsilon or rejected-point removal.','Float64 implementation supplied as a separate contrast, not presumed truth.'],'limits':['Corner envelopes are for the strict CPU operation model and spatial uncertainty; they do not certify every Float32 rounding interior extremum.','GLSL dot/mix contraction, intermediate rounding and implementation arithmetic can differ from this CPU model. Hash fract amplifies arithmetic differences.','A mismatch establishes this CPU emulator is inadequate; it does not identify the GPU defect or invalidate byte-calibrated captures.','Source noise cell inputs use measured interpolated shader position, not ideal surface-ray reconstruction.','No GPU, product mutation, fine-reference field or candidate appearance claimed.']}
 (root/'source-fields-result.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({'result':report['result'],'groups':rows},indent=2))
if __name__=='__main__':run()
