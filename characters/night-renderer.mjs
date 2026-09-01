export const GRATITUDE_COAST_NIGHT=Object.freeze({
  sky:Object.freeze({clear:[0.008,0.016,0.04,1],horizon:[0.07,0.105,0.17]}),
  moon:Object.freeze({direction:[-0.34,0.84,0.42],color:[0.78,0.84,0.98],discColor:[0.92,0.94,1.0]}),
  terrain:Object.freeze({ambient:[0.06,0.085,0.11],rockLow:[0.045,0.085,0.08],rockHigh:[0.15,0.18,0.17],sand:[0.30,0.285,0.23]}),
  water:Object.freeze({deep:[0.012,0.05,0.10],lift:[0.035,0.14,0.23],fresnel:[0.24,0.32,0.48]}),
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

void main(){
  vec3 moonDir=normalize(vec3(-0.34,0.84,0.42));
  vec3 moonColor=vec3(0.78,0.84,0.98)*uLunarIntensity;
  float distanceHaze=clamp(length(vPos.xz)/2300.0,0.0,1.0);

  if(uWater==1){
    float wave=.5+.32*sin(vPos.x*.035+uTime*.72)+.18*sin(vPos.z*.051-uTime*.48);
    vec3 viewDir=normalize(uEye-vPos);
    float fres=pow(1.0-max(dot(normalize(vNormal),viewDir),0.0),3.0);
    float band=exp(-pow((vPos.x-uMoonPathX)/285.0,2.0));
    float broken=.25+.75*pow(.5+.5*sin(vPos.z*.071-vPos.x*.019+uTime*1.08),5.0);
    float crossRipple=.62+.38*sin(vPos.x*.055+vPos.z*.024-uTime*.52);
    float shimmer=band*broken*crossRipple*uWaterMoonResponse;
    vec3 water=mix(vec3(.012,.05,.10),vec3(.035,.14,.23),wave*.32);
    water+=vec3(.24,.32,.48)*fres*.52;
    water+=moonColor*shimmer*.95;
    water=mix(water,vec3(.07,.105,.17),distanceHaze*uHorizonHaze*.64);
    outColor=vec4(water,1.0);
    return;
  }

  vec3 n=normalize(vNormal);
  float lunar=max(dot(n,moonDir),0.0);
  float rim=pow(1.0-max(dot(n,normalize(uEye-vPos)),0.0),2.0);
  float sand=smoothstep(-1.0,13.0,vH)*(1.0-smoothstep(18.0,42.0,vH));
  vec3 rock=mix(vec3(.045,.085,.08),vec3(.15,.18,.17),smoothstep(25.0,120.0,vH));
  vec3 base=mix(rock,vec3(.30,.285,.23),sand);
  vec3 lit=base*(vec3(.29,.34,.42)+moonColor*(.26+.74*lunar));
  lit+=moonColor*rim*.035;
  lit=mix(lit,vec3(.07,.105,.17),distanceHaze*uHorizonHaze*.82);
  outColor=vec4(lit,1.0);
}`;

export function nightUniforms(worldState){
  const environment=worldState?.environment||{};
  return Object.freeze({
    lunarIntensity:environment.lunarIntensity??0.68,
    horizonHaze:environment.horizonHaze??0.36,
    waterMoonResponse:environment.waterMoonResponse??0.82
  });
}

export function discoveryStarStyle(signalState){
  const key=signalState==='REVEALED_RELATED'?'related':String(signalState||'AVAILABLE').toLowerCase();
  const color=GRATITUDE_COAST_NIGHT.star[key]||GRATITUDE_COAST_NIGHT.star.available;
  const intensity=signalState==='ACTIVE'?1.45:signalState==='VISITED'?0.88:signalState==='REVEALED_RELATED'?1.05:0.76;
  return Object.freeze({color,intensity});
}
