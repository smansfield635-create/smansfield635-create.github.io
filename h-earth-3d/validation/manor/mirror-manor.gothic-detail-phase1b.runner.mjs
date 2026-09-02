import { auditBlockout, CAMERA, SITE } from '../../../assets/manor-blueprint/manor.estate.neutral-blockout.mjs';
import { auditPhase1 } from '../../../assets/manor-blueprint/manor.estate.gothic-detail-phase1.mjs';
import { auditPhase1B, CONTRACT, TRUE_OPENINGS, FACADE_REPLACEMENTS, OMIT_FACE_MAP } from '../../../assets/manor-blueprint/manor.estate.gothic-detail-phase1b.mjs';

const p3=auditBlockout(),p1=auditPhase1(),p1b=auditPhase1B();
const checks=Object.freeze([
  ['CONTRACT_ID',CONTRACT==='MIRROR_MANOR_GOTHIC_ARCHITECTURAL_DETAIL_PHASE1B_v1'],
  ['P3_STATIC',p3.passStatic===true],
  ['PHASE1_STATIC',p1.passStatic===true],
  ['PHASE1B_STATIC',p1b.passStatic===true],
  ['TRUE_OPENINGS',p1b.realHoleTopology===true&&TRUE_OPENINGS.length===25],
  ['FACADE_REPLACEMENTS',FACADE_REPLACEMENTS.length===5],
  ['OMIT_FACE_MAP',Object.keys(OMIT_FACE_MAP).length===4],
  ['OPENING_CONTAINMENT',p1b.openingContainment===true],
  ['REPLACEMENT_OWNERSHIP',p1b.replacementOwnership===true],
  ['P3_SPAN_PRESERVED',SITE.principalStructuralSpan===27],
  ['CAROUSEL_DISTANCE_PRESERVED',CAMERA.distance===94],
  ['NO_FORBIDDEN_DETAIL',p1b.noForbiddenDetail===true]
]);
const failures=checks.filter(([,pass])=>!pass).map(([id])=>id);
const receipt=Object.freeze({
  contract:CONTRACT,
  status:failures.length===0?'PASS_PHASE1B_FACADE_CUT_STATIC':'FAIL_PHASE1B_FACADE_CUT_STATIC',
  checks:checks.map(([id,pass])=>Object.freeze({id,pass})),failures,
  audit:p1b,
  visualReviewPending:true,
  phase2Admission:false,
  claimCeiling:failures.length===0?'TRUE_FACADE_OPENING_TOPOLOGY_CONSTRUCTED; SIX_VIEW_VISUAL_ACCEPTANCE_PENDING':'PHASE1B_TOPOLOGY_NOT_ACCEPTED'
});
console.log(JSON.stringify(receipt,null,2));
if(failures.length)process.exitCode=1;
