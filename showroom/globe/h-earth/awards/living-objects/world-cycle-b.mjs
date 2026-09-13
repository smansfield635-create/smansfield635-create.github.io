import {
  MIRRORLAND_3D_AUTHORITY,
  buildMirrorland3DGeometry
} from '../../../../../assets/compass/compass.mirrorland-3d-geometry.mjs';

const CONTRACT=Object.freeze({
  id:'AWARDS_WORLD_LIVING_OBJECT_CYCLE_C_V1',
  cycle:'B_WORLD',
  claim:'The browser can hold a world.',
  recognizableObject:'LIVING_SUN_DYING_SUN_COLD_MOON_OPENING_MOON_MIRRORLAND_3D_REBIRTH',
  renderer:'WEBGL_SINGLE_CONTEXT_CONTINUOUS_GEOMETRY_TRANSFORMATION',
  signatureEvent:'WORLD_CELESTIAL_THRESHOLD_RESOLVE',
  eventCount:1,
  implementationClass:'EXISTING_CONSTRUCT_ADOPTION_WITH_PROJECTION_PRESERVING_3D_LIFT',
  sourceBinding:Object.freeze({
    lawsCelestial:Object.freeze({
      path:'/laws/index.crystals.js',
      blob:'27577c49250f42b03d123f8105e1d55d59c3a4b4',
      contract:'DGB_LAWS_CRYSTALS_EXACT_TWO_OBJECT_RECONCILIATION_v2',
      solar:Object.freeze({radius:.66,segments:48,rings:32,mode:'solar'}),
      lunar:Object.freeze({radius:.66,segments:64,rings:44,mode:'lunar'}),
      sharedSphereTopology:false,
      algorithm:'createCelestialSphereMesh'
    }),
    mirrorland:Object.freeze({
      path:'/assets/compass/compass.mirrorland-window.js',
      blob:'f99d3ffedf7b7654d067d21d9363eb287877f852',
      contract:'DGB_COMPASS_MIRRORLAND_WINDOW_HARDENED_v2',
      paneCount:21,
      geometryKernel:'/assets/compass/compass.mirrorland-3d-geometry.mjs',
      lift:'PROJECTION_PRESERVING_TRUE_3D'
    }),
    compassCrystals:Object.freeze({
      path:'/assets/compass/compass.crystals.js',
      blob:'cd2cbad0494852cc80c51959a6827407d037b8fb',
      disposition:'EXCLUSION_AUTHORITY_ONLY',
      included:false
    })
  }),
  timeline:Object.freeze({
    durationMs:15000,
    reducedTransitionMs:120,
    phases:Object.freeze([
      Object.freeze({id:'SUN_LOCK',a:0,b:.2}),
      Object.freeze({id:'SUN_TO_MOON',a:.2,b:1/3}),
      Object.freeze({id:'MOON_LOCK',a:1/3,b:8/15}),
      Object.freeze({id:'MOON_TO_MIRRORLAND',a:8/15,b:2/3}),
      Object.freeze({id:'MIRRORLAND_LOCK',a:2/3,b:13/15}),
      Object.freeze({id:'MIRRORLAND_TO_SUN',a:13/15,b:1})
    ])
  }),
  narrative:Object.freeze([
    'LIVING_SUN','DYING_SUN','DEAD_COLD_MOON','STRETCHED_OPENING_MOON',
    'MIRRORLAND_3D','RECOMPOSITION_REBIRTH','LIVING_SUN'
  ]),
  lifecycle:Object.freeze(['REAR_INERT','APPROACHING','FOREGROUND_REST','SIGNATURE_PLAY','FOREGROUND_IDLE','SELECT_RESPONSE','READER_OPEN','RETURN_RESTORING'])
});

function clamp(v,a=0,b=1){return Math.max(a,Math.min(b,v))}
function lerp(a,b,t){return a+(b-a)*t}
function smooth(t){t=clamp(t);return t*t*(3-2*t)}
function normalizeVector(v,f=[0,0,1]){
  const l=Math.hypot(v[0],v[1],v[2]);
  return Number.isFinite(l)&&l>1e-12?[v[0]/l,v[1]/l,v[2]/l]:f.slice();
}
function cross(a,b){return [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]}
function subtract(a,b){return [a[0]-b[0],a[1]-b[1],a[2]-b[2]]}

