/** H_EARTH_SINGLE_SPHERICAL_WORLD_MANIFOLD_v1 */
const freeze=(v,s=new WeakSet())=>{if(v===null||typeof v!=='object'||Object.isFrozen(v)||s.has(v))return v;s.add(v);Object.values(v).forEach(x=>freeze(x,s));return Object.freeze(v)};
const normalize=v=>{const n=Math.hypot(v.x,v.y,v.z);return n>Number.EPSILON?freeze({x:v.x/n,y:v.y/n,z:v.z/n}):freeze({x:0,y:1,z:0})};

export const H_EARTH_PLANETARY_WORLD_FRAME_CONTRACT_ID='H_EARTH_SINGLE_SPHERICAL_WORLD_MANIFOLD_v1';
export const H_EARTH_PLANETARY_WORLD_FRAME=freeze({
  contractId:H_EARTH_PLANETARY_WORLD_FRAME_CONTRACT_ID,
  frameClass:'ONE_CONTINUOUS_SPHERICAL_PRESENTATION_MANIFOLD',
  tangentOrigin:freeze({x:0,y:0,z:0}),sphereCenter:freeze({x:0,y:-420000,z:0}),
  protectedTangentRadius:0,transitionWidth:0,transitionOuterRadius:0,exactSphereRadius:420000,nominalObserverHeight:12,
  continuationAnchorClass:'FIXED_PLANETARY_TANGENT_ORIGIN',
  navigationAuthoringDomain:'LOCAL_REGION_XZ_WITH_TERRAIN_SUPPORTED_Y',
  presentationDomain:'SINGLE_SPHERICAL_WORLD_XYZ',
  navigationAuthorityExpansion:false,collisionAuthorityExpansion:false,accessibleRegionExpansion:false,
  viewportFixedCurvature:false,yOnlySagProxyProhibited:true,fixedHorizonRadiusProhibited:true,
  localTerrainWarpProhibited:false,layeredPlanarContinuationProhibited:true,visiblePlanetBodySubstituteProhibited:true
});
export const H_EARTH_PLANETARY_CONTINUATION_ANCHOR=H_EARTH_PLANETARY_WORLD_FRAME.tangentOrigin;
export function getHEarthPlanetaryRadialDistance(x,z){return Math.hypot(x-H_EARTH_PLANETARY_WORLD_FRAME.tangentOrigin.x,z-H_EARTH_PLANETARY_WORLD_FRAME.tangentOrigin.z)}
export function getHEarthPlanetaryCurvatureBlend(){return 1}
function exactSpherePoint({x,y=0,z}){const R=H_EARTH_PLANETARY_WORLD_FRAME.exactSphereRadius,r=Math.hypot(x,z);if(r<=Number.EPSILON)return freeze({x:0,y,z:0,radialDistance:0,angularDistance:0});const a=r/R,hr=(R+y)*Math.sin(a),k=hr/r;return freeze({x:x*k,y:(R+y)*Math.cos(a)-R,z:z*k,radialDistance:r,angularDistance:a})}
export function regionToHEarthPlanetPoint({x,y=0,z}){const q=exactSpherePoint({x,y,z});return freeze({...q,curvatureBlend:1,spatialClass:'SINGLE_SPHERICAL_WORLD_MANIFOLD',contractId:H_EARTH_PLANETARY_WORLD_FRAME_CONTRACT_ID})}
export const projectHEarthVisibleContinuationPoint=regionToHEarthPlanetPoint;
export const projectHEarthPresentationPoint=regionToHEarthPlanetPoint;
export function getHEarthPlanetSurfaceNormal({x,y=0,z}){const q=exactSpherePoint({x,y,z}),c=H_EARTH_PLANETARY_WORLD_FRAME.sphereCenter;return normalize({x:q.x-c.x,y:q.y-c.y,z:q.z-c.z})}
export const getHEarthPlanetRelativeUp=getHEarthPlanetSurfaceNormal;
export function getHEarthRegionTangentBasis(p={x:0,y:0,z:0}){const up=getHEarthPlanetRelativeUp(p),ref=Math.abs(up.z)<.96?{x:0,y:0,z:1}:{x:1,y:0,z:0},east=normalize({x:ref.y*up.z-ref.z*up.y,y:ref.z*up.x-ref.x*up.z,z:ref.x*up.y-ref.y*up.x}),north=normalize({x:up.y*east.z-up.z*east.y,y:up.z*east.x-up.x*east.z,z:up.x*east.y-up.y*east.x});return freeze({east,up,north,contractId:H_EARTH_PLANETARY_WORLD_FRAME_CONTRACT_ID})}
export function getHEarthDerivedHorizonDistance(observerHeight=H_EARTH_PLANETARY_WORLD_FRAME.nominalObserverHeight){const R=H_EARTH_PLANETARY_WORLD_FRAME.exactSphereRadius,h=Math.max(0,Number(observerHeight)||0);return Math.sqrt(Math.max(0,(R+h)*(R+h)-R*R))}
export function describeHEarthPlanetaryWorldFrame(){return freeze({...H_EARTH_PLANETARY_WORLD_FRAME,derivedNominalHorizonDistance:getHEarthDerivedHorizonDistance(),transformLaw:'EVERY_RENDERED_REGION_VERTEX_AND_CAMERA_POINT_TO_ONE_SPHERICAL_XYZ_FRAME',rejectedLaws:['LOCAL_PLANAR_PATCH_PLUS_FAR_SPHERE','X_Z_UNCHANGED_PLUS_Y_SAG','SCREEN_SPACE_CURVED_HORIZON','SEPARATE_VISIBLE_PLANET_BODY_SHELL']})}
