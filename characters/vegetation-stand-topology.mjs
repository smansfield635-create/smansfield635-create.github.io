import {GRATITUDE_DEVELOPMENT_FRAME} from './gratitude-geography.adapter.mjs';
import {sampleCanonicalVegetationEcology} from './vegetation-ecology.mjs';

const freeze=(value,seen=new WeakSet())=>{
  if(value===null||typeof value!=='object'||Object.isFrozen(value)||seen.has(value))return value;
  seen.add(value);
  for(const nested of Object.values(value))freeze(nested,seen);
  return Object.freeze(value);
};
const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
const quantize=(value,digits=6)=>Number(Number(value).toFixed(digits));
const hash32=value=>{
  let n=value>>>0;
  n=(n^61)^(n>>>16);
  n=Math.imul(n,9);
  n=n^(n>>>4);
  n=Math.imul(n,0x27d4eb2d);
  return (n^(n>>>15))>>>0;
};
const rand=(seed,k=0)=>hash32(seed^Math.imul(k+1,0x9e3779b1))/4294967295;

export const STAND_CLASSES=freeze([
  'DENSE_WOODLAND',
  'GROVE',
  'COASTAL_SCRUB',
  'WET_MARGIN_RIPARIAN',
  'EXPOSED_UPLAND',
  'SPARSE_TRANSITION',
  'ECOLOGICAL_OPEN'
]);

export const STAND_PROFILES=freeze({
  DENSE_WOODLAND:freeze({canopyDensity:.94,edgeWidth:24,transitionWidth:34,understoryProfile:'FOREST_INTERIOR'}),
  GROVE:freeze({canopyDensity:.78,edgeWidth:22,transitionWidth:32,understoryProfile:'WOODLAND_GROVE'}),
  COASTAL_SCRUB:freeze({canopyDensity:.50,edgeWidth:18,transitionWidth:30,understoryProfile:'COASTAL_SCRUB'}),
  WET_MARGIN_RIPARIAN:freeze({canopyDensity:.54,edgeWidth:18,transitionWidth:28,understoryProfile:'RIPARIAN'}),
  EXPOSED_UPLAND:freeze({canopyDensity:.35,edgeWidth:16,transitionWidth:28,understoryProfile:'EXPOSED_UPLAND'}),
  SPARSE_TRANSITION:freeze({canopyDensity:.28,edgeWidth:16,transitionWidth:30,understoryProfile:'SPARSE_TRANSITION'}),
  ECOLOGICAL_OPEN:freeze({canopyDensity:0,edgeWidth:14,transitionWidth:30,understoryProfile:'OPEN_GROUND'})
});

const SEED_GRID=freeze({columns:7,rows:5,insetFraction:.055,jitterFraction:.28,seed:0x61d3a55d});

export const STAND_TOPOLOGY_CONTRACT=freeze({
  schema:'MIRRORLAND_STAND_TOPOLOGY_CONTRACT_v1',
  operationId:'MIRRORLAND_STAND_TOPOLOGY_EDGE_ECOLOGY_NEGATIVE_SPACE_20260906_002',
  stage:'STAND_TOPOLOGY',
  frameAuthority:'characters/gratitude-geography.adapter.mjs#GRATITUDE_DEVELOPMENT_FRAME',
  ecologyAuthority:'characters/vegetation-ecology.mjs#sampleCanonicalVegetationEcology',
  spatialModel:'DETERMINISTIC_ECOLOGY_CLASSIFIED_VORONOI_STANDS',
  topologyPersistent:true,
  topologyDeviceInvariant:true,
  topologyCameraInvariant:true,
  seedGrid:SEED_GRID,
  classes:STAND_CLASSES
});

