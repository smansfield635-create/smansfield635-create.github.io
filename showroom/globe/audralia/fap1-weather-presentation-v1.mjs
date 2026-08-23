const POLICY_ID='AUDRALIA_FAP1_ORGANIZED_WEATHER_PRESENTATION_v5_INTEGRATED_COVERAGE';
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
float fap1Ellipse(vec2 q,vec2 c,vec2 scale,float angle){float ca=cos(angle),sa=sin(angle);vec2 d=q-c;vec2 p=vec2(ca*d.x+sa*d.y,-sa*d.x+ca*d.y)/scale;return 1.0-smoothstep(.58,1.04,length(p));}
float fap1CloudBreak(vec3 radial,float t,float scale,float lo,float hi){float n=fbm(radial*scale+vec3(t*.31,-t*.23,t*.17));return smoothstep(lo,hi,n);}
float fap1InteriorPocket(vec3 p,float t){
  vec3 q=(p-CENTER)/R;
  float broad=fbm(q*34.0+vec3(t*.42,-t*.18,t*.27));
  float secondary=fbm(q*61.0+vec3(-t*.17,t*.29,-t*.13));
  return smoothstep(.54,.74,broad*.74+secondary*.26);
}
vec3 fap1OrganizedWeather(vec3 radial,float h,float lat,float lon){
  float t=uTimeHours*.0065;
  float mass=0.0,ice=0.0,precip=0.0;

  float polar= smoothstep(.82,1.12,abs(lat));
  float polarCore=smoothstep(1.00,1.30,abs(lat));
  float polarSynoptic=.5+.5*sin(lon*1.45 + sin(lon*.63)*1.1 + t*.30);
  float polarErode=fap1CloudBreak(radial,t,8.5,.22,.64);
  float polarFine=fap1CloudBreak(radial,t,17.0,.30,.71);
  float polarLow=polar*fap1Band(h,31.0,58.0)*(.42+.40*polarErode)*(.78+.22*polarSynoptic);
  float polarMid=polar*fap1Band(h,48.0,82.0)*(.38+.38*polarErode)*(.72+.28*polarFine);
  float polarHigh=polar*fap1Band(h,72.0,108.0)*(.34+.42*polarFine)*(.80+.20*polarSynoptic);
  float polarDeep=polarCore*fap1Band(h,36.0,96.0)*(.18+.26*polarErode)*smoothstep(.38,.70,fbm(radial*12.0+vec3(-t*.18,t*.12,t*.21)));
  float polarMass=polarLow+polarMid+polarHigh+polarDeep;
  mass+=polarMass;
  ice+=polarHigh*.98+polarMid*.42+polarDeep*.55;
  precip+=polarLow*.20+polarMid*.18+polarDeep*.34;

  vec2 hiq=fap1Local(lat,lon,.994838,.453786+t*.025);
  float hiEnvelope=fap1Ellipse(hiq,vec2(0.0),vec2(.68,.32),-.22);
  float hiN=fbm(radial*13.0+vec3(t*.28,-t*.10,t*.41));
  float hiSecondary=fbm(radial*23.0+vec3(-t*.12,t*.18,-t*.22));
  float hiBody=smoothstep(.24,.58,hiN*.72+hiSecondary*.28);
  float hiBreak=.45+.55*smoothstep(.34,.70,hiN);
  float hi=hiEnvelope*fap1Band(h,72.0,106.0)*hiBody*hiBreak*.46*(1.0-polar*.55);
  mass+=hi;ice+=hi*.98;

  vec2 fq=fap1Local(lat,lon,.593412,-1.27409+t*.018);
  float frontA=fap1Ellipse(fq,vec2(-.12,.00),vec2(.52,.12),-.34);
  float frontB=fap1Ellipse(fq,vec2(.26,.08),vec2(.34,.10),-.16);
  float frontShape=max(frontA,frontB)*fap1Band(h,42.0,80.0);
  float frontBreak=fap1CloudBreak(radial,t,14.0,.36,.69);
  float front=frontShape*mix(.18,1.0,frontBreak)*.58;
  mass+=front;ice+=front*.32;precip+=front*.22;

  vec2 cq=fap1Local(lat,lon,.069813,.837758-t*.014);
  float cumulusZone=fap1Ellipse(cq,vec2(0.0),vec2(.58,.42),.08)*fap1Band(h,30.0,58.0);
  float cells=fbm(radial*31.0+vec3(-t*.5,t*.22,t*.35));
  float low=cumulusZone*smoothstep(.60,.79,cells)*.68;
  mass+=low;precip+=low*.12;

  vec2 dq=fap1Local(lat,lon,-.331613,1.43117-t*.012);
  float towerShape=max(
    fap1Ellipse(dq,vec2(-.04,.01),vec2(.13,.18),-.18),
    fap1Ellipse(dq,vec2(.10,.055),vec2(.10,.15),.22)
  );
  float towerBreak=fap1CloudBreak(radial,t,22.0,.30,.64);
  float tower=towerShape*fap1Band(h,31.0,104.0)*mix(.52,1.0,towerBreak)*.92;
  float anvil=fap1Ellipse(dq,vec2(.035,.085),vec2(.31,.13),-.10)*fap1Band(h,78.0,108.0)*mix(.35,1.0,fap1CloudBreak(radial,t,17.0,.32,.67))*.66;
  mass+=max(tower,anvil);ice+=tower*.48+anvil*.96;precip+=tower*.91;

  const float CY_LAT=-.628319;
  const float CY_LON=-2.199115;
  vec2 sy=fap1Local(lat,lon,CY_LAT,CY_LON+t*.010);
  float sr=length(sy);
  float sa=atan(sy.y,sy.x);
  float stormEnvelope=1.0-smoothstep(.40,.53,sr);
  float eye=1.0-smoothstep(.032,.060,sr);
  float eyewallRing=exp(-pow((sr-.086)/.025,2.0));
  float eyewallBreak=.48+.52*fap1CloudBreak(radial,t,27.0,.31,.68);
  float eyewallAngular=.70+.30*(.5+.5*sin(sa*3.0+1.1));
  float eyewall=eyewallRing*eyewallBreak*eyewallAngular;

  float b1=fap1Ellipse(sy,vec2(.145,-.015),vec2(.19,.050),-.22);
  float b2=fap1Ellipse(sy,vec2(.205,.105),vec2(.22,.055),.20);
  float b3=fap1Ellipse(sy,vec2(.095,.235),vec2(.20,.050),.70);
  float b4=fap1Ellipse(sy,vec2(-.105,.275),vec2(.24,.058),1.10);
  float b5=fap1Ellipse(sy,vec2(-.275,.135),vec2(.25,.060),1.50);
  float b6=fap1Ellipse(sy,vec2(-.315,-.095),vec2(.23,.055),-1.25);
  float b7=fap1Ellipse(sy,vec2(-.135,-.300),vec2(.24,.060),-.78);
  float b8=fap1Ellipse(sy,vec2(.145,-.315),vec2(.22,.052),-.42);
  float segmented=max(max(max(b1,b2),max(b3,b4)),max(max(b5,b6),max(b7,b8)));
  float segmentErosion=fap1CloudBreak(radial,t,25.0,.38,.72);
  float bandMass=segmented*mix(.18,1.0,segmentErosion);

  float c1=fap1Ellipse(sy,vec2(.18,.08),vec2(.075,.095),.30);
  float c2=fap1Ellipse(sy,vec2(-.16,.22),vec2(.070,.10),-.20);
  float c3=fap1Ellipse(sy,vec2(-.27,-.08),vec2(.085,.11),.55);
  float c4=fap1Ellipse(sy,vec2(.10,-.27),vec2(.080,.105),-.35);
  float bursts=max(max(c1,c2),max(c3,c4));
  float cycloneLow=(eyewall*1.12+bandMass*.70+bursts*.78)*stormEnvelope*fap1Band(h,30.0,86.0);
  cycloneLow*=1.0-eye*.995;

  vec2 outQ=sy-vec2(.055,.035);
  float outflowShape=fap1Ellipse(outQ,vec2(0.0),vec2(.48,.34),-.18);
  float outflowBreak=mix(.30,1.0,fap1CloudBreak(radial,t,18.0,.34,.70));
  float outflow=outflowShape*fap1Band(h,79.0,108.0)*outflowBreak*.42*(1.0-eye*.55);
  mass+=cycloneLow+outflow;
  ice+=cycloneLow*.34+outflow*.97;
  precip+=cycloneLow*.95;

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

  float bridgeWave=.5+.5*sin(lon*3.0 + sin(lat*4.0)*1.35 + t*.42);
  float bridgeNoise=fap1CloudBreak(radial,t,12.0,.27,.63);
  float bridgeLat=(1.0-smoothstep(.92,1.18,abs(lat)));
  float bridge=bridgeLat*fap1Band(h,72.0,103.0)*smoothstep(.24,.68,bridgeWave*.55+bridgeNoise*.45)*.30;
  mass+=bridge;ice+=bridge*.98;

  return vec3(clamp(mass,0.0,1.72),clamp(ice,0.0,1.55),clamp(precip,0.0,1.40));
}
`;

  next=next.replace('vec3 densityAt(vec3 p){',helper+'\nvec3 densityAt(vec3 p){');
  next=next.replace(
    'float background=globalCloudSupport(radial,h,lat,lon);float iceMass=background*smoothstep(66.0,96.0,h)*.78,precipMass=background*(1.0-smoothstep(58.0,82.0,h))*.10,mass=background;',
    'vec3 fap1=fap1OrganizedWeather(radial,h,lat,lon);float clearCorridor=fap1ClearCorridor(lat,lon);float background=globalCloudSupport(radial,h,lat,lon)*(1.0-.94*clearCorridor);float iceMass=background*smoothstep(66.0,96.0,h)*.78+fap1.y,precipMass=background*(1.0-smoothstep(58.0,82.0,h))*.10+fap1.z,mass=background+fap1.x;'
  );

  next=next.replace(
    'vec2 outerHit=raySphere(uEye,rd,OUTER);float t0=max(max(0.0,outerHit.x),uNearCutoff),t1=outerHit.y;',
    'vec2 outerHit=raySphere(uEye,rd,OUTER);vec3 fap1EyeDensity=densityAt(uEye);float fap1Inside=smoothstep(.10,.36,fap1EyeDensity.x);float fap1Pocket=fap1InteriorPocket(uEye,uTimeHours*.0065);float fap1InteriorPresence=fap1Inside*(1.0-.78*fap1Pocket);float fap1NearCutoff=mix(uNearCutoff,0.0,fap1InteriorPresence);float t0=max(max(0.0,outerHit.x),fap1NearCutoff),t1=outerHit.y;'
  );

  next=next.replace(
    'float extinction=mix(.020,.032,smoothstep(.12,.74,den));',
    'float fap1LocalPocket=fap1InteriorPocket(p,uTimeHours*.0065);float fap1InteriorBoost=1.0+fap1InteriorPresence*(1.35-1.05*fap1LocalPocket);den*=fap1InteriorBoost;float extinction=mix(.020,.039,smoothstep(.10,.72,den));'
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
  targetVisibleOrbitalCoverage:0.70,
  integratedAddedSystems:14,
  singleCanonicalFAP1DensityField:true,
  secondaryCoveragePatchStage:false,
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
    noVisiblePolarStripeConstruction:true,
    brokenAsymmetricStormMasses:true,
    polarCloudMaximumOccupation:true,
    broadPolarLayering:true,
    smokePlumeMorphologySuppressed:true,
    altitudeDifferentiation:true,
    immersiveCloudInterior:true,
    cameraLocalRayMarchInsideCloud:true,
    volumetricEnvelopment:true,
    intermittentClearPockets:true,
    noUniformInteriorFogFallback:true,
    orbitalCoverageIntegrated:true,
    noSecondaryCoveragePatchStage:true
  }),
  getRuntimeEvidence:()=>Object.freeze({patchedCloudShaders:patched,rejectedCloudShaders:rejected})
}),writable:false,configurable:false});
