"""Source-only material coefficient census; no final pixels or repair inference.

One fixed camera-distance state over the inherited 40,960 authoring-space grid;
two more fixed states on the deterministically ranked top 20 eligible edges.
Quarter-metre world-XZ parent-plane differentials are explicit synthetic probes,
not raster/camera derivatives. All scores condition on the SAME symbolic soil P.
"""
from pathlib import Path
from collections import Counter
import hashlib,json,sys,time
import numpy as np
import shapely
from shapely.strtree import STRtree
from build_material_inputs import jread,digest,arrays
from sampling import checked,bilinear
from census import classify_layers
from material_stages import evaluate_material,Unresolved

SCRIPT_SHA256=hashlib.sha256(Path(__file__).read_bytes()).hexdigest()
MODEL_SHA256=digest(Path(__file__).with_name('material_stages.py'))
STAGES=['environmental-identity','groundcover','corrected-atlas','material-margin','manor-stone','manor-contact','manor-terrace','manor-additive','site-b','steep-bank','sand','shoreline-root-soil','woodland-litter','habitat','bank-gravel']
STEP=.25

def ranking_eligible(*,single_owner,nonsoil_support,helper_count,parent_options,model_uncertainty):
    return bool(single_owner and not nonsoil_support and helper_count==0 and parent_options==1 and not model_uncertainty)

def coefficient_bound(dA,dB):
    """Exact L-infinity bound at shared P in [0,1]^3; no spatial P variation."""
    dA=np.asarray(dA,float);dB=np.asarray(dB,float)
    if dA.shape!=(3,) or dB.shape!=(3,) or not np.isfinite([dA,dB]).all():raise ValueError('COEFFICIENT_INPUT_INVALID')
    return float(np.maximum(np.abs(dB),np.abs(dA+dB)).max())

def source_weights(xz,tri):
    a,b,c=np.asarray(tri,float)[:,[0,2]]
    uv=np.linalg.solve(np.column_stack((b-a,c-a)),np.asarray(xz)-a)
    return np.r_[1-uv.sum(),uv]

def differential_quad(point,tri,lane):
    """Global +X/+Z derivative convention; select one of four center phases."""
    point=np.asarray(point,float);tri=np.asarray(tri,float)
    ix,iy=lane%2,lane//2
    xz=point[[0,2]]+STEP*(np.array([[0,0],[1,0],[0,1],[1,1]])-[ix,iy])
    weights=np.array([source_weights(q,tri) for q in xz]);quad=weights@tri
    # Preserve exact center identity; weighted interpolation can differ by ulps.
    quad[lane]=point
    return quad,weights,int((weights.min(axis=1)<-1e-8).sum())

def trace_arrays(result):
    if [s['id'] for s in result['stages']]!=STAGES:raise ValueError('STAGE_ORDER_CHANGED')
    a=np.ones(3);b=np.zeros(3);increments=[];operands=[]
    for stage in result['stages']:
        aa=np.asarray(stage['A'],float);bb=np.asarray(stage['B'],float)
        op=np.asarray([stage['addA'],stage['addB']] if stage['id']=='material-margin' else [stage['gain'],stage['bias']],float)
        if aa.shape!=(3,) or bb.shape!=(3,) or op.shape!=(2,3) or not np.isfinite(aa).all() or not np.isfinite(bb).all() or not np.isfinite(op).all():raise ValueError('TRACE_OPERAND_INVALID')
        expected=np.array([a+op[0],b+op[1]]) if stage['id']=='material-margin' else np.array([a*op[0],b*op[0]+op[1]])
        if np.max(abs(expected-np.array([aa,bb])))>1e-12:raise ValueError('FORGED_STAGE_SNAPSHOT')
        increments.append([aa-a,bb-b]);a,b=aa,bb;operands.append(op)
    increments=np.array(increments);operands=np.array(operands)
    if np.max(abs(increments.sum(axis=0)-np.array([a-1,b])))>1e-12:raise ValueError('STAGE_TELESCOPE_FAILED')
    return np.array([a,b]),increments,operands

