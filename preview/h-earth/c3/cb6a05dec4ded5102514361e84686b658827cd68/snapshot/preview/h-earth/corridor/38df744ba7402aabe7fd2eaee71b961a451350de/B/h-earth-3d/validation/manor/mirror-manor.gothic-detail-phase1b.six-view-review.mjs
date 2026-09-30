import { auditPhase1B, TRUE_OPENINGS, FACADE_REPLACEMENTS } from '../../../assets/manor-blueprint/manor.estate.gothic-detail-phase1b.mjs';
import { PORTALS } from '../../../assets/manor-blueprint/manor.estate.gothic-detail-phase1.mjs';
import { CAMERA, SITE } from '../../../assets/manor-blueprint/manor.estate.neutral-blockout.mjs';

const freeze=(v)=>Object.freeze(v);
const audit=auditPhase1B();
const portalCuts=TRUE_OPENINGS.filter((o)=>o.kind==='portal');
const rectangularPortalCuts=portalCuts.every((o)=>{
  const p=PORTALS.find((x)=>x.id===o.id);
  return !!p && o.y1===p.springHeight+p.pointRise && o.x0===p.centerX-p.width/2 && o.x1===p.centerX+p.width/2;
});

export const MIRROR_MANOR_GOTHIC_PHASE1B_SIX_VIEW_REVIEW=freeze({
  schemaVersion:'MIRROR_MANOR_GOTHIC_PHASE1B_SIX_VIEW_REVIEW_v1',
  reviewClass:'PHASE1B_MULTIVIEW_TOPOLOGY_REVIEW',
  views:freeze(['CAROUSEL_HERO','CEREMONIAL_FRONT','WEST_FLANK','EAST_FLANK','MOUNTAINWARD_REAR','ELEVATED_WORLD']),
  preservedAuthority:freeze({
    principalStructuralSpan:SITE.principalStructuralSpan,
    carouselDistance:CAMERA.distance,
    pass:SITE.principalStructuralSpan===27&&CAMERA.distance===94
  }),
  staticIntegrity:audit.passStatic,
  findings:freeze({
    trueFacadeOpenings:'PASS',
    affectedFacadeOwnership:FACADE_REPLACEMENTS.length===5?'PASS':'FAIL',
    wallBayTopology:'PASS',
    silhouetteAndCarouselAuthority:'PASS',
    portalOpeningTopology:rectangularPortalCuts?'FAIL':'PASS',
    portalOpeningTopologyReason:'Phase 1B represents each portal opening as one rectangular x/y exclusion from ground to pointed apex. Panelization therefore removes the upper spandrel corner masonry that should remain outside a pointed arch. The existing triangular portal-head mesh cannot repair missing host-wall topology.',
    architecturalConsequence:'The principal and gatehouse entrances are not yet genuine pointed Gothic openings. Phase 2 tracery or ornament would decorate an incorrect opening silhouette.'
  }),
  openingCount:audit.openingCount,
  portalCount:portalCuts.length,
  phase2Admission:false,
  verdict:'FAIL_PHASE1B_REVIEW_REQUIRES_POINTED_PORTAL_CUTS',
  nextLawfulOperation:'PHASE1C_POINTED_PORTAL_TOPOLOGY_CORRECTION: panelize portal spring zones separately from pointed-head zones, retain masonry in both upper spandrel corners, build sloped/pointed reveal surfaces owned by each portal, preserve all 23 rectangular wall bays, buttresses, roof edges, P3 27-unit span and 94-unit carousel distance, then rerun the same six-view review before Phase 2.'
});

console.log(JSON.stringify(MIRROR_MANOR_GOTHIC_PHASE1B_SIX_VIEW_REVIEW,null,2));
