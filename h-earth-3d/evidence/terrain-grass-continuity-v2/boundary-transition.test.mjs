import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
const root=new URL('../../../',import.meta.url);
const read=p=>readFileSync(new URL(p,root));
const renderer=read('showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js').toString();
const body=renderer.match(/float habitatEdgeWeight\(float x,float z,vec4 bounds,float width\)\{([^}]+)\}/)[1];
// Evaluate the shipped scalar GLSL arithmetic, not a separate copy of the law.
const smoothstep=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};
const weight=Function('x','z','bounds','width','smoothstep',body.replace(/float /g,'let ').replace(/\bmin\(/g,'Math.min(').replace(/bounds\.([xyzw])/g,(_,c)=>`bounds[${'xyzw'.indexOf(c)}]`));
const manifest=JSON.parse(read('showroom/globe/h-earth/render/assets/precomputed-grass.v1.json'));
test('full-intensity atlas edges join continuously to zero; interiors retain full coverage',()=>{
 for(const bounds of [manifest.habitat.ravine.bounds,manifest.habitat.coastal.bounds]){
  const [x0,z0,x1,z1]=bounds,mx=(x0+x1)/2,mz=(z0+z1)/2;
  for(const width of [4,5.5,7]){
   const at=(x,z)=>weight(x,z,bounds,width,smoothstep);
   for(const edge of [d=>[x0+d,mz],d=>[x1-d,mz],d=>[mx,z0+d],d=>[mx,z1-d]]){
    assert.equal(at(...edge(-.001)),0);assert.equal(at(...edge(0)),0);
    assert(at(...edge(.001))<.000001);assert.equal(at(...edge(width)),1);
    let previous=0;for(let i=0;i<=100;i++){const v=at(...edge(width*i/100));assert(v>=previous&&v<=1);previous=v;}
   }
   assert.equal(at(mx,mz),1);assert.equal(at(x0,z0),0);assert.equal(at(x1,z1),0);
  }
 }
});
test('published atlas contains the seam regression; both affected panels apply fade without losing panel isolation',()=>{
 const raw=gunzipSync(read('showroom/globe/h-earth/render/assets/precomputed-grass.v1.bin.gz'));
 const pixels=raw.subarray(manifest.rootCount*52),n=manifest.habitat.size;
 for(const [panel,label] of [[1,'ravine'],[2,'coastal']]){
  let nonzero=0;for(let z=0;z<n;z++)for(let x=0;x<n;x++)if((x===0||z===0||x===n-1||z===n-1)&&pixels[z*n*3+panel*n+x])nonzero++;
  assert(nonzero>0,'fixture must expose hard edge '+label);
  assert(renderer.includes(`texture(uWoodlandHabitat,${label}Uv).r*habitatEdgeWeight(`));
  assert(renderer.includes(`${label}Uv=clamp(${label}Uv,vec2(uHabitatHalfTexel),vec2(1.0-uHabitatHalfTexel))*uHabitatAtlasScale`));
 }
 assert(renderer.includes('habitatEdgeWidth=4.0+3.0*noise2(vWorldPosition.xz*0.07)'));
});
