const POLICY_ID='AUDRALIA_FULL_ATMOSPHERIC_PARITY_3265_v1';
const previousShaderSource=WebGL2RenderingContext.prototype.shaderSource;
let phonePatches=0;
let tabletPatches=0;
let rejected=0;

const PARITY_GLSL=`
float apBand(float h,float lo,float hi){return smoothstep(lo,lo+5.0,h)*(1.0-smoothstep(hi-7.0,hi,h));}
vec2 apLocal(float lat,float lon,float cLat,float cLon){float dl=atan(sin(lon-cLon),cos(lon-cLon));return vec2(dl*cos(cLat),lat-cLat);}
float apEllipse(vec2 q,vec2 c,vec2 size,float angle){float ca=cos(angle),sa=sin(angle);vec2 d=q-c;vec2 p=vec2(ca*d.x+sa*d.y,-sa*d.x+ca*d.y)/size;return 1.0-smoothstep(.58,1.04,length(p));}
float apDisk(float lat,float lon,float cLat,float cLon,float radius){return 1.0-smoothstep(radius*.62,radius,length(apLocal(lat,lon,cLat,cLon)));}
float apTexture(float broad,float fine,float wave){return smoothstep(.34,.74,broad*.56+fine*.34+wave*.10);}
vec3 audraliaParityCloudField(vec3 radial,float h,float lat,float lon){
  float t=uTimeHours*.0065;
  float broad=fbm(radial*18.0+vec3(t*.24,-t*.17,t*.20));
  float fine=fbm(radial*41.0+vec3(-t*.19,t*.27,-t*.14));
  float wave=.5+.5*sin(lon*29.0+lat*17.0+t*.51);
  float tex=.12+.88*apTexture(broad,fine,wave);
  float mass=0.0,ice=0.0,precip=0.0;

  float lowBelts=(1.0-smoothstep(.22,.44,abs(lat-.12)))+(1.0-smoothstep(.20,.42,abs(lat+.38)));
  float brokenDeck=lowBelts*apBand(h,30.0,56.0)*(.10+.42*tex)*.42;
  mass+=brokenDeck;precip+=brokenDeck*.05;

  float polar=smoothstep(.82,1.10,abs(lat));
  float polarLow=polar*apBand(h,31.0,59.0)*(.18+.40*tex)*.54;
  float polarMid=polar*apBand(h,48.0,84.0)*(.15+.38*tex)*.48;
  float polarHigh=polar*apBand(h,74.0,108.0)*(.13+.42*tex)*.44;
  mass+=polarLow+polarMid+polarHigh;ice+=polarMid*.35+polarHigh*.99;precip+=polarLow*.12;

  vec2 marineA=apLocal(lat,lon,.383972,2.303835+t*.007);
  vec2 marineB=apLocal(lat,lon,-.296706,-.959931-t*.006);
  vec2 marineC=apLocal(lat,lon,.104720,-2.740167+t*.005);
  float marineEnv=apEllipse(marineA,vec2(0.0),vec2(.48,.29),-.08)+apEllipse(marineB,vec2(0.0),vec2(.44,.26),.12)+apEllipse(marineC,vec2(0.0),vec2(.42,.24),-.16);
  float marine=marineEnv*apBand(h,30.0,50.0)*(.12+.55*tex)*.45;
  mass+=marine;precip+=marine*.04;

  vec2 tradeA=apLocal(lat,lon,-.122173,2.757620-t*.009);
  vec2 tradeB=apLocal(lat,lon,.209440,.959931+t*.008);
  vec2 tradeC=apLocal(lat,lon,-.244346,-2.181662+t*.007);
  float tradeRows=smoothstep(.62,.90,.5+.5*sin((lon*44.0+lat*20.0)+t*.72));
  float tradeEnv=apEllipse(tradeA,vec2(0.0),vec2(.44,.34),.12)+apEllipse(tradeB,vec2(0.0),vec2(.40,.31),-.10)+apEllipse(tradeC,vec2(0.0),vec2(.42,.30),.18);
  float trade=tradeEnv*apBand(h,30.0,58.0)*tradeRows*(.18+.56*tex)*.42;
  mass+=trade;precip+=trade*.08;

  vec2 commaA=apLocal(lat,lon,.785398,3.071779+t*.011);
  vec2 commaB=apLocal(lat,lon,-.698132,.174533-t*.010);
  float commaShape=max(apEllipse(commaA,vec2(-.05,.03),vec2(.24,.18),-.28),apEllipse(commaA,vec2(.31,-.08),vec2(.38,.055),.16));
  commaShape=max(commaShape,max(apEllipse(commaB,vec2(-.04,.02),vec2(.22,.17),.25),apEllipse(commaB,vec2(.30,.07),vec2(.36,.052),-.12)));
  float comma=commaShape*apBand(h,45.0,86.0)*(.18+.70*tex)*.50;
  float commaIce=commaShape*apBand(h,74.0,106.0)*(.14+.54*tex)*.26;
  mass+=comma+commaIce;ice+=comma*.35+commaIce*.99;precip+=comma*.20;

  vec2 mccA=apLocal(lat,lon,.139626,-2.722714-t*.010);
  vec2 mccB=apLocal(lat,lon,-.087266,1.989675+t*.009);
  float mccCore=max(apEllipse(mccA,vec2(0.0),vec2(.20,.17),-.10),apEllipse(mccB,vec2(0.0),vec2(.18,.16),.16));
  float mccTower=mccCore*apBand(h,30.0,104.0)*(.30+.70*tex)*.66;
  float mccAnvil=max(apEllipse(mccA,vec2(.02,.08),vec2(.34,.18),-.08),apEllipse(mccB,vec2(-.02,.07),vec2(.31,.17),.12))*apBand(h,79.0,108.0)*(.22+.62*tex)*.42;
  mass+=max(mccTower,mccAnvil);ice+=mccTower*.48+mccAnvil*.99;precip+=mccTower*.70;

  vec2 cirA=apLocal(lat,lon,-.820305,-2.495821+t*.014);
  vec2 cirB=apLocal(lat,lon,.994838,.453786-t*.011);
  vec2 cirC=apLocal(lat,lon,.558505,1.989675+t*.010);
  vec2 cirD=apLocal(lat,lon,-.436332,.523599-t*.009);
  vec2 cirE=apLocal(lat,lon,.174533,-.698132+t*.008);
  float cirEnv=apEllipse(cirA,vec2(0.0),vec2(.62,.11),.24)+apEllipse(cirB,vec2(0.0),vec2(.58,.10),-.18)+apEllipse(cirC,vec2(0.0),vec2(.54,.095),.31)+apEllipse(cirD,vec2(0.0),vec2(.56,.10),-.27)+apEllipse(cirE,vec2(0.0),vec2(.52,.09),.16);
  float cirrus=cirEnv*apBand(h,82.0,108.0)*(.10+.42*tex)*.34;
  mass+=cirrus;ice+=cirrus*.997;

  vec2 veilA=apLocal(lat,lon,.506145,-2.042035+t*.003);
  vec2 veilB=apLocal(lat,lon,-.191986,.872665-t*.003);
  vec2 veilC=apLocal(lat,lon,-.541052,2.652900+t*.002);
  vec2 veilD=apLocal(lat,lon,.698132,-.174533-t*.002);
  float veilEnv=max(max(apEllipse(veilA,vec2(0.0),vec2(.96,.30),-.12),apEllipse(veilB,vec2(0.0),vec2(.92,.28),.16)),max(apEllipse(veilC,vec2(0.0),vec2(.88,.27),-.20),apEllipse(veilD,vec2(0.0),vec2(.90,.29),.10)));
  float veil=veilEnv*apBand(h,76.0,104.0)*(.08+.36*tex)*.40;
  mass+=veil;ice+=veil*.992;

  vec2 altoA=apLocal(lat,lon,.314159,-1.570796-t*.004);
  vec2 altoB=apLocal(lat,lon,-.087266,.349066+t*.004);
  vec2 altoC=apLocal(lat,lon,.733038,1.745329-t*.003);
  vec2 altoD=apLocal(lat,lon,-.523599,-2.967060+t*.003);
  vec2 altoE=apLocal(lat,lon,.052360,2.181662-t*.003);
  float altoEnv=apEllipse(altoA,vec2(0.0),vec2(.58,.34),.08)+apEllipse(altoB,vec2(0.0),vec2(.62,.36),-.12)+apEllipse(altoC,vec2(0.0),vec2(.56,.32),.18)+apEllipse(altoD,vec2(0.0),vec2(.60,.35),-.06)+apEllipse(altoE,vec2(0.0),vec2(.54,.31),.14);
  float alto=altoEnv*apBand(h,52.0,80.0)*(.08+.48*tex)*.34;
  mass+=alto;ice+=alto*.22;precip+=alto*.025;

  float clear=max(max(apDisk(lat,lon,.453786,-.314159,.28),apDisk(lat,lon,-.10,-1.88,.18)),max(apDisk(lat,lon,.18,1.78,.16),apDisk(lat,lon,-.62,.92,.14)));
  float clearFactor=1.0-.84*clear;
  return vec3(clamp(mass*clearFactor,0.0,1.30),clamp(ice*clearFactor,0.0,1.10),clamp(precip*clearFactor,0.0,1.0));
}
`;

