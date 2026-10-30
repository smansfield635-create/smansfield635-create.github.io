"""Bind CPU material evaluation to authenticated reconstructed GPU inputs.

Replays saved camera witnesses at actual pixel-center lanes, never treating
requested source centers as fragment locations. Binary64 evaluation is conditional
on the declared parent-plane derivative model and never yields final-lit pixels.
"""
from pathlib import Path
import json,hashlib,sys
import numpy as np
from PIL import Image
HERE=Path(__file__).resolve().parent
from sampling import checked,bilinear,barycentric3,camera_quad
from material_stages import evaluate_material,Unresolved

def digest(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def jread(p,sha=None):return json.loads(checked(p,sha) if sha else Path(p).read_bytes())
TYPES={'Float32Array':'<f4','Float64Array':'<f8','Uint8Array':'u1','Uint16Array':'<u2','Uint32Array':'<u4'}
def arrays(directory,records):
    return {k:np.frombuffer(checked(Path(directory)/v['file'],v['sha256']),TYPES[v['type']]) for k,v in records.items()}

def build(evidence,source,geometry,attributes,textures,mesh,receipt,output):
    evidence,source,geometry,attributes,textures,mesh,output=map(Path,[evidence,source,geometry,attributes,textures,mesh,output])
    om=jread(evidence/'ordered-source-manifest.json');
    for p,h in om['moduleHashes'].items():checked(source/p,h)
    sm=jread(evidence/'source-manifest.json');tm=jread(evidence/'texture-manifest.json');am=jread(evidence/'attribute-manifest.json')
    for p,h in {**sm['moduleHashes'],**am['moduleHashes'],**tm['moduleHashes'],**tm['assetHashes']}.items():checked(source/p,h)
    if om['sourceHead']!=sm['sourceHead']:raise ValueError('ORDERED_SOURCE_HEAD_MISMATCH')
    rp='showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js';checked(source/rp,sm['rendererSha256'])
    for p,h in sm['meshHashes'].items():checked(mesh/p,h)
    capture=jread(receipt,tm['candidateReceiptSha256']);pkg=jread(mesh/'package.json',sm['meshHashes']['package.json'])
    # Reports are inherited exact committed checkpoints, not mutable caller claims.
    reports={}
    for name,where in [('geometry.json',geometry),('attributes.json',attributes),('atlas-inputs.json',textures),('resident-fields.json',textures),('sampling-inputs.json',textures)]:
        reports[name]=jread(where/name,digest(evidence/name))
    att=reports['attributes.json'];atlas=reports['atlas-inputs.json'];res=reports['resident-fields.json'];samples=reports['sampling-inputs.json'];geo=reports['geometry.json']
    attrs={state:arrays(attributes,meta) for state,meta in att['states'].items() if state.endswith('-gpu')}
    ab=arrays(textures,atlas['buffers']);uvs=ab['uv'].reshape(-1,2);mapped=ab['indices'];margin=ab['margin'].view('<f2').astype(float).reshape(97,97,4)
    images={name:np.frombuffer(checked(textures/v['file'],v['sha256']),np.uint8).reshape(v['height'],v['width'],v['channels']) for name,v in samples['decodedTextures'].items()}
    fields={name:np.frombuffer(checked(textures/v['file'],v['sha256']),np.uint8).reshape(v['height'],v['width']) for name,v in res['textures'].items()}
    native=res['textures']['habitat-native'];bounds=[native['bounds'],native['ravine']['bounds'],native['coastal']['bounds']]
    footprints=np.asarray([[v['x'],v['z'],v['crownRadius'],v['trunkRadius']] for v in pkg['landscapeFloorFootprints']],dtype=np.float32).astype(float).tolist()
    worldframe=(source/'showroom/globe/h-earth/render/planetary-world-frame.js').read_text()
    # Frozen frame defines exactSphereRadius=420000; source hash above guards it.
    if '420000' not in worldframe:raise ValueError('PLANET_RADIUS_SOURCE_CHANGED')
    radius=420000.
    surface_arrays={s['name']:arrays(geometry,s['files']) for s in geo['surfaces'] if s['correctionHook']}
    near=attrs['base-gpu'];idx=near['indices'];pos=near['positions'].reshape(-1,3)
    views={v['pose']['name']:v for v in capture['views']}
    for v in views.values():
        if v['resources']['refinementResourceCreated'] is not False:raise ValueError('UNSUPPORTED_REFINEMENT')
        if v['resources']['woodlandHabitat']['textureUploadCount']!=1 or v['resources']['habitatMaterialPresentation']['textureUploadCount']!=1:raise ValueError('RESIDENT_NOT_INSTALLED')
    requests=[]
    for w in samples['witnesses']:
        if w['status']!='PARENT_PLANE_CPU_INPUTS' or w['supportHits']!=1:raise ValueError('WITNESS_SUPPORT_UNRESOLVED')
        if w['surface'] not in ['original-near','original-far'] or w['sourceOffset'] is None:raise ValueError('SAVED_WITNESS_SOURCE_CHANGED')
        offset=w['sourceOffset'];ids=idx[offset:offset+3];tri=pos[ids].astype(float);v=views[w['pose']]
        q=camera_quad(tri,w['world'],v['worldPacket']['camera']['viewProjectionMatrix'],*w['canvas'])
        if q!= {k:w[k] for k in q}:raise ValueError('SAVED_QUAD_DRIFT')
        eye=np.array([v['worldPacket']['camera']['position'][k] for k in ['x','y','z']],dtype=np.float32).astype(float)
        requests.append(dict(kind='CAPTURED_PIXEL',name=w['pose'],surface=w['surface'],sourceOffset=offset,ids=ids,tri=tri,quad=q,requestedWorld=w['world'],eye=eye,attrs=near))
    # Representative native triangles complement inland original-only captures.
    # Synthetic local tangent quads are source algebra probes, never photographed views.
    for name in ['ERODED_TERRAIN','MOUNTAIN_OVERBURDEN','original-far']:
        s=surface_arrays[name];a=attrs[name+'-gpu'] if not name.startswith('original-') else near
        positions=a['positions'].reshape(-1,3);tri_ids=s['indices'].reshape(-1,3)
        candidates=positions[tri_ids];area=np.linalg.norm(np.cross(candidates[:,1]-candidates[:,0],candidates[:,2]-candidates[:,0]),axis=1)
        i=int(np.argmax(area));ids=tri_ids[i];tri=candidates[i].astype(float);center=tri.mean(axis=0)
        offset=None
        if name.startswith('original-'):
            offsets=np.flatnonzero((idx.reshape(-1,3)==ids).all(axis=1));
            if len(offsets)!=1:raise ValueError('SOURCE_OFFSET_AMBIGUITY')
            offset=int(offsets[0]*3)
        dx=(tri[1]-tri[0])*.001;dy=(tri[2]-tri[0])*.001
        quad=np.array([center,center+dx,center+dy,center+dx+dy]);weights=barycentric3(quad,tri)
        q=dict(status='SYNTHETIC_TANGENT_QUAD',pixelBottomLeft=[0,0],quadWorld=quad.tolist(),quadBarycentrics=weights.tolist(),helpersOutsideParent=int((weights.min(axis=1)<-1e-8).sum()))
        requests.append(dict(kind='SYNTHETIC_SOURCE_PROBE',name=name,surface=name,sourceOffset=offset,ids=ids,tri=tri,quad=q,requestedWorld=center.tolist(),eye=center+[0,3,5],attrs=a))
    records=[]
    for request in requests:
        q=request['quad'];quad=np.asarray(q['quadWorld']);pixel=q['pixelBottomLeft'];lane=pixel[0]%2+2*(pixel[1]%2);point=quad[lane];weights=np.asarray(q['quadBarycentrics'])[lane];a=request['attrs'];ids=request['ids']
        normal=weights@a['normals'].reshape(-1,3)[ids];coast=float(weights@a['coastDistances'][ids]);contact=float(weights@a['contactDistances'][ids])
        offset=request['sourceOffset'];atlas_id=0;atlas_delta=np.zeros(3);atlas_uv=None
        if offset is not None:
            duplicate=mapped[offset:offset+3];aids=ab['atlasIds'][duplicate]
            if len(set(aids))!=1:raise ValueError('ATLAS_FLAT_MISMATCH')
            atlas_id=int(aids[0])
            if atlas_id:
                atlas_uv=weights@uvs[duplicate];atlas_delta=(bilinear(images['near' if atlas_id==1 else 'far'],atlas_uv)-128)/1024
        world=point[[0,2]];t=(world-[-213,-759])/48
        margin_delta=bilinear(margin,(t*96+.5)/97) if (t>=0).all() and (t<=1).all() else np.zeros(4)
        inputs=dict(world=point.tolist(),normal=normal.tolist(),eye=request['eye'].tolist(),quadWorld=quad.tolist(),pixelBottomLeft=pixel,coastDistance=coast,contactDistance=contact,farNormalFlip=request['surface']=='original-far',atlasDeltaRGB=atlas_delta.tolist(),marginDelta=margin_delta.tolist(),habitatEnabled=True,habitatBounds=np.asarray(bounds,dtype=np.float32).astype(float).tolist(),habitatAtlasScale=np.array([1/3,1],dtype=np.float32).astype(float).tolist(),habitatHalfTexel=float(np.float32(.5/native['size'])),floorFootprints=footprints,planetRadius=radius)
        texture_reads=[]
        def sample(name,uv):
            actual={'habitat':'habitat-native','habitatMaterial':'habitat-material','shoreline':'oasis-mask'}[name]
            result=bilinear(fields[actual],uv)/255
            texture_reads.append(dict(name=name,uv=np.asarray(uv).tolist(),value=result.tolist(),textureSha256=res['textures'][actual]['sha256']))
            return result
        result=evaluate_material(inputs,sample)
        records.append(dict(kind=request['kind'],name=request['name'],surface=request['surface'],sourceOffset=offset,requestedWorld=request['requestedWorld'],evaluatedPixelLane=lane,selectedLaneBarycentricWeights=weights.tolist(),selectedLaneOutsideParent=bool(weights.min() < -1e-8),supportStatus='EXTRAPOLATED_PARENT_PLANE' if weights.min() < -1e-8 else 'PARENT_TRIANGLE_INTERIOR_CPU_ONLY',helpersOutsideParent=q['helpersOutsideParent'],atlasId=atlas_id,atlasUV=None if atlas_uv is None else atlas_uv.tolist(),inputs=inputs,textureReads=texture_reads,result=result))
    report=dict(schema='H_EARTH_ORDERED_MATERIAL_COEFFICIENTS_v1',sourceHead=sm['sourceHead'],priorCheckpoint='ed3e708a2c9e1bf098a3675b8806a2cc34312e95',rendererSha256=sm['rendererSha256'],orderedSourceManifestSha256=digest(evidence/'ordered-source-manifest.json'),inputReportHashes={n:digest(evidence/n) for n in reports},captureReceiptSha256=tm['candidateReceiptSha256'],status='CONDITIONAL_CPU_COEFFICIENTS_ONLY',recordCount=len(records),capturedPixelCount=sum(r['kind']=='CAPTURED_PIXEL' for r in records),syntheticProbeCount=sum(r['kind']=='SYNTHETIC_SOURCE_PROBE' for r in records),capturedSelectedLanesOutsideParent=sum(r['kind']=='CAPTURED_PIXEL' and r['selectedLaneOutsideParent'] for r in records),records=records,limits=['P is symbolic pre-identity soil; final RGB, soil mip filtering and lighting remain unresolved.','Binary64 CPU procedural arithmetic and declared parent-plane derivatives are not GPU equality.','Saved source centers are provenance only; coefficients evaluated at selected pixel-center ray and matching interpolated attributes.','Synthetic probes are deliberately not camera-qualified, visible-owner or landscape coverage claims.','No expanded correction texture, product change, GPU execution or visual acceptance.'])
    output.parent.mkdir(parents=True,exist_ok=True);output.write_text(json.dumps(report,indent=2,allow_nan=False)+'\n')
    print(json.dumps({k:report[k] for k in ['status','recordCount','capturedPixelCount','syntheticProbeCount']}))
    return report
if __name__=='__main__':
    if len(sys.argv)!=9:raise SystemExit('EVIDENCE SOURCE GEOMETRY ATTRIBUTES TEXTURES MESH RECEIPT OUTPUT (8 arguments)')
    build(*sys.argv[1:])
