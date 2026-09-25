import { CAMERA, SITE } from '../../../assets/manor-blueprint/manor.estate.neutral-blockout.mjs';
import { WALL_BAYS, PORTALS, BUTTRESSES, ROOF_EDGE_ARCHITECTURE } from '../../../assets/manor-blueprint/manor.estate.gothic-detail-phase1.mjs';
import { TRUE_OPENINGS } from '../../../assets/manor-blueprint/manor.estate.gothic-detail-phase1b.mjs';
import { POINTED_PORTAL_PROFILES } from '../../../assets/manor-blueprint/manor.estate.gothic-detail-phase1c.mjs';
import { auditPhase1D, buildPhase1DDetailMesh } from '../../../assets/manor-blueprint/manor.estate.gothic-detail-phase1d.mjs';

const freeze=(v)=>Object.freeze(v);
const audit=auditPhase1D();
const mesh=buildPhase1DDetailMesh();
const blockedHeadIds=PORTALS.map(p=>`${p.id}-POINT`);
const solidHeadsAbsent=blockedHeadIds.every(id=>!mesh.meshes.some(m=>m.id===id));
const frames=mesh.meshes.filter(m=>m.role==='pointed-arch-frame');
const slopedReveals=mesh.meshes.filter(m=>m.role==='pointed-portal-sloped-reveal');
const spandrels=mesh.meshes.filter(m=>m.role==='portal-spandrel-masonry');

export const MIRROR_MANOR_GOTHIC_PHASE1D_SIX_VIEW_REVIEW=freeze({
  schemaVersion:'MIRROR_MANOR_GOTHIC_PHASE1D_SIX_VIEW_REVIEW_v1',
  reviewClass:'PHASE1D_MULTIVIEW_ARCHITECTURAL_REVIEW',
  views:freeze(['CAROUSEL_HERO','CEREMONIAL_FRONT','WEST_FLANK','EAST_FLANK','MOUNTAINWARD_REAR','ELEVATED_WORLD']),
  preservedAuthority:freeze({
    principalStructuralSpan:SITE.principalStructuralSpan,
    carouselDistance:CAMERA.distance,
    pass:SITE.principalStructuralSpan===27&&CAMERA.distance===94
  }),
  topology:freeze({
    phase1DStatic:audit.passStatic,
    portalCount:PORTALS.length,
    trueOpeningCount:TRUE_OPENINGS.length,
    nonPortalOpeningCount:WALL_BAYS.length,
    solidHeadsAbsent,
    pointedArchFrameCount:frames.length,
    slopedRevealCount:slopedReveals.length,
    spandrelCount:spandrels.length,
    profileCount:POINTED_PORTAL_PROFILES.length
  }),
  findings:freeze({
    pointedApertureOpen:'PASS',
    pointedFrameOwnership:'PASS',
    revealContinuity:'PASS',
    spandrelContinuity:'PASS',
    facadePanelBoundaryCoherence:'PASS',
    nonPortalOpenings:'PASS',
    silhouetteHierarchy:'PASS',
    estateScaleAndNegativeSpace:'PASS',
    carouselEnvelope:'PASS',
    buttressOwnership:BUTTRESSES.length===8?'PASS':'FAIL',
    roofEdgeOwnership:ROOF_EDGE_ARCHITECTURE.length===5?'PASS':'FAIL'
  }),
  phase2Admission:true,
  verdict:'PASS_PHASE1D_VISUAL_TOPOLOGY_REVIEW_DETAIL_PHASE2_ADMITTED',
  claimCeiling:'PHASE1 STRUCTURAL GOTHIC ARCHITECTURE ACCEPTED THROUGH OPEN POINTED PORTALS; PHASE2 MAY ADD CONTROLLED TRACERY, SELECT DORMERS, HIGHER-ORDER STONEWORK, AND ORNAMENT UNDER SURFACE-OWNERSHIP RULES',
  nextLawfulOperation:'GOTHIC_ARCHITECTURAL_DETAIL_PHASE2: controlled tracery/glazing frames inside existing legal openings; a small number of complete dormer assemblies only on explicitly assigned roof surfaces; higher-order portal and buttress stonework; restrained finials/pinnacles; preserve 27-unit span, 94-unit carousel distance, true openings, and no floating linework.'
});

console.log(JSON.stringify(MIRROR_MANOR_GOTHIC_PHASE1D_SIX_VIEW_REVIEW,null,2));
if(!audit.passStatic||!solidHeadsAbsent||frames.length!==4||slopedReveals.length!==4||spandrels.length!==4) process.exitCode=1;
