import { getHEarthRun8ER2CanonicalLiveRenderPackage } from '../../../../showroom/globe/h-earth/render/live-render-package.run8e-r2.canonical.js';
import { createHEarthRun8ER2DCanonicalGPUUploadViews } from '../../../../showroom/globe/h-earth/render/gpu-upload-views.run8e-r2d.js';
import { getHEarthRun8ER3ALiveRendererInterface } from '../../../../showroom/globe/h-earth/render/live-renderer-contract.run8e-r3a.js';

export const H_EARTH_C2_CANDIDATE_RENDERER_ID =
  'H_EARTH_C2_BOUNDED_COASTAL_VISUAL_SUCCESSOR_RENDERER_v1';

const ROLE_TERRAIN = 1;
const ROLE_SHORELINE = 2;
const finite = (value) => typeof value === 'number' && Number.isFinite(value);
const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const clamp01 = (value) => clamp(value, 0, 1);
const mix = (a, b, t) => a + (b - a) * t;
const smoothstep = (edge0, edge1, value) => {
  const t = clamp01((value - edge0) / Math.max(Number.EPSILON, edge1 - edge0));
  return t * t * (3 - 2 * t);
};
const shorelineZ = (x) => -79.25507841 - 0.00038072 * x * x;
const macroSignal = (x, z) =>
  0.55 * Math.sin(x * 0.031 + z * 0.017) +
  0.3 * Math.sin(x * 0.011 - z * 0.026) +
  0.15 * Math.cos((x + z) * 0.043);

function coastalProfileHeight(distance, x, z, originalY) {
  const macro = macroSignal(x, z);
  if (distance <= -70 || distance >= 78) return originalY;
  if (distance < -44) return mix(originalY, 2.35 + 0.38 * macro, smoothstep(-70, -44, distance));
  if (distance < -14) return mix(2.35 + 0.38 * macro, 0.62 + 0.16 * macro, smoothstep(-44, -14, distance));
  if (distance < 2) return mix(0.62 + 0.16 * macro, -0.12, smoothstep(-14, 2, distance));
  if (distance < 15) return mix(-0.12, -1.15, smoothstep(2, 15, distance));
  if (distance < 24) return mix(-1.15, -0.28 + 0.1 * macro, smoothstep(15, 24, distance));
  if (distance < 34) return mix(-0.28 + 0.1 * macro, -1.72, smoothstep(24, 34, distance));
  if (distance < 68) return mix(-1.72, -5.4, smoothstep(34, 68, distance));
  return mix(-5.4, originalY, smoothstep(68, 78, distance));
}

function coastalColor(distance, x, z) {
  const macro = 0.92 + 0.13 * macroSignal(x, z);
  let color;
  if (distance < -50) color = [0.15, 0.18, 0.075, 1];
  else if (distance < -34) color = [0.29, 0.27, 0.115, 1];
  else if (distance < -10) color = [0.62, 0.43, 0.19, 1];
  else if (distance < 2) color = [0.34, 0.235, 0.105, 1];
  else color = [0.55, 0.39, 0.17, 1];
  return [clamp01(color[0] * macro), clamp01(color[1] * macro), clamp01(color[2] * macro), color[3]];
}

