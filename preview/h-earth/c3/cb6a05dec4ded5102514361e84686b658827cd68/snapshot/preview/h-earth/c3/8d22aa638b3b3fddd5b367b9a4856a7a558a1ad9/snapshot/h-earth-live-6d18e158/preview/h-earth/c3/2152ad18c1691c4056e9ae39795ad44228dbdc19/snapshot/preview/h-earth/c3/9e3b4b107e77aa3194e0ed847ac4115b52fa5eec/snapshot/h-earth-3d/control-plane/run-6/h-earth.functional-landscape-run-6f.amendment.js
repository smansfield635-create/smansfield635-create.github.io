/**
 * /h-earth-3d/control-plane/run-6/h-earth.functional-landscape-run-6f.amendment.js
 *
 * H_EARTH_FUNCTIONAL_LANDSCAPE_RUN_6F_PATH_AND_EXECUTION_AMENDMENT_v1
 *
 * Governance-only amendment. It adds the pure navigation proposal module and
 * browser validation surfaces required to execute checkpoint 6F. It does not
 * alter the exact parent basis, retained authorities, held capabilities,
 * production posture, or prior checkpoint results.
 */

import {
  H_EARTH_FUNCTIONAL_LANDSCAPE_RUN_6_CONTRACT_ID,
  H_EARTH_FUNCTIONAL_LANDSCAPE_RUN_6
} from './h-earth.functional-landscape-run-6.program.js';

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value)) {
    return value;
  }
  if (seen.has(value)) {
    return value;
  }
  seen.add(value);
  Object.values(value).forEach((nested) => freeze(nested, seen));
  return Object.freeze(value);
};

export const H_EARTH_FUNCTIONAL_LANDSCAPE_RUN_6F_AMENDMENT_CONTRACT_ID =
  'H_EARTH_FUNCTIONAL_LANDSCAPE_RUN_6F_PATH_AND_EXECUTION_AMENDMENT_v1';

export const H_EARTH_FUNCTIONAL_LANDSCAPE_RUN_6F_AMENDMENT = freeze({
  contractId:
    H_EARTH_FUNCTIONAL_LANDSCAPE_RUN_6F_AMENDMENT_CONTRACT_ID,
  governingProgramContractId:
    H_EARTH_FUNCTIONAL_LANDSCAPE_RUN_6_CONTRACT_ID,
  exactParentCommit:
    H_EARTH_FUNCTIONAL_LANDSCAPE_RUN_6.exactParentCommit,
  amendmentClass: 'BOUNDED_CHECKPOINT_PATH_AND_EXECUTION_AMENDMENT',
  productPromotionAuthorized: false,
  mainMutationAuthorized: false,
  existingPublicRouteReplacementAuthorized: false,
  allowedPaths: [
    '/showroom/globe/h-earth/functional-landscape/navigation.js',
    '/showroom/globe/h-earth/functional-landscape/index.html',
    '/showroom/globe/h-earth/functional-landscape/index.css',
    '/showroom/globe/h-earth/functional-landscape/index.js',
    '/showroom/globe/h-earth/render/functional-landscape-compositor.js',
    '/h-earth-3d/validation/h-earth.functional-landscape.run6f.harness.mjs',
    '/h-earth-3d/validation/h-earth.functional-landscape.run6f.browser.mjs',
    '/h-earth-3d/validation/h-earth.functional-landscape.run6f.receipt.json',
    '/.github/workflows/h-earth-functional-landscape-run6-validation.yml'
  ],
  navigationAuthorityBoundary: {
    consumesExistingCameraCapacity: true,
    consumesCanonicalTerrainField: true,
    consumesLandscapeRealizationPlan: true,
    emitsCameraProposal: true,
    validatesTerrainClearance: true,
    retainsLastLawfulStateForRecovery: true,
    ownsCanonicalCameraState: false,
    ownsTerrainField: false,
    ownsCollisionOrPhysics: false,
    ownsRenderer: false,
    ownsPublicRoute: false
  },
  requiredExecution: {
    nodeHarness: true,
    actualBrowser: true,
    chromiumDesktopLandscape: true,
    chromiumMobilePortrait: true,
    chromiumMobileLandscape: true,
    screenshotEvidence: true,
    browserReceipt: true
  },
  held: [
    'PHYSICS',
    'COLLISION_SYSTEM',
    'WALKING_ACTOR',
    'VARIABLE_LOD',
    'RUNTIME_STREAMING',
    'VEGETATION',
    'DECORATIVE_ROCKS',
    'PUBLIC_ROUTE_REPLACEMENT',
    'PRODUCTION_PROMOTION'
  ]
});

export function evaluateHEarthFunctionalLandscapeRun6FAmendment() {
  const issues = [];
  if (H_EARTH_FUNCTIONAL_LANDSCAPE_RUN_6F_AMENDMENT.exactParentCommit !==
      'd41a48eef3d601c2afca0808cdd05ec58d5fc8b0') {
    issues.push('EXACT_PARENT_COMMIT_CHANGED');
  }
  if (!H_EARTH_FUNCTIONAL_LANDSCAPE_RUN_6F_AMENDMENT.allowedPaths.includes(
    '/showroom/globe/h-earth/functional-landscape/navigation.js'
  )) {
    issues.push('NAVIGATION_PATH_NOT_AUTHORIZED');
  }
  if (H_EARTH_FUNCTIONAL_LANDSCAPE_RUN_6F_AMENDMENT
    .productPromotionAuthorized !== false) {
    issues.push('PRODUCT_PROMOTION_NOT_WITHHELD');
  }
  if (H_EARTH_FUNCTIONAL_LANDSCAPE_RUN_6F_AMENDMENT
    .existingPublicRouteReplacementAuthorized !== false) {
    issues.push('PUBLIC_ROUTE_REPLACEMENT_NOT_WITHHELD');
  }

  return freeze({
    contractId:
      H_EARTH_FUNCTIONAL_LANDSCAPE_RUN_6F_AMENDMENT_CONTRACT_ID,
    eligible: issues.length === 0,
    status: issues.length === 0
      ? 'RUN_6F_PATH_AND_EXECUTION_AMENDMENT_PASS'
      : 'RUN_6F_PATH_AND_EXECUTION_AMENDMENT_FAIL',
    issues
  });
}

export const H_EARTH_FUNCTIONAL_LANDSCAPE_RUN_6F_AMENDMENT_RECEIPT =
  evaluateHEarthFunctionalLandscapeRun6FAmendment();
