#!/usr/bin/env python3
"""H-Earth exact-uploaded-mesh audit and conservative finite-volume transport.

This program never edits product bytes. Source geometry required; PNG-derived pseudo
triangles are prohibited. Refuses to label a domain closed when witness/boundary
separation or seam/overlap conditions cannot be proven.
"""
import argparse, hashlib, json
from collections import defaultdict
from pathlib import Path
import numpy as np
from scipy.spatial import cKDTree
from shapely.geometry import Polygon, Point
from shapely.strtree import STRtree

SOURCE_HEAD='cb57c275b95d0d48883bc4da4dcfcf17cbec5060'
WORLD_HEAD='33e752c712be61cd2a5c3f52a35b55da0354fe30'
EXPECTED={'positions':'342a2a788009410bf48a6b5889a55cad4afd97552ff02b72f98b1308f7f84b83',
          'indices':'483f7693f29225e52fa90700837015741e78edb291de9adb785a8db3a74d616c'}

def sha(path): return hashlib.sha256(Path(path).read_bytes()).hexdigest()
def require(value,why):
    if not value: raise ValueError(why)

def load_original(root):
    root=Path(root)
    for k,v in EXPECTED.items():
        name=root/('upload-'+k+'.bin')
        require(name.exists(),f'MISSING_ORIGINAL_UPLOAD_{k.upper()}')
        require(sha(name)==v,f'SOURCE_UPLOAD_{k.upper()}_SHA256_MISMATCH')
    positions=np.fromfile(root/'upload-positions.bin',np.float32).reshape(-1,3).astype(np.float64)
    indices=np.fromfile(root/'upload-indices.bin',np.uint32)
    require(len(positions)==141373,'POSITION_COUNT_MISMATCH')
    require(len(indices)==366666,'INDEX_COUNT_MISMATCH')
    require(np.all(np.isfinite(positions)),'NONFINITE_POSITION')
    require(int(indices.max())<len(positions),'INDEX_OUT_OF_RANGE')
    package=json.loads((root/'package.json').read_text())
    require(package['packageIdentity']=='H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_4F1B7FF2','PACKAGE_IDENTITY')
    samples=json.loads((root/'surface-samples.json').read_text())
    require(len(samples)==2484,'WITNESS_COUNT')
    require(sum(map(lambda s:len(s['candidateOffsets']),samples))==2575,'WITNESS_MEMBERSHIPS')
    return positions,indices,package,samples

def active_offsets(package):
    groups={}
    for s in package['primitiveSpans']:
        if s.get('role')=='TERRAIN': group='NEAR'
        elif s.get('primitiveId')=='H_EARTH_WORLD_MANIFOLD:FAR_LAND_CONTINUATION': group='FAR'
        else:continue
        for o in range(s['indexStart'],s['indexStart']+s['indexCount'],3):
            require(o not in groups,'OVERLAPPING_ACTIVE_SOURCE_INDEX_SPANS')
            groups[o]=group
    return groups

def topo(positions,indices,groups):
    offsets=np.array(sorted(groups),dtype=np.int64)
    vids=indices[offsets[:,None]+np.arange(3)]
    verts=positions[vids]
    areas=np.linalg.norm(np.cross(verts[:,1]-verts[:,0],verts[:,2]-verts[:,0]),axis=1)/2
    require(np.all(np.isfinite(areas)) and np.all(areas>0),'DEGENERATE_SOURCE_TRIANGLE')
    edges=defaultdict(list)
    for j,(i0,i1,i2) in enumerate(vids):
        for a,b in ((i0,i1),(i1,i2),(i2,i0)):
            edges[(groups[int(offsets[j])],min(int(a),int(b)),max(int(a),int(b)))].append(j)
    require(max(len(m) for m in edges.values())<=2,'NONMANIFOLD_SAME_PRIMITIVE_EDGE')
    neighbors=defaultdict(list);boundary=[]
    for (group,a,b),faces in edges.items():
        edge_len=float(np.linalg.norm(positions[a]-positions[b]));require(edge_len>0,'ZERO_LENGTH_SOURCE_EDGE')
        if len(faces)==2:
            i,j=faces;neighbors[i].append((j,edge_len,'indexed'));neighbors[j].append((i,edge_len,'indexed'))
        else:boundary.append((faces[0],group,a,b,edge_len))
    return offsets,vids,verts,areas,neighbors,boundary

