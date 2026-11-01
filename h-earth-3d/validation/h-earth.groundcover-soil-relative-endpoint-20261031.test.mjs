import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const shaderPath = new URL('../../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js', import.meta.url);
const BEFORE = `      vec3 groundcoverTone=mix(
        vec3(0.110,0.118,0.075),vec3(0.075,0.090,0.055),groundcoverMoisture
      );
      groundcoverTone=mix(
        groundcoverTone,vec3(0.175,0.150,0.095),groundcoverDry
      );
      groundcoverTone*=0.88+0.24*materialVariation;
      palette=mix(palette,groundcoverTone,groundcoverWeight);`;
const AFTER = `      // Soil-relative ecological pigment: inherit the current earth material,
      // including native grain, instead of painting a fixed dark olive color.
      // Preserve all existing material eligibility, protected cores and roots.
      vec3 groundcoverSoilTint=mix(
        vec3(0.965,0.975,0.945),vec3(0.890,0.960,0.900),groundcoverMoisture
      );
      groundcoverSoilTint=mix(
        groundcoverSoilTint,vec3(1.015,0.990,0.965),groundcoverDry
      );
      vec3 groundcoverTone=palette*groundcoverSoilTint;
      palette=mix(palette,groundcoverTone,groundcoverWeight);`;
const sha1GitBlob = (s) => {
  const b = Buffer.from(s, 'utf8');
  return createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex');
};
const clamp = (x,a,b)=>Math.max(a,Math.min(b,x));
const mix=(a,b,t)=>a+(b-a)*t;
const orig=(moist,dry,variation=0.5)=>{
  let rgb=[mix(.110,.075,moist),mix(.118,.090,moist),mix(.075,.055,moist)];
  rgb=rgb.map((v,k)=>mix(v,[.175,.150,.095][k],dry));
  return rgb.map(v=>v*(.88+.24*variation));
};
const proposal=(soil,moist,dry)=>{
  const tint=[mix(.965,.890,moist),mix(.975,.960,moist),mix(.945,.900,moist)]
    .map((v,k)=>mix(v,[1.015,.990,.965][k],dry));
  return soil.map((v,k)=>v*tint[k]);
};
const comp=(soil,pigment,w)=>soil.map((v,k)=>mix(v,pigment[k],w));
const dist=(a,b)=>Math.hypot(...a.map((v,k)=>v-b[k]));

// The source identity gate runs in the real branch checkout, never against a mock fixture.
test('only registered main groundcover endpoint changed, byte-exact reverse reconstruction',()=>{
  const source=readFileSync(shaderPath,'utf8');
  assert.equal(source.split(AFTER).length,2,'revised endpoint must occur exactly once');
  assert.equal(source.includes(BEFORE),false,'absolute olive-paint endpoint must be absent');
  const original=source.replace(AFTER,BEFORE);
  assert.equal(sha1GitBlob(original),'85ee835060d5106a670077a5f4352b7ad202b49b');
  for(const essential of [
    'float groundcoverWeight=0.88*groundcoverPatch*',
    '(1.0-0.25*groundcoverPatchContinuity)*',
    'groundcoverSuitability*groundcoverProtection;',
    'float groundcoverOasisX=',
    'float groundcoverEstateX=',
    'float habitatColorCoverage=clamp(',
    'terrainRoughnessForLighting=mix(terrainRoughnessForLighting,.94,habitatCoverage*.3);'
  ])assert.ok(source.includes(essential),`original dependent expression missing: ${essential}`);
});

test('zero material weight preserves the existing native soil for all test families',()=>{
  for(const soil of [[.22,.19,.13],[.35,.29,.17],[.48,.39,.27]]){
    for(const moist of [0,.2,.6,1]){
      assert.deepEqual(comp(soil,proposal(soil,moist,.3),0),soil);
    }
  }
});

test('soil-relative pigment is channel bounded and preserves proportional soil response',()=>{
  for(const soil of [[.14,.12,.08],[.22,.19,.13],[.36,.28,.2],[.48,.36,.25],[.57,.45,.31]]){
    for(let i=0;i<=20;i++)for(let j=0;j<=20;j++){
      const pigment=proposal(soil,i/20,j/20);
      for(let k=0;k<3;k++) assert.ok(Math.abs(pigment[k]/soil[k]-1)<=.11000000001);
    }
    const doubled=soil.map(x=>2*x);
    for(const m of [0,.4,1])for(const d of [0,.3,1]){
      const a=proposal(soil,m,d),b=proposal(doubled,m,d);
      for(let k=0;k<3;k++)assert.ok(Math.abs(2*a[k]-b[k])<1e-12);
    }
  }
});

test('conditional W1 weight-only contrast contracts without replacing soil',()=>{
  const weights=[.3972283962170315,.06989020671982561];
  for(const soil of [[.30,.27,.18],[.36,.29,.20],[.48,.38,.27],[.22,.19,.13]]){
    for(const moist of [0,.4,.8,1]){
      const before=weights.map(w=>comp(soil,orig(moist,.15),w));
      const after=weights.map(w=>comp(soil,proposal(soil,moist,.15),w));
      assert.ok(dist(...before)>0);
      assert.ok(dist(...after)<dist(...before)*.25);
    }
  }
});

test('candidate introduces no texture, geometry, raster or extra noise instructions',()=>{
  for(const banned of ['texture(', 'noise2(', 'discard', 'gl_FragCoord', 'vWorldPosition=', 'draw(', 'vPrimitiveIndex='])
    assert.equal(AFTER.includes(banned),false);
  assert.equal(AFTER.endsWith('palette=mix(palette,groundcoverTone,groundcoverWeight);'),true);
});
