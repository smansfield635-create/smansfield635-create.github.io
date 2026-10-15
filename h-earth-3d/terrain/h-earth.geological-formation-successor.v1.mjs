/** H_EARTH_GEOLOGICAL_FORMATION_SUCCESSOR_v1
 * Stage-1 physical construction prototype, not activated in the H-Earth renderer.
 * Deterministic local excavation + hollow chamber + rearward dry drainage derive
 * from one material/occupancy source. Geometry is in canonical local XYZ.
 * It is NOT a replacement authority for G_world, Packet 001/002, Run 8B,
 * South/West, navigation, water, renderer, or production. No source mutation.
 */
const F=Object.freeze;
export const H_EARTH_GEOLOGICAL_FORMATION_CONTRACT_ID='H_EARTH_GEOLOGICAL_FORMATION_SUCCESSOR_v1';
export const GEOLOGICAL_FORMATION_SITES=F({
  A_EASTERN_REAR_ESCARPMENT:F({id:'A_EASTERN_REAR_ESCARPMENT',x:80,portalZ:-264,drainageHeadZ:-270,entranceFloorY:10.8,roofClearance:6.8,width:4.5,galleryLength:30}),
  B_REAR_RAVINE:F({id:'B_REAR_RAVINE',x:40,portalZ:-260,drainageHeadZ:-268,entranceFloorY:11.3,roofClearance:5.3,width:3.8,galleryLength:24})
});
const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
const smoother=x=>{x=clamp(x,0,1);return x*x*x*(x*(x*6-15)+10)};
const finite=(v)=>typeof v==='number'&&Number.isFinite(v);
const gSafe=(f,x,z)=>{const q=f(x,z);if(!finite(q))throw Error('FORMATION_NONFINITE_GROUND:'+x+':'+z);return q};
const distance=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
const quant=v=>Math.round(v*1e6)/1e6;
const as3=(x,y,z)=>F({x:quant(x),y:quant(y),z:quant(z)});
const PLANET_RADIUS=420000;
/** Inverse of the existing Run8E exactSpherePoint, not planar sag approximation.
 * Canonical package positions are spherical presentation vertices; navigation,
 * erosion and site IDs must use authored local-region XYZ, then reproject for GPU.
 */
export function unprojectPlanetVertex(px,py,pz){
  assert([px,py,pz].every(finite),'PLANET_VERTEX_NONFINITE');
  const rp=Math.hypot(px,pz),angle=Math.atan2(rp,py+PLANET_RADIUS),r=PLANET_RADIUS*angle,scale=rp? r/rp:1;
  return F({x:px*scale,y:Math.hypot(rp,py+PLANET_RADIUS)-PLANET_RADIUS,z:pz*scale});
}
export function projectRegionVertex(x,y,z){
  assert([x,y,z].every(finite),'REGION_VERTEX_NONFINITE');
  const r=Math.hypot(x,z);if(r<=Number.EPSILON)return F({x:0,y,z:0});
  const a=r/PLANET_RADIUS,k=(PLANET_RADIUS+y)*Math.sin(a)/r;
  return F({x:x*k,y:(PLANET_RADIUS+y)*Math.cos(a)-PLANET_RADIUS,z:z*k});
}
/** Exact canonical terrain triangles in local authoring space with deterministic
 * first-triangle ownership. This is an input sampler, never a second world field.
 */
