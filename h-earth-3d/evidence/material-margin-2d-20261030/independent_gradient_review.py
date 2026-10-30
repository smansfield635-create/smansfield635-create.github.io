"""Independent decoded candidate review; run only after both LP phases complete."""
from pathlib import Path
import hashlib,json,sys
import numpy as np
from scipy.ndimage import map_coordinates,label
STEM=sys.argv[1] if len(sys.argv)>1 else 'gradient-constrained-margin'
R=Path(__file__).parent;p=np.load(R/'adaptive-habitat.npz');report=json.loads((R/(STEM+'.json')).read_text());assert report.get('minimumChangePhaseSuccess'), 'Current result predates completed second phase'
q=np.load(R/(STEM+'.npz'));base=p['baseline'];delta=q['correction'];cand=base+delta;h,w=base.shape
allowed=(p['insideBand']-p['distance']>0)&(p['outsideBand']+p['distance']>0)&(p['alpha']>0)
ok=np.ones((h-1,w-1),bool);changed=np.zeros_like(ok)
for j,i in [(0,0),(0,1),(1,0),(1,1)]:
 ok&=allowed[j:h-1+j,i:w-1+i];changed|=(delta[j:h-1+j,i:w-1+i]!=0)
assert not np.any(changed&~ok)
# Exact max of bilinear gradient norm over each cell occurs at a corner,
# because gradient is affine and its norm convex on the rectangular cell.
def continuous_grad(a):
 a00=a[:-1,:-1];a10=a[:-1,1:];a01=a[1:,:-1];a11=a[1:,1:]
 return np.maximum.reduce([np.hypot(dx,dy)*2 for dx in [a10-a00,a11-a01] for dy in [a01-a00,a11-a10]])
g0=continuous_grad(base);g1=continuous_grad(cand)
# Exact baseline bilinear contour interior witnesses: solve v at chosen u.
res=[];flo=[]
a=base[:-1,:-1];b=base[:-1,1:]-a;c=base[1:,:-1]-a;d=base[1:,1:]-a-b-c
for u in [.13,.37,.61,.89]:
 denom=c+d*u;v=np.divide(.5-a-b*u,denom,out=np.full_like(a,-1),where=abs(denom)>1e-15);m=(v>=0)&(v<=1)&changed
 for field,dest in [(delta,res),(q['floatCorrection'],flo)]:
  val=(1-u)*(1-v)*field[:-1,:-1]+u*(1-v)*field[:-1,1:]+(1-u)*v*field[1:,:-1]+u*v*field[1:,1:];dest.extend(abs(val[m]).tolist())
def topo(a):
 _,n=label(a>=.5);l,k=label(a<.5);border=set(np.r_[l[0],l[-1],l[:,0],l[:,-1]]);return {'highComponents':int(n),'lowHoles':sum(i not in border for i in range(1,k+1))}
z=p['profileZ'];pb=p['profileBaseline'];co=[(z-p['z'][0])/.5,np.full(len(z),(165.6666666667-p['x'][0])/.5)];pc=pb+map_coordinates(delta,co,order=1,mode='nearest',prefilter=False);m=(z[:-1]>=-276)&(z[1:]<=-263)
r={'inputSha256':hashlib.sha256((R/(STEM+'.npz')).read_bytes()).hexdigest(),'bothPhasesCompleted':True,'unsafeChangedCells':int((changed&~ok).sum()),'candidateEnvelope':[float(cand.min()),float(cand.max())],'nodeHalfClassChanges':int(((base>=.5)!=(cand>=.5)).sum()),'baselineTopology':topo(base),'candidateTopology':topo(cand),'continuousBilinearMaxGradientOnChangedCellsBaseline':float(g0[changed].max()),'continuousBilinearMaxGradientOnChangedCellsCandidate':float(g1[changed].max()),'exactBilinearContourInteriorWitnesses':len(res),'decodedContourMaxResidual':max(res,default=0),'floatContourMaxResidual':max(flo,default=0),'selectedGradientBaselineMax':float((abs(np.diff(pb)/np.diff(z)))[m].max()),'selectedGradientCandidateMax':float((abs(np.diff(pc)/np.diff(z)))[m].max()),'selectedMaxCoverageChange':float(abs(pc-pb).max()),'runtimeOrVisualQualified':False}
r['disposition']='HOLD_REVIEW_NUMERIC_RESULTS';(R/('independent-'+STEM+'-review.json')).write_text(json.dumps(r,indent=2)+'\n');print(json.dumps(r,indent=2))
