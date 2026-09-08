import {sampleCanonicalVegetationEcology} from './vegetation-ecology.mjs';
import {getCanonicalVegetationPopulation} from './vegetation-population.mjs';
import {resolveVegetationEnvironment} from './vegetation-edge-ecology.mjs';
import {sampleGratitudeWorld} from './gratitude-geography.adapter.mjs';

const freeze=(value,seen=new WeakSet())=>{if(value===null||typeof value!=='object'||ArrayBuffer.isView(value)||Object.isFrozen(value)||seen.has(value))return value;seen.add(value);for(const nested of Object.values(value))freeze(nested,seen);return Object.freeze(value);};
const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
const quantize=(value,digits=6)=>Number(Number(value).toFixed(digits));
const hash32=value=>{let n=value>>>0;n=(n^61)^(n>>>16);n=Math.imul(n,9);n=n^(n>>>4);n=Math.imul(n,0x27d4eb2d);return (n^(n>>>15))>>>0;};
const rand=(seed,k=0)=>hash32(seed^Math.imul(k+1,0x9e3779b1))/4294967295;
const TAU=Math.PI*2;

export const UNDERSTORY_CLASSES=freeze(['GRASS_SEDGE','LOW_SHRUB','SAPLING_YOUNG_GROWTH','REED_WET_MARGIN','DEAD_SPARSE_GROUND','FOREST_FLOOR_CLUSTER']);
const CLASS_SALT=freeze({GRASS_SEDGE:11,LOW_SHRUB:23,SAPLING_YOUNG_GROWTH:37,REED_WET_MARGIN:53,DEAD_SPARSE_GROUND:71,FOREST_FLOOR_CLUSTER:89});
const GRID=freeze({columns:144,rows:106,insetFraction:.025,jitterFraction:.30,seed:1689746977});
const REED_CLUSTER_OFFSETS=freeze([[0,0],[4.2,2.8],[-3.8,3.6]]);
const HYDROLOGY_PRESENTATION=freeze({shorelineScale:220,shorelineContribution:.70,reedEligibilityMinimum:.18});
const HYDROLOGY_CORE=freeze({gridStep:22,wetParticipationFloor:.10,satelliteRadius:8,maxSatellites:4});

export const V4_UNDERSTORY_CONTRACT=freeze({
  schema:'MIRRORLAND_VEGETATION_V4_UNDERSTORY_RUNTIME_CONTRACT_v1',
  operationId:'MIRRORLAND_POST_GEN1996_CANOPY_HYDROLOGY_RELATION_REPAIR_20260908_001',
  stage:'CONTINUOUS_CANONICAL_WETNESS_RESPONSE_ORDERING_REPAIR',
  predecessorBoundary:'GEN1996_PARTIAL_SUCCESS_CANOPY_IMPROVED_HYDROLOGY_STILL_INVERTED',
  targetBoundary:'ALL_FOUR_V2_ENVIRONMENT_RISK_FAMILIES_CLEAR',
  ecologySource:'characters/vegetation-ecology.mjs#sampleCanonicalVegetationEcology',
  canonicalWetnessSource:'characters/gratitude-geography.adapter.mjs#sampleGratitudeWorld',
  treePopulationSource:'characters/vegetation-population.mjs#getCanonicalVegetationPopulation',
  standEdgeSource:'characters/vegetation-edge-ecology.mjs#resolveVegetationEnvironment',
  geographyAuthorityCreated:false,
  populationIdentityDeviceInvariant:true,
  populationIdentityCameraInvariant:true,
  canonicalIdentityInputs:freeze(['ROW','COLUMN','FROZEN_SEED','CANONICAL_ECOLOGY','CANONICAL_WETNESS','STAND_ID','SPATIAL_ZONE']),
  prohibitedIdentityInputs:freeze(['DEVICE_CLASS','VIEWPORT_CLASS','CAMERA_STATE','REDUCED_MOTION','LOD','DESTINATION_ID','REPRESENTATIVE_STATE_ID']),
  grid:GRID,
  compactPresentationSampling:.96,
  v3CameraContextReused:true,
  openingShrubSaplingAllowed:false,
  groundClosureRepair:true,
  hydrologyDifferentiationRepair:true,
  continuousWetnessResponseOrdering:true,
  lowWetnessEcologyPreserved:true,
  wetMarginColonySampling:true,
  hydrologyPresentation:HYDROLOGY_PRESENTATION,
  hydrologyCoreLattice:HYDROLOGY_CORE,
  hydrologyCoreReinforcement:true,
  hydrologyCoreDistributedCoverage:true,
  hydrologyCoreRedundantClustering:false,
  v2BinsUsedAsProductControl:false,
  v2ResultCoordinatesUsedAsProductControl:false
});

