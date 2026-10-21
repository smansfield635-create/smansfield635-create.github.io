import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import zlib from 'node:zlib';
import {buildCavernGrassSoilHabitat} from '../../showroom/globe/h-earth/render/vegetation-single-owner.prototype.v1.js';

const asset=name=>new URL('../../showroom/globe/h-earth/render/assets/'+name,import.meta.url);
const manifest=JSON.parse(fs.readFileSync(asset('precomputed-grass.v1.json')));
const raw=zlib.gunzipSync(fs.readFileSync(asset('precomputed-grass.v1.bin.gz')));
const habitat={...manifest.habitat,pixels:new Uint8Array(raw.subarray(manifest.rootCount*52))};
const {size,width}=habitat,[x0,z0,x1,z1]=habitat.ravine.bounds,dx=(x1-x0)/size,dz=(z1-z0)/size;
const ix=Math.floor((40-x0)/dx),iz=Math.floor((-280-z0)/dz),offset=iz*width+size+ix;
const x=x0+(ix+.5)*dx,z=z0+(iz+.5)*dz;
const roots=Array.from({length:32},(_,i)=>({x:x+(i%8-3.5)*.08,y:2,z:z+(Math.floor(i/8)-1.5)*.08,angle:i}));
const addition={tiles:[{roots}]},base=[{packed:new Float32Array([x,2,z,0])}];

test('actual saved cavern atlas gains measured occupancy without changing roots or other atlas texels',()=>{
 assert.equal(habitat.pixels[offset],0,'baseline cavern texel lacks soil coverage');
 const oldPixels=new Uint8Array(habitat.pixels),oldRoots=JSON.stringify(addition),oldPacked=new Float32Array(base[0].packed);
 const result=buildCavernGrassSoilHabitat(habitat,base,addition,{eligibleAt:()=>true});
 const expected=Math.round(255*33/(habitat.receipt.grassContinuity.reference.density*dx*dz));
 assert.equal(result.pixels[offset],expected);assert.ok(expected>0&&expected<255);
 for(let i=0;i<oldPixels.length;i++)if(i!==offset)assert.equal(result.pixels[i],oldPixels[i]);
 assert.deepEqual(habitat.pixels,oldPixels);assert.equal(JSON.stringify(addition),oldRoots);assert.deepEqual(base[0].packed,oldPacked);
 assert.deepEqual(result.ravine.bounds,habitat.ravine.bounds);assert.equal(result.width,width);assert.equal(result.height,size);
 assert.equal(result.receipt.cavernGrassSoil.additionRoots,32);assert.equal(result.receipt.cavernGrassSoil.raisedTexels,1);
});
test('wet or unsupported texels cannot gain coverage and existing coverage never decreases',()=>{
 const rejected=buildCavernGrassSoilHabitat(habitat,base,addition,{eligibleAt:()=>false});
 assert.deepEqual(rejected.pixels,habitat.pixels);assert.equal(rejected.receipt.cavernGrassSoil.rejectedTexels,1);
 const bright={...habitat,pixels:new Uint8Array(habitat.pixels)};bright.pixels[offset]=255;
 assert.equal(buildCavernGrassSoilHabitat(bright,base,addition,{eligibleAt:()=>true}).pixels[offset],255);
});
test('empty addition leaves exact atlas and populated cells saturate rather than wrap',()=>{
 assert.deepEqual(buildCavernGrassSoilHabitat(habitat,base,{tiles:[]},{eligibleAt:()=>true}).pixels,habitat.pixels);
 const dense={tiles:[{roots:Array.from({length:1000},()=>({x,y:2,z}))}]};
 assert.equal(buildCavernGrassSoilHabitat(habitat,[],dense,{eligibleAt:()=>true}).pixels[offset],255);
 assert.throws(()=>buildCavernGrassSoilHabitat(habitat,[],{tiles:[{roots:[{x:x1+1,z}]}]},{eligibleAt:()=>true}),/OUTSIDE_ATLAS/);
});
test('renderer uploads only finalized habitat and runtime support rejects flooded or steep ground',()=>{
 const owner=fs.readFileSync(new URL('../../showroom/globe/h-earth/render/vegetation-single-owner.prototype.v1.js',import.meta.url),'utf8');
 const source=fs.readFileSync(new URL('../../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',import.meta.url),'utf8');
 const begin=source.indexOf('function prepareReplacementVegetation'),end=source.indexOf('async function uploadGlobalCover',begin),startup=source.slice(begin,end);
 assert.ok(startup.indexOf('await createSingleOwnerVegetation')<startup.indexOf('const installedHabitat=resources.singleOwnerVegetation.habitat'));
 assert.equal((startup.match(/gl\.texImage2D\(/g)??[]).length,1);
 assert.ok(owner.includes('hit.slope>1.35'));assert.ok(owner.includes('water.y<=local.y+.04'));
 assert.ok(owner.includes('floor.sample(x,z)??entranceGrass.visibleSurface.sample(x,z)'));
});
