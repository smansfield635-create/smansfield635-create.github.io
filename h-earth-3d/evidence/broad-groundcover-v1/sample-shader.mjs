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
const evaluate=new Function('input','smoothstep','clamp','max','length','vec2','distance',`const {x,z,vCoastDistanceMeters,slope,rockExposure,macroField,mesoField,moistShelter,terrainWetness,slopeResponse}=input;${expressions}\nreturn {weight:groundcoverWeight,patch:groundcoverPatch,suitability:groundcoverSuitability,protection:groundcoverProtection,moisture:groundcoverMoisture,dry:groundcoverDry};`);
export function sample(overrides={}){
 const input={x:220,z:-360,vCoastDistanceMeters:140,slope:0.04,rockExposure:0.08,macroField:0.62,mesoField:0.55,moistShelter:0.30,terrainWetness:0.10,slopeResponse:0.05,...overrides};
 return evaluate(input,smoothstep,clamp,Math.max,a=>Math.hypot(...a),(...a)=>a,(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]));
}