function canonicalWetnessAt(x,z){
  const source=sampleGratitudeWorld(x,z).source;
  const river=Number(source.hydrology?.riverWeight)||0;
  const lake=Number(source.hydrology?.lakeWeight)||0;
  const shore=Math.max(0,Number(source.shorelineDistance)||0);
  const shorelineSignal=clamp(1-shore/HYDROLOGY_PRESENTATION.shorelineScale,0,1)*HYDROLOGY_PRESENTATION.shorelineContribution;
  return {source,wetness:clamp(Math.max(river,lake,shorelineSignal),0,1)};
}
function effectiveWetness(ecology){
  const river=Number(ecology.hydrology?.riverWeight)||0;
  const lake=Number(ecology.hydrology?.lakeWeight)||0;
  const wet=Math.max(river,lake);
  const shore=Math.max(0,Number(ecology.shorelineDistance)||0);
  const shorelineSignal=clamp(1-shore/HYDROLOGY_PRESENTATION.shorelineScale,0,1)*HYDROLOGY_PRESENTATION.shorelineContribution;
  return clamp(Math.max(wet,shorelineSignal),0,1);
}
function smoothWetParticipation(wetness){
  const w=clamp(wetness,0,1);
  const smooth=w*w*(3-2*w);
  return clamp(HYDROLOGY_CORE.wetParticipationFloor+(1-HYDROLOGY_CORE.wetParticipationFloor)*smooth,0,1);
}
function baseClassDensity(type,ecology){
  const forest=Number(ecology.biome?.forestWeight)||0,river=Number(ecology.hydrology?.riverWeight)||0,lake=Number(ecology.hydrology?.lakeWeight)||0,wet=Math.max(river,lake),effectiveWet=effectiveWetness(ecology),drainage=ecology.hydrology?.drainageClass,slopeClass=ecology.slopeClass,curvatureClass=ecology.curvatureClass,material=ecology.materialProfile,biomeClass=ecology.biome?.class,shore=Number(ecology.shorelineDistance);
  switch(type){
    case 'GRASS_SEDGE':if(drainage!=='LAND'||shore<5||slopeClass==='STEEP_NONCLIMBING')return 0;return clamp(.34+.30*forest+.50*effectiveWet+.20*(['LOWLAND_SOIL','COASTAL_SOIL','FOREST_SOIL'].includes(material)?1:0)-.08*(slopeClass==='MODERATE'?1:0),0,.99);
    case 'LOW_SHRUB':if(drainage!=='LAND'||shore<12||forest<.14||slopeClass==='STEEP_NONCLIMBING')return 0;return clamp(.12+.52*forest+.12*(curvatureClass==='CONCAVE'?1:0),0,.78);
    case 'SAPLING_YOUNG_GROWTH':if(drainage!=='LAND'||shore<18||forest<.28||!['LEVEL','GENTLE','MODERATE'].includes(slopeClass))return 0;return clamp(.05+.34*forest+.09*(biomeClass==='FOREST'?1:0),0,.50);
    case 'REED_WET_MARGIN':if(drainage!=='LAND'||shore<2||effectiveWet<HYDROLOGY_PRESENTATION.reedEligibilityMinimum||!['LEVEL','GENTLE','MODERATE'].includes(slopeClass))return 0;return clamp(.12+1.52*effectiveWet,0,.99);
    case 'DEAD_SPARSE_GROUND':if(drainage!=='LAND'||shore<10||!['STONE_AND_SPARSE_SOIL','COASTAL_SOIL'].includes(material)||forest>=.36)return 0;return clamp(.16+.34*(material==='STONE_AND_SPARSE_SOIL'?1:0)+.18*(slopeClass==='MODERATE'?1:0),0,.62);
    case 'FOREST_FLOOR_CLUSTER':if(drainage!=='LAND'||shore<12||forest<.20||!(material==='FOREST_SOIL'||['WOODLAND','FOREST'].includes(biomeClass)))return 0;return clamp(.30+.72*forest+.12*(curvatureClass==='CONCAVE'?1:0),0,.99);
    default:return 0;
  }
}
function zoneMultiplier(type,environment){const z=environment.spatialZone;if(z==='OPENING'){if(type==='LOW_SHRUB'||type==='SAPLING_YOUNG_GROWTH')return 0;if(type==='GRASS_SEDGE')return 1.88;if(type==='REED_WET_MARGIN')return 1.62;if(type==='DEAD_SPARSE_GROUND')return 1.10;return .12;}if(z==='EDGE'){if(type==='LOW_SHRUB')return 1.82;if(type==='SAPLING_YOUNG_GROWTH')return 1.90;if(type==='GRASS_SEDGE')return 1.34;if(type==='REED_WET_MARGIN')return 1.52;if(type==='FOREST_FLOOR_CLUSTER')return .78;return 1.10;}if(z==='TRANSITION'){if(type==='LOW_SHRUB')return 1.42;if(type==='SAPLING_YOUNG_GROWTH')return 1.34;if(type==='GRASS_SEDGE')return 1.68;if(type==='REED_WET_MARGIN')return 1.60;if(type==='FOREST_FLOOR_CLUSTER')return .90;return 1.12;}if(type==='LOW_SHRUB')return .48;if(type==='SAPLING_YOUNG_GROWTH')return .36;if(type==='GRASS_SEDGE')return .58;if(type==='FOREST_FLOOR_CLUSTER')return 1.72;if(type==='DEAD_SPARSE_GROUND')return .66;return 1.16;}
function standMultiplier(type,environment){switch(environment.standClass){case 'DENSE_WOODLAND':return type==='FOREST_FLOOR_CLUSTER'?1.48:(type==='GRASS_SEDGE'?.66:1);case 'GROVE':return type==='FOREST_FLOOR_CLUSTER'?1.36:1;case 'COASTAL_SCRUB':return type==='LOW_SHRUB'?1.28:(type==='GRASS_SEDGE'?1.24:1);case 'WET_MARGIN_RIPARIAN':return type==='REED_WET_MARGIN'?2.72:(type==='GRASS_SEDGE'?1.44:(type==='LOW_SHRUB'?.72:1));case 'EXPOSED_UPLAND':return type==='DEAD_SPARSE_GROUND'?1.42:(type==='FOREST_FLOOR_CLUSTER'?.42:.94);case 'SPARSE_TRANSITION':return type==='GRASS_SEDGE'?1.36:(type==='FOREST_FLOOR_CLUSTER'?.62:1);case 'ECOLOGICAL_OPEN':return type==='GRASS_SEDGE'?1.52:(type==='LOW_SHRUB'||type==='SAPLING_YOUNG_GROWTH'?0:.88);default:return 1;}}
function classDensity(type,ecology,environment){const base=baseClassDensity(type,ecology);return base<=0?0:clamp(base*zoneMultiplier(type,environment)*standMultiplier(type,environment),0,.99);}
function nearestTreeWithin(x,z,trees,minimum){const min2=minimum*minimum;for(const tree of trees){const dx=x-tree.world.x,dz=z-tree.world.z;if(dx*dx+dz*dz<min2)return true;}return false;}
function coverageFloor(type,ecology,environment){
  const wet=effectiveWetness(ecology);
  if(type==='REED_WET_MARGIN')return clamp(.10+.84*wet,.10,.94);
  if(type==='FOREST_FLOOR_CLUSTER'&&environment.spatialZone==='INTERIOR'&&['DENSE_WOODLAND','GROVE'].includes(environment.standClass))return .88;
  if(type==='GRASS_SEDGE'&&environment.spatialZone==='OPENING')return .82;
  if(type==='GRASS_SEDGE'&&environment.spatialZone==='TRANSITION')return .76;
  if(type==='GRASS_SEDGE'&&environment.spatialZone==='EDGE')return .64;
  if(type==='DEAD_SPARSE_GROUND')return .54;
  if(['LOW_SHRUB','SAPLING_YOUNG_GROWTH'].includes(type)&&environment.spatialZone==='EDGE')return .54;
  return .38;
}
function selectClass(seed,ecology,environment,trees){
  const eligible=[];for(const type of UNDERSTORY_CLASSES){const density=classDensity(type,ecology,environment);if(density<=0)continue;if(type==='SAPLING_YOUNG_GROWTH'&&nearestTreeWithin(ecology.world.x,ecology.world.z,trees,5))continue;eligible.push({type,density});}
  if(!eligible.length)return null;
  const reed=eligible.find(candidate=>candidate.type==='REED_WET_MARGIN');
  if(reed){const wet=effectiveWetness(ecology),reedOpportunity=clamp(Math.max(coverageFloor('REED_WET_MARGIN',ecology,environment),reed.density)*smoothWetParticipation(wet),0,.995);if(rand(seed,CLASS_SALT.REED_WET_MARGIN+211)<=reedOpportunity)return {type:'REED_WET_MARGIN',density:reed.density,coverageProbability:reedOpportunity};}
  const preferredIndex=hash32(seed^0x6f17c2a9)%eligible.length,preferredType=eligible[preferredIndex].type;let selected=null,selectedDensity=0,selectedScore=-1;
  for(const candidate of eligible){const densityScore=candidate.density*(.88+.12*rand(seed,CLASS_SALT[candidate.type])),preference=candidate.type===preferredType?.54:0,edgeYoungBonus=environment.spatialZone==='EDGE'&&['LOW_SHRUB','SAPLING_YOUNG_GROWTH'].includes(candidate.type)?.64:0,transitionGroundBonus=environment.spatialZone==='TRANSITION'&&['GRASS_SEDGE','LOW_SHRUB','SAPLING_YOUNG_GROWTH'].includes(candidate.type)?.40:0,openingGroundBonus=environment.spatialZone==='OPENING'&&candidate.type==='GRASS_SEDGE'?.82:0,interiorFloorBonus=environment.spatialZone==='INTERIOR'&&candidate.type==='FOREST_FLOOR_CLUSTER'?.98:0,score=densityScore+preference+edgeYoungBonus+transitionGroundBonus+openingGroundBonus+interiorFloorBonus;if(score>selectedScore){selected=candidate.type;selectedDensity=candidate.density;selectedScore=score;}}
  const probability=Math.max(selectedDensity,coverageFloor(selected,ecology,environment));if(rand(seed,CLASS_SALT[selected]+101)>probability)return null;return {type:selected,density:selectedDensity,coverageProbability:probability};
}
function scaleFor(type,seed){switch(type){case 'GRASS_SEDGE':return 1.05+1.05*rand(seed,151);case 'LOW_SHRUB':return .88+.92*rand(seed,151);case 'SAPLING_YOUNG_GROWTH':return 1.20+1.35*rand(seed,151);case 'REED_WET_MARGIN':return 1.18+1.20*rand(seed,151);case 'DEAD_SPARSE_GROUND':return .82+1.22*rand(seed,151);case 'FOREST_FLOOR_CLUSTER':return 1.85+1.55*rand(seed,151);default:return 1;}}
let cachedPopulation=null;
function createUnderstoryPopulation(){
  const trees=getCanonicalVegetationPopulation(),envelope=trees.envelope,width=envelope.xMaximum-envelope.xMinimum,depth=envelope.zMaximum-envelope.zMinimum,insetX=width*GRID.insetFraction,insetZ=depth*GRID.insetFraction,usableWidth=width-insetX*2,usableDepth=depth-insetZ*2,instances=[],classCounts=Object.fromEntries(UNDERSTORY_CLASSES.map(type=>[type,0])),zoneCounts={INTERIOR:0,EDGE:0,TRANSITION:0,OPENING:0},standClassCounts={};
  const append=(type,selected,ecology,environment,seed,row,column,suffix='')=>{const instance=freeze({id:`understory-r${row}-c${column}-${type}${suffix}`,lattice:freeze({row,column,seed}),type,world:freeze({x:quantize(ecology.world.x),y:quantize(ecology.world.y),z:quantize(ecology.world.z)}),yaw:quantize(TAU*rand(seed,181+suffix.length),12),scale:quantize(scaleFor(type,seed),12),density:quantize(selected.density,12),coverageProbability:quantize(selected.coverageProbability,12),forestWeight:quantize(ecology.biome?.forestWeight||0,12),riverWeight:quantize(ecology.hydrology?.riverWeight||0,12),lakeWeight:quantize(ecology.hydrology?.lakeWeight||0,12),drainageClass:ecology.hydrology?.drainageClass,biomeClass:ecology.biome?.class,materialProfile:ecology.materialProfile,slopeClass:ecology.slopeClass,curvatureClass:ecology.curvatureClass,shorelineDistance:quantize(ecology.shorelineDistance,6),standId:environment.standId,standClass:environment.standClass,spatialZone:environment.spatialZone,compositionTerritoryId:environment.compositionTerritoryId,compositionBand:environment.compositionBand,edgeEcologyAuthority:environment.edgeEcologyAuthority,presentationSample:quantize(rand(seed,197+suffix.length),12),geographyAuthority:ecology.geographyAuthority,sourceContractId:ecology.sourceContractId});instances.push(instance);classCounts[type]++;zoneCounts[environment.spatialZone]++;standClassCounts[environment.standClass]=(standClassCounts[environment.standClass]||0)+1;};
  for(let row=0;row<GRID.rows;row++)for(let column=0;column<GRID.columns;column++){
    const seed=hash32(Math.imul(row+1,73856093)^Math.imul(column+1,19349663)^GRID.seed),jitterX=(rand(seed,1)-.5)*2*GRID.jitterFraction,jitterZ=(rand(seed,2)-.5)*2*GRID.jitterFraction,u=clamp((column+.5+jitterX)/GRID.columns,0,1),v=clamp((row+.5+jitterZ)/GRID.rows,0,1),worldX=envelope.xMinimum+insetX+u*usableWidth,worldZ=envelope.zMinimum+insetZ+v*usableDepth,ecology=sampleCanonicalVegetationEcology(worldX,worldZ);if(ecology?.valid!==true)continue;const environment=resolveVegetationEnvironment(ecology.world.x,ecology.world.z),selected=selectClass(seed,ecology,environment,trees.instances);if(!selected)continue;const type=selected.type;
    append(type,selected,ecology,environment,seed,row,column);
    if(type==='REED_WET_MARGIN')for(let i=1;i<REED_CLUSTER_OFFSETS.length;i++){const [dx,dz]=REED_CLUSTER_OFFSETS[i],satellite=sampleCanonicalVegetationEcology(ecology.world.x+dx,ecology.world.z+dz);if(satellite?.valid!==true)continue;if(satellite.hydrology?.drainageClass!=='LAND'||satellite.shorelineDistance<2||effectiveWetness(satellite)<HYDROLOGY_PRESENTATION.reedEligibilityMinimum)continue;const satelliteEnvironment=resolveVegetationEnvironment(satellite.world.x,satellite.world.z);append(type,selected,satellite,satelliteEnvironment,hash32(seed^Math.imul(i+1,0x45d9f3b)),row,column,`-colony${i}`);}
  }
  let hydroRow=0;
  for(let z=envelope.zMinimum+HYDROLOGY_CORE.gridStep/2;z<=envelope.zMaximum-HYDROLOGY_CORE.gridStep/2;z+=HYDROLOGY_CORE.gridStep,hydroRow++){
    let hydroColumn=0;
    for(let x=envelope.xMinimum+HYDROLOGY_CORE.gridStep/2;x<=envelope.xMaximum-HYDROLOGY_CORE.gridStep/2;x+=HYDROLOGY_CORE.gridStep,hydroColumn++){
      const {source,wetness}=canonicalWetnessAt(x,z);
      if(source.hydrology?.drainageClass!=='LAND')continue;
      const ecology=sampleCanonicalVegetationEcology(x,z);
      if(ecology?.valid!==true||ecology.hydrology?.drainageClass!=='LAND'||ecology.shorelineDistance<2||!['LEVEL','GENTLE','MODERATE'].includes(ecology.slopeClass))continue;
      const baseSeed=hash32(Math.imul(hydroRow+1,83492791)^Math.imul(hydroColumn+1,2971215073)^0x4d83a61f);
      const participation=smoothWetParticipation(wetness);
      if(rand(baseSeed,401)>participation)continue;
      const baseSelected={density:clamp(.18+.81*wetness,0,.99),coverageProbability:participation};
      const environment=resolveVegetationEnvironment(ecology.world.x,ecology.world.z);
      append('REED_WET_MARGIN',baseSelected,ecology,environment,baseSeed,hydroRow,hydroColumn,'-wetfield0');
      for(let i=1;i<=HYDROLOGY_CORE.maxSatellites;i++){
        const satelliteProbability=participation*clamp(wetness*(1.08-.12*i),0,1);
        if(rand(baseSeed,401+i)>satelliteProbability)continue;
        const angle=TAU*rand(baseSeed,451+i),radius=HYDROLOGY_CORE.satelliteRadius*(.55+.55*rand(baseSeed,501+i));
        const satellite=sampleCanonicalVegetationEcology(ecology.world.x+Math.cos(angle)*radius,ecology.world.z+Math.sin(angle)*radius);
        if(satellite?.valid!==true||satellite.hydrology?.drainageClass!=='LAND'||satellite.shorelineDistance<2||!['LEVEL','GENTLE','MODERATE'].includes(satellite.slopeClass))continue;
        const satelliteEnvironment=resolveVegetationEnvironment(satellite.world.x,satellite.world.z);
        append('REED_WET_MARGIN',baseSelected,satellite,satelliteEnvironment,hash32(baseSeed^Math.imul(i+1,0x45d9f3b)),hydroRow,hydroColumn,`-wetfield${i}`);
      }
    }
  }
  return freeze({schema:'MIRRORLAND_VEGETATION_V4_UNDERSTORY_POPULATION_v1',operationId:V4_UNDERSTORY_CONTRACT.operationId,stage:V4_UNDERSTORY_CONTRACT.stage,targetBoundary:V4_UNDERSTORY_CONTRACT.targetBoundary,canonicalPopulation:true,standEdgeCompositionBound:true,deviceInvariant:true,cameraInvariant:true,frameId:trees.frameId,envelope:freeze({...envelope}),grid:GRID,instanceCount:instances.length,classCounts:freeze(classCounts),zoneCounts:freeze(zoneCounts),standClassCounts:freeze(standClassCounts),instances:freeze(instances)});
}
export function buildCanonicalUnderstoryPopulation(){if(!cachedPopulation)cachedPopulation=createUnderstoryPopulation();return cachedPopulation;}
export function getCanonicalUnderstoryPopulation(_presentationContext=undefined){return buildCanonicalUnderstoryPopulation();}
function compile(gl,type,source){const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw new Error(`UNDERSTORY_SHADER:${gl.getShaderInfoLog(shader)}`);return shader;}
function createProgram(gl,vs,fs){const program=gl.createProgram();gl.attachShader(program,compile(gl,gl.VERTEX_SHADER,vs));gl.attachShader(program,compile(gl,gl.FRAGMENT_SHADER,fs));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(`UNDERSTORY_PROGRAM:${gl.getProgramInfoLog(program)}`);return program;}
const VS=`#version 300 es\nprecision highp float;layout(location=0) in vec3 aLocal;layout(location=1) in vec3 aWorld;layout(location=2) in float aScale;layout(location=3) in float aYaw;uniform mat4 uVP;uniform vec3 uEye;uniform float uFar;out float vFade;out float vHeight;void main(){float c=cos(aYaw),s=sin(aYaw);vec3 local=vec3(aLocal.x*c-aLocal.z*s,aLocal.y,aLocal.x*s+aLocal.z*c)*aScale;vec3 world=aWorld+local;float d=distance(world,uEye);vFade=1.0-smoothstep(uFar*.76,uFar,d);vHeight=clamp(aLocal.y,0.0,1.0);gl_Position=uVP*vec4(world,1.0);}`;
const FS=`#version 300 es\nprecision highp float;in float vFade;in float vHeight;uniform vec3 uTint;out vec4 outColor;void main(){if(vFade<.04)discard;vec3 c=uTint*(.76+.18*vHeight+.06*vFade);outColor=vec4(c,1.0);}`;
const GEOMETRY=freeze({GRASS_SEDGE:new Float32Array([-.09,0,0,.09,0,0,0,1.05,0,0,0,-.09,0,0,.09,0,.92,0,-.22,0,.08,-.06,0,.08,-.12,.76,.04]),LOW_SHRUB:new Float32Array([-.62,0,0,.62,0,0,0,.80,0,0,0,-.56,0,0,.56,0,.76,0,-.44,.14,-.32,.44,.14,.32,0,.90,0]),SAPLING_YOUNG_GROWTH:new Float32Array([-.055,0,0,.055,0,0,.04,.90,0,-.42,.66,0,.42,.66,0,0,1.55,0,0,.68,-.38,0,.68,.38,0,1.42,0]),REED_WET_MARGIN:new Float32Array([-.045,0,-.24,.045,0,-.24,0,1.38,-.18,-.045,0,0,.045,0,0,0,1.62,.04,-.045,0,.24,.045,0,.24,0,1.26,.28]),DEAD_SPARSE_GROUND:new Float32Array([-.03,0,-.26,.03,0,-.26,0,1.14,-.14,-.03,0,.18,.03,0,.18,.14,.86,.10,-.28,0,.03,-.20,0,.03,-.06,.64,.05]),FOREST_FLOOR_CLUSTER:new Float32Array([-2.236,0,0,2.236,0,0,0,.38,.052,0,0,-2.028,0,0,2.028,.052,.34,0,-1.716,0,-1.144,1.716,0,1.144,0,.42,0])});
const TINT=freeze({GRASS_SEDGE:freeze([.105,.205,.145]),LOW_SHRUB:freeze([.075,.155,.105]),SAPLING_YOUNG_GROWTH:freeze([.085,.175,.115]),REED_WET_MARGIN:freeze([.11,.27,.19]),DEAD_SPARSE_GROUND:freeze([.19,.17,.135]),FOREST_FLOOR_CLUSTER:freeze([.065,.125,.085])});
function eyeVector(eye){if(Array.isArray(eye)&&eye.length>=3)return eye;if(eye&&Number.isFinite(eye.x)&&Number.isFinite(eye.y)&&Number.isFinite(eye.z))return [eye.x,eye.y,eye.z];throw new Error('UNDERSTORY_CAMERA_EYE_REQUIRED');}
function makePrimitive(gl,geometry,instances){const vao=gl.createVertexArray();gl.bindVertexArray(vao);const local=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,local);gl.bufferData(gl.ARRAY_BUFFER,geometry,gl.STATIC_DRAW);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,12,0);const payload=[];for(const item of instances)payload.push(item.world.x,item.world.y,item.world.z,item.scale,item.yaw);const instanceBuffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,instanceBuffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(payload),gl.STATIC_DRAW);gl.enableVertexAttribArray(1);gl.vertexAttribPointer(1,3,gl.FLOAT,false,20,0);gl.vertexAttribDivisor(1,1);gl.enableVertexAttribArray(2);gl.vertexAttribPointer(2,1,gl.FLOAT,false,20,12);gl.vertexAttribDivisor(2,1);gl.enableVertexAttribArray(3);gl.vertexAttribPointer(3,1,gl.FLOAT,false,20,16);gl.vertexAttribDivisor(3,1);gl.bindVertexArray(null);return{vao,vertexCount:geometry.length/3,instanceCount:instances.length};}
export function createUnderstoryRenderer(gl,{compact=false}={}){if(!gl||typeof gl.drawArraysInstanced!=='function')throw new Error('WEBGL2_INSTANCING_REQUIRED');const population=getCanonicalUnderstoryPopulation(),visible=population.instances.filter(item=>!compact||item.presentationSample<V4_UNDERSTORY_CONTRACT.compactPresentationSampling),groups=Object.fromEntries(UNDERSTORY_CLASSES.map(type=>[type,visible.filter(item=>item.type===type)])),primitives=Object.fromEntries(UNDERSTORY_CLASSES.map(type=>[type,makePrimitive(gl,GEOMETRY[type],groups[type])])),shader=createProgram(gl,VS,FS),uVP=gl.getUniformLocation(shader,'uVP'),uEye=gl.getUniformLocation(shader,'uEye'),uFar=gl.getUniformLocation(shader,'uFar'),uTint=gl.getUniformLocation(shader,'uTint');return freeze({schema:'MIRRORLAND_VEGETATION_V4_UNDERSTORY_RENDERER_v1',canonicalPopulation:population,compact:Boolean(compact),presentationCount:visible.length,draw({vp,eye}){if(!vp||vp.length!==16)throw new Error('UNDERSTORY_VP_REQUIRED');const e=eyeVector(eye);gl.useProgram(shader);gl.uniformMatrix4fv(uVP,false,vp);gl.uniform3f(uEye,e[0],e[1],e[2]);gl.uniform1f(uFar,compact?1900:2500);let drawCalls=0,instancesDrawn=0;for(const type of UNDERSTORY_CLASSES){const primitive=primitives[type];if(!primitive.instanceCount)continue;gl.uniform3fv(uTint,TINT[type]);gl.bindVertexArray(primitive.vao);gl.drawArraysInstanced(gl.TRIANGLES,0,primitive.vertexCount,primitive.instanceCount);drawCalls++;instancesDrawn+=primitive.instanceCount;}gl.bindVertexArray(null);return freeze({drawCalls,instancesDrawn,canonicalPopulationCount:population.instanceCount});}});}
