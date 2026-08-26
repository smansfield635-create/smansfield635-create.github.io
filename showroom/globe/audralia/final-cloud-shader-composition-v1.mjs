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
  'DIRECT_DENSITY_V4',
  'FINAL_DENSITY_EXPANSION_V1'
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
    }),
    FINAL_DENSITY_EXPANSION_V1:Object.freeze({
      contract:'ADDITIONAL_CLOUD_MASS_IN_SAME_FINAL_DENSITY_AT_FIELD',
      requiredMutationCount:4,
      observedMutationCount:[
        'AUDRALIA_FINAL_DENSITY_CLOUD_EXPANSION_v1',
        'float fdxEnvelope=',
        'float fdxMass=',
        'float fdxHigh='
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

  const finalDensityTail='if(mass<=.0001)return vec3(0.0);return vec3(min(mass,1.6),clamp(iceMass/mass,0.0,1.0),clamp(precipMass/mass,0.0,1.0));';
  const finalDensityExpansion=`/* AUDRALIA_FINAL_DENSITY_CLOUD_EXPANSION_v1 */
  float fdxLonA=atan(sin(lon-2.530727),cos(lon-2.530727));
  float fdxLonB=atan(sin(lon+2.757620),cos(lon+2.757620));
  float fdxLonC=atan(sin(lon-2.234021),cos(lon-2.234021));
  float fdxLonD=atan(sin(lon+.383972),cos(lon+.383972));
  float fdxLonE=atan(sin(lon-.139626),cos(lon-.139626));
  float fdxLonF=atan(sin(lon+2.530727),cos(lon+2.530727));
  float fdxA=1.0-smoothstep(.82,1.14,length(vec2(fdxLonA*.905/.92,(lat-.314159)/.50)));
  float fdxB=1.0-smoothstep(.80,1.13,length(vec2(fdxLonB*.970/.88,(lat+.244346)/.48)));
  float fdxC=1.0-smoothstep(.82,1.15,length(vec2(fdxLonC*.788/.90,(lat+.663225)/.46)));
  float fdxD=1.0-smoothstep(.78,1.12,length(vec2(fdxLonD*.574/.84,(lat+.959931)/.38)));
  float fdxE=1.0-smoothstep(.80,1.13,length(vec2(fdxLonE*.469/.86,(lat-1.082104)/.34)));
  float fdxF=1.0-smoothstep(.83,1.16,length(vec2(fdxLonF*.998/.94,(lat-.069813)/.52)));
  float fdxEnvelope=max(max(max(fdxA,fdxB),max(fdxC,fdxD)),max(fdxE,fdxF));
  float fdxWaveA=.5+.5*sin(lon*11.0+lat*15.0+uTimeHours*.026);
  float fdxWaveB=.5+.5*sin(lon*23.0-lat*9.0-uTimeHours*.018);
  float fdxWaveC=.5+.5*sin(lon*37.0+lat*5.0+uTimeHours*.011);
  float fdxBroken=smoothstep(.31,.69,fdxWaveA*.47+fdxWaveB*.34+fdxWaveC*.19);
  float fdxLow=smoothstep(22.0,32.0,h)*(1.0-smoothstep(62.0,74.0,h));
  float fdxMid=smoothstep(43.0,54.0,h)*(1.0-smoothstep(84.0,96.0,h));
  float fdxHigh=smoothstep(68.0,79.0,h)*(1.0-smoothstep(108.0,120.0,h));
  float fdxMass=fdxEnvelope*(.24+.76*fdxBroken)*(fdxLow*.94+fdxMid*.68+fdxHigh*.44);
  mass+=fdxMass*.88;
  iceMass+=fdxMass*(fdxMid*.20+fdxHigh*.92);
  precipMass+=fdxMass*fdxLow*.065;
  ${finalDensityTail}`;
  next=replaceExactlyOnce(next,finalDensityTail,finalDensityExpansion,'FINAL_DENSITY_CLOUD_EXPANSION');

  const ablate=new URLSearchParams(globalThis.location?.search||'').get('cloudAblation');
  if(ablate==='finalExpansion'){
    const pairs=[
      ['mass+=fdxMass*.88;','mass+=0.0*fdxMass*.88;'],
      ['iceMass+=fdxMass*(fdxMid*.20+fdxHigh*.92);','iceMass+=0.0*fdxMass*(fdxMid*.20+fdxHigh*.92);'],
      ['precipMass+=fdxMass*fdxLow*.065;','precipMass+=0.0*fdxMass*fdxLow*.065;']
    ];
    for(const [from,to] of pairs)next=replaceExactlyOnce(next,from,to,`FINAL_DENSITY_ABLATION_${from}`);
    finalAblationMode='FINAL_DENSITY_EXPANSION_ABLATED';
  }else if(ablate==='v6'){
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

  const versionMatch=next.match(/^#version 300 es(?:\r?\n|$)/);
  if(!versionMatch)throw new Error('FINAL_CLOUD_SHADER_GLSL_VERSION_NOT_FIRST_LINE');
  const banner=`/* ${POLICY_ID} */\n/* SINGLE_VOLUMETRIC_PASS_PRESERVED */\n/* SAME_FINAL_DENSITY_FIELD_EXPANDED */\n`;
  next=next.slice(0,versionMatch[0].length)+banner+next.slice(versionMatch[0].length);
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
  // captures that complete result, then adds coverage to the same final densityAt
  // field immediately before its inherited return.
  await importWrapper('DIRECT_DENSITY_V4','./fap1-orbital-support-tuning-v1.mjs?cb=FINAL_COMPOSITION_v1');
  await importWrapper('ACF1_PRESENTATION_V3','./acf1-cloud-presentation-v1.mjs?cb=FINAL_COMPOSITION_v1');
  await importWrapper('XYZ_VOLUMETRIC_DEPTH_V2','./fap1-xyz-volumetric-depth-v1.mjs?cb=FINAL_COMPOSITION_v1');
  await importWrapper('FAP1_ORGANIZED_WEATHER_V6','./fap1-weather-presentation-v1.mjs?cb=FINAL_COMPOSITION_v1');
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
  finalDensityExpansion:true,
  sameFinalDensityField:true,
  expansionEnvelopeCount:6,
  expansionUsesAdditionalFbm:false,
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
