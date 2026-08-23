const POLICY_ID='AUDRALIA_FAP1_ORBITAL_COVERAGE_EXTENSION_v1';
const previousShaderSource=WebGL2RenderingContext.prototype.shaderSource;
let patched=0;

function patchCoverage(source){
  if(typeof source!=='string'||!source.includes('vec3 fap1OrganizedWeather(vec3 radial,float h,float lat,float lon)')||!source.includes('return vec3(clamp(mass,0.0,1.72),clamp(ice,0.0,1.55),clamp(precip,0.0,1.40));')) return source;

  const extra=`
  // Orbital coverage extension: independent synoptic systems distributed across
  // previously empty longitudes. These use the existing FAP1 morphology/noise
  // helpers and altitude bands; they do not enlarge or replace accepted systems.
  vec2 oc1=fap1Local(lat,lon,.30,-2.78+t*.010);
  float oc1e=fap1Ellipse(oc1,vec2(0.0),vec2(.78,.30),-.20);
  float oc1n=mix(.30,1.0,fap1CloudBreak(radial,t,15.0,.30,.67));
  float oc1m=oc1e*fap1Band(h,30.0,61.0)*oc1n*.62;
  mass+=oc1m;precip+=oc1m*.10;

  vec2 oc2=fap1Local(lat,lon,-.27,-2.18-t*.008);
  float oc2e=fap1Ellipse(oc2,vec2(0.0),vec2(.72,.29),.17);
  float oc2n=mix(.28,1.0,fap1CloudBreak(radial,t,18.0,.31,.68));
  float oc2m=oc2e*fap1Band(h,34.0,66.0)*oc2n*.60;
  mass+=oc2m;precip+=oc2m*.12;

  vec2 oc3=fap1Local(lat,lon,.52,-1.78+t*.012);
  float oc3a=fap1Ellipse(oc3,vec2(-.16,0.0),vec2(.58,.13),-.34);
  float oc3b=fap1Ellipse(oc3,vec2(.24,.07),vec2(.46,.12),-.12);
  float oc3m=max(oc3a,oc3b)*fap1Band(h,43.0,82.0)*mix(.25,1.0,fap1CloudBreak(radial,t,14.0,.33,.68))*.66;
  mass+=oc3m;ice+=oc3m*.34;precip+=oc3m*.18;

  vec2 oc4=fap1Local(lat,lon,-.48,-1.30-t*.010);
  float oc4e=fap1Ellipse(oc4,vec2(0.0),vec2(.66,.18),.31);
  float oc4m=oc4e*fap1Band(h,46.0,86.0)*mix(.24,1.0,fap1CloudBreak(radial,t,16.0,.32,.69))*.64;
  mass+=oc4m;ice+=oc4m*.40;precip+=oc4m*.17;

  vec2 oc5=fap1Local(lat,lon,.10,-.72+t*.009);
  float oc5e=fap1Ellipse(oc5,vec2(0.0),vec2(.70,.38),-.06);
  float oc5cells=fbm(radial*28.0+vec3(-t*.31,t*.19,t*.26));
  float oc5m=oc5e*fap1Band(h,31.0,64.0)*smoothstep(.50,.73,oc5cells)*.78;
  mass+=oc5m;precip+=oc5m*.24;

  vec2 oc6=fap1Local(lat,lon,-.08,-.08-t*.011);
  float oc6e=fap1Ellipse(oc6,vec2(0.0),vec2(.76,.36),.09);
  float oc6cells=fbm(radial*25.0+vec3(t*.24,-t*.33,t*.16));
  float oc6m=oc6e*fap1Band(h,30.0,67.0)*smoothstep(.48,.71,oc6cells)*.76;
  mass+=oc6m;precip+=oc6m*.22;

  vec2 oc7=fap1Local(lat,lon,.45,.48+t*.010);
  float oc7e=fap1Ellipse(oc7,vec2(0.0),vec2(.68,.20),-.28);
  float oc7m=oc7e*fap1Band(h,48.0,88.0)*mix(.28,1.0,fap1CloudBreak(radial,t,17.0,.31,.68))*.62;
  mass+=oc7m;ice+=oc7m*.42;precip+=oc7m*.16;

  vec2 oc8=fap1Local(lat,lon,-.42,.88-t*.009);
  float oc8e=fap1Ellipse(oc8,vec2(0.0),vec2(.73,.22),.24);
  float oc8m=oc8e*fap1Band(h,43.0,84.0)*mix(.27,1.0,fap1CloudBreak(radial,t,15.0,.32,.68))*.64;
  mass+=oc8m;ice+=oc8m*.36;precip+=oc8m*.18;

  vec2 oc9=fap1Local(lat,lon,.12,1.43+t*.008);
  float oc9e=fap1Ellipse(oc9,vec2(0.0),vec2(.72,.39),.04);
  float oc9cells=fbm(radial*30.0+vec3(-t*.28,t*.17,-t*.23));
  float oc9m=oc9e*fap1Band(h,31.0,62.0)*smoothstep(.49,.72,oc9cells)*.76;
  mass+=oc9m;precip+=oc9m*.21;

  vec2 oc10=fap1Local(lat,lon,.58,1.93-t*.010);
  float oc10e=fap1Ellipse(oc10,vec2(0.0),vec2(.72,.29),-.18);
  float oc10m=oc10e*fap1Band(h,69.0,106.0)*mix(.35,1.0,fap1CloudBreak(radial,t,13.0,.28,.66))*.54;
  mass+=oc10m;ice+=oc10m*.96;

  vec2 oc11=fap1Local(lat,lon,-.57,2.30+t*.011);
  float oc11e=fap1Ellipse(oc11,vec2(0.0),vec2(.70,.28),.20);
  float oc11m=oc11e*fap1Band(h,68.0,107.0)*mix(.34,1.0,fap1CloudBreak(radial,t,14.0,.29,.67))*.55;
  mass+=oc11m;ice+=oc11m*.97;

  vec2 oc12=fap1Local(lat,lon,.24,2.72-t*.009);
  float oc12e=fap1Ellipse(oc12,vec2(0.0),vec2(.75,.31),.13);
  float oc12m=oc12e*fap1Band(h,33.0,67.0)*mix(.28,1.0,fap1CloudBreak(radial,t,19.0,.31,.69))*.62;
  mass+=oc12m;precip+=oc12m*.12;

  vec2 oc13=fap1Local(lat,lon,-.18,-3.02+t*.008);
  float oc13e=fap1Ellipse(oc13,vec2(0.0),vec2(.70,.34),-.11);
  float oc13m=oc13e*fap1Band(h,32.0,66.0)*mix(.28,1.0,fap1CloudBreak(radial,t,20.0,.30,.68))*.62;
  mass+=oc13m;precip+=oc13m*.13;

  vec2 oc14=fap1Local(lat,lon,.04,2.18-t*.010);
  float oc14e=fap1Ellipse(oc14,vec2(0.0),vec2(.68,.35),.03);
  float oc14cells=fbm(radial*27.0+vec3(t*.21,t*.29,-t*.32));
  float oc14m=oc14e*fap1Band(h,31.0,70.0)*smoothstep(.49,.72,oc14cells)*.74;
  mass+=oc14m;precip+=oc14m*.22;

  // Broad broken high-cloud bridges ensure empty longitude sectors still carry
  // visible weather texture without becoming a uniform opacity veil.
  float bridgeWave=.5+.5*sin(lon*3.0 + sin(lat*4.0)*1.35 + t*.42);
  float bridgeNoise=fap1CloudBreak(radial,t,12.0,.27,.63);
  float bridgeLat=(1.0-smoothstep(.92,1.18,abs(lat)));
  float bridge=bridgeLat*fap1Band(h,72.0,103.0)*smoothstep(.24,.68,bridgeWave*.55+bridgeNoise*.45)*.30;
  mass+=bridge;ice+=bridge*.98;
`;

  const needle='  return vec3(clamp(mass,0.0,1.72),clamp(ice,0.0,1.55),clamp(precip,0.0,1.40));';
  const next=source.replace(needle,extra+'\n'+needle);
  if(next!==source) patched++;
  return next;
}

WebGL2RenderingContext.prototype.shaderSource=function(shader,source){
  return previousShaderSource.call(this,shader,patchCoverage(source));
};

Object.defineProperty(window,'__AUDRALIA_FAP1_ORBITAL_COVERAGE_EXTENSION__',{value:Object.freeze({
  policyId:POLICY_ID,
  targetVisibleOrbitalCoverage:0.70,
  independentAddedSystems:14,
  preservesExistingSystemFootprints:true,
  preservesW5Morphology:true,
  preservesL5Lighting:true,
  geographyMutation:false,
  cameraMutation:false,
  navigationMutation:false,
  getRuntimeEvidence:()=>Object.freeze({patchedCloudShaders:patched})
}),writable:false,configurable:false});
