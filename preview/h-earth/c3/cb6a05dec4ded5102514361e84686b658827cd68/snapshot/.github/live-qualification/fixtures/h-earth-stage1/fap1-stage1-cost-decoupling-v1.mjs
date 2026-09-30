const POLICY_ID='AUDRALIA_FAP1_STAGE1_COST_DECOUPLING_v1';
const previousShaderSource=WebGL2RenderingContext.prototype.shaderSource;
let patched=0;
let rejected=0;

function patchStage1CostDecoupling(source){
  if(typeof source!=='string'||!source.includes('vec3 fap1Center=fap1OrganizedWeather(radial,h,lat,lon);')||!source.includes('fap1OrganizedWeather')||!source.includes('fap1Band'))return source;
  let next=source;

  const helper=`
struct FAP1Stage1Horizontal {
  float polar,polarCore,polarSynoptic,polarErode,polarFine,polarDeepNoise;
  float hiEnvelope,hiBody,hiBreak;
  float frontEnvelope,frontBreak;
  float cumulusEnvelope,cells;
  float towerShape,towerBreak,anvilShape,anvilBreak;
  float stormEnvelope,eye,eyewall,bandMass,bursts,outflowShape,outflowBreak;
};
FAP1Stage1Horizontal fap1Stage1BuildHorizontal(vec3 radial,float lat,float lon){
  float t=uTimeHours*.0065;
  FAP1Stage1Horizontal s;
  s.polar=smoothstep(.82,1.12,abs(lat));
  s.polarCore=smoothstep(1.00,1.30,abs(lat));
  s.polarSynoptic=0.0;s.polarErode=0.0;s.polarFine=0.0;s.polarDeepNoise=0.0;
  if(s.polar>0.0){
    s.polarSynoptic=.5+.5*sin(lon*1.45+sin(lon*.63)*1.1+t*.30);
    s.polarErode=fap1CloudBreak(radial,t,8.5,.22,.64);
    s.polarFine=fap1CloudBreak(radial,t,17.0,.30,.71);
    if(s.polarCore>0.0)s.polarDeepNoise=smoothstep(.38,.70,fbm(radial*12.0+vec3(-t*.18,t*.12,t*.21)));
  }

  vec2 hiq=fap1Local(lat,lon,.994838,.453786+t*.025);
  s.hiEnvelope=fap1Ellipse(hiq,vec2(0.0),vec2(.68,.32),-.22);
  s.hiBody=0.0;s.hiBreak=0.0;
  if(s.hiEnvelope>0.0){
    float hiN=fbm(radial*13.0+vec3(t*.28,-t*.10,t*.41));
    float hiSecondary=fbm(radial*23.0+vec3(-t*.12,t*.18,-t*.22));
    s.hiBody=smoothstep(.24,.58,hiN*.72+hiSecondary*.28);
    s.hiBreak=.45+.55*smoothstep(.34,.70,hiN);
  }

  vec2 fq=fap1Local(lat,lon,.593412,-1.27409+t*.018);
  float frontA=fap1Ellipse(fq,vec2(-.12,.00),vec2(.52,.12),-.34);
  float frontB=fap1Ellipse(fq,vec2(.26,.08),vec2(.34,.10),-.16);
  s.frontEnvelope=max(frontA,frontB);
  s.frontBreak=0.0;
  if(s.frontEnvelope>0.0)s.frontBreak=fap1CloudBreak(radial,t,14.0,.36,.69);

  vec2 cq=fap1Local(lat,lon,.069813,.837758-t*.014);
  s.cumulusEnvelope=fap1Ellipse(cq,vec2(0.0),vec2(.58,.42),.08);
  s.cells=0.0;
  if(s.cumulusEnvelope>0.0)s.cells=fbm(radial*31.0+vec3(-t*.5,t*.22,t*.35));

  vec2 dq=fap1Local(lat,lon,-.331613,1.43117-t*.012);
  s.towerShape=max(fap1Ellipse(dq,vec2(-.04,.01),vec2(.13,.18),-.18),fap1Ellipse(dq,vec2(.10,.055),vec2(.10,.15),.22));
  s.anvilShape=fap1Ellipse(dq,vec2(.035,.085),vec2(.31,.13),-.10);
  s.towerBreak=0.0;s.anvilBreak=0.0;
  if(s.towerShape>0.0)s.towerBreak=fap1CloudBreak(radial,t,22.0,.30,.64);
  if(s.anvilShape>0.0)s.anvilBreak=fap1CloudBreak(radial,t,17.0,.32,.67);

  float cyLat=-.628319,cyLon=-2.199115;
  vec2 sy=fap1Local(lat,lon,cyLat,cyLon+t*.010);
  float sr=length(sy),sa=atan(sy.y,sy.x);
  s.stormEnvelope=1.0-smoothstep(.40,.53,sr);
  s.eye=1.0-smoothstep(.032,.060,sr);
  s.eyewall=0.0;s.bandMass=0.0;s.bursts=0.0;
  if(s.stormEnvelope>0.0){
    float eyewallRing=exp(-pow((sr-.086)/.025,2.0));
    float eyewallBreak=.48+.52*fap1CloudBreak(radial,t,27.0,.31,.68);
    float eyewallAngular=.70+.30*(.5+.5*sin(sa*3.0+1.1));
    s.eyewall=eyewallRing*eyewallBreak*eyewallAngular;
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
    s.bandMass=segmented*mix(.18,1.0,segmentErosion);
    float c1=fap1Ellipse(sy,vec2(.18,.08),vec2(.075,.095),.30);
    float c2=fap1Ellipse(sy,vec2(-.16,.22),vec2(.070,.10),-.20);
    float c3=fap1Ellipse(sy,vec2(-.27,-.08),vec2(.085,.11),.55);
    float c4=fap1Ellipse(sy,vec2(.10,-.27),vec2(.080,.105),-.35);
    s.bursts=max(max(c1,c2),max(c3,c4));
  }
  vec2 outQ=sy-vec2(.055,.035);
  s.outflowShape=fap1Ellipse(outQ,vec2(0.0),vec2(.48,.34),-.18);
  s.outflowBreak=0.0;
  if(s.outflowShape>0.0)s.outflowBreak=fap1CloudBreak(radial,t,18.0,.34,.70);
  return s;
}
vec3 fap1Stage1Compose(FAP1Stage1Horizontal s,float h){
  float mass=0.0,ice=0.0,precip=0.0;
  float polarLow=s.polar*fap1Band(h,31.0,58.0)*(.42+.40*s.polarErode)*(.78+.22*s.polarSynoptic);
  float polarMid=s.polar*fap1Band(h,48.0,82.0)*(.38+.38*s.polarErode)*(.72+.28*s.polarFine);
  float polarHigh=s.polar*fap1Band(h,72.0,108.0)*(.34+.42*s.polarFine)*(.80+.20*s.polarSynoptic);
  float polarDeep=s.polarCore*fap1Band(h,36.0,96.0)*(.18+.26*s.polarErode)*s.polarDeepNoise;
  float polarMass=polarLow+polarMid+polarHigh+polarDeep;
  mass+=polarMass;ice+=polarHigh*.98+polarMid*.42+polarDeep*.55;precip+=polarLow*.20+polarMid*.18+polarDeep*.34;
  float hi=s.hiEnvelope*fap1Band(h,72.0,106.0)*s.hiBody*s.hiBreak*.46*(1.0-s.polar*.55);
  mass+=hi;ice+=hi*.98;
  float front=s.frontEnvelope*fap1Band(h,42.0,80.0)*mix(.18,1.0,s.frontBreak)*.58;
  mass+=front;ice+=front*.32;precip+=front*.22;
  float low=s.cumulusEnvelope*fap1Band(h,30.0,58.0)*smoothstep(.60,.79,s.cells)*.68;
  mass+=low;precip+=low*.12;
  float tower=s.towerShape*fap1Band(h,31.0,104.0)*mix(.52,1.0,s.towerBreak)*.92;
  float anvil=s.anvilShape*fap1Band(h,78.0,108.0)*mix(.35,1.0,s.anvilBreak)*.66;
  mass+=max(tower,anvil);ice+=tower*.48+anvil*.96;precip+=tower*.91;
  float cycloneLow=(s.eyewall*1.12+s.bandMass*.70+s.bursts*.78)*s.stormEnvelope*fap1Band(h,30.0,86.0);
  cycloneLow*=1.0-s.eye*.995;
  float outflow=s.outflowShape*fap1Band(h,79.0,108.0)*mix(.30,1.0,s.outflowBreak)*.42*(1.0-s.eye*.55);
  mass+=cycloneLow+outflow;ice+=cycloneLow*.34+outflow*.97;precip+=cycloneLow*.95;
  return vec3(clamp(mass,0.0,1.72),clamp(ice,0.0,1.55),clamp(precip,0.0,1.40));
}
`;
  next=next.replace('vec3 densityAt(vec3 p){',helper+'\nvec3 densityAt(vec3 p){');

  const original=`vec3 fap1Center=fap1OrganizedWeather(radial,h,lat,lon);
  vec3 fap1Down1=fap1OrganizedWeather(radial,max(10.0,h-18.0),lat,lon);
  vec3 fap1Down2=fap1OrganizedWeather(radial,max(10.0,h-36.0),lat,lon);
  vec3 fap1Up1=fap1OrganizedWeather(radial,min(198.0,h+20.0),lat,lon);
  vec3 fap1Up2=fap1OrganizedWeather(radial,min(198.0,h+42.0),lat,lon);`;
  const optimized=`FAP1Stage1Horizontal fap1Horizontal=fap1Stage1BuildHorizontal(radial,lat,lon);
  vec3 fap1Center=fap1Stage1Compose(fap1Horizontal,h);
  vec3 fap1Down1=fap1Stage1Compose(fap1Horizontal,max(10.0,h-18.0));
  vec3 fap1Down2=fap1Stage1Compose(fap1Horizontal,max(10.0,h-36.0));
  vec3 fap1Up1=fap1Stage1Compose(fap1Horizontal,min(198.0,h+20.0));
  vec3 fap1Up2=fap1Stage1Compose(fap1Horizontal,min(198.0,h+42.0));`;
  next=next.replace(original,optimized);
  const changed=next!==source;
  if(changed)patched++;else rejected++;
  return next;
}

WebGL2RenderingContext.prototype.shaderSource=function(shader,source){
  return previousShaderSource.call(this,shader,patchStage1CostDecoupling(source));
};

Object.defineProperty(window,'__AUDRALIA_FAP1_STAGE1_COST_DECOUPLING__',{value:Object.freeze({
  policyId:POLICY_ID,
  protectedBaseline:'1d45379f81ea4089e9c5f3d7d9688e702be9add3',
  coverageMutation:false,
  weatherIdentityMutation:false,
  geographyMutation:false,
  cameraMutation:false,
  compositorMutation:false,
  optimization:Object.freeze({
    fiveSliceVerticalConvolutionPreserved:true,
    sharedHorizontalOrganization:true,
    altitudeCompositionCheap:true,
    coarseSpatialRejectionBeforeNoise:true,
    heroCycloneGeometryPreserved:true,
    originalConvolutionWeightsPreserved:true,
    originalAltitudeOffsetsPreserved:true
  }),
  getRuntimeEvidence:()=>Object.freeze({patchedCloudShaders:patched,rejectedCloudShaders:rejected})
}),writable:false,configurable:false});
