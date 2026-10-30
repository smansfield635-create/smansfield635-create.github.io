#!/usr/bin/env python3
"""Gen3000: select dry-source boundaries from the SAVED verified census arrays.

Never regenerate the 40,960 source samples. Missing array => exact blocker.
"""
import argparse, hashlib, json
from pathlib import Path
import numpy as np

def fail(code): raise ValueError('FAIL_CLOSED:'+code)
def sha(a): return hashlib.sha256(a).hexdigest()
def zero_sand(operands):
    if operands.ndim!=4 or operands.shape[1:]!=(15,2,3): fail('OPERAND_SCHEMA')
    # Native sand blend: gain=(1-coverage), bias=coverage*sandRGB.
    # Strict zero means EXACT gain 1 and bias 0, not a widened epsilon.
    return (operands[:,10,0,:]==1).all(axis=1)&(operands[:,10,1,:]==0).all(axis=1)

def rank_dry(world,coeff,eligible,owners,operands,width,top=10):
    n=len(eligible)
    if n==0 or width<2 or n%width or top<1: fail('GRID_SHAPE')
    if world.shape!=(n,3) or coeff.shape!=(n,2,3) or operands.shape!=(n,15,2,3) or len(owners)!=n: fail('ARRAY_SHAPE')
    dry=zero_sand(operands);g=np.arange(n).reshape(-1,width)
    left=np.r_[g[:,:-1].ravel(),g[:-1,:].ravel()]
    right=np.r_[g[:,1:].ravel(),g[1:,:].ravel()]
    normal=eligible[left]&eligible[right]&(owners[left]==owners[right])
    keep=normal&dry[left]&dry[right]
    a,b=left[keep],right[keep]
    if not len(a): fail('NO_ELIGIBLE_ZERO_SAND_EDGE')
    distances=np.linalg.norm(world[b]-world[a],axis=1)
    if not np.isfinite(distances).all() or (distances<=0).any(): fail('INVALID_DISTANCE')
    delta=coeff[b]-coeff[a]
    if not np.isfinite(delta).all(): fail('NONFINITE_COEFFICIENT')
    scores=np.maximum(abs(delta[:,1]),abs(delta[:,0]+delta[:,1])).max(axis=1)/distances
    ids=np.lexsort((b,a,-scores))[:top]
    rows=[]
    for k in ids:
        i,j=int(a[k]),int(b[k])
        rows.append(dict(gridIndices=[i,j],localXZ=[[-255+2*(i%width),-399+2*(i//width)],[-255+2*(j%width),-399+2*(j//width)]],
           score=float(scores[k]),worldDistanceMetres=float(distances[k]),surface=str(owners[i]),
           deltaA=delta[k,0].tolist(),deltaB=delta[k,1].tolist(),
           sandCoverageExactlyZeroAtBothEndpoints=True,segmentSandVerified=False,oceanOwnershipVerified=False,visibleRasterVerified=False))
    return rows,dict(originalEligibleSameOwnerEdges=int(normal.sum()),dryEligibleEdges=int(keep.sum()),
       excludedForActiveSand=int((normal&~(dry[left]&dry[right])).sum()),dryCenters=int(dry.sum()))

def select(directory,intermediate):
    folder=Path(directory);r=json.loads((folder/'classification.json').read_text())
    if r.get('schema')!='H_EARTH_CONDITIONAL_MATERIAL_CENSUS_v1':fail('REPORT_SCHEMA')
    if sha((folder/'classify_material.py').read_bytes())!=r['scriptSha256']:fail('CLASSIFIER_DRIFT')
    if sha((folder/'material_stages.py').read_bytes())!=r['modelSha256']:fail('MATERIAL_MODEL_DRIFT')
    if len(r['topEdges'])!=20 or any(e['largestPropagatedOperandContribution']!='sand' for e in r['topEdges']):fail('TOP20_DRIFT')
    if not Path(intermediate).is_file():fail('RETAINED_CENSUS_INTERMEDIATES_ABSENT_NO_RERUN')
    with np.load(intermediate,allow_pickle=False) as a:
        for label,key in {'coefficients':'coefficients','orderedContributions':'contributions','localOperands':'operands','eligible':'eligible','world':'world'}.items():
            if key not in a or sha(np.ascontiguousarray(a[key]).tobytes())!=r['intermediateHashes'][label]:fail('ARRAY_IDENTITY_'+key)
        review=json.loads((folder/'classification-review.json').read_text())
        if review['verdict']!='PASS_BOUNDED_CONDITIONAL_SOURCE_CLASSIFICATION':fail('SOURCE_REVIEW_HELD')
        for key,h in review['observedUnboundArrayHashes'].items():
            if key not in a or sha(np.ascontiguousarray(a[key]).tobytes())!=h:fail('REVIEWED_ARRAY_DRIFT_'+key)
        if len(a['eligible'])!=r['grid']['count']:fail('GRID_COUNT')
        rows,counts=rank_dry(a['world'],a['coefficients'],a['eligible'],a['owners'],a['operands'],r['grid']['width'])
    bound=r['topEdges'][-1]['conditionalCoefficientBoundPerMetre']
    if rows[0]['score']>bound+1e-12:fail('CENSUS_RANK_INCONSISTENT')
    return dict(schema='H_EARTH_GEN3000_ZERO_SAND_PAIR_SELECTION_v1',
      result='ZERO_SAND_ENDPOINT_CANDIDATE_SELECTED_CONTEXT_UNQUALIFIED',
      sourceHead=r['sourceHead'],inputReportSha256=sha((folder/'classification.json').read_bytes()),
      maximumRankFromKnownTop20=bound,counts=counts,top=rows,
      nextAction='TRACE_SOURCE_SEGMENT_OCEAN_PROTECTION_AND_RASTER_CONTEXT',
      noGPU=True,noProductChanges=True,notVisualRepair=True)

if __name__=='__main__':
    cli=argparse.ArgumentParser()
    cli.add_argument('evidence');cli.add_argument('intermediates');cli.add_argument('--report',required=True)
    p=cli.parse_args()
    try:result=select(p.evidence,p.intermediates);code=0
    except Exception as exc:result=dict(schema='H_EARTH_GEN3000_ZERO_SAND_PAIR_SELECTION_v1',result='FAIL_CLOSED',
      firstFailedAssertion=str(exc),candidateSelected=False,noGPU=True,noProductChanges=True);code=2
    Path(p.report).write_text(json.dumps(result,indent=2)+'\n')
    print(json.dumps(dict(result=result['result'],firstFailedAssertion=result.get('firstFailedAssertion'),top=result.get('top',[None])[0])))
    raise SystemExit(code)
