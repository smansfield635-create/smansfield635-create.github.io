import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { gunzipSync } from 'node:zlib';
import {createHash} from 'node:crypto';
import {sampleHEarthTerrainElevation} from '../terrain/h-earth.terrain-field.js';

const root=new URL('../../',import.meta.url);
const asset=new URL('showroom/globe/h-earth/render/assets/h-earth-canonical-base-world.v1.json.gz',root);
const manifestPath=new URL('showroom/globe/h-earth/render/assets/h-earth-canonical-base-world.v1.manifest.json',root);
const loaderPath=new URL('showroom/globe/h-earth/render/live-render-package.run8e-r2.canonical.js',root);
const hash=b=>createHash('sha256').update(b).digest('hex');
const read=p=>fs.readFileSync(p);
const meshBytes=read(asset),manifest=JSON.parse(read(manifestPath));
const records=JSON.parse(gunzipSync(meshBytes).toString('utf8'));
const loader=read(loaderPath).toString('utf8');

function nearestTerrainVertex(record,x,z){
  const positions=record.buffers.positions;
  const count=record.primitiveSpans.find(span=>span.role==='TERRAIN')?.vertexCount;
  assert.ok(count>10000,'TERRAIN_VERTEX_COUNT_MISSING');
  let best=Infinity,index=-1;
  for(let i=0;i<count;i++){
    const dx=positions[i*3]-x,dz=positions[i*3+2]-z,d2=dx*dx+dz*dz;
    if(d2<best){best=d2;index=i;}
  }
  assert.ok(best<1,'TERRAIN_GRID_WITNESS_NOT_AT_DESIGNATED_COORDINATE:'+x+':'+z);
  return {x:positions[index*3],y:positions[index*3+1],z:positions[index*3+2]};
}

test('compressed manifest and live hydration share one exact package identity',()=>{
  assert.equal(manifest.schema,'H_EARTH_GEN2666_PRECOMPUTED_BASE_WORLD_MANIFEST_v1');
  assert.equal(meshBytes.length,manifest.binary.bytes);
  assert.equal(hash(meshBytes),manifest.binary.sha256);
  assert.equal(manifest.binary.uncompressedBytes,gunzipSync(meshBytes).length);
  assert.ok(loader.includes(manifest.binary.sha256),'LIVE_HYDRATOR_PACKAGE_HASH_NOT_RECONCILED');
  assert.ok(loader.includes(String(manifest.binary.bytes)),'LIVE_HYDRATOR_PACKAGE_LENGTH_NOT_RECONCILED');
  assert.equal(records.canonical.packageIdentity,manifest.packageIdentity);
  assert.equal(records.raw.packageIdentity,manifest.rawPackageIdentity);
});

test('terrain source now corresponds to the physical uploaded East A indexed mesh',()=>{
  const places=[[208,-344],[200,-344],[216,-344],[208,-328],[200,-328],[216,-328],[192,-328],[224,-328]];
  for(const [x,z] of places){
    const c=nearestTerrainVertex(records.canonical,x,z);
    const y=sampleHEarthTerrainElevation(c.x,c.z);
    assert.ok(Math.abs(c.y-y)<=0.85,
      'EAST_A_PRECOMPUTED_SOURCE_MISMATCH:'+x+':'+z+':mesh='+c.y+':source='+y);
  }
});

test('package topology and protected live-instance allocations survive rebake',()=>{
  for(const k of ['raw','canonical']){
    const p=records[k];
    assert.equal(p.primitiveCount,14);
    assert.equal(p.vertexCount,110269);
    assert.equal(p.triangleCount,103822);
    assert.equal(p.primitiveSpans.find(s=>s.role==='TERRAIN')?.triangleCount,20736);
    assert.equal(p.drawRanges[0]?.indexCount,62208);
    assert.equal(p.primitiveIds.length,14);
    assert.ok(p.primitiveIds.some(id=>id.includes('P2_CANOPY')));
    assert.ok(p.primitiveIds.some(id=>id.includes('P2_BARK')));
    assert.ok(p.primitiveIds.some(id=>id.includes('SHORELINE')));
  }
  assert.equal(manifest.protectedWorld.approvedTrees,4);
  assert.equal(manifest.protectedWorld.legacyTrees,0);
  assert.equal(manifest.protectedWorld.vegetationBatches,108);
  assert.equal(manifest.protectedWorld.vegetationPlacements,27585);
});
