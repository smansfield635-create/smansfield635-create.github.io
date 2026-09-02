import { auditBlockout, CONTRACT } from '../../../assets/manor-blueprint/manor.estate.neutral-blockout.mjs';
import { MIRROR_MANOR_P2_SIX_VIEW_REVIEW } from './mirror-manor.p2-six-view-review.mjs';

const audit = auditBlockout();
const checks = Object.freeze([
  ['CONTRACT_ID', CONTRACT === 'MIRROR_MANOR_NEUTRAL_SITE_MASSING_BLOCKOUT_v1'],
  ['STATIC_AUDIT', audit.passStatic === true],
  ['NO_DUPLICATE_IDS', audit.duplicateIds.length === 0],
  ['NO_PROHIBITED_DETAIL', audit.prohibitedDetailCount === 0],
  ['MASSING_HIERARCHY_DECLARED', audit.hierarchy === true],
  ['VALID_DIMENSIONS', audit.validDimensions === true],
  ['SITE_CAPACITY_COMPATIBLE', audit.siteCapacityCompatible === true],
  ['CAROUSEL_DISTANCE_PRESERVED_94', audit.carouselDistanceReconciled === true],
  ['P3_CROWN_GEOMETRY_COMPLETE', audit.crownGeometryComplete === true && audit.crownCount === 3],
  ['P3_CAROUSEL_PROJECTION', MIRROR_MANOR_P2_SIX_VIEW_REVIEW.carouselProjection.verdict === 'PASS'],
  ['P3_TOWER_CROWN_GEOMETRY', MIRROR_MANOR_P2_SIX_VIEW_REVIEW.geometryInspection.pass === true],
  ['DETAIL_ADMISSION', MIRROR_MANOR_P2_SIX_VIEW_REVIEW.detailAdmission === true]
]);
const failures = checks.filter(([,pass]) => !pass).map(([id]) => id);
const receipt = Object.freeze({
  contract: CONTRACT,
  status: failures.length === 0 ? 'PASS_DETAIL_ADMISSION' : 'FAIL_PREDETAIL_REVIEW',
  checks: checks.map(([id,pass]) => Object.freeze({id,pass})),
  failures,
  audit,
  sixViewReview:MIRROR_MANOR_P2_SIX_VIEW_REVIEW,
  claimCeiling: failures.length === 0
    ? 'P3_NEUTRAL_MASSING_ACCEPTED_FOR_GOTHIC_ARCHITECTURAL_DETAIL_PHASE_1'
    : 'P3_NEUTRAL_MASSING_REQUIRES_CORRECTION_BEFORE_DETAIL'
});
console.log(JSON.stringify(receipt, null, 2));
if (failures.length) process.exitCode = 1;
