const POLICY_ID='AUDRALIA_FINAL_CLOUD_SHADER_COMPOSITION_v1';
const nativeShaderSource=WebGL2RenderingContext.prototype.shaderSource;
const importedWrappers=[];
let captureSource=null;
let composedCloudShaders=0;
let rejectedCloudShaders=0;
let finalShaderSha256=null;
let finalShaderLength=0;
let finalStageEvidence=null;
let finalAblationMode='NONE';
let digestGeneration=0;

const CLOUD_SIGNATURES=Object.freeze([
  'globalCloudSupport',
  'vec3 densityAt(vec3 p)',
  'uSysA[8]'
]);
const REQUIRED_STAGES=Object.freeze([
  'FAP1_ORGANIZED_WEATHER_V6',
  'XYZ_VOLUMETRIC_DEPTH_V2',
  'ACF1_PRESENTATION_V3',
  'DIRECT_DENSITY_V4'
]);

function isCloudShader(source){
  return typeof source==='string'&&CLOUD_SIGNATURES.every(token=>source.includes(token));
}

function replaceExactlyOnce(source,target,replacement,label){
  const first=source.indexOf(target);
  if(first<0)throw new Error(`FINAL_CLOUD_SHADER_REQUIRED_MUTATION_MISSING:${label}`);
  if(source.indexOf(target,first+target.length)>=0)throw new Error(`FINAL_CLOUD_SHADER_MUTATION_AMBIGUOUS:${label}`);
  return source.slice(0,first)+replacement+source.slice(first+target.length);
}

function stageEvidence(source){
  const stages={
    FAP1_ORGANIZED_WEATHER_V6:Object.freeze({
      contract:'V6_WEATHER_AND_COVERAGE_DENSITY_PRESENT_IN_FINAL_DENSITY_AT',
      requiredMutationCount:6,
      observedMutationCount:[
        'vec3 fap1OrganizedWeather(vec3 radial,float h,float lat,float lon)',
        'cirrusFields=',
        'cirrostratus=',
        'altocumulus=',
        'fap1ClearCorridor(',
        'mass=background+fap1.x'
      ].filter(token=>source.includes(token)).length
    }),
    XYZ_VOLUMETRIC_DEPTH_V2:Object.freeze({
      contract:'ACCEPTED_24057_DEEP_VOLUME_EFFECTS_PRESENT',
      requiredMutationCount:4,
      observedMutationCount:[
        'OUTER=6405.0,OCCLUDER=6205.0',
        'float fap1DepthPocket(',
        'vec3 fap1Center=fap1OrganizedWeather(',
        'float volumeLo=max(10.0,nativeCenter-nativeSpan*.5*zScale-extraBelow)'
      ].filter(token=>source.includes(token)).length
    }),
    ACF1_PRESENTATION_V3:Object.freeze({
      contract:'ACCEPTED_24057_ACTIVE_ACF1_EFFECTS_PRESERVED',
      requiredMutationCount:3,
      observedMutationCount:[
        'float systemAngle=atan(xy.y,xy.x);',
        'col=mix(col,vec3(.96,.985,1.0),cloudSample.y*.21);',
        'col+=vec3(1.0,.96,.86)*forward*.18; col*=1.0-.25*cloudSample.z;'
      ].filter(token=>source.includes(token)).length,
      historicalDormantTargets:Object.freeze([
        'IRREGULAR_MORPHOLOGY_BOUNDARY_SOURCE_PATTERN_DID_NOT_MATCH_ACCEPTED_RENDERER',
        'DARK_CORE_SOURCE_PATTERN_DID_NOT_MATCH_ACCEPTED_RENDERER',
        'ORGANIZED_BOOST_SUPERSEDED_BY_XYZ_DENSITY_REWRITE',
        'ACF1_GLOBAL_SUPPORT_SUPERSEDED_BY_XYZ_THEN_DIRECT_DENSITY',
        'ACF1_EXTINCTION_SUPERSEDED_BY_XYZ_DEEP_VOLUME_OPACITY'
      ])
    }),
    DIRECT_DENSITY_V4:Object.freeze({
      contract:'ALL_THREE_DIRECT_DENSITY_EFFECTS_PRESENT_AFTER_XYZ',
      requiredMutationCount:3,
      observedMutationCount:[
        'halfWidth*0.920,halfWidth*2.350',
        'float broken=smoothstep(0.300,0.580,broad*.72+detail*.28+.075*lonWave);',
        'AUDRALIA_FINAL_DIRECT_DENSITY_SUPPORT_v1'
      ].filter(token=>source.includes(token)).length
    })
  };
  const failures=[];
  for(const id of REQUIRED_STAGES){
    const stage=stages[id];
    if(stage.observedMutationCount!==stage.requiredMutationCount)failures.push(`${id}:${stage.observedMutationCount}/${stage.requiredMutationCount}`);
  }
  return Object.freeze({stages:Object.freeze(stages),failures:Object.freeze(failures),pass:failures.length===0});
}

