import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createRainField,buildRainMesh,sampleDrop,inspectRainField,RAIN_BANDS} from './spatial-rain.v1.mjs';
test('deterministic seeded 3D populations, near/mid/far distinct',()=>{
  const a=createRainField({seed:91}),b=createRainField({seed:91}),c=createRainField({seed:92});
  assert.deepEqual(a,b);assert.notDeepEqual(a.bands[0].drops[0],c.bands[0].drops[0]);
  assert.deepEqual(inspectRainField(a).counts,[310,220,105]);
  assert.equal(a.dropCount,635);assert.equal(inspectRainField(a).bounded,true);
  assert.equal(inspectRainField(a).uniqueIds,true);
  assert.deepEqual(a.bands.map(x=>x.id),['FAR','MID','NEAR']);
});
test('perspective produces correct depth ordering and camera parallax',()=>{
  const f=createRainField({counts:[1,1,1]});
  const near=f.bands[2].drops[0],far=f.bands[0].drops[0];
  const n=sampleDrop(near,0),b=sampleDrop(far,0);
  assert.ok(n.depth<b.depth);assert.ok(n.lengthScreen>b.lengthScreen*.2);
  const nm=sampleDrop(near,0,{cameraX:.4}),fm=sampleDrop(far,0,{cameraX:.4});
  assert.ok(Math.abs(n.screen.x-nm.screen.x)>Math.abs(b.screen.x-fm.screen.x)*2);
});
test('world-space gravity and restrained wind actually advance positions',()=>{
  const f=createRainField({counts:[2,2,2]});const d=f.bands[2].drops[0];
  assert.ok(d.speed>7&&d.speed<13&&d.wind>.2&&d.wind<1);
  const a=sampleDrop(d,.0),b=sampleDrop(d,.012);
  assert.notEqual(a.worldY,b.worldY);assert.notEqual(a.worldX,b.worldX);
});
test('GPU triangle mesh contains finite per-drop 3D geometry',()=>{
  const f=createRainField({counts:[3,4,5]});
  for(const band of f.bands){const mesh=buildRainMesh(band);assert.equal(mesh.vertexCount,band.drops.length*6);
    for(const att of mesh.attributes){assert.equal(att.data.length,mesh.vertexCount*att.size);assert.ok([...att.data].every(Number.isFinite));}
    const z=mesh.attributes[0].data;assert.ok(z[2]<0);
  }
});
test('inputs fail closed and no display tiling',()=>{
  for(const v of [-1,1.2,NaN]) assert.throws(()=>createRainField({seed:v}));
  assert.throws(()=>createRainField({counts:[0,3,4]}));
  assert.throws(()=>createRainField({aspect:0}));
  assert.equal(inspectRainField(createRainField({counts:[2,2,2]})).usesDisplayTiling,false);
});
