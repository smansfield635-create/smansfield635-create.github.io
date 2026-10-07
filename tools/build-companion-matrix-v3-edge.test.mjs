import fs from 'node:fs';import assert from 'node:assert/strict';
const m=JSON.parse(fs.readFileSync(new URL('../assets/build/build-matrix.v3.json',import.meta.url)));
const nodes=m.nodes||{},inputs=m.inputNodes||{},states=m.states||{},special=new Set(['RETURN',...Object.keys(inputs),...Object.keys(states)]),bad=[];
const valid=n=>n==null||nodes[n]||special.has(n);
for(const c of m.entry?.choices||[])if(!valid(c.next))bad.push(['ENTRY',c.label,c.next]);
let optionCount=0;for(const [id,n] of Object.entries(nodes))for(const o of n.options||[]){optionCount++;if(!valid(o.next))bad.push([id,o.label,o.next]);if(o.status==='confirmed'&&o.next==null)bad.push([id,o.label,'NO_NEXT']);}
for(const [id,n] of Object.entries(inputs))if(!valid(n.next))bad.push([id,'INPUT',n.next]);
assert.deepEqual(bad,[]);assert.equal(Object.keys(nodes).length,91);assert.equal((m.journeyFixtures||[]).length,12);
for(const x of ['BUS.ACTIVITY','PRO.ACTIVITY','CRE.ACTIVITY','PORT.ACTIVITY','HOSPITALITY','COM.ACTIVITY','SHOP.INTENT','APP.INTENT','SPACE.INTENT','CLARIFY'])assert.ok(nodes[x],x);
console.log(JSON.stringify({schema:'BUILD_MATRIX_V3_EDGE_RECEIPT_v1',result:'PASS',nodes:91,visibleOptions:optionCount,journeyFixtures:12,badEdges:0}));