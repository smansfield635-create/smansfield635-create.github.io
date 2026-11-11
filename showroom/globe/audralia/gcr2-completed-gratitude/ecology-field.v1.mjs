/**
 * Continental-scale biome, terrain relief and climate candidate.
 * Geological regions + 15 named drainage segments + three lakes come from rev5.
 * This is a physically plausible, deterministic, NON-authoritative interpretation
 * of the geographic sources. It does not copy/pixel-enlarge H-Earth vegetation.
 */
import { sampleGratitudeHydrology } from './hydrology-graph.v1.mjs';
import { continentalKmToGeodetic } from './metric-geography-bridge.v1.mjs';
export const ECOLOGY_SOURCE=Object.freeze({
  schema:'AUDRALIA_GCR2_CONTINENTAL_ECOLOGY_CANDIDATE_v1',
  geographicSourceBlob:'50991dd777ccd015fd8a6d8eae7b4d02b4a8450c',
  latitudeBaselineDegrees:30,
  geologyStages:9,
  climateInputs:Object.freeze(['LATITUDE','ALTITUDE','MARINE_EXPOSURE','RAIN_SHADOW','DRAINAGE','LANDFORM']),
  status:'NONPRODUCTION_MODEL_NOT_SCIENTIFICALLY_VALIDATED'
});
export const GRATITUDE_PROVINCES=Object.freeze([
  Object.freeze({id:'ANCIENT_WESTERN_SHIELD',x:-1080,z:-1080,scaleX:690,scaleZ:520}),
  Object.freeze({id:'GRATITUDE_OROGEN',x:80,z:-520,scaleX:690,scaleZ:240}),
  Object.freeze({id:'WESTERN_RIFT_COAST',x:-1420,z:-760,scaleX:420,scaleZ:700}),
  Object.freeze({id:'GREAT_INTERIOR_BASIN',x:-80,z:-1240,scaleX:920,scaleZ:620}),
  Object.freeze({id:'EASTERN_GLACIAL_HIGHLANDS',x:900,z:-850,scaleX:520,scaleZ:500}),
  Object.freeze({id:'SOUTHERN_DELTA_LOWLANDS',x:240,z:-1700,scaleX:720,scaleZ:370}),
  Object.freeze({id:'RAIN_SHADOW_STEPPE',x:760,z:-1260,scaleX:560,scaleZ:520}),
  Object.freeze({id:'FORESTED_WINDWARD_FOOTHILLS',x:-120,z:-720,scaleX:520,scaleZ:390})
]);
const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a||1));return t*t*(3-2*t);};
const gaussian=(x,z,cx,cz,rx,rz)=>Math.exp(-1.55*(((x-cx)/rx)**2+((z-cz)/rz)**2));
const mix=(a,b,t)=>a+(b-a)*t;
const mix3=(a,b,t)=>a.map((v,i)=>mix(v,b[i],t));
const noise=(x,z)=>.5+.25*Math.sin(.021*x+.017*z)*Math.cos(.013*x-.029*z)+
  .125*Math.sin(.044*x-.032*z+.7)+.125*Math.cos(.035*x+.041*z+1.8);
