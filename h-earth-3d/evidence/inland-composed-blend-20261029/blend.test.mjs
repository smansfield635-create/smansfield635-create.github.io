import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
const root=new URL('../../../',import.meta.url);
const renderer=fs.readFileSync(new URL('showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',root),'utf8');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const binding=JSON.parse(fs.readFileSync(new URL('./product-binding.json',import.meta.url)));
const helper=renderer.match(/\/\/ H_EARTH_INLAND_REFERENCE_V1_BEGIN[\s\S]*?\/\/ H_EARTH_INLAND_REFERENCE_V1_END\n/)[0];
const correction=renderer.match(/      \/\/ H_EARTH_INLAND_COMPOSED_BLEND_V1_BEGIN[\s\S]*?      \/\/ H_EARTH_INLAND_COMPOSED_BLEND_V1_END\n/)[0];
test('all pre-existing rendering, geometry and atlas bytes are identical after removing the declared correction',()=>{
 assert.equal(hash(renderer.replace(helper,'').replace(correction,'')),binding.baseline.rendererSha256);
 assert.equal(hash(renderer),binding.candidate.rendererSha256);
 assert.equal(renderer.includes('H_EARTH_NATURAL_DRY_SAND_BLEND_V1_BEGIN'),false);
});
test('route changes only the cache revision and both product hashes are bound',()=>{
 const route=fs.readFileSync(new URL('showroom/globe/h-earth/vegetation-prototype/route.js',root),'utf8');
 assert.equal(hash(route),binding.candidate.routeSha256);
 assert.equal(hash(route.replace('gen2984-inland-composed-blend','gen2973-corrected-material-v1')),binding.baseline.routeSha256);
});
test('reference has no camera, texture, screen derivative or geometric mutation dependencies',()=>{
 for(const token of ['texture(','fwidth(','dFdx(','dFdy(','distanceToCamera','gl_Position','vWorldPosition='])assert.equal(helper.includes(token),false,token);
 assert.match(helper,/float grain=0\.5/);assert.match(helper,/float detailField=0\.5/);assert.match(helper,/float triFine=0\.5/);assert.match(helper,/float triMicro=0\.5/);assert.match(helper,/float nearMaterial=0\.0/);
 assert.match(helper,/palette=mix\(palette,identityBase,identityWeight\)/);
 assert.match(helper,/palette=mix\(palette,groundcoverTone,groundcoverWeight\)/);
});
test('frozen radius and normalized positive kernel carry signed detail residual without clipping',()=>{
 assert.equal((correction.match(/inlandBroadReference\(/g)||[]).length,5);
 assert.match(correction,/vec3 inlandDx=vec3\(12\.0/);assert.match(correction,/0\.5\*inlandQ0\+0\.125\*/);
 assert.match(correction,/palette\+=inlandBlendEnvelope\*\(inlandFiltered-inlandQ0\)/);
 assert.equal(correction.includes('clamp(palette'),false);
 assert.match(correction,/groundcoverProtection\*/);assert.match(correction,/smoothstep\(112\.0,144\.0,vCoastDistanceMeters\)/);
 assert.match(correction,/1\.0-smoothstep\(0\.12,0\.42,slope\)/);
});
test('frozen archived CPU witness report proves nonzero inland effect with preserved residual',()=>{
 const report=JSON.parse(fs.readFileSync(new URL('./cpu-reference-report.json',import.meta.url)));
 assert.equal(report.radiusMeters,12);assert.equal(report.groups.length,2);
 for(const g of report.groups){assert.equal(g.centerPMaxDifference,0);assert.equal(g.centerQMaxDifference,0);assert.equal(g.nonzeroDeltaMemberships,g.memberships);assert.ok(g.broadGradientMeanAfter<g.broadGradientMeanBefore);assert.ok(g.nativeDetailCarryMaxError<2e-8);assert.equal(g.candidateOutsideLinearUnitRange,0);}
});
