const POLICY_ID='AUDRALIA_FAP1_ORBITAL_COVERAGE_LIFT_v1';
const previousShaderSource=WebGL2RenderingContext.prototype.shaderSource;
let patched=0;
let rejected=0;

const TARGET='vec3 fap1=fap1OrganizedWeather(radial,h,lat,lon);float clearCorridor=fap1ClearCorridor(lat,lon);float background=globalCloudSupport(radial,h,lat,lon)*(1.0-.94*clearCorridor);float iceMass=background*smoothstep(66.0,96.0,h)*.78+fap1.y,precipMass=background*(1.0-smoothstep(58.0,82.0,h))*.10+fap1.z,mass=background+fap1.x;';
const REPLACEMENT='vec3 fap1=fap1OrganizedWeather(radial,h,lat,lon);float clearCorridor=fap1ClearCorridor(lat,lon);float background=globalCloudSupport(radial,h,lat,lon)*(1.0-.94*clearCorridor);float coverageT=uTimeHours*.0065;float coverageWave=.5+.5*sin(lon*2.17+sin(lat*4.31+coverageT*.73)*1.37+coverageT*.31);float coverageCross=.5+.5*sin(lon*4.73-lat*2.61-coverageT*.23+sin(lon*1.29+lat*.71)*.83);float coverageMask=smoothstep(.34,.58,coverageWave*.64+coverageCross*.36);float coverageLatitude=1.0-smoothstep(1.22,1.49,abs(lat));float coverageVertical=smoothstep(32.0,43.0,h)*(1.0-smoothstep(91.0,106.0,h));float coverageLift=coverageMask*coverageLatitude*coverageVertical*(1.0-.94*clearCorridor);float iceMass=background*smoothstep(66.0,96.0,h)*.78+fap1.y+coverageLift*smoothstep(67.0,94.0,h)*.17,precipMass=background*(1.0-smoothstep(58.0,82.0,h))*.10+fap1.z+coverageLift*(1.0-smoothstep(66.0,82.0,h))*.04,mass=background+fap1.x+coverageLift*.30;';
const EXTINCTION_TARGET='float fap1LocalPocket=fap1InteriorPocket(p,uTimeHours*.0065);float fap1InteriorBoost=1.0+fap1InteriorPresence*(1.35-1.05*fap1LocalPocket);den*=fap1InteriorBoost;float extinction=mix(.020,.039,smoothstep(.10,.72,den));';
const EXTINCTION_REPLACEMENT='float fap1LocalPocket=fap1InteriorPocket(p,uTimeHours*.0065);float fap1InteriorBoost=1.0+fap1InteriorPresence*(1.35-1.05*fap1LocalPocket);den*=fap1InteriorBoost;float extinction=mix(.022,.052,smoothstep(.065,.64,den));';

function patchCoverage(source){
  if(typeof source!=='string'||!source.includes('fap1OrganizedWeather')||!source.includes(TARGET))return source;
  let next=source.replace(TARGET,REPLACEMENT);
  if(next.includes(EXTINCTION_TARGET))next=next.replace(EXTINCTION_TARGET,EXTINCTION_REPLACEMENT);
  if(next!==source)patched++;else rejected++;
  return next;
}

WebGL2RenderingContext.prototype.shaderSource=function(shader,source){
  return previousShaderSource.call(this,shader,patchCoverage(source));
};

Object.defineProperty(globalThis,'__AUDRALIA_FAP1_ORBITAL_COVERAGE_LIFT__',{value:Object.freeze({
  policyId:POLICY_ID,
  volumetricFieldOnly:true,
  screenOverlay:false,
  uniformHaze:false,
  preservesClearCorridor:true,
  preservesCamera:true,
  preservesNavigation:true,
  targetVisibleOrbitalCoverage:.70,
  getRuntimeEvidence:()=>Object.freeze({patchedCloudShaders:patched,rejectedCloudShaders:rejected})
}),writable:false,configurable:false});
