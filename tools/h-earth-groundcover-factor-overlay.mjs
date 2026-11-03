import crypto from 'node:crypto';

export const PUBLISHED_RENDERER_SHA256='7ac013645110fc91ac9d454916e30f3cc526b716b0c0ffad4c702e1e44b8bec2';
export const MODES=Object.freeze(['reference-lit','final-unlit','before-groundcover-unlit','after-groundcover-unlit','organic-noise-raw','patch-weight-raw','suitability-raw','protection-raw','coast-suitability-raw','slope-suitability-raw','rock-suitability-raw','groundcover-weight-raw','groundcover-tone-color','final-unlit-no-groundcover','reference-lit-no-groundcover']);
export const MODES_MINIMUM=Object.freeze([0,1,2,3,5,6,7,11,13]);
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
function once(source,needle,replacement){if(source.split(needle).length!==2)throw Error('NON_UNIQUE_SOURCE_ANCHOR:'+needle.slice(0,90));return source.replace(needle,replacement);}
export const G1_A03_BLEND_EXPRESSION=[
 '      palette=(',
 '        ecologicalSoilSubstrate+',
 '        identityWeight*ecologicalIdentityTarget+',
 '        groundcoverWeight*ecologicalGroundcoverTarget',
 '      )/ecologicalDenominator;'
].join('\n');
export function transformPublishedRenderer(original,{strictHash=true,variant='legacy'}={}){
 if(!['legacy','A03_A04'].includes(variant))throw Error('G1_VARIANT_INVALID');
 const originalSha256=hash(original);
 if(strictHash){if(variant!=='legacy')throw Error('G1_EXPLICIT_SOURCE_BINDING_REQUIRED');if(originalSha256!==PUBLISHED_RENDERER_SHA256)throw Error('PUBLISHED_RENDERER_HASH_MISMATCH:'+originalSha256);}
 const start=original.indexOf('const FS = '),end=original.indexOf('// Ordered screen-door coverage',start);
 if(start<0||end<=start)throw Error('FRAGMENT_SCOPE_NOT_IDENTIFIED');
 let fs=original.slice(start,end);
 fs=once(fs,'out vec4 outColor;','out vec4 outColor;\nuniform int uGroundcoverFactorMode;');
 fs=once(fs,'float terrainRoughnessForLighting=0.72;',[
 'float terrainRoughnessForLighting=0.72;',
 '  float probeGCSeen=0.0;',
 '  float probeGCOrganic=0.0,probeGCPatch=0.0,probeGCSuitability=0.0,probeGCProtection=0.0;',
 '  float probeGCCoast=0.0,probeGCSlope=0.0,probeGCRock=0.0,probeGCWeight=0.0;',
 '  vec3 probeGCBefore=vec3(0.0),probeGCAfter=vec3(0.0),probeGCTone=vec3(0.0);'].join('\n'));
  const originalBlend='      palette=mix(palette,groundcoverTone,groundcoverWeight);';
  // Preserve all existing legacy instrumentation byte semantics. The A03
  // branch captures the post-normalization palette rather than a removed mix.
  const a03=variant==='A03_A04';
  const blend=a03?G1_A03_BLEND_EXPRESSION:originalBlend;
  const common=[
    '      probeGCSeen=1.0;',
    '      probeGCOrganic=groundcoverOrganic;',
    '      probeGCPatch=groundcoverPatch;',
    '      probeGCSuitability=groundcoverSuitability;',
    '      probeGCProtection=groundcoverProtection;',
    '      probeGCCoast=smoothstep(28.0,72.0,max(0.0,vCoastDistanceMeters));',
    '      probeGCSlope=1.0-smoothstep(0.12,0.42,slope);',
    '      probeGCRock=1.0-smoothstep(0.18,0.58,rockExposure);',
    '      probeGCWeight=groundcoverWeight;'
  ];
  const before=a03?
    '      probeGCBefore=(ecologicalSoilSubstrate+identityWeight*ecologicalIdentityTarget)/(1.0+identityWeight);':
    '      probeGCBefore=palette;';
  const after=a03?[
    '      probeGCTone=ecologicalGroundcoverTarget;',
    blend,
    '      probeGCAfter=palette;'
  ]:[
    '      probeGCTone=groundcoverTone;',
    '      probeGCAfter=mix(palette,groundcoverTone,groundcoverWeight);',
    '      if(uGroundcoverFactorMode==13||uGroundcoverFactorMode==14)groundcoverWeight=0.0;',
    blend
  ];
  fs=once(fs,blend,[...common,before,...after].join('\n'));
 const gamma='  lit=pow(clamp(lit*1.12,0.0,1.0),vec3(1.0/2.2));';
 fs=once(fs,gamma,[gamma,
 '  if(worldSoilTerrain&&uGroundcoverFactorMode>0){',
 '    int m=uGroundcoverFactorMode;',
 '    if(m==1||m==2||m==3||m==12||m==13){',
 '      vec3 albedo=base;',
 '      if(m==2)albedo=probeGCSeen>0.5?probeGCBefore:base;',
 '      if(m==3)albedo=probeGCSeen>0.5?probeGCAfter:base;',
 '      if(m==12)albedo=probeGCSeen>0.5?probeGCTone:base;',
 '      lit=pow(clamp(albedo*1.12,0.0,1.0),vec3(1.0/2.2));',
 '    }else if(m>=4&&m<=11){',
 '      float factor=0.0;',
 '      if(m==4)factor=probeGCOrganic;',
 '      else if(m==5)factor=probeGCPatch;',
 '      else if(m==6)factor=probeGCSuitability;',
 '      else if(m==7)factor=probeGCProtection;',
 '      else if(m==8)factor=probeGCCoast;',
 '      else if(m==9)factor=probeGCSlope;',
 '      else if(m==10)factor=probeGCRock;',
 '      else factor=probeGCWeight;',
 '      lit=vec3(clamp(factor,0.0,1.0));',
 '    }',
 '  }'].join('\n'));
 let source=original.slice(0,start)+fs+original.slice(end);
 const draw='gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL); gl.disable(gl.CULL_FACE); gl.useProgram(resources.geometryProgram); gl.bindVertexArray(resources.vertexArray);';
 source=once(source,draw,[draw,
 "    {const mode=globalThis.__groundcoverFactorMode??0;",
 "      if(!Number.isInteger(mode)||mode<0||mode>=15)throw Error('GROUNDCOVER_FACTOR_MODE_INVALID');",
 "      const location=gl.getUniformLocation(resources.geometryProgram,'uGroundcoverFactorMode');",
 "      if(location===null)throw Error('GROUNDCOVER_FACTOR_UNIFORM_MISSING');",
 "      gl.uniform1i(location,mode);globalThis.__groundcoverFactorModeApplied=mode;}"].join('\n'));
 return Object.freeze({originalSha256,instrumentedSha256:hash(source),source,modeCount:MODES.length,productDiskMutation:false});
}
export function verifyFramePairs(views,poseNames,selectedModes=MODES_MINIMUM){
 if(!Array.isArray(views)||!Array.isArray(poseNames))throw Error('FRAME_RECEIPT_INVALID');
 for(const pose of poseNames){
   const frames=views.filter(v=>v.pose?.name===pose);
   if(frames.length!==selectedModes.length)throw Error('FRAME_COUNT_MISMATCH:'+pose);
   const ref=frames[0];
   for(const m of selectedModes){
     const matched=frames.filter(v=>v.modeId===m);
     if(matched.length!==1||matched[0].diagnosticApplied!==m)throw Error('MODE_NOT_APPLIED:'+pose+':'+m);
     const view=matched[0];
     if(view.sourceHead!==ref.sourceHead||view.rendererHash!==ref.rendererHash||view.assetSignature!==ref.assetSignature||JSON.stringify(view.lastFrame?.cameraPosition)!==JSON.stringify(ref.lastFrame?.cameraPosition)||view.imageWidth!==ref.imageWidth||view.imageHeight!==ref.imageHeight)throw Error('NONMATCHED_SOURCE_CAMERA_ASSETS:'+pose);
   }
 }
 return true;
}