def decompose_arrays(left_increments,right_increments,left_operands,right_operands):
    """Symmetric two-point direct-operand allocation propagated through later gains.

    Exact delta(g*C+b)=mean(g)*delta(C)+delta(g)*mean(C)+delta(b).
    This removes false own-contributions from constant downstream attenuation.
    It is an algebraic allocation at the two sampled points, not causal proof.
    """
    values=[np.asarray(v,float) for v in [left_increments,right_increments,left_operands,right_operands]]
    if any(v.shape!=(len(STAGES),2,3) or not np.isfinite(v).all() for v in values):raise ValueError('DECOMPOSITION_OPERAND_INVALID')
    left_increments,right_increments,left_operands,right_operands=values
    previous_left=np.array([np.ones(3),np.zeros(3)]);previous_right=previous_left.copy()
    answer=np.zeros((len(STAGES),2,3))
    for k,name in enumerate(STAGES):
        lo,ro=left_operands[k],right_operands[k]
        if name=='material-margin':answer[k]=ro-lo
        else:
            gain=(lo[0]+ro[0])*.5;delta_gain=ro[0]-lo[0];delta_bias=ro[1]-lo[1]
            answer[:k]*=gain
            mean_previous=(previous_left+previous_right)*.5
            answer[k,0]=delta_gain*mean_previous[0]
            answer[k,1]=delta_gain*mean_previous[1]+delta_bias
        expected_left=previous_left+lo if name=='material-margin' else np.array([previous_left[0]*lo[0],previous_left[1]*lo[0]+lo[1]])
        expected_right=previous_right+ro if name=='material-margin' else np.array([previous_right[0]*ro[0],previous_right[1]*ro[0]+ro[1]])
        if np.max(abs(expected_left-previous_left-left_increments[k]))>1e-12 or np.max(abs(expected_right-previous_right-right_increments[k]))>1e-12:raise ValueError('DECOMPOSITION_TRACE_INCONSISTENT')
        previous_left+=left_increments[k];previous_right+=right_increments[k]
    if np.max(abs(answer.sum(axis=0)-(previous_right-previous_left)))>1e-12:raise ValueError('PROPAGATED_DECOMPOSITION_FAILED')
    return answer

def decompose(left_stages,right_stages):
    left={'stages':left_stages};right={'stages':right_stages}
    lc,li,lo=trace_arrays(left);rc,ri,ro=trace_arrays(right)
    return decompose_arrays(li,ri,lo,ro)

def rank_edges(coords,world,coeff,contrib,operands,eligible,owners,top=20):
    """Only same-owner, fully supported endpoint pairs enter the ranked subset."""
    width=256;n=len(coords);edge_rows=[];counts=Counter();ranked=[];max_residual=0.
    for i in range(n):
        for j in [i+1 if i%width<width-1 else -1,i+width if i+width<n else -1]:
            if j<0:continue
            counts['allGridNeighborEdges']+=1
            if not eligible[i] or not eligible[j]:counts['excludedEndpointSupport']+=1;continue
            if owners[i]!=owners[j]:counts['excludedDifferentSurfaceOwners']+=1;continue
            distance=float(np.linalg.norm(world[j]-world[i]))
            if not np.isfinite(distance) or distance<=0:raise ValueError('EDGE_DISTANCE')
            delta=coeff[j]-coeff[i];parts=contrib[j]-contrib[i]
            residual=float(np.max(abs(parts.sum(axis=0)-delta)));max_residual=max(max_residual,residual)
            if residual>1e-12:raise ValueError('EDGE_TELESCOPE_FAILED')
            score=coefficient_bound(*delta)/distance
            counts['eligibleSameOwnerEdges']+=1
            ranked.append((score,i,j,distance))
    ranked.sort(key=lambda r:(-r[0],r[1],r[2]))
    for score,i,j,distance in ranked[:top]:
        delta=coeff[j]-coeff[i];parts=decompose_arrays(contrib[i],contrib[j],operands[i],operands[j]);ops=operands[j]-operands[i]
        stages=[]
        for k,name in enumerate(STAGES):
            stages.append(dict(id=name,deltaA=parts[k,0].tolist(),deltaB=parts[k,1].tolist(),conditionalBoundPerMetre=coefficient_bound(*parts[k])/distance,localOperandDeltaGainOrAddA=ops[k,0].tolist(),localOperandDeltaBiasOrAddB=ops[k,1].tolist(),localOperandBoundPerMetre=coefficient_bound(*ops[k])/distance))
        order=sorted(range(len(stages)),key=lambda k:(-stages[k]['conditionalBoundPerMetre'],k));local_order=sorted(range(len(stages)),key=lambda k:(-stages[k]['localOperandBoundPerMetre'],k))
        edge_rows.append(dict(gridIndices=[i,j],localXZ=[coords[i].tolist(),coords[j].tolist()],worldEndpoints=[world[i].tolist(),world[j].tolist()],surface=owners[i],distanceMetres=distance,conditionalCoefficientBoundPerMetre=score,deltaA=delta[0].tolist(),deltaB=delta[1].tolist(),propagatedOperandContributions=stages,largestPropagatedOperandContribution=STAGES[order[0]],largestLocalOperandChange=STAGES[local_order[0]],cancellationRatio=None if score==0 else sum(s['conditionalBoundPerMetre'] for s in stages)/score))
    return edge_rows,dict(counts),max_residual

