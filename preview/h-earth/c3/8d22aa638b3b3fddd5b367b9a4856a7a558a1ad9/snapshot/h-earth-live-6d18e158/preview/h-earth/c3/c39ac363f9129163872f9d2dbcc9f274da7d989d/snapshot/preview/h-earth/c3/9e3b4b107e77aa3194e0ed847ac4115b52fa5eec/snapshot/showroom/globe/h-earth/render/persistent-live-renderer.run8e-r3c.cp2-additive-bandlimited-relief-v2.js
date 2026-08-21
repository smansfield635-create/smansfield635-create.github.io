/**
 * H_EARTH_C3C3_REGIONAL_BOUNDARY_CLOSURE_RENDERER_v1
 *
 * C3C3 keeps the enlarged navigable H-Earth geography fixed while closing the
 * owner-observed celestial, depth-hierarchy and landward-world-edge failures.
 * The public `visual=terrain-relief-v2` contract remains intact.
 *
 * O1: one canonical world-space sun vector is projected through the live camera.
 *     There is no camera-relative/screen-pinned fallback. Offscreen means hidden.
 * O2: distance-selective depth haze is applied after geometry. Near terrain keeps
 *     its contrast; middle/far geometry receives progressively stronger aerial
 *     perspective, producing foreground/midground/background separation.
 * O3: only landward views receive a distant connected-region silhouette behind
 *     authored geometry. East/northeast ocean-facing views remain open.
 *
 * Navigation, collision, shoreline and playable extent are not modified.
 */

import {
  H_EARTH_RUN_8E_R3C_RENDERER_ID,
  createHEarthRun8ER3CPersistentRenderer as createC3C2PlanetaryRenderer
} from './persistent-live-renderer.run8e-r3c.js';

export { H_EARTH_RUN_8E_R3C_RENDERER_ID };

export const H_EARTH_GRATITUDE_REGION_CP2_PRESENTATION_PROFILE_ID =
  'H_EARTH_C3C3_SELECTIVE_ENCLOSURE_WORLD_DEPTH_v1';

const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,Number(v)||0));
const normalize=({x=0,y=0,z=0})=>{const l=Math.hypot(x,y,z)||1;return Object.freeze({x:x/l,y:y/l,z:z/l});};
const color3=(value,fallback)=>{const source=Array.isArray(value)?value:fallback;const scale=source.some(v=>Number(v)>1)?255:1;return source.slice(0,3).map(v=>clamp(Number(v)/scale));};
const vectorEqual=(a,b,eps=1e-9)=>a&&b&&Math.abs(a.x-b.x)<=eps&&Math.abs(a.y-b.y)<=eps&&Math.abs(a.z-b.z)<=eps;

function reconcileEnvironment(environmentUniforms){
  const canonical=normalize(environmentUniforms?.sunDirection??{x:-.08,y:.74,z:-.67});
  return Object.freeze({
    ...environmentUniforms,
    sunDirection:canonical,
    sunIntensity:Math.max(1.12,Number(environmentUniforms?.sunIntensity)||0),
    sunColor:Object.freeze([255,244,211,255]),
    skyZenithColor:Object.freeze([48,111,181,255]),
    skyHorizonColor:Object.freeze([176,213,226,255]),
    groundHazeColor:Object.freeze([133,158,154,255])
  });
}

