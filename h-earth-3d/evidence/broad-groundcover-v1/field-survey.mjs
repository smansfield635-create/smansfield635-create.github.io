// CPU double scalar field evidence; no terrain-area, rendered or device claims.
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {root,rendererPath,fieldsAt,sample,smoothstep} from './sample-shader.mjs';
const baseline='68e3a38eb51f43c50fadd019eac9103b69dbe102';
const old=execFileSync('git',['show',baseline+':'+rendererPath],{cwd:root,encoding:'utf8',maxBuffer:4e6});
const expression=old.match(/float groundcoverPatch=([\s\S]*?);/)[1];
const oldPatch=new Function('macroField','mesoField','smoothstep','return '+expression);
export function patchAt(x,z,prior=false){
 if(!prior)return sample({x,z}).patch;
 const {macroField,mesoField}=fieldsAt(x,z);return oldPatch(macroField,mesoField,smoothstep);
}
export function survey(prior=false){
 let n=0,selected=0,axis=0,sum=0,bare=0,covered=0;const hist=Array(18).fill(0),eps=.25;
 for(let z=-1600;z<=-400;z+=2)for(let x=-600;x<=600;x+=2){
  const v=patchAt(x,z,prior);n++;sum+=v;bare+=v<.05;covered+=v>.95;
  if(v<.2||v>.8)continue;
  const gx=patchAt(x+eps,z,prior)-patchAt(x-eps,z,prior),gz=patchAt(x,z+eps,prior)-patchAt(x,z-eps,prior);
  let a=(Math.atan2(gz,gx)*180/Math.PI+180)%180;
  hist[Math.min(17,Math.floor(a/10))]++;selected++;axis+=Math.min(a,Math.abs(a-90),180-a)<10;
 }
 return {samples:n,transitionSamples:selected,axialFraction:axis/selected,uniformAxialFraction:2/9,peakOrientationBinFraction:Math.max(...hist)/selected,meanPatch:sum/n,almostBare:bare/n,almostCovered:covered/n,orientationBins:hist};
}
if(process.argv[1]===fileURLToPath(import.meta.url))console.log(JSON.stringify({baseline:survey(true),candidate:survey(),scope:'Source-derived scalar CPU double field; not rendered scene, actual covered land area, GPU precision or timing evidence'},null,2));
