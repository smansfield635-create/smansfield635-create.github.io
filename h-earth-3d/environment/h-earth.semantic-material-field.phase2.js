import{sampleHEarthTerrainField,getHEarthCanonicalShorelineZ}from'../terrain/h-earth.terrain-field.js';
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v)),smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a));return t*t*(3-2*t)},bell=(v,c,r)=>{const d=Math.abs(v-c)/r;if(d>=1)return 0;const q=1-d*d;return q*q};
export const H_EARTH_PHASE2_SEMANTIC_MATERIAL_CONTRACT_ID='H_EARTH_PHASE2_SEMANTIC_MATERIAL_CLASSIFIER_v1';
export const H_EARTH_PHASE2_MATERIAL_FAMILIES=Object.freeze(['WET_SHORELINE_SAND','DRY_SAND_BACKSHORE','LOWLAND_SOIL_GROUNDCOVER','DRAINAGE_SEDIMENT_MOIST_GROUND','FOOTHILL_SOIL_STONE','EXPOSED_MOUNTAIN_ROCK']);
const palettes={
 WET_SHORELINE_SAND:[0.34,0.29,0.20],DRY_SAND_BACKSHORE:[0.58,0.46,0.27],LOWLAND_SOIL_GROUNDCOVER:[0.24,0.31,0.17],
 DRAINAGE_SEDIMENT_MOIST_GROUND:[0.18,0.23,0.18],FOOTHILL_SOIL_STONE:[0.31,0.30,0.24],EXPOSED_MOUNTAIN_ROCK:[0.38,0.40,0.39]};
const props={WET_SHORELINE_SAND:[0.72,0.06,0.78],DRY_SAND_BACKSHORE:[0.86,0.04,0.18],LOWLAND_SOIL_GROUNDCOVER:[0.78,0.05,0.32],DRAINAGE_SEDIMENT_MOIST_GROUND:[0.82,0.04,0.70],FOOTHILL_SOIL_STONE:[0.70,0.08,0.22],EXPOSED_MOUNTAIN_ROCK:[0.61,0.12,0.10]};
const segDist=(x,z,x0,z0,x1,z1)=>{const dx=x1-x0,dz=z1-z0,t=clamp(((x-x0)*dx+(z-z0)*dz)/(dx*dx+dz*dz)),px=x0+dx*t,pz=z0+dz*t;return Math.hypot(x-px,z-pz)};
export function sampleHEarthPhase2SemanticMaterial(x,z){const t=sampleHEarthTerrainField(x,z);if(t?.valid!==true)return{valid:false};const inland=getHEarthCanonicalShorelineZ(x)-z;
 const wet=(1-smooth(5,15,inland))*smooth(-4,2,inland),dry=smooth(4,12,inland)*(1-smooth(34,54,inland));
 const drainage=Math.max(1-smooth(10,34,segDist(x,z,18,-192,-18,-174)),1-smooth(12,38,segDist(x,z,-18,-174,-58,-122)))*smooth(45,80,inland);
 const mountain=smooth(0.28,0.58,t.slope)*smooth(14,28,t.elevation)+smooth(30,48,t.elevation)*0.72;
 const foothill=bell(x,-28,150)*bell(z,-194,96)*smooth(6,16,t.elevation)*(1-smooth(0.48,0.72,t.slope));
 const lowland=smooth(38,70,inland)*(1-smooth(18,34,t.elevation))*(1-mountain*.8);
 let raw={WET_SHORELINE_SAND:wet,DRY_SAND_BACKSHORE:dry,LOWLAND_SOIL_GROUNDCOVER:lowland,DRAINAGE_SEDIMENT_MOIST_GROUND:drainage,FOOTHILL_SOIL_STONE:foothill,EXPOSED_MOUNTAIN_ROCK:mountain};
 const sum=Object.values(raw).reduce((a,b)=>a+b,0)||1;const weights=Object.fromEntries(Object.entries(raw).map(([k,v])=>[k,v/sum]));const entries=Object.entries(weights).sort((a,b)=>b[1]-a[1]);const family=entries[0][0];
 const rgb=[0,1,2].map(i=>entries.reduce((s,[k,w])=>s+palettes[k][i]*w,0));const [roughness,reflectance,wetness]=[0,1,2].map(i=>entries.reduce((s,[k,w])=>s+props[k][i]*w,0));
 return{valid:true,contractId:H_EARTH_PHASE2_SEMANTIC_MATERIAL_CONTRACT_ID,x,z,elevation:t.elevation,slope:t.slope,curvature:t.curvature,inlandDistance:inland,family,weights,rgb,roughness,reflectance,wetness};}
