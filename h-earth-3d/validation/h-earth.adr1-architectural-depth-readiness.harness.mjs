#!/usr/bin/env node
import {
  H_EARTH_FUNCTIONAL_LANDSCAPE_NEUTRAL_PREVIEW,
  H_EARTH_BLENDED_OCEAN_PRESENTATION_CONTRACT_ID
} from '../../showroom/globe/h-earth/render/landscape-preview.js';
import {
  H_EARTH_ADR1_ARCHITECTURAL_DEPTH_READINESS_CONTRACT_ID,
  H_EARTH_ADR1_PROXY_GEOMETRY_BUDGET,
  H_EARTH_ADR1_PROXY_EXCLUSION_VOLUMES
} from '../../showroom/globe/h-earth/render/geometry-adr1-estate-proxy.js';
import {
  H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE,
  H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS,
  createHEarthFunctionalLandscapeNavigationState,
  proposeHEarthFunctionalLandscapeNavigation,
  evaluateHEarthFunctionalLandscapeNavigationState,
  evaluateHEarthADR1ArchitecturalProximity
} from '../../showroom/globe/h-earth/functional-landscape/navigation.js';
import { buildHEarthRun8ENeutralPackage } from '../../showroom/globe/h-earth/render/run8e-successor-environment.js';

const tests=[];
const check=(id,condition,detail=null)=>tests.push({id,pass:Boolean(condition),detail});
const preview=H_EARTH_FUNCTIONAL_LANDSCAPE_NEUTRAL_PREVIEW;
const proxy=preview?.adr1EstateProxy;

check('ADR1_PREVIEW_COMPLETE',preview?.ok===true,preview?.issues);
check('ADR1_CONTRACT_BOUND',preview?.adr1ArchitecturalDepthReadinessContractId===H_EARTH_ADR1_ARCHITECTURAL_DEPTH_READINESS_CONTRACT_ID);
check('ADR1_PROXY_MATERIALIZED',proxy?.ok===true&&preview?.architecturalDepthReadinessProxyMaterialized===true,proxy?.issues);
check('ADR1_PROXY_NOT_MIRROR_MANOR',preview?.mirrorManorIdentityCreated===false&&proxy?.mirrorManorIdentityCreated===false);
check('ADR1_PLAYER_PERSPECTIVE_PRIMARY',preview?.playerPerspectivePrimary===true&&H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE.playerPerspectivePrimary===true);
check('ADR1_NO_REPRESENTATION_SWITCH',preview?.fidelityDomainTransitionIntroduced===false&&proxy?.representationSwitchBoundary===false);
check('ADR1_GEOGRAPHY_AUTHORITY_NOT_EXPANDED',proxy?.geographyAuthorityCreated===false&&proxy?.topologyAuthorityCreated===false&&proxy?.navigationAuthorityCreated===false&&preview?.accessibleRegionExpansion===false);
check('ADR1_PROXY_PRIMITIVE_BUDGET',proxy?.primitiveCount>0&&proxy?.primitiveCount<=H_EARTH_ADR1_PROXY_GEOMETRY_BUDGET.maximumPrimitiveCount,{primitiveCount:proxy?.primitiveCount,maximum:H_EARTH_ADR1_PROXY_GEOMETRY_BUDGET.maximumPrimitiveCount});
check('ADR1_PROXY_VERTEX_BUDGET',proxy?.vertexCount>0&&proxy?.vertexCount<=H_EARTH_ADR1_PROXY_GEOMETRY_BUDGET.maximumVertexCount,{vertexCount:proxy?.vertexCount,maximum:H_EARTH_ADR1_PROXY_GEOMETRY_BUDGET.maximumVertexCount});
check('ADR1_NO_ANIMATED_PROXY_COST',proxy?.animatedPrimitiveCount===0);
check('ADR1_LOCAL_MATERIAL_RESPONSE_CLASSES',Array.isArray(proxy?.materialResponseClasses)&&proxy.materialResponseClasses.length>=5,proxy?.materialResponseClasses);
check('ADR1_ALL_PROXY_PRIMITIVES_GROUNDED',(proxy?.primitives??[]).length>0&&(proxy?.primitives??[]).every(p=>p.metadata?.groundedFromPresentedTerrain===true&&Number.isFinite(p.metadata?.groundSample?.elevation)));
check('ADR1_ALL_PROXY_PRIMITIVES_LOCAL',(proxy?.primitives??[]).every(p=>p.metadata?.fidelityDomain==='LOCAL'&&p.metadata?.representationSwitchBoundary===false));
check('ADR1_ALL_PROXY_PRIMITIVES_NONAUTHORITATIVE',(proxy?.primitives??[]).every(p=>p.metadata?.geographyAuthorityCreated===false&&p.metadata?.topologyAuthorityCreated===false&&p.metadata?.navigationAuthorityCreated===false&&p.metadata?.collisionAuthority===false&&p.metadata?.accessibleRegionExpansion===false));
check('ADR1_DIRECT_RENDER_MATERIALS_PRESERVED',(proxy?.primitives??[]).every(p=>Array.isArray(p.renderMaterial?.rgba)&&p.renderMaterial.rgba.length===4));

