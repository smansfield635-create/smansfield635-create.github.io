/**
 * H_EARTH_FUNCTIONAL_LANDSCAPE_RUN_6F_VISUAL_CAPTURE_AMENDMENT_v1
 * Governance-only authorization for separate waypoint screenshots after the
 * already-passing Run 6F browser matrix. No product, route, or authority law
 * is changed by this amendment.
 */

import {
  H_EARTH_FUNCTIONAL_LANDSCAPE_RUN_6F_AMENDMENT_CONTRACT_ID
} from './h-earth.functional-landscape-run-6f.amendment.js';

export const H_EARTH_FUNCTIONAL_LANDSCAPE_RUN_6F_VISUAL_CAPTURE_AMENDMENT =
  Object.freeze({
    contractId:
      'H_EARTH_FUNCTIONAL_LANDSCAPE_RUN_6F_VISUAL_CAPTURE_AMENDMENT_v1',
    governingAmendmentContractId:
      H_EARTH_FUNCTIONAL_LANDSCAPE_RUN_6F_AMENDMENT_CONTRACT_ID,
    allowedPath:
      '/h-earth-3d/validation/h-earth.functional-landscape.run6f.visual-capture.mjs',
    purpose:
      'CAPTURE_COAST_BERM_LOWLAND_HILL_AND_RIDGE_BROWSER_OCCURRENCES',
    browserVerdictAuthority: false,
    productMutationAuthority: false,
    publicRouteReplacementAuthority: false,
    productionAuthority: false
  });

export function evaluateHEarthRun6FVisualCaptureAmendment() {
  const amendment =
    H_EARTH_FUNCTIONAL_LANDSCAPE_RUN_6F_VISUAL_CAPTURE_AMENDMENT;
  const issues = [];
  if (!amendment.allowedPath.endsWith('.visual-capture.mjs')) {
    issues.push('VISUAL_CAPTURE_PATH_INVALID');
  }
  if (amendment.productMutationAuthority !== false ||
      amendment.productionAuthority !== false) {
    issues.push('VISUAL_CAPTURE_AUTHORITY_EXCEEDED');
  }
  return Object.freeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? 'RUN_6F_VISUAL_CAPTURE_AMENDMENT_PASS'
      : 'RUN_6F_VISUAL_CAPTURE_AMENDMENT_FAIL',
    issues: Object.freeze(issues)
  });
}