export function makeCanonicalAuthoringTerrainSampler(packageRecord,{bounds={xMin:-160,xMax:192,zMin:-384,zMax:-120},binSize=16}={}){
  const position=packageRecord?.buffers?.positions,index=packageRecord?.buffers?.indices,spans=packageRecord?.primitiveSpans;
  assert(Array.isArray(position)&&Array.isArray(index)&&Array.isArray(spans),'CANONICAL_BUFFER_INPUT');
  const buckets=new Map(),triangles=[];let nativeCount=0;
  const read=id=>{assert(Number.isSafeInteger(id)&&id>=0&&id*3+2<position.length,'INDEX_OUT_OF_BOUNDS');const o=id*3;return unprojectPlanetVertex(Math.fround(position[o]),Math.fround(position[o+1]),Math.fround(position[o+2]))};
  for(const span of spans.filter(x=>x.role==='TERRAIN')){
    for(let j=span.indexStart;j<span.indexStart+span.indexCount;j+=3){nativeCount++;
      const [a,b,c]=[read(index[j]),read(index[j+1]),read(index[j+2])];
      const minX=Math.min(a.x,b.x,c.x),maxX=Math.max(a.x,b.x,c.x),minZ=Math.min(a.z,b.z,c.z),maxZ=Math.max(a.z,b.z,c.z);
      if(maxX<bounds.xMin||minX>bounds.xMax||maxZ<bounds.zMin||minZ>bounds.zMax)continue;
      const d=(b.z-c.z)*(a.x-c.x)+(c.x-b.x)*(a.z-c.z);
      if(Math.abs(d)<1e-10)continue;
      const v=triangles.length;triangles.push({a,b,c,d,j,minX,maxX,minZ,maxZ});
      for(let ix=Math.floor(minX/binSize);ix<=Math.floor(maxX/binSize);ix++)for(let iz=Math.floor(minZ/binSize);iz<=Math.floor(maxZ/binSize);iz++){
        const key=ix+':'+iz,items=buckets.get(key)||[];items.push(v);buckets.set(key,items);
      }
    }
  }
  assert(triangles.length>0,'NO_TERRAIN_IN_STUDY');
  const sample=(x,z)=>{
    for(const id of buckets.get(Math.floor(x/binSize)+':'+Math.floor(z/binSize))||[]){const t=triangles[id];
      if(x<t.minX-1e-6||x>t.maxX+1e-6||z<t.minZ-1e-6||z>t.maxZ+1e-6)continue;
      const {a,b,c,d}=t,u=((b.z-c.z)*(x-c.x)+(c.x-b.x)*(z-c.z))/d,v=((c.z-a.z)*(x-c.x)+(a.x-c.x)*(z-c.z))/d,w=1-u-v;
      if(Math.min(u,v,w)>=-1e-6)return F({x,z,y:u*a.y+v*b.y+w*c.y,triangleOffset:t.j,interpolatedFromActualVertices:true});
    }return null;
  };
  return F({sample,elevation:(x,z)=>sample(x,z)?.y,triangleCount:triangles.length,fullTerrainTriangles:nativeCount,coordinateFrame:'LOCAL_AUTHORING_INVERTED_EXACT_SPHERICAL_PROJECTION',binaryUnchanged:true});
}

const triangleArea2=(a,b,c)=>Math.hypot((b.y-a.y)*(c.z-a.z)-(b.z-a.z)*(c.y-a.y),(b.z-a.z)*(c.x-a.x)-(b.x-a.x)*(c.z-a.z),(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x));
function assert(cond,code){if(!cond)throw Error('FORMATION_INVALID:'+code)}

/** Full centerline from the exact indexed D8 survey, augmented with the uphill portal.
 * The seasonal channel's excavated bed is strictly nonascending toward the valley,
 * but no freshwater source or permanent flow is invented.
 */