check('GEN329_WORLD_MANIFOLD_STILL_CONTINUOUS',preview?.continuousWorldManifold===true&&preview?.singleSphericalPresentationManifold===true);
check('GEN329_ONE_OCEAN_PRESENTATION_PRESERVED',preview?.oneOceanPresentationPrimitive===true&&preview?.blendedOceanPresentationContractId===H_EARTH_BLENDED_OCEAN_PRESENTATION_CONTRACT_ID);
check('GEN329_OCEAN_FACING_EMPTINESS_PRESERVED',preview?.oceanFacingEmptinessPreserved===true&&preview?.oppositeShoreFabricationProhibited===true);
check('GEN329_CANONICAL_WORLD_FIELD_PROTECTED',preview?.canonicalWorldFieldProtected===true&&preview?.independentComponentGeographyAuthority===false);

const naturalUnionIds=new Set([
  ...(preview?.worldManifoldUnion?.nearPrimitiveIds??[]),
  ...(preview?.worldManifoldUnion?.midPrimitiveIds??[]),
  ...(preview?.worldManifoldUnion?.farPrimitiveIds??[]),
  ...(preview?.worldManifoldUnion?.primitiveIds??[])
]);
const proxyIds=(proxy?.primitives??[]).map(p=>p.primitiveId);
check('ADR1_PROXY_APPENDED_OUTSIDE_GEOGRAPHY_ADMISSION',proxyIds.every(id=>!naturalUnionIds.has(id)),{naturalUnionIdCount:naturalUnionIds.size,proxyIds});

const route=['COAST','APPROACH','ESTATE_EDGE','BUILDING','FOUNDATION','COURTYARD','OUTWARD_VISTA'];
const routeStates=[];
for(const waypointId of route){
  const hasWaypoint=Boolean(H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS[waypointId]);
  check(`ADR1_ROUTE_${waypointId}_DECLARED`,hasWaypoint);
  const initial=hasWaypoint?createHEarthFunctionalLandscapeNavigationState({waypointId}):null;
  check(`ADR1_ROUTE_${waypointId}_OCCUPIABLE`,initial?.ok===true,initial?.issues);
  if(initial?.ok===true){
    const evaluation=evaluateHEarthFunctionalLandscapeNavigationState(initial.state);
    check(`ADR1_ROUTE_${waypointId}_NAVIGATION_VALID`,evaluation.eligible===true,evaluation.issues);
    check(`ADR1_ROUTE_${waypointId}_PLAYER_SCALE_FOV`,initial.state.verticalFovDegrees===56,{fov:initial.state.verticalFovDegrees});
    check(`ADR1_ROUTE_${waypointId}_ARCHITECTURAL_STANDOFF_ACTIVE`,initial.state.architecturalStandOffProtected===true);
    routeStates.push(initial.state);
  }
}
check('ADR1_DIAGNOSTIC_ROUTE_COMPLETE',routeStates.length===route.length,{expected:route.length,actual:routeStates.length});

