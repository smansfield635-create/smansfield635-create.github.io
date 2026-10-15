/** H_EARTH_GEOLOGICAL_PORTAL_INTERFACE_v1
 * Candidate-only physical aperture, mountain overburden, cliff-facies and walk support.
 * One formation supplies identical XYZ to terrain, 3D cave shell, and foot/head clearance.
 * No renderer activation, navigation interception, application import, or release claim.
 */
import {constructSurfaceReplacementPatch,constructCavernBoundary,projectRegionVertex} from './h-earth.geological-formation-successor.v1.mjs';
export const H_EARTH_GEOLOGICAL_PORTAL_INTERFACE_ID='H_EARTH_GEOLOGICAL_PORTAL_INTERFACE_v1';
const finite=Number.isFinite;
const assert=(test,msg)=>{if(!test)throw Error('PORTAL_INTERFACE_INVALID:'+msg)};
const clamp=(n,lo,hi)=>Math.min(hi,Math.max(lo,n));
const near=(a,b,eps=1e-4)=>Math.abs(a-b)<=eps;
/** Conforms to actual base geometric edges; permits local relief and exact hole. */
export function constructGeologicalPortalAssembly(formation,terrainAt,{bounds=null,spacing=2,apertureDepth=8,shoulderMeters=3.5}={}) {
  assert(formation?.contractId==='H_EARTH_GEOLOGICAL_FORMATION_SUCCESSOR_v1'&&typeof terrainAt==='function','FORMATION_OR_SOURCE');
  const site=formation.site;bounds=bounds??{xMin:site.x-40,xMax:site.x+96,zMin:-368,zMax:-224};assert(spacing===2&&Number.isInteger(apertureDepth/spacing),'FIXED_LOCAL_MESH_QUANTUM');
  const halfWidth=Math.ceil((site.width+shoulderMeters)/spacing)*spacing;
  assert(halfWidth>site.width&&Number.isSafeInteger(halfWidth/spacing),'INVALID_SHOULDER');
  const aperture={xMin:site.x-halfWidth,xMax:site.x+halfWidth,zMin:site.portalZ,zMax:site.portalZ+apertureDepth};
  for(const [a,b] of [[aperture.xMin,bounds.xMin],[bounds.xMax,aperture.xMax],[aperture.zMin,bounds.zMin],[bounds.zMax,aperture.zMax]])assert(a>b,'APERTURE_TOUCHES_PATCH_PERIMETER');
  const surface=constructSurfaceReplacementPatch(formation,{bounds,spacing});
  const cols=surface.grid.cols,rows=surface.grid.rows;
  const within=(x,z)=>x>=aperture.xMin&&x<=aperture.xMax&&z>=aperture.zMin&&z<=aperture.zMax;
  // Remove exact grid cells of locally authored *replacement* terrain, not an
  // arbitrary fragment shader discard. The old global base has its own explicit
  // triangle retirement contract, still awaiting renderer integration.
  const kept=[],retired=[];
  for(let j=0;j<rows-1;j++)for(let i=0;i<cols-1;i++){
    const x=bounds.xMin+i*spacing+spacing/2,z=bounds.zMin+j*spacing+spacing/2;
    const a=j*cols+i,b=a+1,c=a+cols,d=c+1;
    const into=within(x,z),target=into?retired:kept;target.push(a,c,b,b,c,d);
  }
  assert(kept.length+retired.length===surface.indices.length,'REPLACEMENT_TRIANGLE_ACCOUNTING');
  assert(retired.length>0,'NO_APERTURE_CELLS');
  const left=aperture.xMin,right=aperture.xMax,start=aperture.zMin,end=aperture.zMax;
  const xValues=[],zValues=[];
  for(let x=left;x<=right;x+=spacing)xValues.push(x);
  for(let z=start;z<=end;z+=spacing)zValues.push(z);
  const topPos=[],topIndex=[];
  for(const z of zValues)for(const x of xValues){const y=terrainAt(x,z);assert(finite(y),'INVALID_OVERBURDEN_SAMPLE');topPos.push(x,y,z)}
  const width=xValues.length;
  for(let j=0;j<zValues.length-1;j++)for(let i=0;i<width-1;i++){
    let a=j*width+i,b=a+1,c=a+width,d=c+1;topIndex.push(a,c,b,b,c,d);
  }
  // Vertical exposed rock belongs to the mountain skin, not an independently
  // positioned arch prop: its upper vertices are the actual terrain contact
  // along the portal plane, while the lower lip follows physical cave-void
  // clearance or the excavated external banks.
  const facePos=[],faceIdx=[];
  const facadeStep=spacing/2;
  const count=Math.round((right-left)/facadeStep);
  let lowestRockFaceClearance=Infinity,facadeAddedTopHeight=0;
  for(let i=0;i<=count;i++){
    const x=left+(right-left)*i/count;
    const top=terrainAt(x,start);
    const outside=formation.excavatedOutdoorTerrain(x,start);
    const r=formation.caveRadius(start),rNorm=Math.abs(x-site.x)/r;
    const floor=formation.floorAt(x,start),roof=formation.roofAt(x,start);
    const chamberRoof=floor+(roof-floor)*Math.pow(Math.max(0,1-rNorm*rNorm),0.375);
    const opening=Math.abs(x-site.x)<r;
    const bottom=opening?Math.max(outside,chamberRoof):outside;
    assert(finite(top)&&finite(bottom)&&top>=bottom-1e-4,'FRONTAL_ROCK_FACE_BELOW_FLOOR');
    lowestRockFaceClearance=Math.min(lowestRockFaceClearance,top-bottom);facadeAddedTopHeight=Math.max(facadeAddedTopHeight,top-outside);
    facePos.push(x,top,start,x,bottom,start);
    if(i<count){let t=i*2,b=t+1,nt=t+2,nb=t+3;faceIdx.push(t,b,nt,nt,b,nb)}
  }
  const rim={sideMaxError:0,backMaxError:0,frontCliffBottomOpen:false,roofTopIsUncutMountain:true};
  for(const z of zValues)for(const x of [left,right]){
    const base=formation.excavatedOutdoorTerrain(x,z),top=terrainAt(x,z);
    rim.sideMaxError=Math.max(rim.sideMaxError,Math.abs(base-top));
  }
  for(const x of xValues){const base=formation.excavatedOutdoorTerrain(x,end),top=terrainAt(x,end);rim.backMaxError=Math.max(rim.backMaxError,Math.abs(base-top))}
  rim.frontCliffBottomOpen=formation.insideVoid(site.x,site.entranceFloorY+1,start+0.25);
  assert(rim.sideMaxError<1e-3&&rim.backMaxError<1e-3,'UNSTITCHED_UPPER_MANTLE');
  assert(rim.frontCliffBottomOpen,'ENTRANCE_VOID_CLOSED');
  const cave=constructCavernBoundary(formation);
  return Object.freeze({schema:H_EARTH_GEOLOGICAL_PORTAL_INTERFACE_ID,formationId:formation.contractId,siteId:site.id,coordinateFrame:'LOCAL_AUTHORING_XYZ',aperture:Object.freeze(aperture),upperMantle:Object.freeze({positions:new Float32Array(topPos),indices:new Uint32Array(topIndex),vertexCount:topPos.length/3,triangleCount:topIndex.length/3}),exposedCliffFace:Object.freeze({positions:new Float32Array(facePos),indices:new Uint32Array(faceIdx),vertexCount:facePos.length/3,triangleCount:faceIdx.length/3}),terrainWithoutAperture:Object.freeze({...surface,indices:new Uint32Array(kept),triangleCount:kept.length/3}),cave,retiredReplacementTriangleCount:retired.length/3,rimCorrespondence:Object.freeze(rim),diagnostics:Object.freeze({frontMaximumExteriorCut:facadeAddedTopHeight,minimumRockFaceThickness:lowestRockFaceClearance,pairedSideAndBackRim:true,mainWorldPackageMutated:false,rendererActivation:false,physicalNavigationActivation:false,enterableCandidateByDesign:true,visuallyQualified:false})});
}
/** Query physical supported floor, wall occupancy and roof clearance from the SAME
 * geological formation. Outside-site authoritative navigation remains separate.
 */