def continuous_source_seam(positions,boundary,groups,offsets,neighbors,require_complete=False):
    """Evidence-grade cross primitive linking; never snaps or creates geometry.

    Uses original 3D edge points and the existing Float32-scale tolerance.
    Returns uncovered-near lengths to distinguish source seam from zero flux.
    """
    near=[e for e in boundary if e[1]=='NEAR'];far=[e for e in boundary if e[1]=='FAR']
    if not near or not far:return [],[],set()
    # Three-dimensional tolerance-based bounding-query: only true projected
    # potential overlaps are considered, never closest arbitrary segments.
    from shapely.geometry import LineString
    lines=[LineString([positions[c,[0,2]],positions[d,[0,2]]]) for _,_,c,d,_ in far]
    st=STRtree(lines);links=[];partial=[];sealed=set();farcovered=defaultdict(list)
    for nf,_,a,b,nearlen in near:
        A,B=positions[[a,b]];axis=(B-A)/nearlen
        intervals=[]
        possible=st.query(LineString([A[[0,2]],B[[0,2]]]).buffer(.10))
        for ix in possible:
            ff,_,c,d,farlen=far[int(ix)];C,D=positions[[c,d]]
            t0=float(np.dot(C-A,axis));t1=float(np.dot(D-A,axis))
            lo=max(0.,min(t0,t1));hi=min(nearlen,max(t0,t1))
            if hi-lo<=1e-7 or abs(t1-t0)<1e-12:continue
            F0=C+(D-C)*(lo-t0)/(t1-t0);F1=C+(D-C)*(hi-t0)/(t1-t0)
            res=max(np.linalg.norm(F0-(A+axis*lo)),np.linalg.norm(F1-(A+axis*hi)))
            tol=max(1e-6,2*float(np.max(np.abs([A,B,C,D])))*2**-23)
            if res<=tol:
                if nf==ff:raise ValueError('SELF_SEAM_CONNECTION')
                links.append((int(nf),int(ff),float(hi-lo),res,tol))
                intervals.append((lo,hi))
                faraxis=(D-C)/farlen
                tnear0=float(np.dot(A-C,faraxis));tnear1=float(np.dot(B-C,faraxis))
                farlo=max(0.,min(tnear0,tnear1));farhi=min(farlen,max(tnear0,tnear1))
                require(farhi-farlo>0,'INVALID_FAR_SEGMENT_OVERLAP')
                farcovered[(int(ff),int(c),int(d),float(farlen))].append((farlo,farhi))
        if intervals:
            intervals.sort();end=0.;union=0.;overlap=0.
            for ulo,uhi in intervals:
                if ulo<end-1e-6:overlap+=min(end,uhi)-ulo
                if uhi>end:union+=uhi-max(ulo,end);end=uhi
            if overlap>max(1e-6,nearlen*1e-5):raise ValueError('DUPLICATE_CROSS_SEAM_COVERAGE')
            if nearlen-union>max(1e-6,nearlen*1e-5):partial.append(('NEAR',int(nf),nearlen,union))
            else:sealed.add((int(nf),int(a),int(b)))
    for (face,c,d,length),intervals in farcovered.items():
        intervals.sort();end=0.;union=0.;overlap=0.
        for lo,hi in intervals:
            if lo<end-1e-6:overlap+=min(end,hi)-lo
            if hi>end:union+=hi-max(lo,end);end=hi
        if overlap>max(1e-6,length*1e-5):raise ValueError('DUPLICATE_FAR_SEAM_COVERAGE')
        if length-union>max(1e-6,length*1e-5):partial.append(('FAR',face,length,union))
        else:sealed.add((face,c,d))
    if require_complete and partial:raise ValueError('UNRESOLVED_PARTIAL_NEAR_FAR_SEAM')
    # preserve paired symmetric links; not a geometric weld.
    for n,f,l,*_ in links:
        neighbors[n].append((f,l,'seam'));neighbors[f].append((n,l,'seam'))
    return links,partial,sealed