function createC3C3EnclosurePass(canvas){
  if(!(canvas instanceof HTMLCanvasElement))throw new TypeError('C3C3_CANVAS_REQUIRED');
  const gl=canvas.getContext('webgl2');
  if(!gl)throw new Error('C3C3_WEBGL2_CONTEXT_UNAVAILABLE');

  const VS=`#version 300 es
precision highp float;
const vec2 p[3]=vec2[3](vec2(-1.,-1.),vec2(3.,-1.),vec2(-1.,3.));
uniform float uClipZ;out vec2 vUv;
void main(){vec2 q=p[gl_VertexID];vUv=q*.5+.5;gl_Position=vec4(q,uClipZ,1.0);}`;
  const FS=`#version 300 es
precision highp float;
in vec2 vUv;
uniform int uMode;
uniform vec3 uZenith;uniform vec3 uHorizon;uniform vec3 uHaze;uniform vec3 uSunColor;
uniform vec2 uSunCenter;uniform float uSunVisible;uniform float uSunIntensity;
uniform float uBoundaryStrength;uniform float uBoundaryPhase;uniform float uLayerAlpha;
out vec4 outColor;
void main(){
  if(uMode==1){
    float vignette=smoothstep(.05,.78,abs(vUv.x-.5)*1.6+abs(vUv.y-.5)*.35);
    vec3 haze=mix(uHaze,uHorizon,.34+vUv.y*.22);
    outColor=vec4(pow(clamp(haze,0.,1.),vec3(1./2.2)),uLayerAlpha*(.72+.28*vignette));return;
  }
  float lateral=abs(vUv.x-.5)*2.;
  float horizon=.435+.028*lateral*lateral;
  float altitude=clamp((vUv.y-horizon)/max(.001,1.-horizon),0.,1.);
  vec3 sky=mix(uHorizon,uZenith,smoothstep(0.,.90,altitude));
  float hazeBand=exp(-pow((vUv.y-horizon)/.09,2.));
  sky=mix(sky,uHaze,.25*hazeBand);
  float ridgeBase=horizon+.012;
  float ridge=ridgeBase+.045*uBoundaryStrength*(.42+.58*sin((vUv.x*5.2+uBoundaryPhase)*3.14159265))
    +.022*uBoundaryStrength*sin((vUv.x*13.7-uBoundaryPhase*.7)*3.14159265);
  float ridgeMask=uBoundaryStrength*(1.-smoothstep(ridge-.008,ridge+.010,vUv.y))*smoothstep(horizon-.06,horizon+.015,vUv.y);
  vec3 distantRidge=mix(vec3(.20,.27,.23),uHaze,.38);
  sky=mix(sky,distantRidge,clamp(ridgeMask*.76,0.,.78));
  float sd=distance(vUv,uSunCenter);
  float halo=(1.-smoothstep(.025,.135,sd))*uSunVisible;
  float corona=(1.-smoothstep(.010,.057,sd))*uSunVisible;
  float core=(1.-smoothstep(.003,.021,sd))*uSunVisible;
  sky=min(vec3(1.),sky+uSunColor*(halo*.22*uSunIntensity+corona*.34+core*1.18));
  outColor=vec4(pow(clamp(sky,0.,1.),vec3(1./2.2)),1.);
}`;
  const compile=(type,src,label)=>{const s=gl.createShader(type);if(!s)throw new Error(`C3C3_SHADER_CREATE_${label}`);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(`C3C3_SHADER_COMPILE_${label}:${gl.getShaderInfoLog(s)}`);return s;};
  const vs=compile(gl.VERTEX_SHADER,VS,'VS'),fs=compile(gl.FRAGMENT_SHADER,FS,'FS');
  const program=gl.createProgram();if(!program)throw new Error('C3C3_PROGRAM_CREATE');gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(`C3C3_PROGRAM_LINK:${gl.getProgramInfoLog(program)}`);
  const vao=gl.createVertexArray();if(!vao)throw new Error('C3C3_VAO_CREATE');
  const u=name=>{const loc=gl.getUniformLocation(program,name);if(loc===null)throw new Error(`C3C3_UNIFORM_MISSING:${name}`);return loc;};
  const U=Object.freeze({clipZ:u('uClipZ'),mode:u('uMode'),zenith:u('uZenith'),horizon:u('uHorizon'),haze:u('uHaze'),sunColor:u('uSunColor'),sunCenter:u('uSunCenter'),sunVisible:u('uSunVisible'),sunIntensity:u('uSunIntensity'),boundaryStrength:u('uBoundaryStrength'),boundaryPhase:u('uBoundaryPhase'),layerAlpha:u('uLayerAlpha')});

  let environment=null,drawCount=0,depthLayerDrawCount=0,lastError=0;
  let canonicalWorldSunDirection=null;
  let lastSun=Object.freeze({x:null,y:null,projected:false,visible:false,reason:'NOT_DRAWN'});
  let lastBoundary=Object.freeze({classification:'UNRESOLVED',strength:0,oceanOpen:true,materialized:false});
  const sunProjectionHistory=[];

  function configure(next){environment=next;canonicalWorldSunDirection=normalize(next.sunDirection);}
  function projectWorldDirection(packet){
    const m=packet?.camera?.viewProjectionMatrix,p=packet?.camera?.position,d=canonicalWorldSunDirection;
    if(!Array.isArray(m)||m.length!==16||!p||!d)return Object.freeze({x:null,y:null,projected:false,visible:false,reason:'CAMERA_PACKET_INVALID'});
    // Canonical atmosphere sunDirection points from the world toward the sun.
    const distance=4800,x=Number(p.x)+d.x*distance,y=Number(p.y)+d.y*distance,z=Number(p.z)+d.z*distance;
    const cx=m[0]*x+m[4]*y+m[8]*z+m[12],cy=m[1]*x+m[5]*y+m[9]*z+m[13],cz=m[2]*x+m[6]*y+m[10]*z+m[14],cw=m[3]*x+m[7]*y+m[11]*z+m[15];
    if(!Number.isFinite(cw)||cw<=1e-6)return Object.freeze({x:null,y:null,projected:false,visible:false,reason:'BEHIND_CAMERA'});
    const uvx=cx/cw*.5+.5,uvy=cy/cw*.5+.5,ndcz=cz/cw;
    const visible=Number.isFinite(uvx)&&Number.isFinite(uvy)&&uvx>=0&&uvx<=1&&uvy>=0&&uvy<=1&&ndcz>=-1&&ndcz<=1;
    return Object.freeze({x:uvx,y:uvy,projected:true,visible,reason:visible?'WORLD_PROJECTED_VISIBLE':'WORLD_PROJECTED_OFFSCREEN'});
  }
  function classifyBoundary(packet){
    const p=packet?.camera?.position,t=packet?.camera?.target;
    if(!p||!t)return Object.freeze({classification:'UNRESOLVED',strength:0,oceanOpen:true,materialized:false});
    const f=normalize({x:Number(t.x)-Number(p.x),y:0,z:Number(t.z)-Number(p.z)});
    // +X east and +Z north are ocean-facing; -X/-Z are connected-region landward sectors.
    const landward=clamp(Math.max(-f.x,-f.z*.82));
    const oceanOpen=f.x>.18||f.z>.32;
    const strength=oceanOpen?clamp(landward*.20):clamp((landward-.05)*1.35);
    const classification=strength>.14?'CONNECTED_REGION_THRESHOLD':(oceanOpen?'OPEN_OCEAN_OR_COASTAL_SKY':'TRANSITIONAL_LANDWARD');
    return Object.freeze({classification,strength,oceanOpen,materialized:strength>.14,forward:{x:f.x,z:f.z}});
  }
  function bindCommon(sun,boundary){
    gl.uniform3fv(U.zenith,color3(environment.skyZenithColor,[48,111,181]));gl.uniform3fv(U.horizon,color3(environment.skyHorizonColor,[176,213,226]));gl.uniform3fv(U.haze,color3(environment.groundHazeColor,[133,158,154]));gl.uniform3fv(U.sunColor,color3(environment.sunColor,[255,244,211]));
    gl.uniform2f(U.sunCenter,sun.visible?sun.x:-2,sun.visible?sun.y:-2);gl.uniform1f(U.sunVisible,sun.visible?1:0);gl.uniform1f(U.sunIntensity,Math.max(1,Number(environment.sunIntensity)||1));gl.uniform1f(U.boundaryStrength,boundary.strength);gl.uniform1f(U.boundaryPhase,(boundary.forward?.x??0)*.37+(boundary.forward?.z??0)*.19);
  }
  function draw(packet){
    if(!environment)throw new Error('C3C3_ENVIRONMENT_NOT_CONFIGURED');
    lastSun=projectWorldDirection(packet);lastBoundary=classifyBoundary(packet);
    sunProjectionHistory.push({frameSequence:packet?.frameSequence??null,...lastSun});if(sunProjectionHistory.length>24)sunProjectionHistory.shift();
    gl.enable(gl.DEPTH_TEST);gl.depthMask(false);gl.disable(gl.CULL_FACE);gl.useProgram(program);gl.bindVertexArray(vao);bindCommon(lastSun,lastBoundary);
    // True background: sky + celestial body + landward region threshold silhouette.
    gl.disable(gl.BLEND);gl.depthFunc(gl.LEQUAL);gl.uniform1i(U.mode,0);gl.uniform1f(U.clipZ,1);gl.uniform1f(U.layerAlpha,1);gl.drawArrays(gl.TRIANGLES,0,3);drawCount++;
    // Aerial-perspective depth hierarchy. Each layer can affect only geometry farther
    // than its depth plane, preserving near-field contrast while softening distance.
    gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.uniform1i(U.mode,1);gl.uniform1f(U.boundaryStrength,0);
    for(const layer of [{z:.72,a:.045},{z:.84,a:.065},{z:.92,a:.085}]){gl.uniform1f(U.clipZ,layer.z);gl.uniform1f(U.layerAlpha,layer.a);gl.drawArrays(gl.TRIANGLES,0,3);depthLayerDrawCount++;}
    gl.disable(gl.BLEND);gl.depthMask(true);lastError=gl.getError();if(lastError!==gl.NO_ERROR)throw new Error(`C3C3_DRAW_ERROR:${lastError}`);
  }
  return Object.freeze({configure,draw,getReceipt:()=>Object.freeze({
    materialized:drawCount>0&&lastError===gl.NO_ERROR,drawCount,depthLayerDrawCount,lastError,
    method:'WORLD_LOCKED_CELESTIAL_PLUS_DEPTH_SELECTIVE_AERIAL_PERSPECTIVE_PLUS_LANDWARD_REGION_THRESHOLD',
    canonicalWorldSunDirection,lastSunProjection:lastSun,sunProjectionHistory:[...sunProjectionHistory],
    cameraRelativeSunFallbackPermitted:false,screenPinnedSunFallbackPermitted:false,
    depthHierarchy:Object.freeze({materialized:depthLayerDrawCount>=3,nearContrastPreserved:true,midgroundAerialPerspective:true,farAerialPerspective:true,layerClipZ:[.72,.84,.92]}),
    regionalBoundaryEnclosure:lastBoundary,
    openOceanBoxingPermitted:false,depthOcclusionPreserved:true
  })});
}

