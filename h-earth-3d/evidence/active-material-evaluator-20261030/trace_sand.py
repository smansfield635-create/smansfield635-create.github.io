"""Bounded source trace of classification rank1; no product/visual diagnosis."""
from pathlib import Path
import json,sys,hashlib
import numpy as np
from shapely.geometry import LineString,Point,Polygon,box
from classify_material import Inputs,source_weights,digest
from material_stages import evaluate_material,smooth,hillside_weight

START=np.array([-165.,-129.]);END=np.array([-165.,-127.])
TOL=1e-10

def clip_triangle(start,end,tri):
    """Affine barycentric halfspaces; closed segment, binary64 not rational exact."""
    w0=source_weights(start,tri);dw=source_weights(end,tri)-w0;lo=0.;hi=1.
    for a,b in zip(w0,dw):
        if abs(b)<1e-15:
            if a < -TOL:return None
        elif b>0:lo=max(lo,-a/b)
        else:hi=min(hi,-a/b)
    if lo>hi+TOL:return None
    return [float(np.clip(lo,0,1)),float(np.clip(hi,0,1))]

def clustered(values):
    result=[]
    for value in sorted(values):
        if not result or value-result[-1]>TOL:result.append(float(value))
    return result

def slope_upper(normals):
    normals=np.asarray(normals,float);y=float(normals[:,1].min());h=float(np.linalg.norm(normals[:,[0,2]],axis=1).max())
    return 1. if y<=0 else float(1-y/np.hypot(y,h))

def factors(inp,slope):
    contact=inp['contactDistance'];coast=inp['coastDistance'];height=inp['world'][1];hillside=hillside_weight(np.array(inp['world'])[[0,2]])
    suit=float(np.clip((1-smooth(.035,.16,slope))*.72+(1-smooth(2,10,height))*.28,0,1));blend=float(smooth(4,28,coast))
    f=dict(contactGate=float(smooth(-1,0,contact)),inlandGate=float(1-smooth(10,38,contact)),coastBlend=blend,suitability=suit,coastSuitabilityFactor=1-blend+blend*suit,hillside=hillside,slopeGate=float(1-hillside*smooth(.012,.065,slope)))
    f['coverage']=f['contactGate']*f['inlandGate']*f['coastSuitabilityFactor']*f['slopeGate'];return f

