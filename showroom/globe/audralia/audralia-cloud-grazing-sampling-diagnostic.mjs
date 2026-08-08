const schema='AUDRALIA_CLOUD_GRAZING_SAMPLING_DIAGNOSTIC_v1';
const proto=globalThis.WebGL2RenderingContext?.prototype;

if(!proto){
  window.__AUDRALIA_CLOUD_GRAZING_SAMPLING_DIAGNOSTIC__=Object.freeze({schema,installed:false,reason:'WEBGL2_PROTOTYPE_UNAVAILABLE'});
}else{
  const original=proto.shaderSource;
  let patched=false;

  proto.shaderSource=function(shader,source){
    if(!patched&&typeof source==='string'&&source.includes('uniform int uStepCount;')&&source.includes('const float OUTER=6308.0;')&&source.includes('vec3 densityAt(vec3 p)')){
      const targetA='float stepCount=max(float(uStepCount),1.0);\n  float stepLen=(t1-t0)/stepCount;';
      const replacementA='float segmentLen=t1-t0;\n  float baseStepCount=max(float(uStepCount),1.0);\n  float grazingStepCount=uFullDetail>.5?ceil(segmentLen/16.0):baseStepCount;\n  float stepCount=min(64.0,max(baseStepCount,grazingStepCount));\n  float stepLen=segmentLen/stepCount;';
      const targetB='for(int s=0;s<36;s++){\n    if(s>=uStepCount||t>t1||alpha>.965)break;';
      const replacementB='for(int s=0;s<64;s++){\n    if(float(s)>=stepCount||t>t1||alpha>.965)break;';
      const next=source.replace(targetA,replacementA).replace(targetB,replacementB);

      if(next!==source&&next.includes('grazingStepCount')&&next.includes('for(int s=0;s<64;s++)')){
        patched=true;
        original.call(this,shader,next);
        proto.shaderSource=original;
        window.__AUDRALIA_CLOUD_GRAZING_SAMPLING_DIAGNOSTIC__=Object.freeze({
          schema,
          installed:true,
          cloudShaderPatched:true,
          interactionStepFloorPreserved:18,
          settledStepFloorPreserved:36,
          settledAdaptiveMaximum:64,
          settledMaximumSampleSpacingAuthoringUnits:16,
          additionalCanvasCreated:false,
          cssFilterUsed:false,
          weatherMorphologyMutated:false,
          densityArchitectureMutated:false,
          diagnosticOnly:true
        });
        return;
      }
    }
    return original.call(this,shader,source);
  };

  window.__AUDRALIA_CLOUD_GRAZING_SAMPLING_DIAGNOSTIC__=Object.freeze({schema,installed:true,cloudShaderPatched:false,diagnosticOnly:true});
}
