import crypto from 'node:crypto';
// Isolated diagnostic helper; no product renderer mutation or execution transport.
export const WORLD_MODES=Object.freeze(['world-x','world-y','world-z','coast-distance']);
export const WORLD_ENCODING=Object.freeze({version:1,alpha:255,invalidCode:0,outOfRangeCode:16777215,rounding:'nearest-half-up',float32ArithmeticAllowanceInBins:0.125,measuredQuantity:'interpolated-shader-highp-float-not-exact-mesh-real',byteOrder:'RGB-most-significant-first',specs:Object.freeze([
 {name:'world-x',min:-32768,step:1/16,max:32768},
 {name:'world-y',min:-128,step:1/4096,max:128},
 {name:'world-z',min:-32768,step:1/16,max:32768},
 {name:'coast-distance',min:-32768,step:1/16,max:32768}
 ])});
export function specFor(mode){if(!Number.isInteger(mode)||mode<0||mode>3)throw Error('WORLD_MODE_INVALID');return WORLD_ENCODING.specs[mode];}
export function encodeWorld(value,mode,{eligible=true}={}){const s=specFor(mode);const code=!eligible?0:!Number.isFinite(value)||value<s.min||value>s.max?16777215:Math.floor((value-s.min)/s.step+.5)+1;return [(code>>>16)&255,(code>>>8)&255,code&255,255];}
export function decodeWorld(rgba,mode){const s=specFor(mode);if(rgba.length!==4||rgba.some(v=>!Number.isInteger(v)||v<0||v>255)||rgba[3]!==255)throw Error('WORLD_RGBA_INVALID');const code=rgba[0]*65536+rgba[1]*256+rgba[2];if(code===0)return {valid:false,reason:'NON_TERRAIN'};if(code===16777215)return {valid:false,reason:'OUT_OF_RANGE'};const index=code-1;if(index>(s.max-s.min)/s.step)throw Error('WORLD_CODE_INVALID');const value=s.min+index*s.step;return {valid:true,value,interval:[Math.max(s.min,value-s.step*0.625),Math.min(s.max,value+s.step*0.625)]};}
// Inclusive endpoints plus exact byte carry boundaries and values around zero.
export const CALIBRATION_INDICES=Object.freeze([0,1,253,254,255,256,65533,65534,65535,65536,524287,524288,1048575,1048576,-1,-2]);
export function calibrationExpected(mode){const s=specFor(mode);return CALIBRATION_INDICES.map(i=>i===-1?[0,0,0,255]:i===-2?[255,255,255,255]:encodeWorld(s.min+i*s.step,mode));}
export function validateCalibration(rgba,mode){const expected=calibrationExpected(mode);if(rgba.length!==64)throw Error('WORLD_CALIBRATION_LENGTH');for(let i=0;i<64;i++)if(rgba[i]!==expected[Math.floor(i/4)][i%4])throw Error('WORLD_CALIBRATION_MISMATCH:'+mode+':'+i);return true;}
export const WORLD_PACK_GLSL=`
vec4 encodePreciseWorld(float value,int mode,bool eligible){
 if(!eligible)return vec4(0.0,0.0,0.0,1.0);
 float low=mode==1?-128.0:-32768.0;
 float high=mode==1?128.0:32768.0;
 float scale=mode==1?4096.0:16.0;
 if(isnan(value)||isinf(value)||value<low||value>high)return vec4(1.0);
 uint code=uint(floor((value-low)*scale+0.5))+1u;
 return vec4(vec3(float((code>>16u)&255u),float((code>>8u)&255u),float(code&255u))/255.0,1.0);
}
`;
// Stringifiable installer for source interception. Same pack source is injected,
// no eval, dynamic download, canvas readback or additional scene frame.
export function makeCalibrationInstaller(){return `const drawPreciseWorldCalibration=(${installWorldCalibration.toString()})(gl,${JSON.stringify(WORLD_PACK_GLSL)},${JSON.stringify(CALIBRATION_INDICES)});`;}
export function installWorldCalibration(gl,packSource,indices){
 let program=null,vao=null,modeLocation=null;
 function shader(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){const why=gl.getShaderInfoLog(s);gl.deleteShader(s);throw Error('WORLD_CALIBRATION_SHADER:'+why);}return s;}
 return function drawPreciseWorldCalibration(mode){
  if(!Number.isInteger(mode)||mode<0||mode>3)throw Error('WORLD_CALIBRATION_MODE');
  if(!program){
   const v=shader(gl.VERTEX_SHADER,'#version 300 es\nvoid main(){vec2 p=vec2(float((gl_VertexID<<1)&2),float(gl_VertexID&2));gl_Position=vec4(p*2.0-1.0,0.0,1.0);}');
   const f=shader(gl.FRAGMENT_SHADER,'#version 300 es\nprecision highp float;precision highp int;out vec4 color;uniform int mode;'+packSource+'\nvoid main(){const int indices[16]=int[16]('+indices.join(',')+');int i=indices[int(gl_FragCoord.x)];float low=mode==1?-128.0:-32768.0;float stepSize=mode==1?1.0/4096.0:1.0/16.0;float value=low+float(max(i,0))*stepSize;if(i==-2)value=mode==1?129.0:32769.0;color=encodePreciseWorld(value,mode,i!=-1); }');
   program=gl.createProgram();gl.attachShader(program,v);gl.attachShader(program,f);gl.linkProgram(program);gl.deleteShader(v);gl.deleteShader(f);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('WORLD_CALIBRATION_LINK:'+gl.getProgramInfoLog(program));vao=gl.createVertexArray();modeLocation=gl.getUniformLocation(program,'mode');if(modeLocation===null)throw Error('WORLD_CALIBRATION_UNIFORM');
  }
  const old={program:gl.getParameter(gl.CURRENT_PROGRAM),vao:gl.getParameter(gl.VERTEX_ARRAY_BINDING),viewport:gl.getParameter(gl.VIEWPORT),scissor:gl.getParameter(gl.SCISSOR_BOX),colorMask:gl.getParameter(gl.COLOR_WRITEMASK)};
  const caps=[gl.DEPTH_TEST,gl.BLEND,gl.DITHER,gl.CULL_FACE,gl.SCISSOR_TEST,gl.RASTERIZER_DISCARD];const enabled=caps.map(c=>gl.isEnabled(c));
  try{for(const c of caps)gl.disable(c);gl.colorMask(true,true,true,true);gl.viewport(0,0,16,1);gl.enable(gl.SCISSOR_TEST);gl.scissor(0,0,16,1);gl.useProgram(program);gl.bindVertexArray(vao);gl.uniform1i(modeLocation,mode);gl.drawArrays(gl.TRIANGLES,0,3);}
  finally{gl.useProgram(old.program);gl.bindVertexArray(old.vao);gl.viewport(...old.viewport);gl.scissor(...old.scissor);gl.colorMask(...old.colorMask);caps.forEach((c,i)=>enabled[i]?gl.enable(c):gl.disable(c));}
 };
}
// Install before any shader compilation. Presentation source is exact source text,
// not a substring allowlist. Other fragment programs retain original calculations
// behind a live uniform to preserve the renderer's expected active uniforms.
export function installWorldInvalidation(gl,presentationSource){
 const originalShaderSource=gl.shaderSource.bind(gl),originalUseProgram=gl.useProgram.bind(gl);
 const observations=[];const locations=new WeakMap(),modeLocations=new WeakMap();
 gl.shaderSource=function(shader,source){
  if(gl.getShaderParameter(shader,gl.SHADER_TYPE)===gl.FRAGMENT_SHADER){
   let disposition;
   if(source===presentationSource)disposition='EXACT_PRESENTATION_PASSTHROUGH';
   else if(source.includes('vec4 encodePreciseWorld('))disposition='PRECISE_WORLD_OR_CALIBRATION';
   else {
    const outputs=[...source.matchAll(/(?:layout\s*\([^)]*\)\s*)?\bout\s+(?:(?:lowp|mediump|highp)\s+)?vec4\s+([A-Za-z_]\w*)\s*;/g)];
    const mains=[...source.matchAll(/\bvoid\s+main\s*\(\s*(?:void\s*)?\)\s*\{/g)];
    if(mains.length!==1||outputs.length>1)throw Error('WORLD_FRAGMENT_OUTPUT_UNSUPPORTED');
    if(outputs.length===0){if(/\bgl_Frag(?:Color|Data)\b/.test(source))throw Error('WORLD_FRAGMENT_OUTPUT_UNSUPPORTED');observations.push({disposition:'DEPTH_ONLY_PRESERVE_DISCARD',source});return originalShaderSource(shader,source);}
    const output=outputs[0][1];
    source=source.replace(mains[0][0],'void preciseOriginalMain(){')+'\nuniform int uPreciseWorldInvalidate;\nvoid main(){preciseOriginalMain();if(uPreciseWorldInvalidate==1)'+output+'=vec4(0.0,0.0,0.0,1.0);}\n';
    disposition='PRESERVE_DISCARD_DEPTH_INVALIDATE_RGB';
   }
   observations.push({disposition,source});
  }
  return originalShaderSource(shader,source);
 };
 gl.useProgram=function(program){
  originalUseProgram(program);
  if(program){let location=locations.get(program);if(location===undefined){location=gl.getUniformLocation(program,'uPreciseWorldInvalidate');locations.set(program,location);}if(location!==null)gl.uniform1i(location,1);
   let modeLocation=modeLocations.get(program);if(modeLocation===undefined){modeLocation=gl.getUniformLocation(program,'uPreciseWorldMode');modeLocations.set(program,modeLocation);}
   if(modeLocation!==null){const mode=globalThis.__groundcoverFactorMode??0;if(!Number.isInteger(mode)||mode<0||mode>3)throw Error('WORLD_MODE_INVALID');gl.uniform1i(modeLocation,mode);globalThis.__groundcoverFactorModeApplied=mode;}
  }
 };
 return {observations,restore(){gl.shaderSource=originalShaderSource;gl.useProgram=originalUseProgram;}};
}

