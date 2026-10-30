"""West independent tests for symmetric, ordered affine operand attribution.

This is algebra, not validation of shader operands or rendered colors.
"""
from pathlib import Path
import json,sys,itertools
import numpy as np

def trace(operations):
    a=np.ones(3);b=np.zeros(3);result=[]
    for i,op in enumerate(operations):
        row=dict(id=str(i))
        if op[0]=='affine':
            g,v=map(np.asarray,op[1:]);a=g*a;b=g*b+v;row.update(gain=g.tolist(),bias=v.tolist())
        else:
            da,db=map(np.asarray,op[1:]);a=a+da;b=b+db;row.update(addA=da.tolist(),addB=db.tolist())
        row.update(A=a.tolist(),B=b.tolist());result.append(row)
    return result

def symmetric(left,right):
    """Independent midpoint product identity implemented in6D coefficient space."""
    prev_l=np.r_[np.ones(3),np.zeros(3)];prev_r=prev_l.copy();terms=[]
    for l,r in zip(left,right):
        assert l['id']==r['id']
        if 'gain' in l:
            gl=np.tile(l['gain'],2);gr=np.tile(r['gain'],2)
            mean=(gl+gr)/2;delta=gr-gl
            terms=[v*mean for v in terms]
            terms.append(delta*(prev_l+prev_r)/2+np.r_[np.zeros(3),np.array(r['bias'])-l['bias']])
        else:
            terms.append(np.r_[np.array(r['addA'])-l['addA'],np.array(r['addB'])-l['addB']])
        prev_l=np.r_[l['A'],l['B']];prev_r=np.r_[r['A'],r['B']]
    return np.array(terms)

def bound(coeff,distance):
    a,b=np.asarray(coeff[:3]),np.asarray(coeff[3:]);return float(np.maximum(abs(b),abs(a+b)).max()/distance)

def main():
    rng=np.random.default_rng(60003000);max_sum_error=0;max_bound_error=0;cases=1000
    for _ in range(cases):
        left=[];right=[]
        for i in range(15):
            if i==3:
                left.append(('add',rng.normal(0,.3,3),rng.normal(0,.3,3)))
                right.append(('add',rng.normal(0,.3,3),rng.normal(0,.3,3)))
            else:
                left.append(('affine',rng.uniform(0,1.2,3),rng.normal(0,.3,3)))
                right.append(('affine',rng.uniform(0,1.2,3),rng.normal(0,.3,3)))
        L,R=trace(left),trace(right);parts=symmetric(L,R);delta=np.r_[R[-1]['A'],R[-1]['B']]-np.r_[L[-1]['A'],L[-1]['B']]
        error=float(abs(parts.sum(axis=0)-delta).max());max_sum_error=max(max_sum_error,error);assert error<1e-12
        distance=float(rng.uniform(.1,10));score=bound(delta,distance)
        corners=np.array(list(itertools.product([0.,1.],repeat=3)))
        direct=float(abs(corners*delta[:3]+delta[3:]).max()/distance)
        max_bound_error=max(max_bound_error,abs(score-direct));assert abs(score-direct)<1e-14
    # Unchanged downstream .25 gain injects nothing and scales previous variation.
    L=trace([('affine',[1]*3,[0]*3),('affine',[.25]*3,[.1]*3)])
    R=trace([('affine',[.5]*3,[.2]*3),('affine',[.25]*3,[.1]*3)])
    parts=symmetric(L,R);np.testing.assert_array_equal(parts[1],np.zeros(6));np.testing.assert_allclose(parts[0],[-.125]*3+[.05]*3)
    # Different upstream paths cancel at full replacement, including margin delta.
    L=trace([('affine',[.4]*3,[.1]*3),('add',[.1]*3,[.2]*3),('affine',[0]*3,[.3]*3)])
    R=trace([('affine',[.8]*3,[.4]*3),('add',[.3]*3,[.1]*3),('affine',[0]*3,[.3]*3)])
    np.testing.assert_array_equal(symmetric(L,R),np.zeros((3,6)))
    # Changes in gain and bias may oppose, so sum scalar magnitudes is NOT total.
    L=trace([('affine',[1]*3,[0]*3),('affine',[1]*3,[0]*3)])
    R=trace([('affine',[1]*3,[.2]*3),('affine',[1]*3,[-.2]*3)])
    parts=symmetric(L,R);assert sum(bound(v,1) for v in parts)>.39;assert bound(parts.sum(axis=0),1)==0
    report=dict(schema='H_EARTH_SYMMETRIC_ATTRIBUTION_ALGEBRA_REVIEW_v1',seed=60003000,randomCases=cases,stagesPerCase=15,marginAdditiveStageIndex=3,maxCoefficientSumError=max_sum_error,maxCubeBoundError=max_bound_error,adversarialCases=['CONSTANT_DOWNSTREAM_GAIN_ATTENUATES_WITHOUT_OWN_INJECTION','FULL_REPLACEMENT_ERASES_ALL_UPSTREAM_AND_MARGIN_INFLUENCE','OPPOSING_STAGE_INJECTIONS_CANCEL_SIGNED'],result='PASS_ALGEBRA_ONLY',limits=['This verifies the midpoint-product allocation, not model source operands.','Bound assumes the SAME symbolic substrate at both ends in [0,1]^3.','Real neighboring substrates may differ and this does not bound their final color difference.'])
    print(json.dumps(report,indent=2))
    if len(sys.argv)>1:Path(sys.argv[1]).write_text(json.dumps(report,indent=2)+'\n')
if __name__=='__main__':main()
