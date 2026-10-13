#!/usr/bin/env node
import assert from 'node:assert/strict';
import {
  selectHEarthMeadowMidDistancePatchDraws
} from '../../showroom/globe/h-earth/render/landscape-groundcover.global-v1.js';

const cover={
  receipt:{instanceCount:2176},
  tiles:[
    {start:0,count:2048,minX:-64,maxX:-32,minZ:-352,maxZ:-320,ecoInstances:0},
    {start:2048,count:128,minX:0,maxX:32,minZ:0,maxZ:32,ecoInstances:0}
  ]
};
const selected=selectHEarthMeadowMidDistancePatchDraws(cover,{x:-45,z:-326});
assert.equal(selected.representation,'TERRAIN_ALIGNED_ALPHA_TEXTURED_PATCH_IMPOSTOR');
assert.equal(selected.sourcePopulationChanged,false);
assert.equal(selected.centerX,-45);
assert.equal(selected.centerZ,-326);
assert.equal(selected.pilotRadius,18);
assert.equal(selected.innerDistance,6);
assert.equal(selected.outerDistance,18);
assert.equal(selected.draws.length,1);
assert.equal(selected.draws[0].start,0);
assert.equal(selected.draws[0].count,1024);
assert.equal(selected.visibleInstanceCount,1024);
assert.ok(selected.draws.every(draw=>draw.patchLod===true));
assert.throws(
  ()=>selectHEarthMeadowMidDistancePatchDraws(cover,{x:-45,z:-326},{maximumDraws:0}),
  /MEADOW_PATCH_LOD_SELECTION_BUDGET_INVALID/
);
const moved=selectHEarthMeadowMidDistancePatchDraws(cover,{x:800,z:800});
assert.equal(moved.draws.length,0);
console.log(JSON.stringify({
  schema:'H_EARTH_MEADOW_MIDDISTANCE_PATCH_LOD_TEST_v1',
  result:'PASS',
  selectedTiles:selected.draws.length,
  selectedInstances:selected.visibleInstanceCount,
  sourcePopulationChanged:selected.sourcePopulationChanged,
  pilotRadiusMeters:selected.pilotRadius,
  middleBandMeters:[selected.innerDistance,selected.outerDistance],
  maximumInstances:selected.maximumInstances,
  maximumDraws:selected.maximumDraws
}));