/*
  Deterministic adaptation of the frozen Laws createCelestialSphereMesh authority.
  The field constants, crater/maria/plain sets, solar activity set, displacement
  equations, terrain equations, and neighbor-sampled normals are preserved.
*/
function createCelestialAuthority(mode='lunar',radius=.66){
  const craters=[
    [0.34,0.18,0.92,0.46,0.072,0.94,0.12,1.00,0.18],
    [-0.48,0.52,0.70,0.37,0.054,0.64,0.48,0.94,0.48],
    [0.58,-0.34,0.74,0.29,0.046,0.84,0.22,0.98,0.26],
    [-0.62,-0.22,0.75,0.24,0.034,0.42,0.70,0.74,0.72],
    [0.12,0.72,0.68,0.205,0.032,0.76,0.30,0.92,0.34],
    [0.76,0.22,0.61,0.175,0.026,0.52,0.60,0.78,0.64],
    [-0.18,-0.66,0.73,0.158,0.025,0.88,0.16,0.94,0.16],
    [0.08,-0.18,0.98,0.137,0.021,0.70,0.40,0.88,0.44],
    [-0.34,0.06,0.94,0.116,0.017,0.36,0.78,0.62,0.80],
    [0.44,0.62,0.65,0.108,0.016,0.80,0.22,0.90,0.22],
    [-0.76,0.34,0.55,0.098,0.014,0.46,0.66,0.66,0.70],
    [0.28,-0.78,0.56,0.091,0.013,0.88,0.14,0.88,0.14],
    [0.64,-0.02,-0.77,0.195,0.028,0.62,0.48,0.82,0.52],
    [-0.42,0.38,-0.82,0.132,0.019,0.40,0.72,0.60,0.78],
    [0.16,-0.52,-0.84,0.083,0.011,0.74,0.34,0.74,0.34]
  ].map(r=>({center:normalizeVector(r.slice(0,3)),radius:r[3],depth:r[4],rimSharpness:r[5],erosion:r[6],visibility:r[7],partialBias:r[8]}));
  const lunarMaria=[
    [0.12,0.30,0.95,0.57,0.88],[-0.56,-0.08,0.82,0.44,0.75],
    [0.61,-0.42,0.67,0.36,0.62],[-0.24,0.72,-0.65,0.40,0.58]
  ].map(r=>({center:normalizeVector(r.slice(0,3)),radius:r[3],strength:r[4]}));
  const lunarPlains=[
    [0.70,0.38,0.60,0.47,0.90],[-0.12,-0.72,0.68,0.52,0.94],[-0.72,0.46,-0.52,0.43,0.82]
  ].map(r=>({center:normalizeVector(r.slice(0,3)),radius:r[3],strength:r[4]}));
  const solarActivity=[
    [0.44,0.18,0.88,0.18,0.95],[-0.34,-0.36,0.87,0.14,0.82],
    [0.62,-0.56,-0.54,0.20,0.70],[-0.58,0.48,0.66,0.16,0.76]
  ].map(r=>({center:normalizeVector(r.slice(0,3)),radius:r[3],strength:r[4]}));

  function mixColor(a,b,amount){
    const t=clamp(amount,0,1);
    return [a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];
  }
  function deterministicField(x,y,z,frequency,phase){
    return Math.sin((x*1.73+y*2.11+z*2.67)*frequency+phase)*.50+
      Math.sin((x*2.93-y*1.37+z*1.91)*frequency*1.61-phase*.73)*.30+
      Math.sin((-x*1.17+y*2.51+z*3.07)*frequency*2.37+phase*1.29)*.20;
  }
  function smoothTransition(edge0,edge1,value){
    const a=clamp((value-edge0)/(edge1-edge0),0,1);return a*a*(3-2*a);
  }
  function regionField(regions,nx,ny,nz,phase){
    let field=0;
    for(const region of regions){
      const angularDistance=Math.acos(clamp(nx*region.center[0]+ny*region.center[1]+nz*region.center[2],-1,1));
      const boundaryWarp=deterministicField(nx,ny,nz,2.8,phase+region.radius*7.3)*.12;
      const normalizedDistance=angularDistance/region.radius+boundaryWarp;
      const mask=1-smoothTransition(.60,1.08,normalizedDistance);
      field=Math.max(field,mask*region.strength);
    }
    return clamp(field,0,1);
  }
  function craterField(nx,ny,nz){
    let relief=0,albedo=0,basin=0;
    for(const crater of craters){
      const angularDistance=Math.acos(clamp(nx*crater.center[0]+ny*crater.center[1]+nz*crater.center[2],-1,1));
      const normalizedDistance=angularDistance/crater.radius;
      const bowlFalloff=2.30+(1-crater.erosion)*2.35;
      const bowl=Math.exp(-normalizedDistance*normalizedDistance*bowlFalloff);
      const wallCenter=.57+crater.erosion*.10;
      const wallWidth=2.9+(1-crater.erosion)*3.2;
      const wall=Math.exp(-Math.pow((normalizedDistance-wallCenter)*wallWidth,2));
      const rimCenter=.82+crater.erosion*.06;
      const rimWidth=4.3+(1-crater.erosion)*6.7;
      let rim=Math.exp(-Math.pow((normalizedDistance-rimCenter)*rimWidth,2));
      const partial=clamp(.58+deterministicField(nx,ny,nz,3.7,crater.partialBias*5.3)*.42,.10,1);
      rim*=.44+partial*.56;
      const ejecta=Math.exp(-Math.pow((normalizedDistance-1.19)*(2.6+crater.erosion*1.6),2));
      const visibility=crater.visibility;
      relief+=(rim*crater.depth*crater.rimSharpness*1.08+
        wall*crater.depth*(.12+(1-crater.erosion)*.09)-
        bowl*crater.depth*(1.02+(1-crater.erosion)*.30)+
        ejecta*crater.depth*(.05+(1-crater.erosion)*.09))*visibility;
      albedo+=(rim*(.14+crater.rimSharpness*.18)+wall*.035-
        bowl*(.15+crater.depth*2.10)+ejecta*.030)*visibility;
      basin=Math.max(basin,bowl*visibility*smoothTransition(.20,.44,crater.radius));
    }
    return {relief,albedo,basin};
  }

  function sampleDirection(nx,ny,nz){
    const d=normalizeVector([nx,ny,nz]);nx=d[0];ny=d[1];nz=d[2];
    let relief=1,surfaceColor;
    if(mode==='solar'){
      const broad=deterministicField(nx,ny,nz,2.65,.73);
      const turbulentFold=deterministicField(nx,ny,nz,6.9,2.17);
      const channelSource=Math.abs(deterministicField(nx,ny,nz,4.2,1.07));
      const branchingChannel=1-smoothTransition(.055,.31,channelSource);
      const fine=deterministicField(nx,ny,nz,24.0,1.31);
      let activity=0;
      for(const region of solarActivity){
        const angularDistance=Math.acos(clamp(nx*region.center[0]+ny*region.center[1]+nz*region.center[2],-1,1));
        activity+=Math.exp(-Math.pow(angularDistance/region.radius,2)*2.2)*region.strength;
      }
      activity=clamp(activity,0,1);
      const heat=clamp(.50+broad*.18+turbulentFold*.13+fine*.050-branchingChannel*.17+activity*.11,0,1);
      const darkAmber=[.38,.070,.006],burntOrange=[.72,.145,.008],deepOrange=[1,.335,.015],plasmaGold=[1,.690,.075],hotGranule=[1,.970,.67];
      if(heat<.25)surfaceColor=mixColor(darkAmber,burntOrange,heat/.25);
      else if(heat<.55)surfaceColor=mixColor(burntOrange,deepOrange,(heat-.25)/.30);
      else if(heat<.80)surfaceColor=mixColor(deepOrange,plasmaGold,(heat-.55)/.25);
      else surfaceColor=mixColor(plasmaGold,hotGranule,(heat-.80)/.20);
      relief+=broad*.0036+turbulentFold*.0025+fine*.0009-branchingChannel*.0014+activity*.0018;
    }else{
      const macroTerrain=deterministicField(nx,ny,nz,2.10,1.43);
      const highlandTerrain=deterministicField(nx,ny,nz,5.4,.39);
      const ridgeTerrain=deterministicField(nx,ny,nz,8.6,1.17);
      const fineTerrain=deterministicField(nx,ny,nz,18.8,2.07);
      const crater=craterField(nx,ny,nz);
      const maria=regionField(lunarMaria,nx,ny,nz,.83);
      const plains=regionField(lunarPlains,nx,ny,nz,2.19);
      const calmTerrain=clamp(Math.max(plains,maria*.70),0,1);
      const roughnessScale=1-calmTerrain*.82;
      const light=normalizeVector([-.62,.22,.75]);
      const illumination=nx*light[0]+ny*light[1]+nz*light[2];
      const terminator=.14+.86*smoothTransition(-.20,.22,illumination);
      const highlands=smoothTransition(-.20,.34,macroTerrain+highlandTerrain*.43+ridgeTerrain*.14+crater.albedo*.68)*(1-maria*.84);
      const neutralAlbedo=clamp(.54+highlands*.30-maria*.32+plains*.055+macroTerrain*.050+crater.albedo*.45,.16,.97);
      const reliefLighting=clamp(.82+macroTerrain*.060+highlandTerrain*.100*roughnessScale+
        ridgeTerrain*.055*roughnessScale+fineTerrain*.018*roughnessScale+
        crater.albedo*.36-crater.basin*.075,.50,1.16);
      const shade=clamp(neutralAlbedo*(.31+terminator*.69)*reliefLighting,.045,1);
      const selectedRimHighlight=clamp(crater.albedo,0,1)*smoothTransition(-.02,.55,illumination)*.065;
      const bowlShadow=clamp(-crater.albedo,0,1)*(.018+terminator*.024);
      const reflectedCoolTint=(1-terminator)*.003;
      relief+=macroTerrain*.0048+highlandTerrain*.0068*roughnessScale+
        ridgeTerrain*.0034*roughnessScale+fineTerrain*.0013*roughnessScale+
        crater.relief*(1-maria*.16);
      surfaceColor=[
        clamp(shade*1.018+selectedRimHighlight-bowlShadow,0,1),
        clamp(shade*1.012+selectedRimHighlight*.92-bowlShadow*.98,0,1),
        clamp(shade+selectedRimHighlight*.82-bowlShadow*.96+reflectedCoolTint,0,1)
      ];
    }
    const radial=radius*relief;
    return {radialNormal:[nx,ny,nz],position:[nx*radial,ny*radial,nz*radial],color:surfaceColor};
  }
  function surfaceSample(phi,theta){
    return sampleDirection(Math.sin(phi)*Math.cos(theta),Math.cos(phi),Math.sin(phi)*Math.sin(theta));
  }
  function point(ring,segment,segments,rings){
    const phi=ring/rings*Math.PI,theta=segment/segments*Math.PI*2;
    const sample=surfaceSample(phi,theta);
    const phiStep=Math.PI/rings*.32,thetaStep=Math.PI*2/segments*.32;
    const phiMinus=Math.max(.0001,phi-phiStep),phiPlus=Math.min(Math.PI-.0001,phi+phiStep);
    const tangentTheta=subtract(surfaceSample(phi,theta+thetaStep).position,surfaceSample(phi,theta-thetaStep).position);
    const tangentPhi=subtract(surfaceSample(phiPlus,theta).position,surfaceSample(phiMinus,theta).position);
    let normal=normalizeVector(cross(tangentTheta,tangentPhi),sample.radialNormal);
    const outward=normal[0]*sample.radialNormal[0]+normal[1]*sample.radialNormal[1]+normal[2]*sample.radialNormal[2];
    if(outward<0)normal=normal.map(v=>-v);
    return {position:sample.position,normal,color:sample.color};
  }
  function mesh(segments,rings){
    segments=Math.max(24,segments||48);rings=Math.max(16,rings||32);
    const p=[],n=[],c=[];
    const push=v=>{p.push(...v.position);n.push(...v.normal);c.push(...v.color)};
    for(let ring=0;ring<rings;ring++){
      for(let segment=0;segment<segments;segment++){
        const next=(segment+1)%segments;
        const a=point(ring,segment,segments,rings),b=point(ring+1,segment,segments,rings),
          cc=point(ring+1,next,segments,rings),d=point(ring,next,segments,rings);
        push(a);push(b);push(cc);push(a);push(cc);push(d);
      }
    }
    return Object.freeze({p:new Float32Array(p),n:new Float32Array(n),c:new Float32Array(c),vertexCount:p.length/3});
  }
  return Object.freeze({mode,radius,sampleDirection,mesh});
}

