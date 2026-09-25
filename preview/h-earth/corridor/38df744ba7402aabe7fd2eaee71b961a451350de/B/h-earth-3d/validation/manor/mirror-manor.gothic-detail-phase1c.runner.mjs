import { auditBlockout, CAMERA, SITE } from '../../../assets/manor-blueprint/manor.estate.neutral-blockout.mjs';
import { auditPhase1 } from '../../../assets/manor-blueprint/manor.estate.gothic-detail-phase1.mjs';
import { auditPhase1B } from '../../../assets/manor-blueprint/manor.estate.gothic-detail-phase1b.mjs';
import { auditPhase1C, CONTRACT, POINTED_PORTAL_PROFILES, RULES } from '../../../assets/manor-blueprint/manor.estate.gothic-detail-phase1c.mjs';

const p3=auditBlockout(),p1=auditPhase1(),p1b=auditPhase1B(),p1c=auditPhase1C();
const checks=Object.freeze([
  ['CONTRACT_ID',CONTRACT==='MIRROR_MANOR_GOTHIC_ARCHITECTURAL_DETAIL_PHASE1C_v1'],
  ['P3_STATIC',p3.passStatic===true],
  ['PHASE1_STATIC',p1.passStatic===true],
  ['PHASE1B_STATIC',p1b.passStatic===true],
  ['PHASE1C_STATIC',p1c.passStatic===true],
  ['TWO_POINTED_PORTALS',POINTED_PORTAL_PROFILES.length===2],
  ['PORTAL_PROFILES_VALID',p1c.profileValid===true],
  ['SPANDREL_MASONRY',p1c.spandrelMeshCount===4],
  ['SLOPED_REVEALS',p1c.slopedRevealMeshCount===4],
  ['POINTED_TOPOLOGY_COMPLETE',p1c.topologyComplete===true],
  ['P3_SPAN_PRESERVED',SITE.principalStructuralSpan===27],
  ['CAROUSEL_DISTANCE_PRESERVED',CAMERA.distance===94],
  ['NO_FORBIDDEN_DETAIL',p1c.noForbiddenDetail===true&&RULES.tracery===false&&RULES.dormers===false]
]);
const failures=checks.filter(([,pass])=>!pass).map(([id])=>id);
const receipt=Object.freeze({contract:CONTRACT,status:failures.length===0?'PASS_PHASE1C_POINTED_PORTAL_STATIC':'FAIL_PHASE1C_POINTED_PORTAL_STATIC',checks:checks.map(([id,pass])=>Object.freeze({id,pass})),failures,audit:p1c,sixViewReviewPending:true,phase2Admission:false,claimCeiling:failures.length===0?'POINTED_PORTAL_TOPOLOGY_CONSTRUCTED; SIX_VIEW_VISUAL_ACCEPTANCE_PENDING':'PHASE1C_POINTED_PORTAL_TOPOLOGY_NOT_ACCEPTED'});
console.log(JSON.stringify(receipt,null,2));
if(failures.length)process.exitCode=1;
