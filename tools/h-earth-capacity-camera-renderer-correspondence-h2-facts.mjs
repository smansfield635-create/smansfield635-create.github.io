import {
  H_EARTH_CAPACITY_CAMERA_RENDERER_CORRESPONDENCE_H1_CONTRACT as H1,
  evaluateHEarthCapacityCameraEnvelope as evaluateH1
} from './h-earth-capacity-camera-renderer-correspondence-measurement-contract.mjs';
import { freeze, digest, fail, clone, exactFiniteFields } from './h-earth-capacity-camera-renderer-correspondence-h2-common.mjs';

const REQUIRED_EXPORTS = Object.freeze([
  'H_EARTH_3D_CAPACITY_CONTRACT_ID','H_EARTH_3D_CAPACITY_SCHEMA_VERSION',
  'H_EARTH_3D_CAPACITY_BOUNDARY_FLAGS','H_EARTH_3D_CAPACITY_SOURCE_REFERENCES',
  'H_EARTH_3D_VIEWPORT_CAPACITY','H_EARTH_3D_CAMERA_CAPACITY',
  'H_EARTH_3D_LIVING_PRESENTATION_CAPACITY','H_EARTH_3D_RENDER_STAGE_LIMITS','H_EARTH_3D_NODE_BUDGET'
]);

export function extractProductionFacts(module) {
  for (const name of REQUIRED_EXPORTS) if (!(name in (module ?? {}))) fail('H2_REQUIRED_CAPACITY_EXPORT_MISSING', { name });
  const c=module.H_EARTH_3D_CAMERA_CAPACITY,v=module.H_EARTH_3D_VIEWPORT_CAPACITY,n=module.H_EARTH_3D_NODE_BUDGET;
  const s=module.H_EARTH_3D_RENDER_STAGE_LIMITS,l=module.H_EARTH_3D_LIVING_PRESENTATION_CAPACITY,r=module.H_EARTH_3D_CAPACITY_SOURCE_REFERENCES;
  const i=c.initialProjectionCandidate,f=c.futureControllerCapacity,e=c.resolvedCameraPoseEligibility;
  return freeze({
    capacityContractId:module.H_EARTH_3D_CAPACITY_CONTRACT_ID,capacitySchemaVersion:module.H_EARTH_3D_CAPACITY_SCHEMA_VERSION,
    canonicalCapacityPath:l.moduleGraph.canonicalCapacityPath,auxiliaryCapacityModulePermitted:l.moduleGraph.auxiliaryCapacityModulePermitted,
    camera:{model:c.cameraModel,position:i.position,target:i.target,up:i.up,verticalFovDegrees:i.verticalFovDegrees,nearPlane:i.nearPlane,farPlane:i.farPlane,
      cameraStateAuthority:i.cameraStateAuthority,projectionAuthority:i.projectionAuthority,positionBounds:f.positionBounds,targetBounds:f.targetBounds,
      yawDegrees:f.yawDegrees,pitchDegrees:f.pitchDegrees,verticalFovCapacity:f.verticalFovDegrees,
      resolvedPoseEligibility:{orthogonalBasisTolerance:e.orthogonalBasisTolerance,nearPlaneMinimum:e.nearPlaneMinimum,farPlaneMaximum:e.farPlaneMaximum,
        farPlaneMustExceedNearPlane:e.farPlaneMustExceedNearPlane,cameraRevisionRequired:e.cameraRevisionRequired}},
    viewport:{minimumWidthPx:v.minimumWidthPx,minimumHeightPx:v.minimumHeightPx,maximumWidthPx:v.maximumWidthPx,maximumHeightPx:v.maximumHeightPx,
      preferredDesignWidthPx:v.preferredDesignViewport.widthPx,preferredDesignHeightPx:v.preferredDesignViewport.heightPx,
      supportedAspectRatioMinimum:v.supportedAspectRatio.minimum,supportedAspectRatioMaximum:v.supportedAspectRatio.maximum,
      pixelRatioMinimum:v.pixelRatioCapacity.minimum,pixelRatioPreferredMaximum:v.pixelRatioCapacity.preferredMaximum,pixelRatioAbsoluteMaximum:v.pixelRatioCapacity.absoluteMaximum},
    budgets:{semanticLayerContainers:n.semanticLayerContainers,environmentPrimitives:n.environmentPrimitives,interactionNodes:n.interactionNodes,totalRendererOwnedNodes:n.totalRendererOwnedNodes,
      maximumMountedRendererInstances:s.maximumMountedRendererInstances,maximumActiveRenderFrames:s.maximumActiveRenderFrames,maximumPendingFrameApplications:s.maximumPendingFrameApplications},
    livingPresentation:{governedBrowserRowCount:l.moduleGraph.governedBrowserRowCount,graphExpansionPermitted:l.moduleGraph.graphExpansionPermitted,
      maximumActiveFramesPerSecond:l.scheduler.maximumActiveFramesPerSecond,maximumMainThreadWorkMillisecondsPerFrame:l.scheduler.maximumMainThreadWorkMillisecondsPerFrame},
    authorityEvidence:{capacityOwnsCameraCapacity:module.H_EARTH_3D_CAPACITY_BOUNDARY_FLAGS.ownsCameraCapacity,capacityOwnsNodeBudget:module.H_EARTH_3D_CAPACITY_BOUNDARY_FLAGS.ownsNodeBudget,
      compositorConsumerPath:r.layer4Consumers.compositor,rendererConsumerPath:r.layer4Consumers.renderer}
  });
}

