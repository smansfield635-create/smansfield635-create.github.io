const POLICY_ID='AUDRALIA_FAP1_ORGANIZED_WEATHER_PRESENTATION_v8_VISIBLE_AUTHORITY_BINDING';
const previousShaderSource=WebGL2RenderingContext.prototype.shaderSource;
let patched=0;
let rejected=0;

function patchFAP1CloudShader(source){
  if(typeof source!=='string'
    ||source.includes('globalCloudSupport')
    ||!source.includes('vec3 densityAt(vec3 p)')
    ||!source.includes('uniform vec4 uSysA[8],uSysB[8],uSysC[8],uSysD[8],uClearA[4];')
    ||!source.includes('uniform int uCarveActive,uCarveSystemIndex;'))return source;
  let next=source;

  const helper=`
float fap1Band(float h,float lo,float hi){return smoothstep(lo,lo+5.0,h)*(1.0-smoothstep(hi-7.0,hi,h));}
vec2 fap1Local(float lat,float lon,float cLat,float cLon){float dl=wrapPi(lon-cLon);return vec2(dl*cos(cLat),lat-cLat);}
float fap1Disk(float lat,float lon,float cLat,float cLon,float radius){vec2 q=fap1Local(lat,lon,cLat,cLon);return 1.0-smoothstep(radius*.62,radius,length(q));}
float fap1Ellipse(vec2 q,vec2 c,vec2 scale,float angle){float ca=cos(angle),sa=sin(angle);vec2 d=q-c;vec2 p=vec2(ca*d.x+sa*d.y,-sa*d.x+ca*d.y)/scale;return 1.0-smoothstep(.58,1.04,length(p));}
float fap1CloudBreakPhase(vec3 radial,float t,float scale,float lo,float hi,float phase){float n=fbm(radial*scale+vec3(t*.31+phase*1.71,-t*.23+phase*2.17,t*.17-phase*1.29));return smoothstep(lo,hi,n);}
float fap1CloudBreak(vec3 radial,float t,float scale,float lo,float hi){return fap1CloudBreakPhase(radial,t,scale,lo,hi,0.0);}
float fap1ClearCorridor(float lat,float lon){
  float gratitude=fap1Disk(lat,lon,.453786,-.314159,.30);
  float centralPacific=fap1Disk(lat,lon,-.10,-1.88,.20);
  float indianWindow=fap1Disk(lat,lon,.18,1.78,.18);
  return max(gratitude,max(centralPacific,indianWindow));
}
vec3 fap1FrontSystem(vec3 radial,float h,float lat,float lon,float cLat,float cLon,float angle,float phase,float strength){
  float t=uTimeHours*.0065;
  vec2 q=fap1Local(lat,lon,cLat,cLon+t*(.006+.002*sin(phase*5.0)));
  float head=fap1Ellipse(q,vec2(-.12,.00),vec2(.52,.12),angle);
  float tail=fap1Ellipse(q,vec2(.26,.08),vec2(.34,.10),angle+.18);
  float extension=fap1Ellipse(q,vec2(.48,.12),vec2(.28,.065),angle+.09);
  float drySlot=fap1Ellipse(q,vec2(.02,-.025),vec2(.105,.070),angle-.10);
  float shape=max(head,max(tail,extension))*(1.0-.70*drySlot);
  float breakup=mix(.20,1.0,fap1CloudBreakPhase(radial,t,14.0,.34,.69,phase));
  float mid=shape*fap1Band(h,42.0,82.0)*breakup*.62*strength;
  float ice=max(head,tail)*fap1Band(h,72.0,106.0)*mix(.24,1.0,fap1CloudBreakPhase(radial,t,20.0,.34,.70,phase+1.7))*.34*strength;
  return vec3(mid+ice,mid*.34+ice*.98,mid*.25);
}
vec3 fap1JetSystem(vec3 radial,float h,float lat,float lon,float cLat,float cLon,float angle,float phase,float strength){
  float t=uTimeHours*.0065;
  vec2 q=fap1Local(lat,lon,cLat,cLon+t*(.010+.002*cos(phase*3.0)));
  float envelope=fap1Ellipse(q,vec2(0.0),vec2(.60,.105),angle);
  float ripple=.5+.5*sin((q.x*cos(angle)+q.y*sin(angle))*34.0+q.y*9.0+t*.44+phase*2.3);
  float breakup=fap1CloudBreakPhase(radial,t,21.0,.28,.68,phase);
  float texture=.16+.46*smoothstep(.40,.76,ripple*.46+breakup*.54);
  float plume=envelope*fap1Band(h,80.0,108.0)*texture*.52*strength;
  return vec3(plume,plume*.995,plume*.01);
}
vec3 fap1CycloneSystem(vec3 radial,float h,float lat,float lon,float cLat,float cLon,float phase,float strength){
  float t=uTimeHours*.0065;
  vec2 q=fap1Local(lat,lon,cLat,cLon+t*.010);
  float sr=length(q);
  float sa=atan(q.y,q.x);
  float stormEnvelope=1.0-smoothstep(.40,.53,sr);
  float eye=1.0-smoothstep(.032,.060,sr);
  float eyewallRing=exp(-pow((sr-.086)/.025,2.0));
  float eyewallBreak=.48+.52*fap1CloudBreakPhase(radial,t,27.0,.31,.68,phase);
  float eyewallAngular=.70+.30*(.5+.5*sin(sa*3.0+1.1+phase));
  float eyewall=eyewallRing*eyewallBreak*eyewallAngular;
  float b1=fap1Ellipse(q,vec2(.145,-.015),vec2(.19,.050),-.22+phase*.05);
  float b2=fap1Ellipse(q,vec2(.205,.105),vec2(.22,.055),.20+phase*.04);
  float b3=fap1Ellipse(q,vec2(.095,.235),vec2(.20,.050),.70+phase*.03);
  float b4=fap1Ellipse(q,vec2(-.105,.275),vec2(.24,.058),1.10+phase*.02);
  float b5=fap1Ellipse(q,vec2(-.275,.135),vec2(.25,.060),1.50-phase*.02);
  float b6=fap1Ellipse(q,vec2(-.315,-.095),vec2(.23,.055),-1.25-phase*.03);
  float b7=fap1Ellipse(q,vec2(-.135,-.300),vec2(.24,.060),-.78-phase*.04);
  float b8=fap1Ellipse(q,vec2(.145,-.315),vec2(.22,.052),-.42-phase*.05);
  float segmented=max(max(max(b1,b2),max(b3,b4)),max(max(b5,b6),max(b7,b8)));
  float segmentErosion=fap1CloudBreakPhase(radial,t,25.0,.38,.72,phase+2.0);
  float bandMass=segmented*mix(.18,1.0,segmentErosion);
  float c1=fap1Ellipse(q,vec2(.18,.08),vec2(.075,.095),.30);
  float c2=fap1Ellipse(q,vec2(-.16,.22),vec2(.070,.10),-.20);
  float c3=fap1Ellipse(q,vec2(-.27,-.08),vec2(.085,.11),.55);
  float c4=fap1Ellipse(q,vec2(.10,-.27),vec2(.080,.105),-.35);
  float bursts=max(max(c1,c2),max(c3,c4));
  float low=(eyewall*1.12+bandMass*.70+bursts*.78)*stormEnvelope*fap1Band(h,30.0,86.0);
  low*=1.0-eye*.995;
  float outflowShape=fap1Ellipse(q-vec2(.055,.035),vec2(0.0),vec2(.48,.34),-.18);
  float outflowBreak=mix(.30,1.0,fap1CloudBreakPhase(radial,t,18.0,.34,.70,phase+3.0));
  float outflow=outflowShape*fap1Band(h,79.0,108.0)*outflowBreak*.42*(1.0-eye*.55);
  low*=strength;outflow*=strength;
  return vec3(low+outflow,low*.34+outflow*.97,low*.95);
}
vec3 fap1OrganizedWeather(vec3 radial,float h,float lat,float lon){
  vec3 weather=vec3(0.0);
  weather+=fap1FrontSystem(radial,h,lat,lon,.593412,-1.274090,-.34,.10,1.00);
  weather+=fap1FrontSystem(radial,h,lat,lon,.488692,.436332,.28,1.20,.88);
  weather+=fap1FrontSystem(radial,h,lat,lon,-.558505,.733038,-.12,2.10,.92);
  weather+=fap1FrontSystem(radial,h,lat,lon,.802851,2.443461,.40,2.80,.84);
  weather+=fap1FrontSystem(radial,h,lat,lon,-.767945,-.261799,-.42,3.60,.86);
  weather+=fap1JetSystem(radial,h,lat,lon,-.820305,-2.495821,.24,.30,1.00);
  weather+=fap1JetSystem(radial,h,lat,lon,1.012291,-2.617994,-.18,1.40,.90);
  weather+=fap1JetSystem(radial,h,lat,lon,.907571,1.308997,.31,2.30,.88);
  weather+=fap1JetSystem(radial,h,lat,lon,-.959931,1.832596,-.27,3.20,.91);
  weather+=fap1CycloneSystem(radial,h,lat,lon,-.628319,-2.199115,0.0,1.00);
  weather+=fap1CycloneSystem(radial,h,lat,lon,.349066,2.705260,2.4,.82);
  float clear=fap1ClearCorridor(lat,lon);
  weather*=1.0-.88*clear;
  return vec3(clamp(weather.x,0.0,1.72),clamp(weather.y,0.0,1.55),clamp(weather.z,0.0,1.40));
}
`;

  const oldDensity=`vec3 densityAt(vec3 p){
  vec3 q=p-CENTER;float rr=length(q);if(rr<=0.0)return vec3(0.0);float h=rr-R;vec3 radial=q/rr;
  float lat=asin(clamp(dot(radial,NORTH),-1.0,1.0)),lon=atan(dot(radial,EAST),dot(radial,MERIDIAN));
  float mass=0.0,iceMass=0.0,precipMass=0.0;
  for(int i=0;i<8;i++){
    if(i>=uSystemCount)break;vec4 a=uSysA[i],b=uSysB[i],c=uSysC[i],d=uSysD[i];
    if(h<a.z||h>a.w)continue;
    float z=(h-a.z)/max(a.w-a.z,.001),dlon=wrapPi(lon-a.y),dx=dlon*cos(a.x)*R,dy=(lat-a.x)*R;
    dx-=d.x*(z-.5);dy-=d.y*(z-.5);
    float co=cos(b.z),si=sin(b.z);vec2 local=vec2(co*dx+si*dy,-si*dx+co*dy),xy=vec2(local.x/max(b.x,1.0),local.y/max(b.y,1.0));
    if(length(xy)>1.42)continue;
    float fs=clamp(sqrt(max(b.x*b.y,1.0))/260.0,1.0,9.0),shape=morphology(b.w,xy,z,c.y,uTimeHours,fs);
    if(d.w>4.5){float r=length(xy),eye=1.0-smoothstep(.10,.19,r),wall=smoothstep(.12,.22,r)*(1.0-smoothstep(.31,.46,r));shape=max(shape,wall*.64*verticalEnvelope(z));shape*=1.0-eye*.985;}
    float den=shape*c.x;
    if(uCarveActive==1&&i==uCarveSystemIndex)den*=1.0-uCarveWeight*localCarveMask(p);
    mass+=den;iceMass+=den*c.z;precipMass+=den*c.w;
  }
  float clear=clearSuppression(lat,lon);float keep=1.0-clear*.96;mass*=keep;iceMass*=keep;precipMass*=keep;
  if(mass<=.0001)return vec3(0.0);return vec3(min(mass,1.7),clamp(iceMass/mass,0.0,1.0),clamp(precipMass/mass,0.0,1.0));
}`;

  const advancedDensity=`vec3 densityAt(vec3 p){
  vec3 q=p-CENTER;float rr=length(q);if(rr<=0.0)return vec3(0.0);float h=rr-R;vec3 radial=q/rr;
  float lat=asin(clamp(dot(radial,NORTH),-1.0,1.0)),lon=atan(dot(radial,EAST),dot(radial,MERIDIAN));
  vec3 fap1=fap1OrganizedWeather(radial,h,lat,lon);
  float mass=fap1.x,iceMass=fap1.y,precipMass=fap1.z;
  if(uCarveActive==1){float keep=1.0-uCarveWeight*localCarveMask(p);mass*=keep;iceMass*=keep;precipMass*=keep;}
  if(mass<=.0001)return vec3(0.0);return vec3(min(mass,1.7),clamp(iceMass/max(mass,.0001),0.0,1.0),clamp(precipMass/max(mass,.0001),0.0,1.0));
}`;

  next=next.replace('vec3 densityAt(vec3 p){',helper+'\nvec3 densityAt(vec3 p){');
  next=next.replace(oldDensity,advancedDensity);

  const changed=next!==source&&next.includes('vec3 fap1OrganizedWeather(')&&next.includes(advancedDensity);
  if(changed)patched++;else rejected++;
  return changed?next:source;
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
  cloudAuthority:Object.freeze({
    visibleDensityAuthority:'FAP1_GPU_DESCRIPTOR_RENDERER',
    retiredLegacyExteriorRemainsVisible:false,
    visibleBackgroundGlobalCloudSupport:false,
    advancedOrganizedWeatherOnly:true,
    structuredCycloneDonorPreserved:true,
    longFrontalDonorPreserved:true,
    longJetBandDonorPreserved:true,
    additionalRenderPasses:0,
    additionalCanvasOrContext:false,
    rayMarchCeilingsChanged:false
  }),
  globalPopulation:Object.freeze({
    frontalSystemCount:5,
    jetBandSystemCount:4,
    cycloneSystemCount:2,
    totalAdvancedSystemInstances:11,
    clearAirWindowsPreserved:true,
    donorVariationAxes:Object.freeze(['GEOGRAPHIC_ANCHOR','ORIENTATION','PHASE','STRENGTH'])
  }),
  getRuntimeEvidence:()=>Object.freeze({patchedCloudShaders:patched,rejectedCloudShaders:rejected})
}),writable:false,configurable:false});