export function deriveDryDrainage(site,surveyRoute){
  assert(site&&Array.isArray(surveyRoute?.path)&&surveyRoute.path.length>=10,'DRAINAGE_SURVEY_ROUTE_REQUIRED');
  const route=surveyRoute.path.map((v,i)=>{assert(finite(v.x)&&finite(v.z)&&finite(v.height),'ROUTE_SAMPLE_'+i);return {x:v.x,z:v.z,originalY:v.height}});
  assert(Math.hypot(route[0].x-site.x,route[0].z-site.drainageHeadZ)<1e-6,'DRAINAGE_START_DISAGREES_WITH_SITE');
  for(let i=1;i<route.length;i++){assert(distance(route[i],route[i-1])>0,'ROUTE_DUPLICATED');assert(route[i].originalY<=route[i-1].originalY+1e-4,'ROUTE_NOT_DOWNHILL')}
  const first=site.entranceFloorY;
  assert(first<route[0].originalY,'ENTRANCE_FLOOR_NOT_EXCAVATED');
  const head={x:site.x,z:site.portalZ,originalY:first,bedY:first};
  let previous=first;
  const profile=route.map((v,i)=>{
    const d=Math.hypot(v.x-head.x,v.z-head.z);
    // A localized headcut tapers to ordinary ~0.6 m incision beyond 28 m.
    const design= v.originalY-(0.45+0.25*smoother(1-d/28));
    const approach=first-0.085*d;
    const mix=smoother(d/28);
    // the upstream excavated bed must connect continuously and monotonically
    const raw=(1-mix)*approach+mix*design;
    const bed=Math.min(previous-0.008,raw,v.originalY-0.25);
    previous=bed;
    return {x:v.x,z:v.z,originalY:v.originalY,bedY:quant(bed)};
  });
  const full=[head,...profile];
  for(let i=1;i<full.length;i++)assert(full[i].bedY<full[i-1].bedY,'DRAINAGE_BED_NOT_DESCENDING');
  return F({id:'SEASONAL_REAR_VALLEY_EROSION_CORRIDOR',waterPresent:false,waterSourceProven:false,permanentFlowProven:false,sourceType:'SEASONAL_SEEP_CANDIDATE_NOT_CERTIFIED',downhillDirection:'AWAY_FROM_PORTAL',points:F(full.map(x=>F(x))),lastSurveyStatus:surveyRoute.result,connectedOutletProven:false,entersOasisStudyFootprint:surveyRoute.result==='ENTERS_OASIS_STUDY_FOOTPRINT',studyEdgeUnresolved:surveyRoute.result==='STUDY_EDGE_UNRESOLVED'});
}
function nearestSegment(points,x,z){
  let best=null;for(let i=0;i<points.length-1;i++){const a=points[i],b=points[i+1],dx=b.x-a.x,dz=b.z-a.z,den=dx*dx+dz*dz;
    if(den<1e-8)continue;const t=clamp(((x-a.x)*dx+(z-a.z)*dz)/den,0,1),qx=a.x+dx*t,qz=a.z+dz*t,ds=Math.hypot(x-qx,z-qz);
    if(!best||ds<best.distance)best={distance:ds,x:qx,z:qz,bedY:a.bedY+(b.bedY-a.bedY)*t,segment:i,t};
  }return best;
}
/** The landform owns terrain modifiers; all derivatives use one shared function. */
export function createGeologicalFormation({terrainAt,site=GEOLOGICAL_FORMATION_SITES.A_EASTERN_REAR_ESCARPMENT,surveyRoute}){
  assert(typeof terrainAt==='function','TERRAIN_SAMPLER_REQUIRED');
  const drainage=deriveDryDrainage(site,surveyRoute);
  const samples=[site.portalZ,site.portalZ+4,site.portalZ+12,site.portalZ+site.galleryLength];
  for(const z of samples)gSafe(terrainAt,site.x,z);
  const roofAt=(x,z)=>{
    const t=clamp((z-site.portalZ)/site.galleryLength,0,1);
    const floor=site.entranceFloorY+0.025*(z-site.portalZ);
    const height=site.roofClearance+0.65*Math.sin(Math.PI*t)-0.2*Math.cos((x-site.x)*.64+2.3*t);
    return floor+height;
  };
  const floorAt=(x,z)=>site.entranceFloorY+0.025*(z-site.portalZ)+0.12*Math.pow((x-site.x)/site.width,2);
  const caveRadius=(z)=>site.width*(0.94+0.12*Math.sin((z-site.portalZ)*.37));
  const inGallery=(x,z)=>z>=site.portalZ&&z<=site.portalZ+site.galleryLength&&Math.abs(x-site.x)<caveRadius(z);
  function insideVoid(x,y,z){if(!inGallery(x,z))return false;const fy=floorAt(x,z),cy=roofAt(x,z);
    const normX=Math.abs(x-site.x)/caveRadius(z);
    const archCeiling=fy+(cy-fy)*Math.pow(Math.max(0,1-normX*normX),0.375);
    return y>=fy&&y<archCeiling;
  }
  function excavatedOutdoorTerrain(x,z){const base=gSafe(terrainAt,x,z),nearest=nearestSegment(drainage.points,x,z);if(!nearest)return base;
    // Outside the portal, rounded valley banks emerge without rectangular edges.
    // Behind the portal, preserve the mountain roof rather than lowering terrain.
    const forwardDistance=Math.max(0,z-site.portalZ);
    const backFade=1-smoother(forwardDistance/4);
    const radius=7.2+1.25*Math.sin(nearest.segment*.28);
    const r=nearest.distance/radius;if(r>=1||backFade<=0)return base;
    const w=smoother(1-r)*backFade;
    return base-Math.max(0,base-nearest.bedY)*w;
  }
  function rockSolidAt(x,y,z){const outdoor=excavatedOutdoorTerrain(x,z);return y<=outdoor&&!insideVoid(x,y,z)}
  // Hard contract: roof must lie under terrain at all centerline stations.
  const coverSamples=[];
  for(let z=site.portalZ;z<=site.portalZ+site.galleryLength;z+=2){const cover=gSafe(terrainAt,site.x,z)-roofAt(site.x,z);
    coverSamples.push(F({z:quant(z),terrainY:quant(gSafe(terrainAt,site.x,z)),ceilingY:quant(roofAt(site.x,z)),rockCover:quant(cover)}));
  }
  return F({contractId:H_EARTH_GEOLOGICAL_FORMATION_CONTRACT_ID,site,drainage,insideVoid,rockSolidAt,excavatedOutdoorTerrain,floorAt,roofAt,caveRadius,coverSamples:F(coverSamples),minimumRoofCover:Math.min(...coverSamples.map(x=>x.rockCover)),waterPresent:false,canonicalWorldMutated:false,rendererActivated:false});
}
/** Shared-vertex cave boundary for a physical floor, irregular wall/roof and back face.
 * Every interior edge is paired; only the public-facing entrance remains open.
 * Ambient/accessibility lighting is a downstream renderer responsibility.
 */
