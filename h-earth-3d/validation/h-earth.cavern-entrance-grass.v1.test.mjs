import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import zlib from 'node:zlib';
import {constructGeologicalRuntimeBridge} from '../../showroom/globe/h-earth/functional-landscape/geological-runtime-bridge.v1.js';
import {buildVegetationVisibleSurface} from '../../showroom/globe/h-earth/render/vegetation-visible-surface.v1.js';
import {buildCavernEntranceGrass,createEntranceFloorSupport,entranceWeight} from '../../showroom/globe/h-earth/render/cavern-entrance-grass.v1.js';
import {unprojectPlanetVertex} from '../terrain/h-earth.geological-formation-successor.v1.mjs';
import {CAVERN_PALM_PLACEMENTS} from '../../showroom/globe/h-earth/render/cavern-palm-placement.v1.js';
const asset=name=>new URL('../../showroom/globe/h-earth/render/assets/'+name,import.meta.url);
const pkg=JSON.parse(zlib.gunzipSync(fs.readFileSync(asset('h-earth-canonical-base-world.v1.json.gz')))).canonical;
const geology=constructGeologicalRuntimeBridge(pkg),visibleSurface=buildVegetationVisibleSurface(pkg,{geology});
const manifest=JSON.parse(fs.readFileSync(asset('precomputed-grass.v1.json'))),raw=zlib.gunzipSync(fs.readFileSync(asset('precomputed-grass.v1.bin.gz'))),view=new DataView(raw.buffer,raw.byteOffset,raw.byteLength);
let first=0;const existingTiles=manifest.tiles.map(t=>{const packed=new Float32Array(t.count*4);for(let i=0;i<t.count;i++){const o=(first+i)*52;packed.set([view.getFloat64(o,true),view.getFloat64(o+8,true),view.getFloat64(o+16,true),view.getFloat64(o+24,true)],i*4);}const out={...t,packed,first};first+=t.count;return out;});
const before=existingTiles.map(t=>Buffer.from(t.packed.buffer).toString('base64'));
const addition=await buildCavernEntranceGrass({existingTiles,visibleSurface,geology,palms:CAVERN_PALM_PLACEMENTS});
test('bounded lush addition preserves every baseline packed root',()=>{
 assert.equal(first,1457471);assert.ok(addition.receipt.contactCount>1000);assert.ok(addition.receipt.contactCount<=30000);assert.ok(first+addition.receipt.contactCount<=1500134);
 assert.deepEqual(existingTiles.map(t=>Buffer.from(t.packed.buffer).toString('base64')),before);
 const counts=new Map(existingTiles.map(t=>[`${t.minX}:${t.minZ}`,t.count]));for(const t of addition.tiles){const k=`${t.minX}:${t.minZ}`;counts.set(k,(counts.get(k)??0)+t.roots.length);}assert.ok([...counts.values()].every(n=>n<=1600));
});
test('interior roots attach only to shallow actual floor triangles, not roof',()=>{
 const floor=createEntranceFloorSupport(geology);let inside=0;
 for(const tile of addition.tiles)for(const r of tile.roots){const q=unprojectPlanetVertex(r.x,r.y,r.z);if(r.support==='CAVERN_ENTRANCE_FLOOR'){inside++;assert.ok(q.z>=-260.01&&q.z<=-258);assert.ok(Math.abs(q.y-geology.formation.floorAt(q.x,q.z))<.4);assert.equal(floor.sample(r.x,r.z).y,r.y);}else assert.equal(visibleSurface.sample(r.x,r.z).y,r.y);}
 assert.ok(inside>20);assert.equal(inside,addition.receipt.interiorCount);
});
test('palm feet and water remain clear, edge tapers have no rectangular wall',()=>{
 const sections=new Set();for(const t of addition.tiles)for(const r of t.roots){const q=unprojectPlanetVertex(r.x,r.y,r.z);sections.add(q.z<-268.5?'APPROACH':q.z<-260?'ENTRANCE':'INTERIOR');}assert.equal(sections.size,3);
 for(const t of addition.tiles)for(const r of t.roots){const q=unprojectPlanetVertex(r.x,r.y,r.z);assert.ok(!CAVERN_PALM_PLACEMENTS.some(p=>Math.hypot(q.x-p.x,q.z-p.z)<p.radius*1.2+.17));const water=geology.sampleWaterAt(q.x,q.z);assert.ok(!water||water.y<=q.y+.041);}
 assert.equal(entranceWeight(28,-280),0);assert.equal(entranceWeight(40,-292),0);assert.equal(entranceWeight(40,-258),0);assert.ok(entranceWeight(40,-264)>.9);
});
if(process.env.CAVERN_GRASS_EVIDENCE)fs.writeFileSync(process.env.CAVERN_GRASS_EVIDENCE,JSON.stringify({...addition.receipt,combinedRootCount:first+addition.receipt.contactCount,combinedPackedBytes:(first+addition.receipt.contactCount)*16},null,2));
