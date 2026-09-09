import fs from 'node:fs';
import assert from 'node:assert/strict';

const root=process.cwd();
const read=p=>fs.readFileSync(`${root}/${p}`,'utf8');
const count=(text,token)=>text.split(token).length-1;
const door=read('door/index.html');
const explore=read('explore/index.html');
const spatial=read('assets/door-explore/spatial-v2.css');
const lifecycle=read('assets/door-explore/card-lifecycle-v1.mjs');
const home=read('assets/door-explore/home-identity-v2.mjs');
const houseScene=read('assets/compass/compass.house-scene.js');
const laws=read('assets/door-explore/laws-magnet-v2.mjs');
const governance=read('assets/door-explore/governance-gavel-v2.mjs');
const earth=read('assets/door-explore/earth-instrument-v2.mjs');
const products=read('assets/door-explore/products-constellation-v2.mjs');
const frontier=read('assets/door-explore/frontier-cycle1.mjs');
const publication=JSON.parse(read('.github/ai-router/publication-surfaces/door-explore.json'));
const crosswalk=JSON.parse(read('assets/door-explore/crosswalk.v1.json'));

for(const page of [door,explore])assert.ok(page.includes('data-version="DOOR-EXPLORE-ANIMATION-COHERENCE-V1-CYCLE7"'));
assert.equal((door.match(/\bdata-card=/g)||[]).length,6);
assert.equal((explore.match(/\bdata-card=/g)||[]).length,5);

for(const [name,page,moduleToken] of [['door',door,'data-door-carousel'],['explore',explore,'data-explore-carousel']]){
  assert.ok(page.includes(moduleToken),`${name}:carousel`);
  for(const token of ['pointerdown','pointermove','pointerup','pointercancel','ArrowLeft','ArrowRight','scrollLeft','carouselKeyMoved','DOOR_EXPLORE_CAROUSEL_TRAVERSAL_REPAIR_V1'])assert.ok(page.includes(token),`${name}:${token}`);
  assert.equal(count(page,"carousel.dataset.spatialCarouselBound='true'"),1,`${name}:single-traversal-marker`);
  assert.equal(count(page,"carousel.dataset.carouselAuthority='page-bound-v1'"),1,`${name}:single-authority-id`);
  assert.ok(page.indexOf("carousel.dataset.spatialCarouselBound='true'")<page.indexOf('home-identity-v2.mjs'),`${name}:authority-precedes-module`);
}
assert.ok(home.includes("carousel.dataset.spatialCarouselBound==='true'"));

for(const token of ['DOOR_EXPLORE_CARD_LIFECYCLE_V1','CARD_LIFECYCLE_ENTER_RATIO=.58','CARD_LIFECYCLE_EXIT_RATIO=.42','ACTIVATE','DEACTIVATE','sampleCardLifecycle','createCardClock'])assert.ok(lifecycle.includes(token),`lifecycle:${token}`);
for(const [name,src] of [['home',home],['laws',laws],['governance',governance],['products',products],['frontier',frontier]]){
  assert.ok(src.includes('createCardClock'),`${name}:clock-import`);
  assert.ok(src.includes('createCardClock(root)'),`${name}:clock-mount`);
  assert.ok(src.includes('clock.sample(now)'),`${name}:clock-sample`);
}

for(const token of ['assets/compass/compass.house-scene.js','mirror-manor-gothic-phase3-carousel-v6-material-detail-final','MIRROR_MANOR_GOTHIC_ARCHITECTURAL_DETAIL_PHASE3_v1','loadMatureHouseScene'])assert.ok(home.includes(token),`home-mature:${token}`);
assert.ok(!home.includes('buildNeutralMesh'), 'home:no-neutral-blockout-renderer');
for(const token of ['mirror-manor-gothic-phase3-carousel-v6-material-detail-final','MIRROR_MANOR_GOTHIC_ARCHITECTURAL_DETAIL_PHASE3_v1','canonical-phase3-principal-estate-mesh','true-facade-openings','procedural-slate-shingle-courses','engraved-stone-court'])assert.ok(houseScene.includes(token),`house-scene:${token}`);