export function constructCavernBoundary(f,{step=1.5,slices=20,floorSegments=8}={}){
  const s=f.site;
  assert(Number.isInteger(slices)&&slices>=12&&slices<=64&&Number.isInteger(floorSegments)&&floorSegments>=4&&floorSegments<=32,'CAVE_RING_RESOLUTION');
  assert(finite(step)&&step>0&&s.galleryLength/step===Math.round(s.galleryLength/step),'CAVE_LONGITUDINAL_GRID');
  const rings=[],positions=[],indices=[],triangleMaterials=[],nLong=Math.round(s.galleryLength/step),ringCount=slices+floorSegments;
  const add=(p)=>{positions.push(p.x,p.y,p.z);return positions.length/3-1};
  for(let j=0;j<=nLong;j++){
    const z=s.portalZ+j*step,r=f.caveRadius(z),ring=[];
    // Portal arch is an irregular excavated rock cavity, NOT an added decorative arch.
    for(let i=0;i<=slices;i++){
      const theta=Math.PI*i/slices,off=-Math.cos(theta)*r,x=s.x+off,fy=f.floorAt(x,z),h=f.roofAt(x,z)-fy;
      ring.push(add(as3(x,fy+h*Math.pow(Math.max(0,Math.sin(theta)),0.75),z)));
    }
    // The lower chord is real walkable cave floor, back to the first arch vertex.
    for(let k=1;k<floorSegments;k++){
      const off=r*(1-2*k/floorSegments),x=s.x+off;
      ring.push(add(as3(x,f.floorAt(x,z),z)));
    }
    assert(ring.length===ringCount,'CAVE_LOOP_SIZE');rings.push(ring);
  }
  const emit=(a,b,c,mat)=>{indices.push(a,b,c);triangleMaterials.push(mat)};
  for(let j=0;j<nLong;j++){
    for(let i=0;i<ringCount;i++){
      const k=(i+1)%ringCount,a=rings[j][i],b=rings[j][k],c=rings[j+1][i],d=rings[j+1][k];
      const role=i<slices?1:2;
      emit(a,c,b,role);emit(b,c,d,role);
    }
  }
  const terminal=rings.at(-1),center=add(as3(s.x,f.floorAt(s.x,s.portalZ+s.galleryLength)+s.roofClearance*.39,s.portalZ+s.galleryLength));
  for(let i=0;i<ringCount;i++)emit(terminal[i],terminal[(i+1)%ringCount],center,3);
  const normals=new Float64Array(positions.length);
  for(let i=0;i<indices.length;i+=3){const ia=indices[i]*3,ib=indices[i+1]*3,ic=indices[i+2]*3;
    const ax=positions[ib]-positions[ia],ay=positions[ib+1]-positions[ia+1],az=positions[ib+2]-positions[ia+2];
    const bx=positions[ic]-positions[ia],by=positions[ic+1]-positions[ia+1],bz=positions[ic+2]-positions[ia+2];
    const nx=ay*bz-az*by,ny=az*bx-ax*bz,nz=ax*by-ay*bx;
    for(const v of [ia,ib,ic]){normals[v]+=nx;normals[v+1]+=ny;normals[v+2]+=nz}
  }
  for(let i=0;i<normals.length;i+=3){const l=Math.hypot(normals[i],normals[i+1],normals[i+2])||1;normals[i]/=l;normals[i+1]/=l;normals[i+2]/=l}
  const edgeCounts=new Map();
  for(let i=0;i<indices.length;i+=3){for(let e=0;e<3;e++){const u=indices[i+e],v=indices[i+(e+1)%3],key=Math.min(u,v)+':'+Math.max(u,v);edgeCounts.set(key,(edgeCounts.get(key)||0)+1)}}
  const boundaryEdges=[...edgeCounts.entries()].filter(([,n])=>n===1).map(([k])=>k);
  const invalidEdges=[...edgeCounts.entries()].filter(([,n])=>n>2);
  const expectedOpeningEdges=ringCount;
  assert(!invalidEdges.length&&boundaryEdges.length===expectedOpeningEdges,'CAVE_NONMANIFOLD_OR_UNEXPECTED_OPENING');
  return F({positions:new Float32Array(positions),normals:new Float32Array(normals),indices:new Uint32Array(indices),triangleMaterials:new Uint8Array(triangleMaterials),vertexCount:positions.length/3,triangleCount:indices.length/3,entranceClosed:false,farEndClosed:true,boundaryEdgeCount:boundaryEdges.length,nonmanifoldEdgeCount:0,navSurface:'DERIVED_FROM_SHARED_FLOOR',ceilingNotSurfaceSkin:true,containsPhysicalFloor:true,coordinateFrame:'G_WORLD_WORLD_XYZ'});
}

