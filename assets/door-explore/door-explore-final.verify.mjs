import fs from 'node:fs';
import assert from 'node:assert/strict';

const root = process.cwd();
const read = p => fs.readFileSync(`${root}/${p}`, 'utf8');
const door = read('door/index.html');
const explore = read('explore/index.html');
const crosswalk = JSON.parse(read('assets/door-explore/crosswalk.v1.json'));

const doorIds = ['products','gauges','frontier','laws','governance','home'];
const exploreIds = ['measurement','identity','laws','products','gauges'];
assert.equal((door.match(/<a\b[^>]*\bdata-card=\"(?:products|gauges|frontier|laws|governance|home)\"[^>]*>/g)||[]).length, 6);
assert.equal((explore.match(/<a\b[^>]*\bdata-card=\"(?:measurement|identity|laws|products|gauges)\"[^>]*>/g)||[]).length, 5);
for (const id of doorIds) assert.ok(door.includes(`data-card=\"${id}\"`), `door:${id}`);
for (const id of exploreIds) assert.ok(explore.includes(`data-card=\"${id}\"`), `explore:${id}`);
for (const src of ['frontier-cycle1.mjs','families-v1.mjs']) assert.ok(door.includes(src), `door module ${src}`);
assert.ok(explore.includes('families-v1.mjs'), 'explore shared family runtime');
for (const page of [door, explore]) {
  assert.ok(page.includes('pointerdown'));
  assert.ok(page.includes('pointermove'));
  assert.ok(page.includes('ArrowLeft') && page.includes('ArrowRight'));
  assert.ok(!/carousel-arrow|prev-button|next-button/i.test(page));
  assert.ok(page.includes('touch-action:pan-y'));
}
assert.equal(crosswalk.status, 'PASS_CLOSED');
assert.deepEqual(crosswalk.progress, {closed:11,total:11,cycleClosed:5,cycleTotal:5});
assert.equal(crosswalk.cards.filter(x=>x.status==='CLOSED').length, 11);
assert.equal(crosswalk.families.filter(x=>x.status==='CLOSED').length, 5);
console.log(JSON.stringify({result:'PASS_CLOSED',cards:11,cycles:5,door:6,explore:5}));