def no_duplicate_projected_area(verts, offsets, groups, active, eps=1e-12):
    """Reject any 2D overlap across NEAR/FAR source triangles (not a seam edge).
    Fail-closed rather than choosing a layer or silently double-counting mass.
    The tiny epsilon suppresses floating point slivers only; it must not be
    enlarged to force a pass. All physical overlap remains an explicit failure.
    """
    active=sorted(active)
    faces=[];types=[]
    for i in active:
        poly=Polygon([(p[0],p[2]) for p in verts[i]])
        require(poly.is_valid and poly.area>0,'PROJECTED_DEGENERATE_FACE')
        faces.append(poly);types.append(groups[int(offsets[i])])
    st=STRtree(faces);overlaps=[]
    for i,p in enumerate(faces):
        for j in st.query(p):
            j=int(j)
            if j<=i or types[i]==types[j]:continue
            a=p.intersection(faces[j]).area
            if a>eps:overlaps.append({'a':int(offsets[active[i]]),'b':int(offsets[active[j]]),'areaXZ':float(a)})
    return overlaps

def select_support(verts,offsets,samples,physical_radius=48.):
    """Source-triangle XZ footprint within fixed 48m of a real witness.

    A very large original FAR triangle can contain the witness despite its
    centroid being >48m away. The center-to-farthest-vertex bound is only a
    conservative KD prefilter; exact planar Polygon.distance decides inclusion.
    Neither screenshot triangles nor a widened radius are permitted.
    """
    anchors=np.array([s['world'] for s in samples],dtype=float)[:,[0,2]]
    require(len(anchors)==2484,'SAMPLE_ANCHORS')
    centers=verts.mean(axis=1)[:,[0,2]]
    face_radius=np.linalg.norm(verts[:,:,[0,2]]-centers[:,None,:],axis=2).max(axis=1)
    tree=cKDTree(anchors)
    dist,_=tree.query(centers)
    active=set()
    for i in np.where(dist<=physical_radius+face_radius)[0]:
        poly=Polygon(verts[i][:,[0,2]])
        require(poly.is_valid and poly.area>0,'PROJECTED_DEGENERATE_SOURCE_FACE')
        for j in tree.query_ball_point(centers[i],r=physical_radius+face_radius[i]):
            if poly.distance(Point(anchors[j]))<=physical_radius:
                active.add(int(i))
                break
    mapoffs={int(k):i for i,k in enumerate(offsets)}
    seeds={mapoffs[int(o)] for s in samples for o in s['candidateOffsets']}
    require(seeds.issubset(active),'SOURCE_SEED_OUTSIDE_SUPPORT')
    return active,seeds

def source_protected(xz):
    """Conservative exact-source garden/estate/route/grove guard on world x,z.

    This is a fail-safe triangle exclusion for observed inland terrain, not a
    full vegetation/shore/ocean source-material evaluator. Any vertex/centroid
    in an active source protection fringe means the *whole face* is protected.
    """
    p=np.asarray(xz,float);x,z=p[...,0],p[...,1]
    grove=np.hypot(x+139.40268,z+210.74617)<=42.
    # Outer smoothstep fringes: protected box distance to rectangle <=12/10m.
    oasis_x=np.maximum.reduce([-18.-x,x-34.,np.zeros_like(x)])
    oasis_z=np.maximum.reduce([-204.-z,z+131.,np.zeros_like(z)])
    estate_x=np.maximum.reduce([18.-x,x-132.,np.zeros_like(x)])
    estate_z=np.maximum.reduce([-210.-z,z+125.,np.zeros_like(z)])
    oasis=np.hypot(oasis_x,oasis_z)<=12.
    estate=np.hypot(estate_x,estate_z)<=10.
    t=np.clip((z-x+192.)/96.,0,1)
    route=np.hypot(x-(48.-48.*t),z-(-144.+48.*t))<=9.
    return grove|oasis|estate|route

def protected_faces(verts):
    positions=np.concatenate([verts,verts.mean(axis=1,keepdims=True)],axis=1)
    return np.any(source_protected(positions[...,[0,2]]),axis=1)

