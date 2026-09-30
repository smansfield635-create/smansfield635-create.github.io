const POLICY_ID='AUDRALIA_FAP1_ORBITAL_SUPPORT_DIRECT_DENSITY_v4';
const previousShaderSource=WebGL2RenderingContext.prototype.shaderSource;
let patched=0;
let rejected=0;

const widthOuter=2.35;
const widthInner=.92;
const brokenLow=.30;
const brokenHigh=.58;
const supportScale=.94;
const supportMax=.84;
const varianceFloor=.70;
const varianceAmp=.30;

const CLIMATE_BAND_TARGET='float climateBand(float lat,float center,float halfWidth){return 1.0-smoothstep(halfWidth*.58,halfWidth,abs(lat-center));}';
const BROKEN_TARGET='float broken=smoothstep(.50,.70,broad*.72+detail*.28+.075*lonWave);';
const SUPPORT_TARGET='return clamp(climate*broken*clearSlot*.38,0.0,.34);';

const fmt=n=>Number(n).toFixed(3);
const CLIMATE_BAND_REPLACEMENT=`float climateBand(float lat,float center,float halfWidth){return 1.0-smoothstep(halfWidth*${fmt(widthInner)},halfWidth*${fmt(widthOuter)},abs(lat-center));}`;
const BROKEN_REPLACEMENT=`float broken=smoothstep(${fmt(brokenLow)},${fmt(brokenHigh)},broad*.72+detail*.28+.075*lonWave);`;
const SUPPORT_REPLACEMENT=`float regionalVariance=${fmt(varianceFloor)}+${fmt(varianceAmp)}*(.5+.5*sin(lon*2.4+lat*3.1+t*.21));return clamp(climate*broken*clearSlot*regionalVariance*${fmt(supportScale)},0.0,${fmt(supportMax)});`;

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

document.documentElement.dataset.cloudCoverageMode='DIRECT_DENSE_UPGRADED';
document.documentElement.dataset.cloudModelWidth=fmt(widthOuter);
document.documentElement.dataset.cloudModelBroken=fmt(brokenLow);
document.documentElement.dataset.cloudModelSupport=fmt(supportScale);

Object.defineProperty(globalThis,'__AUDRALIA_FAP1_ORBITAL_SUPPORT_TUNING__',{value:Object.freeze({
  policyId:POLICY_ID,
  mode:'DIRECT_DENSE_UPGRADED',
  parameterization:Object.freeze({widthInner,widthOuter,brokenLow,brokenHigh,supportScale,supportMax,varianceFloor}),
  volumetricFieldOnly:true,
  addedNoiseEvaluations:0,
  addedRaymarchSteps:0,
  screenOverlay:false,
  uniformHaze:false,
  preservesExistingBrokenField:true,
  preservesClearSlots:true,
  preservesCamera:true,
  preservesNavigation:true,
  targetVisibleOrbitalCoverage:.72,
  getRuntimeEvidence:()=>Object.freeze({patchedCloudShaders:patched,rejectedCloudShaders:rejected})
}),writable:false,configurable:false});
