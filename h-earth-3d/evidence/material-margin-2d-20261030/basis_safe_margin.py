"""Predeclared-core-safe bilinear correction support.
Every nonzero vertex is admitted only if ALL four incident cells are contained
in both original bilinear margin inequalities. This is a continuous-domain proof,
not a changed-output-derived definition of the protected core.
"""
from pathlib import Path
import hashlib,json
import numpy as np
from scipy.ndimage import map_coordinates
R=Path(__file__).resolve().parent

def supported_vertices(distance,inside_band,outside_band,domain):
 arrays=[np.asarray(v,float) for v in (distance,inside_band,outside_band,domain)]
 if len({a.shape for a in arrays})!=1 or arrays[0].ndim!=2 or min(arrays[0].shape)<3 or not all(np.isfinite(a).all() for a in arrays):raise ValueError('INVALID_GRID')
 d,hi,lo,g=arrays
 # A bilinear scalar is a convex combination of its cell's four corner values.
 # Thus hi-D>0 and lo+D>0 at all corners imply no core point in that cell.
 corners=(hi-d>0)&(lo+d>0)&(g>0)
 cells=corners[:-1,:-1]&corners[1:,:-1]&corners[:-1,1:]&corners[1:,1:]
 vertices=np.zeros_like(corners)
 vertices[1:-1,1:-1]=cells[:-1,:-1]&cells[1:,:-1]&cells[:-1,1:]&cells[1:,1:]
 return vertices,cells

def project(correction,distance,inside_band,outside_band,domain):
 c=np.asarray(correction,float)
 safe,cells=supported_vertices(distance,inside_band,outside_band,domain)
 if c.shape!=safe.shape or not np.isfinite(c).all():raise ValueError('INVALID_CORRECTION')
 out=np.zeros_like(c);out[safe]=c[safe]
 return out,safe,cells

def encode_rg8(c,scale=1024):
 if np.max(abs(c))>255/scale:raise ValueError('CORRECTION_RANGE')
 pos=np.floor(np.maximum(c,0)*scale+.5).astype('u1');neg=np.floor(np.maximum(-c,0)*scale+.5).astype('u1')
 return np.stack([pos,neg],-1)

def main():
 p=np.load(R/'adaptive-habitat.npz');c,safe,cells=project(p['correction'],p['distance'],p['insideBand'],p['outsideBand'],p['alpha'])
 rg=encode_rg8(c);decoded=(rg[...,0].astype(float)-rg[...,1].astype(float))/1024
 x,z=p['x'],p['z'];sample=lambda a,X,Z:map_coordinates(a,[(Z-z[0])/.5,(X-x[0])/.5],order=1,mode='nearest',prefilter=False)
 checks=[]
 for frac in [.125,.25,.5,.75,.875]:
  core_count=0;leaks=0;maxleak=0.
  for start in range(0,len(z)-1,32):
   X,Z=np.meshgrid(x[:-1]+frac*.5,z[start:min(start+32,len(z)-1)]+frac*.5)
   d=sample(p['distance'],X,Z);hi=sample(p['insideBand'],X,Z);lo=sample(p['outsideBand'],X,Z);core=(d>=hi)|(d<=-lo)
   v=sample(decoded,X,Z);core_count+=int(core.sum());leaks+=int((core&(v!=0)).sum());maxleak=max(maxleak,float(abs(v[core]).max(initial=0)))
  checks.append({'cellFraction':frac,'predefinedCoreWitnesses':core_count,'leaks':leaks,'maxLeak':maxleak})
 baseline=p['baseline'];candidate=baseline+decoded;grad=lambda a:np.hypot(*np.gradient(a,.5));g0,g1=grad(baseline),grad(candidate)
 pz=p['profileZ'];pb=p['profileBaseline'];pc=pb+sample(decoded,np.full(len(pz),165.6666666667),pz);m=(pz[:-1]>=-276)&(pz[1:]<=-263);pg0=abs(np.diff(pb)/np.diff(pz));pg1=abs(np.diff(pc)/np.diff(pz))
 active=p['active'];report={'schema':'H_EARTH_BILINEAR_BASIS_CORE_GUARD_v1','sourceSha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'inputSha256':hashlib.sha256((R/'adaptive-habitat.npz').read_bytes()).hexdigest(),'encoding':'RG8_SIGNED_MAGNITUDE_SCALE1024_ZERO_EXACT','safeVertices':int(safe.sum()),'changedVertices':int((decoded!=0).sum()),'suppressedUnsafeVertices':int(((p['correction']!=0)&~safe).sum()),'checks':checks,'globalCoreSupportProof':'Each nonzero basis has four incident cells; both original bilinear inequalities strictly hold at every corner, hence throughout each cell. No core definition changed.','activeGradientMaxBaseline':float(g0[active].max()),'activeGradientMaxCandidate':float(g1[active].max()),'selectedGradientMaxBaseline':float(pg0[m].max()),'selectedGradientMaxCandidate':float(pg1[m].max()),'selectedProfileMaxChange':float(abs(pc-pb).max()),'quantizationMaxError':float(abs(c-decoded).max()),'coreGuardPass':all(q['leaks']==0 for q in checks),'runtimeIntegrated':False,'visualAcceptance':False}
 report['transitionGuardPass']=report['selectedGradientMaxCandidate']<report['selectedGradientMaxBaseline'] and report['activeGradientMaxCandidate']<=report['activeGradientMaxBaseline']
 report['disposition']='CORE_SUPPORT_REPAIRED_TRANSITION_REVIEW_REQUIRED' if report['coreGuardPass'] else 'REJECT_CORE_FAILURE'
 np.savez_compressed(R/'basis-safe-margin.npz',correction=decoded,rg8=rg,safeVertices=safe,safeCells=cells,profileCandidate=pc)
 (R/'basis-safe-margin.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
if __name__=='__main__':main()
