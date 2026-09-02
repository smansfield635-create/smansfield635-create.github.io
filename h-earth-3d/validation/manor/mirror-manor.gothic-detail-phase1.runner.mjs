import { auditBlockout, CAMERA, SITE } from '../../../assets/manor-blueprint/manor.estate.neutral-blockout.mjs';
import { auditPhase1, CONTRACT, RULES } from '../../../assets/manor-blueprint/manor.estate.gothic-detail-phase1.mjs';
import { MIRROR_MANOR_GOTHIC_PHASE1_SIX_VIEW_REVIEW } from './mirror-manor.gothic-detail-phase1.six-view-review.mjs';

const p3=auditBlockout();
const p1=auditPhase1();
const review=MIRROR_MANOR_GOTHIC_PHASE1_SIX_VIEW_REVIEW;
const checks=Object.freeze([
  ['P3_STATIC_ACCEPTED',p3.passStatic===true],
  ['PHASE1_STATIC_ACCEPTED',p1.passStatic===true],
  ['PHASE1_CONTRACT',p1.contract===CONTRACT],
  ['NO_FORBIDDEN_DETAIL',p1.noForbiddenDetail===true],
  ['P3_SPAN_PRESERVED',SITE.principalStructuralSpan===RULES.principalSpan],
  ['P3_CAMERA_DISTANCE_PRESERVED',CAMERA.distance===RULES.carouselDistance],
  ['OPENING_CONTAINMENT',p1.openingContainment===true],
  ['PORTAL_CONTAINMENT',p1.portalContainment===true],
  ['BUTTRESS_OWNERSHIP',p1.buttressOwnership===true],
  ['ROOF_EDGE_OWNERSHIP',p1.roofOwnership===true],
  ['SIX_VIEW_REVIEW',review.verdict==='PASS_PHASE1_VISUAL_REVIEW'],
  ['TRUE_VISIBLE_FACADE_OPENINGS',review.findings.visibleOpeningGeometry==='PASS'],
  ['PHASE2_ADMISSION',review.phase2Admission===true]
]);
const failures=checks.filter(([,pass])=>!pass).map(([id])=>id);
const receipt=Object.freeze({
  schemaVersion:'MIRROR_MANOR_GOTHIC_DETAIL_PHASE1_RECEIPT_v2',
  contract:CONTRACT,
  status:failures.length===0?'PASS_PHASE1_CLOSED':'FAIL_PHASE1_VISUAL_REVIEW',
  checks:checks.map(([id,pass])=>Object.freeze({id,pass})),
  failures,
  p3Audit:p3,
  phase1Audit:p1,
  sixViewReview:review,
  claimCeiling:failures.length===0?'GOTHIC_DETAIL_PHASE1_ACCEPTED_FOR_PHASE2':'PHASE1_STATIC_INTEGRITY_PASSES; TRUE_VISIBLE_FACADE_OPENINGS_REQUIRED_BEFORE_PHASE2'
});
console.log(JSON.stringify(receipt,null,2));
if(failures.length)process.exitCode=1;
