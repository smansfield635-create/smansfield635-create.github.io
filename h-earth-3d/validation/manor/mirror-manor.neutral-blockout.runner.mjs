import { auditBlockout, CONTRACT, REVISION, SITE, CAMERA } from '../../../assets/manor-blueprint/manor.estate.neutral-blockout.mjs';

const audit = auditBlockout();
const checks = Object.freeze([
  ['CONTRACT_ID', CONTRACT === 'MIRROR_MANOR_NEUTRAL_SITE_MASSING_BLOCKOUT_v1'],
  ['REVISION_P2', REVISION === 'P2_SITE_CAPACITY_AND_CAROUSEL_DISTANCE'],
  ['STATIC_AUDIT', audit.passStatic === true],
  ['NO_DUPLICATE_IDS', audit.duplicateIds.length === 0],
  ['NO_PROHIBITED_DETAIL', audit.prohibitedDetailCount === 0],
  ['MASSING_HIERARCHY', audit.hierarchy === true],
  ['VALID_DIMENSIONS', audit.validDimensions === true],
  ['MESH_COUNT', audit.meshCount === 17],
  ['TRIANGLE_VERTEX_TRIPLE_COUNT', audit.triangleCount === 522],
  ['PRINCIPAL_SPAN_WITHIN_TESTED_MAXIMUM', SITE.principalStructuralSpan <= SITE.testedEnvelopeMaximum[0]],
  ['PRINCIPAL_DEPTH_WITHIN_TESTED_MAXIMUM', SITE.principalStructuralDepth <= SITE.testedEnvelopeMaximum[1]],
  ['CAROUSEL_DISTANCE_RECONCILED', CAMERA.distance >= 90 && CAMERA.distance <= 100],
  ['EXACT_H_EARTH_PLACEMENT_REMAINS_PENDING', audit.siteAcceptancePending === true],
  ['CAROUSEL_HUMAN_REVIEW_REMAINS_PENDING', audit.carouselHumanReviewPending === true]
]);
const failures = checks.filter(([,pass]) => !pass).map(([id]) => id);
const receipt = Object.freeze({
  contract: CONTRACT,
  revision: REVISION,
  status: failures.length === 0 ? 'PASS_P2_STATIC_RECONCILIATION' : 'FAIL_P2_STATIC_RECONCILIATION',
  checks: checks.map(([id,pass]) => Object.freeze({id,pass})),
  failures,
  audit,
  site: SITE,
  camera: CAMERA,
  claimCeiling: 'P2_NEUTRAL_MASSING_IS_SITE_CAPACITY_COMPATIBLE_AND_CAROUSEL_DISTANCE_RECONCILED; EXACT_H_EARTH_PLACEMENT_AND_VISUAL_ACCEPTANCE_PENDING'
});
console.log(JSON.stringify(receipt, null, 2));
if (failures.length) process.exitCode = 1;
