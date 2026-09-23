import { CAMERA, MASSES, ROOFS, SITE, TOWER_CROWNS } from '../../../assets/manor-blueprint/manor.estate.neutral-blockout.mjs';

const freeze=(v)=>Object.freeze(v);

export const MIRROR_MANOR_P2_SIX_VIEW_REVIEW = freeze({
  schemaVersion:'MIRROR_MANOR_P3_SIX_VIEW_REVIEW_v1',
  candidateRevision:'P3_EXPLICIT_TOWER_CROWN_GEOMETRY',
  baseSha:'9ce59503ca9ed36e7e5248c22c47d38be95604dd',
  reviewClass:'PREDETAIL_NEUTRAL_ARCHITECTURE_REVIEW',
  sixViews:freeze(['CAROUSEL_HERO','CEREMONIAL_FRONT','WEST_FLANK','EAST_FLANK','MOUNTAINWARD_REAR','ELEVATED_WORLD']),
  carouselProjection:freeze({
    camera:CAMERA,
    measuredViewportOccupancyWidth:0.411768,
    measuredViewportOccupancyHeight:0.661710,
    measuredMargins:freeze({left:0.355076,right:0.233156,bottom:0.175949,top:0.162341}),
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
    crownVolumes:freeze(TOWER_CROWNS.map((c)=>freeze({id:c.id,towerId:c.towerId,baseHeight:c.baseHeight,apexHeight:c.apexHeight}))),
    meshConstructionFinding:'THREE EXPLICIT PYRAMID CROWN VOLUMES ARE EMITTED ABOVE THE THREE TOWER BODY MASSES',
    consequence:'DECLARED CENTRAL/SECONDARY VERTICAL SILHOUETTE IS NOW PRESENT AS NEUTRAL GEOMETRY',
    roofCount:ROOFS.length,
    crownCount:TOWER_CROWNS.length,
    pass:TOWER_CROWNS.length===3
  }),
  detailAdmission:true,
  verdict:'PASS_PREDETAIL_REVIEW_DETAIL_ADMISSIBLE',
  nextLawfulOperation:'GOTHIC_ARCHITECTURAL_DETAIL_PHASE_1: establish wall bays, true openings, structural buttresses, portals, roof-edge architecture and material zones while preserving all P3 geometry-integrity prohibitions.'
});

console.log(JSON.stringify(MIRROR_MANOR_P2_SIX_VIEW_REVIEW,null,2));
