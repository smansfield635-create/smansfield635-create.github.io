/** H_EARTH_GEN2735_RUNTIME_GEOLOGICAL_BRIDGE_v1
 * Candidate-only: derived from the immutable Run8E package; one shared formation
 * supplies surface geometry and the active physical navigation support. No new world.
 */
import {GEOLOGICAL_FORMATION_SITES,makeCanonicalAuthoringTerrainSampler,unprojectPlanetVertex,createGeologicalFormation,
        deriveBaseTriangleRetirement} from '../../../../h-earth-3d/terrain/h-earth.geological-formation-successor.v1.mjs';
import {constructGeologicalPortalAssembly,sampleFormationWalkable,projectGeologicalMeshForRenderer}
  from '../../../../h-earth-3d/terrain/h-earth.geological-portal-interface.v1.mjs';
export const GEOLOGICAL_RUNTIME_BRIDGE_ID='H_EARTH_GEN2735_RUNTIME_GEOLOGICAL_BRIDGE_v1';
const SITE=GEOLOGICAL_FORMATION_SITES.A_EASTERN_REAR_ESCARPMENT;
const BOUNDS=Object.freeze({xMin:40,xMax:176,zMin:-368,zMax:-224});
const DIRS=Object.freeze([[-1,-1],[0,-1],[1,-1],[-1,0],[1,0],[-1,1],[0,1],[1,1]]);
let active=null;
function fail(s){throw Error('GEOLOGICAL_RUNTIME_BRIDGE_INVALID:'+s)}
/** Reconstruct strict downhill flow from actual indexed canonical authoring heights.
 * The experiment remains a dry, seasonally plausible riverbed; no claimed water source.
 */
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
  const baseFormation=createGeologicalFormation({terrainAt,site:SITE,surveyRoute:trace});
  // Erosion is deliberately irregular at the mouth and quieter deeper inside.
  // These same surfaces feed the cave mesh, walk support, and solid occupancy.
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const smooth=(v)=>{v=clamp(v,0,1);return v*v*(3-2*v)};
  const entranceFade=(z)=>1-smooth((z-SITE.portalZ)/11);
  const roofAt=(x,z)=>{
    const s=(x-SITE.x)/SITE.width,t=(z-SITE.portalZ)/SITE.galleryLength,e=entranceFade(z);
    const weathering=e*(.24*Math.sin(1.55*x+.73*z)+.13*Math.sin(.91*x-1.21*z+1.7));
    const shoulder=e*(s<0?.22:-.08)*Math.exp(-Math.pow((Math.abs(s)-.72)/.34,2));
    const inner=.075*Math.sin(.62*x+.37*z)*Math.sin(Math.PI*clamp(t,0,1));
    return baseFormation.roofAt(x,z)+weathering+shoulder+inner;
  };
  const floorAt=(x,z)=>{
    const s=(x-SITE.x)/SITE.width,t=(z-SITE.portalZ)/SITE.galleryLength;
    const mouth=entranceFade(z);
    return baseFormation.floorAt(x,z)+mouth*(.035*Math.sin(1.1*x-.8*z)+.025*Math.sin(.57*x+1.3*z))+
      .035*Math.sin(.8*x+.5*z)*Math.sin(Math.PI*clamp(t,0,1))*(1-Math.abs(s)*.35);
  };
  const caveRadius=(z)=>baseFormation.caveRadius(z)*(1+.035*Math.sin((z-SITE.portalZ)*.23+.8));
  const insideVoid=(x,y,z)=>{
    if(z<SITE.portalZ||z>SITE.portalZ+SITE.galleryLength)return false;
    const radius=caveRadius(z),ratio=Math.abs(x-SITE.x)/radius;
    if(ratio>=1)return false;
    const floor=floorAt(x,z),roof=roofAt(x,z);
    return y>=floor&&y<floor+(roof-floor)*Math.pow(Math.max(0,1-ratio*ratio),.375);
  };
  const excavatedOutdoorTerrain=(x,z)=>baseFormation.excavatedOutdoorTerrain(x,z);
  const coverSamples=[];
  for(let z=SITE.portalZ;z<=SITE.portalZ+SITE.galleryLength;z+=2){
    const terrainY=terrainAt(SITE.x,z),ceilingY=roofAt(SITE.x,z),rockCover=terrainY-ceilingY;
    if(!(rockCover>0))fail('WEATHERED_ROOF_BREACH');
    coverSamples.push(Object.freeze({z,terrainY,ceilingY,rockCover}));
  }
  const formation=Object.freeze({...baseFormation,roofAt,floorAt,caveRadius,insideVoid,
    coverSamples:Object.freeze(coverSamples),minimumRoofCover:Math.min(...coverSamples.map(v=>v.rockCover)),
    excavatedOutdoorTerrain,rockSolidAt:(x,y,z)=>y<=excavatedOutdoorTerrain(x,z)&&!insideVoid(x,y,z)});
  const portal=constructGeologicalPortalAssembly(formation,terrainAt,{bounds:BOUNDS});
  const retirement=deriveBaseTriangleRetirement(canonical,BOUNDS);
  const parts=[
    ['ERODED_TERRAIN',portal.terrainWithoutAperture],
    ['MOUNTAIN_OVERBURDEN',portal.upperMantle],
    ['NATURAL_CLIFF_FACE',portal.exposedCliffFace],
    ['CAVERN_PHYSICAL_SHELL',portal.cave]
  ];
  const meshes=parts.map(([role,mesh])=>Object.freeze({role,mesh:projectGeologicalMeshForRenderer(mesh)}));
  const output=Object.freeze({contractId:GEOLOGICAL_RUNTIME_BRIDGE_ID,site:SITE,localBounds:BOUNDS,
    formation,portal,retirement,meshes,route:trace,originalTerrainColorAt,
    originalTerrainElevationAt:terrainAt,
    sourceWorldUnchanged:true,originalBaseTrianglesToRetire:retirement.triangleCount,
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
  const materialWeight=(role==='ERODED_TERRAIN'?Math.min(.8,incisionDepth*.5):
    role==='MOUNTAIN_OVERBURDEN'?.06:1)*fade;
  return Object.freeze({sourceOriginalHeight:before,excavatedHeight:after,
    incisionDepth,edgeFade:fade,rockWeight:materialWeight,
    originalWorldMutated:false});
}