// Gen3074: read-only ravine habitat stage interception. Existing factor and G1
// modes above are unchanged. Never install this transform in production.
export const RAVINE_HABITAT_PROBE_MODES=Object.freeze([
  'reference-lit',
  'native-habitat-occupancy',
  'filtered-material-habitat-occupancy',
  'effective-habitat-color-weight',
  'before-habitat-unlit',
  'after-habitat-unlit',
  'first-hit-role-byte',
  'first-hit-primitive-24bit',
  'material-minus-native-signed-occupancy',
  'final-lit-without-habitat-color'
]);
export const RAVINE_HABITAT_SOURCE_SHA256='2052a512f15a3851e95d47f00ddc65dd632c146cfa949178d5e05941c176b39d';
export function transformRavineHabitatRenderer(original){
  const sourceHash=hash(original);
  if(sourceHash!==RAVINE_HABITAT_SOURCE_SHA256)throw Error('RAVINE_RENDERER_SOURCE_HASH_MISMATCH:'+sourceHash);
  const begin=original.indexOf('const FS = \`#version 300 es');
  const end=original.indexOf('// Ordered screen-door coverage',begin);
  if(begin<0||end<=begin)throw Error('RAVINE_FRAGMENT_SCOPE_NOT_IDENTIFIED');
  let fs=original.slice(begin,end);
  fs=once(fs,'out vec4 outColor;',[
    'uniform int uRavineHabitatProbeMode;',
    'uniform vec3 uRavineExpectedTargetWorld;',
    'out vec4 outColor;'
  ].join('\n'));
  fs=once(fs,'  vec3 base=max(vBaseColor.rgb,vec3(0.004));',[
    '  vec3 base=max(vBaseColor.rgb,vec3(0.004));',
    '  float ravineNativeHabitat=0.0,ravineFilteredMaterial=0.0,ravineEffectiveColorWeight=0.0;',
    '  vec3 ravineBeforeHabitat=base,ravineAfterHabitat=base;'
  ].join('\n'));
  fs=once(fs,'    base=mix(base,habitatSoil,habitatColorCoverage*.68);',[
    '    ravineNativeHabitat=habitatCoverage;',
    '    ravineFilteredMaterial=habitatMaterialCoverage;',
    '    ravineEffectiveColorWeight=habitatColorCoverage*.68;',
    '    ravineBeforeHabitat=base;',
    '    ravineAfterHabitat=mix(base,habitatSoil,habitatColorCoverage*.68);',
    '    if(uRavineHabitatProbeMode!=9)base=ravineAfterHabitat;'
  ].join('\n'));
  fs=once(fs,'  outColor=vec4(lit,outputAlpha);',[
    '  if(uRavineHabitatProbeMode>0){',
    '    int m=uRavineHabitatProbeMode;',
    '    if(m==1)lit=vec3(clamp(ravineNativeHabitat,0.0,1.0));',
    '    else if(m==2)lit=vec3(clamp(ravineFilteredMaterial,0.0,1.0));',
    '    else if(m==3)lit=vec3(clamp(ravineEffectiveColorWeight,0.0,1.0));',
    '    else if(m==4||m==5){',
    '      vec3 albedo=(m==4)?ravineBeforeHabitat:ravineAfterHabitat;',
    '      lit=pow(clamp(albedo*1.12,0.0,1.0),vec3(1.0/2.2));',
    '    }else if(m==6)lit=vec3(float(vRoleCode&255u)/255.0,clamp(length(vWorldPosition-uRavineExpectedTargetWorld)/2.0,0.0,1.0),0.0);',
    '    else if(m==7)lit=vec3(float((vPrimitiveIndex>>16u)&255u),float((vPrimitiveIndex>>8u)&255u),float(vPrimitiveIndex&255u))/255.0;',
    '    else if(m==8){',
    '      float difference=ravineFilteredMaterial-ravineNativeHabitat;',
    '      lit=vec3(max(difference,0.0),max(-difference,0.0),0.0);',
    '    }',
    '  }',
    '  outColor=vec4(lit,uRavineHabitatProbeMode>0?1.0:outputAlpha);'
  ].join('\n'));
  let source=original.slice(0,begin)+fs+original.slice(end);
  const draw='gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL); gl.disable(gl.CULL_FACE); gl.useProgram(resources.geometryProgram); gl.bindVertexArray(resources.vertexArray);';
  source=once(source,draw,[draw,
    "    {const mode=globalThis.__ravineHabitatProbeMode??0;",
    "      if(!Number.isInteger(mode)||mode<0||mode>=10)throw Error('RAVINE_HABITAT_PROBE_MODE_INVALID');",
    "      const location=gl.getUniformLocation(resources.geometryProgram,'uRavineHabitatProbeMode');",
    "      if(location===null)throw Error('RAVINE_HABITAT_PROBE_UNIFORM_MISSING');",
    "      gl.uniform1i(location,mode);globalThis.__ravineHabitatProbeModeApplied=mode;",
    "      const target=globalThis.__ravineExpectedLocalTarget;",
    "      if(mode>0&&(!target||![target.x,target.y,target.z].every(Number.isFinite)))throw Error('RAVINE_TARGET_WORLD_UNBOUND');",
    "      if(target){const projected=regionToHEarthPlanetPoint(target);const t=gl.getUniformLocation(resources.geometryProgram,'uRavineExpectedTargetWorld');if(t===null)throw Error('RAVINE_TARGET_UNIFORM_MISSING');gl.uniform3f(t,projected.x,projected.y,projected.z);}",
    "      globalThis.__ravineProjectTarget=(targetPoint,packet)=>{",
    "        const projected=regionToHEarthPlanetPoint(targetPoint),m=packet.camera.viewProjectionMatrix,p=[projected.x,projected.y,projected.z,1];",
    "        const clip=[0,1,2,3].map(i=>m[i]*p[0]+m[4+i]*p[1]+m[8+i]*p[2]+m[12+i]);",
    "        if(!(clip[3]>0)||clip.some(v=>!Number.isFinite(v)))throw Error('RAVINE_PROJECTED_TARGET_NOT_VISIBLE');",
    "        const ndc=[clip[0]/clip[3],clip[1]/clip[3],clip[2]/clip[3]];",
    "        if(Math.abs(ndc[0])>0.99||Math.abs(ndc[1])>0.99||Math.abs(ndc[2])>1)throw Error('RAVINE_PROJECTED_TARGET_OUTSIDE_VIEW');",
    "        return {x:Math.floor((ndc[0]*.5+.5)*width),y:Math.floor((ndc[1]*.5+.5)*height),ndc,clipW:clip[3],projected};};",
    "      globalThis.__ravineReadGeometryPixel=(x,y)=>{",
    "        if(!Number.isInteger(x)||!Number.isInteger(y)||x<0||y<0||x>=width||y>=height)throw Error('RAVINE_PIXEL_OUT_OF_BOUNDS');",
    "        const rgba=new Uint8Array(4);gl.bindFramebuffer(gl.FRAMEBUFFER,resources.geometryFramebuffer);gl.readPixels(x,y,1,1,gl.RGBA,gl.UNSIGNED_BYTE,rgba);",
    "        const err=gl.getError();gl.bindFramebuffer(gl.FRAMEBUFFER,null);if(err!==gl.NO_ERROR)throw Error('RAVINE_GPU_READPIXELS_ERROR:'+err);return [...rgba];};",
    "      }"
  ].join('\n'));
  return Object.freeze({
    originalSha256:sourceHash,instrumentedSha256:hash(source),source,
    modeCount:RAVINE_HABITAT_PROBE_MODES.length,productDiskMutation:false,
    ownerPhotoCorrespondence:false,firstHitClassificationRequiresRenderedPixel:true,
    rawSourceFieldDefinition:'UPLOADED_NATIVE_R8_HABITAT_ATLAS',
    filteredSourceFieldDefinition:'UPLOADED_GAUSSIAN_MATERIAL_R8_ATLAS',
    gpuTextureSampling:'GL_LINEAR_FOR_BOTH'
  });
}

