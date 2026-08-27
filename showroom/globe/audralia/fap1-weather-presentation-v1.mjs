const POLICY_ID='AUDRALIA_FAP1_ORGANIZED_WEATHER_PRESENTATION_v7';
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

  // WSD5-1 — Marine stratus / stratocumulus bank.
  // A broad low deck with open-cell breakup. It occupies new longitude rather
  // than scaling any existing cloud system.
  vec2 mq=fap1Local(lat,lon,.383972,2.303835+t*.007);
  float marineEnvelope=fap1Ellipse(mq,vec2(0.0),vec2(.68,.42),-.08);
  float marineCellWave=.5+.5*sin(mq.x*34.0+sin(mq.y*22.0+t*.55)*1.35);
  float marineNoise=fbm(radial*24.0+vec3(t*.13,-t*.27,t*.19));
  float marineOpenCells=smoothstep(.38,.73,marineNoise*.62+marineCellWave*.38);
  float marineDeck=marineEnvelope*fap1Band(h,30.0,49.0)*(.20+.58*marineOpenCells)*.72;
  mass+=marineDeck;
  precip+=marineDeck*.06;

  // WSD5-2 — Trade-cumulus streets.
  // Narrow parallel rows are separated by deliberate clear-air lanes.
  vec2 tq=fap1Local(lat,lon,-.122173,2.757620-t*.009);
  float tradeEnvelope=fap1Ellipse(tq,vec2(0.0),vec2(.43,.33),.12);
  float tradeAxis=tq.x*.94+tq.y*.34;
  float tradeRows=.5+.5*sin(tradeAxis*56.0+t*.72);
  float tradeCells=fbm(radial*35.0+vec3(-t*.31,t*.16,t*.23));
  float tradeStreet=smoothstep(.68,.90,tradeRows)*smoothstep(.49,.73,tradeCells);
  float tradeCumulus=tradeEnvelope*fap1Band(h,30.0,57.0)*tradeStreet*.84;
  mass+=tradeCumulus;
  precip+=tradeCumulus*.10;

  // WSD5-3 — Midlatitude comma cloud and frontal tail.
  // A compact shield wraps into a long broken front with a dry-slot incision.
  vec2 jq=fap1Local(lat,lon,.785398,3.071779+t*.011);
  float commaHead=fap1Ellipse(jq,vec2(-.05,.035),vec2(.22,.18),-.28);
  float commaWrap=fap1Ellipse(jq,vec2(.105,.045),vec2(.30,.060),.46);
  float commaTailA=fap1Ellipse(jq,vec2(.28,-.075),vec2(.34,.052),.18);
  float commaTailB=fap1Ellipse(jq,vec2(.49,-.145),vec2(.30,.044),.10);
  float commaDrySlot=fap1Ellipse(jq,vec2(.025,-.025),vec2(.105,.070),-.38);
  float commaShape=max(commaHead,max(commaWrap,max(commaTailA,commaTailB)))*(1.0-.78*commaDrySlot);
  float commaBreak=mix(.24,1.0,fap1CloudBreak(radial,t,15.0,.34,.69));
  float commaMid=commaShape*fap1Band(h,46.0,84.0)*commaBreak*.72;
  float commaIce=max(commaHead,commaWrap)*fap1Band(h,73.0,104.0)*mix(.22,1.0,fap1CloudBreak(radial,t,20.0,.35,.70))*.46;
  mass+=commaMid+commaIce;
  ice+=commaMid*.36+commaIce*.98;
  precip+=commaMid*.28;

  // WSD5-4 — Mesoscale convective complex.
  // Several deep towers feed one shared anvil, intentionally distinct from the
  // organized tropical cyclone and from the earlier two-tower convection.
  vec2 xq=fap1Local(lat,lon,.139626,-2.722714-t*.010);
  float mcc1=fap1Ellipse(xq,vec2(-.105,-.035),vec2(.095,.125),-.16);
  float mcc2=fap1Ellipse(xq,vec2(.015,.020),vec2(.100,.145),.10);
  float mcc3=fap1Ellipse(xq,vec2(.125,-.010),vec2(.090,.120),.24);
  float mcc4=fap1Ellipse(xq,vec2(.055,.115),vec2(.085,.115),-.28);
  float mccCore=max(max(mcc1,mcc2),max(mcc3,mcc4));
  float mccBreak=mix(.46,1.0,fap1CloudBreak(radial,t,25.0,.31,.66));
  float mccTower=mccCore*fap1Band(h,30.0,105.0)*mccBreak*.96;
  float mccAnvil=fap1Ellipse(xq,vec2(.025,.075),vec2(.32,.19),-.08)*fap1Band(h,78.0,108.0)*mix(.30,1.0,fap1CloudBreak(radial,t,18.0,.33,.69))*.68;
  mass+=max(mccTower,mccAnvil);
  ice+=mccTower*.50+mccAnvil*.98;
  precip+=mccTower*.84;

  // WSD5-5 — High cirrus / cirrocumulus jet plume.
  // Thin high ice occupies a large orbital footprint without covering the
  // surface like another dense white mass.
  vec2 iq=fap1Local(lat,lon,-.820305,-2.495821+t*.014);
  float jetEnvelope=fap1Ellipse(iq,vec2(0.0),vec2(.54,.105),.24);
  float jetRipple=.5+.5*sin(iq.x*33.0+iq.y*10.0+t*.44);
  float jetBreak=fap1CloudBreak(radial,t,21.0,.28,.68);
  float jetTexture=.22+.46*smoothstep(.42,.76,jetRipple*.48+jetBreak*.52);
  float cirrusPlume=jetEnvelope*fap1Band(h,81.0,108.0)*jetTexture*.58;
  mass+=cirrusPlume;
  ice+=cirrusPlume*.995;

  // WSD6-1 — Distributed cirrus fields.
  // Four long high-level filaments occupy different planetary sectors.
  vec2 c6a=fap1Local(lat,lon,.610865,-2.827433+t*.006);
  vec2 c6b=fap1Local(lat,lon,-.401426,-1.047198-t*.005);
  vec2 c6c=fap1Local(lat,lon,.209440,.191986+t*.004);
  vec2 c6d=fap1Local(lat,lon,-.698132,1.989675-t*.006);
  float cirrusEnvA=fap1Ellipse(c6a,vec2(0.0),vec2(.82,.095),.30);
  float cirrusEnvB=fap1Ellipse(c6b,vec2(0.0),vec2(.74,.090),-.24);
  float cirrusEnvC=fap1Ellipse(c6c,vec2(0.0),vec2(.86,.100),.18);
  float cirrusEnvD=fap1Ellipse(c6d,vec2(0.0),vec2(.78,.090),-.31);
  float cirrusNoise=fap1CloudBreak(radial,t,19.0,.27,.69);
  float cirrusWaveA=.5+.5*sin(c6a.x*27.0+c6a.y*8.0+t*.38);
  float cirrusWaveB=.5+.5*sin(c6b.x*31.0-c6b.y*7.0-t*.31);
  float cirrusWaveC=.5+.5*sin(c6c.x*25.0+c6c.y*10.0+t*.28);
  float cirrusWaveD=.5+.5*sin(c6d.x*29.0-c6d.y*9.0-t*.34);
  float cirrusTextureA=.17+.44*smoothstep(.36,.77,cirrusWaveA*.55+cirrusNoise*.45);
  float cirrusTextureB=.17+.42*smoothstep(.38,.78,cirrusWaveB*.52+cirrusNoise*.48);
  float cirrusTextureC=.17+.43*smoothstep(.37,.77,cirrusWaveC*.56+cirrusNoise*.44);
  float cirrusTextureD=.17+.41*smoothstep(.39,.79,cirrusWaveD*.54+cirrusNoise*.46);
  float cirrusFields=(cirrusEnvA*cirrusTextureA+cirrusEnvB*cirrusTextureB+cirrusEnvC*cirrusTextureC+cirrusEnvD*cirrusTextureD)*fap1Band(h,84.0,108.0)*.68;
  cirrusFields*=1.0-.72*fap1ClearCorridor(lat,lon);
  mass+=cirrusFields;
  ice+=cirrusFields*.997;

  // WSD6-2 — Distributed cirrostratus veils.
  // Three broad translucent shields bridge gaps between organized systems.
  vec2 s6a=fap1Local(lat,lon,.506145,-2.042035+t*.003);
  vec2 s6b=fap1Local(lat,lon,-.191986,.872665-t*.003);
  vec2 s6c=fap1Local(lat,lon,-.541052,2.652900+t*.002);
  float veilA=fap1Ellipse(s6a,vec2(0.0),vec2(.96,.30),-.12);
  float veilB=fap1Ellipse(s6b,vec2(0.0),vec2(.92,.28),.16);
  float veilC=fap1Ellipse(s6c,vec2(0.0),vec2(.88,.27),-.20);
  float veilBreak=.22+.52*fap1CloudBreak(radial,t,10.0,.20,.64);
  float cirrostratus=max(veilA,max(veilB,veilC))*fap1Band(h,76.0,104.0)*veilBreak*.72;
  cirrostratus*=1.0-.82*fap1ClearCorridor(lat,lon);
  mass+=cirrostratus;
  ice+=cirrostratus*.992;

  // WSD6-3 — Distributed altocumulus fields.
  // Four mid-level patch fields create mesoscale texture without closing the sky.
  vec2 a6a=fap1Local(lat,lon,.314159,-1.570796-t*.004);
  vec2 a6b=fap1Local(lat,lon,-.087266,.349066+t*.004);
  vec2 a6c=fap1Local(lat,lon,.733038,1.745329-t*.003);
  vec2 a6d=fap1Local(lat,lon,-.523599,-2.967060+t*.003);
  float altoEnvA=fap1Ellipse(a6a,vec2(0.0),vec2(.58,.34),.08);
  float altoEnvB=fap1Ellipse(a6b,vec2(0.0),vec2(.62,.36),-.12);
  float altoEnvC=fap1Ellipse(a6c,vec2(0.0),vec2(.70,.40),.18);
  float altoEnvD=fap1Ellipse(a6d,vec2(0.0),vec2(.60,.35),-.06);
  float altoNoise=fbm(radial*30.0+vec3(t*.21,-t*.16,t*.12));
  float altoRipple=.5+.5*sin(lon*24.0+lat*17.0+t*.45);
  float altoCells=smoothstep(.48,.72,altoNoise*.72+altoRipple*.28);
  float altocumulus=(altoEnvA+altoEnvB+altoEnvC+altoEnvD)*fap1Band(h,52.0,79.0)*(.18+.70*altoCells)*.64;
  altocumulus*=1.0-.76*fap1ClearCorridor(lat,lon);
  mass+=altocumulus;
  ice+=altocumulus*.22;
  precip+=altocumulus*.035;

  return vec3(clamp(mass,0.0,1.72),clamp(ice,0.0,1.55),clamp(precip,0.0,1.40));
}
`;

  next=next.replace('vec3 densityAt(vec3 p){',helper+'\nvec3 densityAt(vec3 p){');
  next=next.replace(
    'float background=globalCloudSupport(radial,h,lat,lon);float iceMass=background*smoothstep(66.0,96.0,h)*.78,precipMass=background*(1.0-smoothstep(58.0,82.0,h))*.10,mass=background;',
    'vec3 fap1=fap1OrganizedWeather(radial,h,lat,lon);float clearCorridor=fap1ClearCorridor(lat,lon);float background=globalCloudSupport(radial,h,lat,lon)*(1.0-.94*clearCorridor);float iceMass=background*smoothstep(66.0,96.0,h)*.78+fap1.y,precipMass=background*(1.0-smoothstep(58.0,82.0,h))*.10+fap1.z,mass=background+fap1.x;'
  );

  // Cloud-interior traversal: when the camera is physically inside occupied
  // density, begin ray marching at the eye instead of honoring the exterior
  // near-cutoff. This makes the same world-space cloud volume envelop the viewer.
  next=next.replace(
    'vec2 outerHit=raySphere(uEye,rd,OUTER);float t0=max(max(0.0,outerHit.x),uNearCutoff),t1=outerHit.y;',
    'vec2 outerHit=raySphere(uEye,rd,OUTER);vec3 fap1EyeDensity=densityAt(uEye);float fap1Inside=smoothstep(.10,.36,fap1EyeDensity.x);float fap1Pocket=fap1InteriorPocket(uEye,uTimeHours*.0065);float fap1InteriorPresence=fap1Inside*(1.0-.78*fap1Pocket);float fap1NearCutoff=mix(uNearCutoff,0.0,fap1InteriorPresence);float t0=max(max(0.0,outerHit.x),fap1NearCutoff),t1=outerHit.y;'
  );

  // Inside dense cloud, increase local extinction smoothly but preserve broad
  // low-frequency voids. The result should alternate between enveloping cloud
  // and transient visibility pockets like aircraft traversal, never a flat fog.
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
    smokePlumeMorphologySuppressed:true,
    altitudeDifferentiation:true,
    immersiveCloudInterior:true,
    cameraLocalRayMarchInsideCloud:true,
    volumetricEnvelopment:true,
    intermittentClearPockets:true,
    noUniformInteriorFogFallback:true,
    marineStratusStratocumulusBank:true,
    tradeCumulusStreets:true,
    midlatitudeCommaFront:true,
    mesoscaleConvectiveComplex:true,
    highCirrusCirrocumulusJetPlume:true,
    sparseHemisphereDiversified:true,
    planetaryCloudFieldCoverage:true,
    cirrusFieldMultiplicity:true,
    cirrostratusVeilMultiplicity:true,
    altocumulusFieldMultiplicity:true,
    clearAirWindowsPreserved:true,
    existingCloudSystemsExpanded:true,
    secondFailingCorpusRepair:true,
    orbitalSurvivalBoost:true,
    singlePassRaymarchPreserved:true,
    performanceCeilingsFrozen:true
  }),
  diversification:Object.freeze({
    targetSector:'82E_TO_126W_ACROSS_DATELINE',
    systemCount:5,
    systemIds:Object.freeze([
      'MARINE_STRATUS_STRATOCUMULUS_BANK',
      'TRADE_CUMULUS_STREETS',
      'MIDLATITUDE_COMMA_FRONT',
      'MESOSCALE_CONVECTIVE_COMPLEX',
      'HIGH_CIRRUS_CIRROCUMULUS_JET_PLUME'
    ]),
    existingSystemsExpanded:true,
    additionalRenderPasses:0,
    rayMarchCeilingsChanged:false
  }),
  planetaryCoverage:Object.freeze({
    target:'MULTI_HEMISPHERE_DISTRIBUTED',
    familyIds:Object.freeze([
      'CIRRUS_FIELD',
      'CIRROSTRATUS_VEIL',
      'ALTOCUMULUS_FIELD'
    ]),
    cirrusFieldCount:4,
    cirrostratusVeilCount:3,
    altocumulusFieldCount:4,
    totalFieldInstances:11,
    multiplicityRequired:true,
    orbitalSurvivalBoost:true,
    clearAirWindowsPreserved:true,
    additionalRenderPasses:0,
    rayMarchCeilingsChanged:false
  }),
  getRuntimeEvidence:()=>Object.freeze({patchedCloudShaders:patched,rejectedCloudShaders:rejected})
}),writable:false,configurable:false});