import { auditPhase1B } from '../../../assets/manor-blueprint/manor.estate.gothic-detail-phase1b.mjs';
import { MIRROR_MANOR_GOTHIC_PHASE1B_SIX_VIEW_REVIEW } from './mirror-manor.gothic-detail-phase1b.six-view-review.mjs';

const audit=auditPhase1B();
const checks=Object.freeze([
  ['PHASE1B_STATIC',audit.passStatic===true],
  ['TRUE_FACADE_OPENINGS',audit.realHoleTopology===true],
  ['OPENING_CONTAINMENT',audit.openingContainment===true],
  ['REPLACEMENT_OWNERSHIP',audit.replacementOwnership===true],
  ['AFFECTED_FACES_OMITTED',audit.allAffectedFacesOmitted===true],
  ['P3_AUTHORITY_PRESERVED',audit.p3Preserved===true],
  ['NO_FORBIDDEN_DETAIL',audit.noForbiddenDetail===true],
  ['POINTED_PORTAL_TOPOLOGY',MIRROR_MANOR_GOTHIC_PHASE1B_SIX_VIEW_REVIEW.findings.portalOpeningTopology==='PASS'],
  ['PHASE2_ADMISSION',MIRROR_MANOR_GOTHIC_PHASE1B_SIX_VIEW_REVIEW.phase2Admission===true]
]);
const failures=checks.filter(([,pass])=>!pass).map(([id])=>id);
console.log(JSON.stringify({
  status:failures.length===0?'PASS_PHASE2_ADMISSION':'FAIL_PHASE1B_VISUAL_REVIEW',
  checks:checks.map(([id,pass])=>({id,pass})),
  failures,
  audit,
  sixViewReview:MIRROR_MANOR_GOTHIC_PHASE1B_SIX_VIEW_REVIEW,
  claimCeiling:failures.length===0?'PHASE1B_ACCEPTED_FOR_PHASE2':'TRUE_FACADE_OPENINGS_PRESENT; POINTED_PORTAL_CUT_TOPOLOGY_REMAINS_BLOCKING'
},null,2));
if(failures.length)process.exitCode=1;