const VS=`precision mediump float;
attribute vec3 a_position;
attribute vec3 a_normal;
attribute vec3 a_color;
attribute vec3 a_targetPosition;
attribute vec3 a_targetNormal;
attribute vec3 a_targetColor;
attribute vec4 a_fx;
attribute vec2 a_fx2;
uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_proj;
uniform float u_morph;
uniform float u_haloPass;
uniform float u_haloExpansion;
varying vec3 v_n;
varying vec3 v_c;
varying vec3 v_p;
varying vec4 v_fx;
varying float v_style;
varying float v_highlight;
varying float v_morph;
void main(){
  vec3 local=mix(a_position,a_targetPosition,u_morph);
  vec3 normal=normalize(mix(a_normal,a_targetNormal,u_morph));
  if(u_haloPass>.5)local+=normal*u_haloExpansion;
  vec4 world=u_model*vec4(local,1.0);
  v_n=normalize(mat3(u_model)*normal);
  v_c=mix(a_color,a_targetColor,u_morph);
  v_p=world.xyz;
  v_fx=a_fx;
  v_style=a_fx2.y;
  v_highlight=a_fx2.x;
  v_morph=u_morph;
  gl_Position=u_proj*u_view*world;
}`;

const FS=`precision mediump float;
varying vec3 v_n;
varying vec3 v_c;
varying vec3 v_p;
varying vec4 v_fx;
varying float v_style;
varying float v_highlight;
varying float v_morph;
uniform float u_time;
uniform float u_transitionMode;
uniform float u_solarMix;
uniform float u_haloPass;
uniform float u_signature;

float sat(float x){return clamp(x,0.0,1.0);}
float hash31(vec3 p){return fract(sin(dot(p,vec3(12.9898,78.233,37.719)))*43758.5453);}
float solarWave(vec3 p,float frequency,float phase){
  return sin(dot(p,vec3(1.73,2.11,2.67))*frequency+phase)*0.48+
    sin(dot(p,vec3(-2.93,1.37,1.91))*frequency*1.61-phase*0.73)*0.31+
    sin(dot(p,vec3(1.17,-2.51,3.07))*frequency*2.37+phase*1.29)*0.21;
}
vec3 solarAdvect(vec3 p,float t){
  float shearA=sin(p.y*5.3+p.z*2.2+t*0.31)*0.13;
  float shearB=sin(p.z*4.1-p.x*2.7-t*0.23)*0.11;
  float vortex=sin((p.x*p.y-p.z*p.z)*8.0+t*0.47)*0.09;
  return normalize(p+vec3(
    shearA+sin(p.z*7.0-t*0.19)*0.08,
    shearB+sin(p.x*6.2+t*0.27)*0.08,
    vortex+sin(p.y*5.7-t*0.33)*0.07
  ));
}
float solarLargeField(vec3 p,float t){
  vec3 q=solarAdvect(p,t);
  float collisionFold=sin((q.x*q.y+q.y*q.z-q.z*q.x)*7.5+t*0.37);
  return clamp(solarWave(q,1.05,t*0.41)*0.72+solarWave(q.yzx,0.72,-t*0.29)*0.28+collisionFold*0.16,-1.0,1.0);
}
float solarMediumField(vec3 p,float t){
  vec3 q=solarAdvect(p,t*1.13+0.7);
  return clamp(solarWave(q,2.75,-t*0.53)*0.62+solarWave(q.zxy,3.85,t*0.36)*0.38,-1.0,1.0);
}
float solarFineField(vec3 p,float t){
  vec3 q=solarAdvect(p,t*0.83-1.4);
  return clamp(solarWave(q,9.8,t*0.91)*0.58+solarWave(q.yzx,14.6,-t*0.67)*0.42,-1.0,1.0);
}
float solarCollisionField(vec3 p,float t){
  float a=sin(dot(p,vec3(3.7,2.1,-1.9))+t*0.53);
  float b=sin(dot(p,vec3(-2.9,3.4,2.6))-t*0.47);
  float compression=smoothstep(0.18,0.94,-a*b);
  float shear=0.5+0.5*sin((p.x*p.z-p.y*p.x)*15.0+t*0.71);
  return compression*(0.54+shear*0.46);
}
float solarRingField(vec3 p,float t){
  vec3 centerA=normalize(vec3(0.48+sin(t*0.19)*0.16,-0.16+cos(t*0.23)*0.18,0.86+sin(t*0.11)*0.08));
  vec3 centerB=normalize(vec3(-0.57+cos(t*0.17)*0.14,0.46+sin(t*0.29)*0.16,0.68+cos(t*0.13)*0.09));
  float distanceA=acos(clamp(dot(p,centerA),-1.0,1.0));
  float distanceB=acos(clamp(dot(p,centerB),-1.0,1.0));
  float radiusA=0.28+sin(t*0.37)*0.075;
  float radiusB=0.22+cos(t*0.31)*0.060;
  float ringA=exp(-pow((distanceA-radiusA)/0.060,2.0));
  float ringB=exp(-pow((distanceB-radiusB)/0.052,2.0));
  float lifeA=smoothstep(0.30,0.72,0.5+0.5*sin(t*0.43+0.8));
  float lifeB=smoothstep(0.36,0.78,0.5+0.5*sin(t*0.37+3.1));
  float partialA=smoothstep(0.08,0.82,0.5+0.5*sin(dot(p,vec3(7.0,-9.0,11.0))+t*0.61));
  float partialB=smoothstep(0.12,0.84,0.5+0.5*sin(dot(p,vec3(-10.0,8.0,6.0))-t*0.57));
  return clamp(ringA*lifeA*partialA+ringB*lifeB*partialB,0.0,1.0);
}
vec3 solarMaterial(vec3 base,vec3 n){
  vec3 p=normalize(v_p);
  vec3 advected=solarAdvect(p,u_time);
  float large=solarLargeField(advected,u_time);
  float medium=solarMediumField(advected,u_time);
  float fine=solarFineField(advected,u_time);
  float collision=solarCollisionField(advected,u_time);
  float rings=solarRingField(advected,u_time);
  float channelSource=abs(medium*0.78+large*0.22);
  float branchingChannel=1.0-smoothstep(0.055,0.29,channelSource);
  float vortex=0.5+0.5*sin((advected.x*advected.y-advected.z*advected.x)*18.0+large*2.8+u_time*0.71);
  float heat=clamp(0.50+large*0.20+medium*0.14+fine*0.060+collision*0.18+rings*0.13+vortex*0.050-branchingChannel*0.18,0.0,1.0);
  vec3 color=mix(vec3(0.38,0.070,0.006),vec3(0.72,0.145,0.008),smoothstep(0.02,0.30,heat));
  color=mix(color,vec3(1.0,0.335,0.015),smoothstep(0.25,0.56,heat));
  color=mix(color,vec3(1.0,0.690,0.075),smoothstep(0.52,0.79,heat));
  color=mix(color,vec3(1.0,0.970,0.67),smoothstep(0.77,0.98,heat));
  float facing=max(dot(n,normalize(vec3(0.22,0.18,1.0))),0.0);
  color*=0.90+facing*0.12+u_signature*0.08;
  color+=vec3(1.0,0.28,0.010)*collision*0.055+vec3(1.0,0.62,0.050)*rings*0.050;
  return min(color,vec3(1.0));
}
vec3 lunarMaterial(vec3 base,vec3 n){
  float facing=max(dot(n,normalize(vec3(-0.62,0.22,0.75))),0.0);
  float rim=pow(1.0-abs(dot(n,vec3(0.0,0.0,1.0))),2.0);
  return clamp(base*(0.82+facing*0.18)+vec3(0.025,0.030,0.042)*rim,0.0,1.0);
}
vec3 glassMaterial(vec3 base,vec3 n,float amount){
  float shimmer=0.5+0.5*sin(u_time*0.72+v_fx.z);
  float rim=pow(1.0-abs(dot(n,vec3(0.0,0.0,1.0))),2.0);
  float glow=(v_fx.y*(0.55+0.45*shimmer)+v_fx.w*0.10+v_highlight*(0.35+0.25*shimmer))*amount;
  if(v_style>2.5)return base*(0.62+0.28*max(n.z,0.0))+vec3(0.10,0.13,0.20)*rim*0.20;
  if(v_style>1.5)return base*(0.70+0.22*max(n.z,0.0))+vec3(0.12,0.15,0.22)*rim*0.12;
  return clamp(base*(0.82+glow*0.30)+base*rim*(0.16+glow*0.20)+vec3(0.08,0.10,0.16)*glow,0.0,1.0);
}
void main(){
  vec3 n=normalize(v_n),base=max(v_c,vec3(0.008));
  if(u_haloPass>.5){
    vec3 p=normalize(v_p),advected=solarAdvect(p,u_time);
    float activity=clamp(0.44+solarLargeField(advected,u_time)*0.22+solarMediumField(advected,u_time)*0.17+
      max(solarFineField(advected,u_time),0.0)*0.08+solarCollisionField(advected,u_time)*0.36+solarRingField(advected,u_time)*0.32,0.0,1.0);
    float rim=pow(1.0-abs(dot(n,vec3(0.0,0.0,1.0))),2.0);
    float alpha=clamp((0.008+rim*(0.018+activity*0.10))*u_solarMix,0.0,0.18);
    vec3 halo=mix(vec3(0.78,0.11,0.008),vec3(1.0,0.74,0.18),activity)*(0.45+activity*0.72);
    gl_FragColor=vec4(halo,alpha);return;
  }
  vec3 color;
  float alpha=1.0;
  if(u_transitionMode<0.5){
    color=mix(lunarMaterial(base,n),solarMaterial(base,n),sat(u_solarMix));
  }else if(u_transitionMode<1.5){
    float w=sat(v_morph);
    color=mix(lunarMaterial(base,n),glassMaterial(base,n,w),w);
    if(v_style<1.5)alpha=mix(1.0,clamp(v_fx.x+0.18,0.0,1.0),w);
  }else{
    float w=sat(v_morph);
    color=mix(glassMaterial(base,n,1.0-w),solarMaterial(base,n),w);
    if(v_style<1.5)alpha=mix(clamp(v_fx.x+0.18,0.0,1.0),1.0,w);
  }
  gl_FragColor=vec4(color,alpha);
}`;

