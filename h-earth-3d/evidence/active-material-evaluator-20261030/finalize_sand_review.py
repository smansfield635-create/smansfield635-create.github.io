"""Compare independent GEOS geometry/source calculations to bounded trace report."""
from pathlib import Path
import sys,json,hashlib
import numpy as np
E,ind,candidate,out=map(Path,sys.argv[1:]);a=json.loads(ind.read_text());r=json.loads(candidate.read_text())
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
assert sha(E/'trace_sand.py')==r['scriptSha256']
for n,h in r['dependencies'].items():assert sha(E/n)==h,n
assert not r['degenerateProjectedIntersections'] and not r['openOcean']['degenerateProjectedIntersections']
assert len(a['intersections'])==len(r['triangleIntervals'])==len(r['pieces'])==2
maxerr=0.
def compare(x,y):
 global maxerr
 err=float(np.max(abs(np.asarray(x)-np.asarray(y))));maxerr=max(maxerr,err);assert err<1e-10,err
for p,h,cp in zip(a['intersections'],r['triangleIntervals'],r['pieces']):
 assert p['surface']==h['surface'] and p['triangleIndex']==h['triangle'];compare(p['interval'],h['interval']);compare(p['slopeUpperBound'],cp['slopeUpperBound']);compare(p['worldYMax'],cp['heightMaximum'])
 assert p['slopeUpperBound']<.012 and p['worldYMax']<2 and max(v['contactDistance'] for v in p['endpointInputs'])<10
 assert min(p['protectionOuterClearances'].values())>0
 for t in p['thresholds']:
  ct=next(x for x in r['thresholds'] if x['contact']==t['contact']);compare(t['t'],ct['t'])
assert len(a['openOceanIntersections'])==len(r['openOcean']['worldXZIntersections'])==3
for p,q in zip(a['openOceanIntersections'],r['openOcean']['worldXZIntersections']):
 assert p['piece']==q['piece'] and p['triangleWithinSpan']==q['triangleWithinSpan'];compare(p['pieceFraction'],q['pieceFraction']);compare(p['terrainMinusOceanYEndpoints'],q['terrainMinusOceanYEndpoints'])
queries=0
for sample in r['samples']:
 for v in sample['parents']:
  p=next(x for x in a['intersections'] if x['triangleIndex']==v['parent']['triangleIndex']);f=(sample['t']-p['interval'][0])/(p['interval'][1]-p['interval'][0]);expected={}
  for k in ['world','normal','contactDistance','coastDistance']:
   lhs,rhs=[np.asarray(e[k]) for e in p['endpointInputs']];expected[k]=lhs+f*(rhs-lhs);compare(expected[k],v['native'][k])
  gate=float(np.clip(expected['contactDistance']+1,0,1));coverage=gate*gate*(3-2*gate);compare(coverage,v['factors']['coverage']);compare(np.ones(3)*(1-coverage),v['sandStage']['gain']);queries+=1
assert queries==r['summary']['sampleQueries']==72
review={'schema':'H_EARTH_SAND_TRACE_INDEPENDENT_REVIEW_v1','verdict':'PASS_BOUNDED_NATIVE_CONTACT_GATE_TRACE','reviewedHashes':{'trace_sand.py':sha(E/'trace_sand.py'),'sand-trace.json':sha(candidate),'independent-sand-geometry.json':sha(ind),'test_sand_trace.py':sha(E/'test_sand_trace.py')},'scope':{'independentGeometryMethod':'GEOS polygon-line intersections, independent from candidate affine halfspace clipper','retainedTriangleIntersections':2,'uploadedOceanIntersections':3,'sourceAttributeAndSandGateQueriesVerified':queries,'maximumNumericDifference':maxerr,'fullMaterialModelReplayed':False},'findings':['Sand coverage equals native smoothstep(-1,0,interpolated contact) throughout the two retained terrain pieces.','Analytic conservative slope and height bounds prove other coverage factors equal one; all protected outer-fringe clearances positive.','Uploaded original ocean co-support spans the full segment within binary64 tolerance; terrain-ocean relative height changes sign.','Interpolated contact zero is not identical to geometric terrain-ocean height crossing; native contact field is a vertex-sampled signed distance interpolated in the shader.','Evidence identifies the existing shoreline contact mechanism and does not establish a defect or repair target.'],'limits':['No GPU, depth visibility, walkability, actual substrate RGB, final lighting or visual acceptance.','All geometry is affine native-array reconstruction in binary64, not exact rational or GPU arithmetic.','Independent source attribute and sand-gain replay covers72 reported parent queries; it does not reproduce all material coefficients.','No mutation, correction, merge, deployment or publication permission.']}
out.write_text(json.dumps(review,indent=2)+'\n');print(json.dumps(review,indent=2))
