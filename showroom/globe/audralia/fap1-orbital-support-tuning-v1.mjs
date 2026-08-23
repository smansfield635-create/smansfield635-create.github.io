const POLICY_ID='AUDRALIA_FAP1_ORBITAL_SUPPORT_SWEEP_v3_60_MODELS';
const previousShaderSource=WebGL2RenderingContext.prototype.shaderSource;
let patched=0;
let rejected=0;

const params=new URLSearchParams(location.search);
const requested=Math.max(1,Math.min(60,Number.parseInt(params.get('cloudModel')||'1',10)||1));
const widthFactors=[1.35,1.55,1.75,1.95,2.15];
const brokenLows=[.46,.42,.38,.34];
const supportScales=[.50,.66,.82];
const idx=requested-1;
const widthIndex=Math.floor(idx/12);
const brokenIndex=Math.floor((idx%12)/3);
const supportIndex=idx%3;
const widthOuter=widthFactors[widthIndex];
const widthInner=Math.min(.92,widthOuter*.46);
const brokenLow=brokenLows[brokenIndex];
const brokenHigh=Math.min(.76,brokenLow+.25);
const supportScale=supportScales[supportIndex];
const supportMax=Math.min(.78,.36+supportScale*.46);
const varianceFloor=.58+supportIndex*.08;
const varianceAmp=1.0-varianceFloor;

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

document.documentElement.dataset.cloudModel=String(requested);
document.documentElement.dataset.cloudModelWidth=fmt(widthOuter);
document.documentElement.dataset.cloudModelBroken=fmt(brokenLow);
document.documentElement.dataset.cloudModelSupport=fmt(supportScale);

Object.defineProperty(globalThis,'__AUDRALIA_FAP1_ORBITAL_SUPPORT_TUNING__',{value:Object.freeze({
  policyId:POLICY_ID,
  model:requested,
  parameterization:Object.freeze({widthInner,widthOuter,brokenLow,brokenHigh,supportScale,supportMax,varianceFloor}),
  sweepSize:60,
  finalScreenQualificationRequired:true,
  framebufferCoverageIsNotAuthority:true,
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