function shader(gl,type,src){
  const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);
  if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error('WORLD_SHADER:'+gl.getShaderInfoLog(s));
  return s;
}
function program(gl){
  const p=gl.createProgram(),vs=shader(gl,gl.VERTEX_SHADER,VS),fs=shader(gl,gl.FRAGMENT_SHADER,FS);
  gl.attachShader(p,vs);gl.attachShader(p,fs);gl.linkProgram(p);gl.deleteShader(vs);gl.deleteShader(fs);
  if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error('WORLD_LINK:'+gl.getProgramInfoLog(p));
  return p;
}
function perspective(fov,aspect,near,far){
  const f=1/Math.tan(fov/2),nf=1/(near-far);
  return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*nf,-1,0,0,2*far*near*nf,0]);
}
function lookAt(eye,target,up=[0,1,0]){
  const zx=eye[0]-target[0],zy=eye[1]-target[1],zz=eye[2]-target[2],zl=Math.hypot(zx,zy,zz)||1,z=[zx/zl,zy/zl,zz/zl];
  let xx=up[1]*z[2]-up[2]*z[1],xy=up[2]*z[0]-up[0]*z[2],xz=up[0]*z[1]-up[1]*z[0],xl=Math.hypot(xx,xy,xz)||1;
  const x=[xx/xl,xy/xl,xz/xl],y=[z[1]*x[2]-z[2]*x[1],z[2]*x[0]-z[0]*x[2],z[0]*x[1]-z[1]*x[0]];
  return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,
    -(x[0]*eye[0]+x[1]*eye[1]+x[2]*eye[2]),-(y[0]*eye[0]+y[1]*eye[1]+y[2]*eye[2]),-(z[0]*eye[0]+z[1]*eye[1]+z[2]*eye[2]),1]);
}
function model(tx,ty,tz,sx,sy,sz,ry=0){
  const c=Math.cos(ry),s=Math.sin(ry);
  return new Float32Array([c*sx,0,-s*sx,0,0,sy,0,0,s*sz,0,c*sz,0,tx,ty,tz,1]);
}
function zeros(count,size){return new Float32Array(count*size)}
function repeatStyle(count,style=0){
  const out=new Float32Array(count*2);
  for(let i=0;i<count;i++){out[i*2]=.16;out[i*2+1]=style}
  return out;
}
function staticGeometry(mesh){
  return {p:mesh.p,n:mesh.n,c:mesh.c,tp:mesh.p,tn:mesh.n,tc:mesh.c,fx:zeros(mesh.vertexCount,4),fx2:repeatStyle(mesh.vertexCount,0),vertexCount:mesh.vertexCount};
}
function morphGeometry(from,to){
  if(from.vertexCount!==to.vertexCount)throw new Error('WORLD_MORPH_TOPOLOGY_MISMATCH');
  return {p:from.p,n:from.n,c:from.c,tp:to.p,tn:to.n,tc:to.c,fx:zeros(from.vertexCount,4),fx2:repeatStyle(from.vertexCount,0),vertexCount:from.vertexCount};
}
function windowMorphGeometry(windowGeometry,authority,scale,reverse=false){
  const count=windowGeometry.vertexCount,p=new Float32Array(count*3),n=new Float32Array(count*3),c=new Float32Array(count*3);
  for(let i=0;i<count;i++){
    const d=windowGeometry.sourceDirections.subarray(i*3,i*3+3),sample=authority.sampleDirection(d[0],d[1],d[2]);
    p[i*3]=sample.position[0]*scale;p[i*3+1]=sample.position[1]*scale;p[i*3+2]=sample.position[2]*scale;
    n[i*3]=sample.radialNormal[0];n[i*3+1]=sample.radialNormal[1];n[i*3+2]=sample.radialNormal[2];
    c[i*3]=sample.color[0];c[i*3+1]=sample.color[1];c[i*3+2]=sample.color[2];
  }
  const packedFx2=new Float32Array(count*2);
  for(let i=0;i<count;i++){packedFx2[i*2]=windowGeometry.effects2[i*2];packedFx2[i*2+1]=windowGeometry.styles[i]}
  if(reverse)return {
    p:windowGeometry.positions,n:windowGeometry.normals,c:windowGeometry.colors,
    tp:p,tn:n,tc:c,fx:windowGeometry.effects,fx2:packedFx2,vertexCount:count
  };
  return {
    p,n,c,tp:windowGeometry.positions,tn:windowGeometry.normals,tc:windowGeometry.colors,
    fx:windowGeometry.effects,fx2:packedFx2,vertexCount:count
  };
}
function upload(gl,g){
  const o={count:g.vertexCount,buffers:[]};
  for(const [k,d] of [['p',g.p],['n',g.n],['c',g.c],['tp',g.tp],['tn',g.tn],['tc',g.tc],['fx',g.fx],['fx2',g.fx2]]){
    const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,d,gl.STATIC_DRAW);o[k]=b;o.buffers.push(b);
  }
  return o;
}
function bind(gl,p,o){
  const attrs=[['a_position','p',3],['a_normal','n',3],['a_color','c',3],['a_targetPosition','tp',3],['a_targetNormal','tn',3],['a_targetColor','tc',3],['a_fx','fx',4],['a_fx2','fx2',2]];
  for(const [name,key,size] of attrs){
    const loc=gl.getAttribLocation(p,name);
    if(loc<0)continue;
    gl.bindBuffer(gl.ARRAY_BUFFER,o[key]);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,size,gl.FLOAT,false,0,0);
  }
}
function phaseAt(u){
  for(const ph of CONTRACT.timeline.phases)if(u>=ph.a&&u<ph.b)return ph;
  return CONTRACT.timeline.phases[0];
}
function transitionAmount(u,ph,reduced){
  if(!ph.id.includes('_TO_'))return 0;
  const raw=(u-ph.a)/(ph.b-ph.a);
  if(!reduced)return smooth(raw);
  const phaseMs=(ph.b-ph.a)*CONTRACT.timeline.durationMs;
  return smooth(clamp(raw*phaseMs/CONTRACT.timeline.reducedTransitionMs));
}

