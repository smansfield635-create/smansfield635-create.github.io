import crypto from 'node:crypto';

export const PUBLISHED_RENDERER_SHA256='7ac013645110fc91ac9d454916e30f3cc526b716b0c0ffad4c702e1e44b8bec2';
export const MODES=Object.freeze(['reference-lit','final-unlit','before-groundcover-unlit','after-groundcover-unlit','organic-noise-raw','patch-weight-raw','suitability-raw','protection-raw','coast-suitability-raw','slope-suitability-raw','rock-suitability-raw','groundcover-weight-raw','groundcover-tone-color','final-unlit-no-groundcover','reference-lit-no-groundcover']);
export const MODES_MINIMUM=Object.freeze([0,1,2,3,5,6,7,11,13]);
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
function once(source,needle,replacement){if(source.split(needle).length!==2)throw Error('NON_UNIQUE_SOURCE_ANCHOR:'+needle.slice(0,90));return source.replace(needle,replacement);}
export function transformPublishedRenderer(original,{strictHash=true}={}){
 const originalSha256=hash(original);
 if(strictHash&&originalSha256!==PUBLISHED_RENDERER_SHA256)throw Error('PUBLISHED_RENDERER_HASH_MISMATCH:'+originalSha256);
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
 fs=once(fs,originalBlend,[
 '      probeGCSeen=1.0;',
 '      probeGCOrganic=groundcoverOrganic;',
 '      probeGCPatch=groundcoverPatch;',
 '      probeGCSuitability=groundcoverSuitability;',
 '      probeGCProtection=groundcoverProtection;',
 '      probeGCCoast=smoothstep(28.0,72.0,max(0.0,vCoastDistanceMeters));',
 '      probeGCSlope=1.0-smoothstep(0.12,0.42,slope);',
 '      probeGCRock=1.0-smoothstep(0.18,0.58,rockExposure);',
 '      probeGCWeight=groundcoverWeight;',
 '      probeGCBefore=palette;',
 '      probeGCTone=groundcoverTone;',
 '      probeGCAfter=mix(palette,groundcoverTone,groundcoverWeight);',
 '      if(uGroundcoverFactorMode==13||uGroundcoverFactorMode==14)groundcoverWeight=0.0;',
 originalBlend].join('\n'));
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

/**
 * Gen3029: source-only diagnostic extension for the exact Gen3008 renderer.
 * It does NOT modify the checked-out H-Earth renderer or alter historic factor modes.
 * The added modes expose the material albedo immediately before/after the
 * later habitat-color overlay, independent of physical grass geometry.
 */
export const GEN3008_HABITAT_STAGE_MODES=Object.freeze([
 'before-habitat-unlit','after-habitat-unlit'
]);
export const GEN3008_FROZEN_RENDERER_SHA256='10f73ef961299e5834f3956d6a08771edd050beebf5fa6a29cb31dc8130f935c';

export function transformGen3008HabitatStages(original,{strictHash=true}={}){
 const originSha256=hash(original);
 if(strictHash&&originSha256!==GEN3008_FROZEN_RENDERER_SHA256)
   throw Error('GEN3008_FROZEN_RENDERER_SOURCE_MISMATCH:'+originSha256);
 const standard=transformPublishedRenderer(original,{strictHash:false});
 let source=standard.source;
 const start=source.indexOf('const FS = '),end=source.indexOf('// Ordered screen-door coverage',start);
 if(start<0||end<=start)throw Error('GEN3008_FRAGMENT_SCOPE_MISSING');
 let frag=source.slice(start,end);
 frag=once(frag,'  float probeGCSeen=0.0;',
   '  float probeGCSeen=0.0;\\n  float probeHabitatSeen=0.0;\\n  vec3 probeHabitatBefore=vec3(0.0),probeHabitatAfter=vec3(0.0);'.replaceAll('\\n','\n'));
 const blend='    base=mix(base,habitatSoil,habitatColorCoverage*.68);';
 frag=once(frag,blend,[
  '    probeHabitatSeen=1.0;',
  '    probeHabitatBefore=base;',
  '    probeHabitatAfter=mix(base,habitatSoil,habitatColorCoverage*.68);',
  blend
 ].join('\n'));
 frag=once(frag,'    if(m==1||m==2||m==3||m==12||m==13){',
   '    if(m==1||m==2||m==3||m==12||m==13||m==15||m==16){');
 frag=once(frag,'      if(m==12)albedo=probeGCSeen>0.5?probeGCTone:base;',
  [
  '      if(m==12)albedo=probeGCSeen>0.5?probeGCTone:base;',
  '      if(m==15)albedo=probeHabitatSeen>0.5?probeHabitatBefore:base;',
  '      if(m==16)albedo=probeHabitatSeen>0.5?probeHabitatAfter:base;'
  ].join('\n'));
 source=source.slice(0,start)+frag+source.slice(end);
 source=once(source,'mode>=15','mode>=17');
 return Object.freeze({
   originalSha256:originSha256,instrumentedSha256:hash(source),source,
   modeCount:17,sourceTarget:'FROZEN_GEN3008_ONLY',
   physicalGrassPixelRendering:false,productDiskMutation:false
 });
}
