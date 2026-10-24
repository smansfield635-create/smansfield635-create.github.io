// Executes the actual scalar expressions extracted from the new GLSL block.
// This numerical check is not shader compilation, GPU timing or visual proof.
import fs from 'node:fs';
export const rendererPath='showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js';
export const root=new URL('../../../',import.meta.url);
export const source=fs.readFileSync(new URL(rendererPath,root),'utf8');
export const blockPattern=/      \/\/ H_EARTH_BROAD_GROUNDCOVER_V1_BEGIN\n[\s\S]*?      \/\/ H_EARTH_BROAD_GROUNDCOVER_V1_END\n/g;
export const block=source.match(blockPattern)?.[0];
if(!block || source.match(blockPattern).length!==1)throw Error('GROUNDCOVER_BLOCK_IDENTITY');
const grove=source.match(/float protectedGrove=[\s\S]*?;/)?.[0];
const scalar=block.slice(0,block.indexOf('      vec3 groundcoverTone='));
const expressions=(grove+'\n'+scalar).replace(/\/\/[^\n]*/g,'').replace(/\bfloat\b/g,'const').replaceAll('world.x','x').replaceAll('world.y','z').replace(/distance\(\s*world,/g,'distance(vec2(x,z),');
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export const smoothstep=(a,b,x)=>{const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t);};
// Bind the CPU double noise adapter to the exact resident GLSL implementation.
// If shader hash/noise arithmetic changes, this adapter must be reviewed again.
const expectedNoise=`float hash21(vec2 p){
  p=fract(p*vec2(123.34,456.21));
  p+=dot(p,p+45.32);
  return fract(p.x*p.y);
}
float noise2(vec2 p){
  vec2 i=floor(p),f=fract(p);
  f=f*f*(3.0-2.0*f);
  return mix(mix(hash21(i),hash21(i+vec2(1.0,0.0)),f.x),
             mix(hash21(i+vec2(0.0,1.0)),hash21(i+vec2(1.0,1.0)),f.x),f.y);
}`;
if(!source.includes(expectedNoise))throw Error('NOISE_ADAPTER_SOURCE_DRIFT');
const fract=x=>x-Math.floor(x),mix=(a,b,t)=>a+(b-a)*t;
export function noise2([x,z]){
 const hash=(x,z)=>{x=fract(x*123.34);z=fract(z*456.21);const d=x*(x+45.32)+z*(z+45.32);return fract((x+d)*(z+d));};
 const i=Math.floor(x),j=Math.floor(z),u=smoothstep(0,1,fract(x)),v=smoothstep(0,1,fract(z));
 return mix(mix(hash(i,j),hash(i+1,j),u),mix(hash(i,j+1),hash(i+1,j+1),u),v);
}
// Translate actual source field declarations, including their frequencies/offsets.
const fieldSource=['broad','macroField','mesoField'].map(name=>{
 const line=source.match(new RegExp('float '+name+'=noise2\\(world\\*[^;]+;'))?.[0];
 if(!line)throw Error('MISSING_FIELD_'+name);
 return line.replace('float ','const ').replace(/world\*([0-9.]+)(?:\+vec2\(([^,]+),([^)]+)\))?/,(_,f,a='0',b='0')=>`[x*${f}+(${a}),z*${f}+(${b})]`);
}).join('\n');
const evaluateFields=new Function('x','z','noise2',fieldSource+'return {broad,macroField,mesoField};');
export const fieldsAt=(x,z)=>evaluateFields(x,z,noise2);
const evaluate=new Function('input','smoothstep','clamp','max','length','vec2','distance','noise2',`const {x,z,vCoastDistanceMeters,slope,rockExposure,macroField,mesoField,moistShelter,terrainWetness,slopeResponse,broad}=input;${expressions}\nreturn {weight:groundcoverWeight,patch:groundcoverPatch,suitability:groundcoverSuitability,protection:groundcoverProtection,moisture:groundcoverMoisture,dry:groundcoverDry};`);
export function sample(overrides={}){
 const x=overrides.x??220,z=overrides.z??-360;
 const input={x,z,vCoastDistanceMeters:140,slope:0.04,rockExposure:0.08,...fieldsAt(x,z),moistShelter:0.30,terrainWetness:0.10,slopeResponse:0.05,...overrides};
 return evaluate(input,smoothstep,clamp,Math.max,a=>Math.hypot(...a),(...a)=>a,(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]),overrides.noise2??noise2);
}
