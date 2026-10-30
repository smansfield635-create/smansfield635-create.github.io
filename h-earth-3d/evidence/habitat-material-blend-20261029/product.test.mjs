import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {buildHabitatMaterialPresentation as build,HABITAT_MATERIAL_FILTER,HABITAT_MATERIAL_PROTECTION_GLSL as protection} from '../../../showroom/globe/h-earth/render/habitat-material-presentation.v1.js';
const renderer=fs.readFileSync(new URL('../../../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',import.meta.url),'utf8');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const fixture=(size=32,step=1)=>({size,width:size*3,height:size,bounds:[0,0,size*step,size*step],ravine:{bounds:[100,0,100+size*step,size*step]},coastal:{bounds:[200,0,200+size*step,size*step]},pixels:new Uint8Array(size*size*3)});
const at=(h,p,x,z)=>z*h.width+p*h.size+x;
test('fixed world-space filter and invalid shapes fail explicitly',()=>{
 assert.deepEqual(HABITAT_MATERIAL_FILTER,{sigmaMeters:2,supportMeters:6});
 assert.throws(()=>build({...fixture(),width:1}),/LAYOUT/);
 const h=fixture();h.ravine.bounds[2]=h.ravine.bounds[0];assert.throws(()=>build(h),/BOUNDS/);
});
test('constant panels including zero and full coverage remain constant with no cross-panel contamination',()=>{
 const h=fixture(),levels=[0,127,255];
 for(let p=0;p<3;p++)for(let z=0;z<h.size;z++)for(let x=0;x<h.size;x++)h.pixels[at(h,p,x,z)]=levels[p];
 const before=hash(h.pixels),r=build(h);assert.equal(hash(h.pixels),before);assert.notEqual(r.pixels,h.pixels);
 assert.deepEqual(r.pixels,h.pixels);
});
test('impulse cannot leak beyond six metres along either axis or into another panel',()=>{
 const h=fixture(),mid=16;h.pixels[at(h,0,mid,mid)]=255;const r=build(h);
 for(let p=0;p<3;p++)for(let z=0;z<h.size;z++)for(let x=0;x<h.size;x++)if(p||Math.abs(x-mid)>6||Math.abs(z-mid)>6)assert.equal(r.pixels[at(h,p,x,z)],0);
 assert(r.pixels[at(h,0,mid,mid)]>0);
});
test('interior linear ramp retains slope and extrema remain bounded',()=>{
 const h=fixture();for(let z=0;z<h.size;z++)for(let x=0;x<h.size;x++)h.pixels[at(h,0,x,z)]=x*7;
 const r=build(h);for(let x=6;x<h.size-6;x++)assert.equal(r.pixels[at(h,0,x,16)],x*7);
 assert(Math.min(...r.pixels)>=0);assert(Math.max(...r.pixels)<=217);
});
test('same metric step transition remains consistent across panel resolutions',()=>{
 const make=(size,step)=>{const h=fixture(size,step);for(let z=0;z<size;z++)for(let x=size/2;x<size;x++)h.pixels[at(h,0,x,z)]=255;return [h,build(h)];};
 const [h1,r1]=make(32,1),[h2,r2]=make(64,.5);
 // Coarse cell centres lie between two fine centres; compare at the same world coordinate.
 for(let x=12;x<=19;x++){const a=r1.pixels[at(h1,0,x,16)],b=(r2.pixels[at(h2,0,2*x,32)]+r2.pixels[at(h2,0,2*x+1,32)])/2;assert(Math.abs(a-b)<=2,`${x}: ${a} vs ${b}`);}
 assert.deepEqual(r1.receipt.panels[0].kernelRadiiTexels,[6,6]);assert.deepEqual(r2.receipt.panels[0].kernelRadiiTexels,[12,12]);
});
test('protection is the exact existing continuous grove oasis estate and route expression',()=>{
 const compact=s=>s.replace(/\s/g,'');
 const existing=renderer.slice(renderer.indexOf('      float protectedGrove='),renderer.indexOf('      // Rotate and softly warp'));
 const transformed=existing.replace(/protectedGrove/g,'grove').replace(/groundcoverOasis/g,'oasis').replace(/groundcoverEstate/g,'estate').replace(/groundcoverRoute/g,'route').replace('float groundcoverProtection=','return ');
 for(const variable of ['grove','oasisX','oasisZ','estateX','estateZ','routeT','routeDistance']){
  const expression=new RegExp(`float ${variable}=([\\s\\S]*?);`).exec(transformed)?.[1];assert(expression,variable);assert(compact(protection).includes(compact(`float ${variable}=${expression};`)),variable);
 }
 const expression=/return ([\s\S]*?);/.exec(transformed)?.[1];assert(expression);assert(compact(protection).includes(compact(`return ${expression};`)));
});
test('native roughness and upload preserved; material coverage has separate max and feather per panel',()=>{
 assert(renderer.includes('terrainRoughnessForLighting=mix(terrainRoughnessForLighting,.94,habitatCoverage*.3);'));
 assert(renderer.includes('gl.UNSIGNED_BYTE,installedHabitat.pixels)'));
 assert(renderer.includes('gl.UNSIGNED_BYTE,materialHabitat.pixels)'));
 assert(renderer.includes('habitatCoverage+habitatMaterialProtection(vWorldPosition.xz)*(habitatMaterialCoverage-habitatCoverage)'));
 for(const [uv,bounds,width] of [['habitatUv','uWoodlandHabitatBounds','6.0'],['ravineUv','uRavineHabitatBounds','habitatEdgeWidth'],['coastalUv','uCoastalHabitatBounds','habitatEdgeWidth']]){
  assert(renderer.includes(`texture(uWoodlandHabitat,${uv}).r*habitatEdgeWeight(vWorldPosition.x,vWorldPosition.z,${bounds},${width})`));
  assert(renderer.includes(`texture(uHabitatMaterialPresentation,${uv}).r*habitatEdgeWeight(vWorldPosition.x,vWorldPosition.z,${bounds},${width})`));
 }
 assert(renderer.includes("'uHabitatMaterialPresentation'),12"));
 assert(renderer.indexOf('buildHabitatMaterialPresentation(installedHabitat)')>renderer.indexOf('await createSingleOwnerVegetation('));
});
test('authenticated native coastal target has a materially smaller color-mask jump while source is unchanged',()=>{
 const prefix=new URL('../../../showroom/globe/h-earth/render/assets/precomputed-grass.v1',import.meta.url);
 const manifest=JSON.parse(fs.readFileSync(prefix.pathname+'.json','utf8'));
 const bytes=gunzipSync(fs.readFileSync(prefix.pathname+'.bin.gz'));
 assert.equal(bytes.length,manifest.rawBytes);assert.equal(hash(bytes),manifest.rawSha256);
 const h={...manifest.habitat,pixels:new Uint8Array(bytes.subarray(manifest.rootCount*manifest.stride))};
 const before=hash(h.pixels),i=at(h,2,131,12),j=at(h,2,131,13);assert.deepEqual([h.pixels[i],h.pixels[j]],[0,244]);
 const r=build(h);assert.equal(hash(h.pixels),before);const after=Math.abs(r.pixels[j]-r.pixels[i]);
 assert(after>0&&after<61,`target adjacent jump ${after}`);assert(r.pixels[i]>0);assert(r.pixels[j]<244);
 console.log(JSON.stringify({targetNative:[0,244],targetPresentation:[r.pixels[i],r.pixels[j]],nativeAtlasSha256:before,presentationAtlasSha256:hash(r.pixels),panels:r.receipt.panels}));
});
