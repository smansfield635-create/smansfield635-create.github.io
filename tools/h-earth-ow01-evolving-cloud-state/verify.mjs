import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const contractPath=path.resolve(here,'../../control-plane/h-earth/ow01-evolving-cloud-state-v1/cloud-state-contract.v1.json');
const contract=JSON.parse(fs.readFileSync(contractPath,'utf8'));
const EPS=1e-10;
const fail=(name,detail)=>{throw new Error(`${name}:${detail}`);};
const near=(a,b,tol=EPS)=>Math.abs(a-b)<=tol;
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const wrapLon=lon=>((lon+180)%360+360)%360-180;
const degToRad=deg=>deg*Math.PI/180;
const radToDeg=rad=>rad*180/Math.PI;

const expectedGenera=['Ci','Cc','Cs','Ac','As','Ns','Sc','St','Cu','Cb'];
const actualGenera=Object.keys(contract.genera).sort();
if(JSON.stringify(actualGenera)!==JSON.stringify([...expectedGenera].sort()))fail('GENUS_SET',actualGenera.join(','));

for(const genus of expectedGenera){
  const profile=contract.genera[genus];
  if(!Array.isArray(profile.baseKm)||profile.baseKm.length!==2)fail('BASE_RANGE',genus);
  if(!Array.isArray(profile.topKm)||profile.topKm.length!==2)fail('TOP_RANGE',genus);
  if(!(profile.baseKm[0]>=0&&profile.baseKm[1]>=profile.baseKm[0]))fail('BASE_RANGE_ORDER',genus);
  if(!(profile.topKm[0]>profile.baseKm[0]&&profile.topKm[1]>profile.baseKm[1]))fail('TOP_ABOVE_BASE',genus);
  if(!contract.declaredTransitions[genus])fail('TRANSITION_ENTRY_MISSING',genus);
}

const required=new Set(contract.cloudSystemState.requiredFields);
const forbidden=new Set(contract.cloudSystemState.forbiddenFields);
for(const key of forbidden)if(required.has(key))fail('CAMERA_FIELD_IN_REQUIRED_STATE',key);
for(const key of forbidden){
  if(/camera|screen|view/i.test(key)===false)fail('FORBIDDEN_FIELD_CLASS',key);
}

const phases=contract.cloudSystemState.lifecyclePhases;
if(JSON.stringify(phases)!==JSON.stringify(['FORMING','GROWING','MATURE','DECAYING','DISSIPATED']))fail('LIFECYCLE_ORDER',phases.join(','));

for(const [genus,targets] of Object.entries(contract.declaredTransitions)){
  if(!contract.genera[genus])fail('UNKNOWN_TRANSITION_SOURCE',genus);
  for(const target of targets){
    if(target!=='DISSIPATED'&&!contract.genera[target])fail('UNKNOWN_TRANSITION_TARGET',`${genus}->${target}`);
  }
}

const radius=contract.advection.earthLikeRadiusKmForVisualWeatherKinematics;
if(!near(radius,contract.planetaryReferenceFrame.planetRadiusAuthoringUnits,1e-12))fail('RADIUS_BINDING',`${radius}`);

function advect(state,dtHours){
  const latRad=degToRad(state.latitudeDeg);
  const dLat=state.windNorthKmH*dtHours/radius;
  const denom=radius*Math.max(Math.cos(latRad),0.15);
  const dLon=state.windEastKmH*dtHours/denom;
  return {
    ...state,
    latitudeDeg:clamp(state.latitudeDeg+radToDeg(dLat),-89,89),
    longitudeDeg:wrapLon(state.longitudeDeg+radToDeg(dLon))
  };
}

const fixture={
  id:'CLOUD_FIXTURE_001',seed:45125661,genus:'Cu',longitudeDeg:0,latitudeDeg:30,
  baseAltitudeKm:1.1,topAltitudeKm:3.8,majorRadiusKm:85,minorRadiusKm:52,orientationDeg:18,
  windEastKmH:44,windNorthKmH:7,shearEastKmHPerKm:3,shearNorthKmHPerKm:-1.5,
  density:.62,iceFraction:.05,precipitationPotential:.18,support:.7,
  lifecyclePhase:'GROWING',lifecycleProgress:.42
};
for(const field of contract.cloudSystemState.requiredFields)if(!(field in fixture))fail('FIXTURE_REQUIRED_FIELD',field);
for(const field of contract.cloudSystemState.forbiddenFields)if(field in fixture)fail('FIXTURE_FORBIDDEN_FIELD',field);

const one=advect(fixture,6.25),two=advect(fixture,6.25);
if(JSON.stringify(one)!==JSON.stringify(two))fail('DETERMINISTIC_ADVECTION','repeat mismatch');
if(!(one.longitudeDeg>fixture.longitudeDeg))fail('EASTWARD_ADVECTION','longitude did not increase');
if(!(one.latitudeDeg>fixture.latitudeDeg))fail('NORTHWARD_ADVECTION','latitude did not increase');
if(Math.abs(one.longitudeDeg-fixture.longitudeDeg)>10||Math.abs(one.latitudeDeg-fixture.latitudeDeg)>10)fail('ADVECTION_TELEPORT','step too large');

const dateline=advect({...fixture,longitudeDeg:179.9,windEastKmH:250},8);
if(!(dateline.longitudeDeg>=-180&&dateline.longitudeDeg<180))fail('LONGITUDE_WRAP',`${dateline.longitudeDeg}`);
const polar=advect({...fixture,latitudeDeg:88.9,windNorthKmH:500},24);
if(!(polar.latitudeDeg<=89&&polar.latitudeDeg>=-89))fail('LATITUDE_BOUND',`${polar.latitudeDeg}`);

if(contract.densityAuthority.oneDensityTruth!==true)fail('ONE_DENSITY_TRUTH','false');
if(!String(contract.densityAuthority.orbitalObservation).includes('SAME_DENSITY'))fail('ORBITAL_DENSITY_BINDING','missing');
if(!String(contract.densityAuthority.localObservation).includes('SAME_DENSITY'))fail('LOCAL_DENSITY_BINDING','missing');
if(contract.authorityLaw.cameraMayCreateWeather!==false||contract.authorityLaw.cameraMayChangeCloudIdentity!==false)fail('CAMERA_AUTHORITY','not prohibited');
if(contract.constructionAuthority.rendererMutationAuthorized!==false||contract.constructionAuthority.geographyMutationAuthorized!==false)fail('PRODUCT_BOUNDARY','unexpected authority');

const receipt={
  schema:'H_EARTH_AUDRALIA_CANONICAL_EVOLVING_CLOUD_STATE_VERIFICATION_RECEIPT_v1',
  pass:true,
  genusCount:expectedGenera.length,
  lifecyclePhases:phases,
  deterministicFixture:{
    source:{longitudeDeg:fixture.longitudeDeg,latitudeDeg:fixture.latitudeDeg},
    after6_25Hours:{longitudeDeg:one.longitudeDeg,latitudeDeg:one.latitudeDeg}
  },
  datelineWrappedLongitudeDeg:dateline.longitudeDeg,
  polarBoundedLatitudeDeg:polar.latitudeDeg,
  oneDensityTruth:true,
  cameraIndependent:true,
  productMutationAuthorized:false
};
console.log(JSON.stringify(receipt,null,2));
