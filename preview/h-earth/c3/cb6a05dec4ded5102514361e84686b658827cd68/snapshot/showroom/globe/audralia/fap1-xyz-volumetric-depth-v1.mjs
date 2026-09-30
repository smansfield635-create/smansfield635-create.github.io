const POLICY_ID='AUDRALIA_FAP1_XYZ_VOLUMETRIC_DEPTH_v2';
const previousShaderSource=WebGL2RenderingContext.prototype.shaderSource;
let patched=0;
let rejected=0;
let organizedBandPatched=0;
let organizedConvolutionPatched=0;

function patchXYZVolume(source){
  if(typeof source!=='string'||!source.includes('globalCloudSupport')||!source.includes('vec3 densityAt(vec3 p)')||!source.includes('uSysA[8]'))return source;
  let next=source;

  // Give the final composed cloud field a materially deeper physical shell.
  next=next.replace(
    'const float PI=3.141592653589793,R=6200.0,OUTER=6308.0,OCCLUDER=6227.0;',
    'const float PI=3.141592653589793,R=6200.0,OUTER=6405.0,OCCLUDER=6205.0;'
  );

  // FAP1 organized weather is injected before this wrapper executes. Deepen its
  // own altitude-band primitive, rather than only deepening the legacy system.
  const originalFap1Band='float fap1Band(float h,float lo,float hi){return smoothstep(lo,lo+5.0,h)*(1.0-smoothstep(hi-7.0,hi,h));}';
  const deepFap1Band=`float fap1Band(float h,float lo,float hi){
  float nativeSpan=max(hi-lo,1.0);
  float center=(lo+hi)*.5;
  float depthScale=nativeSpan>55.0?2.10:(nativeSpan>35.0?1.92:1.74);
  float lower=max(10.0,center-nativeSpan*.5*depthScale);
  float upper=min(198.0,center+nativeSpan*.5*depthScale);
  float feather=max(7.0,(upper-lower)*.115);
  return smoothstep(lower,lower+feather,h)*(1.0-smoothstep(upper-feather,upper,h));
}`;
  if(next.includes(originalFap1Band)){
    next=next.replace(originalFap1Band,deepFap1Band);
    organizedBandPatched++;
  }

  const helper=`
float fap1DepthPocket(vec3 p,float t){
  vec3 q=(p-CENTER)/R;
  float broad=fbm(q*23.0+vec3(t*.23,-t*.15,t*.18));
  float secondary=fbm(q*43.0+vec3(-t*.11,t*.19,-t*.14));
  float fine=fbm(q*77.0+vec3(t*.07,-t*.09,t*.12));
  return smoothstep(.35,.72,broad*.64+secondary*.27+fine*.09);
}
float fap1DepthScaleForGenus(float genus){
  if(genus>8.5)return 2.85;
  if(genus>7.5)return 2.45;
  if(genus>4.5)return 2.22;
  if(genus>2.5)return 2.02;
  return 1.82;
}
`;
  next=next.replace('vec3 densityAt(vec3 p){',helper+'\nvec3 densityAt(vec3 p){');

  // Deepen the legacy/background altitude families too, while reducing density
  // because the integrated ray path is now much longer.
  next=next.replace(
    'float low=smoothstep(30.0,35.0,h)*(1.0-smoothstep(54.0,65.0,h));float middle=smoothstep(44.0,51.0,h)*(1.0-smoothstep(75.0,86.0,h));float high=smoothstep(67.0,76.0,h)*(1.0-smoothstep(99.0,108.0,h));',
    'float low=smoothstep(12.0,24.0,h)*(1.0-smoothstep(88.0,104.0,h));float middle=smoothstep(26.0,40.0,h)*(1.0-smoothstep(126.0,145.0,h));float high=smoothstep(49.0,65.0,h)*(1.0-smoothstep(171.0,196.0,h));'
  );
  next=next.replace(
    'return clamp(climate*broken*clearSlot*.38,0.0,.34);',
    'return clamp(climate*broken*clearSlot*.205,0.0,.215);'
  );

  // Expand every inherited OW01-style cloud system in true Z according to genus.
  next=next.replace(
    'if(h<a.z||h>a.w)continue;float z=(h-a.z)/max(a.w-a.z,.001),dlon=wrapPi(lon-a.y)',
    `float nativeLo=a.z,nativeHi=a.w,nativeSpan=max(nativeHi-nativeLo,1.0),nativeCenter=(nativeLo+nativeHi)*.5;
    float zScale=fap1DepthScaleForGenus(b.w);
    float extraBelow=b.w>7.5?10.0:4.0;
    float extraAbove=b.w>8.5?28.0:(b.w>7.5?18.0:9.0);
    float volumeLo=max(10.0,nativeCenter-nativeSpan*.5*zScale-extraBelow);
    float volumeHi=min(198.0,nativeCenter+nativeSpan*.5*zScale+extraAbove);
    if(h<volumeLo||h>volumeHi)continue;
    float z=(h-volumeLo)/max(volumeHi-volumeLo,.001),dlon=wrapPi(lon-a.y)`
  );

  next=next.replace(
    'float fs=clamp(sqrt(max(b.x*b.y,1.0))/240.0,1.0,9.0),shape=morphology(b.w,xy,z,c.y,uTimeHours,fs),den=shape*c.x;',
    `float fs=clamp(sqrt(max(b.x*b.y,1.0))/240.0,1.0,9.0),shape=morphology(b.w,xy,z,c.y,uTimeHours,fs);
    float pocket=fap1DepthPocket(p,uTimeHours*.0065);
    float interiorMod=mix(.38,1.0,pocket);
    float verticalMass=smoothstep(.015,.17,z)*(1.0-smoothstep(.91,1.0,z));
    float densityScale=b.w>8.5?.47:(b.w>7.5?.51:(b.w<2.5?.43:.53));
    float den=shape*c.x*densityScale*interiorMod*verticalMass;`
  );

  // The final FAP1 organization is vertically convolved. This is the key v2
  // correction: polar decks, fronts, cyclone and convection now occupy nearby Z
  // slices rather than living only in their native shallow bands.
  const originalFap1Sample='vec3 fap1=fap1OrganizedWeather(radial,h,lat,lon);float clearCorridor=fap1ClearCorridor(lat,lon);';
  const deepFap1Sample=`vec3 fap1Center=fap1OrganizedWeather(radial,h,lat,lon);
  vec3 fap1Down1=fap1OrganizedWeather(radial,max(10.0,h-18.0),lat,lon);
  vec3 fap1Down2=fap1OrganizedWeather(radial,max(10.0,h-36.0),lat,lon);
  vec3 fap1Up1=fap1OrganizedWeather(radial,min(198.0,h+20.0),lat,lon);
  vec3 fap1Up2=fap1OrganizedWeather(radial,min(198.0,h+42.0),lat,lon);
  vec3 fap1=(fap1Center*.46+fap1Down1*.17+fap1Down2*.08+fap1Up1*.18+fap1Up2*.11)*.76;
  float clearCorridor=fap1ClearCorridor(lat,lon);`;
  if(next.includes(originalFap1Sample)){
    next=next.replace(originalFap1Sample,deepFap1Sample);
    organizedConvolutionPatched++;
  }

  // Camera-local ray marching throughout the full deep cloud volume.
  next=next.replace(
    'float t0=max(max(0.0,outerHit.x),uNearCutoff),t1=outerHit.y;',
    'float eyeAltitude=length(uEye-CENTER)-R;float insideCloudVolume=step(10.0,eyeAltitude)*(1.0-step(198.0,eyeAltitude));float exteriorT0=max(max(0.0,outerHit.x),uNearCutoff);float interiorT0=max(0.0,outerHit.x);float t0=mix(exteriorT0,interiorT0,insideCloudVolume),t1=outerHit.y;'
  );

  // Let depth, not brute extinction, create the opaque appearance.
  next=next.replace('float a=1.0-exp(-den*stepLen*.021);','float a=1.0-exp(-den*stepLen*.0118);');
  next=next.replace('float extinction=mix(.020,.032,smoothstep(.12,.74,den)); float a=1.0-exp(-den*stepLen*extinction);','float extinction=mix(.0105,.0175,smoothstep(.10,.70,den)); float a=1.0-exp(-den*stepLen*extinction);');

  const changed=next!==source;
  if(changed)patched++;else rejected++;
  return next;
}

