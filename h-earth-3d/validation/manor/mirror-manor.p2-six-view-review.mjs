import { CAMERA, MASSES, ROOFS, SITE } from '../../../assets/manor-blueprint/manor.estate.neutral-blockout.mjs';

const freeze=(v)=>Object.freeze(v);

export const MIRROR_MANOR_P2_SIX_VIEW_REVIEW = freeze({
  schemaVersion:'MIRROR_MANOR_P2_SIX_VIEW_REVIEW_v1',
  candidateRevision:'P2_SITE_CAPACITY_AND_CAROUSEL_DISTANCE',
  baseSha:'9ce59503ca9ed36e7e5248c22c47d38be95604dd',
  reviewClass:'PREDETAIL_NEUTRAL_ARCHITECTURE_REVIEW',
  sixViews:freeze(['CAROUSEL_HERO','CEREMONIAL_FRONT','WEST_FLANK','EAST_FLANK','MOUNTAINWARD_REAR','ELEVATED_WORLD']),
  carouselProjection:freeze({
    camera:CAMERA,
    measuredViewportOccupancyWidth:0.490207,
    measuredViewportOccupancyHeight:0.624458,
    measuredMargins:freeze({left:0.327468,right:0.182325,bottom:0.114220,top:0.261323}),
    occupancyBandPass:true,
    sideMarginPass:true,
    headroomPass:true,
    verdict:'PASS'
  }),
  siteCapacity:freeze({
    principalStructuralSpan:SITE.principalStructuralSpan,
    principalStructuralDepth:SITE.principalStructuralDepth,
    testedEnvelopeMaximum:SITE.testedEnvelopeMaximum,
    pass:SITE.principalStructuralSpan<=SITE.testedEnvelopeMaximum[0]&&SITE.principalStructuralDepth<=SITE.testedEnvelopeMaximum[1]
  }),
  geometryInspection:freeze({
    declaredTowerTops:freeze(MASSES.filter((m)=>m.type==='tower').map((m)=>freeze({id:m.id,height:m.height,declaredTop:m.top}))),
    meshConstructionFinding:'ALL_MASSES_ARE_SENT_THROUGH_BUILD_BOX; TOWER_TOP_FIELDS_DO_NOT_CREATE_CROWN_GEOMETRY',
    consequence:'THE APPROVED CENTRAL/SECONDARY VERTICAL SILHOUETTE IS NOT ACTUALLY PRESENT IN THE NEUTRAL MESH',
    roofCount:ROOFS.length,
    pass:false
  }),
  detailAdmission:false,
  verdict:'FAIL_FOR_DETAIL_REQUIRES_P3_TOWER_CROWN_GEOMETRY',
  nextLawfulOperation:'P3_NEUTRAL_MASSING_CORRECTION: construct explicit tower crown/roof volumes, preserve P2 27-unit site span and carousel framing, then rerun six-view review before admitting windows/trim/materials/ornament.'
});

console.log(JSON.stringify(MIRROR_MANOR_P2_SIX_VIEW_REVIEW,null,2));