function augmentPhone(source){
  if(!source.includes('vec3 fap1OrganizedWeather')||!source.includes('vec3 densityAt(vec3 p)')||source.includes('audraliaParityCloudField'))return source;
  let next=source.replace('vec3 densityAt(vec3 p){',`${PARITY_GLSL}\nvec3 densityAt(vec3 p){`);
  const needle='vec3 fap1=fap1OrganizedWeather(radial,h,lat,lon);float clearCorridor=fap1ClearCorridor(lat,lon);float background=globalCloudSupport(radial,h,lat,lon)*(1.0-.94*clearCorridor);float iceMass=background*smoothstep(66.0,96.0,h)*.78+fap1.y,precipMass=background*(1.0-smoothstep(58.0,82.0,h))*.10+fap1.z,mass=background+fap1.x;';
  const replacement='vec3 fap1=fap1OrganizedWeather(radial,h,lat,lon);vec3 parity=audraliaParityCloudField(radial,h,lat,lon);float clearCorridor=fap1ClearCorridor(lat,lon);float background=globalCloudSupport(radial,h,lat,lon)*(1.0-.94*clearCorridor);float iceMass=background*smoothstep(66.0,96.0,h)*.78+fap1.y+parity.y,precipMass=background*(1.0-smoothstep(58.0,82.0,h))*.10+fap1.z+parity.z,mass=background+fap1.x+parity.x;';
  if(!next.includes(needle))return source;
  next=next.replace(needle,replacement);
  phonePatches++;
  return next;
}

