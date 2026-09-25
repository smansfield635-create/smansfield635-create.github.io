import toolRegistry from '../../tools/instrument-platform/tool-registry.mjs';
import projectContext from '../../tools/instrument-platform/project-context.mjs';
import sceneRegistry from '../../tools/instrument-platform/permanent-scene-registry.mjs';

const deepFreeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const member of Object.values(value)) deepFreeze(member, seen);
  return Object.freeze(value);
};

export const H_EARTH_INSTRUMENT_PLATFORM_AUTHORITY_v1 = deepFreeze({
  schemaVersion: 'H_EARTH_INSTRUMENT_PLATFORM_AUTHORITY_v1',
  operation: 'H_EARTH_INSTRUMENT_PLATFORM_CONTROL_PLANE_AND_STATE_MACHINE_v1',
  deliverable: 'H_EARTH_INSTRUMENT_PLATFORM_v1',
  class: 'GOVERNED_INTERNAL_ENGINEERING_DIAGNOSTIC_AUTHORING_CANDIDATE_ACCEPTANCE_AND_PROMOTION_INSTRUMENT',
  status: 'UNIFIED_INSTRUMENT_SOURCE_AND_RUNTIME_IMPLEMENTATION',
  controllingBaseHead: 'accdec74088120446bfc28f4441fc08a8210813f',
  includedInstrumentCount: toolRegistry.tools.length,
  includedInstruments: toolRegistry.tools.map((tool) => tool.toolId),
  sharedAuthorities: [
    'H_EARTH_TOOL_REGISTRY_v1',
    'H_EARTH_PROJECT_CONTEXT_v1',
    'H_EARTH_PERMANENT_SCENE_REGISTRY_v1',
    'H_EARTH_EVIDENCE_ENVELOPE_v1',
    'H_EARTH_CROSS_TOOL_SESSION_LEDGER_v1',
    'H_EARTH_CHANGE_CLASS_ROUTER_v1',
    'H_EARTH_AUTHORITY_STATE_MACHINE_v1'
  ],
  constructionAndTerminalControllers: [
    'H_EARTH_BOUNDED_CANDIDATE_ASSEMBLER',
    'H_EARTH_BOUNDED_LIVE_ADMISSION_CONTROLLER',
    'H_EARTH_PUBLIC_CANDIDATE_VERIFICATION_CONTROLLER',
    'H_EARTH_USER_DIFFERENTIAL_RECORDER',
    'H_EARTH_DEFAULT_PROMOTION_CONTROLLER',
    'H_EARTH_PUBLIC_DEFAULT_REVERIFICATION_CONTROLLER'
  ],
  authorityPartition: projectContext.authorityPartition,
  permanentSceneRegistryDigest: sceneRegistry.registryDigest,
  toolRegistryDigest: toolRegistry.registryDigest,
  fixedGates: {
    exactToolCount: 4,
    exactPermanentSceneCount: 8,
    b1BaselineDigest: 'fnv1a32:513f79fa',
    b2ProtectionDigest: 'fnv1a32:f228a5b5',
    cp2HFrameEquivalence: '8_OF_8',
    cp2DepthEquivalence: '8_OF_8',
    diagnosticPasses: 'A_THROUGH_H',
    materialFamilyAblations: '7_OF_7',
    deterministicPlatformExport: true,
    browserConsoleErrors: 0,
    pageErrors: 0,
    liveHostChanged: false,
    liveBindingChanged: false,
    acceptedRendererChanged: false,
    publicHEarthRouteChanged: false
  },
  exactPathScope: [
    '.github/workflows/h-earth-instrument-platform.yml',
    '.github/workflows/h-earth-terrain-workbench.yml',
    'h-earth-3d/control-plane/instrument-platform/H_EARTH_INSTRUMENT_PLATFORM_AUTHORITY.v1.mjs',
    'h-earth-3d/control-plane/post-cp2-round2/H_EARTH_ROUND2_ASSET_DISPOSITION_MANIFEST.v1.json',
    'h-earth-3d/tools/instrument-platform/authority-state-machine.mjs',
    'h-earth-3d/tools/instrument-platform/bounded-candidate-assembler.mjs',
    'h-earth-3d/tools/instrument-platform/change-class-router.mjs',
    'h-earth-3d/tools/instrument-platform/evidence-envelope.mjs',
    'h-earth-3d/tools/instrument-platform/export-platform-packet.mjs',
    'h-earth-3d/tools/instrument-platform/index.html',
    'h-earth-3d/tools/instrument-platform/instrument-adapters.mjs',
    'h-earth-3d/tools/instrument-platform/permanent-scene-registry.mjs',
    'h-earth-3d/tools/instrument-platform/platform-core.mjs',
    'h-earth-3d/tools/instrument-platform/platform.mjs',
    'h-earth-3d/tools/instrument-platform/project-context.mjs',
    'h-earth-3d/tools/instrument-platform/session-ledger.mjs',
    'h-earth-3d/tools/instrument-platform/terminal-controllers.mjs',
    'h-earth-3d/tools/instrument-platform/tool-registry.mjs',
    'h-earth-3d/tools/terrain-workbench/export-packet.mjs',
    'h-earth-3d/tools/terrain-workbench/index.html',
    'h-earth-3d/tools/terrain-workbench/perceptual-correspondence.mjs',
    'h-earth-3d/tools/terrain-workbench/scene-lab.mjs',
    'h-earth-3d/tools/terrain-workbench/terrain-atlas.mjs',
    'h-earth-3d/tools/terrain-workbench/workbench.mjs',
    'h-earth-3d/validation/instrument-platform/h-earth.instrument-platform.runner.mjs',
    'h-earth-3d/validation/terrain-workbench/h-earth.terrain-workbench.runner.mjs'
  ],
  boundaries: {
    productMutationPerformed: false,
    liveStateChanged: false,
    candidateConstructionPerformed: false,
    userAcceptanceRecorded: false,
    publicDefaultChanged: false,
    stop: 'STOP_AFTER_UNIFIED_INSTRUMENT_RUNTIME_IMPLEMENTATION_AND_REPOSITORY_INTEGRATION'
  },
  result: 'H_EARTH_INSTRUMENT_PLATFORM_PASS_CLOSED'
});

export default H_EARTH_INSTRUMENT_PLATFORM_AUTHORITY_v1;