function buildCandidateViews(renderPackage) {
  const source = createHEarthRun8ER2DCanonicalGPUUploadViews(renderPackage);
  const positions = new Float32Array(source.positions);
  const normals = new Float32Array(source.normals);
  const baseColorsLinear = new Float32Array(source.baseColorsLinear);
  const roleCodes = new Uint8Array(source.roleCodes);
  const surfaceClassCodes = new Uint8Array(source.surfaceClassCodes);
  const materialParameters = new Float32Array(source.materialParameters);
  const materialModelCodes = new Uint8Array(source.materialModelCodes);
  const primitiveIndices = new Uint16Array(source.primitiveIndices);
  const indices = new Uint32Array(source.indices);

  let coastalTerrainVertexCount = 0;
  let reshapedTerrainVertexCount = 0;
  let recoloredTerrainVertexCount = 0;
  let protectedVertexMutationCount = 0;

  for (let vertex = 0; vertex < roleCodes.length; vertex += 1) {
    const positionOffset = vertex * 3;
    const colorOffset = vertex * 4;
    const x = positions[positionOffset];
    const originalY = positions[positionOffset + 1];
    const z = positions[positionOffset + 2];
    const role = roleCodes[vertex];
    const inCorridor = Math.abs(x) <= 160 && z >= -165.49265495 && z <= 2.42720326;

    if (role === ROLE_TERRAIN && inCorridor) {
      coastalTerrainVertexCount += 1;
      const distance = z - shorelineZ(x);
      const lateral = 1 - smoothstep(126, 160, Math.abs(x));
      const longitudinal = smoothstep(-78, -68, distance) * (1 - smoothstep(68, 78, distance));
      const blend = clamp01(lateral * longitudinal);
      if (blend > 0) {
        const targetY = coastalProfileHeight(distance, x, z, originalY);
        positions[positionOffset + 1] = mix(originalY, targetY, blend);
        reshapedTerrainVertexCount += 1;
        const color = coastalColor(distance, x, z);
        for (let channel = 0; channel < 4; channel += 1) {
          baseColorsLinear[colorOffset + channel] = mix(
            baseColorsLinear[colorOffset + channel],
            color[channel],
            blend
          );
        }
        recoloredTerrainVertexCount += 1;
      }
    } else if (role !== ROLE_TERRAIN && role !== ROLE_SHORELINE) {
      const sourceOffset = vertex * 3;
      if (
        positions[sourceOffset] !== source.positions[sourceOffset] ||
        positions[sourceOffset + 1] !== source.positions[sourceOffset + 1] ||
        positions[sourceOffset + 2] !== source.positions[sourceOffset + 2]
      ) {
        protectedVertexMutationCount += 1;
      }
    }
  }

  return Object.freeze({
    positions,
    normals,
    baseColorsLinear,
    materialParameters,
    materialModelCodes,
    surfaceClassCodes,
    primitiveIndices,
    roleCodes,
    indices,
    drawRanges: renderPackage.drawRanges,
    metrics: Object.freeze({
      coastalTerrainVertexCount,
      reshapedTerrainVertexCount,
      recoloredTerrainVertexCount,
      protectedVertexMutationCount,
      corridor: Object.freeze({
        xMinimum: -160,
        xMaximum: 160,
        zMinimum: -165.49265495,
        zMaximum: 2.42720326,
        shorelineModel: 'C0_THREE_TRANSECT_QUADRATIC_CORRESPONDENCE',
        crossSectionDirection: 'POSITIVE_Z_WATERWARD'
      }),
      memberships: Object.freeze([
        'SUBMERGED_SAND',
        'WET_SAND',
        'DRY_SAND',
        'COASTAL_TRANSITION',
        'DARKER_INLAND_TERRAIN'
      ])
    })
  });
}

