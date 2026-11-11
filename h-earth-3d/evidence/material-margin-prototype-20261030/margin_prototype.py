"""Bounded 1-D margin prototype on archived world-space samples, not a shader.
Empirical gradient ridges locate intervals; no material label or photo match.
Exact outside-support preservation; current atlas included; P never resampled.
"""
from pathlib import Path
import json, hashlib, sys
import numpy as np
ROOT=Path(sys.argv[1]).resolve() if len(sys.argv)>1 else Path(__file__).resolve().parent.parent
OUT=ROOT/'boundary-reconciliation'
HALF_WIDTH=6.0
RIDGE_CODES_PER_M=1.0
MAX_SOURCE_GAP=6.0

def display(x):return np.clip(x*1.12,0,1)**(1/2.2)*255

def shoulder_weight(t):
    edge=np.clip(np.minimum(t,1-t)*4,0,1)
    return edge**3*(10+edge*(-15+6*edge))

def opposing_transitions(material, s, peak, within):
    color_steps=np.diff(display(material),axis=0)
    direction=color_steps[peak]/max(np.linalg.norm(color_steps[peak]),1e-20)
    signed=(color_steps@direction)/np.diff(s)
    strong=signed[within][abs(signed[within])>.25*abs(signed[peak])]
    return bool((strong>0).any() and (strong<0).any())

def reconstruct(s, coefficients, center, half_width=HALF_WIDTH):
    """Compact coefficient bridge; supports scalar or vector coefficients.
    Baseline is the sample interpolant, not an assertion about native derivatives.
    Both correction and its first derivative vanish at the support limits.
    """
    lo,hi=center-half_width,center+half_width
    assert s[0]<=lo and hi<=s[-1] and np.all(np.diff(s)>0)
    t=np.clip((s-lo)/(hi-lo),0,1)
    smooth=t*t*t*(10+t*(-15+6*t))
    left=np.array([np.interp(lo,s,coefficients[:,k]) for k in range(coefficients.shape[1])])
    right=np.array([np.interp(hi,s,coefficients[:,k]) for k in range(coefficients.shape[1])])
    bridge=left[None,:]+(right-left)[None,:]*smooth[:,None]
    weight=shoulder_weight(t)
    active=(s>lo)&(s<hi)
    out=coefficients.copy()
    out[active]+=weight[active,None]*(bridge[active]-coefficients[active])
    return out,active,left,right

def tests():
    s=np.linspace(-12,12,481)
    c=np.stack([np.where(s<0,.2,.8),np.where(s<0,.12,.03),np.full_like(s,.07),np.full_like(s,.04)],1)
    q,active,l,r=reconstruct(s,c,0)
    assert np.array_equal(q[~active],c[~active])
    assert np.all(q>=np.minimum(l,r)-1e-14) and np.all(q<=np.maximum(l,r)+1e-14)
    const=np.tile([.3,.12,.09,.04],(len(s),1))
    same,_,_,_=reconstruct(s,const,0)
    assert np.allclose(same,const,rtol=0,atol=3e-17)
    # Reconstructing affine coefficients leaves substrate at each point intact.
    p=np.stack([.10+.01*np.sin(s*20),.08+.01*np.sin(s*23),.04+.005*np.cos(s*27)],1)
    out=q[:,0,None]*p+q[:,1:]
    p2=p+np.array([.001,-.001,.0005])
    assert np.max(abs((q[:,0,None]*p2+q[:,1:]-out)-q[:,0,None]*(p2-p)))<1e-15
    # Exact polynomial endpoint support: w=w'=0 at t=0,1.
    for t in [0.,1.]:
        assert shoulder_weight(t)==0
        edge=min(t,1-t)*4
        assert 30*edge*edge*(edge-1)**2*4==0
    # Affine bridge isn't itself visual acceptance; wrong endpoints raise.
    try:reconstruct(s,c,11)
    except AssertionError:pass
    else:raise AssertionError('unbracketed support accepted')
    return ['outside_exact','constant_preserved','no_endpoint_overshoot_synthetic','texture_response','zero_endpoint_correction_and_derivative','unbracketed_support_rejected']

