import {buildFAP1GPUWeatherPacket} from './fap1-gpu-weather-descriptors.mjs';
import {buildFAP1SpatialWeatherObjects,evaluateFAP1SpatialLOD} from './fap1-spatial-lod.gb.mjs';

const packet=buildFAP1GPUWeatherPacket({canonicalTimeHours:0});
const objects=buildFAP1SpatialWeatherObjects({packet});
const object=objects.find(o=>o.weatherClass==='LOW_CUMULIFORM')||objects[0];
const up=object.V_i.axisUp,center=object.V_i.center,verticalRadius=object.V_i.radii[1];
const distances=[5600,4300,3500,2800,2200,1700,1450,1200,900,720,400,0];
const samples=distances.map(surfaceDistance=>{
  const eye=center.map((v,i)=>v+up[i]*(verticalRadius+surfaceDistance));
  const forward=up.map(v=>-v);
  const state=evaluateFAP1SpatialLOD(objects,{eye,forward});
  const entry=state.objects.find(e=>e.object.ID_i===object.ID_i);
  return {surfaceDistance,distanceToVolume:entry.distanceToVolume,inside:entry.inside,localPromoted:entry.localPromoted,alpha:entry.alpha};
});
const local=samples.map(x=>x.alpha.l);
const macroState=local.some(v=>v===0);
const overlap=local.some(v=>v>0&&v<.72);
const localDominant=local.some(v=>v>=.72);
const monotonic=local.every((v,i)=>!i||v+1e-9>=local[i-1]);
const distanceAccurate=samples.every(x=>Math.abs(x.distanceToVolume-x.surfaceDistance)<1e-5);
const result={schema:'FAP1_GB_ELLIPSOID_PROMOTION_QUALIFICATION_v1',weatherId:object.ID_i,samples,macroState,overlap,localDominant,monotonic,distanceAccurate,pass:macroState&&overlap&&localDominant&&monotonic&&distanceAccurate};
console.log(JSON.stringify(result,null,2));
if(!result.pass)process.exit(2);
