import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const renderer=fs.readFileSync('showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js','utf8');
const route=fs.readFileSync('showroom/globe/h-earth/vegetation-prototype/route.js','utf8');
const one=s=>assert.equal(renderer.split(s).length,2,'unique P5 marker: '+s);
test('P5 material-only code is in the land shader before role-4 water',()=>{
  one('P5_HILLSIDE_ECOTONE_END');one('P5_WATER_CONTACT_ECOTONE_END');
  const h=renderer.indexOf('float p5HillsideMeso=');
  const b=renderer.indexOf('float p5DryBankContact=');
  const w=renderer.indexOf('}else if(vRoleCode==4u)');
  assert.ok(h>0&&b>h&&w>b,'material fragments precede separate water role');
  const hs=renderer.slice(h,renderer.indexOf('P5_HILLSIDE_ECOTONE_END',h));
  const bs=renderer.slice(b,renderer.indexOf('P5_WATER_CONTACT_ECOTONE_END',b));
  for(const name of ['materialHillsideWeight','groundcoverProtection','rockExposure'])assert.ok(hs.includes(name),name);
  for(const name of ['inlandMeters','sandCoverage','rockExposure','p5GroveKeep'])assert.ok(bs.includes(name),name);
  assert.ok(!/gl\\.bufferData|drawElements|aRoot/.test(hs+bs),'no GPU/root mutation');
});
test('P5 route uses the new immutable renderer revision token',()=>{
  assert.ok(route.includes('persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js?rev=gen3468-p5-terrain-ecotone-v1'));
  assert.ok(!route.includes('persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js?rev=gen2987-habitat-material-blend-v1'));
});