// Gen3079: frozen west-flank pixel-class diagnostic only. All preceding Gen3074
// modes preserve their source meaning. The six new modes capture ordered
// procedural soil stages; these are color-stage readings, not triangle IDs.
export const WEST_FLANK_STAGE_MODES=Object.freeze([
  ...RAVINE_HABITAT_PROBE_MODES,
  'before-world-soil','after-world-soil',
  'before-environmental-identity','after-environmental-identity',
  'before-groundcover','after-groundcover'
]);
export function transformWestFlankMaterialRenderer(original){
  const inherited=transformRavineHabitatRenderer(original);
  let source=inherited.source;
  const begin=source.indexOf('const FS = \`#version 300 es');
  const end=source.indexOf('// Ordered screen-door coverage',begin);
  if(begin<0||end<=begin)throw Error('WEST_FLANK_FRAGMENT_SCOPE_INVALID');
  let fs=source.slice(begin,end);
  fs=once(fs,'  vec3 ravineBeforeHabitat=base,ravineAfterHabitat=base;',[
    '  vec3 ravineBeforeHabitat=base,ravineAfterHabitat=base;',
    '  vec3 westBeforeSoil=base,westAfterSoil=base;',
    '  vec3 westBeforeIdentity=base,westAfterIdentity=base;',
    '  vec3 westBeforeGroundcover=base,westAfterGroundcover=base;'
  ].join('\n'));
  fs=once(fs,'        palette=mix(palette,worldSoilFinal,worldSoilWeight);',[
    '        westBeforeSoil=palette;',
    '        palette=mix(palette,worldSoilFinal,worldSoilWeight);',
    '        westAfterSoil=palette;'
  ].join('\n'));
  fs=once(fs,'      palette=mix(palette,identityBase,identityWeight);',[
    '      westBeforeIdentity=palette;',
    '      palette=mix(palette,identityBase,identityWeight);',
    '      westAfterIdentity=palette;'
  ].join('\n'));
  fs=once(fs,'      palette=mix(palette,groundcoverTone,groundcoverWeight);',[
    '      westBeforeGroundcover=palette;',
    '      palette=mix(palette,groundcoverTone,groundcoverWeight);',
    '      westAfterGroundcover=palette;'
  ].join('\n'));
  fs=once(fs,'  outColor=vec4(lit,uRavineHabitatProbeMode>0?1.0:outputAlpha);',[
    '  if(uRavineHabitatProbeMode>=10){',
    '    int m=uRavineHabitatProbeMode;',
    '    vec3 stage=m==10?westBeforeSoil:m==11?westAfterSoil:',
    '      m==12?westBeforeIdentity:m==13?westAfterIdentity:',
    '      m==14?westBeforeGroundcover:westAfterGroundcover;',
    '    lit=pow(clamp(stage*1.12,0.0,1.0),vec3(1.0/2.2));',
    '  }',
    '  outColor=vec4(lit,uRavineHabitatProbeMode>0?1.0:outputAlpha);'
  ].join('\n'));
  source=source.slice(0,begin)+fs+source.slice(end);
  source=once(source,'mode<0||mode>=10','mode<0||mode>=16');
  return Object.freeze({...inherited,source,
    instrumentedSha256:hash(source),modeCount:WEST_FLANK_STAGE_MODES.length,
    ownerPhotoCorrespondence:false,sameTriangleProven:false,
    productDiskMutation:false,releaseAuthorized:false});
}
 
