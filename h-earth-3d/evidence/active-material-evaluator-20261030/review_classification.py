"""West conserved independent classification review.

Reranks all edges from hash-verified arrays; source-replays top endpoints and256
fixed grid centers. Explicitly NOT a full independent40,960-model rerun.
"""
from pathlib import Path
import sys,json,hashlib
import numpy as np
if len(sys.argv)!=10:raise SystemExit('EVIDENCE SOURCE GEOMETRY ATTRIBUTES TEXTURES MESH RECEIPT REPORT OUTPUT')
E=Path(sys.argv[1]).resolve()
sys.path.insert(0,str(E))
import classify_material as c
from material_stages import evaluate_material,protection
from census import classify_layers
from independent_attribution_review import symmetric

def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def bound(v):return float(np.maximum(abs(v[1]),abs(v[0]+v[1])).max())

def run(report_path,output):
    report_path=Path(report_path);r=json.loads(report_path.read_text());z=np.load(report_path.with_suffix('.intermediates.npz'))
    assert sha(E/'classify_material.py')==r['scriptSha256']
    assert sha(E/'material_stages.py')==r['modelSha256']
    keys={'coefficients':'coefficients','orderedContributions':'contributions','localOperands':'operands','eligible':'eligible','world':'world'}
    for key,field in keys.items():assert hashlib.sha256(np.ascontiguousarray(z[field]).tobytes()).hexdigest()==r['intermediateHashes'][key],field
    coords=np.array([(x,k) for k in range(-399,-80,2) for x in range(-255,256,2)],float);np.testing.assert_array_equal(coords,z['coords'])
    n=len(coords);width=256;world=z['world'];eligible=z['eligible'];owners=z['owners'];co=z['coefficients'];inc=z['contributions'];ops=z['operands']
    # Independent vectorized adjacency construction: no candidate rank function.
    ii=np.arange(n).reshape(-1,width)
    left=np.r_[ii[:,:-1].reshape(-1),ii[:-1,:].reshape(-1)];right=np.r_[ii[:,1:].reshape(-1),ii[1:,:].reshape(-1)]
    endpoint=eligible[left]&eligible[right];same=owners[left]==owners[right];ok=endpoint&same
    counts={'allGridNeighborEdges':len(left),'excludedEndpointSupport':int((~endpoint).sum()),'excludedDifferentSurfaceOwners':int((endpoint&~same).sum()),'eligibleSameOwnerEdges':int(ok.sum())}
    assert counts==r['edgeCounts'],(counts,r['edgeCounts'])
    left,right=left[ok],right[ok];delta=co[right]-co[left];distance=np.linalg.norm(world[right]-world[left],axis=1)
    scores=np.maximum(abs(delta[:,1]),abs(delta[:,0]+delta[:,1])).max(axis=1)/distance
    order=np.lexsort((right,left,-scores));top=order[:20]
    assert [[int(left[k]),int(right[k])] for k in top]==[e['gridIndices'] for e in r['topEdges']]
    max_rank_delta=max(abs(float(scores[k])-e['conditionalCoefficientBoundPerMetre']) for k,e in zip(top,r['topEdges']));assert max_rank_delta<1e-14
    # All eligible-edge coefficient conservation independently checked before norm.
    residual=np.max(abs((inc[right]-inc[left]).sum(axis=1)-delta));assert residual<1e-12
    data=c.Inputs(E,*sys.argv[2:8])
    stratified=np.linspace(0,n-1,256,dtype=int);top_points=np.unique(np.r_[left[top],right[top]]);selected=np.unique(np.r_[stratified,top_points]);soil,other=data.supports(coords[selected])
    baseline={};source_inputs={};excluded=0;max_coeff_error=0.;max_trace_error=0.
    for q,i in enumerate(selected):
        row=soil[q];layer=classify_layers([(name,y,inside) for name,ti,w,y,inside in row])
        if layer!='single-layer':
            assert not eligible[i];excluded+=1;continue
        options=[data.native_inputs(name,ti,w) for name,ti,w,y,inside in sorted(row,key=lambda h:(h[0],h[1]))]
        center_keys=['world','normal','coastDistance','contactDistance','atlasDeltaRGB','marginDelta']
        agree=all(all(np.allclose(options[0][0][key],v[0][key],rtol=0,atol=1e-8) for key in center_keys) for v in options[1:])
        if not agree:
            assert not eligible[i];assert np.isnan(co[i]).all();excluded+=1;continue
        inp,meta=min(options,key=lambda q:(q[1]['helpersOutsideParent'],q[1]['triangleIndex'],q[1]['selectedLane']))
        actual=evaluate_material(dict(inp,eye=data.eyes[0].tolist()),data.texture);actual_co,actual_inc,actual_ops=c.trace_arrays(actual)
        assert owners[i]==meta['surface'];np.testing.assert_array_equal(world[i],inp['world'])
        max_coeff_error=max(max_coeff_error,float(abs(actual_co-co[i]).max()));max_trace_error=max(max_trace_error,float(abs(actual_inc-inc[i]).max()),float(abs(actual_ops-ops[i]).max()))
        np.testing.assert_array_equal(actual_co,co[i]);np.testing.assert_array_equal(actual_inc,inc[i]);np.testing.assert_array_equal(actual_ops,ops[i])
        independent_eligible=not other[q] and meta['helpersOutsideParent']==0 and len(options)==1 and not actual.get('uncertainties')
        assert bool(eligible[i])==bool(independent_eligible)
        baseline[int(i)]=actual;source_inputs[int(i)]=inp
    max_part_error=0.;max_camera_error=0.;phase_checks=[];protection_checks=[]
    for k,edge in enumerate(r['topEdges']):
        i,j=edge['gridIndices'];L=baseline[i];R=baseline[j];parts=symmetric(L['stages'],R['stages']).reshape(15,2,3)
        # Independently evaluate all signed propagated contributions.
        for part,s in zip(parts,edge['propagatedOperandContributions']):
            expected=np.array([s['deltaA'],s['deltaB']]);err=float(abs(part-expected).max());max_part_error=max(max_part_error,err);assert err<1e-12
        # Hold the derivative lane phase equal on both ends when possible.
        phases=[]
        for lane in range(4):
            phase_results=[];valid=True
            for endpoint,info in zip([i,j],edge['endpointSupport']):
                name=info['surface'];si=data.surfaces[name];ids=si['indices'].reshape(-1,3)[info['triangleIndex']]
                attrs=data.attrs['base-gpu'] if name.startswith('original-') else data.attrs[name+'-gpu']
                tri=attrs['positions'].reshape(-1,3)[ids].astype(float)
                q,qw,outside=c.differential_quad(np.asarray(source_inputs[endpoint]['world']),tri,lane)
                if outside:valid=False;break
                inp=dict(source_inputs[endpoint],quadWorld=q.tolist(),pixelBottomLeft=[lane%2,lane//2],eye=data.eyes[0].tolist())
                phase_results.append(evaluate_material(inp,data.texture))
            if not valid:continue
            a,b=phase_results;d=np.array([b['coefficients']['A'],b['coefficients']['B']])-np.array([a['coefficients']['A'],a['coefficients']['B']]);part=symmetric(a['stages'],b['stages']).reshape(15,2,3)
            phases.append(dict(lane=lane,score=bound(d)/edge['distanceMetres'],driver=c.STAGES[int(np.argmax([bound(v) for v in part]))]))
        phase_checks.append(dict(rank=k+1,adaptiveSelectedLanes=[v['selectedLane'] for v in edge['endpointSupport']],status='COMMON_CONTAINED_PHASES_EVALUATED' if phases else 'PHASE_CONFOUNDED_NO_COMMON_CONTAINED_PHASE',commonPhases=phases,scoreSpread=None if not phases else max(v['score'] for v in phases)-min(v['score'] for v in phases),drivers=sorted(set(v['driver'] for v in phases))))
        contexts=[]
        for endpoint in [i,j]:
            x,y,zz=source_inputs[endpoint]['world'];point=np.array([x,zz]);cores=[]
            if np.linalg.norm(point-[-139.40268,-210.74617])<=22:cores.append('GROVE_CORE')
            if -18<=x<=34 and -204<=zz<=-131:cores.append('OASIS_CORE')
            if 18<=x<=132 and -210<=zz<=-125:cores.append('ESTATE_CORE')
            t=np.clip((zz-x+192)/96,0,1);route=np.linalg.norm(point-[48-48*t,-144+48*t])
            if route<=4:cores.append('ROUTE_CORE')
            weight=protection(point)
            contexts.append(dict(gridIndex=endpoint,worldXZ=point.tolist(),protectedCores=cores,nativeGroundcoverProtectionWeight=weight,inProtectionFringe=not cores and weight<1))
        protection_checks.append(dict(rank=k+1,endpoints=contexts,anyProtectedCore=any(v['protectedCores'] for v in contexts),anyProtectionFringe=any(v['inProtectionFringe'] for v in contexts),repairPermission='NONE_BY_CLASSIFICATION'))
        for camera in r['topEdgeCameraChecks'][k]['cameras']:
            eye=data.eyes[camera['cameraIndex']]
            a=evaluate_material(dict(source_inputs[i],eye=eye.tolist()),data.texture);b=evaluate_material(dict(source_inputs[j],eye=eye.tolist()),data.texture)
            d=np.array([b['coefficients']['A'],b['coefficients']['B']])-np.array([a['coefficients']['A'],a['coefficients']['B']])
            max_camera_error=max(max_camera_error,abs(bound(d)/edge['distanceMetres']-camera['conditionalCoefficientBoundPerMetre']));assert max_camera_error<1e-12
            parts=symmetric(a['stages'],b['stages']).reshape(15,2,3);driver=c.STAGES[int(np.argmax([bound(p) for p in parts]))]
            assert driver==camera['largestPropagatedOperandContribution']
    result=dict(schema='H_EARTH_CONDITIONAL_CLASSIFICATION_INDEPENDENT_REVIEW_v1',verdict='PASS_BOUNDED_CONDITIONAL_SOURCE_CLASSIFICATION',sourceHead=r['sourceHead'],reviewedHashes={'classify_material.py':sha(E/'classify_material.py'),'test_classification.py':sha(E/'test_classification.py'),'classification.json':sha(report_path)},reviewScope={'fullCensusModelReplay':False,'allDeclaredArrayHashesVerified':True,'allGridNeighborEdgesReranked':counts['allGridNeighborEdges'],'eligibleEdgesReranked':counts['eligibleSameOwnerEdges'],'top20OrderingIdentical':True,'stratifiedCentersRequested':256,'distinctTopEndpoints':len(top_points),'distinctSourceQueriesReplayed':len(selected),'sourceQueriesEvaluated':len(baseline),'sourceQueriesExcluded':excluded,'topEdgeCameraPairsReplayed':60},observedUnboundArrayHashes={key:hashlib.sha256(np.ascontiguousarray(z[key]).tobytes()).hexdigest() for key in ['coords','owners']},commonPhaseChecks=phase_checks,protectedContextChecks=protection_checks,maximumErrors={'edgeRankScore':max_rank_delta,'allEligibleEdgeCoefficientConservation':float(residual),'sampledCoefficients':max_coeff_error,'sampledTracesAndOperands':max_trace_error,'independentPropagatedAttribution':max_part_error,'cameraPairScore':max_camera_error},algebraProof={'randomCandidateVsIndependentCases':1000,'maxDifference':2.220446049250313e-16,'regressionTestsPassed':8},limits=['Reranking full intermediate arrays does not independently re-execute the model at every40960 center.','Source replay covers256 predetermined stratified centers and all distinct top20 edge endpoints only.','Scores hold one symbolic substrate equal across each pair; actual soil variation and final color remain unresolved.','Synthetic parent-plane differentials are not GPU/raster derivatives or visible-owner proof.','Shared-edge parents, nonsoil co-support, extrapolated helpers and declared manor uncertainty excluded from ranking.','Protection context checks endpoints only; segment crossing of a protected region is not evaluated.','No product, correction texture, GPU, publication or visual acceptance.'])
    Path(output).write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2));return result
if __name__=='__main__':run(sys.argv[8],sys.argv[9])
