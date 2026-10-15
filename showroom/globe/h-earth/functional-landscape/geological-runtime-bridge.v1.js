/** H_EARTH_GEN2735_RUNTIME_GEOLOGICAL_BRIDGE_v1
 * Candidate-only: derived from the immutable Run8E package; one shared formation
 * supplies surface geometry and the active physical navigation support. No new world.
 */
import {GEOLOGICAL_FORMATION_SITES,makeCanonicalAuthoringTerrainSampler,unprojectPlanetVertex,createGeologicalFormation,
        deriveBaseTriangleRetirement} from '../../../../h-earth-3d/terrain/h-earth.geological-formation-successor.v1.mjs';
import {constructGeologicalPortalAssembly,sampleFormationWalkable,projectGeologicalMeshForRenderer}
  from '../../../../h-earth-3d/terrain/h-earth.geological-portal-interface.v1.mjs';
export const GEOLOGICAL_RUNTIME_BRIDGE_ID='H_EARTH_GEN2735_RUNTIME_GEOLOGICAL_BRIDGE_v1';
const SITE=GEOLOGICAL_FORMATION_SITES.B_REAR_RAVINE;
const BOUNDS=Object.freeze({xMin:-120,xMax:96,zMin:-376,zMax:-224});
const DIRS=Object.freeze([[-1,-1],[0,-1],[1,-1],[-1,0],[1,0],[-1,1],[0,1],[1,1]]);
let active=null;
function fail(s){throw Error('GEOLOGICAL_RUNTIME_BRIDGE_INVALID:'+s)}
/** Reconstruct strict downhill flow from actual indexed canonical authoring heights. */
export function traceGeologicalRuntimeDrainage(sampler,site=SITE){
  let x=site.x,z=site.drainageHeadZ;let original=sampler(x,z);
  if(!Number.isFinite(original))fail('SOURCE_START');
  const path=[],visited=new Set();let result='MAX_ROUTE_STEPS';
  for(let n=0;n<300;n++){
    path.push({x,z,height:original});visited.add(x+','+z);
    let best=null,grade=0;
    for(const [dx,dz] of DIRS){const nx=x+2*dx,nz=z+2*dz;
      if(nx < -160||nx>160||nz< -384||nz> -120)continue;
      const next=sampler(nx,nz);if(!Number.isFinite(next))continue;
      const fall=(original-next)/(2*Math.hypot(dx,dz));
      if(fall>grade+1e-12){best={x:nx,z:nz,height:next};grade=fall;}
    }
    if(!best){result=(x<=-160||x>=160||z<=-384||z>=-120)?'STUDY_EDGE_UNRESOLVED':'NO_STRICT_LOWER_NEIGHBOR_IN_STUDY';break;}
    if(visited.has(best.x+','+best.z))fail('DRAINAGE_CYCLE');
    ({x,z}=best);original=best.height;
  }
  if(path.length<10)fail('INSUFFICIENT_ROUTE');
  return Object.freeze({path,result,surveyMethod:'ACTUAL_G_WORLD_CANONICAL_INDEXED_TRIANGLES_INVERSE_SPHERE_D8',waterPresent:false});
}
function buildWaterRibbon(route,kind){
  const points=route.points;if(points.length<2)fail('WATER_ROUTE_TOO_SHORT');
  // Let the visible channel wander inside its broad excavated valley. The
  // surveyed bed elevations remain authoritative; this small lateral bend
  // keeps the approach from reading as a straight blue strip at arrival scale.
  const centers=points.map((p,i)=>{
    const a=points[Math.max(0,i-1)],b=points[Math.min(points.length-1,i+1)],dx=b.x-a.x,dz=b.z-a.z,length=Math.hypot(dx,dz)||1;
    const t=i/(points.length-1),wave=Math.sin(t*Math.PI*3+0.35*Math.sin(t*Math.PI*4));
    const offset=(kind==='MAIN'?5.5:1.4)*Math.sin(Math.PI*t)*wave;
    return {...p,x:p.x-dz/length*offset,z:p.z+dx/length*offset};
  });
  const positions=[],indices=[];
  for(let i=0;i<centers.length;i++){
    const p=centers[i],a=centers[Math.max(0,i-1)],b=centers[Math.min(centers.length-1,i+1)];
    const dx=b.x-a.x,dz=b.z-a.z,length=Math.hypot(dx,dz)||1,nx=-dz/length,nz=dx/length;
    const t=i/(points.length-1),half=(kind==='MAIN'?1.15+2.25*t:0.85+0.75*t)*(0.9+0.1*Math.sin(i*.17+0.4));
    const y=p.bedY+0.24;
    positions.push(p.x+nx*half,y,p.z+nz*half,p.x-nx*half,y,p.z-nz*half);
    if(i){const q=2*i,r=q-2;indices.push(r,q,r+1,r+1,q,q+1)}
  }
  return Object.freeze({positions:new Float32Array(positions),indices:new Uint32Array(indices),vertexCount:positions.length/3,triangleCount:indices.length/3,routeId:route.id});
}
function buildOasisWater(formation,terrainAt){
  const basin=formation.oasis,step=1.5,positions=[],indices=[];
  const x0=basin.centerX-basin.radiusX,x1=basin.centerX+basin.radiusX,z0=basin.centerZ-basin.radiusZ,z1=basin.centerZ+basin.radiusZ;
  const cols=Math.ceil((x1-x0)/step),rows=Math.ceil((z1-z0)/step),shoreMargin=(x,z)=>{
    const dx=(x-basin.centerX)/basin.radiusX,dz=(z-basin.centerZ)/basin.radiusZ,angle=Math.atan2(dz,dx);
    const edge=1+basin.edgeHarmonics[0]*Math.sin(3*angle)+basin.edgeHarmonics[1]*Math.sin(5*angle+0.7)+basin.edgeHarmonics[2]*Math.cos(2*angle-0.4);
    const shore=0.98-Math.hypot(dx,dz)/edge;
    const basinFloor=(basin.waterLevel-formation.excavatedOutdoorTerrain(x,z))*.5;
    return Math.min(shore,basinFloor);
  };
  for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){
    const x=x0+i*step,z=z0+j*step,xn=Math.min(x1,x+step),zn=Math.min(z1,z+step);
    let polygon=[{x,z,margin:shoreMargin(x,z)},{x:xn,z,margin:shoreMargin(xn,z)},
      {x:xn,z:zn,margin:shoreMargin(xn,zn)},{x,z:zn,margin:shoreMargin(x,zn)}];
    const clipped=[];
    for(let k=0;k<polygon.length;k++){
      const a=polygon[k],b=polygon[(k+1)%polygon.length],insideA=a.margin>=0,insideB=b.margin>=0;
      if(insideA)clipped.push(a);
      if(insideA!==insideB){const t=a.margin/(a.margin-b.margin);clipped.push({x:a.x+(b.x-a.x)*t,z:a.z+(b.z-a.z)*t,margin:0});}
    }
    if(clipped.length<3)continue;
    const base=positions.length/3;
    for(const p of clipped)positions.push(p.x,basin.waterLevel,p.z);
    for(let k=1;k<clipped.length-1;k++)indices.push(base,base+k,base+k+1);
  }
  if(!indices.length)fail('OASIS_WATER_SURFACE_EMPTY');
  return Object.freeze({positions:new Float32Array(positions),indices:new Uint32Array(indices),vertexCount:positions.length/3,triangleCount:indices.length/3,waterLevel:basin.waterLevel});
}
function nearestRouteSegment(points,x,z){
  let best=null;
  for(let i=0;i<points.length-1;i++){
    const a=points[i],b=points[i+1],dx=b.x-a.x,dz=b.z-a.z,den=dx*dx+dz*dz;
    if(den<1e-8)continue;
    const t=Math.max(0,Math.min(1,((x-a.x)*dx+(z-a.z)*dz)/den)),qx=a.x+dx*t,qz=a.z+dz*t,distance=Math.hypot(x-qx,z-qz);
    if(!best||distance<best.distance)best={distance,x:qx,z:qz,bedY:a.bedY+(b.bedY-a.bedY)*t,segment:i,t};
  }
  return best;
}
function buildReliefCliffFace(formation,terrainAt,aperture){
  const {site}=formation,left=aperture.xMin,right=aperture.xMax,start=aperture.zMin,step=.5;
  const count=Math.ceil((right-left)/step),columns=count+1,rows=48,fade=v=>{v=Math.max(0,Math.min(1,v));return v*v*(3-2*v)};
  const tops=[],bottoms=[];let reliefMin=Infinity,reliefMax=-Infinity,minimumRockFaceClearance=Infinity;
  for(let i=0;i<=count;i++){
    const x=left+(right-left)*i/count,top=terrainAt(x,start),outside=formation.excavatedOutdoorTerrain(x,start);
    const centerX=formation.caveCenterX?.(start)??site.x,radius=formation.caveRadius(start),ratio=Math.abs(x-centerX)/radius;
    const floor=formation.floorAt(x,start),roof=formation.roofAt(x,start),arch=floor+(roof-floor)*Math.pow(Math.max(0,1-ratio*ratio),.375);
    const bottom=Math.abs(x-centerX)<radius?Math.max(outside,arch):outside;
    tops.push(top);bottoms.push(bottom);minimumRockFaceClearance=Math.min(minimumRockFaceClearance,top-bottom);
  }
  const positions=[],indices=[];
  for(let j=0;j<=rows;j++)for(let i=0;i<=count;i++){
    const x=left+(right-left)*i/count,t=j/rows,y=tops[i]+(bottoms[i]-tops[i])*t;
    const edgeFade=fade(Math.min((x-left)/2.5,(right-x)/2.5))*Math.sin(Math.PI*t);
    const strata=.42*Math.sin(y*1.9+.36*Math.sin(x*.57)-.28*Math.sin(y*.63+x*.19));
    const macro=.7*Math.sin(x*.27+y*.13+.8*Math.sin(y*.09-x*.11));
    const relief=edgeFade*(1.2*Math.sin(x*.82+y*.31)+.72*Math.sin(x*1.73-y*.91+1.2)+strata+macro);
    reliefMin=Math.min(reliefMin,relief);reliefMax=Math.max(reliefMax,relief);positions.push(x,y,start+relief);
  }
  for(let j=0;j<rows;j++)for(let i=0;i<count;i++){
    const a=j*columns+i,b=a+1,c=a+columns,d=c+1;
    for(const tri of [[a,c,b],[b,c,d]]){
      const x=(positions[tri[0]*3]+positions[tri[1]*3]+positions[tri[2]*3])/3;
      const y=(positions[tri[0]*3+1]+positions[tri[1]*3+1]+positions[tri[2]*3+1])/3;
      if(!formation.insideVoid(x,y,start+.25))indices.push(...tri);
    }
  }
  const mesh=Object.freeze({positions:new Float32Array(positions),indices:new Uint32Array(indices),vertexCount:positions.length/3,triangleCount:indices.length/3});
  return Object.freeze({mesh,diagnostics:Object.freeze({exposedFaceReliefMeters:reliefMax-reliefMin,minimumRockFaceClearance})});
}
/** Build only once when the canonical package is resident, never on a frame update. */
export function constructGeologicalRuntimeBridge(canonical){
  if(!canonical?.buffers?.positions||!canonical?.primitiveSpans)fail('NO_CANONICAL_PACKAGE');
  const field=makeCanonicalAuthoringTerrainSampler(canonical);
  // Pull the original canonical terrain's actual linear-color boundary values.
  // The replacement terrain must not create a giant hard-edged material rectangle.
  const originalTerrainColorAt=(x,z)=>{
    const sample=field.sample(x,z);if(!sample)return null;
    const offset=sample.triangleOffset,idx=canonical.buffers.indices,pos=canonical.buffers.positions,colors=canonical.buffers.baseColorsLinear;
    const ids=[idx[offset],idx[offset+1],idx[offset+2]];
    const p=ids.map(id=>unprojectPlanetVertex(Math.fround(pos[id*3]),Math.fround(pos[id*3+1]),Math.fround(pos[id*3+2])));
    const [a,b,c]=p,den=(b.z-c.z)*(a.x-c.x)+(c.x-b.x)*(a.z-c.z);
    if(Math.abs(den)<1e-10)fail('COLOR_TRIANGLE_DEGENERATE');
    const u=((b.z-c.z)*(x-c.x)+(c.x-b.x)*(z-c.z))/den;
    const v=((c.z-a.z)*(x-c.x)+(a.x-c.x)*(z-c.z))/den;
    const w=1-u-v;
    return [0,1,2].map(k=>Math.max(0,Math.min(1,u*colors[ids[0]*4+k]+v*colors[ids[1]*4+k]+w*colors[ids[2]*4+k])));
  };
  const terrainAt=(x,z)=>field.elevation(x,z);
  const trace=traceGeologicalRuntimeDrainage(terrainAt);
  // Two independently sampled highland branches converge with the main D8
  // corridor at the irregular basin. The water geometry inherits their real
  // terrain descent; the seep is an authored scenic feature, not a surveyed
  // hydrology claim.
  const baseFormation=createGeologicalFormation({terrainAt,site:SITE,surveyRoute:trace});
  // Erosion is deliberately irregular at the mouth and quieter deeper inside.
  // These same surfaces feed the cave mesh, walk support, and solid occupancy.
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const smooth=(v)=>{v=clamp(v,0,1);return v*v*(3-2*v)};
  const oasis=Object.freeze({id:'SECOND_OASIS',centerX:SITE.x,centerZ:SITE.portalZ-24,
    radiusX:38,radiusZ:34,edgeHarmonics:Object.freeze([.15,-.085,.055])});
  const oasisInfluenceAt=(x,z)=>{
    const dx=(x-oasis.centerX)/oasis.radiusX,dz=(z-oasis.centerZ)/oasis.radiusZ;
    const angle=Math.atan2(dz,dx),edge=1+oasis.edgeHarmonics[0]*Math.sin(3*angle)+
      oasis.edgeHarmonics[1]*Math.sin(5*angle+.7)+oasis.edgeHarmonics[2]*Math.cos(2*angle-.4);
    return smooth(1-Math.hypot(dx,dz)/edge);
  };
  const oasisCarveInfluenceAt=(x,z)=>{
    const portalSide=Math.abs(x-SITE.x)<=SITE.width+6;
    const awayFromPortal=smooth((SITE.portalZ-8-z)/12);
    return oasisInfluenceAt(x,z)*(portalSide?awayFromPortal:1);
  };
  const drainagePoints=Object.freeze(baseFormation.drainage.points.map(p=>Object.freeze({...p,bedY:p.bedY-1.25})));
  const channelInfluenceAt=(x,z)=>{
    const nearest=nearestRouteSegment(drainagePoints,x,z);if(!nearest)return 0;
    const approachFade=1-smooth((z-SITE.drainageHeadZ)/(SITE.portalZ-SITE.drainageHeadZ));
    const edge=Math.min(x-BOUNDS.xMin,BOUNDS.xMax-x,z-BOUNDS.zMin,BOUNDS.zMax-z);
    return smooth(1-nearest.distance/12)*approachFade*smooth(edge/12);
  };
  const excavatedOutdoorTerrain=(x,z)=>baseFormation.excavatedOutdoorTerrain(x,z)-
    1.25*channelInfluenceAt(x,z)-2.75*oasisCarveInfluenceAt(x,z);
  const oasisNearest=drainagePoints.reduce((best,p)=>
    !best||Math.hypot(p.x-oasis.centerX,p.z-oasis.centerZ)<best.distance?
      {distance:Math.hypot(p.x-oasis.centerX,p.z-oasis.centerZ),point:p}:best,null);
  const oasisWaterLevel=Math.min(terrainAt(oasis.centerX,oasis.centerZ)-1.2,oasisNearest.point.bedY+2.2);
  const drainage=Object.freeze({...baseFormation.drainage,waterPresent:true,waterSourceProven:false,
    permanentFlowProven:false,sourceType:'OWNER_AUTHORIZED_DESIGNED_SEEP_SCENIC_NOT_HYDROLOGICAL',
    points:drainagePoints,waterRoutes:Object.freeze([Object.freeze({id:'MAIN_RIVER',kind:'MAIN',points:drainagePoints})])});
  const entranceFade=(z)=>1-smooth((z-SITE.portalZ)/11);
  const caveCenterX=(z)=>{
    const d=Math.max(0,z-SITE.portalZ);
    return SITE.x+1.8*Math.sin(d*.31)*smooth(d/1.5);
  };
  const roofAt=(x,z)=>{
    const s=(x-caveCenterX(z))/SITE.width,t=(z-SITE.portalZ)/SITE.galleryLength,e=entranceFade(z);
    const weathering=e*(.30*Math.sin(1.13*x+.83*z)+.20*Math.sin(.67*x-1.17*z+1.7)+.10*Math.sin(2.31*x+.47*z));
    const shoulder=e*(s<0?.62:-.28)*Math.exp(-Math.pow((Math.abs(s)-.64)/.4,2));
    const inner=.22*Math.sin(.62*x+.37*z)*Math.sin(Math.PI*clamp(t,0,1));
    return baseFormation.roofAt(x,z)+weathering+shoulder+inner;
  };
  const floorAt=(x,z)=>{
    const s=(x-caveCenterX(z))/SITE.width,t=(z-SITE.portalZ)/SITE.galleryLength;
    const mouth=entranceFade(z);
    return baseFormation.floorAt(x,z)+mouth*(.035*Math.sin(1.1*x-.8*z)+.025*Math.sin(.57*x+1.3*z))+
      .035*Math.sin(.8*x+.5*z)*Math.sin(Math.PI*clamp(t,0,1))*(1-Math.abs(s)*.35);
  };
  const caveRadius=(z)=>baseFormation.caveRadius(z)*(1+.14*Math.sin((z-SITE.portalZ)*.24+.45)+.07*Math.sin((z-SITE.portalZ)*.67+.9));
  const insideVoid=(x,y,z)=>{
    if(z<SITE.portalZ||z>SITE.portalZ+SITE.galleryLength)return false;
    const radius=caveRadius(z),ratio=Math.abs(x-caveCenterX(z))/radius;
    if(ratio>=1)return false;
    const floor=floorAt(x,z),roof=roofAt(x,z);
    return y>=floor&&y<floor+(roof-floor)*Math.pow(Math.max(0,1-ratio*ratio),.375);
  };
  const coverSamples=[];
  for(let z=SITE.portalZ;z<=SITE.portalZ+SITE.galleryLength;z+=2){
    const terrainY=terrainAt(SITE.x,z),ceilingY=roofAt(SITE.x,z),rockCover=terrainY-ceilingY;
    if(!(rockCover>0))fail('WEATHERED_ROOF_BREACH');
    coverSamples.push(Object.freeze({z,terrainY,ceilingY,rockCover}));
  }
  const formation=Object.freeze({...baseFormation,oasis:Object.freeze({...oasis,waterLevel:oasisWaterLevel}),
    oasisInfluenceAt,drainage,waterPresent:true,roofAt,floorAt,caveRadius,caveCenterX,insideVoid,excavatedOutdoorTerrain,
    coverSamples:Object.freeze(coverSamples),minimumRoofCover:Math.min(...coverSamples.map(v=>v.rockCover)),
    excavatedOutdoorTerrain,rockSolidAt:(x,y,z)=>y<=excavatedOutdoorTerrain(x,z)&&!insideVoid(x,y,z)});
  const rawPortal=constructGeologicalPortalAssembly(formation,terrainAt,{bounds:BOUNDS});
  const cliff=buildReliefCliffFace(formation,terrainAt,rawPortal.aperture);
  const portal=Object.freeze({...rawPortal,exposedCliffFace:cliff.mesh,diagnostics:Object.freeze({
    ...rawPortal.diagnostics,...cliff.diagnostics,openCaveApertureCells:true})});
  const retirement=deriveBaseTriangleRetirement(canonical,BOUNDS);
  const parts=[
    ['ERODED_TERRAIN',portal.terrainWithoutAperture],
    ['MOUNTAIN_OVERBURDEN',portal.upperMantle],
    ['NATURAL_CLIFF_FACE',portal.exposedCliffFace],
    ['CAVERN_PHYSICAL_SHELL',portal.cave],
    ...formation.drainage.waterRoutes.map(route=>['FRESHWATER_RIVER',buildWaterRibbon(route,route.kind)]),
    ['OASIS_WATER',buildOasisWater(formation,terrainAt)]
  ];
  const meshes=parts.map(([role,mesh])=>Object.freeze({role,mesh:projectGeologicalMeshForRenderer(mesh)}));
  const output=Object.freeze({contractId:GEOLOGICAL_RUNTIME_BRIDGE_ID,site:SITE,localBounds:BOUNDS,
    formation,portal,retirement,meshes,route:trace,originalTerrainColorAt,
    originalTerrainElevationAt:terrainAt,
    sourceWorldUnchanged:true,originalBaseTrianglesToRetire:retirement.triangleCount,
    hydrology:Object.freeze({waterPresent:true,waterSourceProven:false,sourceType:formation.drainage.sourceType,
      mainRouteResult:trace.result,mainRouteSteps:trace.path.length,tributaryCount:0,
      downhillTerrainSurvey:'ACTUAL_G_WORLD_CANONICAL_INDEXED_TRIANGLES_INVERSE_SPHERE_D8',
      oasisWaterLevel:formation.oasis.waterLevel,connectedOutletProven:false}),
    refinedGeometryClipRequired:true,sourcePass:'CANONICAL_PACKAGE_RUNTIME_DERIVATION'});
  return output;
}
/** Explicit installation only after renderer buffers and geological meshes succeed. */
export function installGeologicalRuntimeBridge(value){
  if(value?.contractId!==GEOLOGICAL_RUNTIME_BRIDGE_ID||!value.formation||!value.portal)fail('INSTALL_NOT_QUALIFIED');
  active=value;return Object.freeze({installed:true,siteId:value.site.id,originalBaseTrianglesToRetire:value.retirement.triangleCount});
}
export function getGeologicalRuntimeBridge(){return active}
/** null => preserve existing Gen324 behavior without touching canonical navigation. */
export function resolveGeologicalRuntimeFootSupport(x,z,{eyeHeight=2.25}={}){
  if(!active)return null;
  const {site,formation}=active;
  if(x<site.x-site.width-7||x>site.x+site.width+7||z<site.portalZ-42||z>site.portalZ+site.galleryLength)return null;
  return sampleFormationWalkable(formation,{x,z,eyeHeight});
}
/** Strict counterpart to the Run8E source index degeneracy technique. */
export function retireGeologicalBaseIndices(source,retirement){
  if(!(source instanceof Uint32Array)||!(retirement?.triangleOffsets instanceof Uint32Array))fail('INDEX_TYPE');
  const result=new Uint32Array(source);
  for(const offset of retirement.triangleOffsets){if(offset<0||offset+2>=source.length||offset%3!==0)fail('RETIREMENT_OFFSET');
    result[offset+1]=result[offset];result[offset+2]=result[offset];}
  return result;
}