const VERTEX_SHADER = `#version 300 es
precision highp float;precision highp int;
layout(location=0)in vec3 aPosition;layout(location=1)in vec3 aNormal;layout(location=2)in vec4 aBaseColorLinear;layout(location=3)in vec4 aMaterialParameters;layout(location=4)in uint aMaterialModelCode;layout(location=5)in uint aSurfaceClassCode;layout(location=6)in uint aPrimitiveIndex;layout(location=7)in uint aRoleCode;
uniform mat4 uViewProjection;uniform float uTimeSeconds;
out vec3 vWorldPosition;out vec3 vNormal;out vec4 vBaseColor;out vec4 vMaterialParameters;out float vWaveSignal;flat out uint vRoleCode;
float shore(float x){return -79.25507841-0.00038072*x*x;}
void main(){vec3 p=aPosition;float wave=0.0;if(aRoleCode==2u){float d=max(0.0,p.z-shore(p.x));float depth=smoothstep(2.0,68.0,d);float coast=smoothstep(1.0,10.0,d);wave=(sin(p.x*.075+uTimeSeconds*.92)+.52*sin(p.z*.11-uTimeSeconds*1.28)+.24*sin((p.x+p.z)*.18+uTimeSeconds*1.72))*(.025+.21*depth)*coast;p.y+=wave;}vWorldPosition=p;vNormal=aNormal;vBaseColor=aBaseColorLinear;vMaterialParameters=aMaterialParameters;vWaveSignal=wave;vRoleCode=aRoleCode;gl_Position=uViewProjection*vec4(p,1.0);}`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;precision highp int;
in vec3 vWorldPosition;in vec3 vNormal;in vec4 vBaseColor;in vec4 vMaterialParameters;in float vWaveSignal;flat in uint vRoleCode;
uniform vec3 uCameraPosition;uniform vec3 uSunDirection;uniform float uSunIntensity;uniform vec3 uSunColor;uniform vec3 uSkyZenithColor;uniform vec3 uSkyHorizonColor;uniform vec3 uGroundHazeColor;uniform float uFogStartDistance;uniform float uFogFalloff;uniform float uMaximumFogFactor;uniform float uDistanceDesaturationStrength;uniform float uTimeSeconds;out vec4 outColor;
float shore(float x){return -79.25507841-0.00038072*x*x;}
float bell(float value,float center,float width){float q=(value-center)/width;return exp(-q*q);}
void main(){vec3 n=normalize(vNormal);float d=max(dot(n,normalize(-uSunDirection)),0.0);float dist=length(vWorldPosition-uCameraPosition);float fog=clamp((dist-uFogStartDistance)*max(uFogFalloff,.00001),0.0,uMaximumFogFactor);
if(vRoleCode==2u){float coastDistance=max(0.0,vWorldPosition.z-shore(vWorldPosition.x));float depth=smoothstep(2.0,70.0,coastDistance);float sandbar=bell(coastDistance,24.0,8.0);vec3 shallow=vec3(.018,.48,.54);vec3 middle=vec3(.018,.27,.36);vec3 deep=vec3(.008,.075,.17);vec3 water=mix(shallow,middle,smoothstep(8.0,34.0,coastDistance));water=mix(water,deep,smoothstep(32.0,78.0,coastDistance));water=mix(water,vec3(.035,.58,.57),sandbar*.34);float shorelinePhase=1.5+sin(vWorldPosition.x*.09+uTimeSeconds*1.05)*1.1;float breakerPhase=22.0+sin(vWorldPosition.x*.055-uTimeSeconds*.82)*2.2;float foam=max(bell(coastDistance,shorelinePhase,1.55),bell(coastDistance,breakerPhase,2.0)*(.45+.55*sandbar));foam*=.68+.32*sin(vWorldPosition.x*.31+vWorldPosition.z*.21+uTimeSeconds*2.1);foam=clamp(foam,0.0,1.0);water=mix(water,vec3(.86,.97,.94),foam*.82);float sparkle=pow(max(dot(reflect(normalize(vWorldPosition-uCameraPosition),n),normalize(-uSunDirection)),0.0),24.0);water+=sparkle*.16;water=mix(water,uSkyHorizonColor,fog*.35);float alpha=mix(.48,.91,depth)-sandbar*.08+foam*.12;outColor=vec4(pow(clamp(water,0.0,1.0),vec3(1.0/2.2)),clamp(alpha,.42,.98));return;}
float macro=.90+.10*sin(vWorldPosition.x*.025+vWorldPosition.z*.017)+.055*sin(vWorldPosition.x*.011-vWorldPosition.z*.031);vec3 base=max(vBaseColor.rgb*macro,vec3(.004));float ambient=.34+.09*max(n.y,0.0);float roleBoost=vRoleCode==1u?1.10:.94;vec3 lit=base*(ambient+d*uSunIntensity*.76)*uSunColor*roleBoost;float lum=dot(lit,vec3(.2126,.7152,.0722));lit=mix(lit,vec3(lum),clamp(fog*uDistanceDesaturationStrength,0.0,1.0));vec3 atmosphere=mix(uSkyHorizonColor,uSkyZenithColor,clamp(n.y*.5+.5,0.0,1.0));lit=mix(lit,atmosphere,fog*.2);lit=mix(lit,uGroundHazeColor,fog*.72);outColor=vec4(pow(clamp(lit,0.0,1.0),vec3(1.0/2.2)),clamp(vBaseColor.a,.2,1.0));}`;

function color3(value) {
  const array = Array.isArray(value) ? value : [0, 0, 0];
  const scale = array.some((entry) => entry > 1) ? 255 : 1;
  return array.slice(0, 3).map((entry) => clamp01(Number(entry) / scale));
}

function fnv1a(bytes) {
  let value = 0x811c9dc5;
  for (const byte of bytes) {
    value ^= byte;
    value = Math.imul(value, 0x01000193) >>> 0;
  }
  return `fnv1a32:${value.toString(16).padStart(8, '0')}`;
}

export function createHEarthC2CandidateRenderer({ canvas, width = 960, height = 540 } = {}) {
  if (!(canvas instanceof HTMLCanvasElement)) throw new TypeError('C2_CANVAS_REQUIRED');
  if (![width, height].every(finite) || width <= 0 || height <= 0) throw new TypeError('C2_VIEWPORT_INVALID');
  canvas.width = width;canvas.height = height;
  const gl = canvas.getContext('webgl2', { alpha:false, antialias:false, depth:true, stencil:false, preserveDrawingBuffer:true, powerPreference:'high-performance' });
  if (!gl) throw new Error('C2_WEBGL2_CONTEXT_UNAVAILABLE');

  const renderPackage = getHEarthRun8ER2CanonicalLiveRenderPackage();
  const views = buildCandidateViews(renderPackage);
  const rendererInterface = getHEarthRun8ER3ALiveRendererInterface();
  let initialized = false;
  const resources = {};
  const counters = {contextCreationCount:1,shaderCompileCount:0,programLinkCount:0,bufferCreateCount:0,bufferUploadCount:0,uploadedByteLength:0,frameCount:0,visiblePresentationCount:0,colorReadbackCount:0,criticalGlErrorCount:0,postInitializationResourceCreationCount:0,postInitializationBufferUploadCount:0,maximumRenderMs:0};

  const shader = (type, source, label) => {if(initialized)counters.postInitializationResourceCreationCount+=1;const item=gl.createShader(type);if(!item)throw new Error(`C2_SHADER_CREATE_FAILED:${label}`);gl.shaderSource(item,source);gl.compileShader(item);counters.shaderCompileCount+=1;if(!gl.getShaderParameter(item,gl.COMPILE_STATUS))throw new Error(`C2_SHADER_COMPILE_FAILED:${label}:${gl.getShaderInfoLog(item)}`);return item;};
  const uniform = (name) => {const location=gl.getUniformLocation(resources.program,name);if(location===null)throw new Error(`C2_UNIFORM_MISSING:${name}`);return location;};
  const upload = (target, data) => {if(initialized)counters.postInitializationBufferUploadCount+=1;counters.bufferUploadCount+=1;counters.uploadedByteLength+=data.byteLength;gl.bufferData(target,data,gl.STATIC_DRAW);};

  function initialize(packet) {
    if (initialized) throw new Error('C2_RENDERER_ALREADY_INITIALIZED');
    if (packet.packageIdentity !== renderPackage.packageIdentity || packet.packageContentDigest !== renderPackage.contentDigest) throw new Error('C2_INITIAL_PACKET_PACKAGE_MISMATCH');
    const vs=shader(gl.VERTEX_SHADER,VERTEX_SHADER,'VERTEX');const fs=shader(gl.FRAGMENT_SHADER,FRAGMENT_SHADER,'FRAGMENT');resources.program=gl.createProgram();if(!resources.program)throw new Error('C2_PROGRAM_CREATE_FAILED');gl.attachShader(resources.program,vs);gl.attachShader(resources.program,fs);gl.linkProgram(resources.program);counters.programLinkCount+=1;if(!gl.getProgramParameter(resources.program,gl.LINK_STATUS))throw new Error(`C2_PROGRAM_LINK_FAILED:${gl.getProgramInfoLog(resources.program)}`);
    resources.vertexArray=gl.createVertexArray();gl.bindVertexArray(resources.vertexArray);
    const specs=[['positions',views.positions,0,3,gl.FLOAT,false],['normals',views.normals,1,3,gl.FLOAT,false],['baseColorsLinear',views.baseColorsLinear,2,4,gl.FLOAT,false],['materialParameters',views.materialParameters,3,4,gl.FLOAT,false],['materialModelCodes',views.materialModelCodes,4,1,gl.UNSIGNED_BYTE,true],['surfaceClassCodes',views.surfaceClassCodes,5,1,gl.UNSIGNED_BYTE,true],['primitiveIndices',views.primitiveIndices,6,1,gl.UNSIGNED_SHORT,true],['roleCodes',views.roleCodes,7,1,gl.UNSIGNED_BYTE,true]];
    resources.buffers=[];for(const [name,data,location,size,type,integer] of specs){const buffer=gl.createBuffer();if(!buffer)throw new Error(`C2_BUFFER_CREATE_FAILED:${name}`);counters.bufferCreateCount+=1;resources.buffers.push(buffer);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);upload(gl.ARRAY_BUFFER,data);gl.enableVertexAttribArray(location);if(integer)gl.vertexAttribIPointer(location,size,type,0,0);else gl.vertexAttribPointer(location,size,type,false,0,0);}resources.indexBuffer=gl.createBuffer();if(!resources.indexBuffer)throw new Error('C2_INDEX_BUFFER_CREATE_FAILED');counters.bufferCreateCount+=1;gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,resources.indexBuffer);upload(gl.ELEMENT_ARRAY_BUFFER,views.indices);
    resources.colorTexture=gl.createTexture();resources.depthTexture=gl.createTexture();resources.framebuffer=gl.createFramebuffer();gl.bindTexture(gl.TEXTURE_2D,resources.colorTexture);gl.texStorage2D(gl.TEXTURE_2D,1,gl.RGBA8,width,height);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.bindTexture(gl.TEXTURE_2D,resources.depthTexture);gl.texStorage2D(gl.TEXTURE_2D,1,gl.DEPTH_COMPONENT24,width,height);gl.bindFramebuffer(gl.FRAMEBUFFER,resources.framebuffer);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,resources.colorTexture,0);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.TEXTURE_2D,resources.depthTexture,0);if(gl.checkFramebufferStatus(gl.FRAMEBUFFER)!==gl.FRAMEBUFFER_COMPLETE)throw new Error('C2_FRAMEBUFFER_INCOMPLETE');
    resources.uniforms={viewProjection:uniform('uViewProjection'),cameraPosition:uniform('uCameraPosition'),sunDirection:uniform('uSunDirection'),sunIntensity:uniform('uSunIntensity'),sunColor:uniform('uSunColor'),skyZenithColor:uniform('uSkyZenithColor'),skyHorizonColor:uniform('uSkyHorizonColor'),groundHazeColor:uniform('uGroundHazeColor'),fogStartDistance:uniform('uFogStartDistance'),fogFalloff:uniform('uFogFalloff'),maximumFogFactor:uniform('uMaximumFogFactor'),distanceDesaturationStrength:uniform('uDistanceDesaturationStrength'),timeSeconds:uniform('uTimeSeconds')};
    const environment=packet.environmentUniforms;resources.skyColor=color3(environment.skyHorizonColor);gl.useProgram(resources.program);gl.uniform3f(resources.uniforms.sunDirection,environment.sunDirection.x,environment.sunDirection.y,environment.sunDirection.z);gl.uniform1f(resources.uniforms.sunIntensity,environment.sunIntensity);gl.uniform3fv(resources.uniforms.sunColor,color3(environment.sunColor));gl.uniform3fv(resources.uniforms.skyZenithColor,color3(environment.skyZenithColor));gl.uniform3fv(resources.uniforms.skyHorizonColor,resources.skyColor);gl.uniform3fv(resources.uniforms.groundHazeColor,color3(environment.groundHazeColor));gl.uniform1f(resources.uniforms.fogStartDistance,environment.fogStartDistance);gl.uniform1f(resources.uniforms.fogFalloff,environment.fogFalloff);gl.uniform1f(resources.uniforms.maximumFogFactor,environment.maximumFogFactor);gl.uniform1f(resources.uniforms.distanceDesaturationStrength,environment.distanceDesaturationStrength);initialized=true;return getReceipt();
  }

  function renderFrame(packet, timeSeconds = 0) {
    if (!initialized) throw new Error('C2_RENDERER_NOT_INITIALIZED');
    if (!Array.isArray(packet.camera.viewProjectionMatrix) || packet.camera.viewProjectionMatrix.length !== 16 || packet.camera.viewProjectionMatrix.some((value)=>!finite(value))) throw new Error('C2_VIEW_PROJECTION_INVALID');
    const started=performance.now();gl.bindFramebuffer(gl.FRAMEBUFFER,resources.framebuffer);gl.viewport(0,0,width,height);gl.clearColor(...resources.skyColor,1);gl.clearDepth(1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.disable(gl.CULL_FACE);gl.useProgram(resources.program);gl.bindVertexArray(resources.vertexArray);gl.uniformMatrix4fv(resources.uniforms.viewProjection,false,new Float32Array(packet.camera.viewProjectionMatrix));gl.uniform3f(resources.uniforms.cameraPosition,packet.camera.position.x,packet.camera.position.y,packet.camera.position.z);gl.uniform1f(resources.uniforms.timeSeconds,timeSeconds);
    for(const range of packet.drawRanges){if(range.transparencyClass==='TRANSLUCENT'){gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(false);}else{gl.disable(gl.BLEND);gl.depthMask(true);}gl.drawElements(gl.TRIANGLES,range.indexCount,gl.UNSIGNED_INT,range.indexStart*4);}gl.depthMask(true);gl.disable(gl.BLEND);const error=gl.getError();if(error!==gl.NO_ERROR){counters.criticalGlErrorCount+=1;throw new Error(`C2_DRAW_ERROR:${error}`);}counters.frameCount+=1;counters.maximumRenderMs=Math.max(counters.maximumRenderMs,performance.now()-started);
  }

  function presentColorFrame(){gl.bindFramebuffer(gl.READ_FRAMEBUFFER,resources.framebuffer);gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER,null);gl.blitFramebuffer(0,0,width,height,0,0,width,height,gl.COLOR_BUFFER_BIT,gl.NEAREST);gl.bindFramebuffer(gl.FRAMEBUFFER,null);const error=gl.getError();if(error!==gl.NO_ERROR){counters.criticalGlErrorCount+=1;throw new Error(`C2_PRESENT_ERROR:${error}`);}counters.visiblePresentationCount+=1;}
  function captureColorSummary(){gl.bindFramebuffer(gl.FRAMEBUFFER,resources.framebuffer);const pixels=new Uint8Array(width*height*4);gl.readPixels(0,0,width,height,gl.RGBA,gl.UNSIGNED_BYTE,pixels);counters.colorReadbackCount+=1;let nonClear=0;const clear=resources.skyColor.map((entry)=>Math.round(entry*255));for(let i=0;i<pixels.length;i+=4){if(Math.abs(pixels[i]-clear[0])+Math.abs(pixels[i+1]-clear[1])+Math.abs(pixels[i+2]-clear[2])>12)nonClear+=1;}return {pixelCount:width*height,nonClearPixelCount:nonClear,nonClearRatio:nonClear/(width*height),byteHash:fnv1a(pixels)};}
  function getReceipt(){const debug=gl.getExtension('WEBGL_debug_renderer_info');return {rendererId:H_EARTH_C2_CANDIDATE_RENDERER_ID,initialized,dimensions:{width,height},context:{created:true,lost:gl.isContextLost(),version:gl.getParameter(gl.VERSION),renderer:gl.getParameter(gl.RENDERER),unmaskedRenderer:debug?gl.getParameter(debug.UNMASKED_RENDERER_WEBGL):null},packageIdentity:renderPackage.packageIdentity,packageContentDigest:renderPackage.contentDigest,rendererInterfaceId:rendererInterface.contractId,candidateViews:views.metrics,counters:{...counters},features:{visibleBeachCreated:views.metrics.reshapedTerrainVertexCount>0,sandbarProfilePresent:true,coastalMembershipsPresent:true,shallowWaterTurquoise:true,deepWaterDarkening:true,oceanMotionPresent:true,swashOrFoamPresent:true,macroTerrainDefinitionPresent:true},protections:{protectedVertexMutationCount:views.metrics.protectedVertexMutationCount,publicDefaultMutated:false,canonicalPackageMutated:false,navigationAuthorityMutated:false,inputAuthorityMutated:false}};}
  return Object.freeze({rendererId:H_EARTH_C2_CANDIDATE_RENDERER_ID,initialize,renderFrame,presentColorFrame,captureColorSummary,getReceipt});
}

export default createHEarthC2CandidateRenderer;
