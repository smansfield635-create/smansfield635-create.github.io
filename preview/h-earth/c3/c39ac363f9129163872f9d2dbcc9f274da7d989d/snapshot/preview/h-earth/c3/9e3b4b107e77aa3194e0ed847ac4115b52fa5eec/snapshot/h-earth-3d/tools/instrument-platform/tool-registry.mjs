import { canonicalDigest, deepFreeze } from './platform-core.mjs';

const tools = [
  {
    toolId: 'H_EARTH_GAUGES',
    displayName: 'H-Earth Gauges',
    applicationClass: 'READ_ONLY_CURRENT_AUTHORITY_ROUTE_RUNTIME_REGISTRY_AND_BOUNDARY_GAUGE',
    route: '/gauges/h-earth/',
    capabilities: [
      'CURRENT_AUTHORITY_ROUTE_EXECUTION',
      'RUN_8E_PUBLIC_HOST_VERIFICATION',
      'RUN_8B_TERRAIN_AUTHORITY_VERIFICATION',
      'ACCEPTED_CP2_RENDERER_VERIFICATION',
      'LIVE_GPU_BINDING_VERIFICATION',
      'REGISTRY_DIGEST_VERIFICATION',
      'SUPERSESSION_LEDGER',
      'DERIVED_AUTHORITY_STATUS',
      'DETERMINISTIC_READINESS_RECEIPT'
    ],
    runtimeApiKey: 'H_EARTH_CURRENT_AUTHORITY_GAUGE',
    readinessProbe: 'DOCUMENT_DATASET_CURRENT_AUTHORITY_GAUGE_RECEIPT',
    actions: ['RUN_CURRENT_AUTHORITY_AUDIT'],
    authorityProduced: [
      'CURRENT_AUTHORITY_PREFLIGHT_EVIDENCE',
      'SUPERSESSION_DISPOSITION_EVIDENCE'
    ],
    prohibitedMutations: ['REPOSITORY_WRITE', 'LIVE_BINDING_CHANGE', 'PRODUCT_ACCEPTANCE']
  },
  {
    toolId: 'FD_05_DIAGNOSTIC_AUTHORITY',
    displayName: 'FD_05 Diagnostic Authority',
    applicationClass: 'GOVERNED_BROWSER_CAPTURE_EVIDENCE_PACKAGE_OCCURRENCE_INTAKE_AND_EXACT_NINE_ADJUDICATION',
    route: '/showroom/globe/h-earth/diagnostic/',
    capabilities: ['BROWSER_CAPTURE', 'EVIDENCE_PACKAGING', 'OCCURRENCE_INTAKE', 'EXACT_NINE_ADJUDICATION', 'TERMINAL_DIAGNOSTIC_RECEIPT'],
    runtimeApiKey: 'H_EARTH_FD05_DIAGNOSTIC_RUNTIME_API',
    readinessProbe: 'GLOBAL_RUNTIME_API',
    actions: ['RUN_GOVERNED_CAPTURE', 'RUN_EXACT_NINE_CYCLE'],
    authorityProduced: ['RUNTIME_EVIDENCE', 'DIAGNOSTIC_CLASSIFICATION'],
    prohibitedMutations: ['SOURCE_CORRECTION_AUTHORITY', 'REPOSITORY_WRITE', 'PRODUCT_ACCEPTANCE']
  },
  {
    toolId: 'RUN_8E_R1_PROFILER',
    displayName: 'Run 8E-R1 Profiler',
    applicationClass: 'RENDERER_GPU_PHYSICAL_DEVICE_ORIENTATION_GESTURE_AND_PERFORMANCE_PROFILER',
    route: '/showroom/globe/h-earth/diagnostic/run8e-r1/',
    capabilities: ['ARCHITECTURE_PROBES', 'WEBGL2_PROBE', 'CPU_REFERENCE_PROFILE', 'PHYSICAL_DEVICE_SESSION', 'GESTURE_AND_ORIENTATION_PROFILE'],
    runtimeApiKey: 'H_EARTH_RUN8E_R1_ARCHITECTURE_RECEIPT',
    readinessProbe: 'PROFILE_STATE_AND_CONTROLS',
    actions: ['RUN_ARCHITECTURE_PROBES', 'START_PHYSICAL_SESSION', 'STOP_PHYSICAL_SESSION'],
    authorityProduced: ['PERFORMANCE_EVIDENCE', 'DEVICE_BEHAVIOR_EVIDENCE'],
    prohibitedMutations: ['PUBLIC_RENDERER_REPLACEMENT', 'LIVE_BINDING_CHANGE', 'PRODUCT_ACCEPTANCE']
  },
  {
    toolId: 'TERRAIN_INTELLIGENCE_AND_PERCEPTUAL_WORKBENCH',
    displayName: 'Terrain Intelligence and Perceptual Workbench',
    applicationClass: 'TERRAIN_AUTHORING_DIAGNOSTIC_SCENE_REPLAY_AND_USER_PERCEPTUAL_COMPARISON',
    route: '/h-earth-3d/tools/terrain-workbench/',
    capabilities: ['TERRAIN_ATLAS', 'PROTECTED_AUTHORITY_MAP', 'EIGHT_SCENE_REPLAY', 'DIAGNOSTIC_PASSES_A_THROUGH_H', 'SEVEN_MATERIAL_ABLATIONS', 'PERCEPTUAL_CORRESPONDENCE'],
    runtimeApiKey: 'H_EARTH_TERRAIN_WORKBENCH',
    readinessProbe: 'DOCUMENT_DATASET_TERRAIN_WORKBENCH_READY',
    actions: ['RUN_DETERMINISTIC_VERIFICATION_FIXTURE', 'RECORD_USER_PERCEPTUAL_CORRESPONDENCE'],
    authorityProduced: ['TERRAIN_INTELLIGENCE_EVIDENCE', 'PERCEPTUAL_CORRESPONDENCE_EVIDENCE'],
    prohibitedMutations: ['TERRAIN_MUTATION', 'ACCEPTED_RENDERER_MUTATION', 'LIVE_ROUTE_CHANGE', 'AUTOMATIC_PRODUCT_CANDIDATE']
  }
];

const registryBody = {
  schemaVersion: 'H_EARTH_TOOL_REGISTRY_v1',
  classificationLaw: {
    concreteApplications: 4,
    engineeringDomainsAreNotApplications: true,
    githubActionsRole: 'ORCHESTRATION_PLANE_NOT_PEER_WORKBENCH',
    categoriesMayCrossToolBoundaries: true
  },
  tools
};

export const H_EARTH_TOOL_REGISTRY = deepFreeze({
  ...registryBody,
  registryDigest: canonicalDigest(registryBody)
});

export function getTool(toolId) {
  return H_EARTH_TOOL_REGISTRY.tools.find((tool) => tool.toolId === toolId) ?? null;
}

export default H_EARTH_TOOL_REGISTRY;
