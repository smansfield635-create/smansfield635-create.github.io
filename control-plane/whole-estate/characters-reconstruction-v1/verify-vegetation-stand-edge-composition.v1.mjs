import fs from 'node:fs';
import crypto from 'node:crypto';
import {execFileSync,spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
process.chdir(ROOT);
const contract=JSON.parse(fs.readFileSync('control-plane/whole-estate/characters-reconstruction-v1/vegetation-stand-edge-composition-contract.v1.json','utf8'));
const outputArg=process.argv.indexOf('--output');
const outputPath=outputArg>=0?process.argv[outputArg+1]:null;
const checks=[];
const failures=[];
const check=(id,pass,details={})=>{
  const row={id,pass:Boolean(pass),details};
  checks.push(row);
  if(!row.pass)failures.push(row);
  return row.pass;
};
const finite=n=>typeof n==='number'&&Number.isFinite(n);
const close=(a,b,t=1e-6)=>finite(a)&&finite(b)&&Math.abs(a-b)<=t;
const digest=value=>crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
const git=(...args)=>execFileSync('git',args,{encoding:'utf8'}).trim();
const coefficientOfVariation=values=>{
  const xs=values.filter(finite);
  if(xs.length<2)return 0;
  const mean=xs.reduce((a,b)=>a+b,0)/xs.length;
  if(mean===0)return 0;
  const variance=xs.reduce((sum,x)=>sum+(x-mean)**2,0)/xs.length;
  return Math.sqrt(variance)/mean;
};

const exactHead=git('rev-parse','HEAD^{commit}');
let lineage=false;
try{execFileSync('git',['merge-base','--is-ancestor',contract.governingHead,exactHead],{stdio:'ignore'});lineage=true;}catch{}
check('EXACT_GOVERNING_HEAD_LINEAGE',lineage,{exactHead,governingHead:contract.governingHead});

const changed=git('diff','--name-only',`${contract.governingHead}...${exactHead}`).split('\n').filter(Boolean);
const allowed=new Set([
  'characters/vegetation-stand-topology.mjs',
  'characters/vegetation-composition.mjs',
  'characters/vegetation-edge-ecology.mjs',
  'characters/vegetation-population.mjs',
  'characters/vegetation-understory.mjs',
  'control-plane/whole-estate/characters-reconstruction-v1/vegetation-stand-edge-composition-contract.v1.json',
  'control-plane/whole-estate/characters-reconstruction-v1/verify-vegetation-stand-edge-composition.v1.mjs',
  '.github/workflows/characters-vegetation-stand-edge-composition-v1.yml'
]);
const outOfScope=changed.filter(file=>!allowed.has(file));
check('PATH_SCOPE_ONLY',outOfScope.length===0,{changed,outOfScope});

const representationPath=contract.v5Substrate.path;
const representationBlob=git('hash-object',representationPath);
check('V5_REPRESENTATION_BLOB_BYTE_IDENTICAL',representationBlob===contract.v5Substrate.requiredGitBlobSha,{expected:contract.v5Substrate.requiredGitBlobSha,actual:representationBlob});

const [standMod,compositionMod,edgeMod,populationMod,understoryMod,representationMod,step9Mod]=await Promise.all([
  import('../../../characters/vegetation-stand-topology.mjs'),
  import('../../../characters/vegetation-composition.mjs'),
  import('../../../characters/vegetation-edge-ecology.mjs'),
  import('../../../characters/vegetation-population.mjs'),
  import('../../../characters/vegetation-understory.mjs'),
  import('../../../characters/vegetation-representation.mjs'),
  import('../../../characters/step9-regional-geography.mjs')
]);

const seedsA=standMod.getStandTopologySeeds();
const seedsB=standMod.getStandTopologySeeds();
check('STAND_TOPOLOGY_DETERMINISTIC',digest(seedsA)===digest(seedsB)&&seedsA.length>=contract.antiFalsePass.minimumOccupiedStandCount,{seedCount:seedsA.length,digest:digest(seedsA)});
check('STAND_CLASSES_DECLARED_EXACT',contract.standClasses.every(c=>standMod.STAND_CLASSES.includes(c))&&standMod.STAND_CLASSES.every(c=>contract.standClasses.includes(c)),{standClasses:standMod.STAND_CLASSES});

const territories=compositionMod.getCompositionTerritories();
const bySite=new Map(territories.map(t=>[t.siteId,t]));
const missingRequiredSites=contract.composition.requiredSiteIds.filter(id=>!bySite.has(id));
check('COMPOSITION_REQUIRED_TERRITORIES_PRESENT',missingRequiredSites.length===0,{territoryCount:territories.length,missingRequiredSites});
let derivedAnchors=true;
const anchorDiagnostics=[];
for(const territory of territories){
  const site=step9Mod.resolveStep9Site(territory.siteId);
  const camera=step9Mod.resolveStep9Camera(territory.siteId);
  const anchorOk=close(territory.anchor.x,site.world.x)&&close(territory.anchor.z,site.world.z);
  const eyeOk=close(territory.cameraEye.x,camera.eye.x)&&close(territory.cameraEye.z,camera.eye.z);
  const structureOk=territory.anchorSource==='STEP9_SITE_AND_CAMERA'&&territory.featherRadius>territory.hardRadius&&territory.corridor?.featherHalfWidth>territory.corridor?.hardHalfWidth;
  if(!(anchorOk&&eyeOk&&structureOk))derivedAnchors=false;
  anchorDiagnostics.push({siteId:territory.siteId,anchorOk,eyeOk,structureOk});
}
check('COMPOSITION_ANCHORS_DERIVE_FROM_CANONICAL_SITE_CAMERA_AUTHORITY',derivedAnchors,{anchorDiagnostics});

const population=populationMod.getCanonicalVegetationPopulation();
check('CANOPY_COUNT_EXACTLY_818',population.instanceCount===contract.population.exactBudget,{instanceCount:population.instanceCount});
const uniqueIds=new Set(population.instances.map(x=>x.id));
check('CANOPY_IDS_UNIQUE',uniqueIds.size===population.instanceCount,{uniqueIds:uniqueIds.size});
const validStandIds=new Set(seedsA.map(s=>s.id));
const badStand=population.instances.filter(x=>!x.standId||!validStandIds.has(x.standId));
check('EVERY_TREE_HAS_ONE_STAND_ID',badStand.length===0,{badCount:badStand.length});
const validZones=new Set(contract.spatialZones);
const badZone=population.instances.filter(x=>!validZones.has(x.spatialZone));
check('EVERY_TREE_HAS_VALID_ZONE',badZone.length===0,{badCount:badZone.length});
const openingCanopy=population.instances.filter(x=>x.spatialZone==='OPENING'||compositionMod.resolveCompositionAt(x.world.x,x.world.z).hardOpen===true);
check('HARD_OPEN_CORES_HAVE_ZERO_CANOPY',openingCanopy.length===0,{openingCanopy:openingCanopy.map(x=>x.id).slice(0,20)});

const freshScript=`import crypto from 'node:crypto';const {getCanonicalVegetationPopulation}=await import('./characters/vegetation-population.mjs');const p=getCanonicalVegetationPopulation();const v=p.instances.map(x=>[x.id,x.world.x,x.world.y,x.world.z,x.standId,x.standClass,x.spatialZone,x.compositionTerritoryId||null]);process.stdout.write(crypto.createHash('sha256').update(JSON.stringify(v)).digest('hex'));`;
const fresh=spawnSync(process.execPath,['--input-type=module','-e',freshScript],{cwd:ROOT,encoding:'utf8'});
const localPopulationDigest=digest(population.instances.map(x=>[x.id,x.world.x,x.world.y,x.world.z,x.standId,x.standClass,x.spatialZone,x.compositionTerritoryId||null]));
check('POPULATION_FRESH_PROCESS_DETERMINISTIC',fresh.status===0&&fresh.stdout.trim()===localPopulationDigest,{status:fresh.status,stderr:fresh.stderr?.trim(),expected:localPopulationDigest,actual:fresh.stdout?.trim()});
const deviceA=populationMod.getCanonicalVegetationPopulation({deviceClass:'desktop',camera:{eye:{x:0,y:0,z:0}}});
const deviceB=populationMod.getCanonicalVegetationPopulation({deviceClass:'mobile',camera:{eye:{x:999,y:999,z:999}}});
check('POPULATION_DEVICE_CAMERA_INVARIANT',deviceA===deviceB&&digest(deviceA.instances)===digest(deviceB.instances),{});

const diag=population.diagnostics||{};
const standCandidate=diag.standCandidateCounts||{};
const standSelected=diag.standSelectedCounts||{};
const zoneCandidate=diag.zoneCandidateCounts||{};
const zoneSelected=diag.zoneSelectedCounts||{};
const selectedStandIds=Object.entries(standSelected).filter(([,n])=>n>0).map(([id])=>id);
const selectedClasses=new Set(population.instances.map(x=>x.standClass));
check('MINIMUM_OCCUPIED_STAND_COUNT',selectedStandIds.length>=contract.antiFalsePass.minimumOccupiedStandCount,{selectedStandCount:selectedStandIds.length});
check('MINIMUM_OCCUPIED_STAND_CLASS_COUNT',selectedClasses.size>=contract.antiFalsePass.minimumOccupiedStandClassCount,{selectedClasses:[...selectedClasses]});
const nonInterior=(zoneSelected.EDGE||0)+(zoneSelected.TRANSITION||0);
const nonInteriorFraction=population.instanceCount?nonInterior/population.instanceCount:0;
check('NON_INTERIOR_CANOPY_FRACTION',nonInteriorFraction>=contract.antiFalsePass.minimumNonInteriorCanopyFraction,{nonInteriorFraction,zoneSelected});
const densityFor=(selected,candidate)=>candidate>0?selected/candidate:0;
const interiorDensity=densityFor(zoneSelected.INTERIOR||0,zoneCandidate.INTERIOR||0);
const transitionDensity=densityFor(zoneSelected.TRANSITION||0,zoneCandidate.TRANSITION||0);
const interiorTransitionRatio=transitionDensity>0?interiorDensity/transitionDensity:Infinity;
check('EDGE_INTERIOR_DENSITY_NOT_EFFECTIVELY_FLAT',interiorTransitionRatio>=contract.antiFalsePass.minimumInteriorToTransitionDensityRatio,{interiorDensity,transitionDensity,interiorTransitionRatio,zoneCandidate,zoneSelected});
const standDensities=Object.keys(standCandidate).filter(id=>(standCandidate[id]||0)>=5).map(id=>densityFor(standSelected[id]||0,standCandidate[id]||0));
const standCv=coefficientOfVariation(standDensities);
check('STAND_DENSITY_NOT_EFFECTIVELY_FLAT',standCv>=contract.antiFalsePass.minimumStandDensityCoefficientOfVariation,{standCv,standDensities});

const featherCandidates=population.diagnostics?.compositionFeatherCandidateCount||0;
const featherSelected=population.diagnostics?.compositionFeatherSelectedCount||0;
const compatibleInteriorCandidates=population.diagnostics?.compatibleInteriorCandidateCount||0;
const compatibleInteriorSelected=population.diagnostics?.compatibleInteriorSelectedCount||0;
const featherDensity=densityFor(featherSelected,featherCandidates);
const compatibleInteriorDensity=densityFor(compatibleInteriorSelected,compatibleInteriorCandidates);
check('FEATHER_BANDS_REDUCE_CANOPY_RELATIVE_TO_COMPATIBLE_INTERIORS',featherCandidates===0||compatibleInteriorCandidates===0||featherDensity<compatibleInteriorDensity,{featherCandidates,featherSelected,featherDensity,compatibleInteriorCandidates,compatibleInteriorSelected,compatibleInteriorDensity});

const understory=understoryMod.getCanonicalUnderstoryPopulation();
const understoryBad=understory.instances.filter(x=>!x.standId||!validZones.has(x.spatialZone));
check('UNDERSTORY_CONSUMES_STAND_AND_ZONE_STATE',understoryBad.length===0&&understory.standEdgeCompositionBound===true,{badCount:understoryBad.length,standEdgeCompositionBound:understory.standEdgeCompositionBound});
const prohibitedOpeningGrowth=understory.instances.filter(x=>x.spatialZone==='OPENING'&&['LOW_SHRUB','SAPLING_YOUNG_GROWTH'].includes(x.type));
check('OPENING_SUPPRESSES_SHRUB_AND_SAPLING',prohibitedOpeningGrowth.length===0,{count:prohibitedOpeningGrowth.length});
check('HYDROLOGY_SPECIFIC_UNDERSTORY_PRESERVED',(understory.classCounts?.REED_WET_MARGIN||0)>0,{classCounts:understory.classCounts});
const edgeYoung=understory.instances.filter(x=>x.spatialZone==='EDGE'&&['LOW_SHRUB','SAPLING_YOUNG_GROWTH'].includes(x.type)).length;
const interiorYoung=understory.instances.filter(x=>x.spatialZone==='INTERIOR'&&['LOW_SHRUB','SAPLING_YOUNG_GROWTH'].includes(x.type)).length;
const edgeTotal=understory.zoneCounts?.EDGE||0;
const interiorTotal=understory.zoneCounts?.INTERIOR||0;
const edgeYoungRate=edgeTotal?edgeYoung/edgeTotal:0;
const interiorYoungRate=interiorTotal?interiorYoung/interiorTotal:0;
check('EDGE_FAVORS_YOUNG_GROWTH_RELATIVE_TO_INTERIOR',edgeTotal===0||edgeYoungRate>interiorYoungRate,{edgeYoungRate,interiorYoungRate,edgeYoung,interiorYoung,edgeTotal,interiorTotal});

const frame=representationMod.buildVegetationRepresentationFrame({camera:{eye:{x:0,y:260,z:620},look:{x:0,y:0,z:0}}});
check('V5_REPRESENTATION_COUNT_EQUALS_CANONICAL_POPULATION',frame.canonicalPopulationCount===contract.population.exactBudget&&frame.representationCount===contract.population.exactBudget,{canonicalPopulationCount:frame.canonicalPopulationCount,representationCount:frame.representationCount});
check('CAMERA_TRUE_LOD_PRESERVED',frame.lodAuthority==='CAMERA_DISTANCE'&&frame.hysteresisApplied===true&&new Set(frame.representations.map(x=>x.lod)).size>=2,{lodAuthority:frame.lodAuthority,hysteresisApplied:frame.hysteresisApplied,lods:[...new Set(frame.representations.map(x=>x.lod))]});
check('V5_CONTRACT_REMAINS_V5_ONLY',representationMod.HIERARCHICAL_FOLIAGE_V5_REPRESENTATION_CONTRACT.sharedWind===false&&representationMod.HIERARCHICAL_FOLIAGE_V5_REPRESENTATION_CONTRACT.foliageNightLighting===false,{});

const result=failures.length?'FAIL_CLOSED':'PASS_CLOSED';
const receipt={
  schema:'MIRRORLAND_STAND_EDGE_COMPOSITION_QUALIFICATION_RECEIPT_v1',
  operationId:contract.operationId,
  lockGeneration:contract.lockGeneration,
  result,
  boundary:result==='PASS_CLOSED'?contract.targetBoundary:'STAND_EDGE_COMPOSITION_MECHANICAL_FAIL_CLOSED',
  exactHead,
  governingHead:contract.governingHead,
  populationBudget:contract.population.exactBudget,
  populationCount:population.instanceCount,
  standSeedCount:seedsA.length,
  occupiedStandCount:selectedStandIds.length,
  occupiedStandClasses:[...selectedClasses].sort(),
  zoneCandidateCounts:zoneCandidate,
  zoneSelectedCounts:zoneSelected,
  standDensityCoefficientOfVariation:standCv,
  interiorTransitionDensityRatio,
  understoryCount:understory.instanceCount,
  representationBlob,
  representationCount:frame.representationCount,
  checkCount:checks.length,
  passCount:checks.filter(x=>x.pass).length,
  failCount:failures.length,
  checks,
  failures,
  v5RepresentationPreserved:representationBlob===contract.v5Substrate.requiredGitBlobSha,
  mergeDeploymentPublicationAuthorized:false,
  v6PlusAuthorized:false
};
receipt.receiptDigest=crypto.createHash('sha256').update(JSON.stringify(receipt)).digest('hex');
if(outputPath)fs.writeFileSync(outputPath,JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify(receipt,null,2));
if(failures.length)process.exitCode=1;