function applyFinalReconciliation(source){
  let next=source;
  next=replaceExactlyOnce(
    next,
    'return clamp(climate*broken*clearSlot*.205,0.0,.215);',
    'float regionalVariance=.700+.300*(.5+.5*sin(lon*2.4+lat*3.1+t*.21));return clamp(climate*broken*clearSlot*regionalVariance*.940,0.0,.840);/*AUDRALIA_FINAL_DIRECT_DENSITY_SUPPORT_v1*/',
    'DIRECT_DENSITY_SUPPORT_AFTER_XYZ'
  );

  const ablate=new URLSearchParams(globalThis.location?.search||'').get('cloudAblation');
  if(ablate==='v6'){
    const pairs=[
      ['mass+=cirrusFields;','mass+=0.0*cirrusFields;'],
      ['ice+=cirrusFields*.997;','ice+=0.0*cirrusFields*.997;'],
      ['mass+=cirrostratus;','mass+=0.0*cirrostratus;'],
      ['ice+=cirrostratus*.992;','ice+=0.0*cirrostratus*.992;'],
      ['mass+=altocumulus;','mass+=0.0*altocumulus;'],
      ['ice+=altocumulus*.22;','ice+=0.0*altocumulus*.22;'],
      ['precip+=altocumulus*.035;','precip+=0.0*altocumulus*.035;']
    ];
    for(const [from,to] of pairs)next=replaceExactlyOnce(next,from,to,`V6_ABLATION_${from}`);
    finalAblationMode='V6_FIELDS_ABLATED';
  }else{
    finalAblationMode='NONE';
  }

  next=`/* ${POLICY_ID} */\n/* SINGLE_VOLUMETRIC_PASS_PRESERVED */\n${next}`;
  const evidence=stageEvidence(next);
  if(!evidence.pass)throw new Error(`FINAL_CLOUD_SHADER_STAGE_INCOMPLETE:${evidence.failures.join(',')}`);
  return Object.freeze({source:next,evidence});
}

function captureSink(_shader,source){
  captureSource=source;
}

async function importWrapper(label,url){
  await import(url);
  importedWrappers.push(Object.freeze({label,installed:WebGL2RenderingContext.prototype.shaderSource!==captureSink}));
}

function scheduleSha256(source){
  const generation=++digestGeneration;
  finalShaderSha256=null;
  crypto.subtle.digest('SHA-256',new TextEncoder().encode(source)).then(buffer=>{
    if(generation!==digestGeneration)return;
    finalShaderSha256=[...new Uint8Array(buffer)].map(byte=>byte.toString(16).padStart(2,'0')).join('');
  }).catch(error=>{
    console.error('AUDRALIA_FINAL_CLOUD_SHADER_SHA256_FAILED',error);
  });
}

