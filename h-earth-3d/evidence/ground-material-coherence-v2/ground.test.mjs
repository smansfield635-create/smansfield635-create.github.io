import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const source=readFileSync(new URL('../../../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',import.meta.url),'utf8');
const smoothstep=(a,b,x)=>{const t=Math.min(1,Math.max(0,(x-a)/(b-a)));return t*t*(3-2*t);};
const body=source.match(/float groundMaterialCompression\([^)]*\)\{([\s\S]*?)\n\}/)[1];
const compression=new Function('smoothstep','max','cameraDistance','pixelFootprint','coastDistance','groveProtection',body.replace(/\bfloat\b/g,'const'));
const amount=(d,p=0,c=100,g=0)=>compression(smoothstep,Math.max,d,p,c,g);
test('stage A restores exact admitted baseline when its two blocks are removed',()=>{
  const withoutB=source.replace(/    \/\/ H_EARTH_GROUND_MATERIAL_STAGE_B_BEGIN\n[\s\S]*?    \/\/ H_EARTH_GROUND_MATERIAL_STAGE_B_END\n/,'');
  const restored=withoutB.replace(/\/\/ H_EARTH_GROUND_MATERIAL_STAGE_A_FUNCTION_BEGIN\n[\s\S]*?\/\/ H_EARTH_GROUND_MATERIAL_STAGE_A_FUNCTION_END\n/,'').replace(/      \/\/ H_EARTH_GROUND_MATERIAL_STAGE_A_BEGIN\n[\s\S]*?      \/\/ H_EARTH_GROUND_MATERIAL_STAGE_A_END\n/,'');
  const bytes=Buffer.from(restored);const sha=createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
  assert.equal(sha,'31d97193a508ede2c244b4253c76be892fd9782e');
});
test('near soil, protected grove and coastal controls have exactly zero treatment',()=>{
  for(const d of [0,20,55,72])for(const p of [0,2,8,100])assert.equal(amount(d,p),0);
  for(const d of [100,250,520,3000])for(const p of [0,8,100]){assert.equal(amount(d,p,28),0);assert.equal(amount(d,p,100,1),0);}
});
test('distance and footprint transitions stay bounded and continuous without a hard ring',()=>{
  for(const p of [0,1.5,3,8,20]){let previous=0;for(let d=0;d<=1000;d+=.25){const a=amount(d,p);assert.ok(a>=previous-1e-12&&a>=0&&a<=.65);assert.ok(a-previous<.004);previous=a;}}
  for(const edge of [72,120,140,520])assert.ok(Math.abs(amount(edge+.001,8)-amount(edge-.001,8))<.0001);
  for(const edge of [1.5,8])assert.ok(Math.abs(amount(250,edge+.001)-amount(250,edge-.001))<.001);
  assert.equal(amount(520),.65);assert.equal(amount(120),0);
});
test('far palette retains 35 percent of same-anchor albedo differences',()=>{
  const a=amount(600);const mix=(x,y,t)=>x*(1-t)+y*t;
  for(const anchor of [.10,.20,.35])assert.ok(Math.abs((mix(.4,anchor,a)-mix(.1,anchor,a))-.105)<1e-12);
});
test('stage A adds no texture, geometry, normal, habitat or grass mutation',()=>{
  const block=source.match(/      \/\/ H_EARTH_GROUND_MATERIAL_STAGE_A_BEGIN\n([\s\S]*?)      \/\/ H_EARTH_GROUND_MATERIAL_STAGE_A_END/)[1];
  assert.doesNotMatch(block,/texture\s*\(|noise2\s*\(|(?:shadingNormal|geometricNormal|base|habitatCoverage)\s*=/);
  assert.match(block,/palette=mix\(palette,distantSoilAnchor,groundCompression\)/);
});
test('stage B only harmonizes the later habitat tint on distant soil',()=>{
  const block=source.match(/    \/\/ H_EARTH_GROUND_MATERIAL_STAGE_B_BEGIN\n([\s\S]*?)    \/\/ H_EARTH_GROUND_MATERIAL_STAGE_B_END/)[1];
  assert.match(block,/groundMaterialCompression\(/);
  assert.match(block,/habitatSoil=mix\(habitatSoil,base,habitatReconciliation\)/);
  assert.doesNotMatch(block,/texture\s*\(|noise2\s*\(|(?:habitatCoverage|shadingNormal|geometricNormal|vWorldPosition|base)\s*=/);
  assert.ok(source.indexOf('H_EARTH_GROUND_MATERIAL_STAGE_B_BEGIN')>source.indexOf('H_EARTH_GROUND_MATERIAL_STAGE_A_END'));
  assert.ok(source.indexOf('H_EARTH_GROUND_MATERIAL_STAGE_B_END')<source.indexOf('float bankWindow='));
  assert.match(source,/base=mix\(base,habitatSoil,habitatCoverage\*\.68\)/);
});
test('stage B preserves close, coastal and grove habitat color and reduces only distant tint',()=>{
  for(const d of [0,20,55,72])for(const p of [0,2,8,100])assert.equal(amount(d,p),0);
  for(const d of [100,520,3000]){assert.equal(amount(d,30,28),0);assert.equal(amount(d,30,100,1),0);}
  const far=amount(650,12,100,0);
  assert.equal(far,0.65);
  const originalOverlay=0.68;
  const adjustedOverlay=originalOverlay*(1-far);
  assert.ok(adjustedOverlay<0.25&&adjustedOverlay>0);
  assert.ok(Math.abs(adjustedOverlay-0.238)<1e-12);
});
test('public H-Earth import map binds both renderer aliases to this exact Stage B blob',()=>{
  const html=readFileSync(new URL('../../../showroom/globe/h-earth/index.html',import.meta.url),'utf8');
  const sha=createHash('sha1').update(`blob ${Buffer.byteLength(source)}\0`).update(source).digest('hex');
  const rendererPath='/showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js';
  const exact=rendererPath+'?rev='+sha;
  assert.equal(html.split(exact).length-1,2);
});
