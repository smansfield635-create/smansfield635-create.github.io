import { auditBlockout, CAMERA, SITE } from '../../../assets/manor-blueprint/manor.estate.neutral-blockout.mjs';
import { auditPhase1, CONTRACT, RULES } from '../../../assets/manor-blueprint/manor.estate.gothic-detail-phase1.mjs';

const p3=auditBlockout();
const p1=auditPhase1();
const checks=Object.freeze([
  ['P3_PARENT_ACCEPTED',p3.passStatic===true&&p3.crownGeometryComplete===true],
  ['PHASE1_STATIC_AUDIT',p1.passStatic===true],
  ['OPENINGS_CONTAINED',p1.openingContainment===true],
  ['PORTALS_CONTAINED',p1.portalContainment===true],
  ['BUTTRESSES_OWNED',p1.buttressOwnership===true],
  ['ROOF_EDGES_OWNED',p1.roofOwnership===true],
  ['NO_FORBIDDEN_DETAIL',p1.noForbiddenDetail===true],
  ['NO_DUPLICATE_DETAIL_IDS',p1.duplicateIds.length===0],
  ['P2_P3_SITE_SPAN_PRESERVED',SITE.principalStructuralSpan===27],
  ['P2_P3_CAROUSEL_DISTANCE_PRESERVED',CAMERA.distance===94],
  ['DORMERS_REMAIN_HELD',RULES.dormers===false],
  ['TRACERY_REMAINS_HELD',RULES.tracery===false],
  ['SCULPTURE_REMAINS_HELD',RULES.sculpture===false],
  ['ROOF_STAMPED_WINDOWS_PROHIBITED',RULES.roofStampedWindows===false],
  ['FREE_LINEWORK_PROHIBITED',RULES.freeLinework===false]
]);
const failures=checks.filter(([,pass])=>!pass).map(([id])=>id);
const receipt=Object.freeze({
  contract:CONTRACT,
  status:failures.length===0?'PASS_PHASE1_STATIC_INTEGRITY':'FAIL_PHASE1_STATIC_INTEGRITY',
  checks:checks.map(([id,pass])=>Object.freeze({id,pass})),
  failures,
  parent:p3,
  phase1:p1,
  claimCeiling:failures.length===0
    ?'GOTHIC_PHASE1_STRUCTURAL_DETAIL_CONSTRUCTED_AND_STATICALLY_VALID; MULTIVIEW_VISUAL_REVIEW_REQUIRED_BEFORE_PHASE2'
    :'GOTHIC_PHASE1_NOT_ACCEPTED'
});
console.log(JSON.stringify(receipt,null,2));
if(failures.length) process.exitCode=1;