WebGL2RenderingContext.prototype.shaderSource=captureSink;
let composedWrapper;
try{
  // Preserve the accepted 24057 wrapper lineage. Execution order is the reverse
  // of installation order: FAP1 -> XYZ -> ACF1 -> DIRECT_DENSITY. The compositor
  // captures that complete result and reconciles only the proven silent collision.
  await importWrapper('DIRECT_DENSITY_V4','./fap1-orbital-support-tuning-v1.mjs?cb=FINAL_COMPOSITION_v1');
  await importWrapper('ACF1_PRESENTATION_V3','/inspection/audralia-24057-exact/snapshot/showroom/globe/audralia/acf1-cloud-presentation-v1.mjs?cb=FINAL_COMPOSITION_v1');
  await importWrapper('XYZ_VOLUMETRIC_DEPTH_V2','/inspection/audralia-24057-exact/snapshot/showroom/globe/audralia/fap1-xyz-volumetric-depth-v1.mjs?cb=FINAL_COMPOSITION_v1');
  await importWrapper('FAP1_ORGANIZED_WEATHER_V6','/inspection/audralia-24057-exact/snapshot/showroom/globe/audralia/fap1-weather-presentation-v1.mjs?cb=FINAL_COMPOSITION_v1');
  composedWrapper=WebGL2RenderingContext.prototype.shaderSource;
}finally{
  WebGL2RenderingContext.prototype.shaderSource=nativeShaderSource;
}

if(typeof composedWrapper!=='function'||composedWrapper===captureSink||composedWrapper===nativeShaderSource){
  throw new Error('FINAL_CLOUD_SHADER_COMPOSED_WRAPPER_MISSING');
}

WebGL2RenderingContext.prototype.shaderSource=function(shader,source){
  if(!isCloudShader(source))return nativeShaderSource.call(this,shader,source);
  captureSource=null;
  composedWrapper.call(this,shader,source);
  if(typeof captureSource!=='string'){
    rejectedCloudShaders++;
    throw new Error('FINAL_CLOUD_SHADER_CAPTURE_FAILED');
  }
  const final=applyFinalReconciliation(captureSource);
  finalStageEvidence=final.evidence;
  finalShaderLength=final.source.length;
  composedCloudShaders++;
  scheduleSha256(final.source);
  return nativeShaderSource.call(this,shader,final.source);
};

Object.defineProperty(globalThis,'__AUDRALIA_FINAL_CLOUD_SHADER_COMPOSITION__',{value:Object.freeze({
  policyId:POLICY_ID,
  architecture:'ONE_AUTHORITATIVE_PRE_RENDER_SHADER_COMPOSITOR',
  importedWrappers:Object.freeze(importedWrappers),
  requiredStages:REQUIRED_STAGES,
  singleVolumetricPassPreserved:true,
  additionalRenderPasses:0,
  additionalCanvases:0,
  rayMarchCeilingsChanged:false,
  pixelCeilingsChanged:false,
  getRuntimeEvidence:()=>Object.freeze({
    composedCloudShaders,
    rejectedCloudShaders,
    finalShaderSha256,
    finalShaderLength,
    finalAblationMode,
    finalStageEvidence,
    sourceModuleEvidence:Object.freeze({
      directDensity:globalThis.__AUDRALIA_FAP1_ORBITAL_SUPPORT_TUNING__?.getRuntimeEvidence?.()||null,
      acf1:globalThis.__AUDRALIA_ACF1_PRESENTATION__?.getRuntimeEvidence?.()||null,
      xyz:globalThis.__AUDRALIA_FAP1_XYZ_VOLUMETRIC_DEPTH__?.getRuntimeEvidence?.()||null,
      fap1:globalThis.__AUDRALIA_FAP1_ORGANIZED_WEATHER_PRESENTATION__?.getRuntimeEvidence?.()||null
    })
  })
}),writable:false,configurable:false});
