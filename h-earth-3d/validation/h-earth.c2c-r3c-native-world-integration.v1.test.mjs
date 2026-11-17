/** Gen3353: source + exact binary custody preflight for the real H-Earth
 * C2-C placement inquiry. Does NOT claim a hydrated R3C renderer session,
 * GPU insertion, material fidelity, object acceptance or human edit.
 * Browser/native framebuffer verification remains a separate required gate.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const rendererPath=path.join(root,'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js');
const binaryPath=path.join(root,'showroom/globe/h-earth/render/assets/h-earth-canonical-base-world.v1.json.gz');
const source=fs.readFileSync(rendererPath,'utf8');
const expectedBinarySha256='48f754ca1b11b8fe7eeb0e8d4573f6b6cb544cf438322a115eb52c44d3b29d5a';
const savedAssetSha256='0419dc21b2205e35fc84cf1a6461a62936ab3b6b4c12c0c0e094b622e01283e5';
const adapterSha256='008c7b98d8661e211c20bcb8f8ad9d04cf2b5bb06e786193e036013951fb82de';

test('genuine complete world gzip is source-present and exact SHA-256 (no substitute)',()=>{
  const bytes=fs.readFileSync(binaryPath);
  assert.equal(bytes.byteLength,11736235);
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),expectedBinarySha256);
});
test('R3C actual-source probe uses indexed visible ground and geological water',()=>{
  const begin=source.indexOf('  // Gen3353 Cycle Two: a read-only probe');
  const end=source.indexOf('  function getVegetationProbe(',begin);
  assert.ok(begin>=0&&end>begin);
  const probe=source.slice(begin,end);
  assert.match(probe,/function inspectExactC2CWorldFootprint\(/);
  assert.match(probe,/resources\.vegetationVisibleSurface/);
  assert.match(probe,/resources\.geologicalRuntime/);
  assert.match(probe,/surface\.ground\.sample\(x,z\)/);
  assert.match(probe,/surface\.water\.sample\(x,z\)/);
  assert.match(probe,/geology\.sampleWaterAt\(x,z\)/);
  assert.match(probe,/geology\.isPlannedWaterFootprint\(x,z\)/);
  assert.match(probe,/surface\.admitGround\(x,z,ground\)/);
  assert.match(probe,/placementAuthorized:false/);
  assert.match(probe,/worldObjectInstalled:false/);
  assert.match(probe,/newGpuResourcesCreated:false/);
  assert.match(probe,/i<7;i\+\+/);
  assert.match(probe,/j<7;j\+\+/);
  assert.ok(!probe.includes('beginTransaction('));
  assert.ok(!probe.includes('gl.createBuffer('));
  assert.ok(!probe.includes('gl.drawElements('));
  assert.ok(source.includes('getVegetationTrace,getVegetationProbe,inspectExactC2CWorldFootprint,'));
  assert.ok(source.includes(adapterSha256));
  assert.ok(source.includes(savedAssetSha256));
});
test('C2-C probe uses exact frozen rotated bounds, never old 2-m cardinal contacts',()=>{
  const marker='  const c2cExactContacts=Object.freeze([';
  const begin=source.indexOf(marker),end=source.indexOf('  function inspectExactC2CWorldFootprint()',begin);
  assert.ok(begin>0&&end>begin);
  const declaration=source.slice(begin,end);
  for(const n of ['191.54097238618917','191.73324556724393','192.38796052708102','192.58023370813578','191.34097238618918','192.78023370813577','-288.65518930879244','-287.38363633700294'])
    assert.ok(declaration.includes(n),'missing frozen contact or AABB '+n);
  assert.ok(!declaration.includes('x:190'));
  assert.ok(!declaration.includes('x:194'));
  assert.ok(!declaration.includes('xMax:100'));
});
