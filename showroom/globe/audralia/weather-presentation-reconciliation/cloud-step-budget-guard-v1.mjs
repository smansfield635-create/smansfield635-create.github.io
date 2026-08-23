const POLICY_ID='AUDRALIA_CLOUD_STEP_BUDGET_GUARD_v1';
const MAX_STEPS=15;
const originalGetUniformLocation=WebGL2RenderingContext.prototype.getUniformLocation;
const originalUniform1i=WebGL2RenderingContext.prototype.uniform1i;
const uniformNames=new WeakMap();

WebGL2RenderingContext.prototype.getUniformLocation=function(program,name){
  const location=originalGetUniformLocation.call(this,program,name);
  if(location&&typeof name==='string')uniformNames.set(location,name);
  return location;
};

WebGL2RenderingContext.prototype.uniform1i=function(location,value){
  const name=location?uniformNames.get(location):null;
  if(name==='uStepCount'&&Number.isFinite(value)){
    const bounded=Math.max(1,Math.min(MAX_STEPS,Math.trunc(value)));
    return originalUniform1i.call(this,location,bounded);
  }
  return originalUniform1i.call(this,location,value);
};

Object.defineProperty(globalThis,'__AUDRALIA_CLOUD_STEP_BUDGET_GUARD__',{value:Object.freeze({
  policyId:POLICY_ID,
  maximumRayMarchSteps:MAX_STEPS,
  preservesSystemRegistry:true,
  preservesCloudMorphology:true,
  renderMutation:false
}),writable:false,configurable:false});
