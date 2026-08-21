const POLICY_ID='AUDRALIA_FAP1_ORGANIZED_WEATHER_PRESENTATION_v6_GLOBAL_MULTI_LAYER_COVERAGE';
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

  // Global broken cloud fabric. This is intentionally multi-layer and
  // noise-broken: it prevents continent-scale empty ocean screens without
  // becoming a uniform shell or generalized haze.
  float globalBroad=fbm(radial*9.0+vec3(t*.24,-t*.17,t*.13));
  float globalDetail=fbm(radial*19.0+vec3(-t*.15,t*.21,-t*.11));
  float globalCells=smoothstep(.34,.66,globalBroad*.68+globalDetail*.32);
  float globalWave=.5+.5*sin(lon*2.35+sin(lat*3.7)*1.05+t*.20);
  float globalBreak=.60+.40*globalCells;
  float globalClear=.72+.28*globalWave;
  float globalLow=fap1Band(h,31.0,59.0)*(.13+.19*globalBreak)*globalClear;
  float globalMid=fap1Band(h,48.0,84.0)*(.09+.16*fap1CloudBreak(radial,t,13.0,.34,.66))*(.76+.24*(1.0-globalWave));
  float globalHigh=fap1Band(h,73.0,108.0)*(.07+.14*fap1CloudBreak(radial,t,16.0,.35,.68))*(.78+.22*globalWave);
  float corridor=fap1ClearCorridor(lat,lon);
  float corridorAttenuation=1.0-.42*corridor;
  globalLow*=corridorAttenuation;
  globalMid*=corridorAttenuation;
  globalHigh*=corridorAttenuation;
  mass+=globalLow+globalMid+globalHigh;
  ice+=globalHigh*.94+globalMid*.24;
  precip+=globalLow*.08+globalMid*.04;

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

  float clearBridge=1.0-fap1ClearCorridor(lat,lon);

  vec2 nwq=fap1Local(lat,lon,.72,2.72+t*.011);
  float northwestHigh=fap1Ellipse(nwq,vec2(0.0),vec2(.43,.18),-.24)*fap1Band(h,69.0,105.0)*mix(.10,.58,fap1CloudBreak(radial,t,17.0,.42,.72))*.70*clearBridge;
  mass+=northwestHigh;ice+=northwestHigh*.90;

  vec2 swq=fap1Local(lat,lon,-.58,-.42-t*.009);
  float southwestMarine=fap1Ellipse(swq,vec2(0.0),vec2(.48,.26),.18)*fap1Band(h,31.0,60.0)*mix(.12,.62,fap1CloudBreak(radial,t,23.0,.44,.74))*.74*clearBridge;
  mass+=southwestMarine;precip+=southwestMarine*.10;

  vec2 ewq=fap1Local(lat,lon,.02,-2.18+t*.008);
  float equatorialWestShape=fap1Ellipse(ewq,vec2(0.0),vec2(.42,.30),-.10)*fap1Band(h,31.0,82.0);
  float equatorialWestBreak=fap1CloudBreak(radial,t,26.0,.46,.75);
  float equatorialWest=equatorialWestShape*mix(.08,.60,equatorialWestBreak)*.72*clearBridge;
  mass+=equatorialWest;ice+=equatorialWest*.18;precip+=equatorialWest*.24;

  vec2 neq=fap1Local(lat,lon,.40,-2.73-t*.006);
  float northeastMid=fap1Ellipse(neq,vec2(0.0),vec2(.39,.22),.31)*fap1Band(h,48.0,82.0)*mix(.10,.55,fap1CloudBreak(radial,t,20.0,.43,.73))*.68*clearBridge;
  mass+=northeastMid;ice+=northeastMid*.36;precip+=northeastMid*.12;

  vec2 seq=fap1Local(lat,lon,-.76,2.24+t*.005);
  float southeastCirrus=fap1Ellipse(seq,vec2(0.0),vec2(.52,.20),-.33)*fap1Band(h,76.0,108.0)*mix(.08,.50,fap1CloudBreak(radial,t,15.0,.45,.74))*.64*clearBridge;
  mass+=southeastCirrus;ice+=southeastCirrus*.96;

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
    distributedMacroSystems:true,
    additionalIndependentWeatherFields:5,
    multiAltitudePlanetaryCoverage:true,
    globalBrokenCloudFabric:true,
    globalLowMidHighLayers:true,
    fullScreenOceanVoidSuppression:true,
    clearCorridorPreserved:true,
    smokePlumeMorphologySuppressed:true,
    altitudeDifferentiation:true,
    immersiveCloudInterior:true,
    cameraLocalRayMarchInsideCloud:true,
    volumetricEnvelopment:true,
    intermittentClearPockets:true,
    noUniformInteriorFogFallback:true
  }),
  getRuntimeEvidence:()=>Object.freeze({patchedCloudShaders:patched,rejectedCloudShaders:rejected})
}),writable:false,configurable:false});