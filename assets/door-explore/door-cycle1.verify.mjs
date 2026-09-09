import fs from 'node:fs';
import assert from 'node:assert/strict';
import {FRONTIER_CYCLE_MS, getFrontierCycleState} from './frontier-cycle1.state.mjs';

const html = fs.readFileSync(new URL('../../door/index.html', import.meta.url), 'utf8');
const renderer = fs.readFileSync(new URL('./frontier-cycle1.mjs', import.meta.url), 'utf8');
const cards = ['products','gauges','frontier','laws','governance','home'];

assert.equal((html.match(/<a class="route-card(?: frontier)?"/g) || []).length, 6, 'exactly six Door cards');
for (const card of cards) assert.equal((html.match(new RegExp(`<a class="route-card(?: frontier)?" data-card="${card}"`, 'g')) || []).length, 1, `one ${card} card`);
assert.ok(html.includes('href="/explore/frontier/"'), 'Frontier route');
assert.ok(html.includes('data-frontier-cycle1'), 'Frontier stage mount');
assert.ok(html.includes('pointerdown') && html.includes('scrollLeft=startLeft-dx'), 'pointer drag/swipe');
assert.ok(html.includes("ArrowLeft") && html.includes("ArrowRight"), 'keyboard traversal');
assert.ok(!/carousel-arrow|prev-button|next-button/i.test(html), 'no carousel arrows');
assert.ok(html.includes('prefers-reduced-motion:reduce'), 'reduced motion CSS');
assert.ok(renderer.includes("from '/showroom/globe/h-earth/render/geometry-kernel.js'"), 'canonical kernel binding');
assert.ok(renderer.includes('admitHEarthPrimitiveRecord'), 'WEST admission');
assert.ok(renderer.includes('Math.min(1.5,window.devicePixelRatio||1)'), 'bounded DPR');
assert.equal(FRONTIER_CYCLE_MS, 12000, 'frozen cycle');
const rm = getFrontierCycleState(0, true);
assert.equal(rm.phase, 'TRANSFORMED');
assert.equal(rm.transformed, 1);
for (let i=0;i<=120;i+=1) {
  const t = i/120*FRONTIER_CYCLE_MS;
  assert.deepEqual(getFrontierCycleState(t,false), getFrontierCycleState(t+FRONTIER_CYCLE_MS,false));
}
console.log(JSON.stringify({result:'PASS_CLOSED',cycle:1,doorCards:6,frontierAnimated:1,arrows:0,pointerDrag:true,touchSwipe:true,keyboard:true,kernelBound:true,cycleMs:FRONTIER_CYCLE_MS,reducedMotion:'TRANSFORMED',crosswalk:'1/11'}));
