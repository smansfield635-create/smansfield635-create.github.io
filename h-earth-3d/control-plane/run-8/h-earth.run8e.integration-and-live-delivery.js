/**
 * H_EARTH_RUN_8E_INTEGRATION_AND_LIVE_DELIVERY_CONTROL_v1
 *
 * Governs the bounded Run 8E integration occurrence. Engineering integration
 * may execute on the Run 8E branch; deployment, main promotion, Samsung-device
 * proof, and live-browser identity remain separate closure conditions.
 */

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value) || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

export const H_EARTH_RUN_8E_CONTROL_CONTRACT_ID =
  'H_EARTH_RUN_8E_INTEGRATION_AND_LIVE_DELIVERY_CONTROL_v1';

export const H_EARTH_RUN_8E_CONTROL = freeze({
  contractId: H_EARTH_RUN_8E_CONTROL_CONTRACT_ID,
  parentRun8DCommit: '26bab1eb804a6e8737f551e1d1aa9d9cbbe4ae5f',
  workspaceBranch: 'agent/h-earth-run8e-public-integration-001',
  predecessorStatus: {
    run8A: 'PASS_CLOSED',
    run8B: 'PASS_CLOSED',
    run8C: 'PASS_CLOSED',
    run8D: 'PASS_CLOSED'
  },
  authorizedEngineeringScope: [
    'WEST_ADMISSION',
    'PACKET_002_SUCCESSOR_TRANSFER',
    'FRAME_COMPOSITION',
    'SINGLE_PHYSICAL_DEPTH_DOMAIN',
    'SUCCESSOR_TERRAIN_AND_MOUNTAIN_RENDER_INTEGRATION',
    'RUN_8C_NORMAL_LIGHT_MATERIAL_RENDER_INTEGRATION',
    'GROUNDED_VEGETATION_DEPTH_AND_OCCLUSION_EXECUTION',
    'SINGLE_SKY_AUTHORITY',
    'SUN_DISC_AND_ATMOSPHERE_PRESENTATION',
    'CAMERA_TO_SUCCESSOR_TERRAIN_RECONCILIATION',
    'BRANCH_NATIVE_VALIDATION'
  ],
  closureConditions: [
    'PUBLIC_H_EARTH_ROUTE_REPLACEMENT',
    'SAMSUNG_PHYSICAL_EXECUTION',
    'PRE_UPDATE_BASELINE_COMPARISON',
    'RUN_8_STACK_PROMOTION_TO_MAIN',
    'DEPLOYMENT',
    'LIVE_IDENTITY_AND_BROWSER_PROOF'
  ],
  preservedBoundaries: {
    run8ALawReopened: false,
    run8BGeometryMutated: false,
    run8CPresentationLawMutated: false,
    run8DWorldAttachmentMutated: false,
    run6TerrainMutatedInPlace: false,
    legacyProxyClaimedAsProvenLod: false,
    cameraAuthorityCreated: false,
    navigationAuthorityCreated: false
  }
});

export function evaluateHEarthRun8EControlContract(candidate = H_EARTH_RUN_8E_CONTROL) {
  const issues = [];
  if (candidate?.contractId !== H_EARTH_RUN_8E_CONTROL_CONTRACT_ID) issues.push('RUN_8E_CONTROL_ID_MISMATCH');
  if (candidate?.parentRun8DCommit !== '26bab1eb804a6e8737f551e1d1aa9d9cbbe4ae5f') issues.push('RUN_8D_PARENT_COMMIT_MISMATCH');
  if (!Object.values(candidate?.predecessorStatus ?? {}).every((status) => status === 'PASS_CLOSED')) {
    issues.push('RUN_8E_PREDECESSOR_NOT_CLOSED');
  }
  if (!Array.isArray(candidate?.authorizedEngineeringScope) || candidate.authorizedEngineeringScope.length < 8) {
    issues.push('RUN_8E_ENGINEERING_SCOPE_INCOMPLETE');
  }
  if (!Array.isArray(candidate?.closureConditions) || candidate.closureConditions.length < 5) {
    issues.push('RUN_8E_CLOSURE_CONDITIONS_INCOMPLETE');
  }
  if (Object.values(candidate?.preservedBoundaries ?? {}).some((value) => value !== false)) {
    issues.push('RUN_8E_PREDECESSOR_BOUNDARY_VIOLATION');
  }
  return freeze({
    eligible: issues.length === 0,
    status: issues.length === 0 ? 'RUN_8E_CONTROL_PASS' : 'RUN_8E_CONTROL_FAIL',
    contractId: H_EARTH_RUN_8E_CONTROL_CONTRACT_ID,
    issues
  });
}

export default H_EARTH_RUN_8E_CONTROL;
