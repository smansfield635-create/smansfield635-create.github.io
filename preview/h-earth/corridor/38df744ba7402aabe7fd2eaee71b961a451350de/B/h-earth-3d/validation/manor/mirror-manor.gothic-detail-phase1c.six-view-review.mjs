import { CAMERA, SITE } from '../../../assets/manor-blueprint/manor.estate.neutral-blockout.mjs';
import { PORTALS } from '../../../assets/manor-blueprint/manor.estate.gothic-detail-phase1.mjs';
import { TRUE_OPENINGS } from '../../../assets/manor-blueprint/manor.estate.gothic-detail-phase1b.mjs';
import { auditPhase1C, POINTED_PORTAL_PROFILES } from '../../../assets/manor-blueprint/manor.estate.gothic-detail-phase1c.mjs';

const freeze=(v)=>Object.freeze(v);
const audit=auditPhase1C();

export const MIRROR_MANOR_GOTHIC_PHASE1C_SIX_VIEW_REVIEW=freeze({
  schemaVersion:'MIRROR_MANOR_GOTHIC_PHASE1C_SIX_VIEW_REVIEW_v1',
  reviewClass:'PHASE1C_MULTIVIEW_POINTED_PORTAL_REVIEW',
  views:freeze(['CAROUSEL_HERO','CEREMONIAL_FRONT','WEST_FLANK','EAST_FLANK','MOUNTAINWARD_REAR','ELEVATED_WORLD']),
  preservedAuthority:freeze({
    principalStructuralSpan:SITE.principalStructuralSpan,
    carouselDistance:CAMERA.distance,
    pass:SITE.principalStructuralSpan===27&&CAMERA.distance===94
  }),
  staticIntegrity:audit.passStatic,
  findings:freeze({
    portalProfileGeometry:'PASS',
    upperSpandrelMasonry:'PASS',
    slopedPointedReveals:'PASS',
    nonPortalOpenings:'PASS',
    estateSilhouette:'PASS',
    carouselEnvelope:'PASS',
    pointedPortalAperture:'FAIL',
    pointedPortalApertureReason:'The inherited Phase 1 portal POINT mesh is a solid triangular stone prism spanning the entire pointed head. Phase 1C correctly restores the spandrels and sloped reveals, but that earlier solid head remains in buildPhase1BDetailMesh()/buildPhase1DetailMesh() and fills the pointed aperture rather than framing it as an open Gothic arch.',
    architecturalConsequence:'Both portals now have correct surrounding masonry topology but still do not possess a genuinely open pointed-head aperture. Admitting tracery or ornament would decorate a blocked doorway/window head rather than a valid Gothic opening.'
  }),
  portalCount:PORTALS.length,
  pointedProfileCount:POINTED_PORTAL_PROFILES.length,
  trueOpeningCount:TRUE_OPENINGS.length,
  phase2Admission:false,
  verdict:'FAIL_PHASE1C_REVIEW_REQUIRES_OPEN_POINTED_ARCH_HEAD',
  nextLawfulOperation:'PHASE1D_PORTAL_ARCH_FRAME_CORRECTION: suppress/remove the inherited solid portal POINT head in the Gothic consumer and replace it with owned arch-frame/voussoir geometry that follows the two pointed sides while leaving the triangular aperture open; preserve the rectangular jamb opening, Phase 1C spandrels/sloped reveals, P3 27-unit span, 94-unit carousel distance, and all no-ornament prohibitions; then rerun the identical six-view review before Phase 2.'
});

console.log(JSON.stringify(MIRROR_MANOR_GOTHIC_PHASE1C_SIX_VIEW_REVIEW,null,2));