export function sampleFormationWalkable(formation,{x,z,eyeHeight=2.25,headClearance=0.35,wallClearance=0.35}={}) {
  assert([x,z,eyeHeight,headClearance,wallClearance].every(finite),'WALK_QUERY_NONFINITE');
  assert(eyeHeight>1.4&&eyeHeight<=2.75&&headClearance>=0,'WALK_EYE_BOUNDS');
  const {site}=formation;
  if(z>=site.portalZ&&z<=site.portalZ+site.galleryLength){
    const side=Math.abs(x-site.x),radius=formation.caveRadius(z),floor=formation.floorAt(x,z);
    const nominalCeiling=formation.roofAt(x,z),ratio=side/radius;
    const ceiling=floor+(nominalCeiling-floor)*Math.pow(Math.max(0,1-ratio*ratio),0.375);
    const remaining=ceiling-floor;
    const eligible=side<=radius-wallClearance&&remaining>=eyeHeight+headClearance&&z<=site.portalZ+site.galleryLength-wallClearance&&formation.insideVoid(x,floor+eyeHeight,z);
    return Object.freeze({class:'INTERIOR',eligible,x,z,footY:floor,eyeY:floor+eyeHeight,ceilingY:ceiling,headroom:remaining,wallClearanceMeters:radius-side,issues:eligible?[]:['CAVERN_SOLID_OR_HEADROOM_COLLISION'],worldManifoldUnchanged:true});
  }
  if(z<site.portalZ){const floor=formation.excavatedOutdoorTerrain(x,z);
    return Object.freeze({class:'EXTERIOR_DRY_CHANNEL',eligible:finite(floor),x,z,footY:floor,eyeY:floor+eyeHeight,ceilingY:null,headroom:null,issues:finite(floor)?[]:['OUTSIDE_MEASURED_FORMATION'],worldManifoldUnchanged:true});
  }
  return Object.freeze({class:'OUTSIDE_SITE',eligible:false,x,z,issues:['OUTSIDE_FORMATION_NAV_DOMAIN'],worldManifoldUnchanged:true});
}
export function sweepFormationWalk(formation,start,end,{step=0.25,eyeHeight=2.25,maximumStepRisePerMeter=0.65}={}){
  assert([start?.x,start?.z,end?.x,end?.z,step,eyeHeight].every(finite)&&step>0&&step<=0.5,'SWEEP_INPUT_INVALID');
  const delta=Math.hypot(end.x-start.x,end.z-start.z),n=Math.max(1,Math.ceil(delta/step));let last=null;
  for(let i=0;i<=n;i++){const t=i/n,x=start.x+(end.x-start.x)*t,z=start.z+(end.z-start.z)*t,position=sampleFormationWalkable(formation,{x,z,eyeHeight});if(!position.eligible)return Object.freeze({accepted:false,reason:position.issues[0],samples:i+1,at:Object.freeze({x,z})});
    if(last&&Math.abs(position.footY-last.footY)>maximumStepRisePerMeter*delta/n+0.005)return Object.freeze({accepted:false,reason:'UNWALKABLE_STEP_GRADE',samples:i+1,at:Object.freeze({x,z})});last=position;
  }
  return Object.freeze({accepted:true,reason:null,samples:n+1,lastPosition:last,collisionSystemIntegrated:false});
}
/** Geometry payload projection uses EXACT existing single-world spherical frame. */
export function projectGeologicalMeshForRenderer(mesh){const p=mesh?.positions,idx=mesh?.indices;
  assert(p instanceof Float32Array&&idx instanceof Uint32Array&&p.length%3===0&&idx.length%3===0,'MESH_PAYLOAD_INVALID');
  const positions=new Float32Array(p.length);
  for(let i=0;i<p.length;i+=3){const q=projectRegionVertex(p[i],p[i+1],p[i+2]);positions.set([q.x,q.y,q.z],i)}
  return Object.freeze({positions,indices:new Uint32Array(idx),vertexCount:positions.length/3,triangleCount:idx.length/3,projectedToCanonicalSphere:true,originalLocalMeshUnchanged:true});
}
