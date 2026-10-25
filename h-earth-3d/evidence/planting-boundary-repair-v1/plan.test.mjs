import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL(p,import.meta.url)));
const plan=read('./density-plan.json'),census=read('./combined-census.json');
test('frozen integer plan preserves mass, prefixes, occupied tiles and attributed habitat',()=>{
 const witnesses=new Map(census.domainWitnesses.map(w=>[w.x+':'+w.z,w]));let delta=0;
 for(const t of plan.tiles){assert(Number.isInteger(t.after));assert(t.after>=Math.max(1,t.baselineCount));delta+=t.after-t.before;const w=witnesses.get(t.x+':'+t.z);assert.equal(w.eligible,16);assert(w.minimumContour>=.999);assert(w.expectedDensity>1);}
 assert.equal(delta,0);assert.equal(plan.moved,plan.tiles.reduce((n,t)=>n+Math.max(0,t.before-t.after),0));
 for(const metric of ['totalVariation','maximumJump','squaredVariation'])assert(plan.metrics.after[metric]<=plan.metrics.before[metric]);
});
test('compiled manifest implements the planned quotas and full surrounding-ring metrics',()=>{
 const m=read('../../../showroom/globe/h-earth/render/assets/precomputed-grass.v1.json');const now=new Map(m.tiles.map(t=>[t.minX+':'+t.minZ,t.count])),before=new Map(now);
 for(const t of plan.tiles){assert.equal(now.get(t.x+':'+t.z),t.after);before.set(t.x+':'+t.z,t.before);}
 const centers=[[388,-200],[-392,-200],[-392,-192],[388,-196],[-392,-196],[404,-232],[388,-192],[388,-188]],edges=new Map();
 for(const t of m.tiles)if(centers.some(([x,z])=>Math.max(Math.abs(t.minX-x),Math.abs(t.minZ-z))<=16)){const a=t.minX+':'+t.minZ;for(const [dx,dz]of [[4,0],[-4,0],[0,4],[0,-4]]){const b=(t.minX+dx)+':'+(t.minZ+dz);edges.set([a,b].sort().join('|'),[a,b]);}}
 const metric=map=>{const d=[...edges.values()].map(([a,b])=>Math.abs((map.get(a)||0)-(map.get(b)||0)));return{totalVariation:d.reduce((a,b)=>a+b,0),maximumJump:Math.max(...d),squaredVariation:d.reduce((a,b)=>a+b*b,0)};};assert.deepEqual(metric(before),plan.metrics.before);assert.deepEqual(metric(now),plan.metrics.after);
 for(const [x,z]of centers){const a=x+':'+z,b=(x+(x>0?4:-4))+':'+z;assert(Math.abs(now.get(a)-now.get(b))<=.4*Math.abs(before.get(a)-before.get(b)));}
});
