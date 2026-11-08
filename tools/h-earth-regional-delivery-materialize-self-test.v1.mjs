#!/usr/bin/env node
import assert from 'node:assert/strict';
import {groupSourceTiles,buildRegionBuffers,reconstructSourceRootBytes} from './h-earth-regional-delivery-materialize.v1.mjs';

const tiles=[
 {id:'-35:-49',minX:-140,minZ:-196,count:2,baselineCount:1},
 {id:'10:-75',minX:40,minZ:-300,count:1,baselineCount:1},
 {id:'-34:-49',minX:-136,minZ:-196,count:2,baselineCount:2},
 {id:'-35:-48',minX:-140,minZ:-192,count:1,baselineCount:0}
];
const layout=groupSourceTiles(tiles);
assert.equal(layout.sourceRoots,6);
assert.equal(layout.sourceTiles,4);
assert.equal(layout.regions.length,2);
assert.deepEqual(layout.regions.map(x=>x.id),['-5:-7','1:-10']);
const bytes=Buffer.alloc(6*52);
for(let i=0;i<bytes.length;i++)bytes[i]=(i*131+23)&255;
const packets=buildRegionBuffers(bytes,layout);
assert.equal(packets.length,2);
assert.equal(packets.reduce((n,x)=>n+x.region.roots,0),6);
assert.deepEqual(reconstructSourceRootBytes(packets,6),bytes);
assert.deepEqual(packets.find(x=>x.region.id==='-5:-7').region.tiles.map(x=>x.sourceFirstRoot),[0,3,5]);
assert.throws(()=>groupSourceTiles([...tiles,tiles[0]]),/TILE_ID_DUPLICATE/);
assert.throws(()=>groupSourceTiles([{...tiles[0],count:0}]),/TILE_COUNT_INVALID/);
const badPackets=packets.map(p=>({...p,region:{...p.region,tiles:p.region.tiles.map(t=>({...t}))}}));
badPackets[0].region.tiles[1].tileIndex=badPackets[0].region.tiles[0].tileIndex;
assert.throws(()=>reconstructSourceRootBytes(badPackets,6),/DUPLICATE_SOURCE_TILE/);
const mutated=packets.map(p=>({...p,compressed:Buffer.from(p.compressed)}));
mutated[0].compressed[5]^=1;
assert.throws(()=>reconstructSourceRootBytes(mutated,6));
console.log(JSON.stringify({schema:'H_EARTH_REGIONAL_MATERIALIZER_SELF_TEST_v1',result:'PASS',tiles:tiles.length,roots:6,regions:2,originalOrderReconstructed:true,duplicateRejected:true,corruptionRejected:true}));