export const WORLD_SOURCE_HEAD='cb57c275b95d0d48883bc4da4dcfcf17cbec5060';
export const WORLD_RENDERER_SHA256='fa6acc426c75c3b2292b3ed76a756157698d8e7a5562511ad7ced5af58e25dec';
function once(source,needle,replacement){if(source.split(needle).length!==2)throw Error('WORLD_SOURCE_ANCHOR_NOT_UNIQUE:'+needle);return source.replace(needle,replacement);}
export function instrumentWorldRenderer(original){
 if(crypto.createHash('sha256').update(original).digest('hex')!==WORLD_RENDERER_SHA256)throw Error('WORLD_SOURCE_HASH_MISMATCH');
 const start=original.indexOf('const FS = '),end=original.indexOf('// Ordered screen-door coverage',start);
 if(start<0||end<=start)throw Error('WORLD_FRAGMENT_SCOPE');
 let fragment=original.slice(start,end);
 fragment=once(fragment,'out vec4 outColor;','out vec4 outColor;\nuniform int uPreciseWorldMode;\n'+WORLD_PACK_GLSL);
 // Retain the existing final expression behind a live uniform branch: all
 // original uniforms remain active and original clipping/discards still run.
 fragment=once(fragment,'  outColor=vec4(lit,outputAlpha);',`  outColor=vec4(lit,outputAlpha);
  if(uPreciseWorldMode>=0){
    float measured=uPreciseWorldMode==0?vWorldPosition.x:uPreciseWorldMode==1?vWorldPosition.y:uPreciseWorldMode==2?vWorldPosition.z:vCoastDistanceMeters;
    outColor=encodePreciseWorld(measured,uPreciseWorldMode,worldSoilTerrain);
  }`);
 let source=original.slice(0,start)+fragment+original.slice(end);
 source=once(source,"  if (!gl) throw new Error('R3C_WEBGL2_CONTEXT_UNAVAILABLE');",`  if (!gl) throw new Error('R3C_WEBGL2_CONTEXT_UNAVAILABLE');
  const preciseWorldInvalidation=(${installWorldInvalidation.toString()})(gl,PRESENT_COLOR_FS);
  globalThis.__preciseWorldEnabled=true;
  globalThis.__preciseWorldActualPacket=null;
  globalThis.__preciseWorldFragmentObservations=preciseWorldInvalidation.observations;
  ${makeCalibrationInstaller()}
  gl.disable(gl.DITHER);`);
 source=once(source,'gl.clearColor(...resources.skyColor, 1);','gl.disable(gl.DITHER); gl.clearColor(0,0,0,1);');
 source=once(source,'resources.singleOwnerVegetation?.draw(packet);','if(!globalThis.__groundComparisonHideGrass)resources.singleOwnerVegetation?.draw(packet);');
 source=once(source,'    gl.uniform1i(resources.presentColorSampler,0);\n    gl.drawArrays(gl.TRIANGLES,0,3);',`    gl.uniform1i(resources.presentColorSampler,0);
    gl.disable(gl.DITHER);
    gl.drawArrays(gl.TRIANGLES,0,3);`);
 source=once(source,'  function renderFrame(packet) {','  function renderFrame(packet) {\n    globalThis.__preciseWorldActualPacket=null;');
 source=once(source,'    counters.frameCount += 1;',`    gl.bindFramebuffer(gl.FRAMEBUFFER,resources.geometryFramebuffer);
    drawPreciseWorldCalibration(globalThis.__groundcoverFactorMode??0);
    if(gl.getError()!==gl.NO_ERROR)throw Error('WORLD_CALIBRATION_DRAW_ERROR');
    globalThis.__preciseWorldActualPacket={camera:JSON.parse(JSON.stringify(packet.camera)),viewport:{width,height},mode:globalThis.__groundcoverFactorMode??0,frameNumber:counters.frameCount+1};
    counters.frameCount += 1;`);
 return source;
}
