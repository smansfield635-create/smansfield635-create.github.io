/** H_EARTH_PLANETARY_SPATIAL_COHERENCE_GEN326_v1 */
const freeze=(v,s=new WeakSet())=>{if(v===null||typeof v!=='object'||Object.isFrozen(v)||s.has(v))return v;s.add(v);Object.values(v).forEach(x=>freeze(x,s));return Object.freeze(v)};
const clamp01=v=>Math.min(1,Math.max(0,v));
const smooth=t=>{const x=clamp01(t);return x*x*(3-2*x)};
const lerp=(a,b,t)=>a+(b-a)*t;
const normalize=v=>{const n=Math.hypot(v.x,v.y,v.z);return n>Number.EPSILON?freeze({x:v.x/n,y:v.y/n,z:v.z/n}):freeze({x:0,y:1,z:0})};

export const H_EARTH_PLANETARY_WORLD_FRAME_CONTRACT_ID='H_EARTH_PLANETARY_SPATIAL_COHERENCE_GEN326_v1';
export const H_EARTH_PLANETARY_WORLD_FRAME=freeze({
  contractId:H_EARTH_PLANETARY_WORLD_FRAME_CONTRACT_ID,
  frameClass:'LOCAL_CARTESIAN_TANGENT_PATCH_TO_TRUE_SPHERICAL_CONTINUATION',
  tangentOrigin:freeze({x:0,y:0,z:0}),sphereCenter:freeze({x:0,y:-420000,z:0}),
  protectedTangentRadius:1100,transitionWidth:600,exactSphereRadius:420000,nominalObserverHeight:12,
  continuationAnchorClass:'FIXED_PLANETARY_TANGENT_ORIGIN',
  navigationAuthorityExpansion:false,collisionAuthorityExpansion:false,accessibleRegionExpansion:false,
  viewportFixedCurvature:false,yOnlySagProxyProhibited:true,fixedHorizonRadiusProhibited:true,localTerrainWarpProhibited:true
});
export const H_EARTH_PLANETARY_CONTINUATION_ANCHOR=H_EARTH_PLANETARY_WORLD_FRAME.tangentOrigin;
export function getHEarthPlanetaryRadialDistance(x,z){return Math.hypot(x-H_EARTH_PLANETARY_WORLD_FRAME.tangentOrigin.x,z-H_EARTH_PLANETARY_WORLD_FRAME.tangentOrigin.z)}
export function getHEarthPlanetaryCurvatureBlend(x,z){const r=getHEarthPlanetaryRadialDistance(x,z),p=H_EARTH_PLANETARY_WORLD_FRAME;return smooth((r-p.protectedTangentRadius)/p.transitionWidth)}
function exactSpherePoint({x,y=0,z}){const R=H_EARTH_PLANETARY_WORLD_FRAME.exactSphereRadius,r=Math.hypot(x,z);if(r<=Number.EPSILON)return freeze({x:0,y,z:0,radialDistance:0,angularDistance:0});const a=r/R,hr=(R+y)*Math.sin(a),k=hr/r;return freeze({x:x*k,y:(R+y)*Math.cos(a)-R,z:z*k,radialDistance:r,angularDistance:a})}
export function regionToHEarthPlanetPoint({x,y=0,z}){const radialDistance=getHEarthPlanetaryRadialDistance(x,z),b=getHEarthPlanetaryCurvatureBlend(x,z);if(b<=0)return freeze({x,y,z,radialDistance,curvatureBlend:0,spatialClass:'LOCAL_TANGENT_PATCH',contractId:H_EARTH_PLANETARY_WORLD_FRAME_CONTRACT_ID});const q=exactSpherePoint({x,y,z});return freeze({x:lerp(x,q.x,b),y:lerp(y,q.y,b),z:lerp(z,q.z,b),radialDistance,angularDistance:q.angularDistance,curvatureBlend:b,spatialClass:b>=1?'EXACT_SPHERICAL_CONTINUATION':'TANGENT_TO_SPHERE_TRANSITION_ANNULUS',contractId:H_EARTH_PLANETARY_WORLD_FRAME_CONTRACT_ID})}
export const projectHEarthVisibleContinuationPoint=regionToHEarthPlanetPoint;
export function getHEarthPlanetSurfaceNormal({x,y=0,z}){const b=getHEarthPlanetaryCurvatureBlend(x,z);if(b<=0)return freeze({x:0,y:1,z:0});const q=exactSpherePoint({x,y,z}),c=H_EARTH_PLANETARY_WORLD_FRAME.sphereCenter,n=normalize({x:q.x-c.x,y:q.y-c.y,z:q.z-c.z});return b>=1?n:normalize({x:lerp(0,n.x,b),y:lerp(1,n.y,b),z:lerp(0,n.z,b)})}
export const getHEarthPlanetRelativeUp=getHEarthPlanetSurfaceNormal;
export function getHEarthRegionTangentBasis(p={x:0,y:0,z:0}){const up=getHEarthPlanetRelativeUp(p),ref=Math.abs(up.z)<.96?{x:0,y:0,z:1}:{x:1,y:0,z:0},east=normalize({x:ref.y*up.z-ref.z*up.y,y:ref.z*up.x-ref.x*up.z,z:ref.x*up.y-ref.y*up.x}),north=normalize({x:up.y*east.z-up.z*east.y,y:up.z*east.x-up.x*east.z,z:up.x*east.y-up.y*east.x});return freeze({east,up,north,contractId:H_EARTH_PLANETARY_WORLD_FRAME_CONTRACT_ID})}
export function getHEarthDerivedHorizonDistance(observerHeight=H_EARTH_PLANETARY_WORLD_FRAME.nominalObserverHeight){const R=H_EARTH_PLANETARY_WORLD_FRAME.exactSphereRadius,h=Math.max(0,Number(observerHeight)||0);return Math.sqrt(Math.max(0,(R+h)*(R+h)-R*R))}
export function describeHEarthPlanetaryWorldFrame(){return freeze({...H_EARTH_PLANETARY_WORLD_FRAME,derivedNominalHorizonDistance:getHEarthDerivedHorizonDistance(),transformLaw:'REGION_XZ_TO_SPHERICAL_ANGULAR_DISPLACEMENT_ALL_XYZ_TRANSFORM',rejectedLaws:['X_Z_UNCHANGED_PLUS_Y_SAG','SCREEN_SPACE_CURVED_HORIZON']})}