// Gen3087 camera-corrected successor: one source-pinned planetary baseline.
// Mode 8 is fragment depth on this NEW profile; Gen3074/Gen3079 mode 8
// and every inherited diagnostic remain byte-for-byte unchanged.
export const NEAR_FAR_STRAIGHT_STAGE_MODES=Object.freeze(
  WEST_FLANK_STAGE_MODES.map((name,i)=>i===8?'first-hit-depth-24bit':name)
);
export function transformNearFarStraightRenderer(original){
  const inherited=transformWestFlankMaterialRenderer(original);
  const old=[
    '    else if(m==8){',
    '      float difference=ravineFilteredMaterial-ravineNativeHabitat;',
    '      lit=vec3(max(difference,0.0),max(-difference,0.0),0.0);',
    '    }'
  ].join('\n');
  const next=[
    '    else if(m==8){',
    '      // Gen3087 unchanged read-only fragment depth, RGB24 in geometry FBO.',
    '      float d=clamp(gl_FragCoord.z,0.0,1.0);',
    '      float packed=floor(d*16777215.0+0.5);',
    '      lit=vec3(floor(packed/65536.0),floor(mod(packed,65536.0)/256.0),mod(packed,256.0))/255.0;',
    '    }'
  ].join('\n');
  let source=once(inherited.source,old,next);
  // Actual geometry-program GPU uniform readback: not the reconstructed CPU
  // frame packet alone. Add only to this comparator profile.
  const anchor='gl.uniform3f(resources.uniforms.cameraPosition, packet.camera.position.x, packet.camera.position.y, packet.camera.position.z);';
  source=once(source,anchor,[anchor,
    '    globalThis.__nearFarGpuUniformReadback=()=>{',
    '      const camera=gl.getUniform(resources.geometryProgram,resources.uniforms.cameraPosition);',
    '      const view=gl.getUniform(resources.geometryProgram,resources.uniforms.viewProjection);',
    '      const error=gl.getError();',
    '      return {camera:camera?Array.from(camera):null,viewProjection:view?Array.from(view):null,error};',
    '    };'
  ].join('\n'));
  return Object.freeze({...inherited,source,instrumentedSha256:hash(source),
    modeCount:NEAR_FAR_STRAIGHT_STAGE_MODES.length,
    sourcePoseOnly:true,ownerPhotoCorrespondence:false,
    productDiskMutation:false,releaseAuthorized:false});
}