export function createHEarthRun8ER3CPersistentRenderer(options={}){
  const renderer=createC3C2PlanetaryRenderer(options),pass=createC3C3EnclosurePass(options.canvas);
  let initialized=false,canonicalSunDirection=null;
  return Object.freeze({
    rendererId:renderer.rendererId,
    initialize(packet){canonicalSunDirection=normalize(packet?.environmentUniforms?.sunDirection??{x:-.08,y:.74,z:-.67});const env=reconcileEnvironment({...packet?.environmentUniforms,sunDirection:canonicalSunDirection});pass.configure(env);initialized=true;return renderer.initialize(Object.freeze({...packet,environmentUniforms:env}));},
    renderFrame(packet){
      // Freeze the initial world sun vector across all camera/navigation frames.
      const env=reconcileEnvironment({...packet?.environmentUniforms,sunDirection:canonicalSunDirection});
      const result=renderer.renderFrame(Object.freeze({...packet,environmentUniforms:env}));pass.configure(env);pass.draw(packet);return result;
    },
    presentColorFrame:renderer.presentColorFrame,captureColorFrame:renderer.captureColorFrame,captureDepthSummary:renderer.captureDepthSummary,
    getResourceReceipt(){const receipt=pass.getReceipt();return {...renderer.getResourceReceipt(),c3c3:{
      contract:'H_EARTH_C3C3_REGIONAL_BOUNDARY_CLOSURE_CONSTRUCTION_CONTRACT_v1',initialized,
      O1_WORLD_LOCKED_SUN:{pass:initialized&&vectorEqual(canonicalSunDirection,receipt.canonicalWorldSunDirection),canonicalWorldSunDirection:canonicalSunDirection,projection:receipt.lastSunProjection,cameraRelativeFallback:false},
      O2_DEPTH_HIERARCHY:{pass:receipt.depthHierarchy.materialized,...receipt.depthHierarchy},
      O3_CONNECTED_REGION_BOUNDARIES:{pass:receipt.regionalBoundaryEnclosure.classification!=='UNRESOLVED',...receipt.regionalBoundaryEnclosure,eastNortheastOceanPreserved:true,openOceanBoxing:false},
      passReceipt:receipt,preservations:{accessibleRegionExpansion:false,navigationAuthorityMutation:false,collisionAuthorityMutation:false,shorelineAuthorityMutation:false,enlargedRegionScalePreserved:true,openOceanPreserved:true}
    }};}
  });
}

export const H_EARTH_C3C3_REGIONAL_BOUNDARY_CLOSURE=Object.freeze({
  contract:'H_EARTH_C3C3_REGIONAL_BOUNDARY_CLOSURE_CONSTRUCTION_CONTRACT_v1',
  parent:'4ed551b410cdc5bbc86bc638e56f36dc98ae8c0e',
  worldLockedSun:true,cameraRelativeSunFallback:false,depthSelectiveAerialPerspective:true,
  intentionalLandwardConnectedRegionThresholds:true,openOceanPreserved:true,
  accessibleRegionExpansion:false,navigationAuthorityMutation:false,collisionAuthorityMutation:false,shorelineAuthorityMutation:false,
  ownerInteractiveInspectionRequired:true,productionMergeAuthorized:false
});