def boundary_distance(positions,offsets,vids,boundary,active,seeds,neighbors,verts,sealed):
    """Conservative source-boundary screen using complete 3D edge segments.

    Nearest source-edge point is <= shortest real surface route distance, so
    minimum Euclidean distance >= radius is a sufficient (not necessary)
    condition that a witness is outside the artificial cut's influence area.
    """
    cut=[]
    for i,grp,a,b,l in boundary:
        if i in active and (i,a,b) not in sealed and (i,b,a) not in sealed:cut.append((positions[a],positions[b]))
    for i in active:
        # Common source-index edges crossing into an omitted neighbor.
        if any(j not in active for j,_,_ in neighbors.get(i,[])):
            ids=vids[i];edgepairs=[(int(ids[k]),int(ids[(k+1)%3])) for k in range(3)]
            for a,b in edgepairs:cut.append((positions[a],positions[b]))
    if not cut:return {'status':'MISSING_BOUNDARY_EVIDENCE'}
    A=np.stack([a for a,b in cut]);B=np.stack([b for a,b in cut]);v=B-A
    centers=verts[list(seeds)].mean(axis=1)
    best=np.full(len(centers),np.inf)
    # Query all observed cut edges; fully vectorized in bounded chunks.
    for lo in range(0,len(centers),100):
        x=centers[lo:lo+100,None,:];t=np.clip(np.sum((x-A)*v,axis=-1)/np.maximum(np.sum(v*v,axis=-1),1e-30),0,1)
        d=np.linalg.norm(x-(A+t[...,None]*v),axis=-1)
        best[lo:lo+100]=d.min(axis=1)
    return {'minimumWitnessSourceCentroidToCutMeters':float(best.min()),'medianMeters':float(np.median(best)),'seedCount':len(seeds),'cutEdges':len(cut)}

def transport(Q,L,area,links,protected,step=0.5):
    """One implicit-free bounded RGB finite-volume transport step, no clipping.
    Pair flux is antisymmetric and a shared RGB edge coefficient preserves gamut.
    """
    Q=np.asarray(Q,dtype=float);L=np.asarray(L,dtype=float);area=np.asarray(area,dtype=float);protected=np.asarray(protected,dtype=bool)
    n=len(area);require(Q.shape==(n,3) and L.shape==(n,3),'SHAPE');require(np.all(area>0),'AREAS');require(np.all((Q>=0)&(Q<=1)),'SOURCE_GAMUT')
    uniq={}
    for i,j,s in links:
        i=int(i);j=int(j);require(0<=i<n and 0<=j<n and i!=j and s>=0,'EDGE')
        if protected[i] or protected[j] or s==0:continue
        key=tuple(sorted((i,j)));require(key not in uniq,'DUPLICATE_EDGE');uniq[key]=float(s)
    rows=np.array(list(uniq),int).reshape(-1,2);w=np.array(list(uniq.values()),float)
    if not len(rows):return Q.copy(),L.copy(),{'massError':0.,'protectedChange':0.,'fluxEdges':0}
    degree=np.bincount(rows.ravel(),weights=np.repeat(w,2),minlength=n)
    live=degree>0;dt=step*float(np.min(area[live]/degree[live]))
    flows=dt*w[:,None]*(L[rows[:,1]]-L[rows[:,0]])
    # A net sum is NOT a safe capacity bound: opposing edge fluxes may
    # cancel before differently limited edges are accepted. Bound GROSS
    # incoming/outgoing mass independently at each face and RGB channel.
    gross_in=np.zeros_like(Q);gross_out=np.zeros_like(Q)
    positive=np.maximum(flows,0.);negative=np.maximum(-flows,0.)
    np.add.at(gross_in,rows[:,0],positive);np.add.at(gross_in,rows[:,1],negative)
    np.add.at(gross_out,rows[:,0],negative);np.add.at(gross_out,rows[:,1],positive)
    in_budget=(1.-Q)*area[:,None];out_budget=Q*area[:,None]
    pos=np.ones_like(Q);neg=np.ones_like(Q)
    np.divide(in_budget,gross_in,out=pos,where=gross_in>0)
    np.divide(out_budget,gross_out,out=neg,where=gross_out>0)
    np.minimum(pos,1.,out=pos);np.minimum(neg,1.,out=neg)
    limits=np.ones(len(rows))
    for c in range(3):
        f=flows[:,c];i=rows[:,0];j=rows[:,1]
        x=np.where(f>0,np.minimum(pos[i,c],neg[j,c]),np.minimum(neg[i,c],pos[j,c]))
        limits=np.minimum(limits,np.where(f==0,1.,x))
    moved=flows*limits[:,None];delta=np.zeros_like(Q)
    np.add.at(delta,rows[:,0],moved);np.add.at(delta,rows[:,1],-moved)
    before=np.sum(area[:,None]*Q,axis=0);QC=Q+delta/area[:,None];LC=L+delta/area[:,None]
    after=np.sum(area[:,None]*QC,axis=0)
    require(QC.min()>-1e-11 and QC.max()<1+1e-11,'POST_GAMUT')
    if protected.any():require(np.max(np.abs(QC[protected]-Q[protected]))<1e-12,'PROTECTED_CHANGE')
    return QC,LC,{'massError':float(np.max(np.abs(before-after))),'protectedChange':float(np.max(np.abs(QC[protected]-Q[protected]))) if protected.any() else 0.,'fluxEdges':len(rows),'dt':dt,'minimumColor':float(QC.min()),'maximumColor':float(QC.max())}

