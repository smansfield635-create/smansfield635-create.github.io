// Characters-owned night renderer; lunar surface language is adapted from the Laws moon without runtime coupling.
export const GRATITUDE_COAST_NIGHT=Object.freeze({
  sky:Object.freeze({clear:[0.004,0.010,0.027,1],horizon:[0.055,0.092,0.155]}),
  moon:Object.freeze({direction:[-0.34,0.84,0.42],color:[0.79,0.86,1.0],discColor:[0.92,0.95,1.0]}),
  terrain:Object.freeze({ambient:[0.045,0.066,0.084],rockLow:[0.035,0.070,0.061],rockHigh:[0.18,0.205,0.19],sand:[0.34,0.31,0.235],marsh:[0.055,0.115,0.085],cliff:[0.12,0.135,0.14]}),
  water:Object.freeze({deep:[0.006,0.032,0.075],lift:[0.025,0.12,0.205],fresnel:[0.30,0.39,0.58],moon:[0.72,0.82,1.0]}),
  star:Object.freeze({available:'#f4e6bb',related:'#d9e8ff',visited:'#b9d7d0',active:'#fff4cf'})
});

export const NIGHT_FRAGMENT_SHADER=`#version 300 es
precision highp float;
in vec3 vPos;
in vec3 vNormal;
in float vH;
uniform vec3 uEye;
uniform float uTime;
uniform int uWater;
uniform float uLunarIntensity;
uniform float uHorizonHaze;
uniform float uWaterMoonResponse;
uniform float uMoonPathX;
out vec4 outColor;

float hash21(vec2 p){
  p=fract(p*vec2(123.34,345.45));
  p+=dot(p,p+34.345);
  return fract(p.x*p.y);
}
float noise2(vec2 p){
  vec2 i=floor(p),f=fract(p);
  f=f*f*(3.0-2.0*f);
  return mix(mix(hash21(i),hash21(i+vec2(1,0)),f.x),mix(hash21(i+vec2(0,1)),hash21(i+vec2(1,1)),f.x),f.y);
}
float fbm(vec2 p){
  float s=0.0,a=.5;
  mat2 r=mat2(.82,-.57,.57,.82);
  for(int i=0;i<4;i++){s+=a*noise2(p);p=r*p*2.03+7.17;a*=.5;}
  return s;
}

void main(){
  vec3 moonDir=normalize(vec3(-0.34,0.84,0.42));
  vec3 moonColor=vec3(0.79,0.86,1.0)*uLunarIntensity;
  float radial=length(vPos.xz);
  float distanceHaze=clamp((radial-250.0)/2350.0,0.0,1.0);

  if(uWater==1){
    float t=uTime;
    float w1=sin(vPos.x*.025+vPos.z*.012+t*.56);
    float w2=sin(vPos.x*.051-vPos.z*.033-t*.72);
    float w3=sin((vPos.x+vPos.z)*.087+t*1.14);
    float dhdx=.025*cos(vPos.x*.025+vPos.z*.012+t*.56)+.051*.48*cos(vPos.x*.051-vPos.z*.033-t*.72)+.087*.19*cos((vPos.x+vPos.z)*.087+t*1.14);
    float dhdz=.012*cos(vPos.x*.025+vPos.z*.012+t*.56)-.033*.48*cos(vPos.x*.051-vPos.z*.033-t*.72)+.087*.19*cos((vPos.x+vPos.z)*.087+t*1.14);
    vec3 waterN=normalize(vec3(-dhdx*4.5,1.0,-dhdz*4.5));
    vec3 viewDir=normalize(uEye-vPos);
    float fres=pow(1.0-max(dot(waterN,viewDir),0.0),3.5);
    float moonSpec=pow(max(dot(reflect(-moonDir,waterN),viewDir),0.0),80.0);
    float band=exp(-pow((vPos.x-uMoonPathX)/245.0,2.0));
    float broken=.12+.88*pow(.5+.5*sin(vPos.z*.071-vPos.x*.019+t*1.08),7.0);
    float crossRipple=.56+.44*sin(vPos.x*.055+vPos.z*.024-t*.52);
    float shimmer=band*broken*crossRipple*uWaterMoonResponse;
    float depthVariation=.5+.5*(.55*w1+.30*w2+.15*w3);
    vec3 deep=vec3(.006,.032,.075);
    vec3 lift=vec3(.025,.12,.205);
    vec3 water=mix(deep,lift,clamp(depthVariation*.30+.08,0.0,.42));
    water+=vec3(.30,.39,.58)*fres*.66;
    water+=moonColor*(shimmer*.92+moonSpec*1.28);
    float horizonSheen=pow(1.0-max(waterN.y,0.0),2.0);
    water+=vec3(.045,.075,.13)*horizonSheen;
    water=mix(water,vec3(.055,.092,.155),distanceHaze*uHorizonHaze*.58);
    outColor=vec4(water,1.0);
    return;
  }

  vec3 n=normalize(vNormal);
  float lunar=max(dot(n,moonDir),0.0);
  float slope=1.0-clamp(n.y,0.0,1.0);
  vec3 viewDir=normalize(uEye-vPos);
  float rim=pow(1.0-max(dot(n,viewDir),0.0),2.2);
  float micro=fbm(vPos.xz*.014);
  float broad=fbm(vPos.xz*.0035+17.0);
  float elevation=clamp((vH+8.0)/145.0,0.0,1.0);

  float beachBand=smoothstep(-3.0,7.0,vH)*(1.0-smoothstep(16.0,31.0,vH));
  float marshBand=smoothstep(2.0,12.0,vH)*(1.0-smoothstep(28.0,48.0,vH))*(1.0-smoothstep(.18,.48,slope));
  float cliffBand=smoothstep(.18,.68,slope)*smoothstep(20.0,72.0,vH);
  float upland=smoothstep(48.0,125.0,vH);

  vec3 lowRock=vec3(.035,.070,.061);
  vec3 midRock=vec3(.082,.115,.096);
  vec3 highRock=vec3(.18,.205,.19);
  vec3 rock=mix(lowRock,midRock,smoothstep(.18,.62,elevation));
  rock=mix(rock,highRock,upland);
  rock*=mix(.72,1.18,micro*.65+broad*.35);

  vec3 sand=mix(vec3(.235,.205,.145),vec3(.39,.35,.255),micro*.68+broad*.32);
  vec3 marsh=mix(vec3(.035,.090,.063),vec3(.085,.145,.095),broad);
  vec3 cliff=mix(vec3(.065,.075,.078),vec3(.145,.155,.158),micro);

  vec3 base=rock;
  base=mix(base,sand,beachBand*.82);
  base=mix(base,marsh,marshBand*.58);
  base=mix(base,cliff,cliffBand*.78);

  float ambientOcclusion=mix(.72,1.0,smoothstep(.08,.62,n.y));
  vec3 ambient=vec3(.19,.235,.29)*ambientOcclusion;
  vec3 lit=base*(ambient+moonColor*(.18+.92*lunar));
  lit+=moonColor*rim*.055;
  lit+=moonColor*pow(lunar,8.0)*cliffBand*.08;

  float lowMist=exp(-max(vH,0.0)/34.0)*(1.0-smoothstep(0.0,700.0,length(vPos.xz-uEye.xz)));
  vec3 mistColor=vec3(.075,.105,.13);
  lit=mix(lit,mistColor,lowMist*.07);
  lit=mix(lit,vec3(.055,.092,.155),distanceHaze*uHorizonHaze*.76);
  outColor=vec4(lit,1.0);
}`;

export function nightUniforms(worldState){
  const environment=worldState?.environment||{};
  return Object.freeze({
    lunarIntensity:environment.lunarIntensity??0.74,
    horizonHaze:environment.horizonHaze??0.31,
    waterMoonResponse:environment.waterMoonResponse??0.94
  });
}

export function discoveryStarStyle(signalState){
  const key=signalState==='REVEALED_RELATED'?'related':String(signalState||'AVAILABLE').toLowerCase();
  const color=GRATITUDE_COAST_NIGHT.star[key]||GRATITUDE_COAST_NIGHT.star.available;
  const intensity=signalState==='ACTIVE'?1.45:signalState==='VISITED'?0.88:signalState==='REVEALED_RELATED'?1.05:0.76;
  return Object.freeze({color,intensity});
}
