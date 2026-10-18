import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createHash } from 'node:crypto';

const renderer=readFileSync(new URL('../../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',import.meta.url),'utf8');
// Execute the actual scalar GLSL helper with only declaration/literal syntax
// translated. No independent eligibility predicate is maintained in the test.
const body=renderer.match(/float authoredTreeMaterialWeight\([^)]*\)\{([\s\S]*?)\n\}/)?.[1];
assert.ok(body,'shader material helper exists');
const weight=new Function('model','role','parameters','enabled','edge',body.replace(/\bbool\b/g,'const').replace(/\b(\d+)u\b/g,'$1'));
const clearingTypeExpression=renderer.match(/float clearingType=([^;]+);/)[1].replace(/\b(\d+)u\b/g,'$1');
const initialType=new Function('vMaterialModelCode','vMaterialParameters',`return ${clearingTypeExpression}`);
const reset=renderer.match(/if\((clearingType>0\.5&&[^)]*)\)clearingType=0\.0;/)[1];
const resetType=new Function('clearingType','treeMaterialWeight',`if(${reset})clearingType=0;return clearingType;`);
const typeAt=(model,role,parameters,enabled,edge)=>resetType(initialType(model,parameters),weight(model,role,parameters,enabled,edge));
const tags=z=>({x:.3,y:.7,z,w:2});

// Fixed Gen2800 sites from the accepted planting packet. Four original-region
// witnesses are sampled controls, not a claim of the four original root centers.
const added=[[55.5,-307.5],[47.5,-317.5],[71.5,-291.5],[63.5,-301.5]];
const original=[[-150,-220],[-145,-215],[-140,-210],[-130,-200]];
const bounds=[-155.40267987050615,-226.74616902099837,-123.40267987050615,-194.74616902099837];
const edgeAt=([x,z])=>{const d=Math.min(x-bounds[0],z-bounds[1],bounds[2]-x,bounds[3]-z);const t=Math.max(0,Math.min(1,d/1.5));return t*t*(3-2*t);};

test('all four added sites retain authored bark and leaves outside the clearing',()=>{
  for(const site of added){assert.equal(edgeAt(site),0);for(const z of [1,2]){assert.equal(weight(0,3,tags(z),1,0),1);assert.equal(typeAt(0,3,tags(z),1,0),z);}}
});
test('reference interior and fractional edge treatment are numerically unchanged',()=>{
  for(const edge of [...original.map(edgeAt),0.0001,.1,.5,.99,1])for(const z of [1,2,3]){
    assert.equal(weight(0,3,tags(z),1,edge),edge);
    assert.equal(typeAt(0,3,tags(z),1,edge),z);
  }
});
test('outside negative controls cannot gain tree material eligibility',()=>{
  for(const role of [0,1,2,4,5])for(const z of [1,2])assert.equal(typeAt(0,role,tags(z),1,0),0);
  for(const z of [0,3,4,1.1,1.9])assert.equal(typeAt(0,3,tags(z),1,0),0);
  for(const w of [0,1,1.9,3])assert.equal(typeAt(0,3,{...tags(1),w},1,0),0);
  assert.equal(typeAt(1,3,tags(1),1,0),0);
  for(const z of [1,2])assert.equal(typeAt(0,3,tags(z),0,0),0);
});
test('actual shader leaf alpha cutout applies at added sites and preserves threshold',()=>{
  const clause=renderer.match(/if\((clearingType>1\.5&&clearingType<2\.5)\)\{clearingTexel=texture\(uClearingLeaf,vMaterialParameters.xy\);if\((clearingTexel.a<[^)]+)\)discard;\}/);
  assert.ok(clause,'authored leaf texture and alpha branch');
  const discards=new Function('clearingType','clearingTexel',`return (${clause[1]})&&(${clause[2]});`);
  for(const site of added){const type=typeAt(0,3,tags(2),1,edgeAt(site));for(const a of [0,.1,.4499])assert.equal(discards(type,{a}),true);for(const a of [.45,.8,1])assert.equal(discards(type,{a}),false);}
  assert.equal(discards(typeAt(0,3,tags(1),1,0),{a:0}),false);
});
test('soil/shadow bounds, shadow construction, resource setup and fog are preserved',()=>{
  const digest=s=>createHash('sha256').update(s).digest('hex');
  const spatial=renderer.slice(renderer.indexOf('  // At this clearing radius'),renderer.indexOf('  float treeMaterialWeight='));
  assert.equal(digest(spatial),'d896f65fc443cc592d03b2b191d952b1bb54715e89bd5a10fea42d9690056973');
  // All resource creation and draw code lies after the fragment shader.
  assert.equal(digest(renderer.slice(renderer.indexOf('const WOODLAND_FINE_GRASS_FS='))),'fcb2510dd3923a489ea6c255047103251f36fe71edf547d7a750dfda6f2c1109');
  assert.match(renderer,/if\(clearingEdge>0\.0\)\{\s*clearingShadowFactor=mix\(1\.0,clearingVisibility\(vWorldPosition\),clearingEdge\);/);
  assert.match(renderer,/fog=min\(uMaximumFogFactor,fog\+clearingEdge\*clamp\(distanceToCamera\/2400\.0,0\.0,0\.035\)\);/);
  assert.match(renderer,/base\*=mix\(vec3\(1\.0\),detail,treeMaterialWeight\*0\.78\);/);
  assert.match(renderer,/if\(treeMaterialWeight!=1\.0\)/);
});