def inspect(root,out,physical_radius=48.,influence_radius=40.):
    pos,idx,package,samples=load_original(root);groups=active_offsets(package)
    offsets,vids,verts,areas,neighbors,boundary=topo(pos,idx,groups)
    active,seeds=select_support(verts,offsets,samples,physical_radius)
    links,partial,sealed=continuous_source_seam(pos,boundary,groups,offsets,neighbors)
    overlaps=no_duplicate_projected_area(verts,offsets,groups,active)
    guards=protected_faces(verts)
    protectedActive=sum(bool(guards[i]) for i in active)
    distances=boundary_distance(pos,offsets,vids,boundary,active,seeds,neighbors,verts,sealed)
    report={'schema':'H_EARTH_ORIGINAL_SOURCE_MESH_DOMAIN_GATE_v1','sourceHead':SOURCE_HEAD,'parentDiagnosticHead':WORLD_HEAD,
        'activeTerrainSourceTriangles':len(offsets),'activeOriginalFaces':len(active),'sourceTriangleAreasPositive':True,'witnessSamples':len(samples),
        'supportSelection':'SOURCE_POLYGON_XZ_DISTANCE_WITHIN_FIXED_48M_OF_ARCHIVED_WITNESS','retainedSourceSeedFaces':len(seeds),
        'sampleTrianglesAllRetained':len(seeds),'sourceTriangleAreaTotalInCandidateSupport':float(areas[list(active)].sum()),
        'protectedActiveSourceFaces':int(protectedActive),'nearFarSeamLinksFound':len(links),'partialSourceSeamEdges':partial[:60],
        'sourceProjectedNearFarOverlaps':overlaps[:60], 'boundaryDistance':distances,
        'closureQualified':bool(not partial and not overlaps and distances.get('minimumWitnessSourceCentroidToCutMeters',0)>=influence_radius),
        'influenceRadiusMeters':influence_radius,'supportRadiusMeters':physical_radius,
        'limitations':['Physical source upload positions/indices are required and checked by exact hashes; no screen-derived geometry substituted.',
             'A face-centered candidate support with no-flux perimeter does not by itself certify every protected or camera-dependent shader role.',
             'Any partial seam or overlapping near/far footprint fails closure rather than being welded silently.','No source color evaluation or GPU product change.']}
    Path(out).write_text(json.dumps(report,indent=2)+'\n')
    return report

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--mesh-dir',required=True);p.add_argument('--report',required=True)
    a=p.parse_args()
    try:
        r=inspect(a.mesh_dir,a.report)
        print(json.dumps(r,indent=2));raise SystemExit(0 if r['closureQualified'] else 2)
    except (ValueError,AssertionError,FileNotFoundError) as e:
        failure={'schema':'H_EARTH_ORIGINAL_SOURCE_MESH_DOMAIN_GATE_FAILURE_v1',
                 'result':'FAIL_CLOSED','closureQualified':False,'error':str(e),
                 'sourceHead':SOURCE_HEAD,'noSourceGeometryMutation':True}
        Path(a.report).write_text(json.dumps(failure,indent=2)+'\\n')
        print(json.dumps(failure));raise SystemExit(2)