/** Derived visual exposure, referenced to ORIGINAL indexed mountain elevation.
 * Comparing a displaced vertex to the already-excavated surface gives zero
 * incision and incorrectly leaves the riverbed painted as undisturbed terrain.
 * This bounded blend is zero at the patch boundary; all accepted base colors
 * remain authoritative outside the carved landform.
 */
export function sampleGeologicalMaterialExposure(model,role,x,z){
  if(model?.contractId!==GEOLOGICAL_RUNTIME_BRIDGE_ID||
      !Number.isFinite(x)||!Number.isFinite(z))fail('MATERIAL_SAMPLE_INVALID');
  const b=model.localBounds;
  const edge=Math.min(x-b.xMin,b.xMax-x,z-b.zMin,b.zMax-z);
  const f=Math.max(0,Math.min(1,edge/12)),fade=f*f*(3-2*f);
  const before=model.originalTerrainElevationAt(x,z);
  const after=model.formation.excavatedOutdoorTerrain(x,z);
  if(!Number.isFinite(before)||!Number.isFinite(after))fail('MATERIAL_TERRAIN_NONFINITE');
  const incisionDepth=Math.max(0,before-after);
  const oasisCore=role==='ERODED_TERRAIN'?(model.formation.oasisInfluenceAt?.(x,z)??0):0;
  const materialWeight=(role==='ERODED_TERRAIN'?Math.max(Math.min(.8,incisionDepth*.5),oasisCore*.72):
    role==='MOUNTAIN_OVERBURDEN'?.06:1)*fade;
  const oasisInfluence=oasisCore*fade;
  return Object.freeze({sourceOriginalHeight:before,excavatedHeight:after,
    incisionDepth,edgeFade:fade,rockWeight:materialWeight,oasisInfluence,
    originalWorldMutated:false});
}