for(const token of ['DOOR_GOVERNANCE_GAVEL_SPATIAL_V2','BLOCK_TOP_Y=-4.425','SURFACE_TOP_Y=-6.375','inspectGovernancePose','blockPenetration','surfacePenetration','decisionBeforeClearance','recoil'])assert.ok(governance.includes(token),`governance:${token}`);
for(const token of ['DOOR_EXPLORE_LAWS_MAGNET_SPATIAL_V2','LAW_PROJECT_SCALE = 1.42','inspectLawsFrame','fieldRodState'])assert.ok(laws.includes(token),`laws:${token}`);
for(const token of ['DOOR_EXPLORE_PRODUCTS_VOLUMETRIC_CONSTELLATION_V2','PRODUCTS_SPATIAL_CYCLE_MS=11000','gemCount:GEMS.length'])assert.ok(products.includes(token),`products:${token}`);
for(const token of ['DOOR_FRONTIER_APPLIED_SYSTEMS_CYCLE1_V1','./frontier-cycle1.state.mjs','deriveFrontierCausalVisualState','flowDelivery','energyDelivery','flowEffect','energyEffect','transformedEffect','frontierCausalStage',"state.phase === 'TRANSFORMED'"])assert.ok(frontier.includes(token),`frontier:${token}`);
for(const token of ['DOOR_EXPLORE_EARTH_INSTRUMENT_SPATIAL_V2','AXIAL_TILT_DEG=23.44','DGBEarthLattice256'])assert.ok(earth.includes(token),`earth:${token}`);

assert.ok(spatial.includes('touch-action:pan-y'));
for(const cssPath of ['assets/door-explore/products-constellation-v2.css','assets/door-explore/earth-instrument-v2.css','assets/door-explore/laws-v2.css','assets/door-explore/governance-v2.css','assets/door-explore/frontier-cycle1.css','assets/door-explore/spatial-v2.css']){
  const css=read(cssPath);
  assert.ok(css.includes('@media(max-width:40rem)'),`${cssPath}:mobile-media`);
  assert.ok(css.includes('min-height:15rem'),`${cssPath}:mobile-stage-floor`);
}

const doorSurface=publication.checks.find(x=>x.path==='/door/');
const exploreSurface=publication.checks.find(x=>x.path==='/explore/');
const matureHouseSurface=publication.checks.find(x=>x.path==='/assets/compass/compass.house-scene.js');
assert.ok(doorSurface&&exploreSurface&&matureHouseSurface);
for(const check of [doorSurface,exploreSurface])for(const token of ['spatialCarouselBound','carouselAuthority','carouselKeyMoved','DOOR_EXPLORE_CAROUSEL_TRAVERSAL_REPAIR_V1'])assert.ok(check.includes.includes(token),`publication:${token}`);
for(const token of ['mirror-manor-gothic-phase3-carousel-v6-material-detail-final','canonical-phase3-principal-estate-mesh'])assert.ok(matureHouseSurface.includes.includes(token),`publication-mature-house:${token}`);
assert.equal(publication.runtime.enabled,true);
assert.equal(publication.runtime.path,'/explore/');
assert.equal(publication.runtime.readySelector,'[data-explore-carousel]');
assert.equal(crosswalk.status,'PASS_CLOSED');
assert.equal(crosswalk.cards.filter(x=>x.status==='CLOSED').length,11);

console.log(JSON.stringify({result:'PASS_ANIMATION_COHERENCE_CYCLE7_MATURE_MANOR_BINDING',cards:11,door:6,explore:5,lifecycle:'ACTIVATION_LOCAL',governance:'CONTACT_BOUNDED',laws:'MOBILE_FRAMED',homeIdentity:'MATURE_COMPASS_MANOR_PHASE3',products:'CLEARANCE_PRESERVED',frontier:'CAUSAL_DELIVERY',traversal:'SINGLE_PAGE_AUTHORITY'}));
