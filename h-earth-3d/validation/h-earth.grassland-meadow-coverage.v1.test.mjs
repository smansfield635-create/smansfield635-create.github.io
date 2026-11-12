import test from 'node:test';
import assert from 'node:assert/strict';
import {GRASS_CONTINUITY_ALLOCATION as allocation} from '../../showroom/globe/h-earth/render/grass-continuity-supplement.v1.js';

// Gen3238's frozen source-backed allocation. These assertions are capacity
// arithmetic only: actual new contacts and GPU performance still require proof.
test('Gen3238 exact frozen meadow non-oasis and woodland capacity',()=>{
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
