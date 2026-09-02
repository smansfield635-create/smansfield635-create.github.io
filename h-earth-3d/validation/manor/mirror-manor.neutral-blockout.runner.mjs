import { auditBlockout, CONTRACT } from '../../../assets/manor-blueprint/manor.estate.neutral-blockout.mjs';

const audit = auditBlockout();
const checks = Object.freeze([
  ['CONTRACT_ID', CONTRACT === 'MIRROR_MANOR_NEUTRAL_SITE_MASSING_BLOCKOUT_v1'],
  ['STATIC_AUDIT', audit.passStatic === true],
  ['NO_DUPLICATE_IDS', audit.duplicateIds.length === 0],
  ['NO_PROHIBITED_DETAIL', audit.prohibitedDetailCount === 0],
  ['MASSING_HIERARCHY', audit.hierarchy === true],
  ['VALID_DIMENSIONS', audit.validDimensions === true],
  ['MESH_COUNT', audit.meshCount === 17],
  ['TRIANGLE_VERTEX_TRIPLE_COUNT', audit.triangleCount === 522],
  ['SITE_REMAINS_PENDING', audit.siteAcceptancePending === true],
  ['CAROUSEL_RUNTIME_REMAINS_PENDING', audit.carouselRuntimeTestPending === true]
]);
const failures = checks.filter(([,pass]) => !pass).map(([id]) => id);
const receipt = Object.freeze({
  contract: CONTRACT,
  status: failures.length === 0 ? 'PASS_STATIC_BLOCKOUT' : 'FAIL_STATIC_BLOCKOUT',
  checks: checks.map(([id,pass]) => Object.freeze({id,pass})),
  failures,
  audit,
  claimCeiling: 'NEUTRAL_MASSING_CONSTRUCTED_STATICALLY; H_EARTH_SITE_AND_CAROUSEL_RUNTIME_VALIDATION_PENDING'
});
console.log(JSON.stringify(receipt, null, 2));
if (failures.length) process.exitCode = 1;
