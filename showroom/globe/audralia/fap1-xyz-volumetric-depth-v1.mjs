const POLICY_ID='AUDRALIA_FAP1_XYZ_VOLUMETRIC_DEPTH_v1';
const previousShaderSource=WebGL2RenderingContext.prototype.shaderSource;
let patched=0;
let rejected=0;

function patchXYZVolume(source){
  if(typeof source!=='string'||!source.includes('globalCloudSupport')||!source.includes('vec3 densityAt(vec3 p)')||!source.includes('uSysA[8]'))return source;
  let next=source;

  // Expand the physical atmospheric volume. The previous exterior cloud shell
  // ended at 108 world units above the radius; that produced strong integrated
  // opacity from above but a visibly shallow slab during descent.
  next=next.replace(
    'const float PI=3.141592653589793,R=6200.0,OUTER=6308.0,OCCLUDER=6227.0;',
    'const float PI=3.141592653589793,R=6200.0,OUTER=6360.0,OCCLUDER=6208.0;'
  );

  const helper=`
float fap1DepthBand(float h,float lo,float hi){
  float span=max(hi-lo,1.0);
  float lower=max(14.0,lo-span*.34);
  float upper=min(156.0,hi+span*.72);
  float feather=max(6.0,span*.18);
  return smoothstep(lower,lower+feather,h)*(1.0-smoothstep(upper-feather,upper,h));
}
float fap1DepthPocket(vec3 p,float t){
  vec3 q=(p-CENTER)/R;
  float broad=fbm(q*27.0+vec3(t*.26,-t*.17,t*.20));
  float secondary=fbm(q*49.0+vec3(-t*.13,t*.21,-t*.16));
  float fine=fbm(q*83.0+vec3(t*.08,-t*.11,t*.15));
  return smoothstep(.38,.72,broad*.62+secondary*.27+fine*.11);
}
float fap1DepthScaleForGenus(float genus){
  if(genus>8.5)return 2.55; // Cb: true deep convection
  if(genus>7.5)return 2.20; // Cu: materially deeper vertical body
  if(genus>4.5)return 2.05; // Ns/Sc/St: substantial weather decks
  if(genus>2.5)return 1.90; // Ac/As
  return 1.72;              // Ci/Cc/Cs: broad but optically lighter
}
`;
  next=next.replace('vec3 densityAt(vec3 p){',helper+'\nvec3 densityAt(vec3 p){');

  // Deepen the background altitude families themselves instead of making the
  // old shallow layers more opaque.
  next=next.replace(
    'float low=smoothstep(30.0,35.0,h)*(1.0-smoothstep(54.0,65.0,h));float middle=smoothstep(44.0,51.0,h)*(1.0-smoothstep(75.0,86.0,h));float high=smoothstep(67.0,76.0,h)*(1.0-smoothstep(99.0,108.0,h));',
    'float low=smoothstep(17.0,27.0,h)*(1.0-smoothstep(73.0,86.0,h));float middle=smoothstep(31.0,42.0,h)*(1.0-smoothstep(106.0,121.0,h));float high=smoothstep(55.0,68.0,h)*(1.0-smoothstep(137.0,154.0,h));'
  );

  // Rebalance the background density down because its ray path is now much
  // longer. Preserve orbital integrated opacity without cotton-ball compensation.
  next=next.replace(
    'return clamp(climate*broken*clearSlot*.38,0.0,.34);',
    'return clamp(climate*broken*clearSlot*.235,0.0,.235);'
  );

  // Expand every existing cloud-system Z interval around its own center, with
  // physically different depth multipliers by cloud family. This preserves X/Y
  // organization while adding genuine Z occupation.
  next=next.replace(
    'if(h<a.z||h>a.w)continue;float z=(h-a.z)/max(a.w-a.z,.001),dlon=wrapPi(lon-a.y)',
    `float nativeLo=a.z,nativeHi=a.w,nativeSpan=max(nativeHi-nativeLo,1.0),nativeCenter=(nativeLo+nativeHi)*.5;
    float zScale=fap1DepthScaleForGenus(b.w);
    float extraBelow=b.w>7.5?8.0:3.0;
    float extraAbove=b.w>8.5?18.0:(b.w>7.5?12.0:6.0);
    float volumeLo=max(14.0,nativeCenter-nativeSpan*.5*zScale-extraBelow);
    float volumeHi=min(156.0,nativeCenter+nativeSpan*.5*zScale+extraAbove);
    if(h<volumeLo||h>volumeHi)continue;
    float z=(h-volumeLo)/max(volumeHi-volumeLo,.001),dlon=wrapPi(lon-a.y)`
  );

  // Moderate per-sample density now that each system occupies a larger distance.
  // Interior low-frequency structure produces real pockets of visibility inside
  // the volume rather than holes through a thin sheet.
  next=next.replace(
    'float fs=clamp(sqrt(max(b.x*b.y,1.0))/240.0,1.0,9.0),shape=morphology(b.w,xy,z,c.y,uTimeHours,fs),den=shape*c.x;',
    `float fs=clamp(sqrt(max(b.x*b.y,1.0))/240.0,1.0,9.0),shape=morphology(b.w,xy,z,c.y,uTimeHours,fs);
    float pocket=fap1DepthPocket(p,uTimeHours*.0065);
    float interiorMod=mix(.44,1.0,pocket);
    float verticalMass=mix(.86,1.0,smoothstep(.10,.34,z))*(1.0-.12*smoothstep(.82,1.0,z));
    float densityScale=b.w>8.5?.54:(b.w>7.5?.58:(b.w<2.5?.50:.61));
    float den=shape*c.x*densityScale*interiorMod*verticalMass;`
  );

  // When the observer is physically inside the expanded cloud shell, ray march
  // from the camera itself. Outside the cloud shell, retain the existing near
  // cutoff behavior. This is what allows genuine envelopment during descent.
  next=next.replace(
    'float t0=max(max(0.0,outerHit.x),uNearCutoff),t1=outerHit.y;',
    'float eyeAltitude=length(uEye-CENTER)-R;float insideCloudVolume=step(14.0,eyeAltitude)*(1.0-step(156.0,eyeAltitude));float exteriorT0=max(max(0.0,outerHit.x),uNearCutoff);float interiorT0=max(0.0,outerHit.x);float t0=mix(exteriorT0,interiorT0,insideCloudVolume),t1=outerHit.y;'
  );

  // Slightly soften extinction per sample because volume depth, not brute density,
  // now supplies the optical thickness. A longer path still reaches convincing
  // opacity while nearby cloud edges remain less cotton-ball-like.
  next=next.replace(
    'float a=1.0-exp(-den*stepLen*.021);',
    'float a=1.0-exp(-den*stepLen*.0145);'
  );

  const changed=next!==source;
  if(changed)patched++; else rejected++;
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
    physicalCloudShellExpanded:true,
    altitudeFamiliesDeepened:true,
    genusSpecificVerticalDepth:true,
    deepConvectionMaximumZDepth:true,
    perSampleDensityReduced:true,
    orbitalIntegratedOpacityTargetPreserved:true,
    cameraLocalInteriorRayMarch:true,
    threeDimensionalClearPockets:true,
    opacityCompensationReduced:true
  }),
  target:Object.freeze({
    principle:'PRESERVE_XY_WEATHER_ORGANIZATION_ADD_TRUE_Z_OCCUPATION',
    cloudOpacityNotCloudDepth:true,
    orbitalAppearanceReference:'FAP1_POLAR_WEATHER_v3',
    interiorExperience:'SUSTAINED_ENVELOPMENT_WITH_INTERNAL_CLEAR_POCKETS'
  }),
  getRuntimeEvidence:()=>Object.freeze({patchedCloudShaders:patched,rejectedCloudShaders:rejected})
}),writable:false,configurable:false});
