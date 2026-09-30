import { auditPhase1, WALL_BAYS, PORTALS } from '../../../assets/manor-blueprint/manor.estate.gothic-detail-phase1.mjs';
import { CAMERA, SITE } from '../../../assets/manor-blueprint/manor.estate.neutral-blockout.mjs';

const freeze=(v)=>Object.freeze(v);
const audit=auditPhase1();

export const MIRROR_MANOR_GOTHIC_PHASE1_SIX_VIEW_REVIEW=freeze({
  schemaVersion:'MIRROR_MANOR_GOTHIC_PHASE1_SIX_VIEW_REVIEW_v1',
  reviewClass:'PHASE1_MULTIVIEW_ARCHITECTURAL_REVIEW',
  views:freeze(['CAROUSEL_HERO','CEREMONIAL_FRONT','WEST_FLANK','EAST_FLANK','MOUNTAINWARD_REAR','ELEVATED_WORLD']),
  preservedAuthority:freeze({principalStructuralSpan:SITE.principalStructuralSpan,carouselDistance:CAMERA.distance,pass:SITE.principalStructuralSpan===27&&CAMERA.distance===94}),
  staticIntegrity:audit.passStatic,
  findings:freeze({
    silhouetteHierarchy:'PASS',
    estateScaleAndNegativeSpace:'PASS',
    buttressOwnership:'PASS',
    roofEdgeOwnership:'PASS',
    openingSpecificationContainment:'PASS',
    visibleOpeningGeometry:'FAIL',
    visibleOpeningGeometryReason:'WALL_BAYS and portal cavity meshes are placed behind intact opaque host-wall faces. Phase 1 does not subtract/cut the host wall or rebuild facade panels around the openings, so the recess cavities are occluded rather than becoming visible architectural openings.',
    architecturalConsequence:'The current wall bays do not yet constitute true windows/recesses, and portal cavities do not yet constitute true door openings. Adding tracery or ornament now would camouflage an unresolved facade-geometry defect.'
  }),
  bayCount:WALL_BAYS.length,
  portalCount:PORTALS.length,
  phase2Admission:false,
  verdict:'FAIL_PHASE1_VISUAL_REVIEW_REQUIRES_TRUE_FACADE_OPENINGS',
  nextLawfulOperation:'PHASE1B_FACADE_CUT_CORRECTION: replace intact host facade faces with panelized wall geometry around declared openings (or equivalent true opening topology), preserve bay containment, buttresses, portals, P3 27-unit span and 94-unit carousel distance, then rerun the same six-view review before Phase 2.'
});

console.log(JSON.stringify(MIRROR_MANOR_GOTHIC_PHASE1_SIX_VIEW_REVIEW,null,2));