/** Runtime integration witness, not a mutation: exact base-triangle offsets which
 * must be omitted when substituting the derived local terrain patch.
 */
export function deriveBaseTriangleRetirement(canonical,bounds,{sampleSpacing=8}={}){
  assert(Number.isInteger(sampleSpacing)&&sampleSpacing>0&&[bounds.xMin,bounds.xMax,bounds.zMin,bounds.zMax].every(v=>v%sampleSpacing===0),'MASK_GRID_ALIGNMENT');
  const p=canonical?.buffers?.positions,idx=canonical?.buffers?.indices,spans=canonical?.primitiveSpans;
  assert(Array.isArray(p)&&Array.isArray(idx)&&Array.isArray(spans),'MASK_CANONICAL_BUFFERS');
  const offsets=[];let boundaryIntersect=0,terrainTriangles=0;
  for(const span of spans.filter(x=>x.role==='TERRAIN')){
    for(let j=span.indexStart;j<span.indexStart+span.indexCount;j+=3){terrainTriangles++;
      const inMask=[idx[j],idx[j+1],idx[j+2]].map(v=>{assert(Number.isSafeInteger(v)&&v*3+2<p.length,'MASK_VERTEX_INDEX');const point=unprojectPlanetVertex(Math.fround(p[v*3]),Math.fround(p[v*3+1]),Math.fround(p[v*3+2]));return point.x>=bounds.xMin-0.01&&point.x<=bounds.xMax+0.01&&point.z>=bounds.zMin-0.01&&point.z<=bounds.zMax+0.01});
      if(inMask.every(Boolean))offsets.push(j);
      else if(inMask.some(Boolean))boundaryIntersect++;
    }
  }
  assert(offsets.length>0,'MASK_NO_TERRAIN');
  // Border vertices are shared across the exterior, so triangles outside mask
  // will of course share edges: this counter is a diagnostic, not a failure.
  return F({triangleOffsets:new Uint32Array(offsets),triangleCount:offsets.length,baseTrianglesExamined:terrainTriangles,partiallyVertexIncludedTriangles:boundaryIntersect,sourceCanonicalIndicesUnchanged:true,bounds:F({...bounds})});
}
/** A 2m local high-resolution terrain top, matching exact canonical base at its exterior boundary.
 * This is only the replacement-patch construction output; runtime must explicitly
 * remove base mesh triangles and coordinate refinement before activation.
 */
