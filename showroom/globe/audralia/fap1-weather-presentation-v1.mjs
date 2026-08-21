const POLICY_ID='AUDRALIA_FAP1_ORGANIZED_WEATHER_PRESENTATION_v1';
const previousShaderSource=WebGL2RenderingContext.prototype.shaderSource;
let patched=0;
let rejected=0;

function patchFAP1CloudShader(source){
  if(typeof source!=='string'||!source.includes('globalCloudSupport')||!source.includes('vec3 densityAt(vec3 p)')||!source.includes('uSysA[8]'))return source;
  let next=source;

  const helper=`
float fap1Band(float h,float lo,float hi){return smoothstep(lo,lo+5.0,h)*(1.0-smoothstep(hi-7.0,hi,h));}
vec2 fap1Local(float lat,float lon,float cLat,float cLon){float dl=wrapPi(lon-cLon);return vec2(dl*cos(cLat),lat-cLat);}
float fap1Disk(float lat,float lon,float cLat,float cLon,float radius){vec2 q=fap1Local(lat,lon,cLat,cLon);return 1.0-smoothstep(radius*.62,radius,length(q));}
float fap1ClearCorridor(float lat,float lon){return fap1Disk(lat,lon,.453786,-.314159,.401426);}
vec3 fap1OrganizedWeather(vec3 radial,float h,float lat,float lon){
  float t=uTimeHours*.0065;
  float mass=0.0,ice=0.0,precip=0.0;

  // High cirrus / cirrostratus field: broad, thin, wind-stretched structure.
  vec2 hiq=fap1Local(lat,lon,.994838,.453786+t*.025);
  float hiBase=1.0-smoothstep(.36,.63,length(hiq));
  float hiStrand=.5+.5*sin(hiq.x*38.0+hiq.y*11.0+t*9.0+fbm(radial*24.0)*4.0);
  float hi=hiBase*fap1Band(h,72.0,106.0)*smoothstep(.30,.72,hiStrand)*.44;
  mass+=hi;ice+=hi*.98;

  // Mid-level frontal field: long asymmetric sheet with embedded breaks.
  vec2 fq=fap1Local(lat,lon,.593412,-1.27409+t*.018);
  float frontAxis=abs(fq.y+.28*fq.x+.055*sin(fq.x*16.0+t*4.0));
  float frontLong=1.0-smoothstep(.42,.82,abs(fq.x));
  float front=frontLong*(1.0-smoothstep(.055,.18,frontAxis))*fap1Band(h,42.0,80.0);
  float frontBreak=smoothstep(.30,.68,fbm(radial*15.0+vec3(t*.4,0.0,-t*.2)));
  front*=mix(.38,1.0,frontBreak)*.63;
  mass+=front;ice+=front*.32;precip+=front*.22;

  // Low cumulus belt: cellular bodies with real clear slots between them.
  vec2 cq=fap1Local(lat,lon,.069813,.837758-t*.014);
  float cumulusZone=(1.0-smoothstep(.42,.72,length(cq)))*fap1Band(h,30.0,58.0);
  float cells=fbm(radial*31.0+vec3(-t*.5,t*.22,t*.35));
  float low=cumulusZone*smoothstep(.55,.78,cells)*.72;
  mass+=low;precip+=low*.12;

  // Deep convection: vertically coherent towers with high anvil support.
  vec2 dq=fap1Local(lat,lon,-.331613,1.43117-t*.012);
  float dr=length(dq);
  float towerCore=(1.0-smoothstep(.07,.23,dr))*fap1Band(h,31.0,104.0);
  float towerNoise=smoothstep(.37,.68,fbm(radial*21.0+vec3(t*.25,-t*.2,t*.31)));
  float tower=towerCore*mix(.62,1.0,towerNoise)*.92;
  float anvil=(1.0-smoothstep(.12,.37,dr))*fap1Band(h,78.0,108.0)*.66;
  mass+=max(tower,anvil);ice+=tower*.48+anvil*.96;precip+=tower*.91;

  // Organized cyclone: eye, eyewall, logarithmic-style spiral bands and upper outflow.
  const float CY_LAT=-.628319;
  const float CY_LON=-2.199115;
  vec2 sy=fap1Local(lat,lon,CY_LAT,CY_LON+t*.010);
  float sr=length(sy);
  float sa=atan(sy.y,sy.x);
  float stormEnvelope=1.0-smoothstep(.34,.49,sr);
  float eye=1.0-smoothstep(.035,.060,sr);
  float eyewall=exp(-pow((sr-.088)/.027,2.0));
  float spiralPhase=sa+sr*29.0-t*10.0;
  float bands=pow(.5+.5*cos(spiralPhase),5.0);
  bands*=smoothstep(.095,.14,sr)*(1.0-smoothstep(.31,.46,sr));
  float bandNoise=mix(.62,1.0,smoothstep(.30,.70,fbm(radial*26.0+vec3(t*.3,-t*.4,t*.2))));
  float cycloneLow=(eyewall*1.12+bands*.68*bandNoise)*stormEnvelope*fap1Band(h,30.0,86.0);
  cycloneLow*=1.0-eye*.98;
  float outflow=(1.0-smoothstep(.18,.55,sr))*fap1Band(h,79.0,108.0)*(.28+.30*bands);
  mass+=cycloneLow+outflow;
  ice+=cycloneLow*.34+outflow*.97;
  precip+=cycloneLow*.95;

  return vec3(clamp(mass,0.0,1.55),clamp(ice,0.0,1.45),clamp(precip,0.0,1.35));
}
`;

  next=next.replace('vec3 densityAt(vec3 p){',helper+'\nvec3 densityAt(vec3 p){');
  next=next.replace(
    'float background=globalCloudSupport(radial,h,lat,lon);float iceMass=background*smoothstep(66.0,96.0,h)*.78,precipMass=background*(1.0-smoothstep(58.0,82.0,h))*.10,mass=background;',
    'vec3 fap1=fap1OrganizedWeather(radial,h,lat,lon);float clearCorridor=fap1ClearCorridor(lat,lon);float background=globalCloudSupport(radial,h,lat,lon)*(1.0-.90*clearCorridor);float iceMass=background*smoothstep(66.0,96.0,h)*.78+fap1.y,precipMass=background*(1.0-smoothstep(58.0,82.0,h))*.10+fap1.z,mass=background+fap1.x;'
  );

  const changed=next!==source;
  if(changed)patched++;else rejected++;
  return next;
}

WebGL2RenderingContext.prototype.shaderSource=function(shader,source){
  return previousShaderSource.call(this,shader,patchFAP1CloudShader(source));
};

Object.defineProperty(window,'__AUDRALIA_FAP1_ORGANIZED_WEATHER_PRESENTATION__',{value:Object.freeze({
  policyId:POLICY_ID,
  acceptedWorldPreserved:true,
  geographyMutation:false,
  oceanMutation:false,
  cameraMutation:false,
  navigationMutation:false,
  visibleUpgrade:Object.freeze({
    explicitClearAir:true,
    highIceField:true,
    midFrontalField:true,
    lowCumulusField:true,
    deepConvection:true,
    structuredCyclone:true,
    cycloneEye:true,
    cycloneEyewall:true,
    cycloneRainbands:true,
    cycloneUpperOutflow:true,
    altitudeDifferentiation:true
  }),
  getRuntimeEvidence:()=>Object.freeze({patchedCloudShaders:patched,rejectedCloudShaders:rejected})
}),writable:false,configurable:false});
