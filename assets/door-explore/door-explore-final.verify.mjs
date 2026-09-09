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
const laws=read('assets/door-explore/laws-magnet-v2.mjs');
const governance=read('assets/door-explore/governance-gavel-v2.mjs');
const earth=read('assets/door-explore/earth-instrument-v2.mjs');
const products=read('assets/door-explore/products-constellation-v2.mjs');
const frontier=read('assets/door-explore/frontier-cycle1.mjs');
const phase4=read('assets/manor-blueprint/manor.estate.gothic-detail-phase4.mjs');
const productsCss=read('assets/door-explore/products-constellation-v2.css');
const earthCss=read('assets/door-explore/earth-instrument-v2.css');
const lawsCss=read('assets/door-explore/laws-v2.css');
const governanceCss=read('assets/door-explore/governance-v2.css');
const frontierCss=read('assets/door-explore/frontier-cycle1.css');
const crosswalk=JSON.parse(read('assets/door-explore/crosswalk.v1.json'));
const publicationSurface=JSON.parse(read('.github/ai-router/publication-surfaces/door-explore.json'));

assert.ok(door.includes('data-version="DOOR-EXPLORE-ANIMATION-COHERENCE-V1-CYCLE7"'));
assert.ok(explore.includes('data-version="DOOR-EXPLORE-ANIMATION-COHERENCE-V1-CYCLE7"'));
assert.equal((door.match(/\bdata-card="(?:products|gauges|frontier|laws|governance|home)"/g)||[]).length,6);
assert.equal((explore.match(/\bdata-card="(?:measurement|identity|laws|products|gauges)"/g)||[]).length,5);

for(const token of ['data-products-constellation-v2','data-earth-instrument-v2','data-frontier-cycle1','data-laws-magnet-v2','data-governance-gavel-v2','data-home-identity-v2'])assert.ok(door.includes(token),`door:${token}`);
for(const token of ['data-earth-instrument-v2','data-home-identity-v2','data-laws-magnet-v2','data-products-constellation-v2'])assert.ok(explore.includes(token),`explore:${token}`);

const traversalTokens=['pointerdown','pointermove','pointerup','pointercancel','ArrowLeft','ArrowRight','scrollLeft','setPointerCapture','releasePointerCapture','preventDefault','carouselKeyMoved','DOOR_EXPLORE_CAROUSEL_TRAVERSAL_REPAIR_V1'];
for(const [name,page,selector] of [['door',door,'data-door-carousel'],['explore',explore,'data-explore-carousel']]){
  assert.ok(page.includes(selector),`${name}:carousel`);
  for(const token of traversalTokens)assert.ok(page.includes(token),`${name}:traversal:${token}`);
  assert.equal(count(page,"carousel.dataset.spatialCarouselBound='true'"),1,`${name}:single-authority-marker`);
  assert.equal(count(page,"carousel.dataset.carouselAuthority='page-bound-v1'"),1,`${name}:authority-id`);
  assert.ok(page.indexOf("carousel.dataset.spatialCarouselBound='true'")<page.indexOf('home-identity-v2.mjs'),`${name}:authority-before-module-mount`);
  assert.ok(page.includes("Math.abs(dy)>Math.abs(dx)"),`${name}:vertical-intent`);
  assert.ok(page.includes("behavior:reduced?'auto':'smooth'"),`${name}:reduced-motion-traversal`);
}
assert.ok(home.includes("carousel.dataset.spatialCarouselBound==='true'"),'home legacy traversal has single-authority guard');

assert.ok(lifecycle.includes("DOOR_EXPLORE_CARD_LIFECYCLE_V1"));
assert.ok(lifecycle.includes("CARD_LIFECYCLE_ENTER_RATIO=.58"));
assert.ok(lifecycle.includes("CARD_LIFECYCLE_EXIT_RATIO=.42"));
for(const token of ["ACTIVATE","DEACTIVATE","sampleCardLifecycle","createCardClock"])assert.ok(lifecycle.includes(token),`lifecycle:${token}`);
for(const [name,src] of [['home',home],['laws',laws],['governance',governance],['products',products],['frontier',frontier]]){
  assert.ok(src.includes("createCardClock"),`${name}:card-clock-import`);
  assert.ok(src.includes("createCardClock(root)"),`${name}:card-clock-mount`);
  assert.ok(src.includes("clock.sample(now)"),`${name}:activation-local-sample`);
}

