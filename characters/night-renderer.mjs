// Characters-owned night renderer; lunar surface language is adapted from the Laws moon without runtime coupling.
// Environment V2 remains presentation-only: canonical terrain, shoreline and landmark positions are consumed unchanged.
export const GRATITUDE_COAST_NIGHT=Object.freeze({
  rendererId:'CHARACTERS_GRATITUDE_ENVIRONMENT_RENDERER_V2',
  sky:Object.freeze({clear:[0.004,0.010,0.027,1],horizon:[0.055,0.092,0.155]}),
  moon:Object.freeze({direction:[-0.34,0.84,0.42],color:[0.79,0.86,1.0],discColor:[0.92,0.95,1.0]}),
  terrain:Object.freeze({ambient:[0.045,0.066,0.084],rockLow:[0.035,0.070,0.061],rockHigh:[0.18,0.205,0.19],sand:[0.34,0.31,0.235],marsh:[0.055,0.115,0.085],cliff:[0.12,0.135,0.14]}),
  water:Object.freeze({deep:[0.006,0.032,0.075],lift:[0.025,0.12,0.205],fresnel:[0.30,0.39,0.58],moon:[0.72,0.82,1.0]}),
  atmosphere:Object.freeze({basinMist:true,distanceDesaturation:true,horizonScattering:true}),
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
  for(int i=0;i<5;i++){s+=a*noise2(p);p=r*p*2.03+7.17;a*=.5;}
  return s;
}
float ridged(vec2 p){float n=fbm(p);return 1.0-abs(2.0*n-1.0);}
vec2 warp(vec2 p,float t){
  float a=fbm(p*.72+vec2(t*.017,-t*.011));
  float b=fbm(p*.79+vec2(31.7,-19.3)+vec2(-t*.009,t*.014));
  return p+vec2(a-.5,b-.5)*1.85;
}
float waterField(vec2 p,float t){
  vec2 q=warp(p*.0105,t);
  float swell=fbm(q*.82+vec2(t*.018,-t*.011));
  float chop=ridged(q*2.55+vec2(-t*.034,t*.021));
  float cap=ridged(q*5.6+vec2(t*.051,t*.017));
  return swell*.58+chop*.29+cap*.13;
}
vec3 waterNormal(vec2 xz,float t){
  float e=2.6;
  float hL=waterField(xz-vec2(e,0.0),t),hR=waterField(xz+vec2(e,0.0),t);
  float hB=waterField(xz-vec2(0.0,e),t),hF=waterField(xz+vec2(0.0,e),t);
  return normalize(vec3((hL-hR)*2.2,1.0,(hB-hF)*2.2));
}

void main(){
  vec3 moonDir=normalize(vec3(-0.34,0.84,0.42));
  vec3 moonColor=vec3(0.79,0.86,1.0)*uLunarIntensity;
  float eyeDistance=length(vPos-uEye);
  float radial=length(vPos.xz);
  float distanceHaze=clamp((eyeDistance-460.0)/2450.0,0.0,1.0);
  float continentalHaze=clamp((radial-420.0)/2550.0,0.0,1.0);

  if(uWater==1){
    float t=uTime;
    vec3 waterN=waterNormal(vPos.xz,t);
    vec3 viewDir=normalize(uEye-vPos);
    float facing=max(dot(waterN,viewDir),0.0);
    float fres=pow(1.0-facing,4.2);
    float moonSpec=pow(max(dot(reflect(-moonDir,waterN),viewDir),0.0),118.0);

    float moonBand=exp(-pow((vPos.x-uMoonPathX)/285.0,2.0));
    vec2 brokenUv=warp(vPos.xz*.0075,t*.55);
    float broken=clamp((fbm(brokenUv*2.2+vec2(t*.024,0.0))-.39)*2.5,0.0,1.0);
    float glitter=pow(clamp(ridged(brokenUv*6.8+vec2(-t*.042,t*.019)),0.0,1.0),5.0);
    float shimmer=moonBand*(broken*.72+glitter*.44)*uWaterMoonResponse;

    float macro=fbm(warp(vPos.xz*.0047,t*.34));
    float micro=waterField(vPos.xz,t);
    vec3 deep=vec3(.004,.024,.061);
    vec3 lift=vec3(.022,.105,.185);
    vec3 water=mix(deep,lift,clamp(.05+macro*.18+micro*.08,0.0,.38));
    water+=vec3(.25,.34,.54)*fres*.58;
    water+=moonColor*(shimmer*.92+moonSpec*1.34);

    float grazing=pow(1.0-facing,2.3);
    water+=vec3(.037,.064,.115)*grazing;
    vec3 marineHaze=mix(vec3(.042,.073,.128),vec3(.055,.092,.155),continentalHaze);
    water=mix(water,marineHaze,clamp(distanceHaze*uHorizonHaze*.72,0.0,.60));
    water=mix(water,vec3(.040,.067,.108),continentalHaze*uHorizonHaze*.16);
    outColor=vec4(water,1.0);
    return;
  }

  vec3 n=normalize(vNormal);
  float lunar=max(dot(n,moonDir),0.0);
  float slope=1.0-clamp(n.y,0.0,1.0);
  vec3 viewDir=normalize(uEye-vPos);
  float rim=pow(1.0-max(dot(n,viewDir),0.0),2.4);

  vec2 macroUv=warp(vPos.xz*.0031,0.0);
  float macro=fbm(macroUv);
  float medium=fbm(warp(vPos.xz*.0105+13.7,0.0));
  float fine=fbm(vPos.xz*.043+37.0);
  float ridge=ridged(vPos.xz*.016+vec2(5.3,19.7));
  float elevation=clamp((vH+8.0)/145.0,0.0,1.0);

  float shoreLow=1.0-smoothstep(20.0,39.0,vH);
  float beachBand=smoothstep(-4.0,4.0,vH)*(1.0-smoothstep(17.0,30.0,vH));
  float wetBand=smoothstep(-2.0,1.5,vH)*(1.0-smoothstep(6.5,13.5,vH));
  float marshBand=smoothstep(3.0,10.0,vH)*(1.0-smoothstep(28.0,48.0,vH))*(1.0-smoothstep(.16,.44,slope));
  float cliffBand=smoothstep(.17,.65,slope)*smoothstep(14.0,68.0,vH);
  float upland=smoothstep(45.0,118.0,vH);

  vec3 lowRock=vec3(.030,.060,.052);
  vec3 midRock=vec3(.076,.106,.088);
  vec3 highRock=vec3(.165,.188,.176);
  vec3 rock=mix(lowRock,midRock,smoothstep(.16,.61,elevation));
  rock=mix(rock,highRock,upland);
  rock*=mix(.69,1.22,medium*.46+macro*.34+fine*.20);
  rock=mix(rock,rock*vec3(.76,.81,.86),ridge*cliffBand*.30);

  vec3 drySand=mix(vec3(.205,.184,.132),vec3(.365,.322,.228),medium*.58+fine*.22+macro*.20);
  vec3 wetSand=mix(vec3(.073,.082,.073),vec3(.135,.130,.102),fine*.38+medium*.62);
  vec3 marsh=mix(vec3(.028,.074,.052),vec3(.076,.132,.086),macro*.55+medium*.45);
  vec3 cliff=mix(vec3(.055,.063,.066),vec3(.142,.150,.151),fine*.34+medium*.66);

  vec3 base=rock;
  base=mix(base,drySand,beachBand*.88);
  base=mix(base,wetSand,wetBand*.93);
  base=mix(base,marsh,marshBand*.62);
  base=mix(base,cliff,cliffBand*.84);

  float concavity=clamp((medium-macro)*1.9+.5,0.0,1.0);
  float ambientOcclusion=mix(.62,1.0,smoothstep(.06,.64,n.y));
  ambientOcclusion*=mix(.83,1.04,concavity);
  vec3 ambient=vec3(.17,.215,.265)*ambientOcclusion;
  vec3 lit=base*(ambient+moonColor*(.15+1.02*lunar));
  lit+=moonColor*rim*.050;
  lit+=moonColor*pow(lunar,10.0)*cliffBand*.095;
  lit+=moonColor*shoreLow*wetBand*pow(lunar,.75)*.026;

  float basin=exp(-max(vH,0.0)/30.0);
  float localMist=basin*(.58+.42*macro)*(1.0-smoothstep(180.0,980.0,eyeDistance));
  float valleyMist=basin*clamp((.54-medium)*2.2,0.0,1.0)*(1.0-cliffBand);
  vec3 mistColor=vec3(.066,.091,.112);
  lit=mix(lit,mistColor,clamp(localMist*.105+valleyMist*.075,0.0,.16));

  vec3 horizonColor=mix(vec3(.041,.073,.126),vec3(.055,.092,.155),continentalHaze);
  float hazeAmount=clamp(distanceHaze*uHorizonHaze*.88+continentalHaze*uHorizonHaze*.16,0.0,.68);
  lit=mix(lit,horizonColor,hazeAmount);
  float nightDesaturate=distanceHaze*.18;
  float luminance=dot(lit,vec3(.2126,.7152,.0722));
  lit=mix(lit,vec3(luminance)*vec3(.82,.94,1.08),nightDesaturate);

  outColor=vec4(lit,1.0);
}`;

export function nightUniforms(worldState){
  const environment=worldState?.environment||{};
  return Object.freeze({
    lunarIntensity:environment.lunarIntensity??0.78,
    horizonHaze:environment.horizonHaze??0.38,
    waterMoonResponse:environment.waterMoonResponse??0.98
  });
}

export function discoveryStarStyle(signalState){
  const key=signalState==='REVEALED_RELATED'?'related':String(signalState||'AVAILABLE').toLowerCase();
  const color=GRATITUDE_COAST_NIGHT.star[key]||GRATITUDE_COAST_NIGHT.star.available;
  const intensity=signalState==='ACTIVE'?1.45:signalState==='VISITED'?0.88:signalState==='REVEALED_RELATED'?1.05:0.76;
  return Object.freeze({color,intensity});
}