export function validateProductionFacts(facts, expectedFacts) {
  if (facts.auxiliaryCapacityModulePermitted !== false) fail('H2_DUPLICATE_CAPACITY_AUTHORITY_PROHIBITED');
  if (facts.canonicalCapacityPath !== '/showroom/globe/h-earth/capacity.js') fail('H2_CANONICAL_CAPACITY_PATH_MISMATCH');
  if (!exactFiniteFields(facts.camera.position,['x','y','z'])) fail('H2_DECLARED_CAMERA_POSITION_NONFINITE');
  if (!exactFiniteFields(facts.camera.target,['x','y','z'])) fail('H2_DECLARED_CAMERA_TARGET_NONFINITE');
  if (!exactFiniteFields(facts.camera.positionBounds,['xMin','xMax','yMin','yMax','zMin','zMax'])) fail('H2_DECLARED_POSITION_BOUND_UNRESOLVED');
  if (!exactFiniteFields(facts.camera.targetBounds,['xMin','xMax','yMin','yMax','zMin','zMax'])) fail('H2_DECLARED_TARGET_BOUND_UNRESOLVED');
  const comparable=clone(facts); delete comparable.authorityEvidence;
  if (digest(comparable) !== digest(expectedFacts)) fail('H2_OBSERVED_PRODUCTION_FACT_MISMATCH');
  if (facts.authorityEvidence.capacityOwnsCameraCapacity !== true || facts.authorityEvidence.capacityOwnsNodeBudget !== true) fail('H2_CAPACITY_AUTHORITY_DECLARATION_MISSING');
  const h1=evaluateH1({cameraPosition:Object.values(facts.camera.position),cameraTarget:Object.values(facts.camera.target),verticalFieldOfViewDegrees:facts.camera.verticalFovDegrees,
    nearPlane:facts.camera.nearPlane,farPlane:facts.camera.farPlane,yawDegrees:facts.camera.yawDegrees.initialWaterwardYawDegrees,pitchDegrees:0,
    viewportWidth:facts.viewport.preferredDesignWidthPx,viewportHeight:facts.viewport.preferredDesignHeightPx,devicePixelRatio:facts.viewport.pixelRatioMinimum});
  if (H1.contractId !== 'H_EARTH_CAPACITY_CAMERA_RENDERER_CORRESPONDENCE_LAWFUL_MEASUREMENT_MODEL_H1_v1') fail('H2_PARENT_CHECKPOINT_CONTRACT_MISMATCH');
  return freeze({status:'PASS',h1TerminalClassification:h1.terminalClassification,h1SemanticDigestSha256:h1.semanticDigestSha256,observedFactsDigestSha256:digest(facts)});
}