class Inputs:
    def __init__(self,evidence,source,geometry,attributes,textures,mesh,receipt):
        self.evidence=Path(evidence);source,geometry,attributes,textures,mesh=map(Path,[source,geometry,attributes,textures,mesh])
        E=self.evidence;sm=jread(E/'source-manifest.json');tm=jread(E/'texture-manifest.json');am=jread(E/'attribute-manifest.json');om=jread(E/'ordered-source-manifest.json')
        if len({m['sourceHead'] for m in [sm,tm,om]})!=1:raise ValueError('SOURCE_HEAD_MISMATCH')
        for p,h in {**sm['moduleHashes'],**tm['moduleHashes'],**am['moduleHashes'],**om['moduleHashes'],**tm['assetHashes']}.items():checked(source/p,h)
        checked(source/'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',sm['rendererSha256'])
        for p,h in sm['meshHashes'].items():checked(mesh/p,h)
        capture=jread(receipt,tm['candidateReceiptSha256'])
        if any(v['resources']['refinementResourceCreated'] is not False for v in capture['views']):raise ValueError('UNSUPPORTED_REFINEMENT')
        if any(v['resources']['woodlandHabitat']['textureUploadCount']!=1 or v['resources']['habitatMaterialPresentation']['textureUploadCount']!=1 for v in capture['views']):raise ValueError('RESIDENT_NOT_INSTALLED')
        self.reports={name:jread(where/name,digest(E/name)) for name,where in [('geometry.json',geometry),('attributes.json',attributes),('atlas-inputs.json',textures),('resident-fields.json',textures),('sampling-inputs.json',textures)]}
        self.census=jread(E/'census.json');self.sm=sm;self.tm=tm
        self.attrs={state:arrays(attributes,r) for state,r in self.reports['attributes.json']['states'].items() if state.endswith('-gpu')}
        self.geo=self.reports['geometry.json'];self.surfaces={s['name']:arrays(geometry,s['files']) for s in self.geo['surfaces']}
        self.ab=arrays(textures,self.reports['atlas-inputs.json']['buffers']);self.uv=self.ab['uv'].reshape(-1,2);self.mapped=self.ab['indices'];self.margin=self.ab['margin'].view('<f2').astype(float).reshape(97,97,4)
        self.images={n:np.frombuffer(checked(textures/v['file'],v['sha256']),np.uint8).reshape(v['height'],v['width'],v['channels']) for n,v in self.reports['sampling-inputs.json']['decodedTextures'].items()}
        res=self.reports['resident-fields.json'];self.fields={n:np.frombuffer(checked(textures/v['file'],v['sha256']),np.uint8).reshape(v['height'],v['width']) for n,v in res['textures'].items()};native=res['textures']['habitat-native']
        pkg=jread(mesh/'package.json',sm['meshHashes']['package.json'])
        self.uniforms=dict(habitatEnabled=True,habitatBounds=np.asarray([native['bounds'],native['ravine']['bounds'],native['coastal']['bounds']],dtype=np.float32).astype(float).tolist(),habitatAtlasScale=np.array([1/3,1],np.float32).astype(float).tolist(),habitatHalfTexel=float(np.float32(.5/native['size'])),floorFootprints=np.asarray([[v['x'],v['z'],v['crownRadius'],v['trunkRadius']] for v in pkg['landscapeFloorFootprints']],np.float32).astype(float).tolist(),planetRadius=420000.)
        idx=self.attrs['base-gpu']['indices'].reshape(-1,3)
        self.offsets={tuple(v):i*3 for i,v in enumerate(idx)}
        self.eyes=np.asarray(self.census['cameraSensitivity']['worldCameraInputs'],np.float32).astype(float)
    def texture(self,name,uv):
        return bilinear(self.fields[{'habitat':'habitat-native','habitatMaterial':'habitat-material','shoreline':'oasis-mask'}[name]],uv)/255
    def native_inputs(self,name,triangle,weights):
        s=self.surfaces[name];ids=s['indices'].reshape(-1,3)[triangle]
        a=self.attrs['base-gpu'] if name.startswith('original-') else self.attrs[name+'-gpu']
        tri=a['positions'].reshape(-1,3)[ids].astype(float);point=weights@tri
        normal=weights@a['normals'].reshape(-1,3)[ids];coast=float(weights@a['coastDistances'][ids]);contact=float(weights@a['contactDistances'][ids])
        atlas_id=0;atlas_delta=np.zeros(3);atlas_uv=None;offset=None
        if name.startswith('original-'):
            offset=self.offsets[tuple(ids)];duplicates=self.mapped[offset:offset+3];atlas_ids=self.ab['atlasIds'][duplicates]
            if len(set(atlas_ids))!=1:raise ValueError('ATLAS_ID_MISMATCH')
            atlas_id=int(atlas_ids[0])
            if atlas_id:
                atlas_uv=weights@self.uv[duplicates];atlas_delta=(bilinear(self.images['near' if atlas_id==1 else 'far'],atlas_uv)-128)/1024
        t=(point[[0,2]]-[-213,-759])/48
        margin_delta=bilinear(self.margin,(t*96+.5)/97) if (t>=0).all() and (t<=1).all() else np.zeros(4)
        phases=[]
        for lane in range(4):
            q,qw,outside=differential_quad(point,tri,lane);phases.append((outside,lane,q,qw))
        outside,lane,quad,qweights=min(phases,key=lambda p:(p[0],p[1]))
        inputs=dict(self.uniforms,world=point.tolist(),normal=normal.tolist(),coastDistance=coast,contactDistance=contact,farNormalFlip=name=='original-far',atlasDeltaRGB=atlas_delta.tolist(),marginDelta=margin_delta.tolist(),quadWorld=quad.tolist(),pixelBottomLeft=[lane%2,lane//2])
        meta=dict(surface=name,triangleIndex=int(triangle),sourceOffset=offset,barycentricWeights=weights.tolist(),atlasId=atlas_id,atlasUV=None if atlas_uv is None else atlas_uv.tolist(),helpersOutsideParent=outside,selectedLane=lane,world=point.tolist())
        return inputs,meta
    def supports(self,coords):
        soil=[[] for _ in coords];other=[[] for _ in coords];points=shapely.points(coords)
        for surface in self.geo['surfaces']:
            name=surface['name'];s=self.surfaces[name];ids=s['indices'].reshape(-1,3);local=s['local'].reshape(-1,3);tri=local[ids];polys=shapely.polygons(tri[:,:,[0,2]]);valid=np.flatnonzero(shapely.area(polys)>1e-10);pairs=STRtree(polys[valid]).query(points,predicate='covered_by')
            for pi,ti in zip(pairs[0],valid[pairs[1]]):
                weights=source_weights(coords[pi],tri[ti]);p=weights@tri[ti];entry=(name,int(ti),weights,float(p[1]),bool(weights.min()>1e-8))
                (soil if surface['correctionHook'] else other)[pi].append(entry)
        return soil,other


def classify(evidence,source,geometry,attributes,textures,mesh,receipt,output):
    data=Inputs(evidence,source,geometry,attributes,textures,mesh,receipt);coords=np.array([(x,z) for z in range(-399,-80,2) for x in range(-255,256,2)],float);n=len(coords)
    soil,other=data.supports(coords);counts=Counter();chosen=[None]*n;meta=[None]*n;owners=['']*n;world=np.full((n,3),np.nan);eligible=np.zeros(n,bool)
    # Refuse a changed census rather than silently widening or altering support.
    inherited=Counter(classify_layers([(name,y,inside) for name,ti,w,y,inside in row]) for row in soil)
    if dict(inherited)!=data.census['hookEligibleLayerClasses'] or sum(bool(v) for v in other)!=data.census['nonHookSurfacePoints']:raise ValueError('CENSUS_CHANGED')
    for i,row in enumerate(soil):
        layer=classify_layers([(name,y,inside) for name,ti,w,y,inside in row]);counts['support:'+layer]+=1
        if layer!='single-layer':continue
        options=[data.native_inputs(name,ti,w) for name,ti,w,y,inside in sorted(row,key=lambda h:(h[0],h[1]))]
        # Shared edges are collapsible only if shader-facing center attrs agree.
        center_keys=['world','normal','coastDistance','contactDistance','atlasDeltaRGB','marginDelta']
        def agrees(a,b):return all(np.allclose(a[k],b[k],rtol=0,atol=1e-8) for k in center_keys)
        if not all(agrees(options[0][0],q[0]) for q in options[1:]):counts['incompatibleSharedEdgeAttributes']+=1;continue
        item,m=min(options,key=lambda q:(q[1]['helpersOutsideParent'],q[1]['triangleIndex'],q[1]['selectedLane']))
        chosen[i]=item;meta[i]=m;owners[i]=m['surface'];world[i]=item['world'];counts['resolvedCenterInputs']+=1
        if len(options)>1:counts['coherentSharedEdgeCenters']+=1
        if other[i]:counts['nonsoilCoSupportCenters']+=1
        if m['helpersOutsideParent']:counts['extrapolatedDerivativeCenters']+=1
        eligible[i]=ranking_eligible(single_owner=True,nonsoil_support=bool(other[i]),helper_count=m['helpersOutsideParent'],parent_options=len(options),model_uncertainty=False)
        if len(options)>1:counts['sharedEdgeDerivativeAmbiguityExcluded']+=1
    # Test model throughput before the full deterministic pass. Timing never enters output identity.
    bench=[i for i,x in enumerate(chosen) if x is not None][:100];started=time.monotonic()
    for i in bench:evaluate_material(dict(chosen[i],eye=data.eyes[0].tolist()),data.texture)
    print(json.dumps({'checkpoint':'BENCHMARK','samples':len(bench),'seconds':time.monotonic()-started,'evaluationPlan':'FULL_ONE_CAMERA_THEN_TWO_CAMERAS_ON_TOP20'}),flush=True)
    coefficients=np.full((n,2,3),np.nan);contributions=np.full((n,len(STAGES),2,3),np.nan);operands=np.full_like(contributions,np.nan);uncertainties=Counter();errors=[]
    for i,inp in enumerate(chosen):
        if inp is None:continue
        try:
            r=evaluate_material(dict(inp,eye=data.eyes[0].tolist()),data.texture);coefficients[i],contributions[i],operands[i]=trace_arrays(r)
            counts['evaluatedCenters']+=1
            for u in r.get('uncertainties',[]):uncertainties[u]+=1
            if r.get('uncertainties'):eligible[i]=False;counts['uncertainModelCentersExcluded']+=1
        except (Unresolved,ValueError) as e:
            eligible[i]=False;counts['evaluationErrors']+=1
            if len(errors)<20:errors.append({'gridIndex':i,'localXZ':coords[i].tolist(),'error':str(e)})
        if (i+1)%5000==0:print(json.dumps({'checkpoint':'CENSUS','through':i+1,'evaluated':counts['evaluatedCenters']}),flush=True)
    counts['eligibleCenters']=int(eligible.sum())
    numeric=Path(output).with_suffix('.intermediates.npz')
    np.savez(numeric,coords=coords,world=world,coefficients=coefficients,contributions=contributions,operands=operands,eligible=eligible,owners=np.array(owners))
    rows,edge_counts,max_residual=rank_edges(coords,world,coefficients,contributions,operands,eligible,owners)
    camera_checks=[]
    for rank,row in enumerate(rows):
        i,j=row['gridIndices'];record={'rank':rank+1,'gridIndices':[i,j],'cameras':[]};row['endpointSupport']=[meta[i],meta[j]]
        for camera_index,eye in enumerate(data.eyes):
            a=evaluate_material(dict(chosen[i],eye=eye.tolist()),data.texture);b=evaluate_material(dict(chosen[j],eye=eye.tolist()),data.texture)
            ac,ai,ao=trace_arrays(a);bc,bi,bo=trace_arrays(b);dc=bc-ac;parts=decompose_arrays(ai,bi,ao,bo);ops=bo-ao
            scores=[coefficient_bound(*q)/row['distanceMetres'] for q in parts];local_scores=[coefficient_bound(*q)/row['distanceMetres'] for q in ops]
            record['cameras'].append(dict(cameraIndex=camera_index,eye=eye.tolist(),conditionalCoefficientBoundPerMetre=coefficient_bound(*dc)/row['distanceMetres'],largestPropagatedOperandContribution=STAGES[int(np.argmax(scores))],largestLocalOperandChange=STAGES[int(np.argmax(local_scores))],deltaA=dc[0].tolist(),deltaB=dc[1].tolist(),uncertainties=sorted(set(a.get('uncertainties',[])+b.get('uncertainties',[])))))
        camera_checks.append(record)
    # Raw deterministic arrays are reproducible intermediates; only hashes are committed.
    hashes={name:hashlib.sha256(np.ascontiguousarray(a).tobytes()).hexdigest() for name,a in [('coefficients',coefficients),('orderedContributions',contributions),('localOperands',operands),('eligible',eligible),('world',world)]}
    report=dict(schema='H_EARTH_CONDITIONAL_MATERIAL_CENSUS_v1',sourceHead=data.sm['sourceHead'],scriptSha256=SCRIPT_SHA256,modelSha256=MODEL_SHA256,priorCheckpoint='aaf01a8452ac080b0a7507c9f49ed85472457fd7',status='CONDITIONAL_SOURCE_CLASSIFICATION_ONLY',grid=dict(localBounds=[-256,-400,256,-80],step=2,count=n,width=256,height=160),cameraDistanceStates=data.eyes.tolist(),differentialModel=dict(name='SYNTHETIC_PARENT_PLANE_WORLD_XZ',stepMetres=STEP,phaseSelection='MIN_OUTSIDE_HELPERS_THEN_LANE_0_1_2_3',notCameraRaster=True),rankDefinition='max_c max(abs(deltaB_c),abs(deltaA_c+deltaB_c))/world_distance at one shared P in [0,1]^3; not final color gradient',rankEligibility='Both endpoints have one compatible soil owner, no nonsoil co-support, no extrapolated helpers, exactly one parent triangle (shared-edge parent derivatives excluded), no declared model uncertainty, and same surface owner. Segment interior/depth ownership unproven.',topCount=20,inputReportHashes={n:digest(Path(evidence)/n) for n in ['geometry.json','attributes.json','atlas-inputs.json','resident-fields.json','sampling-inputs.json','census.json','ordered-source-manifest.json','material-review.json']},counts=dict(counts),edgeCounts=edge_counts,uncertaintyCounts=dict(uncertainties),firstErrors=errors,maximumEdgeTelescopingResidual=max_residual,intermediateHashes=hashes,topEdges=rows,topEdgeCameraChecks=camera_checks,limits=['P is held equal at neighboring endpoints solely to isolate coefficient sensitivity. Spatial substrate variation, final RGB and lighting are unresolved.','Symmetric propagated direct-operand contributions sum to the total coefficient difference. Constant later gains attenuate prior contributions and receive zero own contribution. This two-point algebraic allocation is not causal or visual proof; signed vectors, cancellation and local operand changes are supplied.','Synthetic quarter-metre differential quads are not real camera derivatives or hardware helper/precision proof.','The census is correlated grid samples, not continuous margin coverage, walkability or visible raster ownership. Different-surface edges and rock/water co-support remain excluded from confident ranking.','Top20 selection is only under camera0; other camera states check these chosen edges, not all alternative global rankings.','The prior local atlas/margin specimen near world Z=-735 and its15 saved-camera queries are outside this local navigation-rectangle census. Zero correction influence here does not invalidate that separate local improvement.', 'No expanded correction texture, product mutation, GPU run, publication or visual acceptance.'])
    Path(output).write_text(json.dumps(report,indent=2,allow_nan=False)+'\n');print(json.dumps({'checkpoint':'COMPLETE','counts':dict(counts),'edgeCounts':edge_counts,'topDrivers':dict(Counter(r['largestLocalOperandChange'] for r in rows))}),flush=True)
    return report

if __name__=='__main__':
    if len(sys.argv)!=9:raise SystemExit('EVIDENCE SOURCE GEOMETRY ATTRIBUTES TEXTURES MESH RECEIPT OUTPUT')
    classify(*sys.argv[1:])
