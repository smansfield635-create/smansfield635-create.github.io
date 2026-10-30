"""Independent geometric/source review of the retained rank1 sand segment.
Uses Shapely polygon intersections, not candidate barycentric interval clipper.
Source interpretation remains CPU-only and excludes omitted original ocean.
"""
import sys,json,hashlib
from pathlib import Path
import numpy as np
import shapely
from shapely.geometry import LineString,Point,box
E=Path(sys.argv[1]).resolve();sys.path.insert(0,str(E))
from classify_material import Inputs,source_weights

def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def run():
 d=Inputs(E,*sys.argv[2:8]);line=LineString([(-165,-129),(-165,-127)]); records=[]
 for s in d.geo['surfaces']:
  name=s['name'];a=d.surfaces[name];ids=a['indices'].reshape(-1,3);tri=a['local'].reshape(-1,3)[ids];polys=shapely.polygons(tri[:,:,[0,2]])
  hits=np.flatnonzero(shapely.intersects(polys,line))
  for i in hits:
   if shapely.area(polys[i])<=1e-10:continue
   inter=polys[i].intersection(line);coords=np.asarray(inter.coords);t=(coords[:,1]+129)/2
   rec=dict(surface=name,triangleIndex=int(i),correctionHook=s['correctionHook'],interval=[float(t.min()),float(t.max())]);values=[]
   for v in rec['interval']:
    w=source_weights(np.array([-165,-129+2*v]),tri[i]);inp,meta=d.native_inputs(name,int(i),w);values.append(inp)
   rec['endpointInputs']=[{k:v[k] for k in ['world','normal','contactDistance','coastDistance']} for v in values]
   normals=np.array([v['normal'] for v in values]);lowerY=normals[:,1].min();upperH=np.linalg.norm(normals[:,[0,2]],axis=1).max();rec['slopeUpperBound']=float(1-lowerY/np.hypot(lowerY,upperH));rec['worldYMax']=max(v['world'][1] for v in values)
   segment=LineString([np.array(v['world'])[[0,2]] for v in values]);rec['protectionOuterClearances']={'grove':segment.distance(Point(-139.40268,-210.74617))-42,'oasis':segment.distance(box(-18,-204,34,-131))-12,'estate':segment.distance(box(18,-210,132,-125))-10,'route':segment.distance(LineString([(48,-144),(0,-96)]))-9}
   rec['thresholds']=[]
   for gate in [0,-1]:
    c0,c1=[v['contactDistance'] for v in values]
    u=(gate-c0)/(c1-c0) if c0!=c1 else -1
    if 0<=u<=1:rec['thresholds'].append({'contact':gate,'t':rec['interval'][0]+u*(rec['interval'][1]-rec['interval'][0])})
   records.append(rec)
 ocean=[];base=d.attrs['base-gpu'];pkg=json.loads((Path(sys.argv[6])/'package.json').read_text())
 for span in pkg['primitiveSpans']:
  if span.get('materialIntent')!='ONE_CONTINUOUS_OPEN_OCEAN_TO_GEOMETRIC_HORIZON':continue
  ids=base['indices'][span['indexStart']:span['indexStart']+span['indexCount']].reshape(-1,3);tri=base['positions'].reshape(-1,3)[ids].astype(float);polys=shapely.polygons(tri[:,:,[0,2]])
  for pi,piece in enumerate(sorted(records,key=lambda r:r['interval'][0])):
   world=np.array([v['world'] for v in piece['endpointInputs']]);line2=LineString(world[:,[0,2]]);direction=world[1,[0,2]]-world[0,[0,2]]
   for ti in np.flatnonzero(shapely.intersects(polys,line2)):
    inter=polys[ti].intersection(line2);coords=np.asarray(inter.coords);f=(coords-world[0,[0,2]])@direction/(direction@direction);interval=[float(f.min()),float(f.max())];gaps=[]
    for q in interval:
     terrain=world[0]+q*(world[1]-world[0]);water=source_weights(terrain[[0,2]],tri[ti])@tri[ti];gaps.append(float(terrain[1]-water[1]))
    ocean.append(dict(piece=pi,triangleWithinSpan=int(ti),pieceFraction=interval,terrainMinusOceanYEndpoints=gaps))
 result={'schema' :'H_EARTH_SAND_SEGMENT_INDEPENDENT_GEOMETRY_v1','scope':'All nondegenerate retained census triangles intersected independently using GEOS; original ocean omitted from census; no GPU/visibility/repair acceptance.','surfaceInventory':[s['name'] for s in d.geo['surfaces']],'openOceanIntersections':ocean,'intersections':sorted(records,key=lambda r:(r['interval'][0],r['surface'],r['triangleIndex']))}
 Path(sys.argv[8]).write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))
run()
