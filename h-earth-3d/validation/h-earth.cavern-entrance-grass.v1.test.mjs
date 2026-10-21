import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import zlib from 'node:zlib';
import {constructGeologicalRuntimeBridge} from '../../showroom/globe/h-earth/functional-landscape/geological-runtime-bridge.v1.js';
import {buildVegetationVisibleSurface} from '../../showroom/globe/h-earth/render/vegetation-visible-surface.v1.js';
import {buildCavernEntranceGrass,createEntranceFloorSupport,entranceWeight,entranceBlend,ENTRANCE_BLEND_GLSL,createCavernSlopeDensityField,CAVERN_SLOPE_REPAIR} from '../../showroom/globe/h-earth/render/cavern-entrance-grass.v1.js';
import {unprojectPlanetVertex} from '../terrain/h-earth.geological-formation-successor.v1.mjs';
import {CAVERN_PALM_PLACEMENTS} from '../../showroom/globe/h-earth/render/cavern-palm-placement.v1.js';
const asset=name=>new URL('../../showroom/globe/h-earth/render/assets/'+name,import.meta.url);
const pkg=JSON.parse(zlib.gunzipSync(fs.readFileSync(asset('h-earth-canonical-base-world.v1.json.gz')))).canonical;
const geology=constructGeologicalRuntimeBridge(pkg),visibleSurface=buildVegetationVisibleSurface(pkg,{geology});
const manifest=JSON.parse(fs.readFileSync(asset('precomputed-grass.v1.json'))),raw=zlib.gunzipSync(fs.readFileSync(asset('precomputed-grass.v1.bin.gz'))),view=new DataView(raw.buffer,raw.byteOffset,raw.byteLength);
let first=0;const existingTiles=manifest.tiles.map(t=>{const packed=new Float32Array(t.count*4);for(let i=0;i<t.count;i++){const o=(first+i)*52;packed.set([view.getFloat64(o,true),view.getFloat64(o+8,true),view.getFloat64(o+16,true),view.getFloat64(o+24,true)],i*4);}const out={...t,packed,first};first+=t.count;return out;});
const before=existingTiles.map(t=>Buffer.from(t.packed.buffer).toString('base64'));
const addition=await buildCavernEntranceGrass({existingTiles,visibleSurface,geology,palms:CAVERN_PALM_PLACEMENTS});
const prior=await buildCavernEntranceGrass({existingTiles,visibleSurface,geology,palms:CAVERN_PALM_PLACEMENTS,includeSlopeRepair:false});
test('bounded lush addition preserves every baseline packed root',()=>{
 assert.equal(first,1457471);assert.ok(addition.receipt.contactCount>1000);assert.ok(addition.receipt.contactCount<=117697);assert.ok(first+addition.receipt.contactCount<=1575168);
 assert.deepEqual(existingTiles.map(t=>Buffer.from(t.packed.buffer).toString('base64')),before);
 const counts=new Map(existingTiles.map(t=>[`${t.minX}:${t.minZ}`,t.count]));for(const t of addition.tiles){const k=`${t.minX}:${t.minZ}`;counts.set(k,(counts.get(k)??0)+t.roots.length);}assert.ok([...counts.values()].every(n=>n<=1600));
});
test('all prior entrance roots remain exact and both wider slope deficits improve',()=>{
 assert.equal(prior.receipt.contactCount,17697);assert.deepEqual(addition.tiles.slice(0,prior.tiles.length),prior.tiles);
 const bins=tiles=>{const out=new Map();for(const t of existingTiles)for(let i=0;i<t.packed.length;i+=4){const k=`${Math.floor(t.packed[i]/5)*5}:${Math.floor(t.packed[i+2]/5)*5}`;out.set(k,(out.get(k)??0)+1);}for(const t of tiles)for(const r of t.roots){const k=`${Math.floor(r.x/5)*5}:${Math.floor(r.z/5)*5}`;out.set(k,(out.get(k)??0)+1);}return out;};
 const a=bins(prior.tiles),b=bins(addition.tiles),witnesses=[];
 for(const [x,z]of [[15,-280],[20,-280],[25,-280],[50,-270],[55,-270],[60,-270]]){const k=`${x}:${z}`,before=(a.get(k)??0)/25,after=(b.get(k)??0)/25;assert.ok(after>before+4,`${k} remains sparse: ${before} -> ${after}`);witnesses.push({x,z,before,after});}
 const r=addition.receipt.slopeRepair;assert.ok(r.leftAdded>1000&&r.rightAdded>1000);assert.ok(r.addedRoots<=100000);assert.equal(r.addedRoots+r.remainingDeficit,r.targetDeficit);
 console.log('CAVERN_SLOPE_DENSITY_WITNESSES '+JSON.stringify(witnesses));
});
test('continuous slope field softens triangle changes and reaches zero smoothly at survey limits',()=>{
 const field=createCavernSlopeDensityField({densityAt:()=>24,slopeAt:x=>x<40?.2:1.2});
 assert.ok(Math.abs(field.sample(39.99,-280)-field.sample(40.01,-280))<.15);
 for(const [x,z]of [[-10,-280],[88,-280],[40,-330],[40,-235]])assert.equal(field.sample(x,z),0);
 assert.ok(field.sample(-9.99,-280)<.001);assert.ok(field.sample(87.99,-280)<.001);
 assert.ok(field.sample(20,-280)>field.sample(60,-280));
 assert.deepEqual(CAVERN_SLOPE_REPAIR.bounds,[-10,-330,88,-235]);
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

test('supplement breaks alignment along both planting axes',()=>{
 const roots=addition.tiles.flatMap(t=>t.roots).map(r=>unprojectPlanetVertex(r.x,r.y,r.z));
 for(const axis of ['x','z']){
  let c=0,s=0;for(const p of roots){const a=p[axis]/.14*Math.PI*2;c+=Math.cos(a);s+=Math.sin(a);}
  assert.ok(Math.hypot(c,s)/roots.length<.15,`${axis} grid alignment remains`);
 }
});

test('broad shoulder density and height field converges smoothly to meadow',()=>{
 for(const z of [-285,-275,-265])for(const side of [-1,1]){
  let previous=entranceBlend(40+side*7,z);
  for(let d=7.1;d<=29;d+=.1){const value=entranceBlend(40+side*d,z);assert.ok(value<=previous+1e-9);assert.ok(Math.abs(value-previous)<.012);previous=value;}
  assert.equal(entranceBlend(40+side*29,z),0);
  assert.ok(entranceBlend(40+side*14,z)>.4);
 }
 const source=fs.readFileSync(new URL('../../showroom/globe/h-earth/render/vegetation-single-owner.prototype.v1.js',import.meta.url),'utf8');
 assert.ok(source.includes('${ENTRANCE_BLEND_GLSL}'));assert.ok(source.includes('max(core,entranceBlend(aRoot.xz))'));
 assert.ok(source.includes('mix(1.15,1.65,h),mouthBanks'));
 assert.ok(ENTRANCE_BLEND_GLSL.includes('edge+18.'));
});
test('halo reaches both sides without duplicate root contacts',()=>{
 const roots=addition.tiles.flatMap(t=>t.roots),seen=new Set();let left=0,right=0;
 for(const r of roots){const key=`${r.x}:${r.z}`;assert.ok(!seen.has(key));seen.add(key);const q=unprojectPlanetVertex(r.x,r.y,r.z);if(q.x<28)left++;if(q.x>52)right++;}
 assert.ok(left>100&&right>100,JSON.stringify({left,right}));assert.ok(addition.receipt.haloCount>1000);
 assert.ok(addition.receipt.rejected.water>0);assert.ok(addition.receipt.rejected.slope>0);
});
