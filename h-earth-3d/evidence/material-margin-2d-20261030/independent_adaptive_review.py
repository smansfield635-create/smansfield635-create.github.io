"""Independent float-stage review; not an encoded/GPU qualification."""
from pathlib import Path
import json,hashlib
import numpy as np
from scipy.ndimage import map_coordinates
R=Path(__file__).parent;p=np.load(R/'adaptive-habitat.npz');x=p['x'];z=p['z'];d=p['correction'];a=p['baseline'];b=p['candidate'];active=p['active']
def sample(v,X,Z):return map_coordinates(v,[(Z-z[0])/.5,(X-x[0])/.5],order=1,mode='nearest',prefilter=False)
# Independently defined original geometric core: signed distance beyond source-defined width.
# Sample quarter-cell centers, which expose interpolation support beyond altered vertices.
core_count=leak_count=0;max_leak=0.;witness=None
for start in range(0,len(z)-1,32):
 X,Z=np.meshgrid(x[:-1]+.25,z[start:min(start+32,len(z)-1)]+.25)
 D=sample(p['distance'],X,Z);hi=sample(p['insideBand'],X,Z);lo=sample(p['outsideBand'],X,Z)
 core=(D>=hi)|(D<=-lo);v=sample(d,X,Z);leak=core&(abs(v)>1e-12)
 core_count+=int(core.sum());leak_count+=int(leak.sum())
 if leak.any() and abs(v[leak]).max()>max_leak:
  k=np.argmax(np.where(leak,abs(v),0));max_leak=float(abs(v.flat[k]));witness={'x':float(X.flat[k]),'z':float(Z.flat[k]),'delta':float(v.flat[k]),'signedDistance':float(D.flat[k]),'insideBand':float(hi.flat[k]),'outsideBand':float(lo.flat[k])}
grad=lambda v:np.hypot(*np.gradient(v,.5))
g0=grad(a);g1=grad(b);pz=p['profileZ'];pb=p['profileBaseline'];pc=p['profileCandidate'];m=(pz[:-1]>=-276)&(pz[1:]<=-263);pg0=abs(np.diff(pb)/np.diff(pz));pg1=abs(np.diff(pc)/np.diff(pz))
V=p['contourVertices'];cv=sample(b,V[:,0],V[:,1]);av=sample(a,V[:,0],V[:,1]);qualified=p['contourQualified'];alpha=sample(p['alpha'],V[:,0],V[:,1]);admitted=qualified&(alpha>.999)
report={'inputSha256':hashlib.sha256((R/'adaptive-habitat.npz').read_bytes()).hexdigest(),'format':'FLOAT64_NOT_ENCODED','geometricCoreQuarterCellWitnesses':core_count,'geometricCoreLeakWitnesses':leak_count,'maxGeometricCoreLeak':max_leak,'maxLeakWitness':witness,'activeGradientBaselineQuantiles':np.percentile(g0[active],[50,95,100]).tolist(),'activeGradientCandidateQuantiles':np.percentile(g1[active],[50,95,100]).tolist(),'selectedGradientBaselineMax':float(pg0[m].max()),'selectedGradientCandidateMax':float(pg1[m].max()),'selectedGradientWorstIncrease':float((pg1-pg0)[m].max()),'selectedProfileMaxCoverageChange':float(abs(pc-pb).max()),'admittedNativeContourVertices':int(admitted.sum()),'candidateMaxHalfcoverageErrorOnAdmittedNativeContour':float(abs(cv[admitted]-.5).max()),'baselineMaxHalfcoverageErrorOnSameContour':float(abs(av[admitted]-.5).max()),'changedBaselineHalfcoverageClassifications':int(((a>=.5)!=(b>=.5)).sum()),'disposition':'HOLD_CORE_SUPPORT_AND_JOIN_REVIEW_REQUIRED'}
(R/'independent-adaptive-review.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