WebGL2RenderingContext.prototype.shaderSource=function(shader,source){
  return previousShaderSource.call(this,shader,patchXYZVolume(source));
};

Object.defineProperty(window,'__AUDRALIA_FAP1_XYZ_VOLUMETRIC_DEPTH__',{value:Object.freeze({
  policyId:POLICY_ID,
  acceptedWorldPreserved:true,
  geographyMutation:false,
  oceanMutation:false,
  cameraSemanticMutation:false,
  weatherIdentityMutation:false,
  method:Object.freeze({
    finalFAP1BandsDeepened:true,
    finalFAP1DensityVerticallyConvolved:true,
    physicalCloudShellExpanded:true,
    altitudeFamiliesDeepened:true,
    genusSpecificVerticalDepth:true,
    deepConvectionMaximumZDepth:true,
    perSampleDensityReduced:true,
    cameraLocalInteriorRayMarch:true,
    threeDimensionalClearPockets:true,
    opacityCompensationReduced:true
  }),
  target:Object.freeze({
    principle:'PRESERVE_XY_WEATHER_ORGANIZATION_ADD_UNMISTAKABLE_TRUE_Z_OCCUPATION',
    orbitalAppearanceReference:'FAP1_POLAR_WEATHER_v3',
    interiorExperience:'SUSTAINED_MULTI_SLICE_ENVELOPMENT_WITH_INTERNAL_CLEAR_POCKETS'
  }),
  getRuntimeEvidence:()=>Object.freeze({patchedCloudShaders:patched,rejectedCloudShaders:rejected,organizedBandPatched,organizedConvolutionPatched})
}),writable:false,configurable:false});