import fs from 'node:fs';
import assert from 'node:assert/strict';

const root=process.cwd();
const read=p=>fs.readFileSync(`${root}/${p}`,'utf8');
const door=read('door/index.html');
const explore=read('explore/index.html');
const spatial=read('assets/door-explore/spatial-v2.css');
const home=read('assets/door-explore/home-identity-v2.mjs');
const laws=read('assets/door-explore/laws-magnet-v2.mjs');
const governance=read('assets/door-explore/governance-gavel-v2.mjs');
const earth=read('assets/door-explore/earth-instrument-v2.mjs');
const products=read('assets/door-explore/products-constellation-v2.mjs');
const frontier=read('assets/door-explore/frontier-cycle1.mjs');
const crosswalk=JSON.parse(read('assets/door-explore/crosswalk.v1.json'));
const publicationSurface=JSON.parse(read('.github/ai-router/publication-surfaces/door-explore.json'));

const doorIds=['products','gauges','frontier','laws','governance','home'];
const exploreIds=['measurement','identity','laws','products','gauges'];
assert.equal((door.match(/\bdata-card="(?:products|gauges|frontier|laws|governance|home)"/g)||[]).length,6);
assert.equal((explore.match(/\bdata-card="(?:measurement|identity|laws|products|gauges)"/g)||[]).length,5);
for(const id of doorIds)assert.ok(door.includes(`data-card="${id}"`),`door:${id}`);
for(const id of exploreIds)assert.ok(explore.includes(`data-card="${id}"`),`explore:${id}`);

for(const token of ['data-products-constellation-v2','data-earth-instrument-v2','data-frontier-cycle1','data-laws-magnet-v2','data-governance-gavel-v2','data-home-identity-v2'])assert.ok(door.includes(token),`door spatial ${token}`);
for(const token of ['data-earth-instrument-v2','data-home-identity-v2','data-laws-magnet-v2','data-products-constellation-v2'])assert.ok(explore.includes(token),`explore spatial ${token}`);
for(const legacy of ['families-v1.mjs','families-v1.css','data-products-cycle2','data-instrument-cycle3','data-laws-cycle4','data-identity-cycle5']){assert.ok(!door.includes(legacy),`door legacy ${legacy}`);assert.ok(!explore.includes(legacy),`explore legacy ${legacy}`);}

assert.ok(home.includes('DOOR_EXPLORE_HOME_IDENTITY_SPATIAL_V2'));
assert.ok(laws.includes('DOOR_EXPLORE_LAWS_MAGNET_SPATIAL_V2'));
assert.ok(governance.includes('DOOR_GOVERNANCE_GAVEL_SPATIAL_V2'));
assert.ok(earth.includes('DOOR_EXPLORE_EARTH_INSTRUMENT_SPATIAL_V2'));
assert.ok(products.includes('DOOR_EXPLORE_PRODUCTS_VOLUMETRIC_CONSTELLATION_V2'));
assert.ok(frontier.includes('DOOR_FRONTIER_APPLIED_SYSTEMS_CYCLE1_V1'));
for(const src of [home,laws,governance,earth,products])assert.ok(src.includes('prefers-reduced-motion'));
assert.ok(spatial.includes('touch-action:pan-y'));
assert.ok(!/carousel-arrow|prev-button|next-button/i.test(door+explore));

const traversalTokens=['pointerdown','pointermove','pointerup','pointercancel','ArrowLeft','ArrowRight','scrollLeft','setPointerCapture','releasePointerCapture','preventDefault','DOOR_EXPLORE_CAROUSEL_TRAVERSAL_REPAIR_V1'];
for(const [name,page,selector] of [['door',door,'data-door-carousel'],['explore',explore,'data-explore-carousel']]){
  assert.ok(page.includes(selector),`${name} carousel selector`);
  for(const token of traversalTokens)assert.ok(page.includes(token),`${name} traversal ${token}`);
  assert.ok(page.includes("Math.abs(dy)>Math.abs(dx)"),`${name} vertical intent arbitration`);
  assert.ok(page.includes("behavior:reduced?'auto':'smooth'"),`${name} reduced motion traversal`);
  assert.ok(page.includes("if(moved){e.preventDefault();e.stopPropagation()"),`${name} click-after-drag suppression`);
}

const doorSurface=publicationSurface.checks.find(x=>x.path==='/door/');
const exploreSurface=publicationSurface.checks.find(x=>x.path==='/explore/');
assert.ok(doorSurface&&exploreSurface,'publication page checks');
for(const [name,check,selector] of [['door',doorSurface,'data-door-carousel'],['explore',exploreSurface,'data-explore-carousel']]){
  for(const token of [selector,'pointerdown','pointermove','pointerup','pointercancel','ArrowLeft','ArrowRight','scrollLeft','DOOR_EXPLORE_CAROUSEL_TRAVERSAL_REPAIR_V1'])assert.ok(check.includes.includes(token),`${name} publication traversal ${token}`);
}

assert.equal(crosswalk.status,'PASS_CLOSED');
assert.deepEqual(crosswalk.progress,{closed:11,total:11,cycleClosed:5,cycleTotal:5});
assert.equal(crosswalk.cards.filter(x=>x.status==='CLOSED').length,11);
assert.equal(crosswalk.families.filter(x=>x.status==='CLOSED').length,5);
console.log(JSON.stringify({result:'PASS_SPATIAL_CLOSED_WITH_CAROUSEL_TRAVERSAL',cards:11,cycles:5,door:6,explore:5,traversal:'PAGE_BOUND'}));
