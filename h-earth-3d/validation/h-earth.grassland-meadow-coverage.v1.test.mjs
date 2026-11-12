import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
import {fileURLToPath} from 'node:url';
import {GRASS_CONTINUITY_ALLOCATION as allocation} from '../../showroom/globe/h-earth/render/grass-continuity-supplement.v1.js';

const expectedCompressedSha='a6f408b7375bec5726b9b3931351ddb226f2bbd2606f27fe85f128816bd7e015';
const expectedCanonicalMapSha='d2371d0aa2231aa896ad0f6fac3007dce27c1e728c4247ff7a2ec0d9b7e3d168';
const file=new URL('../evidence/ecological-meadow-coverage-v1/frozen-map.v1.json.gz',import.meta.url);
const stable=value=>Array.isArray(value)?value.map(stable):value&&typeof value==='object'?Object.fromEntries(Object.keys(value).sort().map(k=>[k,stable(value[k])])):value;

test('Gen3238 exact frozen ecological quota and physical-tile guards',()=>{
 const bytes=fs.readFileSync(file);
 assert.equal(bytes.length,415483);
 assert.equal(createHash('sha256').update(bytes).digest('hex'),expectedCompressedSha);
 const map=JSON.parse(gunzipSync(bytes));
 assert.equal(map.schema,'H_EARTH_FROZEN_POSITIVE_X_DRY_MEADOW_COVERAGE_MAP_V1');
 assert.equal(createHash('sha256').update(JSON.stringify(stable(map))).digest('hex'),expectedCanonicalMapSha);
 assert.deepEqual(map.parameters.analysisContextBounds,[16,-559,254,-236]);
 assert.equal(map.cells.length,76874);
 assert.equal(map.cells.reduce((n,c)=>n+c.additionalRoots,0),343076);
 assert.equal(map.cells.filter(c=>c.additionalRoots>0).length,38578);
 const classes=Object.groupBy(map.cells,c=>c.class);
 assert.equal(classes.ESTABLISHED_MEADOW_INTERIOR.length,34321);
 assert.equal(classes.NATURAL_MEADOW_TRANSITION.length,21553);
 assert.equal(classes.PROTECTED_OR_INTENTIONALLY_OPEN.length,21000);
 for(const c of map.cells){
  assert.equal(Number.isInteger(c.additionalRoots)&&c.additionalRoots>=0,true);
  if(c.additionalRoots){
   assert.equal(c.admitted,true);assert.equal(c.soilEligible,true);
   assert.ok(['ESTABLISHED_MEADOW_INTERIOR','NATURAL_MEADOW_TRANSITION'].includes(c.class));
   assert.equal(c.sourceRoots+c.additionalRoots,c.targetRoots);
  }
 }
 assert.equal(map.perPhysicalTile.reduce((n,t)=>n+t.addedRoots,0),343076);
 for(const t of map.perPhysicalTile){
  assert.equal(t.physicalRootsBefore+t.addedRoots,t.physicalRootsAfter);
  assert.ok(t.physicalRootsAfter<=1600,`physical tile ${t.tile}`);
 }
});

test('Gen3238 exact accepted capacity preserves ravine, oasis and original allocations',()=>{
 const acceptedNonOasis=3460644,acceptedWoodland=933632;
 const addedQuota=343076,acceptedRavine=2527012,oasisBank=1571;
 assert.equal(allocation.maximumRoots,acceptedNonOasis+addedQuota);
 assert.equal(allocation.maximumWoodlandRoots,acceptedWoodland+addedQuota);
 assert.equal(allocation.maximumRavineRoots,acceptedRavine);
 assert.equal(allocation.maximumWoodlandRoots+allocation.maximumRavineRoots,allocation.maximumRoots);
 assert.equal(allocation.maximumPackedBytes,allocation.maximumRoots*16);
 assert.equal(allocation.maximumRoots+oasisBank,3805291);
 assert.equal(allocation.maximumPackedBytes+oasisBank*16,60884656);
 assert.equal(allocation.maximumTileRoots,1600);
 assert.equal(allocation.originalWoodlandRoots,385944);
 assert.equal(allocation.originalRavineRoots,139198);
});