function augmentTablet(source){
  if(!source.includes('vec3 advancedCloudField(vec3 p)')||!source.includes('weather+=cycloneSystem')||source.includes('audraliaParityCloudField'))return source;
  let next=source.replace('vec3 advancedCloudField(vec3 p){',`${PARITY_GLSL}\nvec3 advancedCloudField(vec3 p){`);
  const needle='  float clear=max(diskAt(lat,lon,.453786,-.314159,.30),max(diskAt(lat,lon,-.10,-1.88,.20),diskAt(lat,lon,.18,1.78,.18)));';
  if(!next.includes(needle))return source;
  next=next.replace(needle,`  weather+=audraliaParityCloudField(radial,h,lat,lon);\n${needle}`);
  next=next.replace('return vec3(clamp(weather.x,0.0,1.45),clamp(weather.y,0.0,1.0),clamp(weather.z,0.0,1.0));','return vec3(clamp(weather.x,0.0,1.72),clamp(weather.y,0.0,1.35),clamp(weather.z,0.0,1.20));');
  tabletPatches++;
  return next;
}

WebGL2RenderingContext.prototype.shaderSource=function(shader,source){
  let next=source;
  if(typeof next==='string'){
    const phone=augmentPhone(next);
    if(phone!==next)next=phone;
    else{
      const tablet=augmentTablet(next);
      if(tablet!==next)next=tablet;
      else rejected++;
    }
  }
  return previousShaderSource.call(this,shader,next);
};

const evidence=Object.freeze({
  policyId:POLICY_ID,
  appliesToPhone:true,
  appliesToTablet:true,
  additionalRenderPasses:0,
  additionalCanvasCount:0,
  additionalWebGLContexts:0,
  clearAirWindowsPreserved:true,
  highDefinitionDetail:true,
  cloudFamilies:Object.freeze([
    'BROKEN_LOW_BELTS','POLAR_LOW_MID_HIGH','MARINE_STRATUS_STRATOCUMULUS','TRADE_CUMULUS_STREETS',
    'MIDLATITUDE_COMMA_FRONTS','MESOSCALE_CONVECTIVE_COMPLEXES','HIGH_CIRRUS_JET_PLUMES',
    'DISTRIBUTED_CIRROSTRATUS_VEILS','DISTRIBUTED_ALTOCUMULUS_FIELDS'
  ]),
  additionalFieldInstances:Object.freeze({marineBanks:3,tradeFields:3,commaFronts:2,mccComplexes:2,cirrusPlumes:5,cirrostratusVeils:4,altocumulusFields:5}),
  getRuntimeEvidence:()=>Object.freeze({phonePatches,tabletPatches,rejectedShaderSubmissions:rejected})
});

Object.defineProperty(window,'__AUDRALIA_FULL_ATMOSPHERIC_PARITY__',{value:evidence,writable:false,configurable:false});