function classifyStand(ecology){
  if(ecology?.valid!==true)return 'ECOLOGICAL_OPEN';
  const drainage=ecology.hydrology?.drainageClass;
  const forest=Number(ecology.biome?.forestWeight)||0;
  const wet=Math.max(Number(ecology.hydrology?.riverWeight)||0,Number(ecology.hydrology?.lakeWeight)||0);
  const shore=Math.max(0,Number(ecology.shorelineDistance)||0);
  const material=ecology.materialProfile;
  const slopeClass=ecology.slopeClass;
  if(drainage!=='LAND')return 'ECOLOGICAL_OPEN';
  if(wet>=.16&&shore<=240&&['LEVEL','GENTLE','MODERATE'].includes(slopeClass))return 'WET_MARGIN_RIPARIAN';
  if(shore<=82&&['COASTAL_SOIL','LOWLAND_SOIL','FOREST_SOIL'].includes(material))return 'COASTAL_SCRUB';
  if(material==='STONE_AND_SPARSE_SOIL'||slopeClass==='STEEP_NONCLIMBING'||(slopeClass==='MODERATE'&&forest<.42))return 'EXPOSED_UPLAND';
  if(forest>=.64)return 'DENSE_WOODLAND';
  if(forest>=.42)return 'GROVE';
  if(forest<.14)return 'ECOLOGICAL_OPEN';
  if(forest<.30)return 'SPARSE_TRANSITION';
  return 'GROVE';
}

let cachedSeeds=null;

function createSeeds(){
  const envelope=GRATITUDE_DEVELOPMENT_FRAME.envelope;
  const width=envelope.xMaximum-envelope.xMinimum;
  const depth=envelope.zMaximum-envelope.zMinimum;
  const insetX=width*SEED_GRID.insetFraction;
  const insetZ=depth*SEED_GRID.insetFraction;
  const usableWidth=width-insetX*2;
  const usableDepth=depth-insetZ*2;
  const seeds=[];
  for(let row=0;row<SEED_GRID.rows;row++){
    for(let column=0;column<SEED_GRID.columns;column++){
      const seed=hash32(SEED_GRID.seed^Math.imul(row+1,73856093)^Math.imul(column+1,19349663));
      const jitterX=(rand(seed,1)-.5)*2*SEED_GRID.jitterFraction;
      const jitterZ=(rand(seed,2)-.5)*2*SEED_GRID.jitterFraction;
      const u=clamp((column+.5+jitterX)/SEED_GRID.columns,0,1);
      const v=clamp((row+.5+jitterZ)/SEED_GRID.rows,0,1);
      const x=envelope.xMinimum+insetX+u*usableWidth;
      const z=envelope.zMinimum+insetZ+v*usableDepth;
      const ecology=sampleCanonicalVegetationEcology(x,z);
      const standClass=classifyStand(ecology);
      seeds.push(freeze({
        id:`stand-r${row}-c${column}`,
        row,column,seed,
        world:freeze({x:quantize(x),z:quantize(z)}),
        standClass,
        profile:STAND_PROFILES[standClass],
        source:freeze({
          forestWeight:quantize(ecology?.biome?.forestWeight||0,12),
          biomeClass:ecology?.biome?.class||null,
          drainageClass:ecology?.hydrology?.drainageClass||null,
          riverWeight:quantize(ecology?.hydrology?.riverWeight||0,12),
          lakeWeight:quantize(ecology?.hydrology?.lakeWeight||0,12),
          shorelineDistance:quantize(ecology?.shorelineDistance||0,6),
          materialProfile:ecology?.materialProfile||null,
          slopeClass:ecology?.slopeClass||null
        })
      }));
    }
  }
  return freeze(seeds);
}

export function getStandTopologySeeds(){
  if(!cachedSeeds)cachedSeeds=createSeeds();
  return cachedSeeds;
}

export function resolveStandAt(worldX,worldZ){
  const seeds=getStandTopologySeeds();
  let first=null,second=null;
  let first2=Infinity,second2=Infinity;
  for(const stand of seeds){
    const dx=worldX-stand.world.x,dz=worldZ-stand.world.z;
    const d2=dx*dx+dz*dz;
    if(d2<first2){
      second=first;second2=first2;
      first=stand;first2=d2;
    }else if(d2<second2){
      second=stand;second2=d2;
    }
  }
  if(!first)throw new Error('STAND_TOPOLOGY_EMPTY');
  const nearestDistance=Math.sqrt(first2);
  const secondDistance=Number.isFinite(second2)?Math.sqrt(second2):nearestDistance;
  const boundaryDistance=Math.max(0,(secondDistance-nearestDistance)*.5);
  return freeze({
    standId:first.id,
    standClass:first.standClass,
    profile:first.profile,
    standSeed:first.world,
    nearestDistance:quantize(nearestDistance,6),
    secondStandId:second?.id||null,
    secondDistance:quantize(secondDistance,6),
    boundaryDistance:quantize(boundaryDistance,6),
    topologyAuthority:STAND_TOPOLOGY_CONTRACT.schema
  });
}
