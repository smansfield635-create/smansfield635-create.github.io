import { CAMERA, SITE } from '../../../assets/manor-blueprint/manor.estate.neutral-blockout.mjs';
import { auditPhase1D } from '../../../assets/manor-blueprint/manor.estate.gothic-detail-phase1d.mjs';
import { auditPhase2, CONTRACT, DORMERS, GLAZED_BAYS, PINNACLES, RULES } from '../../../assets/manor-blueprint/manor.estate.gothic-detail-phase2.mjs';

const p1d=auditPhase1D(),p2=auditPhase2();
const checks=Object.freeze([
  ['CONTRACT_ID',CONTRACT==='MIRROR_MANOR_GOTHIC_ARCHITECTURAL_DETAIL_PHASE2_v1'],
  ['PHASE1D_STATIC',p1d.passStatic===true],
  ['PHASE2_STATIC',p2.passStatic===true],
  ['GLAZING_OWNED',p2.glazingOwned===true&&GLAZED_BAYS.length>0],
  ['DORMER_COUNT',DORMERS.length===2&&DORMERS.length<=RULES.maximumDormers],
  ['DORMERS_COMPLETE',p2.dormersComplete===true],
  ['PINNACLE_LIMIT',PINNACLES.length<=4&&PINNACLES.length<=RULES.maximumPinnacles],
  ['P3_SPAN_PRESERVED',SITE.principalStructuralSpan===27],
  ['CAROUSEL_DISTANCE_PRESERVED',CAMERA.distance===94],
  ['NO_ROOF_STAMPED_WINDOWS',RULES.roofStampedWindows===false],
  ['NO_FLOATING_LINEWORK',RULES.freeLinework===false],
  ['NO_DECORATIVE_CAMOUFLAGE',RULES.decorativeCamouflage===false],
  ['NO_UNOWNED_INTERSECTIONS',RULES.unownedIntersections===false],
  ['NO_UNCONTROLLED_SCULPTURE_WEATHERING',RULES.sculpture===false&&RULES.gargoyles===false&&RULES.weathering===false]
]);
const failures=checks.filter(([,pass])=>!pass).map(([id])=>id);
const receipt=Object.freeze({
  contract:CONTRACT,
  status:failures.length===0?'PASS_PHASE2_CONSTRUCTION_STATIC':'FAIL_PHASE2_CONSTRUCTION_STATIC',
  checks:checks.map(([id,pass])=>Object.freeze({id,pass})),
  failures,
  audit:p2,
  visualReviewPending:true,
  phase3Admission:false,
  claimCeiling:failures.length===0?'CONTROLLED_PHASE2_ENRICHMENT_CONSTRUCTED; SIX_VIEW_VISUAL_ACCEPTANCE_PENDING':'PHASE2_CONSTRUCTION_NOT_ACCEPTED'
});
console.log(JSON.stringify(receipt,null,2));
if(failures.length)process.exitCode=1;