export function constructSurfaceReplacementPatch(f,{bounds={xMin:40,xMax:176,zMin:-368,zMax:-224},spacing=2}={}){
  assert([bounds.xMin,bounds.xMax,bounds.zMin,bounds.zMax].every(finite)&&bounds.xMax>bounds.xMin&&bounds.zMax>bounds.zMin,'BAD_BOUNDS');
  assert(Number.isInteger(spacing)&&spacing>=1&&spacing<=8&&(bounds.xMax-bounds.xMin)%spacing===0&&(bounds.zMax-bounds.zMin)%spacing===0,'PATCH_GRID_ALIGNMENT');
  const cols=(bounds.xMax-bounds.xMin)/spacing+1,rows=(bounds.zMax-bounds.zMin)/spacing+1;
  assert(cols*rows<=18000,'PATCH_VERTEX_BUDGET');
  const pos=[],idx=[];
  for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){let x=bounds.xMin+i*spacing,z=bounds.zMin+j*spacing,y=f.excavatedOutdoorTerrain(x,z);pos.push(x,y,z)}
  for(let j=0;j<rows-1;j++)for(let i=0;i<cols-1;i++){let a=j*cols+i,b=a+1,c=a+cols,d=c+1;idx.push(a,c,b,b,c,d)}
  return F({positions:new Float32Array(pos),indices:new Uint32Array(idx),vertexCount:pos.length/3,triangleCount:idx.length/3,bounds:F({...bounds}),spacing,grid:{cols,rows},source:'EXACT_WORLD_BASE_TRIANGLES_WITH_LOCAL_FORMATION_EXCAVATION',coordinateFrame:'LOCAL_AUTHORING_XYZ_NOT_SPHERICAL_GPU',canonicalPackageUnmodified:true});
}
export function evaluateFormation(f){const errors=[];if(f.minimumRoofCover<0)errors.push('CAVE_ROOF_EXPOSED_TO_SKY');
  const entrance=f.site;const inside=f.insideVoid(entrance.x,entrance.entranceFloorY+1,entrance.portalZ+4);
  if(!inside)errors.push('CAVE_ENTRANCE_NOT_OPEN');if(f.rockSolidAt(entrance.x,entrance.entranceFloorY+1,entrance.portalZ+4))errors.push('FALSE_CAVE_COLLISION');
  let ungraded=0;for(let i=1;i<f.drainage.points.length;i++){if(f.drainage.points[i].bedY>=f.drainage.points[i-1].bedY)ungraded++}if(ungraded)errors.push('OUTLET_NOT_DOWNHILL');
  return F({contractId:f.contractId,result:errors.length?'FAIL':'SOURCE_BOUND_CANDIDATE_GEOMETRY_ONLY',errors,minimumRoofCover:f.minimumRoofCover,entranceOpen:inside,drainagePoints:f.drainage.points.length,waterPresent:false,threeDimensionalCavityModel:true,actualRuntimeCollisionIntegration:false,actualAndroidPixels:false,baseTerrainRetirementActivated:false,portalFaceSeamsClosed:false,nearCameraRefinementIntegration:false,vegetationReprojection:false,riverbedRendered:false,liveWorldUnchanged:true});
}
