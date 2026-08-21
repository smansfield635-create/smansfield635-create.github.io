const POLICY_ID='AUDRALIA_FAP1_ORBITAL_COVERAGE_70_V1';
const previousShaderSource=WebGL2RenderingContext.prototype.shaderSource;
let patched=0;
let rejected=0;

function patchOrbitalCoverage(source){
  if(typeof source!=='string'||!source.includes('fap1OrganizedWeather')||!source.includes('vec3 densityAt(vec3 p)')||!source.includes('globalCloudSupport'))return source;
  let next=source;

  const helper=`
vec3 fap1OrbitalCoverage(vec3 radial,float h,float lat,float lon){
  float t=uTimeHours*.0065;

  float nLowA=fbm(radial*8.2+vec3(t*.34,-t*.18,t*.23));
  float nLowB=fbm(radial*17.0+vec3(-t*.21,t*.27,-t*.14));
  float lowPattern=smoothstep(.38,.61,nLowA*.68+nLowB*.32+.07*sin(lon*3.1+lat*2.2+t*.35));

  float nMidA=fbm(radial*7.0+vec3(-t*.16,t*.31,t*.19));
  float nMidB=fbm(radial*15.5+vec3(t*.25,-t*.12,t*.28));
  float midPattern=smoothstep(.39,.62,nMidA*.70+nMidB*.30+.06*cos(lon*2.6-lat*3.0-t*.29));

  float nHighA=fbm(radial*6.3+vec3(t*.18,t*.11,-t*.27));
  float nHighB=fbm(radial*13.2+vec3(-t*.22,-t*.16,t*.24));
  float highPattern=smoothstep(.40,.63,nHighA*.72+nHighB*.28+.06*sin(lon*2.1+lat*3.6+t*.22));

  float lowBand=fap1Band(h,30.0,61.0);
  float midBand=fap1Band(h,46.0,84.0);
  float highBand=fap1Band(h,70.0,108.0);

  float low=lowBand*(.18+.48*lowPattern);
  float mid=midBand*(.15+.42*midPattern);
  float high=highBand*(.12+.36*highPattern);

  vec2 s1=fap1Local(lat,lon,.34,-2.82+t*.010);
  vec2 s2=fap1Local(lat,lon,.12,-1.72-t*.008);
  vec2 s3=fap1Local(lat,lon,-.18,-.86+t*.007);
  vec2 s4=fap1Local(lat,lon,.48,.18-t*.006);
  vec2 s5=fap1Local(lat,lon,-.42,.66+t*.009);
  vec2 s6=fap1Local(lat,lon,.20,1.64-t*.007);
  vec2 s7=fap1Local(lat,lon,-.12,2.48+t*.006);
  vec2 s8=fap1Local(lat,lon,.62,2.92-t*.005);

  float a1=fap1Ellipse(s1,vec2(0.0),vec2(.44,.24),-.20)*fap1Band(h,32.0,66.0)*.62;
  float a2=fap1Ellipse(s2,vec2(0.0),vec2(.38,.20),.27)*fap1Band(h,52.0,88.0)*.54;
  float a3=fap1Ellipse(s3,vec2(0.0),vec2(.42,.28),-.08)*fap1Band(h,31.0,76.0)*.66;
  float a4=fap1Ellipse(s4,vec2(0.0),vec2(.46,.18),.31)*fap1Band(h,74.0,108.0)*.48;
  float a5=fap1Ellipse(s5,vec2(0.0),vec2(.40,.26),-.29)*fap1Band(h,34.0,70.0)*.60;
  float a6=fap1Ellipse(s6,vec2(0.0),vec2(.43,.21),.14)*fap1Band(h,48.0,90.0)*.56;
  float a7=fap1Ellipse(s7,vec2(0.0),vec2(.39,.25),-.18)*fap1Band(h,31.0,67.0)*.61;
  float a8=fap1Ellipse(s8,vec2(0.0),vec2(.50,.19),.24)*fap1Band(h,72.0,108.0)*.46;

  float systems=a1+a2+a3+a4+a5+a6+a7+a8;
  float clearPocket=smoothstep(.78,.91,fbm(radial*10.8+vec3(-t*.13,t*.20,t*.17)));
  float pocketGate=1.0-.58*clearPocket;

  float mass=(low+mid+high+systems)*pocketGate;
  float ice=(high*.90+mid*.32+a4*.94+a8*.97+a2*.30+a6*.34)*pocketGate;
  float precip=(low*.12+mid*.08+a1*.16+a3*.22+a5*.18+a7*.16)*pocketGate;
  return vec3(clamp(mass,0.0,1.25),clamp(ice,0.0,1.05),clamp(precip,0.0,.70));
}
`;

  next=next.replace('vec3 densityAt(vec3 p){',helper+'\nvec3 densityAt(vec3 p){');
  next=next.replace(
    'vec3 fap1=fap1OrganizedWeather(radial,h,lat,lon);float clearCorridor=fap1ClearCorridor(lat,lon);float background=globalCloudSupport(radial,h,lat,lon)*(1.0-.94*clearCorridor);float iceMass=background*smoothstep(66.0,96.0,h)*.78+fap1.y,precipMass=background*(1.0-smoothstep(58.0,82.0,h))*.10+fap1.z,mass=background+fap1.x;',
    'vec3 fap1=fap1OrganizedWeather(radial,h,lat,lon);vec3 fap1Coverage=fap1OrbitalCoverage(radial,h,lat,lon);float clearCorridor=fap1ClearCorridor(lat,lon);float background=globalCloudSupport(radial,h,lat,lon)*(1.0-.94*clearCorridor);float iceMass=background*smoothstep(66.0,96.0,h)*.78+fap1.y+fap1Coverage.y,precipMass=background*(1.0-smoothstep(58.0,82.0,h))*.10+fap1.z+fap1Coverage.z,mass=background+fap1.x+fap1Coverage.x;'
  );

  const changed=next!==source;
  if(changed)patched++;else rejected++;
  return next;
}

WebGL2RenderingContext.prototype.shaderSource=function(shader,source){
  return previousShaderSource.call(this,shader,patchOrbitalCoverage(source));
};

Object.defineProperty(window,'__AUDRALIA_FAP1_ORBITAL_COVERAGE__',{value:Object.freeze({
  policyId:POLICY_ID,
  targetVisibleOrbitalCoverage:.70,
  lowLayer:true,
  midLayer:true,
  highLayer:true,
  additionalSynopticSystems:8,
  clearPocketsPreserved:true,
  uniformFogFallback:false,
  geographyMutation:false,
  cameraMutation:false,
  navigationMutation:false,
  getRuntimeEvidence:()=>Object.freeze({patchedCloudShaders:patched,rejectedCloudShaders:rejected})
}),writable:false,configurable:false});