export function mountWorldLivingObject(root,options={}){
  if(!root||typeof root.replaceChildren!=='function')throw new TypeError('WORLD_ROOT_REQUIRED');
  const doc=root.ownerDocument||document,canvas=doc.createElement('canvas');
  canvas.className='awards-true3d-canvas awards-world-true3d';
  canvas.style.cssText='display:block;width:100%;height:100%;min-height:220px;pointer-events:none';
  canvas.setAttribute('aria-hidden','true');root.replaceChildren(canvas);
  const gl=canvas.getContext('webgl2',{alpha:true,antialias:true,premultipliedAlpha:false})||canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:false});
  if(!gl)throw new Error('WORLD_WEBGL_REQUIRED');
  const maxAttribs=gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
  if(maxAttribs<8)throw new Error('WORLD_REQUIRES_EIGHT_VERTEX_ATTRIBUTES');

  const solarAuthority=createCelestialAuthority('solar',.66),lunarAuthority=createCelestialAuthority('lunar',.66);
  const solarNative=solarAuthority.mesh(48,32),solarBridge=solarAuthority.mesh(64,44),lunarNative=lunarAuthority.mesh(64,44);
  const windowGeometry=buildMirrorland3DGeometry({sceneScale:.43});
  const celestialScale=1.25;
  const cpu=Object.freeze({
    solar:staticGeometry(solarNative),
    lunar:staticGeometry(lunarNative),
    solarToMoon:morphGeometry(solarBridge,lunarNative),
    moonToWindow:windowMorphGeometry(windowGeometry,lunarAuthority,celestialScale,false),
    windowToSun:windowMorphGeometry(windowGeometry,solarAuthority,celestialScale,true)
  });

  const prog=program(gl),gpu=Object.freeze({
    solar:upload(gl,cpu.solar),lunar:upload(gl,cpu.lunar),solarToMoon:upload(gl,cpu.solarToMoon),
    moonToWindow:upload(gl,cpu.moonToWindow),windowToSun:upload(gl,cpu.windowToSun)
  });
  const resources=Object.values(gpu);
  gl.useProgram(prog);gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.disable(gl.CULL_FACE);

  const U=Object.freeze({
    model:gl.getUniformLocation(prog,'u_model'),view:gl.getUniformLocation(prog,'u_view'),proj:gl.getUniformLocation(prog,'u_proj'),
    morph:gl.getUniformLocation(prog,'u_morph'),haloPass:gl.getUniformLocation(prog,'u_haloPass'),haloExpansion:gl.getUniformLocation(prog,'u_haloExpansion'),
    time:gl.getUniformLocation(prog,'u_time'),transitionMode:gl.getUniformLocation(prog,'u_transitionMode'),solarMix:gl.getUniformLocation(prog,'u_solarMix'),
    signature:gl.getUniformLocation(prog,'u_signature')
  });
  const reduced=options.reducedMotion??globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches??false;
  let state='FOREGROUND_REST',phase='SUN_LOCK',destroyed=false,raf=0,last=performance.now(),cycleMs=0,signatureUntil=0;
  const activeStates=new Set(['APPROACHING','FOREGROUND_REST','SIGNATURE_PLAY','FOREGROUND_IDLE','SELECT_RESPONSE','RETURN_RESTORING']);

  function resize(){
    const d=Math.min(2,globalThis.devicePixelRatio||1),w=Math.max(1,Math.round(canvas.clientWidth*d)),h=Math.max(1,Math.round(canvas.clientHeight*d));
    if(w!==canvas.width||h!==canvas.height){canvas.width=w;canvas.height=h}
    gl.viewport(0,0,w,h);return w/h;
  }
  function renderObject(obj,m,morph,transitionMode,solarMix,haloPass=0,haloExpansion=0){
    bind(gl,prog,obj);gl.uniformMatrix4fv(U.model,false,m);gl.uniform1f(U.morph,morph);gl.uniform1f(U.transitionMode,transitionMode);
    gl.uniform1f(U.solarMix,solarMix);gl.uniform1f(U.haloPass,haloPass);gl.uniform1f(U.haloExpansion,haloExpansion);
    gl.drawArrays(gl.TRIANGLES,0,obj.count);
  }
  function draw(t){
    if(destroyed)return;
    const dt=Math.min(50,Math.max(0,t-last));last=t;
    if(activeStates.has(state))cycleMs=(cycleMs+dt)%CONTRACT.timeline.durationMs;
    const u=(cycleMs%CONTRACT.timeline.durationMs)/CONTRACT.timeline.durationMs,ph=phaseAt(u),x=transitionAmount(u,ph,reduced);
    phase=ph.id;
    const aspect=resize(),time=t/1000,signature=t<signatureUntil?1:0,rot=reduced?0:time*.055;
    gl.clearColor(.004,.007,.018,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.uniformMatrix4fv(U.view,false,lookAt([0,.03,3.75],[0,0,0]));gl.uniformMatrix4fv(U.proj,false,perspective(42*Math.PI/180,aspect,.08,30));
    gl.uniform1f(U.time,time);gl.uniform1f(U.signature,signature);

    if(ph.id==='SUN_LOCK'){
      const m=model(0,0,0,celestialScale,celestialScale,celestialScale,rot);
      renderObject(gpu.solar,m,0,0,1,0,0);
      renderObject(gpu.solar,m,0,0,1,1,.050+.012*signature);
    }else if(ph.id==='SUN_TO_MOON'){
      const m=model(0,0,0,celestialScale,celestialScale,celestialScale,rot*(1-x));
      renderObject(gpu.solarToMoon,m,x,0,1-x,0,0);
      if(x<.985)renderObject(gpu.solarToMoon,m,x,0,1-x,1,.050*(1-x));
    }else if(ph.id==='MOON_LOCK'){
      renderObject(gpu.lunar,model(0,0,0,celestialScale,celestialScale,celestialScale,-rot*.24),0,0,0,0,0);
    }else if(ph.id==='MOON_TO_MIRRORLAND'){
      const remnant=1-smooth(clamp((x-.04)/.78)),flat=lerp(1,.08,x),stretch=lerp(1,1.10,x);
      if(remnant>.012){
        const rs=celestialScale*remnant;
        renderObject(gpu.lunar,model(0,0,-.015,rs*lerp(1,.82,x),rs*stretch,rs*flat,-rot*.12),0,0,0,0,0);
      }
      if(x>.008)renderObject(gpu.moonToWindow,model(0,0,0,1,1,1,0),x,1,0,0,0);
    }else if(ph.id==='MIRRORLAND_LOCK'){
      renderObject(gpu.moonToWindow,model(0,0,0,1,1,1,reduced?0:Math.sin(time*.16)*.025),1,1,0,0,0);
    }else if(ph.id==='MIRRORLAND_TO_SUN'){
      renderObject(gpu.windowToSun,model(0,0,0,1,1,1,0),x,2,x,0,0);
      const core=smooth(clamp((x-.18)/.82));
      if(core>.006){
        const s=celestialScale*core,m=model(0,0,.006,s,s,s,rot*x);
        renderObject(gpu.solar,m,0,0,x,0,0);
        if(x>.35)renderObject(gpu.solar,m,0,0,x,1,.050*core);
      }
    }
    raf=requestAnimationFrame(draw);
  }
  raf=requestAnimationFrame(draw);

  function setLifecycle(x){
    if(!CONTRACT.lifecycle.includes(x))throw new Error('WORLD_INVALID_STATE');
    state=x;return x;
  }
  function playSignature(){setLifecycle('SIGNATURE_PLAY');signatureUntil=performance.now()+(reduced?120:1650);return signatureUntil}
  function selectResponse(){setLifecycle('SELECT_RESPONSE')}
  function readerOpen(){setLifecycle('READER_OPEN')}
  function restore(){
    setLifecycle('RETURN_RESTORING');const delay=reduced?0:250;
    setTimeout(()=>{if(!destroyed)setLifecycle('FOREGROUND_REST')},delay);
  }
  function inspect(){
    return Object.freeze({
      contract:CONTRACT.id,state,phase,reducedMotion:!!reduced,webglContexts:1,renderLoopOwners:1,canvasCount:1,
      renderer:CONTRACT.renderer,recognizableObject:CONTRACT.recognizableObject,signatureEvent:CONTRACT.signatureEvent,eventCount:1,
      implementationClass:CONTRACT.implementationClass,timeline:CONTRACT.timeline,narrative:CONTRACT.narrative,sourceBinding:CONTRACT.sourceBinding,
      lawsSolarMesh:'R0.66_S48_R32_EXACT_ALGORITHM',lawsLunarMesh:'R0.66_S64_R44_EXACT_ALGORITHM',
      sharedSphereTopology:false,mirrorlandPaneCount:windowGeometry.paneCount,mirrorlandTrue3D:windowGeometry.volumetric,
      mirrorlandProjectionPreserved:windowGeometry.projectionPreserved,compassStarsExcluded:!windowGeometry.compassStarsIncluded,
      continuousWorldOccupancy:true,transitionMechanism:'GEOMETRY_MATERIAL_LIFECYCLE_TRANSFORMATION_NOT_OPACITY_ONLY',
      persistentGpuAllocation:'MOUNT_ONLY',carouselTraversalAuthority:'EXTERNAL_PRESERVED',deterministicTeardown:true,
      maxVertexAttributes:maxAttribs,mirrorlandAuthority:MIRRORLAND_3D_AUTHORITY
    });
  }
  function destroy(){
    destroyed=true;cancelAnimationFrame(raf);
    for(const resource of resources)for(const b of resource.buffers)gl.deleteBuffer(b);
    gl.deleteProgram(prog);gl.getExtension('WEBGL_lose_context')?.loseContext();root.replaceChildren();
  }
  return Object.freeze({contract:CONTRACT,setState:setLifecycle,playSignature,selectResponse,readerOpen,restore,inspect,destroy,element:canvas});
}
export{CONTRACT as AWARDS_WORLD_CYCLE_B_CONTRACT};
