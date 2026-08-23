const POLICY_ID='AUDRALIA_FAP1_DEPTH_COST_DECOUPLING_v1';
const previousShaderSource=WebGL2RenderingContext.prototype.shaderSource;
let patched=0;
let rejected=0;

const FIVE_SLICE=`vec3 fap1Center=fap1OrganizedWeather(radial,h,lat,lon);
  vec3 fap1Down1=fap1OrganizedWeather(radial,max(10.0,h-18.0),lat,lon);
  vec3 fap1Down2=fap1OrganizedWeather(radial,max(10.0,h-36.0),lat,lon);
  vec3 fap1Up1=fap1OrganizedWeather(radial,min(198.0,h+20.0),lat,lon);
  vec3 fap1Up2=fap1OrganizedWeather(radial,min(198.0,h+42.0),lat,lon);
  vec3 fap1=(fap1Center*.46+fap1Down1*.17+fap1Down2*.08+fap1Up1*.18+fap1Up2*.11)*.76;`;

const THREE_SLICE=`vec3 fap1Center=fap1OrganizedWeather(radial,h,lat,lon);
  vec3 fap1Down=fap1OrganizedWeather(radial,max(10.0,h-25.0),lat,lon);
  vec3 fap1Up=fap1OrganizedWeather(radial,min(198.0,h+29.0),lat,lon);
  vec3 fap1=(fap1Center*.58+fap1Down*.21+fap1Up*.21)*.82;`;

function patchCost(source){
  if(typeof source!=='string'||!source.includes('fap1OrganizedWeather')||!source.includes('vec3 densityAt(vec3 p)'))return source;
  if(source.includes(FIVE_SLICE)){
    patched++;
    return source.replace(FIVE_SLICE,THREE_SLICE);
  }
  rejected++;
  return source;
}

WebGL2RenderingContext.prototype.shaderSource=function(shader,source){
  return previousShaderSource.call(this,shader,patchCost(source));
};

Object.defineProperty(globalThis,'__AUDRALIA_FAP1_DEPTH_COST_DECOUPLING__',{value:Object.freeze({
  policyId:POLICY_ID,
  organizedWeatherEvaluationsPerDensitySampleBefore:5,
  organizedWeatherEvaluationsPerDensitySampleAfter:3,
  reduction:.40,
  addedNoiseEvaluations:0,
  addedRaymarchSteps:0,
  weatherIdentityMutation:false,
  cameraMutation:false,
  getRuntimeEvidence:()=>Object.freeze({patchedCloudShaders:patched,rejectedCloudShaders:rejected})
}),writable:false,configurable:false});