assert.ok(home.includes("manor.estate.gothic-detail-phase4.mjs"));
assert.ok(home.includes("auditPhase4()"));
assert.ok(home.includes("if(!audit.passStatic)"));
assert.ok(phase4.includes("MIRROR_MANOR_GOTHIC_ARCHITECTURAL_DETAIL_PHASE4_LIVED_IN_v1"));
assert.ok(phase4.includes("passStatic:p.passStatic&&bounded&&selective&&preserved"));

for(const token of ['BLOCK_TOP_Y=-4.425','SURFACE_TOP_Y=-6.375','inspectGovernancePose','blockPenetration','surfacePenetration','decisionBeforeClearance','recoil'])assert.ok(governance.includes(token),`governance:${token}`);
assert.ok(governance.includes('DOOR_GOVERNANCE_GAVEL_SPATIAL_V2'));

assert.ok(laws.includes('DOOR_EXPLORE_LAWS_MAGNET_SPATIAL_V2'));
assert.ok(laws.includes('LAW_PROJECT_SCALE=1.42'));
assert.ok(laws.includes('inspectLawsFrame'));
assert.ok(laws.includes('fieldRodState'));

assert.ok(products.includes('DOOR_EXPLORE_PRODUCTS_VOLUMETRIC_CONSTELLATION_V2'));
assert.ok(products.includes('PRODUCTS_SPATIAL_CYCLE_MS=11000'));
assert.ok(products.includes('gemCount:GEMS.length'));

assert.ok(frontier.includes('DOOR_FRONTIER_APPLIED_SYSTEMS_CYCLE1_V1'));
assert.ok(frontier.includes("./frontier-cycle1.state.mjs"));
for(const token of ['deriveFrontierCausalVisualState','flowDelivery','energyDelivery','flowEffect','energyEffect','transformedEffect','frontierCausalStage'])assert.ok(frontier.includes(token),`frontier:${token}`);
assert.ok(frontier.includes("state.phase === 'TRANSFORMED'"),'frontier reduced terminal guard');

assert.ok(earth.includes('DOOR_EXPLORE_EARTH_INSTRUMENT_SPATIAL_V2'));
assert.ok(earth.includes('AXIAL_TILT_DEG=23.44'));
assert.ok(earth.includes('DGBEarthLattice256'));
assert.ok(spatial.includes('touch-action:pan-y'));
for(const [name,css] of [['products',productsCss],['earth',earthCss],['laws',lawsCss],['governance',governanceCss],['frontier',frontierCss],['home',spatial]]){
  assert.ok(css.includes('@media(max-width:40rem)'),`${name}:mobile-media`);
  assert.ok(css.includes('min-height:15rem'),`${name}:mobile-stage-floor`);
}

const doorSurface=publicationSurface.checks.find(x=>x.path==='/door/');
const exploreSurface=publicationSurface.checks.find(x=>x.path==='/explore/');
assert.ok(doorSurface&&exploreSurface,'publication page checks');
for(const [name,check] of [['door',doorSurface],['explore',exploreSurface]]){
  for(const token of ['spatialCarouselBound','carouselAuthority','carouselKeyMoved','DOOR_EXPLORE_CAROUSEL_TRAVERSAL_REPAIR_V1'])assert.ok(check.includes.includes(token),`${name}:publication:${token}`);
}
assert.equal(publicationSurface.runtime.enabled,true);
assert.equal(publicationSurface.runtime.path,'/explore/');
assert.equal(publicationSurface.runtime.readySelector,'[data-explore-carousel]');

assert.equal(crosswalk.status,'PASS_CLOSED');
assert.equal(crosswalk.cards.filter(x=>x.status==='CLOSED').length,11);
assert.equal(crosswalk.families.filter(x=>x.status==='CLOSED').length,5);

console.log(JSON.stringify({
  result:'PASS_ANIMATION_COHERENCE_CYCLE7_FROZEN',
  cards:11,
  door:6,
  explore:5,
  lifecycle:'ACTIVATION_LOCAL',
  governance:'CONTACT_BOUNDED',
  laws:'MOBILE_FRAMED',
  homeIdentity:'PHASE4_AUDIT_PRESERVED',
  products:'CLEARANCE_PRESERVED',
  frontier:'CAUSAL_DELIVERY',
  traversal:'SINGLE_PAGE_AUTHORITY'
}));