// REV2 exact-published-source GPU numeric probe (source construction only).
// Debug-disabled shader output, sampling, soil blend and draw order stay intact.
export const REV2_WORLD_SOIL_NUMERIC_MODES=Object.freeze([
 'role_primitive_depth_valid','corrected_normal_slope',
 'exposure_eligibility_weight_authority','pre_soil_and_shelter','K_and_region',
 'uv_ddx','ddy_lod_valid','implicit_T_coast',
 ...Array.from({length:9},(_,i)=>'fixed_lod_'+i),'post_soil_C'
]);
export function transformRev2WorldSoilNumericRenderer(original){
 const sourceHash=hash(original);
 if(sourceHash!==RAVINE_HABITAT_SOURCE_SHA256)
   throw Error('REV2_PUBLISHED_RENDERER_SOURCE_HASH_MISMATCH:'+sourceHash);
 const start=original.indexOf('const FS = '+String.fromCharCode(96)+'#version 300 es');
 const end=original.indexOf('// Ordered screen-door coverage',start);
 if(start<0||end<=start)throw Error('REV2_FRAGMENT_SCOPE_INVALID');
 let fs=original.slice(start,end);
 fs=once(fs,'out vec4 outColor;','uniform highp int uRev2NumericMode;\nout vec4 outColor;');
 fs=once(fs,'void main(){',[
  'void main(){',
  '  // REV2: evaluate implicit UV derivatives before divergent soil branch.',
  '  vec2 rev2UV=clearingLocalXZ(vWorldPosition)*0.28;',
  '  vec2 rev2DDX=dFdx(rev2UV),rev2DDY=dFdy(rev2UV);',
  '  bool rev2DerivativeFinite=!any(isnan(vec4(rev2DDX,rev2DDY))) && !any(isinf(vec4(rev2DDX,rev2DDY)));',
  '  vec3 rev2P=vec3(0.0),rev2C=vec3(0.0),rev2T=vec3(0.0),rev2K=vec3(0.0);',
  '  float rev2W=0.0,rev2A=0.0,rev2E=0.0,rev2Region=0.0,rev2Shelter=0.0,rev2RockExposure=0.0;',
  '  bool rev2SampledOriginalT=false;'
 ].join('\n'));
 fs=once(fs,'    if(uClearingEnabled==1){\n      // The approved earth texture',[
  '    rev2P=palette;rev2C=palette;rev2Shelter=shelteredSoil;',
  '    if(uClearingEnabled==1){',
  '      // The approved earth texture'
 ].join('\n'));
 fs=once(fs,'      float worldSoilWeight=worldSoilCoverage;',[
  '      float worldSoilWeight=worldSoilCoverage;',
  '      rev2W=worldSoilWeight;rev2E=worldSoilEligibility;rev2Region=worldSoilRegion;'
 ].join('\n'));
 fs=once(fs,'        ).rgb;\n        if(geologicalEarthRock){',[
  '        ).rgb;',
  '        if(!geologicalEarthRock){rev2T=worldSoilTexel;rev2SampledOriginalT=true;}',
  '        if(geologicalEarthRock){'
 ].join('\n'));
 fs=once(fs,'    float shelteredSoil=clamp(',[
  '    rev2RockExposure=rockExposure;',
  '    float shelteredSoil=clamp('
 ].join('\n'));
 fs=once(fs,'        vec3 worldSoilActualAlbedo=',[
  '        rev2K=0.75*worldSoilEarthTint*worldSoilBroadTonal;',
  '        vec3 worldSoilActualAlbedo='
 ].join('\n'));
 fs=once(fs,'        vec3 worldSoilFinal=mix(palette,worldSoilActualAlbedo,worldSoilAlbedoAuthority);',[
  '        rev2P=palette;rev2A=worldSoilAlbedoAuthority;',
  '        vec3 worldSoilFinal=mix(palette,worldSoilActualAlbedo,worldSoilAlbedoAuthority);'
 ].join('\n'));
 fs=once(fs,'    // H_EARTH_EAST_A_ENVIRONMENTAL_IDENTITY_GEN2823_STAGE_A_BEGIN',[
  '    rev2C=palette;',
  '    // H_EARTH_EAST_A_ENVIRONMENTAL_IDENTITY_GEN2823_STAGE_A_BEGIN'
 ].join('\n'));
 const output=[
  '  if(uRev2NumericMode>0){',
  '    int m=uRev2NumericMode;',
  '    bool ordinary=worldSoilTerrain&&!geologicalEarthRock;',
  '    bool validT=ordinary&&rev2SampledOriginalT&&rev2W>0.001&&rev2DerivativeFinite;',
  '    float derivativeMagnitude=max(length(rev2DDX*256.0),length(rev2DDY*256.0));',
  '    float estimatedLod=clamp(log2(max(derivativeMagnitude,1.0)),0.0,8.0);',
  '    vec4 channels=vec4(0.0);',
  '    if(m==1)channels=vec4(float(vRoleCode),float(vPrimitiveIndex),gl_FragCoord.z,ordinary?1.0:0.0);',
  '    else if(m==2)channels=vec4(geometricNormal,slope);',
  '    else if(m==3)channels=vec4(rev2RockExposure,rev2E,rev2W,rev2A);',
  '    else if(m==4)channels=vec4(rev2P,rev2Shelter);',
  '    else if(m==5)channels=vec4(rev2K,rev2Region);',
  '    else if(m==6&&validT)channels=vec4(rev2UV,rev2DDX);',
  '    else if(m==7)channels=validT?vec4(rev2DDY,estimatedLod,1.0):vec4(0.0);',
  '    else if(m==8&&validT)channels=vec4(rev2T,vCoastDistanceMeters);',
  '    else if(m>=9&&m<=17&&validT){',
  '      vec3 explicitLod=textureLod(uClearingSoil,rev2UV,float(m-9)).rgb;',
  '      channels=vec4(explicitLod,1.0);',
  '    }',
  '    else if(m==18)channels=vec4(rev2C,ordinary?1.0:0.0);',
  '    outColor=channels;',
  '  }else outColor=vec4(lit,outputAlpha);'
 ].join('\n');
 fs=once(fs,'  outColor=vec4(lit,outputAlpha);',output);
 const instrumented=original.slice(0,start)+fs+original.slice(end);
 if(!instrumented.includes('palette=mix(palette,worldSoilFinal,worldSoilWeight);'))
   throw Error('REV2_ORIGINAL_WORLD_SOIL_BLEND_LOST');
 return Object.freeze({source:instrumented,originalSha256:sourceHash,
  instrumentedSha256:hash(instrumented),numericModeCount:REV2_WORLD_SOIL_NUMERIC_MODES.length,
  noSourceWrite:true,debugDisabledOriginalOutputRetained:true,
  driverSelectedMipObserved:false,noOriginalTWhenWZero:true,
  requiresRgba32f:true,productionMutation:false,gpuExecuted:false});
}