const blocked=H_EARTH_ADR1_PROXY_EXCLUSION_VOLUMES[0];
const blockedX=(blocked.xMin+blocked.xMax)/2,blockedZ=(blocked.zMin+blocked.zMax)/2;
const blockedEvaluation=evaluateHEarthADR1ArchitecturalProximity(blockedX,blockedZ);
check('ADR1_BUILDING_PENETRATION_REJECTED',blockedEvaluation.eligible===false&&blockedEvaluation.issues.includes('ADR1_ARCHITECTURAL_PROXIMITY_PROTECTED'),blockedEvaluation);
const coast=createHEarthFunctionalLandscapeNavigationState({waypointId:'COAST'});
const penetration=coast?.ok?proposeHEarthFunctionalLandscapeNavigation(coast.state,{action:'SET_CAMERA_POSITION',position:{x:blockedX,z:blockedZ}}):null;
check('ADR1_REJECTED_MOVE_PRESERVES_LAST_LAWFUL_STATE',penetration?.ok===false&&penetration?.state?.stateId===coast?.state?.stateId,penetration?.issues);
check('ADR1_NO_COLLISION_PHYSICS_AUTHORITY',H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE.authority?.ownsCollisionOrPhysics===false&&blockedEvaluation.collisionOrPhysicsAuthorityCreated===false);
check('ADR1_EXISTING_PLAYER_CLEARANCE_UNCHANGED',H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE.eyeHeight===2.25&&H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE.hardTerrainSupportOffset===2.25&&H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE.minimumTerrainClearance===1.6&&H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_PROFILE.lookDistanceWorldUnits===18);

const run8e=buildHEarthRun8ENeutralPackage({cameraWorld:{x:-42,y:12,z:-207}});
const run8eProxyIds=(run8e?.primitives??[]).filter(p=>p.metadata?.adr1ArchitecturalDepthReadiness===true).map(p=>p.primitiveId);
check('ADR1_PROXY_SURVIVES_RUN8E_PACKAGE',run8e?.ok===true&&run8eProxyIds.length===proxyIds.length,{run8eIssues:run8e?.issues,expected:proxyIds.length,actual:run8eProxyIds.length});
check('ADR1_RUN8E_MATERIAL_RESPONSES_SURVIVE',(run8e?.primitives??[]).filter(p=>p.metadata?.adr1ArchitecturalDepthReadiness===true).every(p=>Array.isArray(p.renderMaterial?.rgba)&&p.renderMaterial.rgba.length===4));

const failures=tests.filter(t=>!t.pass);
const receipt={
  schema:'H_EARTH_ADR1_ARCHITECTURAL_DEPTH_READINESS_QUALIFICATION_v1',
  result:failures.length?'FAIL_CLOSED':'PASS_CLOSED',
  contractId:H_EARTH_ADR1_ARCHITECTURAL_DEPTH_READINESS_CONTRACT_ID,
  testCount:tests.length,
  passCount:tests.length-failures.length,
  failCount:failures.length,
  protectedBaseline:'23923 / Gen329 single spherical world manifold',
  machineClaims:{
    architecturalProxyMaterialized:proxy?.ok===true,
    noMirrorManorIdentity:preview?.mirrorManorIdentityCreated===false,
    playerPerspectivePrimary:preview?.playerPerspectivePrimary===true,
    oneOceanPresentationPreserved:preview?.oneOceanPresentationPrimitive===true,
    localGeometryWithinBudget:(proxy?.primitiveCount??Infinity)<=H_EARTH_ADR1_PROXY_GEOMETRY_BUDGET.maximumPrimitiveCount&&(proxy?.vertexCount??Infinity)<=H_EARTH_ADR1_PROXY_GEOMETRY_BUDGET.maximumVertexCount,
    architecturalProximityProtection:blockedEvaluation.eligible===false,
    interactionPerformanceOwnerInspectionRequired:true,
    visualGroundingOwnerInspectionRequired:true,
    ownerAcceptanceCreated:false,
    mergeAuthorityCreated:false,
    deploymentAuthorityCreated:false
  },
  tests
};
process.stdout.write(JSON.stringify(receipt,null,2)+'\n');
if(failures.length) process.exitCode=1;
