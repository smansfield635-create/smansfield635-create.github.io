import {
  H_EARTH_FAP1_ALTITUDE_FAMILIES,
  getHEarthFAP1WeatherRegimes
} from '../../../../h-earth-3d/environment/h-earth.fap1-weather-state.candidate-a.js';

const PLANET_RADIUS=6200;
const DEG_TO_RAD=Math.PI/180;
const FAP1_STATE_TIME_SCALE=.0065;
const freeze=value=>Object.freeze(value);
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));

const CLASS_PROFILE=freeze({
  HIGH_ICE:freeze({family:'HIGH',genus:'Cs',aspect:.38,density:.46,ice:.98,precip:.02,orientationDeg:16,shearE:10,shearN:2,seed:.71}),
  MID_FRONTAL:freeze({family:'MID',genus:'As',aspect:.34,density:.58,ice:.38,precip:.24,orientationDeg:-18,shearE:6,shearN:1,seed:.59}),
  LOW_CUMULIFORM:freeze({family:'LOW',genus:'Cu',aspect:.58,density:.66,ice:.04,precip:.16,orientationDeg:8,shearE:3,shearN:1,seed:.31}),
  DEEP_CONVECTION:freeze({family:'DEEP',genus:'Cb',aspect:.52,density:.78,ice:.56,precip:.88,orientationDeg:22,shearE:8,shearN:3,seed:.47}),
  CYCLONE:freeze({family:'DEEP',genus:'Cb',aspect:.86,density:.82,ice:.64,precip:.94,orientationDeg:-10,shearE:11,shearN:4,seed:.93})
});

function radiusKm(radiusDeg){return PLANET_RADIUS*radiusDeg*DEG_TO_RAD;}
function deterministicSeed(id,fallback){let h=2166136261;for(const ch of id){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}return ((h>>>0)%10000)/10000*.72+fallback*.28;}

export function buildFAP1GPUWeatherPacket({canonicalTimeHours=0}={}){
  const stateTimeHours=canonicalTimeHours*FAP1_STATE_TIME_SCALE;
  const regimes=getHEarthFAP1WeatherRegimes({canonicalTimeHours:stateTimeHours});
  const systems=[];
  const clearRegions=[];
  for(const regime of regimes){
    if(regime.weatherClass==='CLEAR'){
      clearRegions.push(freeze({
        id:regime.id,
        latitudeDeg:regime.center.latitudeDeg,
        longitudeDeg:regime.center.longitudeDeg,
        radiusDeg:regime.radiusDeg,
        suppression:clamp(1-regime.occupancy,0,1)
      }));
      continue;
    }
    const profile=CLASS_PROFILE[regime.weatherClass];
    if(!profile)continue;
    const family=H_EARTH_FAP1_ALTITUDE_FAMILIES[profile.family];
    const major=radiusKm(regime.radiusDeg);
    const minor=major*profile.aspect;
    const occupancy=clamp(regime.occupancy,0,1);
    const span=Math.max(.1,family.topKm-family.baseKm);
    systems.push(freeze({
      id:regime.id,
      weatherClass:regime.weatherClass,
      genus:profile.genus,
      latitudeDeg:regime.center.latitudeDeg,
      longitudeDeg:regime.center.longitudeDeg,
      baseKm:family.baseKm,
      topKm:family.topKm,
      majorKm:major,
      minorKm:minor,
      orientationDeg:profile.orientationDeg,
      density:profile.density*occupancy,
      seed:deterministicSeed(regime.id,profile.seed),
      ice:profile.ice,
      precip:profile.precip,
      support:occupancy,
      windE:regime.wind.eastKmH,
      windN:regime.wind.northKmH,
      shearShiftE:profile.shearE*span,
      shearShiftN:profile.shearN*span,
      cyclone:regime.cyclone??null,
      sourceContract:'H_EARTH_FAP1_WEATHER_STATE_CANDIDATE_A_v3'
    }));
  }
  return freeze({
    schema:'H_EARTH_FAP1_GPU_WEATHER_PACKET_GA_v1',
    canonicalTimeHours,
    stateTimeHours,
    systems:freeze(systems),
    clearRegions:freeze(clearRegions),
    meteorologicalAuthority:'FAP1_ONLY',
    rendererMayCreateWeather:false,
    noiseRole:'SUBGRID_EXPRESSION_ONLY'
  });
}

export function evaluateFAP1GPUWeatherPacket(packet){
  const issues=[];
  if(packet?.meteorologicalAuthority!=='FAP1_ONLY')issues.push('AUTHORITY_NOT_FAP1_ONLY');
  if(packet?.rendererMayCreateWeather!==false)issues.push('RENDERER_WEATHER_CREATION_ALLOWED');
  if(!Array.isArray(packet?.systems)||packet.systems.length<5)issues.push('FAP1_SYSTEM_DESCRIPTOR_SET_INCOMPLETE');
  if(!Array.isArray(packet?.clearRegions)||packet.clearRegions.length<1)issues.push('FAP1_CLEAR_DESCRIPTOR_MISSING');
  for(const system of packet?.systems??[]){
    if(!system.id||!Number.isFinite(system.latitudeDeg)||!Number.isFinite(system.longitudeDeg))issues.push(`INVALID_DESCRIPTOR:${system?.id??'UNKNOWN'}`);
    if(!(system.topKm>system.baseKm))issues.push(`INVALID_VERTICAL_INTERVAL:${system.id}`);
    if(!(system.density>0))issues.push(`INVALID_DENSITY:${system.id}`);
  }
  return freeze({eligible:issues.length===0,status:issues.length?'FAP1_GPU_PACKET_FAIL':'FAP1_GPU_PACKET_PASS',issues:freeze(issues)});
}
