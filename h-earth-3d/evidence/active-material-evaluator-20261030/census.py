"""CPU authoring-space support, no depth winner or material defect inference."""
from pathlib import Path
import json,hashlib,sys
import numpy as np
import shapely
from shapely.strtree import STRtree

def classify_layers(hits,tolerance=1e-4):
    # A shared-edge duplicate is collapsible only within the same mesh and height.
    groups=[]
    for name,y,interior in hits:
        match=next((g for g in groups if g[0]==name and abs(g[1]-y)<=tolerance),None)
        if match is None:groups.append([name,y,1,int(interior)])
        else:match[2]+=1;match[3]+=int(interior)
    if not groups:return 'no-support'
    if len(groups)>1:return 'multiple-layers'
    return 'multiple-interiors' if groups[0][3]>1 else 'single-layer'

def main(directory,out):
    directory=Path(directory);report=json.loads((directory/'geometry.json').read_text());coords=np.array([(x,z) for z in range(-399,-80,2) for x in range(-255,256,2)],float);points=shapely.points(coords)
    soil=[[] for _ in coords];other=[[] for _ in coords];surface_rows=[];world_samples=[]
    for surface in report['surfaces']:
        arrays={}
        for k,info in surface['files'].items():
            b=(directory/info['file']).read_bytes()
            if hashlib.sha256(b).hexdigest()!=info['sha256']:raise ValueError('GEOMETRY_HASH:'+info['file'])
            arrays[k]=np.frombuffer(b,{'Float64Array':'<f8','Float32Array':'<f4','Uint32Array':'<u4'}[info['type']])
        idx=arrays['indices'].reshape(-1,3);verts=arrays['local'].reshape(-1,3);tri=verts[idx];polys=shapely.polygons(tri[:,:,[0,2]]);valid=shapely.area(polys)>1e-10;active_ids=np.flatnonzero(valid);tree=STRtree(polys[valid]);pairs=tree.query(points,predicate='covered_by');pi=pairs[0];ti=active_ids[pairs[1]]
        if len(pi):
            t=tri[ti];x,z=coords[pi].T;a,b,c=t[:,0],t[:,1],t[:,2];den=(b[:,2]-c[:,2])*(a[:,0]-c[:,0])+(c[:,0]-b[:,0])*(a[:,2]-c[:,2]);u=((b[:,2]-c[:,2])*(x-c[:,0])+(c[:,0]-b[:,0])*(z-c[:,2]))/den;v=((c[:,2]-a[:,2])*(x-c[:,0])+(a[:,0]-c[:,0])*(z-c[:,2]))/den;w=1-u-v;y=u*a[:,1]+v*b[:,1]+w*c[:,1];interior=np.minimum(np.minimum(u,v),w)>1e-8
            target=soil if surface['correctionHook'] else other
            for j,h,inside in zip(pi,y,interior):target[j].append((surface['name'],float(h),bool(inside)))
            wt=arrays['upload'].reshape(-1,3)[idx[ti]];wp=u[:,None]*wt[:,0]+v[:,None]*wt[:,1]+w[:,None]*wt[:,2]
            if surface['correctionHook']:world_samples.append(wp)
            multiplicity=np.bincount(pi,minlength=len(coords))
            row={'name':surface['name'],'triangles':surface['triangles'],'nondegenerateXZTriangles':int(valid.sum()),'gridPointsWithSupport':int((multiplicity>0).sum()),'triangleHits':len(pi),'interiorHits':int(interior.sum()),'hook':surface['correctionHook']}
        else:row={'name':surface['name'],'triangles':surface['triangles'],'nondegenerateXZTriangles':int(valid.sum()),'gridPointsWithSupport':0,'triangleHits':0,'interiorHits':0,'hook':surface['correctionHook']}
        surface_rows.append(row)
    from collections import Counter
    counts=Counter(classify_layers(h) for h in soil)
    examples=[{'localXZ':coords[i].tolist(),'classification':classify_layers(h),'hits':h} for i,h in enumerate(soil) if classify_layers(h)!='single-layer'][:12]
    # Synthetic source sensitivity states, not GPU camera poses or navigation acceptance.
    camera_local=[[0,2,-160],[40,2,-300],[-160,2,-350]];camera_world=[]
    for x,y,z in camera_local:
        r=np.hypot(x,z);angle=r/420000;k=(420000+y)*np.sin(angle)/r;camera_world.append([x*k,(420000+y)*np.cos(angle)-420000,z*k])
    wp=np.concatenate(world_samples);env={};
    for name,lo,hi in [('nearDetail',72,250),('microDistanceEnvelope',105,285),('nearMaterial',55,220),('soilReliefDistance',92,240)]:
        dist=np.linalg.norm(wp[:,None,:]-np.array(camera_world)[None,:,:],axis=2);t=np.clip((dist-lo)/(hi-lo),0,1);values=1-t*t*(3-2*t);spread=np.ptp(values,axis=1)
        env[name]={'maxSpread':float(spread.max()),'triangleHitsSpreadAbove1e-6':int((spread>1e-6).sum()),'minByCamera':values.min(axis=0).tolist(),'maxByCamera':values.max(axis=0).tolist()}
    result={'schema':'H_EARTH_ACTIVE_SURFACE_CENSUS_v1','sourceHead':report['sourceHead'],'localNavigationRectangle':[-256,-400,256,-80],'gridStep':2,'gridPointCount':len(coords),'surfaceRows':surface_rows,'hookEligibleLayerClasses':dict(counts),'nonHookSurfacePoints':sum(bool(h) for h in other),'examplesUnresolvedLayers':examples,'cameraSensitivity':{'scope':'SYNTHETIC_DISTANCE_OPERANDS_ONLY_NOT_COMPLETE_MATERIAL_OR_VALIDATED_CAMERA_POSES','localCameraInputs':camera_local,'worldCameraInputs':camera_world,'triangleHitCount':len(wp),'envelopes':env},'materialCoefficients':report['materialStatus'],'limits':report['limits']+['Grid centers are correlated support samples, not continuous area or complete boundary coverage.','Multiple layers remain unresolved; no highest/lowest depth winner selected.','Native unprojected vertices resolve the previous coordinate-space caveat for this CPU grid.','Distance envelope changes prove camera operand dependence, not visible differences or complete coefficient dependence.','All complete material coefficients remain unresolved until actual source/rim attributes, resident textures and camera derivatives are supplied.']}
    Path(out).write_text(json.dumps(result,indent=2)+'\n');print(json.dumps({'classes':dict(counts),'surfaces':surface_rows,'cameraOperands':env},indent=2))
if __name__=='__main__':main(sys.argv[1],sys.argv[2])
