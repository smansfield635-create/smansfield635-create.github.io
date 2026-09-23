import { auditBlockout, CAMERA, SITE } from '../../../assets/manor-blueprint/manor.estate.neutral-blockout.mjs';
import { auditPhase1 } from '../../../assets/manor-blueprint/manor.estate.gothic-detail-phase1.mjs';
import { auditPhase1B } from '../../../assets/manor-blueprint/manor.estate.gothic-detail-phase1b.mjs';
import { auditPhase1C } from '../../../assets/manor-blueprint/manor.estate.gothic-detail-phase1c.mjs';
import { auditPhase1D, CONTRACT } from '../../../assets/manor-blueprint/manor.estate.gothic-detail-phase1d.mjs';
const p3=auditBlockout(),p1=auditPhase1(),p1b=auditPhase1B(),p1c=auditPhase1C(),p1d=auditPhase1D();
const checks=Object.freeze([
['CONTRACT_ID',CONTRACT==='MIRROR_MANOR_GOTHIC_ARCHITECTURAL_DETAIL_PHASE1D_v1'],
['P3_STATIC',p3.passStatic===true],['PHASE1_STATIC',p1.passStatic===true],['PHASE1B_STATIC',p1b.passStatic===true],['PHASE1C_STATIC',p1c.passStatic===true],['PHASE1D_STATIC',p1d.passStatic===true],
['SOLID_POINT_HEADS_ABSENT',p1d.solidHeadsAbsent===true],['ARCH_FRAME_COMPLETE',p1d.frameComplete===true&&p1d.archFrameMeshCount===4],['APERTURE_OPEN',p1d.apertureOpen===true],['SPAN_PRESERVED',SITE.principalStructuralSpan===27],['CAMERA_DISTANCE_PRESERVED',CAMERA.distance===94],['NO_FORBIDDEN_DETAIL',p1d.noForbiddenDetail===true]
]);
const failures=checks.filter(([,pass])=>!pass).map(([id])=>id);const receipt=Object.freeze({contract:CONTRACT,status:failures.length===0?'PASS_PHASE1D_PORTAL_ARCH_FRAME_STATIC':'FAIL_PHASE1D_PORTAL_ARCH_FRAME_STATIC',checks:checks.map(([id,pass])=>Object.freeze({id,pass})),failures,audit:p1d,visualReviewPending:true,phase2Admission:false,claimCeiling:failures.length===0?'OPEN_POINTED_ARCH_APERTURE_CONSTRUCTED; SIX_VIEW_VISUAL_ACCEPTANCE_PENDING':'PHASE1D_NOT_ACCEPTED'});console.log(JSON.stringify(receipt,null,2));if(failures.length)process.exitCode=1;
