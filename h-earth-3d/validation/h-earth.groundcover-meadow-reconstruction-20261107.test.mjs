import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

const src=readFileSync(fileURLToPath(new URL('../../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',import.meta.url)),'utf8');
const baseline='      palette=mix(palette,groundcoverTone,groundcoverWeight);';
const replacement=[
 '      // Continuous meadow floor fills eligible bare gaps while retaining',
 '      // the original organic dark core, soil families and habitat exclusions.',
 '      float groundcoverMeadowMosaic=',
 '        (0.19+0.23*macroField+0.08*mesoField+0.07*moistShelter)*',
 '        (0.70+0.30*groundcoverOrganic);',
 '      float groundcoverPatchCore=clamp(',
 '        groundcoverPatch*(1.0-0.25*groundcoverPatchContinuity)/0.75,',
 '        0.0,1.0',
 '      );',
 '      float groundcoverReconstructedWeight=groundcoverWeight+',
 '        groundcoverSuitability*groundcoverProtection*',
 '        groundcoverMeadowMosaic*(1.0-groundcoverPatchCore);',
 '      palette=mix(palette,groundcoverTone,groundcoverReconstructedWeight);'
].join('\n');
const gitBlob=s=>crypto.createHash('sha1').update('blob '+Buffer.byteLength(s)+'\0'+s).digest('hex');
const smoothstep=(a,b,x)=>{let t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};
const mix3=(a,b,t)=>a.map((x,i)=>x+(b[i]-x)*t);
function sample(organic,macro,meso,moist,eligible=1) {
 const s=0.78*organic+0.22*meso;
 const p=smoothstep(0.20,0.66,s),c=smoothstep(0.30,0.85,p);
 const old=0.88*p*(1-0.25*c)*eligible;
 const mosaic=(0.19+0.23*macro+0.08*meso+0.07*moist)*(0.70+0.30*organic);
 const core=Math.max(0,Math.min(1,p*(1-0.25*c)/0.75));
 const weight=old+eligible*mosaic*(1-core);
 return {patch:p,old,weight,mosaic,core};
}
test('single reversible composition substitution; all native habitat fields and source identity retained',()=>{
 assert.equal(src.split(replacement).length,2,'one unique reconstructed composition');
 assert.equal(src.includes(baseline),false,'no duplicate old blend');
 assert.equal(gitBlob(src.replace(replacement,baseline)),'85ee835060d5106a670077a5f4352b7ad202b49b');
 for(const field of ['groundcoverPatch=smoothstep(', 'groundcoverWeight=0.88*groundcoverPatch*',
  'groundcoverSuitability*groundcoverProtection;', 'groundcoverMoisture=clamp(', 
  'groundcoverTone*=0.88+0.24*materialVariation;', 'groundcoverProtection=',
  'float groundcoverPatchContinuity=smoothstep(']) assert.ok(src.includes(field),field);
 for(const forbidden of ['texture(', 'noise2(', 'fwidth(', 'discard;', 'gl_', 'newGeometry', 'grassRoots'])assert.ok(!replacement.includes(forbidden),'new sampling/geometry: '+forbidden);
});
test('125 habitat profiles: continuous monotonic coverage response and gradient peak reduced at least 15%',()=>{
 let n=0, worstRatio=0;
 const values=[0,0.25,0.5,0.75,1];
 for(const macro of values)for(const meso of values)for(const moisture of values){
   let oldPrev=null,newPrev=null,oldPeak=0,newPeak=0;
   for(let i=0;i<=1000;i++){
     const x=sample(i/1000,macro,meso,moisture);
     assert.ok(Number.isFinite(x.weight)&&x.weight>=0&&x.weight<=0.66000000000001,'bounded valid coverage');
     assert.ok(x.mosaic>=0.133-1e-12&&x.mosaic<=0.57+1e-12,'no saturation/uniform cover');
     if(oldPrev!==null){
       const a=x.old-oldPrev,b=x.weight-newPrev;
       assert.ok(a>=-1e-12&&b>=-1e-12,'contour reversals prohibited');
       oldPeak=Math.max(oldPeak,a);newPeak=Math.max(newPeak,b);
     }
     oldPrev=x.old;newPrev=x.weight;
   }
   assert.ok(oldPeak>0,'baseline transition exists');
   const ratio=newPeak/oldPeak;worstRatio=Math.max(ratio,worstRatio);
   assert.ok(ratio<0.85,'peak gradient regression ratio='+ratio);
   n++;
 }
 assert.equal(n,125);
 assert.ok(worstRatio>0,'gradient comparison populated');
});
test('substantial eligible understorey while bare exclusions and dark cores remain exact',()=>{
 const soils=[[0.390,0.248,0.148],[0.520,0.440,0.270],[0.300,0.235,0.155],[0.235,0.188,0.130]];
 const tones=[[0.110,0.118,0.075],[0.075,0.090,0.055],[0.175,0.150,0.095]];
 let maxima=0,improved=0;
 for(const soil of soils)for(const tone of tones){
  for(const organic of [0,0.1,0.35,0.5,0.7,1]){
   const x=sample(organic,0.65,0.45,0.4,1);
   const old=mix3(soil,tone,x.old),fresh=mix3(soil,tone,x.weight);
   maxima=Math.max(maxima,...fresh.map((v,i)=>Math.abs(v-old[i])*255));
   assert.ok(fresh.every(v=>v>=0&&v<=1&&Number.isFinite(v)),'bounded RGB');
   if(x.weight>x.old+0.12)improved++;
  }
  for(const eligible of [0]){
   for(const organic of [0,0.4,1]){
    const x=sample(organic,0.65,0.45,0.4,eligible);
    assert.equal(x.weight,0,'no vegetation on ineligible terrain');
    assert.deepEqual(mix3(soil,tone,x.weight),soil,'native soil untouched when protected/ineligible');
   }
  }
  const core=sample(1,0.65,0.45,0.4,1);
  assert.ok(core.patch===1&&core.core===1);
  assert.ok(Math.abs(core.weight-core.old)<=1e-12,'original dark olive core exact');
 }
 assert.ok(improved>0,'must significantly expand coverage on eligible terrain');
 assert.ok(maxima>12,'must exceed previous 4/255 subtle bridge effect; max RGB shift '+maxima);
});
test('no new threshold, physical blade count, draw pipeline, or world-space geometry',()=>{
 assert.ok(!replacement.includes('smoothstep('),'no threshold displacement');
 assert.ok(!replacement.includes('texture(')&&!replacement.includes('noise2('),'no new texture reads');
 assert.ok(!replacement.includes('draw(')&&!replacement.includes('geometry'),'no new geometry pipeline');
 assert.ok(replacement.includes('groundcoverSuitability*groundcoverProtection*'),'existing habitat masks preserved');
 assert.ok(replacement.includes('groundcoverMeadowMosaic*(1.0-groundcoverPatchCore)'),'native core preserved');
});
