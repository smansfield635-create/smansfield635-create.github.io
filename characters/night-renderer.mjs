export const GRATITUDE_COAST_NIGHT=Object.freeze({
  sky:Object.freeze({clear:[0.008,0.016,0.04,1],horizon:[0.055,0.085,0.13]}),
  moon:Object.freeze({direction:[-0.34,0.84,0.42],color:[0.72,0.79,0.9],discColor:[0.88,0.91,0.96]}),
  terrain:Object.freeze({ambient:[0.035,0.052,0.07],rockLow:[0.035,0.07,0.065],rockHigh:[0.11,0.14,0.13],sand:[0.24,0.23,0.19]}),
  water:Object.freeze({deep:[0.008,0.035,0.07],lift:[0.025,0.105,0.16],fresnel:[0.18,0.24,0.34]}),
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
out vec4 outColor;

void main(){
  vec3 moonDir=normalize(vec3(-0.34,0.84,0.42));
  vec3 moonColor=vec3(0.72,0.79,0.90)*uLunarIntensity;
  float distanceHaze=clamp(length(vPos.xz)/2300.0,0.0,1.0);

  if(uWater==1){
    float wave=.5+.34*sin(vPos.x*.035+uTime*.72)+.16*sin(vPos.z*.051-uTime*.48);
    vec3 viewDir=normalize(uEye-vPos);
    float fres=pow(1.0-max(dot(normalize(vNormal),viewDir),0.0),3.0);
    float moonPath=pow(max(dot(normalize(vec3(viewDir.x,0.15,viewDir.z)),normalize(vec3(-moonDir.x,0.15,-moonDir.z))),0.0),22.0);
    float shimmer=(.55+.45*sin(vPos.x*.082+vPos.z*.021+uTime*1.15))*moonPath*uWaterMoonResponse;
    vec3 water=mix(vec3(.008,.035,.07),vec3(.025,.105,.16),wave*.28);
    water+=vec3(.18,.24,.34)*fres*.42;
    water+=moonColor*shimmer*.62;
    water=mix(water,vec3(.055,.085,.13),distanceHaze*uHorizonHaze*.55);
    outColor=vec4(water,1.0);
    return;
  }

  vec3 n=normalize(vNormal);
  float lunar=max(dot(n,moonDir),0.0);
  float sand=smoothstep(-1.0,13.0,vH)*(1.0-smoothstep(18.0,42.0,vH));
  vec3 rock=mix(vec3(.035,.07,.065),vec3(.11,.14,.13),smoothstep(25.0,120.0,vH));
  vec3 base=mix(rock,vec3(.24,.23,.19),sand);
  vec3 lit=base*(vec3(.18,.22,.27)+moonColor*(.24+.76*lunar));
  lit=mix(lit,vec3(.055,.085,.13),distanceHaze*uHorizonHaze);
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