worlds=json.loads((ROOT/'recovered/paired/input/mesh-cpu/surface-samples.json').read_text())
world={(x['pose'],*x['pixel']):np.array(x['world']) for x in worlds}
report={'schema':'H_EARTH_ARCHIVED_MARGIN_PROTOTYPE_v1','parameters':{'halfWidthMeters':HALF_WIDTH,'ridgeCodesPerMeter':RIDGE_CODES_PER_M,'maxAdjacentWorldGapMeters':MAX_SOURCE_GAP,'concentrationRatio':1.25,'oppositeSlopeFraction':.25,'pureBridgeCoreHalfWidthMeters':3.0},'tests':tests(),'poses':[],'scope':'1-D sampled transects, not a production shader or 2-D contour field. No final-light or later-overlay qualification.','overlapPolicy':'Strongest first; overlapping supports retained as unresolved exclusions rather than merged or double-applied.'}
for side in ['near','far']:
    pose='inland-seam-'+side
    a=np.load(ROOT/f'recovered/paired/results/native-{pose}.npz')
    atlas=np.load(OUT/f'current-atlas-{side}.npz')
    assert np.array_equal(a['pixels'],atlas['pixels']) and np.array_equal(a['offsets'],atlas['offsets'])
    wi=a['wI'].astype(float)[:,None];wg=a['wG'].astype(float)[:,None]
    A=(1-wi)*(1-wg)
    B=(1-wg)*wi*a['TI'].astype(float)+wg*a['TG'].astype(float)+atlas['delta']
    C=np.concatenate([A,B],1);P=a['P'].astype(float)
    baseline=A*P+B;candidate=baseline.copy();CC=C.copy()
    assert np.max(abs(baseline-(a['Q']+atlas['delta'])))<1e-7
    lookup={}
    for i,xy in enumerate(a['pixels']):lookup.setdefault(tuple(xy),[]).append(i)
    segments=[];exclusions={'ambiguousPixels':0,'ownershipOrGapBreaks':0,'overlapRidges':0,'unbracketedRidges':0,'opposedTransitions':0,'noGradientConcentration':0};excluded=[]
    for x in sorted(set(a['pixels'][:,0])):
        current=[]
        for xy in sorted((xy for xy in lookup if xy[0]==x),key=lambda xy:xy[1]):
            ii=lookup[xy]
            if len(ii)!=1:
                exclusions['ambiguousPixels']+=1;excluded.append({'reason':'AMBIGUOUS_MEMBERSHIP','pixel':list(map(int,xy)),'offsets':a['offsets'][ii].tolist()})
                if current:segments.append(current);current=[]
                continue
            i=ii[0]
            if current:
                j=current[-1]
                distance=np.linalg.norm(world[(pose,*a['pixels'][i])]-world[(pose,*a['pixels'][j])])
                if a['pixels'][i,1]!=a['pixels'][j,1]+1 or a['offsets'][i]!=a['offsets'][j] or not 0<distance<=MAX_SOURCE_GAP:
                    excluded.append({'reason':'OWNERSHIP_OR_GAP','pixels':a['pixels'][[j,i]].tolist(),'offsets':a['offsets'][[j,i]].tolist(),'worldDistanceMeters':float(distance)})
                    segments.append(current);current=[];exclusions['ownershipOrGapBreaks']+=1
            current.append(i)
        if current:segments.append(current)
    records=[]
    for ids in segments:
        if len(ids)<5:continue
        positions=np.array([world[(pose,*a['pixels'][i])] for i in ids])
        s=np.r_[0,np.cumsum(np.linalg.norm(np.diff(positions,axis=0),axis=1))]
        c=C[ids];p=P[ids]
        # Constant reference removes photographed grain from the edge detector;
        # reconstruction and outcome measurement still use original per-point P.
        pref=np.median(p,axis=0)
        material=c[:,0,None]*pref+c[:,1:]
        gradient=np.max(abs(np.diff(display(material),axis=0)),axis=1)/np.diff(s)
        peaks=[i for i,g in enumerate(gradient) if g>=RIDGE_CODES_PER_M and (i==0 or g>=gradient[i-1]) and (i==len(gradient)-1 or g>gradient[i+1])]
        occupied=[]
        for peak in sorted(peaks,key=lambda i:(-gradient[i],i)):
            center=(s[peak]+s[peak+1])/2;lo=center-HALF_WIDTH;hi=center+HALF_WIDTH
            if lo<s[0] or hi>s[-1]:
                exclusions['unbracketedRidges']+=1;excluded.append({'reason':'UNBRACKETED','ridgePixels':a['pixels'][np.array(ids)[[peak,peak+1]]].tolist()});continue
            if any(lo<b and hi>a for a,b in occupied):
                exclusions['overlapRidges']+=1;excluded.append({'reason':'OVERLAP','ridgePixels':a['pixels'][np.array(ids)[[peak,peak+1]]].tolist()});continue
            within=(s[:-1]>=lo)&(s[1:]<=hi)
            # Require concentration, not an already uniform gradual ramp.
            if within.sum()<2 or gradient[peak]<=1.25*np.median(gradient[within]):
                exclusions['noGradientConcentration']+=1;excluded.append({'reason':'NO_CONCENTRATION','ridgePixels':a['pixels'][np.array(ids)[[peak,peak+1]]].tolist()});continue
            if opposing_transitions(material,s,peak,within):
                exclusions['opposedTransitions']+=1;excluded.append({'reason':'OPPOSING_TRANSITIONS','ridgePixels':a['pixels'][np.array(ids)[[peak,peak+1]]].tolist()});continue
            occupied.append((lo,hi))
            proposed,active,left,right=reconstruct(s,c,center)
            before=c[:,0,None]*p+c[:,1:];after=proposed[:,0,None]*p+proposed[:,1:]
            assert np.array_equal(proposed[~active],c[~active])
            edge_active=active[:-1]|active[1:]
            bg=np.max(abs(np.diff(display(before),axis=0)),axis=1)/np.diff(s)
            ag=np.max(abs(np.diff(display(after),axis=0)),axis=1)/np.diff(s)
            # This is a numerical rejection screen, not a perception threshold.
            improves=ag[edge_active].max()<bg[edge_active].max()
            lower=np.minimum(c[active].min(axis=0),np.minimum(left,right));upper=np.maximum(c[active].max(axis=0),np.maximum(left,right))
            bounds=bool(np.all(proposed[active]>=lower-1e-14) and np.all(proposed[active]<=upper+1e-14))
            finite=bool(bounds and np.isfinite(after).all() and np.all((proposed[:,0]>=0)&(proposed[:,0]<=1)))
            disposition='NUMERIC_RETAIN_NOT_VISUAL_PASS' if improves and finite else 'REJECT_NEW_OR_PERSISTENT_GRADIENT'
            if improves and finite:
                CC[np.array(ids)[active]]=proposed[active];candidate[np.array(ids)[active]]=after[active]
            records.append({'sourceOffset':int(a['offsets'][ids[0]]),'ridgePixels':a['pixels'][np.array(ids)[[peak,peak+1]]].tolist(),'ridgeWorld':positions[[peak,peak+1]].tolist(),'centerWorld':((positions[peak]+positions[peak+1])/2).tolist(),'supportArcMeters':[lo,hi],'endpointCoefficients':[left.tolist(),right.tolist()],'locatorGradient':float(gradient[peak]),'beforeMaxCodesPerMeter':float(bg[edge_active].max()),'afterMaxCodesPerMeter':float(ag[edge_active].max()),'originalPeakBefore':float(bg[peak]),'originalPeakAfter':float(ag[peak]),'disposition':disposition,'coefficientEnvelopePass':bounds,'changedSamples':int(active.sum()) if improves and finite else 0})
    changed=np.any(CC!=C,axis=1)
    assert np.array_equal(candidate[~changed],baseline[~changed])
    np.savez_compressed(OUT/f'margin-prototype-{side}.npz',pixels=a['pixels'],offsets=a['offsets'],baseline=baseline,candidate=candidate,coefficientsBaseline=C,coefficientsCandidate=CC,incomingP=P,changed=changed)
    report['poses'].append({'pose':pose,'sourceMembers':len(P),'changedMembers':int(changed.sum()),'candidateIntervals':len(records),'retainedIntervals':sum(r['disposition'].startswith('NUMERIC_RETAIN') for r in records),'exclusions':exclusions,'excludedWitnesses':excluded,'intervals':records})
report['inputHashes']={str(p.relative_to(ROOT)):hashlib.sha256(p.read_bytes()).hexdigest() for p in [ROOT/'recovered/paired/input/mesh-cpu/surface-samples.json',*[ROOT/f'recovered/paired/results/native-inland-seam-{side}.npz' for side in ['near','far']],*[OUT/f'current-atlas-{side}.npz' for side in ['near','far']]]}
report['locatorLimit']='Per-transect median P reference; image columns are sampled paths, not independent world seams. No 2-D locator or full coverage claim.'
(OUT/'margin-prototype.json').write_text(json.dumps(report,indent=2)+'\n')
for p in report['poses']:print(p['pose'],{k:p[k] for k in ['sourceMembers','changedMembers','candidateIntervals','retainedIntervals','exclusions']})
print('tests',report['tests'])
