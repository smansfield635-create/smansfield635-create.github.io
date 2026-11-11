import test from 'node:test';
import assert from 'node:assert/strict';
import {
 hillsideFringeWeight,
 hillsideDensity,
 hillsideWeight,
 hillsideSandCoverage,
 HILLSIDE_SHORELINE_GLSL
} from '../../showroom/globe/h-earth/render/hillside-shoreline-field.v1.js';

// Gen3010 source regression only: no assertions of root placement, GPU coverage,
// saved population, publication or owner acceptance until exact asset review.
const smooth=(a,b,x)=>{
 const t=Math.max(0,Math.min(1,(x-a)/(b-a)));
 return t*t*(3-2*t);
};
const attrs=(x,z,overrides={})=>({
 x,y:30,z,shaderSlope:.08,contactDistance:64,sandCoverage:0,...overrides
});
function inheritedDensity(p){
 if(p.sandCoverage>.12||p.contactDistance<=0)return 0;
 const bank=smooth(.012,.065,p.shaderSlope);
 const shore=smooth(2,6+10*(1-bank),p.contactDistance);
 const elevation=24-16*smooth(20,38,p.y)-6.5*smooth(38,50,p.y);
 return hillsideWeight(p.x,p.z)*shore*(1-smooth(0,.12,p.sandCoverage))
  *elevation*(1-.7*smooth(.18,.46,p.shaderSlope));
}
test('frozen shoreline and shader presentation stay separate from CPU density proposal',()=>{
 assert.match(HILLSIDE_SHORELINE_GLSL,/float hillsideWeight\(vec2 p\)/);
 assert.match(HILLSIDE_SHORELINE_GLSL,/float hillsideSandCoverage\(/);
 for(const x of [-200,0,100,139,259,300]){
  for(const z of [-320,-292,-276,-256,-220]){
   const p=attrs(x,z);
   assert.equal(hillsideFringeWeight(x,z),0,'fringe outside admitted lateral envelope');
   assert.equal(hillsideDensity(p),inheritedDensity(p),'original density preserved outside candidate');
  }
 }
 for(const x of [148,200,248]){
  assert.equal(hillsideSandCoverage({x,z:-276,shaderSlope:.06,rawSandCoverage:.3}),
   .3*(1-hillsideWeight(x,-276)*smooth(.012,.065,.06)),
   'original sand protection formula preserved');
 }
});
test('26-column formerly empty row gains source eligibility without creating roots',()=>{
 for(const x of [148,200,248]){
  assert(hillsideFringeWeight(x,-276)>0,'positive fringe proposal on sampled cutoff');
  assert(hillsideDensity(attrs(x,-276))>inheritedDensity(attrs(x,-276)),
    'positive-x dry source support must exceed old cutoff');
  assert.equal(hillsideFringeWeight(x,-310),0,'do not extend beyond bounded south fringe');
 }
 assert.equal(hillsideFringeWeight(200,-276),hillsideFringeWeight(200,-276),'deterministic');
});
test('fringe bends and tapers without a second straight hard cutoff',()=>{
 let positive=0,changed=0,maxJump=0;
 for(let x=138;x<=260;x+=.5){
  for(let z=-302;z<=-244;z+=.5){
   const a=hillsideFringeWeight(x,z);
   assert(Number.isFinite(a)&&a>=0&&a<=.72);
   if(a>0)positive++;
   if(a>0&&a<.72)changed++;
   if(x<=259.5)maxJump=Math.max(maxJump,Math.abs(a-hillsideFringeWeight(x+.5,z)));
   if(z<=-244.5)maxJump=Math.max(maxJump,Math.abs(a-hillsideFringeWeight(x,z+.5)));
  }
 }
 assert(positive>0&&changed>0);
 assert(maxJump<.08,'smooth half-metre spatial variation, not a new hard boundary');
 assert.notEqual(hillsideFringeWeight(200,-276),hillsideFringeWeight(216,-276),
  'source fringe must not be an identical straight-line support mask');
});
test('physical protection remains a separate mandatory admission gate',()=>{
 for(const x of [148,200,248]){
  assert.equal(hillsideDensity(attrs(x,-276,{sandCoverage:.121})),0,'sand exclusion');
  assert.equal(hillsideDensity(attrs(x,-276,{contactDistance:0})),0,'contact exclusion');
  assert.equal(hillsideDensity(attrs(x,-276,{contactDistance:-1})),0,'underwater/contact exclusion');
 }
 assert.throws(()=>hillsideFringeWeight(Number.NaN,-276),/HILLSIDE_FRINGE_POINT_INVALID/);
 assert.throws(()=>hillsideFringeWeight(200,Infinity),/HILLSIDE_FRINGE_POINT_INVALID/);
});
