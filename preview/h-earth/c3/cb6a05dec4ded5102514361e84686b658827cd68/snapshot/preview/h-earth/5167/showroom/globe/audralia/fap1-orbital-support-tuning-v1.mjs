const POLICY_ID='AUDRALIA_FAP1_ORBITAL_SUPPORT_TUNING_v1';
const previousShaderSource=WebGL2RenderingContext.prototype.shaderSource;
let patched=0;
let rejected=0;

const CLIMATE_BAND_TARGET='float climateBand(float lat,float center,float halfWidth){return 1.0-smoothstep(halfWidth*.58,halfWidth,abs(lat-center));}';
const CLIMATE_BAND_REPLACEMENT='float climateBand(float lat,float center,float halfWidth){return 1.0-smoothstep(halfWidth*.72,halfWidth*1.48,abs(lat-center));}';
const BROKEN_TARGET='float broken=smoothstep(.50,.70,broad*.72+detail*.28+.075*lonWave);';
const BROKEN_REPLACEMENT='float broken=smoothstep(.41,.66,broad*.72+detail*.28+.075*lonWave);';
const SUPPORT_TARGET='return clamp(climate*broken*clearSlot*.38,0.0,.34);';
const SUPPORT_REPLACEMENT='return clamp(climate*broken*clearSlot*.52,0.0,.46);';

function patchOrbitalSupport(source){
  if(typeof source!=='string'||!source.includes('float globalCloudSupport')||!source.includes(CLIMATE_BAND_TARGET))return source;
  let next=source.replace(CLIMATE_BAND_TARGET,CLIMATE_BAND_REPLACEMENT);
  if(next.includes(BROKEN_TARGET))next=next.replace(BROKEN_TARGET,BROKEN_REPLACEMENT);
  if(next.includes(SUPPORT_TARGET))next=next.replace(SUPPORT_TARGET,SUPPORT_REPLACEMENT);
  if(next!==source)patched++;else rejected++;
  return next;
}

WebGL2RenderingContext.prototype.shaderSource=function(shader,source){
  return previousShaderSource.call(this,shader,patchOrbitalSupport(source));
};

Object.defineProperty(globalThis,'__AUDRALIA_FAP1_ORBITAL_SUPPORT_TUNING__',{value:Object.freeze({
  policyId:POLICY_ID,
  volumetricFieldOnly:true,
  addedNoiseEvaluations:0,
  addedRaymarchSteps:0,
  screenOverlay:false,
  uniformHaze:false,
  preservesExistingBrokenField:true,
  preservesClearSlots:true,
  preservesCamera:true,
  preservesNavigation:true,
  targetVisibleOrbitalCoverage:.70,
  getRuntimeEvidence:()=>Object.freeze({patchedCloudShaders:patched,rejectedCloudShaders:rejected})
}),writable:false,configurable:false});