def trace(evidence,source,geometry,attributes,textures,mesh,receipt,output):
    data=Inputs(evidence,source,geometry,attributes,textures,mesh,receipt);line=LineString([START,END]);hits=[];degenerate=[];surface_counts={}
    for surface in data.geo['surfaces']:
        name=surface['name'];s=data.surfaces[name];tris=s['local'].reshape(-1,3)[s['indices'].reshape(-1,3)];count=0
        for ti,tri in enumerate(tris):
            xz=tri[:,[0,2]]
            if np.any(xz.max(axis=0)<np.minimum(START,END)-TOL) or np.any(xz.min(axis=0)>np.maximum(START,END)+TOL):continue
            area=np.linalg.det(np.column_stack((xz[1]-xz[0],xz[2]-xz[0])))
            if abs(area)<1e-12:
                if Polygon(xz).convex_hull.intersects(line):degenerate.append(dict(surface=name,triangle=ti))
                continue
            interval=clip_triangle(START,END,tri)
            if interval is not None:
                hits.append(dict(surface=name,triangle=ti,interval=interval,soil=bool(surface['correctionHook'])));count+=1
        surface_counts[name]=count
    breaks=clustered([0.,1.]+[t for h in hits for t in h['interval']]);pieces=[];thresholds=[];arc=0.
    def native(hit,t):
        s=data.surfaces[hit['surface']];tri=s['local'].reshape(-1,3)[s['indices'].reshape(-1,3)[hit['triangle']]]
        return data.native_inputs(hit['surface'],hit['triangle'],source_weights(START+t*(END-START),tri))
    for lo,hi in zip(breaks,breaks[1:]):
        if hi-lo<TOL:continue
        active=[h for h in hits if h['interval'][0]<(lo+hi)/2<h['interval'][1]];soil=[h for h in active if h['soil']]
        piece=dict(t=[lo,hi],supports=active,nonsoilCount=sum(not h['soil'] for h in active),soilCount=len(soil))
        if len(soil)==1:
            hit=soil[0];a,_=native(hit,lo);b,_=native(hit,hi);world=np.array([a['world'],b['world']]);length=float(np.linalg.norm(world[1]-world[0]));su=slope_upper([a['normal'],b['normal']]);contacts=[a['contactDistance'],b['contactDistance']]
            wl=LineString(world[:,[0,2]]);distances=dict(grove=float(wl.distance(Point(-139.40268,-210.74617))),oasis=float(wl.distance(box(-18,-204,34,-131))),estate=float(wl.distance(box(18,-210,132,-125))),route=float(wl.distance(LineString([[48,-144],[0,-96]]))))
            clear=all(distances[k]>v for k,v in dict(grove=42,oasis=12,estate=10,route=9).items())
            reduced=su<.012 and world[:,1].max()<2 and max(contacts)<10
            piece.update(worldEndpoints=world.tolist(),worldLength=length,worldArcStart=arc,normalEndpoints=[a['normal'],b['normal']],slopeUpperBound=su,heightMaximum=float(world[:,1].max()),contactEndpoints=contacts,coastEndpoints=[a['coastDistance'],b['coastDistance']],coverageReducesToContactGate=bool(reduced),protectionDistanceLowerBounds=distances,outsideAllProtectionFringes=bool(clear))
            # Invert smoothstep by fixed80-step bisection, then solve affine contact.
            for coverage in [0.,.1,.5,.9,1.]:
                low=0.;high=1.
                for _ in range(80):
                    mid=(low+high)/2
                    if mid*mid*(3-2*mid)<coverage:low=mid
                    else:high=mid
                c=coverage-1 if coverage in [0.,1.] else (low+high)/2-1
                if contacts[0]!=contacts[1]:
                    f=(c-contacts[0])/(contacts[1]-contacts[0])
                    if -TOL<=f<=1+TOL:
                        t=lo+f*(hi-lo);thresholds.append(dict(coverage=coverage,contact=c,t=t,localXZ=(START+t*(END-START)).tolist(),world=(world[0]+f*(world[1]-world[0])).tolist(),worldArc=arc+f*length))
            arc+=length
        pieces.append(piece)
    # The retained census omits open ocean. Check its authenticated uploaded span
    # separately in WORLD XZ, against each affine terrain piece.
    pkg=json.loads((Path(mesh)/'package.json').read_text());ocean_spans=[s for s in pkg['primitiveSpans'] if s.get('materialIntent')=='ONE_CONTINUOUS_OPEN_OCEAN_TO_GEOMETRIC_HORIZON']
    base=data.attrs['base-gpu'];ocean=[];ocean_degenerate=[]
    for span in ocean_spans:
        indices=base['indices'][span['indexStart']:span['indexStart']+span['indexCount']].reshape(-1,3);tris=base['positions'].reshape(-1,3)[indices].astype(float)
        for pi,piece in enumerate(pieces):
            if 'worldEndpoints' not in piece:continue
            world=np.array(piece['worldEndpoints']);a,b=world[:,[0,2]]
            for ti,tri in enumerate(tris):
                xz=tri[:,[0,2]]
                if np.any(xz.max(axis=0)<np.minimum(a,b)-TOL) or np.any(xz.min(axis=0)>np.maximum(a,b)+TOL):continue
                if abs(np.linalg.det(np.column_stack((xz[1]-xz[0],xz[2]-xz[0]))))<1e-12:
                    if Polygon(xz).convex_hull.intersects(LineString([a,b])):ocean_degenerate.append(dict(piece=pi,triangle=ti))
                    continue
                interval=clip_triangle(a,b,tri)
                if interval is None:continue
                gaps=[]
                for f in interval:
                    terrain=world[0]+f*(world[1]-world[0]);water=source_weights(terrain[[0,2]],tri)@tri;gaps.append(float(terrain[1]-water[1]))
                crossing=None
                if gaps[0]*gaps[1]<0:crossing=interval[0]-gaps[0]*(interval[1]-interval[0])/(gaps[1]-gaps[0])
                ocean.append(dict(piece=pi,span=span['primitiveId'],triangleWithinSpan=ti,pieceFraction=interval,globalT=[piece['t'][0]+f*(piece['t'][1]-piece['t'][0]) for f in interval],terrainMinusOceanYEndpoints=gaps,heightCrossingPieceFraction=crossing))
    sample_ts=clustered(np.linspace(0,1,65).tolist()+breaks+[v['t'] for v in thresholds]);samples=[];joins=[]
    for t in sample_ts:
        active=[h for h in hits if h['soil'] and h['interval'][0]-TOL<=t<=h['interval'][1]+TOL];variants=[]
        for hit in active:
            inp,meta=native(hit,t);result=evaluate_material(dict(inp,eye=data.eyes[0].tolist()),data.texture);f=factors(inp,result['fields']['slope']);sand=next(s for s in result['stages'] if s['id']=='sand');error=float(np.max(abs(np.array(sand['gain'])-(1-f['coverage']))))
            if error>1e-12:raise ValueError('SAND_FORMULA_MISMATCH')
            variants.append(dict(parent=meta,native={k:inp[k] for k in ['world','normal','contactDistance','coastDistance','atlasDeltaRGB','marginDelta']},slope=result['fields']['slope'],factors=f,sandStage=sand,coefficients=result['coefficients'],uncertainties=result['uncertainties'],coverageResidual=error))
        samples.append(dict(t=t,localXZ=(START+t*(END-START)).tolist(),parents=variants))
        if len(variants)>1:
            keys=['world','normal','contactDistance','coastDistance','atlasDeltaRGB','marginDelta'];errors={k:max(float(np.max(abs(np.asarray(v['native'][k])-np.asarray(variants[0]['native'][k])))) for v in variants) for k in keys};joins.append(dict(t=t,parentCount=len(variants),maximumNativeDifferences=errors,maximumCoefficientDifference=max(float(np.max(abs(np.array([v['coefficients']['A'],v['coefficients']['B']])-np.array([variants[0]['coefficients']['A'],variants[0]['coefficients']['B']])))) for v in variants)))
    if not all(p.get('coverageReducesToContactGate',False) for p in pieces):raise ValueError('CONTACT_GATE_REDUCTION_NOT_PROVEN')
    widths={}
    for name,a,b in [('fullGate',0.,1.),('tenToNinety',.1,.9)]:
        aa=[v for v in thresholds if v['coverage']==a];bb=[v for v in thresholds if v['coverage']==b]
        if len(aa)==len(bb)==1:widths[name]=dict(worldArcMetres=abs(aa[0]['worldArc']-bb[0]['worldArc']),localDistance=2*abs(aa[0]['t']-bb[0]['t']))
    report=dict(schema='H_EARTH_RANK1_SAND_SOURCE_TRACE_v1',sourceHead=data.sm['sourceHead'],evaluatorCheckpoint='6d73b6012b40e9ddd7fa7ce84db7bcd979fcdab9',scriptSha256=digest(Path(__file__)),dependencies={n:digest(Path(evidence)/n) for n in ['classify_material.py','material_stages.py','classification.json','source-manifest.json','ordered-source-manifest.json','geometry.json','attributes.json']},segmentLocalXZ=[START.tolist(),END.tolist()],intersectionMethod='All local-XZ projected triangle affine halfspace clips in binary64;1e-10 boundary tolerance; no grid approximation',retainedCensusSurfaceIntersectionCounts=surface_counts,openOcean=dict(authenticatedSpans=ocean_spans,worldXZIntersections=ocean,degenerateProjectedIntersections=ocean_degenerate,claim='Geometric projected co-support and linear height comparison only; no raster/depth visibility claim'),triangleIntervals=hits,degenerateProjectedIntersections=degenerate,pieces=pieces,joins=joins,thresholds=thresholds,widths=widths,samples=samples,cameraDistanceState=data.eyes[0].tolist(),summary=dict(retainedCensusOpenPiecesSingleSoilNoNonsoil=not degenerate and all(p['soilCount']==1 and p['nonsoilCount']==0 for p in pieces) and all(h['soil'] for h in hits),allPiecesContactGateOnly=all(p.get('coverageReducesToContactGate',False) for p in pieces),allPiecesOutsideProtection=all(p.get('outsideAllProtectionFringes',False) for p in pieces),sampleQueries=sum(len(s['parents']) for s in samples),helperOutsideQueries=sum(v['parent']['helpersOutsideParent']>0 for s in samples for v in s['parents']),uncertainQueries=sum(bool(v['uncertainties']) for s in samples for v in s['parents'])),limits=['Retained census inventory excludes open ocean; its authenticated uploaded span is checked separately in world XZ. Neither geometric test establishes depth visibility, dry ground or walkability.','Local authoring XZ is clipped first; native world positions and world arc lengths are separately interpolated.','Shared-edge parents are retained independently; synthetic differential helpers outside parents are flagged, not certified GPU derivatives.','Analytic bounds establish only the sand coverage reduction and continuous protected-distance exclusion. Fine samples do not certify all other stage behavior.','This identifies the existing native contact gate, not visual correctness or a repair target. Final substrate RGB, lighting and GPU precision remain unresolved.','No product edits, expanded census, GPU run, merge, deployment or publication.'])
    Path(output).write_text(json.dumps(report,indent=2,sort_keys=True)+'\n');print(json.dumps(dict(summary=report['summary'],widths=widths,pieces=pieces,joins=joins)))

if __name__=='__main__':trace(*sys.argv[1:])