const COLORS=Object.freeze({
  forest:[.092,.278,.149],woodland:[.194,.333,.169],grassland:[.345,.404,.222],
  steppe:[.420,.370,.222],alpine:[.312,.343,.293],rock:[.362,.337,.296],
  wetland:[.109,.301,.242],freshwater:[.075,.265,.349],beach:[.579,.529,.367]
});
export function provinceSignals(xKm,zKm){
  if(!Number.isFinite(xKm)||!Number.isFinite(zKm))throw new RangeError('PROVINCE_POINT_NONFINITE');
  const out={};
  for(const p of GRATITUDE_PROVINCES)out[p.id]=gaussian(xKm,zKm,p.x,p.z,p.scaleX,p.scaleZ);
  return Object.freeze(out);
}
export function sampleContinentalReliefKm(xKm,zKm,coastalDistanceKm=100){
  const p=provinceSignals(xKm,zKm),coast=clamp(coastalDistanceKm,0,1400);
  const orogen=p.GRATITUDE_OROGEN,shield=p.ANCIENT_WESTERN_SHIELD,
    east=p.EASTERN_GLACIAL_HIGHLANDS,basin=p.GREAT_INTERIOR_BASIN,
    delta=p.SOUTHERN_DELTA_LOWLANDS,rift=p.WESTERN_RIFT_COAST;
  const ridge=1.65*gaussian(xKm,zKm,-180,-520,280,88)+
    2.34*gaussian(xKm,zKm,120,-570,295,104)+
    1.55*gaussian(xKm,zKm,500,-660,270,116)+
    .88*gaussian(xKm,zKm,750,-790,330,145);
  const h=sampleGratitudeHydrology(xKm,zKm);
  const relief=.056+.00042*Math.min(coast,530)+.78*shield+
    1.10*orogen+ridge+1.44*east-.16*rift-.16*basin-.14*delta+
    .07*Math.sin(xKm*.015+zKm*.009)*Math.sin(zKm*.018-xKm*.004);
  const downcut=.22*h.riverRenderIntensity+.34*h.lakeRenderIntensity;
  return Math.max(.006,Math.min(5.2,relief-downcut));
}
export function sampleContinentalEcology(xKm,zKm,coastalDistanceKm=100){
  if(![xKm,zKm,coastalDistanceKm].every(Number.isFinite))throw new RangeError('ECOLOGY_POINT_NONFINITE');
  const p=provinceSignals(xKm,zKm),h=sampleGratitudeHydrology(xKm,zKm);
  const altitudeKm=sampleContinentalReliefKm(xKm,zKm,coastalDistanceKm);
  const lat=continentalKmToGeodetic(xKm,zKm).latitudeDegrees;
  const marine=Math.exp(-Math.max(0,coastalDistanceKm)/390);
  const wetWindward=p.FORESTED_WINDWARD_FOOTHILLS*.42+p.GRATITUDE_OROGEN*.22+
    p.ANCIENT_WESTERN_SHIELD*.11;
  const steppe=p.RAIN_SHADOW_STEPPE*.62+
    .19*p.GREAT_INTERIOR_BASIN;
  const riparian=clamp(Math.max(h.riverRenderIntensity,h.lakeRenderIntensity*.93));
  const moisture=clamp(.32+.31*marine+wetWindward+.46*riparian-steppe+
    .065*(noise(xKm,zKm)-.5)-.12*smooth(1.1,3.5,altitudeKm));
  const thermal=clamp(.73-.013*Math.abs(lat-30)-.19*altitudeKm+
    .11*marine-.05*p.EASTERN_GLACIAL_HIGHLANDS);
  const treeline=smooth(2.0,3.85,altitudeKm);
  const shore=smooth(0,19,Math.max(0,coastalDistanceKm));
  const meadow=clamp((.68-moisture)*1.35)*shore*(1-treeline);
  const forest=clamp(smooth(.34,.78,moisture)*(1-treeline)*smooth(.1,.4,thermal))*shore;
  const wetland=clamp(h.wetlandSuitability*.87*(1-treeline));
  const dry=clamp(smooth(.32,.67,steppe)*shore*(1-h.riverRenderIntensity));
  const alpine=clamp(treeline*.76+.29*smooth(3.0,4.8,altitudeKm));
  const mixForest=clamp(forest*.84+.14*noise(xKm,zKm));
  let color=mix3(COLORS.grassland,COLORS.woodland,clamp(.54+moisture*.28));
  color=mix3(color,COLORS.forest,mixForest);
  color=mix3(color,COLORS.steppe,clamp(dry*.9+meadow*.20));
  color=mix3(color,COLORS.alpine,alpine*.8);
  color=mix3(color,COLORS.rock,smooth(2.6,4.35,altitudeKm)*.51);
  color=mix3(color,COLORS.wetland,wetland*.75);
  const riverWater=clamp(Math.max(h.riverRenderIntensity,h.lakeRenderIntensity));
  color=mix3(color,COLORS.freshwater,riverWater*.98);
  color=mix3(color,COLORS.beach,1-smooth(3,23,coastalDistanceKm));
  const variation=clamp(.90+.20*noise(xKm,zKm),.85,1.08);
  color=color.map(q=>clamp(q*variation,0,1));
  let biome='GRASSLAND';
  const options=[['FOREST',forest],['WOODLAND',forest*.65+.18*shore],
    ['STEPPE',dry],['ALPINE',alpine],['WETLAND',wetland],['OPEN_WATER',riverWater*.95],
    ['BEACH',1-smooth(3,23,coastalDistanceKm)]];
  options.sort((a,b)=>b[1]-a[1]);
  if(options[0][1]>.43)biome=options[0][0];
  return Object.freeze({
    xKm,zKm,latitudeDegrees:lat,altitudeKm,
    marineInfluence:marine,moisture,thermal,forestSuitability:forest,
    steppeSuitability:dry,wetlandSuitability:wetland,
    riverRenderIntensity:h.riverRenderIntensity,lakeRenderIntensity:h.lakeRenderIntensity,
    easternConfluenceCandidateIntensity:h.easternConfluenceCandidateIntensity,
    dominantBiome:biome,color:Object.freeze(color),
    localGrassRootCountClaimed:0,
    physicalRiverWidthClaimed:false,
    sourceGeographyStatus:'REV5_REGION_PRESERVED_EASTERN_OUTLET_DERIVED_CANDIDATE'
  });
}
