const POLICY_ID='AUDRALIA_FAP1_ORBITAL_SUPPORT_TUNING_v3_BOUNDED_STEPS';
const MAX_ORBITAL_STEPS=20;
const previousShaderSource=WebGL2RenderingContext.prototype.shaderSource;
const previousGetUniformLocation=WebGL2RenderingContext.prototype.getUniformLocation;
const previousUniform1i=WebGL2RenderingContext.prototype.uniform1i;
const uniformNames=new WeakMap();
let patched=0;
let rejected=0;
let boundedStepWrites=0;

const CLIMATE_BAND_TARGET='float climateBand(float lat,float center,float halfWidth){return 1.0-smoothstep(halfWidth*.58,halfWidth,abs(lat-center));}';
const CLIMATE_BAND_REPLACEMENT='float climateBand(float lat,float center,float halfWidth){return 1.0-smoothstep(halfWidth*.86,halfWidth*2.04,abs(lat-center));}';
const BROKEN_TARGET='float broken=smoothstep(.50,.70,broad*.72+detail*.28+.075*lonWave);';
const BROKEN_REPLACEMENT='float broken=smoothstep(.34,.60,broad*.72+detail*.28+.075*lonWave);';
const SUPPORT_TARGET='return clamp(climate*broken*clearSlot*.38,0.0,.34);';
const SUPPORT_REPLACEMENT='return clamp(climate*broken*clearSlot*.60,0.0,.54);';

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
WebGL2RenderingContext.prototype.getUniformLocation=function(program,name){
  const location=previousGetUniformLocation.call(this,program,name);
  if(location&&typeof name==='string')uniformNames.set(location,name);
  return location;
};
WebGL2RenderingContext.prototype.uniform1i=function(location,value){
  if(location&&uniformNames.get(location)==='uStepCount'&&Number.isFinite(value)&&value>MAX_ORBITAL_STEPS){
    boundedStepWrites++;
    return previousUniform1i.call(this,location,MAX_ORBITAL_STEPS);
  }
  return previousUniform1i.call(this,location,value);
};

Object.defineProperty(globalThis,'__AUDRALIA_FAP1_ORBITAL_SUPPORT_TUNING__',{value:Object.freeze({
  policyId:POLICY_ID,
  volumetricFieldOnly:true,
  addedNoiseEvaluations:0,
  addedRaymarchSteps:0,
  maximumOrbitalRaymarchSteps:MAX_ORBITAL_STEPS,
  screenOverlay:false,
  uniformHaze:false,
  preservesExistingBrokenField:true,
  preservesClearSlots:true,
  preservesCamera:true,
  preservesNavigation:true,
  targetVisibleOrbitalCoverage:.70,
  tuning:Object.freeze({climateBandOuterScale:2.04,brokenSupportThreshold:[.34,.60],supportScale:.60}),
  getRuntimeEvidence:()=>Object.freeze({patchedCloudShaders:patched,rejectedCloudShaders:rejected,boundedStepWrites})
}),writable:false,configurable:false});
